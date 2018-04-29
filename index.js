const request = require('request')
const { URL, URLSearchParams } = require('url')

const defaults = {
  apiUrl: 'https://api.infojobs.net/api/1',
  resources: [
    'application',
    'dictionary',
    'candidate',
    'skillcategory',
    'offer',
    'id',
    'killerquestion',
    'question',
    'openquestion',
    'type'
  ]
}

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
    const queryEntries = Object.entries(query)
    const params = new URLSearchParams(queryEntries)
    url.search = params.toString()
  })

  inner.getQuery = () => url.query

  inner.toString = () => url.toString()

  return inner
}

const infojobs = (
    auth,
    resources = defaults.resources,
    apiUrl = defaults.apiUrl
  ) => () => {
    const get = requester(auth)
    const url = buildUrl(apiUrl)
    const inner = {}
    const innerChained = chain(inner)

    resources.forEach(resource => {
      inner[resource] = innerChained(query => {
        url.addPath(resource)
        if (typeof query === 'string') return url.addPath(query)
        if (query) url.addQuery(query)
      })
    })

    inner.id = innerChained(url.addPath)

    inner.pages = async function*(from, until) {
      if (from <= 0) throw new Error('`From` must be greater 0.')
      if (until < from) throw new Error('Until can\'t be greater than from')

      let query = url.getQuery()

      if (until === undefined && from !== undefined) {
        until = from
        from = 1
      }
      url.addQuery({ ...query, page: from || 1 })
      let res = await inner.go()
      yield res

      if (from === undefined && until === undefined) {
        until = res.totalPages
        from = res.currentPage
      }

      while (from < until) {
        query = url.getQuery()
        url.addQuery({ ...query, page: from + 1 })
        yield await inner.go()
        from += 1
      }
    }

    inner.go = inner.start = inner.run = () => {
      const fullUrl = url.toString()
      return get(fullUrl)
    }

    return inner
  }

module.exports = infojobs
