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
      const containsEnv = contents.indexOf(ENV_KEY) > -1

      if (containsEnv) {
        contents = contents.replace(new RegExp(`process.env.${ENV_KEY}`, 'g'), `"${process.env[ENV_KEY]}"`)
        contents = contents.replace(new RegExp(`process.env[${ENV_KEY}]`, 'g'), `"${process.env[ENV_KEY]}"`)
      }
    })

    return { contents, map }
  }
})
