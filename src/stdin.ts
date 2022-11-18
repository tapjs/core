import Minipass from 'minipass'
import {Base, BaseOpts} from './base'

export interface StdinOpts extends BaseOpts {
  tapStream?: NodeJS.ReadableStream | Minipass
}

class Stdin extends Base {
  stream: NodeJS.ReadableStream | Minipass<string | Buffer>
  constructor (options:StdinOpts) {
    super({
      ...options,
      name: options.name || '/dev/stdin'
    })
    this.stream = options.tapStream || process.stdin
    this.stream.pause()
  }

  main (cb:(() => void)) {
    this.stream.on('error', er => {
      er.tapCaught = 'stdinError'
      this.threw(er)
    })
    if (this.options.timeout) {
      this.setTimeout(this.options.timeout)
    }
    const s = this.stream as Minipass
    s.pipe(this.parser)
    if (this.parent) {
      this.parent.emit('stdin', this)
    }
    this.stream.resume()
    this.once('end', cb)
  }

  threw (er:any, extra?: any, proxy?: boolean) {
    extra = super.threw(er, extra, proxy)
    Object.assign(this.options, extra)
    this.parser.abort(er.message, extra)
    this.parser.end()
  }
}

module.exports = Stdin
