import { resolve } from 'path'

import { Optimizer } from '@parcel/plugin'
import { config } from 'dotenv'

const isProduction = process.env.NODE_ENV === 'production'

if (!isProduction) {
  config({ path: !!process.env.DOTENV_FILE ? process.env.DOTENV_FILE : resolve(process.cwd(), './.env') })
}

export default new Optimizer({
  async optimize({ contents, map }) {
    Object.keys(process.env).forEach((ENV_KEY) => {
      const namedRegex = new RegExp(`process.env.${ENV_KEY}(?!(\\s*=|_|-|\\w|\\d))`, 'g')
      const unnamedRegex = new RegExp(`process.env[${ENV_KEY}](?!(\\s*=|_|-|\\w|\\d))`, 'g')
      const containsEnv = namedRegex.test(contents) || unnamedRegex.test(contents)

      if (containsEnv) {
        contents = contents.replace(namedRegex, `"${process.env[ENV_KEY]}"$1`)
        contents = contents.replace(unnamedRegex, `"${process.env[ENV_KEY]}"$1`)
      }
    })

    return { contents, map }
  }
})
