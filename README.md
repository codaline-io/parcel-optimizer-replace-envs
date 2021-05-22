### Parcel v2 Optimizer to replace `process.env`s

- reads `.env` file when ` NODE_ENV` !== `production`
- replaces occurences of `process.env.X` with the value
