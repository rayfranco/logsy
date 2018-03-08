const logsy = require('../dist/index.js').default

// logsy() must be callable as a function
test('Must be a callable function', () => {
  expect(logsy).toBeInstanceOf(Function)
})

// logsy.log() should worlk
describe('Console prototype', () => {
  for (let method in console) {
    if (typeof console[method] !== 'function') return
    test(`Method ${method} must be implemented`, () => {
      expect(console[method].constructor).toBe(logsy[method].constructor)
    })
  }
})

// Test options construct
describe('Options construct', () => {
  test(`Passing a object must construct options`, () => {
    const options = { prefix: 'prefix', callback: () => null, active: true }
    const logger = logsy(options)
    expect(logger.options).toEqual(options)
  })
})

describe('Type resolving', () => {
  test(`Passing a string must set prefix`, () => {
    const logger = logsy('prefix')
    expect(logger.options.prefix).toBe('prefix')
  })

  test(`Passing a null function must set callback`, () => {
    const callback = () => null
    const logger = logsy(callback)
    expect(logger.options.callback).toEqual(callback)
  })

  test(`Passing a boolean must set active`, () => {
    const logger = logsy(false)
    expect(logger.options.active).toBe(false)
  })
})

// Not available yet

// describe('Function resolving', () => {
//   test(`Passing a object with functions must construct options`, () => {
//     const options = { 
//       prefix: () => 'prefix', 
//       active: () => false 
//     }
//     const logger = logsy(options)
//     expect(logger.options).toEqual(options)
//   })

//   test(`Passing a string function must set prefix`, () => {
//     const logger = logsy(() => 'prefix')
//     expect(logger.options.prefix).toBe('prefix')
//   })

//   test(`Passing a boolean function must set active`, () => {
//     const logger = logsy(() => false)
//     expect(logger.options.active).toBe(false)
//   })
// })

describe('Proxy chaining', () => {
  test(`One proxy must be a function`, () => {
    const logger = logsy(false)
    expect(logger).toBeInstanceOf(Function)
  })

  test(`One proxy extension must be a function`, () => {
    const logger1 = logsy(false)
    const logger2 = logger1(true)
    expect(logger2).toBeInstanceOf(Function)
  })

  test(`Second proxy must overwrite the first`, () => {
    const logger1 = logsy(false)
    const logger2 = logger1(true)
    expect(logger2.options.active).toBe(true)
  })
})