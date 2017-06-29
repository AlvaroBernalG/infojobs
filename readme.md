# infojobs

> Tiny libray that allows you to access the biggest database of jobs offers in Spain through the [Infojobs](https://www.infojobs.net/) RESTful API.

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
  user: 'my_user_id', 
  password: 'my_secret_password'  
}) // => this credentials are obtained in https://developer.infojobs.net/

search()
  .offer()
  .run()
  .then( reponse => {
      console.log(response) // => by default you will receive 20 results.  
}).catch(console.log)
```

You can narrow the search by passing a literal object representing a [query](https://developer.infojobs.net/documentation/operation/offer-list-1.xhtml):
```js

infojobs()
  .offer({ 
    q: 'Java developer',
    province: 'Madrid',
    companyName: 'Santander Group'
  })
  .run()
  .then( reponse => {
      console.log(response) // => by default you receive 20 results.
}).catch(console.log)
```

You can retrieve a specific job offer by specifiying its id using the id method:
```js
infojobs()
  .offer()
  .id('secretIdOfJobOffer')
  .run()
  .then( reponse => {
      console.log(response) 
}).catch(console.log)
```

## License
MIT © [Alvaro Bernal](https://github.com/AlvaroBernalG/) 
