/* eslint-disable no-undef */
require('dotenv').config()

let MONGODB_URI_BLOG = process.env.MONGODB_URI_BLOG
let PORT = process.env.PORT

if (process.env.NODE_ENV === 'test') {
  MONGODB_URI_BLOG = process.env.TEST_MONGODB_URI
}


module.exports = {
  MONGODB_URI_BLOG,
  PORT
}