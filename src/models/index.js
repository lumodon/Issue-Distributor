const { db } = require('../db')

function getCsrs() {
  const qs = `
    SELECT * FROM csrs;
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

function setIssueToDifficult(issueid) {
  const qs = `
    UPDATE issues
    SET options = 'difficult'
    WHERE issues.issueid = $1
  `
  db.any(qs, [issueid])
}

function setIssueToNormal(issueid) {
  const qs = `
    UPDATE issues
    SET options = ''
    WHERE issues.issueid = $1
  `
  db.any(qs, [issueid])
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

module.exports = {
  getCsrs,
  addCsr,
  deleteCsr,
  addIssues,
  getIssues,
}