const router = require('express').Router()
const { getCsrs, setCsrs, addIssue, clearIssues } = require('../models')

router.get('/', async (request, response) => {
  const csrs = await getCsrs()

  response.status(200).send(csrs)

  // response.render('index', csrs)
})

router.post('/api/setcsrs', (request, response) => {
  const csrs = request.body
  
})

module.exports = router