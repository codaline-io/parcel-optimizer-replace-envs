### Parcel v2 Optimizer to replace `process.env`s

- reads `.env` file when ` NODE_ENV` !== `production`, default `process.cwd() + '.env'` (full path can be overwritten by setting `DOTENV_FILE` - how ironic :D)
- replaces occurences of `process.env.X` with the value

### How it works

- somehow hacky, because as an optimizer it just uses a dumb regex to replace all `process.env` with its values