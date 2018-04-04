import { resolve as pathResolve } from 'path'
import appRootDir from 'app-root-dir'
import config from '../../../config'

function serviceWorkerMiddleware(req, res, next) {
  res.sendFile(
    pathResolve(
      appRootDir.get(),
      config('bundles.client.outputPath'),
      config('serviceWorker.fileName'),
    ),
  )
}

export default serviceWorkerMiddleware
