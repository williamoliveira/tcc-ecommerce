import PropTypes from 'prop-types'
import React, { Children } from 'react'
import serialize from 'serialize-javascript'
import config from '../../../../config'
import ClientConfig from '../../../../internal/components/ClientConfig'
import HTML from '../../../../internal/components/HTML'
import clean from '../../../app/utils/arrays/clean'
import ifElse from '../../../app/utils/logic/ifElse'
import getClientBundleEntryAssets from './getClientBundleEntryAssets'

function KeyedComponent({ children }) {
  return Children.only(children)
}

const clientEntryAssets = getClientBundleEntryAssets()

function stylesheetTag(stylesheetFilePath) {
  return (
    <link
      href={stylesheetFilePath}
      media="screen, projection"
      rel="stylesheet"
      type="text/css"
    />
  )
}

function scriptTag(jsFilePath) {
  return <script type="text/javascript" src={jsFilePath} />
}

function ServerHTML(props) {
  const {
    asyncComponentsState,
    appState,
    helmet,
    nonce,
    reactAppString,
    children,
    bundles,
  } = props

  const inlineScript = body => (
    <script
      nonce={nonce}
      type="text/javascript"
      dangerouslySetInnerHTML={{ __html: body }}
    />
  )

  const headerElements = clean([
    ...ifElse(helmet)(() => helmet.title.toComponent(), []),
    ...ifElse(helmet)(() => helmet.base.toComponent(), []),
    ...ifElse(helmet)(() => helmet.meta.toComponent(), []),
    ...ifElse(helmet)(() => helmet.link.toComponent(), []),
    stylesheetTag(clientEntryAssets.index.css),
    ...bundles.css.map(bundle => stylesheetTag(bundle)),
    ...ifElse(helmet)(() => helmet.style.toComponent(), []),
  ])

  const bodyElements = clean([
    ifElse(!config('disableCSR'))(() => <ClientConfig nonce={nonce} config={config()} />),
    ifElse(!config('disableCSR') && asyncComponentsState)(() =>
      inlineScript(
        `window.__ASYNC_COMPONENTS_REHYDRATE_STATE__=${serialize(asyncComponentsState)};`,
      ),
    ),
    ifElse(!config('disableCSR') && appState)(() =>
      inlineScript(`window.__APP_REHYDRATE_STATE__=${serialize(appState)};`),
    ),
    ifElse(!config('disableCSR') && config('polyfillIO.enabled'))(() =>
      scriptTag(
        `${config('polyfillIO.url')}?features=${config('polyfillIO.features').join(',')}`,
      ),
    ),
    ifElse(
      !config('disableCSR') &&
        process.env.BUILD_FLAG_IS_DEV === 'true' &&
        config('bundles.client.devVendorDLL.enabled'),
    )(() =>
      scriptTag(
        `${config('bundles.client.webPath')}${config(
          'bundles.client.devVendorDLL.name',
        )}.js?t=${Date.now()}`,
      ),
    ),
    scriptTag(clientEntryAssets.runtime.js),
    ...ifElse(!config('disableCSR'))(() => bundles.js.map(bundle => scriptTag(bundle))),
    ifElse(!config('disableCSR'))(() => scriptTag(clientEntryAssets.index.js)),
    ...ifElse(helmet)(() => helmet.script.toComponent(), []),
  ])

  return (
    <HTML
      htmlAttributes={ifElse(helmet)(() => helmet.htmlAttributes.toComponent(), null)}
      headerElements={headerElements.map((x, idx) => (
        <KeyedComponent key={idx}>{x}</KeyedComponent>
      ))}
      bodyElements={bodyElements.map((x, idx) => (
        <KeyedComponent key={idx}>{x}</KeyedComponent>
      ))}
      appBodyString={reactAppString}
    >
      {children}
    </HTML>
  )
}

ServerHTML.propTypes = {
  asyncComponentsState: PropTypes.object,
  appState: PropTypes.object,
  helmet: PropTypes.object,
  nonce: PropTypes.string,
  reactAppString: PropTypes.string,
  children: PropTypes.node,
  bundles: PropTypes.object.isRequired,
}

export default ServerHTML
