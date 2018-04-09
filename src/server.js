const express = require('express')
const app = express()
const path = require('path')
const { getCsrs, setCsrs } = require('models')
require('dotenv').config()
require('ejs')

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.use(express.static(path.join(__dirname, 'public')))

app.get('/', async (request, response) => {
  const csrs = await getCsrs() || [{ 'name': 'sample', 'issues': [101, 102] }]

  response.render('index', csrs)
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Running on http://localhost:${PORT}/`)
})