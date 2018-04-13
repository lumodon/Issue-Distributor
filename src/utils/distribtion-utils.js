const { linkIssueCsr } = require('../models')

function avgDeltaSum(list, avg, iterationFunc) {
  let sum = 0
  list.forEach(listItem => {
    const delta = iterationFunc(listItem) - avg
    if(delta > 0) sum += delta
  })
  return sum
}

function pullExtraIssues(csrsData, avgQty, issuesRemaining) {
  let availableIssues = []
  csrsData.forEach(csr => {
    while(csr.issueData.length > avgQty && issuesRemaining > 0) {
      issuesRemaining--
      csr.issueData.sort()
      const rippedIssue = csr.issueData.pop()
      linkIssueCsr(rippedIssue.issueid, null)
      availableIssues = [...availableIssues, rippedIssue]
    }
  })
  return availableIssues
}

function distributeIssues({ issues, csrsData }) {
  let counts = {}
  csrsData.forEach(csr => {
    csr.issueData = csr.issueData || []
    counts[csr.issueData.length] = counts[csr.issueData.length] || []
    counts[csr.issueData.length].push(csr.csrid)
  })

  while(issues.length > 0) {
    const accumulator = []
    for(let key in counts) {
      if(counts[key].length > 0) accumulator.push(Number(key))
    }
    const index = Math.min(...accumulator)
    const countIndex = Math.floor(Math.random() * counts[index].length)
    const receivingCsr = csrsData.find(c => c.csrid === counts[index][countIndex])
    const issueToAdd = issues.pop().issueid
    linkIssueCsr(issueToAdd, receivingCsr.csrid)
    receivingCsr.issueData.push(issueToAdd)
    counts[index].splice(counts[index].findIndex(i => i === receivingCsr.csrid), 1)
    counts[index + 1] = counts[index + 1] ?
      [...counts[index + 1], receivingCsr.csrid] :
      [receivingCsr.csrid]
  }
}

module.exports = {
  distributeIssues,
  avgDeltaSum,
  pullExtraIssues,
}