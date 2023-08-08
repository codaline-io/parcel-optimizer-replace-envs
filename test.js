const test = require('ava').default

process.env.NODE_ENV = 'test'
process.env.NODE_ENV_EXTENDED = 'extended'
process.env.TEST = 'ASDF'

const optimize = require('./lib/ReplaceEnvsOptimizer.js').optimize

test('optimizer returns correct replaced envs with globalThis and .', async (t) => {
  t.is((await optimize({ contents: 'globalThis.process.env.NODE_ENV', map: {} })).contents, '"test"')
  t.is((await optimize({ contents: 'test globalThis.process.env.NODE_ENV a', map: {} })).contents, 'test "test" a')
  t.is((await optimize({ contents: 'globalThis.process.env.NODE_ENV = "production"', map: {} })).contents, 'globalThis.process.env.NODE_ENV = "production"')
  t.is((await optimize({ contents: 'globalThis.process.env.NODE_ENV="production"', map: {} })).contents, 'globalThis.process.env.NODE_ENV="production"')
  t.is((await optimize({ contents: 'globalThis.process.env.NODE_ENV == "production"', map: {} })).contents, '"test" == "production"')
  t.is((await optimize({ contents: 'globalThis.process.env.NODE_ENV === "production"', map: {} })).contents, '"test" === "production"')
  t.is((await optimize({ contents: 'globalThis.process.env.NODE_ENV != "production"', map: {} })).contents, '"test" != "production"')
  t.is((await optimize({ contents: 'globalThis.process.env.NODE_ENV !== "production"', map: {} })).contents, '"test" !== "production"')
  t.is((await optimize({ contents: 'BLAglobalThis.process.env.NODE_ENVBLA', map: {} })).contents, 'BLAglobalThis.process.env.NODE_ENVBLA')
  t.is((await optimize({ contents: 'BLAglobalThis.process.env.NODE_ENV', map: {} })).contents, 'BLAglobalThis.process.env.NODE_ENV')

  t.is((await optimize({ contents: 'BEFORE process.env.NODE_ENV_EXTENDED BETWEEN globalThis.process.env.NODE_ENV BETWEEN process.env.TEST END', map: {} })).contents, 'BEFORE "extended" BETWEEN "test" BETWEEN "ASDF" END')
  t.is((await optimize({ contents: 'BEFORE process.env.NODE_ENV_EXTENDED BETWEEN globalThis.process.env.NODE_ENV process.env.TEST END', map: {} })).contents, 'BEFORE "extended" BETWEEN "test" "ASDF" END')
  t.is((await optimize({ contents: 'BEFORE process.env.NODE_ENV_EXTENDED globalThis.process.env.NODE_ENV process.env.TEST END', map: {} })).contents, 'BEFORE "extended" "test" "ASDF" END')
  t.is((await optimize({ contents: 'process.env.NODE_ENV_EXTENDED globalThis.process.env.NODE_ENV process.env.TEST END', map: {} })).contents, '"extended" "test" "ASDF" END')
  t.is((await optimize({ contents: 'process.env.NODE_ENV_EXTENDED globalThis.process.env.NODE_ENV process.env.TEST', map: {} })).contents, '"extended" "test" "ASDF"')

})

