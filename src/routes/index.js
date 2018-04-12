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
  csrsData.map(csr => {
    csr.issueData = csr.issueData || []
    return csr
  })
  debugger;
  if(csrsData && csrsData.length > 0) {
    csrsData.forEach(csr => {
      issueData.forEach(issue => {
        if(issue.csrid === csr.csrid) {
          csr.issueList = csr.issueList ? [...csr.issueList, issue.issueid] : [issue.issueid]
          issueData.splice(issueData.findIndex(i => i.issueid === issue.issueid), 1)
        }
      })
    })
    while(issueData.length > 0) {
      let counts = {}
      csrsData.forEach(csr => {
        counts[csrsData.issueList] = counts[csrsData.issueList] || []
        counts[csrsData.issueList].push(csrsData.csrid)
      })
      const index = Math.min(Object.keys(counts).map(m => Number(m)))
      const receivingCsr = counts[Math.round(Math.random() * counts[index].length)]
      csrsData.find(c => c.csrid === receivingCsr).issueData.push(issueData.pop().issueid)
    }

  //   const numPerCsr = Math.floor(issueIds.length / csrsData.length)
  //   const leftOver = issueIds.length % csrsData.length
  //   csrsData.forEach(csrObj => {
  //     csrObj.issueList = issueIds.splice(0, numPerCsr)
  //   })
  //   let cylceIterator = 0
  //   while(issueIds.length > 0) {
  //     cylceIterator++
  //     csrsData[cylceIterator % csrsData.length].issueList.push(issueIds.pop())
  //   }
  }
  response.render('index', { csrs: csrsData, difficultIssueIds })
})

router.post('/api/issueids', async (request, response) => {
  const { validation } = request.body
  if(validation === 'validation_confirmed') {
    let issueData = await getIssues()
    let newIssueIds = await getIssueIds()
    issueData = issueData.filter(i => newIssueIds.findIndex(t => i.issueid === t.issueid) >= 0)
      .concat(newIssueIds.filter(i => issueData.findIndex(t => t.issueid === i.issueid) < 0))
    debugger;
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