export default (process.env.DISABLE_CODE_SPLITTING === 'true'
  ? require('./Site').default
  : require('./SiteAsync').default)
