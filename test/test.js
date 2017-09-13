const fs = require('fs')
const infojobs = require('../index.js')

const credentials = JSON.parse(fs.readFileSync('../config/credentials.json', 'utf-8'))

describe('infojobs()', () => {
  it('should be a high order function', () => {
    expect(typeof infojobs(credentials) === 'function').toBe(true)
  })
})

/* describe('run() | start() | go()', ()=>{ */
//
//   it('should return a promise', ()=>{
//     expect(infojobs(credentials)().offer().run() instanceof Promise).toBe(true)
//   })
//
//   test('whether the promise resolve value returns 20 records.', async ()=>{
//
//    let res = await infojobs(credentials)().offer().run()
//
//     expect(res.offers.length === 20).toBe(true)
//   })
//
// })
/*  */
