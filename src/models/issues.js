const { db } = require('../db')

function addIssues(issueData) {
  const resolveIssueInsertions = []
  issueData.forEach(issue => {
    const qs = `
      INSERT INTO issues (issueid, options, csrid)
      VALUES ($1, $2, $3);
    `
    console.log('issues added: ', issue)
    const issueInsertion = db.none(qs, [issue.issueid, issue.options, issue.csrid])
    resolveIssueInsertions.push(issueInsertion)
  })
  return Promise.all(resolveIssueInsertions)
    .catch(e => console.error)
}

function setIssueToDifficult(issueid) {
  const qs = `
    UPDATE issues
    SET options = 'difficult'
    WHERE issues.issueid = $1
  `
  return db.any(qs, [issueid])
}

function setIssueToNormal(issueid) {
  const qs = `
    UPDATE issues
    SET options = ''
    WHERE issues.issueid = $1
  `
  return db.any(qs, [issueid])
}

function getIssues() {
  const qs = `
    SELECT * FROM issues;
  `
  return db.manyOrNone(qs)
}

function clearIssues() {
  const qs = `
    DELETE FROM issues;
  `
  return db.none(qs)
}

function linkIssueCsr(issueid, csrid) {
  const qs = `
    UPDATE issues
    SET csrid = $2
    WHERE issues.issueid = $1
  `
  return db.any(qs, [issueid, csrid])
}

module.exports = {
  addIssues,
  clearIssues,
  getIssues,
  setIssueToDifficult,
  setIssueToNormal,
  linkIssueCsr,
}