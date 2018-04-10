const router = require('express').Router()
const { getCsrs, addCsr, addIssues, deleteCsr, getIssues } = require('../models')
const { getIssueIds } = require('../utils/fetch-issues')

router.get('/', async (request, response) => {
  const csrsData = await getCsrs()
  const issueData = await getIssues()
  const issueIds = issueData.map(issueObject => issueObject.issueid)
  debugger;
  if(csrsData && csrsData.length > 0) {
    const numPerCsr = Math.floor(issueIds.length / csrsData.length)
    const leftOver = issueIds.length % csrsData.length
    csrsData.forEach(csrObj => {
      csrObj.issueList = issueIds.splice(0, numPerCsr)
    })
    if(leftOver > 0) {
      csrsData[0].issueList.push(...issueIds.splice(0, leftOver))
    }
  }
  response.render('index', { csrs: csrsData })
})

router.post('/api/issueids', async (request, response) => {
  const { validation } = request.body
  if(validation === 'validation_confirmed') {
    issueIds = await getIssueIds()
    addIssues(issueIds)
    response.send({ issueIds })
    return true
  }
  response.status(304).send({
    'error': 'No issueIds modified - requires validation to prevent accidental repeated server calls',
  })
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