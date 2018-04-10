function extractIssueData(issueData) {
  const difficultIssueIds = issueData
    .filter(issueObject => issueObject.options === 'difficult')
    .map(container => container.issueid)
  const issueIds = issueData.reduce((acc, issueObject) => {
    if(issueObject.options !== 'difficult') {
      return [...acc, issueObject.issueid]
    }
    return acc
  }, [])
  return { difficultIssueIds, issueIds }
}

module.exports = {
  extractIssueData
}