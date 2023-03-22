import { FinalResults } from 'tap-parser'
import { plugin as AfterEach } from '../dist/cjs/plugin/after-each.js'
import { plugin as BeforeEach } from '../dist/cjs/plugin/before-each.js'
import { TestBase } from '../dist/cjs/test-base.js'

import { TestBaseOpts } from '../dist/cjs/test-base.js'
const opts: TestBaseOpts = {
  debug: /\btap\b/.test(process.env.NODE_DEBUG || ''),
  name: 'TAP',
}

const p0 = AfterEach(TestBase)
class P0 extends AfterEach(TestBase) {}
// TS injects a bunch of "__1#__#blah" properties into the types
// when 
const p1 = BeforeEach(p0 as unknown as typeof TestBase)
class P1 extends BeforeEach(TestBase) {}

interface Test extends TestBase, P0, P1 {}
class Test extends p1 {
  // this has to be overridden to provide a default Class type
  test<T extends TestBase = Test>(
    name: string,
    extra: { [k: string]: any },
    cb: (t: T) => any
  ): Promise<FinalResults | null> {
    return super.test<T>(name, extra, cb)
  }
  end() {
    return super.end()
  }
}

const t = new Test(opts)

t.stream.pipe(process.stdout)
t.runMain(() => {})

t.beforeEach(() => {
  console.log('first beforeEach')
})
t.beforeEach(() => {
  console.log('second beforeEach')
})
t.afterEach(() => {
  console.log('parent aftereach')
})

t.test('hello', {}, t => {
  t.pass('this is fine')
  t.beforeEach(() => {
    console.log('child beforeeach')
  })
  t.afterEach(() => {
    console.log('child aftereach')
  })
  t.test('hello child', {}, t => {
    t.pass('also fine')
    t.end()
  })
  t.end()
})

t.end()
