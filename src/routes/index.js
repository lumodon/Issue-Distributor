const router = require('express').Router()
const { getCsrs, addCsr, addIssue, deleteCsr, clearIssues } = require('../models')
const { getIssueIds } = require('../utils/fetch-issues')

router.get('/', async (request, response) => {
  const csrsData = await getCsrs()
  console.log('csrs:' , csrsData)
  response.render('index', { csrs: csrsData })
})

router.post('/api/issueids', async (request, response) => {
  const { validation } = request.body
  if(validation === 'validation_confirmed') {
    issueIds = await getIssueIds()
    response.send(issueIds)
    return true
  }
  response.status(304).send('No issueIds modified - requires validation to prevent accidental repeated server calls')
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