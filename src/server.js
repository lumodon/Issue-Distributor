const express = require('express')
const app = express()
const path = require('path')
const { getCsrs, setCsrs, addIssue, clearIssues } = require('./models')
require('dotenv').config()
require('ejs')

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.use(express.static(path.join(__dirname, 'public')))

app.use('/', require('./routes'))

app.use((req, res) => {
  res.status(404).render('not_found')
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Running on http://localhost:${PORT}/`)
})