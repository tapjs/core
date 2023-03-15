import { FinalResults } from 'tap-parser'
import { plugin as AfterEach } from '../dist/mjs/plugin/after-each.js'
import { plugin as BeforeEach } from '../dist/mjs/plugin/before-each.js'
import { TestBaseBase } from '../dist/mjs/test-base.js'

import { TestBaseOpts } from '../dist/cjs/test-base.js'
const opts: TestBaseOpts = {}

const p0 = AfterEach(TestBaseBase)
class P0 extends AfterEach(TestBaseBase) {}
//@ts-ignore
const p1 = BeforeEach(p0)
class P1 extends BeforeEach(TestBaseBase) {}

interface Test extends TestBaseBase, P0, P1 {}
class Test extends p1 {
  // this has to be overridden to provide a default Class type
  test<T extends TestBaseBase = Test>(
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

const p = new Test(opts) as Test
p.beforeEach(_ => {
  console.log('a')
})
p.beforeEach(_ => {
  console.log('b')
})
const t = new Test({
  ...opts,
  parent: p,
})

t.test('hello', {}, t => {
  t.pass('this is fine')
  t.beforeEach(() => console.log('child beforeeach'))
})
t.stream.pipe(process.stdout)
t.runMain(() => {
  console.log('done')
})
