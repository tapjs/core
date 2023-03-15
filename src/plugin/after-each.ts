import loop from 'function-loop'
import { TestBaseBase } from '../test-base.js'

export const plugin = (Base: typeof TestBaseBase) =>
  class AfterEach extends Base {
    onAfterEach: ((t: TestBaseBase) => void)[] = []
    afterEach(fn: (t: TestBaseBase) => void | Promise<void>) {
      this.onAfterEach.push(fn)
    }
    runAfterEach<B extends AfterEach = AfterEach>(
      who: B,
      cb: () => void
    ) {
      // run all the afterEach methods from the parent
      const onerr = (er: any) => {
        who.threw(er)
        cb()
      }
      const p = () => {
        if (this.parent) {
          ;(this.parent as AfterEach).runAfterEach(who, cb)
        } else {
          cb()
        }
      }
      if (who !== (this as AfterEach)) {
        loop(this.onAfterEach, p, onerr)
      } else {
        p()
      }
    }
    runMain(cb: () => void) {
      return super.runMain(() =>
        this.runAfterEach(this, cb)
      )
    }
  }
