/// <reference types="node" />
import loop from 'function-loop'
import { TestBase } from '../test-base.js'
import type { Test } from '../test-built.js'

class BeforeEach {
  static #refs = new Map<TestBase, BeforeEach>()
  #t: TestBase
  constructor(t: TestBase) {
    this.#t = t
    BeforeEach.#refs.set(t, this)
    const runMain = t.runMain
    t.runMain = (cb: () => void) => {
      this.#runBeforeEach(this.#t, () =>
        runMain.call(t, cb)
      )
    }
  }
  #onBeforeEach: ((t: Test) => void)[] = []
  beforeEach(fn: (t: Test) => void | Promise<void>) {
    this.#onBeforeEach.push(fn)
  }
  #runBeforeEach(who: TestBase, cb: () => void) {
    // run all the beforeEach methods from the parent
    const onerr = (er: any) => {
      who.threw(er)
      cb()
    }
    const p = this.#t.parent
    const pbe = !!p && BeforeEach.#refs.get(p)
    if (pbe) {
      pbe.#runBeforeEach(who, () => {
        loop(this.#onBeforeEach, cb, onerr)
      })
    } else if (who !== this.#t) {
      loop(this.#onBeforeEach, cb, onerr)
    } else {
      cb()
    }
  }
}

const plugin = (t: TestBase) => new BeforeEach(t)
export default plugin
