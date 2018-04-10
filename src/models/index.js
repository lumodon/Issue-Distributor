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

function addIssue(issueid, csrid) {
  const qs = `
    INSERT INTO issues (issueid, csrid)
    VALUES ($1, $2);
  `
  return db.none(qs, [issueid, csrid])
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
  addIssue,
  clearIssues,
}