test('optimizer returns correct replaced envs with global and .', async (t) => {
  t.is((await optimize({ contents: 'global.process.env.NODE_ENV', map: {} })).contents, '"test"')
  t.is((await optimize({ contents: 'test global.process.env.NODE_ENV a', map: {} })).contents, 'test "test" a')
  t.is((await optimize({ contents: 'global.process.env.NODE_ENV = "production"', map: {} })).contents, 'global.process.env.NODE_ENV = "production"')
  t.is((await optimize({ contents: 'global.process.env.NODE_ENV="production"', map: {} })).contents, 'global.process.env.NODE_ENV="production"')
  t.is((await optimize({ contents: 'global.process.env.NODE_ENV == "production"', map: {} })).contents, '"test" == "production"')
  t.is((await optimize({ contents: 'global.process.env.NODE_ENV === "production"', map: {} })).contents, '"test" === "production"')
  t.is((await optimize({ contents: 'global.process.env.NODE_ENV != "production"', map: {} })).contents, '"test" != "production"')
  t.is((await optimize({ contents: 'global.process.env.NODE_ENV !== "production"', map: {} })).contents, '"test" !== "production"')
  t.is((await optimize({ contents: 'BLAglobal.process.env.NODE_ENVBLA', map: {} })).contents, 'BLAglobal.process.env.NODE_ENVBLA')
  t.is((await optimize({ contents: 'BLAglobal.process.env.NODE_ENV', map: {} })).contents, 'BLAglobal.process.env.NODE_ENV')

  t.is((await optimize({ contents: 'BEFORE process.env.NODE_ENV_EXTENDED BETWEEN global.process.env.NODE_ENV BETWEEN process.env.TEST END', map: {} })).contents, 'BEFORE "extended" BETWEEN "test" BETWEEN "ASDF" END')
  t.is((await optimize({ contents: 'BEFORE process.env.NODE_ENV_EXTENDED BETWEEN global.process.env.NODE_ENV process.env.TEST END', map: {} })).contents, 'BEFORE "extended" BETWEEN "test" "ASDF" END')
  t.is((await optimize({ contents: 'BEFORE process.env.NODE_ENV_EXTENDED global.process.env.NODE_ENV process.env.TEST END', map: {} })).contents, 'BEFORE "extended" "test" "ASDF" END')
  t.is((await optimize({ contents: 'process.env.NODE_ENV_EXTENDED global.process.env.NODE_ENV process.env.TEST END', map: {} })).contents, '"extended" "test" "ASDF" END')
  t.is((await optimize({ contents: 'process.env.NODE_ENV_EXTENDED global.process.env.NODE_ENV process.env.TEST', map: {} })).contents, '"extended" "test" "ASDF"')
})

test('optimizer returns correct replaced envs without global and .', async (t) => {
  t.is((await optimize({ contents: 'process.env.NODE_ENV', map: {} })).contents, '"test"')
  t.is((await optimize({ contents: 'test process.env.NODE_ENV a', map: {} })).contents, 'test "test" a')
  t.is((await optimize({ contents: 'process.env.NODE_ENV = "production"', map: {} })).contents, 'process.env.NODE_ENV = "production"')
  t.is((await optimize({ contents: 'process.env.NODE_ENV="production"', map: {} })).contents, 'process.env.NODE_ENV="production"')
  t.is((await optimize({ contents: 'process.env.NODE_ENV == "production"', map: {} })).contents, '"test" == "production"')
  t.is((await optimize({ contents: 'process.env.NODE_ENV === "production"', map: {} })).contents, '"test" === "production"')
  t.is((await optimize({ contents: 'process.env.NODE_ENV != "production"', map: {} })).contents, '"test" != "production"')
  t.is((await optimize({ contents: 'process.env.NODE_ENV !== "production"', map: {} })).contents, '"test" !== "production"')
  t.is((await optimize({ contents: 'BLAprocess.env.NODE_ENVBLA', map: {} })).contents, 'BLAprocess.env.NODE_ENVBLA')
  t.is((await optimize({ contents: 'BLAprocess.env.NODE_ENV', map: {} })).contents, 'BLAprocess.env.NODE_ENV')

  t.is((await optimize({ contents: 'BEFORE process.env.NODE_ENV_EXTENDED BETWEEN process.env.NODE_ENV BETWEEN process.env.TEST END', map: {} })).contents, 'BEFORE "extended" BETWEEN "test" BETWEEN "ASDF" END')
  t.is((await optimize({ contents: 'BEFORE process.env.NODE_ENV_EXTENDED BETWEEN process.env.NODE_ENV process.env.TEST END', map: {} })).contents, 'BEFORE "extended" BETWEEN "test" "ASDF" END')
  t.is((await optimize({ contents: 'BEFORE process.env.NODE_ENV_EXTENDED process.env.NODE_ENV process.env.TEST END', map: {} })).contents, 'BEFORE "extended" "test" "ASDF" END')
  t.is((await optimize({ contents: 'process.env.NODE_ENV_EXTENDED process.env.NODE_ENV process.env.TEST END', map: {} })).contents, '"extended" "test" "ASDF" END')
  t.is((await optimize({ contents: 'process.env.NODE_ENV_EXTENDED process.env.NODE_ENV process.env.TEST', map: {} })).contents, '"extended" "test" "ASDF"')
})

