const router = require('express').Router()
const { getCsrs, addCsr, addIssue, clearIssues } = require('../models')

router.get('/', async (request, response) => {
  const csrs = await getCsrs()

  response.status(200).send(csrs)

  // response.render('index', csrs)
})

router.post('/api/addcsr', (request, response) => {
  const { username } = request.body
  addCsr(username)
})

module.exports = router