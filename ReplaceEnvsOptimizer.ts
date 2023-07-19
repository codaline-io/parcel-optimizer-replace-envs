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

    fileContent = fileContent.replace(/(\bglobal(This)?\.)?process\.env(\.NODE_ENV|\["NODE_ENV"\|\['NODE_ENV'\])\b(?!(\\s*=|_|-|\\w|\\d))\b/g, `"${process.env.NODE_ENV}"`)

    Object.keys(process.env).forEach((ENV_KEY) => {
      const regex = new RegExp(`process.env\\.${ENV_KEY}(?!(\\s*=|_|-|\\w|\\d))`, 'g')
      fileContent = fileContent.replace(regex, `"${process.env[ENV_KEY]}"`)
      const regex2 = new RegExp(`process.env\\["${ENV_KEY}"\\](?!(\\s*=|_|-|\\w|\\d))`, 'g')
      fileContent = fileContent.replace(regex2, `"${process.env[ENV_KEY]}"`)
      const regex3 = new RegExp(`process.env\\['${ENV_KEY}'\\](?!(\\s*=|_|-|\\w|\\d))`, 'g')
      fileContent = fileContent.replace(regex3, `"${process.env[ENV_KEY]}"`)
    })

    return { contents: fileContent, map }
  }
})