test('optimizer returns correct replaced envs with globalThis and [""]', async (t) => {
  t.is((await optimize({ contents: 'globalThis.process.env["NODE_ENV"]', map: {} })).contents, '"test"')
  t.is((await optimize({ contents: 'test globalThis.process.env["NODE_ENV"] a', map: {} })).contents, 'test "test" a')
  t.is((await optimize({ contents: 'globalThis.process.env["NODE_ENV"] = "production"', map: {} })).contents, 'globalThis.process.env["NODE_ENV"] = "production"')
  t.is((await optimize({ contents: 'globalThis.process.env["NODE_ENV"]="production"', map: {} })).contents, 'globalThis.process.env["NODE_ENV"]="production"')
  t.is((await optimize({ contents: 'globalThis.process.env["NODE_ENV"] == "production"', map: {} })).contents, '"test" == "production"')
  t.is((await optimize({ contents: 'globalThis.process.env["NODE_ENV"] === "production"', map: {} })).contents, '"test" === "production"')
  t.is((await optimize({ contents: 'globalThis.process.env["NODE_ENV"] != "production"', map: {} })).contents, '"test" != "production"')
  t.is((await optimize({ contents: 'globalThis.process.env["NODE_ENV"] !== "production"', map: {} })).contents, '"test" !== "production"')
  t.is((await optimize({ contents: 'BLAglobalThis.process.env["NODE_ENV"]BLA', map: {} })).contents, 'BLAglobalThis.process.env["NODE_ENV"]BLA')
  t.is((await optimize({ contents: 'BLAglobalThis.process.env["NODE_ENV"]', map: {} })).contents, 'BLAglobalThis.process.env["NODE_ENV"]')

  t.is((await optimize({ contents: 'BEFORE process.env["NODE_ENV_EXTENDED"] BETWEEN process.env["NODE_ENV"] BETWEEN process.env["TEST"] END', map: {} })).contents, 'BEFORE "extended" BETWEEN "test" BETWEEN "ASDF" END')
  t.is((await optimize({ contents: 'BEFORE process.env["NODE_ENV_EXTENDED"] BETWEEN process.env["NODE_ENV"] process.env["TEST"] END', map: {} })).contents, 'BEFORE "extended" BETWEEN "test" "ASDF" END')
  t.is((await optimize({ contents: 'BEFORE process.env["NODE_ENV_EXTENDED"] process.env["NODE_ENV"] process.env["TEST"] END', map: {} })).contents, 'BEFORE "extended" "test" "ASDF" END')
  t.is((await optimize({ contents: 'process.env["NODE_ENV_EXTENDED"] process.env["NODE_ENV"] process.env["TEST"] END', map: {} })).contents, '"extended" "test" "ASDF" END')
  t.is((await optimize({ contents: 'process.env["NODE_ENV_EXTENDED"] process.env["NODE_ENV"] process.env["TEST"]', map: {} })).contents, '"extended" "test" "ASDF"')
})

test('optimizer returns correct replaced envs with global and [""]', async (t) => {
  t.is((await optimize({ contents: 'global.process.env["NODE_ENV"]', map: {} })).contents, '"test"')
  t.is((await optimize({ contents: 'test global.process.env["NODE_ENV"] a', map: {} })).contents, 'test "test" a')
  t.is((await optimize({ contents: 'global.process.env["NODE_ENV"] = "production"', map: {} })).contents, 'global.process.env["NODE_ENV"] = "production"')
  t.is((await optimize({ contents: 'global.process.env["NODE_ENV"]="production"', map: {} })).contents, 'global.process.env["NODE_ENV"]="production"')
  t.is((await optimize({ contents: 'global.process.env["NODE_ENV"] == "production"', map: {} })).contents, '"test" == "production"')
  t.is((await optimize({ contents: 'global.process.env["NODE_ENV"] === "production"', map: {} })).contents, '"test" === "production"')
  t.is((await optimize({ contents: 'global.process.env["NODE_ENV"] != "production"', map: {} })).contents, '"test" != "production"')
  t.is((await optimize({ contents: 'global.process.env["NODE_ENV"] !== "production"', map: {} })).contents, '"test" !== "production"')
  t.is((await optimize({ contents: 'BLAglobal.process.env["NODE_ENV"]BLA', map: {} })).contents, 'BLAglobal.process.env["NODE_ENV"]BLA')
  t.is((await optimize({ contents: 'BLAglobal.process.env["NODE_ENV"]', map: {} })).contents, 'BLAglobal.process.env["NODE_ENV"]')
})

