const fs = require('fs')
const infojobs = require('../index.js')
const nock = require("nock")

const credentials = require('../config/default.credentials.json')

describe('infojobs()', () => {
  it('should be a high order function.', () => {
    expect(typeof infojobs(credentials) === 'function').toBe(true)
  })
})

describe('offer()', ()=> {

  beforeEach(()=> {
    nock('https://api.infojobs.net/api/1')
      .get('/offer')
      .reply(200, require('./data/mock.offer.json'));
  })

  it('should return a promise', ()=> {
    expect(infojobs(credentials)().offer().run() instanceof Promise).toBe(true)
  })

  it('offer() should return the correct json.', async ()=> {
    const search = infojobs(credentials)
    const res = await search().offer().run().catch(console.log.bind(null, " Something went wrong "))
    
    expect(res).toEqual(require('./data/mock.offer.json'))
  })

  beforeEach(()=> {
    this.query = {q: 'java'}

    nock('https://api.infojobs.net/api/1')
      .get('/offer')
      .query(this.query)
      .reply(200, require('./data/mock.offer.query.json'));
  })

  it('offer([query]) should correctly query and return a json response.', async ()=> {
    const search = infojobs(credentials)
    const res = await search(this.query).offer().run().catch(console.log.bind(null, " Something went wrong "))
    
    expect(res).toEqual(require('./data/mock.offer.query.json'))
  })

})


describe('id()', ()=> {

  beforeEach(()=> {
    this.id = '3b830e44a9426fb3d1410b8618fdcb' 
    nock('https://api.infojobs.net/api/1/offer')
      .get('/'+ this.id)
      .reply(200, require('./data/mock.id.json'));

  })

  it('id([id]) should correctly return a json response.', async ()=> {
    const search = infojobs(credentials)
    const res = await search().offer().id(this.id).run().catch(console.log.bind(null, " Something went wrong "))
    
    expect(res).toEqual(require('./data/mock.id.json'))
  })

})