# infojobs

> A simple library that allows you to access the biggest database of job offers in Spain through the [Infojobs](https://www.infojobs.net/) RESTful API.

[![Build Status](https://travis-ci.org/AlvaroBernalG/infojobs.svg?branch=master)](https://travis-ci.org/AlvaroBernalG/infojobs) [![npm version](https://badge.fury.io/js/infojobs.svg)](https://badge.fury.io/js/infojobs) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install
```
$ npm install infojobs
```

In order to be able to use this library you must first go to the [Infojobs developer site](https://developer.infojobs.net/) and create an account.  

## Usage

Basic usage:
```js
const infojobs = require('infojobs')

const search = infojobs({
  id: 'api_id',
  secret: 'api_secret'  
}) // => these credentials are obtained on https://developer.infojobs.net/

search()
  .offer()
  .run()
  .then( response => {
      console.log(response) // => by default you will receive 20 results.  
  }).catch(console.log)
```

You can narrow the search by passing a literal object containing a [query](https://developer.infojobs.net/documentation/operation/offer-list-1.xhtml):
```js

search()
  .offer({
    q: 'Java developer',
    province: 'Madrid',
    companyName: 'Santander Group'
  })
  .run()
  .then( response => {
      console.log(response) // => by default you receive 20 results.
  }).catch(console.log)
```

You can retrieve a specific job offer by specifying its id using the id method:
```js
search()
  .offer()
    .id('jobOfferId234234234414')
  .run()
  .then( reponse => {
      console.log(response)
  }).catch(console.log)
```

## API

#### infojobs(credentials[object required]) `[object infojobs]`
Initializes the library and performs the authentication.

#### offer(query[optional]) `[object infojobs]`  
If no query object is passed, it will by default retrieve the first 20 job offers randomly found.

#### id(id [string] )[optional]) `[object infojobs]`  
Specifies a job id.

#### run() | start() | go() `[object Promise]`
Executes the query against the Infojobs RESTful API.

## License
MIT © [Alvaro Bernal](https://github.com/AlvaroBernalG/)
