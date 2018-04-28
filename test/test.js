const infojobs = require('../index.js')
const nock = require('nock')
const test = require('ava')

const credentials = require('../config/default.credentials.json')

const nocker = nock('https://api.infojobs.net')
const search = infojobs(credentials)

test('infojobs() should be a high order function.', t => {
  t.true(typeof infojobs(credentials) === 'function')
})

test('should return a promise', expect => {
  nocker.get('/api/1/offer').reply(200, require('./data/mock.offer.json'))

  expect.true(
    search()
      .offer()
      .run() instanceof Promise
  )
})

test.before(() => {
  nocker.get('/api/1/offer').reply(200, require('./data/mock.offer.json'))
})

test('offer() should return the correct json.', async t => {
  const res = await search()
    .offer()
    .run()

  t.deepEqual(res, require('./data/mock.offer.json'))
})

test.before(() => {
  nocker
    .get('/api/1/offer')
    .query({ q: 'java' })
    .reply(200, require('./data/mock.offer.query.json'))
})

test('offer([query]) should correctly query and return a json response.', async t => {
  const res = await search()
    .offer({ q: 'java' })
    .run()

  t.deepEqual(res, require('./data/mock.offer.query.json'))
})

test.before(() => {
  nocker
    .get('/api/1/offer/3b830e44a9426fb3d1410b8618fdcb')
    .reply(200, require('./data/mock.id.json'))
})

test('id([id]) should correctly return a json response.', async t => {
  const res = await search()
    .offer()
    .id('3b830e44a9426fb3d1410b8618fdcb')
    .run()

  t.deepEqual(res, require('./data/mock.id.json'))
})

test.before(() => {
  nocker
    .get('/api/1/offer')
    .query({ page: 1 })
    .reply(200, require('./data/mock.offer.pages.1.json'))

  nocker
    .get('/api/1/offer')
    .query({ page: 2 })
    .reply(200, require('./data/mock.offer.pages.2.json'))

  nocker
    .get('/api/1/offer')
    .query({ page: 3 })
    .reply(200, require('./data/mock.offer.pages.3.json'))
})

test('pages() should correctly loop through all the results.', async t => {
  const search = infojobs(credentials)
  let counter = 1
  for await (const page of search().offer().pages(3)) {
    t.deepEqual(page, require(`./data/mock.offer.pages.${counter}.json`))
    counter += 1
  }

})

