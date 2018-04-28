const request = require('request')
const { URL, URLSearchParams } = require('url')

const api_url = 'https://api.infojobs.net/api/1'

const resources = [
  'offer',
  'killerquestion',
  'question',
  'openquestion'
]

const chain = instance => func => (...args) => {
  func.call(func, ...args)
  return instance
}

const requester = (auth) => (url) => new Promise((resolve, reject) => {
  request(url, (err, response, body) => {
    if (err) return reject(err)
    try {
      const res = JSON.parse(body)
      if (res.error) return reject(res.error_description)
      resolve(res)
    } catch (err) {
      reject(err)
    }
  }).auth(auth.id, auth.secret)
})

const buildUrl = (base) => {
  const url = new URL(base)
  const inner = {}
  const innerChained = chain(inner)

  inner.addPath = innerChained(path => {
    url.pathname = `${url.pathname}/${path}`
  })

  inner.addQuery = innerChained(query => {
    url.query = query
    url.queryEntries = Object.entries(query)
    const params = new URLSearchParams(url.queryEntries)
    url.search = params.toString()
  })

  inner.getQuery = () => url.query

  inner.toString = () => url.toString()

  return inner
}

const infojobs = (auth) => {
  const get = requester(auth)
  return () => {
    const url = buildUrl(api_url)
    const inner = {}
    const innerChained = chain(inner)

    resources.forEach(resource => {
      inner[resource] = innerChained( searchQuery => {
        url.addPath(resource)
        searchQuery && url.addQuery(searchQuery)
      })
    })

    inner.id = innerChained(id => url.addPath(id))

    inner.pages = async function*(from = 1, until) {

      let query = url.getQuery()
      url.addQuery({...query, page: from })
      let res = await inner.go();
      yield res
      until = until !== undefined ? until : res.totalPages 

      while(res.currentPage < until) {
        query = url.getQuery()
        url.addQuery({...query, page: res.currentPage + 1 })
        res = await inner.go();
        yield res
      }
    }


    inner.go = inner.start = inner.run = () => {
      const fullUrl = url.toString()
      return get(fullUrl)
    }

    return inner
  }
}

module.exports = infojobs
