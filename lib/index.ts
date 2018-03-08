export type CallableLogsy = Function & Logsy

export type Option = string     // Prefix
  | Options   // Options
  | Callback  // Callback
  | boolean   // Active

export type Callback = () => null

export interface Options {
  active?: (() => Boolean) | Boolean
  prefix?: (() => string) | string
  callback?: Callback
}

export class Logsy {
  public options: Options
  public method: null | string

  constructor(option?: Option, defaults?: Options) {
    this.options = {
      ...defaults,
      ...this.parse(option)
    }
    this.method = null
  }

  parse(option?: Option): Options {
    if (
      option instanceof Array &&
      option.length > 0
    ) {
      return this.parse(option[0])
    }
    switch (typeof option) {
      case 'function':
        return { callback: <Callback>option }
      case 'string':
        return { prefix: <string>option }
      case 'boolean':
        return { active: <boolean>option }
      case 'object':
        return <Options>option
      default:
        return <Options>{}
    }
  }

  factory(options?: Options): CallableLogsy {
    const instance = new Logsy(options, this.options)
    const logsy = instance.trap.bind(instance)
    return new Proxy(logsy, Logsy.handler)
  }

  trap(method: string): Logsy {
    // Keep track of method applied in console
    // Shouldn't be used for now
    if (method) {
      this.method = method
      return this.trap.bind(this)
    }
    return this
  }

  static get handler() {
    return {
      get(logsy: CallableLogsy, param: (keyof Console)) {
        const instance = logsy.call(logsy)
        if (instance[param] != null) {
          return instance[param]
        } else {
          return Logsy.console(param, instance)
          // return new Proxy(logsy.call(instance, param), Logsy.console)
        }
      },
      apply(logsy: CallableLogsy, param: (keyof Console), options: Options) {
        const instance = logsy.call(logsy)
        return instance.factory(options)
      }
    }
  }

  // In case of a binder
  static console(param: (keyof Console), instance: Logsy): Function {
    if (instance.options.active === false) return () => null
    if (instance.options.callback) {
      instance.options.callback.call(instance)
    }
    return console[param].bind(console, instance.options.prefix)
  }
}

const instance = new Logsy()
const logsy = instance.factory()

export default logsy

