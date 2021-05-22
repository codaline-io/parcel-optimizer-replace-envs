import { resolve } from 'path'

import { Optimizer } from '@parcel/plugin'
import { config } from 'dotenv'

const isProduction = process.env.NODE_ENV === 'production'

if (isProduction) {
  console.info('Prod env: DO NOT Read dotenv file')
} else {
  console.info('Dev env: Read dotenv file')
  config({ path: resolve(process.cwd(), './.env') })
}

export default new Optimizer({
  async optimize({ bundle, contents, map }) {
    console.log(bundle)

    let somethingReplaced = false

    const ENVS_TO_REPLACE = {
      'process.env.APOLLO_KEY': process.env.APOLLO_KEY,
      'process.env.BUILD_VERSION': process.env.BUILD_VERSION,
      'process.env.SENTRY_DSN_BACKEND': process.env.SENTRY_DSN_BACKEND,
      'process.env.SENTRY_DSN_FRONTEND': process.env.SENTRY_DSN_FRONTEND
    }

    console.info('Replace build vars')
    Object.keys(ENVS_TO_REPLACE).forEach((ENV_KEY) => {
      const containsEnv = contents.indexOf(ENV_KEY) > -1

      if (containsEnv) {
        console.info(`Replace "${ENV_KEY}" with "${ENVS_TO_REPLACE[ENV_KEY]}"`)
        contents = contents.replace(new RegExp(ENV_KEY, 'g'), `"${ENVS_TO_REPLACE[ENV_KEY]}"`)
      }

      somethingReplaced = !somethingReplaced ? containsEnv : true
    })

    if (somethingReplaced) {
      console.info('Changed: ', bundle)
    } else {
      console.info('Nothing do to for: ', bundle)
    }

    return { contents, map }
  }
})
