/* eslint-disable no-undef */
require('dotenv').config()

let PORT = process.env.PORT
let MONGODB_URI = process.env.MONGODB_URI
let MONGODB_URI_BLOG = process.env.MONGODB_URI_BLOG

module.exports = {
  MONGODB_URI,
  MONGODB_URI_BLOG,
  PORT
}