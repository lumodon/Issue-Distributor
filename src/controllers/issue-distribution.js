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
  let counts = {}
  csrsData.forEach(csr => {
    csr.issueData = csr.issueData || []
    counts[csr.issueData.length] = counts[csr.issueData.length] || []
    counts[csr.issueData.length].push(csr.csrid)
  })
  while(issuesLeftOver.length > 0) {
    const accumulator = []
    for(let key in counts) {
      if(counts[key].length > 0) accumulator.push(Number(key))
    }
    const index = Math.min(...accumulator)
    const countIndex = Math.floor(Math.random() * counts[index].length)
    const receivingCsr = csrsData.find(c => c.csrid === counts[index][countIndex])
    const issueToAdd = issuesLeftOver.pop().issueid
    linkIssueCsr(issueToAdd, receivingCsr.csrid)
    receivingCsr.issueData.push(issueToAdd)
    counts[index].splice(counts[index].findIndex(i => i === receivingCsr.csrid), 1)
    counts[index + 1] = counts[index + 1] ?
      [...counts[index + 1], receivingCsr.csrid] :
      [receivingCsr.csrid]
  }
  csrsData.forEach(csr => {
    csr.issueData.sort((a,b) => Number(a) > Number(b))
  })
}

module.exports = {
  issueDistribution,
}