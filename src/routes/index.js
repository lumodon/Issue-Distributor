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
    // Give csrs empty array for issueData
    csrsData.map(csr => {
      csr.issueData = csr.issueData || []
      return csr
    })
    // Assign owned issues to csr specific
    issueData.forEach(issue => {
      const csrToPushTo = csrsData.find(csr => csr.csrid === issue.csrid)
      if(!csrToPushTo) {
        linkIssueCsr(issue.issueid, 'NULL')
        return false
      }
      csrToPushTo.issueData.push(issue.issueid)
      issueData.splice(issueData.findIndex(i => i.issueid === issue.issueid), 1)
    })
    let counts = {}
    csrsData.forEach(csr => {
      csr.issueData = csr.issueData || []
      counts[csr.issueData.length] = counts[csr.issueData.length] || []
      counts[csr.issueData.length].push(csr.csrid)
    })
    while(issueData.length > 0) {
      const accumulator = []
      for(let key in counts) {
        if(counts[key].length > 0) accumulator.push(Number(key))
      }
      const index = Math.min(...accumulator)
      const countIndex = Math.floor(Math.random() * counts[index].length)
      const receivingCsr = csrsData.find(c => c.csrid === counts[index][countIndex])
      const issueToAdd = issueData.pop().issueid
      linkIssueCsr(issueToAdd, receivingCsr.csrid)
      receivingCsr.issueData.push(issueToAdd)
      counts[index].splice(counts[index].findIndex(i => i === receivingCsr.csrid), 1)
      counts[index + 1] = counts[index + 1] ?
        [...counts[index + 1], receivingCsr.csrid] :
        [receivingCsr.csrid]
    }
  }
  csrsData.forEach(csr => {
    csr.issueData.sort((a,b) => Number(a) > Number(b))
  })
  response.render('index', { csrs: csrsData, difficultIssueIds })
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
    await addIssues(newIssueIds)
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