test('optimizer returns correct replaced envs without global and [""]', async (t) => {
  t.is((await optimize({ contents: `process.env["NODE_ENV"]`, map: {} })).contents, '"test"')
  t.is((await optimize({ contents: `test process.env["NODE_ENV"] a`, map: {} })).contents, 'test "test" a')
  t.is((await optimize({ contents: `process.env["NODE_ENV"] = "production"`, map: {} })).contents, `process.env["NODE_ENV"] = "production"`)
  t.is((await optimize({ contents: `process.env["NODE_ENV"]="production"`, map: {} })).contents, `process.env["NODE_ENV"]="production"`)
  t.is((await optimize({ contents: `process.env["NODE_ENV"] == "production"`, map: {} })).contents, '"test" == "production"')
  t.is((await optimize({ contents: `process.env["NODE_ENV"] === "production"`, map: {} })).contents, '"test" === "production"')
  t.is((await optimize({ contents: `process.env["NODE_ENV"] != "production"`, map: {} })).contents, '"test" != "production"')
  t.is((await optimize({ contents: `process.env["NODE_ENV"] !== "production"`, map: {} })).contents, '"test" !== "production"')
  t.is((await optimize({ contents: `BLAprocess.env["NODE_ENV"]BLA`, map: {} })).contents, 'BLAprocess.env["NODE_ENV"]BLA')
  t.is((await optimize({ contents: `BLAprocess.env["NODE_ENV"]`, map: {} })).contents, 'BLAprocess.env["NODE_ENV"]')
})

test(`optimizer returns correct replaced envs with globalThis and ['']`, async (t) => {
  t.is((await optimize({ contents: `globalThis.process.env['NODE_ENV']`, map: {} })).contents, '"test"')
  t.is((await optimize({ contents: `test globalThis.process.env['NODE_ENV'] a`, map: {} })).contents, 'test "test" a')
  t.is((await optimize({ contents: `globalThis.process.env['NODE_ENV'] = "production"`, map: {} })).contents, `globalThis.process.env['NODE_ENV'] = "production"`)
  t.is((await optimize({ contents: `globalThis.process.env['NODE_ENV']="production"`, map: {} })).contents, `globalThis.process.env['NODE_ENV']="production"`)
  t.is((await optimize({ contents: `globalThis.process.env['NODE_ENV'] == "production"`, map: {} })).contents, '"test" == "production"')
  t.is((await optimize({ contents: `globalThis.process.env['NODE_ENV'] === "production"`, map: {} })).contents, '"test" === "production"')
  t.is((await optimize({ contents: `globalThis.process.env['NODE_ENV'] != "production"`, map: {} })).contents, '"test" != "production"')
  t.is((await optimize({ contents: `globalThis.process.env['NODE_ENV'] !== "production"`, map: {} })).contents, '"test" !== "production"')
  t.is((await optimize({ contents: `BLAglobalThis.process.env['NODE_ENV']BLA`, map: {} })).contents, `BLAglobalThis.process.env['NODE_ENV']BLA`)
  t.is((await optimize({ contents: `BLAglobalThis.process.env['NODE_ENV']`, map: {} })).contents, `BLAglobalThis.process.env['NODE_ENV']`)

  t.is((await optimize({ contents: `BEFORE process.env['NODE_ENV_EXTENDED'] BETWEEN process.env['NODE_ENV'] BETWEEN process.env['TEST'] END`, map: {} })).contents, 'BEFORE "extended" BETWEEN "test" BETWEEN "ASDF" END')
  t.is((await optimize({ contents: `BEFORE process.env['NODE_ENV_EXTENDED'] BETWEEN process.env['NODE_ENV'] process.env['TEST'] END`, map: {} })).contents, 'BEFORE "extended" BETWEEN "test" "ASDF" END')
  t.is((await optimize({ contents: `BEFORE process.env['NODE_ENV_EXTENDED'] process.env['NODE_ENV'] process.env['TEST'] END`, map: {} })).contents, 'BEFORE "extended" "test" "ASDF" END')
  t.is((await optimize({ contents: `process.env['NODE_ENV_EXTENDED'] process.env['NODE_ENV'] process.env['TEST'] END`, map: {} })).contents, '"extended" "test" "ASDF" END')
  t.is((await optimize({ contents: `process.env['NODE_ENV_EXTENDED'] process.env['NODE_ENV'] process.env['TEST']`, map: {} })).contents, '"extended" "test" "ASDF"')
})

