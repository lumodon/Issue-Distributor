const router = require('express').Router()
const { getCsrs,
  addCsr,
  addIssues,
  deleteCsr,
  setIssueToNormal,
  getIssues,
  clearIssues,
  linkIssueCsr,
  setIssueToDifficult
} = require('../models')
const { extractIssueData } = require('../utils/extract-issues-data')
const { getIssueIds } = require('../utils/fetch-issues')
const { issueDistribution } = require('../controllers/issue-distribution')
const { avgDeltaSum, pullExtraIssues, distributeIssues } = require('../utils/distribtion-utils')

router.get('/', async (request, response) => {
  const csrsData = await getCsrs()
  const issueData = await getIssues()
  const { difficultIssueIds, issueIds } = await extractIssueData(issueData)

  // Remove difficult ids from data
  difficultIssueIds.forEach(difficultId => {
    const diffIndex = issueData.findIndex(i => i.issueid === difficultId)
    if(diffIndex > 0) {
      issueData.splice(diffIndex, 1)
    }
  })
  if(csrsData && csrsData.length > 0) {
    issueDistribution({ csrsData, issueData })
  }

  const avgQty = Math.floor(issueIds / csrsData.length)
  const issuesNeeded = avgDeltaSum(csrsData, avgQty, csr => csr.issueData.length)
  const availableIssues = pullExtraIssues(csrsData)
  distributeIssues({ issues: availableIssues, csrsData })

  response.render('index', { csrs: processedCsrsData, difficultIssueIds })
})

router.post('/api/issueids', async (request, response) => {
  const { validation } = request.body
  if(validation === 'validation_confirmed') {
    let issueData = await getIssues()
    let newIssueIds = await getIssueIds()
    issueData = issueData.filter(i => newIssueIds.findIndex(t => i.issueid === t.issueid) >= 0)
      .concat(newIssueIds.filter(i => issueData.findIndex(t => t.issueid === i.issueid) < 0))
    console.log(issueData)
    await clearIssues()
    await addIssues(issueData)
    response.send({ newIssueIds })
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

router.post('/api/toggleissue', async (request, response) => {
  const { issueid, options } = request.body
  let toggledIssue = null
  if(options === 'difficult') {
    toggledIssue = await setIssueToDifficult(issueid)
  } else {
    toggledIssue = await setIssueToNormal(issueid)
  }
  const responseObj = { succeeded: toggledIssue ? true : false }
  response.send(responseObj)
})


module.exports = router