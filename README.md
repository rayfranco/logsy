# logsy

[![Build Status](https://travis-ci.org/rayfranco/downup.svg?branch=master)](https://travis-ci.org/rayfranco/downup)

Proxy factory for the `console` using ES6 Proxies (node + browser)

## Quickstart

Install the package

```
npm install logsy
```

Import the package

```
import logsy from 'logsy'
```

`logsy` is a console log proxy, you can use it simply like this

```
logsy.log('Hello!')
```

Create a custom proxy using the factory function

```
const cool = logsy('[COOL]')

cool.log('<- was it?')
// [COOL] <- was it?
```

Checkout the possible options when creating your proxy

## Options

```
interface Options {
  active?: (() => Boolean) | Boolean
  prefix?: (() => string) | string
  callback?: Callback
}
```

Options are pretty self explanatory.

```
const log = logsy({
  active: process.env.DISPLAY_LOG,
  prefix: `[MY LOG]`
  callback () {
    axios.post('/logger', { ...opts })
  }
})
```

## Function resolving

_Not covered yet_

For each of them you can pass a function that will be interpreted at the moment it is called. For example:

```
let showLogs = true

const active = () => showLogs
const log = logsy({ active }).log

log('I am logged')

showLogs = false

log('I am not logged')
```

## Type resolving

You can also pass values directly (for `active`, `prefix` and `callback`) and will be resolved based on its type

```
const error = logsy(process.env.DISPLAY_ERROR).error
const log = logsy(process.env.DISPLAY_LOG).log
```

Function resolving also works here if the function returns the good type

```
const log = logsy(() => true)
```


## Chain proxies

You can chain the proxies, while using type resolving. If there is a property conflict, the last one will take over the firsts.

```
const log = logsy(proces.env.DISPLAY_ERROR)('[MY PREFIX]')
```

## Compatibility

Logsy is built on top of Proxy object which is not available everywhere ([browser compatibility](https://caniuse.com/#feat=proxy)) For the sake of keeping the library lightweight, it will be shipped without any polyfill by default. If Proxies aren't available, it will be redirected to the console object.

## Drawbacks

While most console wrappers will mess with the call stack, using a Proxy allow logsy to keep line numbers and call stack untouched in your terminal / dev tools.

One major drawback is that to keep it like this, we can't proxy the `apply` on console methods, calling it would mess that up. Because of this, at the moment, information such as the parameters aren't available in the callback.