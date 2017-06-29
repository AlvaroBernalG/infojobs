const request = require('request')
const { URL } = require('url')

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
  }).auth(auth.user, auth.password)
})

const buildUrl = (base) => {
  const url = new URL(base)
  const inner = {}
  const innerChained = chain(inner)

  inner.addPath = innerChained(path => {
    url.pathname = `${url.pathname}/${path}`
  })

  inner.addQuery = innerChained(ob => {
    if (!url.search) url.search = '?'
    Object.keys(ob).forEach(key => {
      url.search = `${url.search}&${key}=${ob[key]}`
    })
  })

  inner.getURL = () => url

  inner.toString = () => url.toString()

  return inner
}

const infojobs = (auth) => {
  const get = requester(auth)
  return (url = buildUrl(api_url)) => {
    const inner = {}
    const innerChained = chain(inner)

    resources.forEach(resource => {
      inner[resource] = innerChained(query => {
        url.addPath(resource)
        query && url.addQuery(query)
      })
    })

    inner.id = innerChained(id => url.addPath(id))

    inner.go = inner.start = inner.run = () => get(url.toString())

    return inner
  }
}

module.exports = infojobs
