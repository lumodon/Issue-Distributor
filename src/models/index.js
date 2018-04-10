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

function addIssues(issueData) {
  const resolveIssueInsertions = []
  issueData.forEach(issuedataitem => {
    const qs = `
      INSERT INTO issues (issueid, options)
      VALUES ($1, $2);
    `
    const issueInsertion = db.none(qs, [issuedataitem.issueid, issuedataitem.options])
    resolveIssueInsertions.push(issueInsertion)
  })
  return Promise.all(resolveIssueInsertions)
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