test(`optimizer returns correct replaced envs with global and ['']`, async (t) => {
  t.is((await optimize({ contents: `global.process.env['NODE_ENV']`, map: {} })).contents, '"test"')
  t.is((await optimize({ contents: `test global.process.env['NODE_ENV'] a`, map: {} })).contents, 'test "test" a')
  t.is((await optimize({ contents: `global.process.env['NODE_ENV'] = "production"`, map: {} })).contents, `global.process.env['NODE_ENV'] = "production"`)
  t.is((await optimize({ contents: `global.process.env['NODE_ENV']="production"`, map: {} })).contents, `global.process.env['NODE_ENV']="production"`)
  t.is((await optimize({ contents: `global.process.env['NODE_ENV'] == "production"`, map: {} })).contents, '"test" == "production"')
  t.is((await optimize({ contents: `global.process.env['NODE_ENV'] === "production"`, map: {} })).contents, '"test" === "production"')
  t.is((await optimize({ contents: `global.process.env['NODE_ENV'] != "production"`, map: {} })).contents, '"test" != "production"')
  t.is((await optimize({ contents: `global.process.env['NODE_ENV'] !== "production"`, map: {} })).contents, '"test" !== "production"')
  t.is((await optimize({ contents: `BLAglobal.process.env['NODE_ENV']BLA`, map: {} })).contents, `BLAglobal.process.env['NODE_ENV']BLA`)
  t.is((await optimize({ contents: `BLAglobal.process.env['NODE_ENV']`, map: {} })).contents, `BLAglobal.process.env['NODE_ENV']`)
})

test(`optimizer returns correct replaced envs without global and ['']`, async (t) => {
  t.is((await optimize({ contents: `process.env['NODE_ENV']`, map: {} })).contents, '"test"')
  t.is((await optimize({ contents: `test process.env['NODE_ENV'] a`, map: {} })).contents, 'test "test" a')
  t.is((await optimize({ contents: `process.env['NODE_ENV'] = "production"`, map: {} })).contents, `process.env['NODE_ENV'] = "production"`)
  t.is((await optimize({ contents: `process.env['NODE_ENV']="production"`, map: {} })).contents, `process.env['NODE_ENV']="production"`)
  t.is((await optimize({ contents: `process.env['NODE_ENV'] == "production"`, map: {} })).contents, '"test" == "production"')
  t.is((await optimize({ contents: `process.env['NODE_ENV'] === "production"`, map: {} })).contents, '"test" === "production"')
  t.is((await optimize({ contents: `process.env['NODE_ENV'] != "production"`, map: {} })).contents, '"test" != "production"')
  t.is((await optimize({ contents: `process.env['NODE_ENV'] !== "production"`, map: {} })).contents, '"test" !== "production"')
  t.is((await optimize({ contents: `BLAprocess.env['NODE_ENV']BLA`, map: {} })).contents, `BLAprocess.env['NODE_ENV']BLA`)
  t.is((await optimize({ contents: `BLAprocess.env['NODE_ENV']`, map: {} })).contents, `BLAprocess.env['NODE_ENV']`)
})

