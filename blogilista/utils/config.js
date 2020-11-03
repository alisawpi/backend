/* eslint-disable no-undef */
require('dotenv').config()

let MONGODB_URI_BLOG = process.env.MONGODB_URI_BLOG
let PORT = process.env.PORT

module.exports = {
  MONGODB_URI_BLOG,
  PORT
}