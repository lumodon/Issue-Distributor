const { getCsrs, addCsr, deleteCsr } = require('./csrs')
const {
  getIssues,
  addIssues,
  setIssueToDifficult,
  setIssueToNormal,
  clearIssues,
  linkIssueCsr,
} = require('./issues')

module.exports = {
  getCsrs,
  addCsr,
  deleteCsr,
  addIssues,
  clearIssues,
  getIssues,
  setIssueToDifficult,
  setIssueToNormal,
  linkIssueCsr,
}