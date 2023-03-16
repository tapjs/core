import loop from 'function-loop'
import { TestBase } from '../test-base.js'

export const plugin = (Base: typeof TestBase) =>
  class AfterEach extends Base {
    onAfterEach: ((t: TestBase) => void)[] = []
    afterEach(fn: (t: TestBase) => void | Promise<void>) {
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
      this.debug('AE runMain')
      return super.runMain(() => {
        this.debug('AE after runMain, running after each')
        this.runAfterEach(this, cb)
      }
      )
    }
  }
