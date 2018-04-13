const { distributeIssues } = require('../utils/distribtion-utils')

function issueDistribution({ csrsData, issueData }) {
  // Give csrs empty array for issueData
  csrsData.map(csr => {
    csr.issueData = csr.issueData || []
    return csr
  })
  // Assign owned issues to csr specific
  const issuesLeftOver = issueData.reduce((acc, issue, it) => {
    const csrToPushTo = csrsData.find(csr => csr.csrid === issue.csrid)
    if(!csrToPushTo) {
      linkIssueCsr(issue.issueid, null)
      return [...acc, issue]
    }
    csrToPushTo.issueData.push(issue.issueid)
    return acc
  }, [])
  distributeIssues({ issues: issuesLeftOver, csrsData })
  csrsData.forEach(csr => {
    csr.issueData.sort((a,b) => Number(a) > Number(b))
  })
}

module.exports = {
  issueDistribution,
}