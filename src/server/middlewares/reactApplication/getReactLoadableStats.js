import appRootDir from 'app-root-dir'
import fs from 'fs'
import { resolve as pathResolve } from 'path'
import config from '../../../../config'

let resultCache

export default function () {
  if (resultCache) return resultCache

  const statsFilePath = pathResolve(
    appRootDir.get(),
    config('bundles.client.outputPath'),
    `./${config('webpackStatsFileName')}`,
  )

  resultCache = JSON.parse(fs.readFileSync(statsFilePath, 'utf8'))

  return resultCache
}
