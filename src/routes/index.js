const router = require('express').Router()
const { getCsrs, addCsr, addIssue, deleteCsr, clearIssues } = require('../models')

router.get('/', async (request, response) => {
  const csrsData = await getCsrs()
  console.log('csrs:' , csrsData)
  response.render('index', { csrs: csrsData })
})

router.post('/api/addcsr', async (request, response) => {
  const { username } = request.body
  const csr = await addCsr(username)
  const responseObj = { succeeded: csr ? true : false }
  response.send(responseObj)
})

router.post('/api/deletecsr', async (request, response) => {
  const { csrid } = request.body
  const deletedcsr = await deleteCsr(csrid)
  const responseObj = { succeeded: deletedcsr ? true : false }
  response.send(responseObj)
})

module.exports = router