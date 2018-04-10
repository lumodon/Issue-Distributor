const { db } = require('../db')

function getCsrs() {
  const qs = `
    SELECT csrs.csrid, csrs.username, issues.issueid FROM csrs
    LEFT JOIN issues
    ON issues.csrid = csrs.csrid;
  `
  return db.manyOrNone(qs)
}

function addCsr(username) {
  const qs = `
    INSERT INTO csrs (username)
    VALUES ($1)
    RETURNING *;
  `
  return db.one(qs, [username])
}

function deleteCsr(csrid) {
  const qs = `
    DELETE FROM csrs
    WHERE csrs.csrid = $1
    RETURNING *;
  `
  return db.one(qs, [csrid])
}

function addIssues(issueIds) {
  const resolveIssueInsertions = []
  return clearIssues()
    .then(() => {
      issueIds.forEach(issueid => {
        const qs = `
          INSERT INTO issues (issueid)
          VALUES ($1);
        `
        const issueInsertion = db.none(qs, [issueid])
        resolveIssueInsertions.push(issueInsertion)
      })
      return Promise.all(resolveIssueInsertions)
    })
}

function clearIssues() {
  const qs = `
    DELETE FROM issues;
  `
  return db.none(qs)
}

module.exports = {
  getCsrs,
  addCsr,
  deleteCsr,
  addIssues,
}