import { resolve } from 'path'

import { Optimizer } from '@parcel/plugin'
import { config } from 'dotenv'

const nodeEnv = process.env.NODE_ENV
const isProduction = nodeEnv === 'production'
let envs = process.env

if (!isProduction) {
  const result = config({ path: !!process.env.DOTENV_FILE ? process.env.DOTENV_FILE : resolve(process.cwd(), './.env') })
  if (result.parsed) {
    envs = { NODE_ENV: nodeEnv, ...result.parsed }
  }
}
// (\s*={2,3}|[^\w\d\$_\-"']|$|)
export const optimize = async ({ contents, map }) => {
  let fileContent = contents as string

  // replace possible global(This) usages of process.env
  fileContent = fileContent.replace(/(^|[^\.|\w|\$|-])(global(This)?\.)?process\.env(\['NODE_ENV'\]|\["NODE_ENV"\]|\.NODE_ENV)(\s*(={2,3}|!={1,2}|\)|\}|;|'|"|`|,|\?|\]|$|:|\s+[^=]))/g, `$1"${envs.NODE_ENV}"$5`)

  const testAppendix = '(\\s*(={2,3}|!={1,2}|\\)|\\}|;|\'|"|`|,|\\?|\\]|$|:|\\s+[^=]))'
  const testPrefix = '(^|[^\\.|\\w|\\$|-])process\\.env'

  // replace all other process.envs
  Object.keys(envs).forEach((ENV_KEY) => {
    const regex = new RegExp(`${testPrefix}\\.${ENV_KEY}${testAppendix}`, 'g')
    fileContent = fileContent.replace(regex, `$1"${process.env[ENV_KEY]}"$2`)
    const regex2 = new RegExp(`${testPrefix}\\["${ENV_KEY}"\\]${testAppendix}`, 'g')
    fileContent = fileContent.replace(regex2, `$1"${process.env[ENV_KEY]}"$2`)
    const regex3 = new RegExp(`${testPrefix}\\['${ENV_KEY}'\\]${testAppendix}`, 'g')
    fileContent = fileContent.replace(regex3, `$1"${process.env[ENV_KEY]}"$2`)
  })

  return { contents: fileContent, map }
}

export default new Optimizer({optimize})
