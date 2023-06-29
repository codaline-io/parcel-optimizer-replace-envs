import { resolve } from 'path'

import { Optimizer } from '@parcel/plugin'
import { config } from 'dotenv'

const isProduction = process.env.NODE_ENV === 'production'

if (!isProduction) {
  config({ path: !!process.env.DOTENV_FILE ? process.env.DOTENV_FILE : resolve(process.cwd(), './.env') })
}

export default new Optimizer({
  async optimize({ contents, map, options }) {
    let fileContent = contents as string
    Object.keys(process.env).forEach((ENV_KEY) => {
      const namedRegex = new RegExp(`(globalThis.)?process.env.${ENV_KEY}(?!(\\s*=|_|-|\\w|\\d))`, 'g')
      const unnamedRegex = new RegExp(`(globalThis.)?process.env[${ENV_KEY}](?!(\\s*=|_|-|\\w|\\d))`, 'g')
      const containsEnv = namedRegex.test(fileContent) || unnamedRegex.test(fileContent)

      if (containsEnv) {
        fileContent = fileContent.replace(namedRegex, `"${process.env[ENV_KEY]}"$1`)
        fileContent = fileContent.replace(unnamedRegex, `"${process.env[ENV_KEY]}"$1`)
      }
    })

    return { contents: fileContent, map }
  }
})
