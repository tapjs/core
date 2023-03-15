/// <reference types="node" />
import loop from 'function-loop'
import { TestBase } from '../test-base.js'

export const plugin = (Base: typeof TestBase) =>
  class BeforeEach extends Base {
    #onBeforeEach: ((t: BeforeEach) => void)[] = []
    beforeEach(
      fn: (t: BeforeEach) => void | Promise<void>
    ) {
      this.#onBeforeEach.push(fn)
    }
    #runBeforeEach<B extends BeforeEach = BeforeEach>(
      who: B,
      cb: () => void
    ) {
      // run all the beforeEach methods from the parent
      const onerr = (er: any) => {
        who.threw(er)
        cb()
      }
      const p = this.parent as BeforeEach
      if (p && !!p.#runBeforeEach) {
        p.#runBeforeEach(who, () => {
          loop(this.#onBeforeEach, cb, onerr)
        })
      } else if (who !== (this as BeforeEach)) {
        loop(this.#onBeforeEach, cb, onerr)
      } else {
        cb()
      }
    }
    runMain(cb: () => void) {
      this.#runBeforeEach(this, () => super.runMain(cb))
    }
  }
