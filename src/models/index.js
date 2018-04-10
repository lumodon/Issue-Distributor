const { getCsrs, addCsr, deleteCsr } = require('./csrs')
const {
  getIssues,
  addIssues,
  setIssueToDifficult,
  setIssueToNormal,
  clearIssues,
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
}