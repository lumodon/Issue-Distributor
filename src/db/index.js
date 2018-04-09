const initOptions = {}

const pgp = require('pg-promise')(initOptions)
const db = pgp(process.env.DATABASE_URL)

module.exports = { db }