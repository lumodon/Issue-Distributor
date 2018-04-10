const router = require('express').Router()
const { getCsrs, addCsr, addIssue, clearIssues } = require('../models')

router.get('/', async (request, response) => {
  const csrsData = await getCsrs()
  console.log('csrs:' , csrsData)
  response.render('index', { csrs: csrsData })
})

router.post('/api/addcsr', async (request, response) => {
  const { username } = request.body
  const csr = await addCsr(username)
  response.send(csr)
})

module.exports = router