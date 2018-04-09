const psql = require('pg-promise')

function getCsrs() {
  const qs = `
    SELECT * FROM csrs;
  `
  return db.many(qs)
}

function setCsrs(csrs) {
  const insertCsrStack = []
  csrs.forEach(csr => {
    const qs = `
      INSERT INTO csrs (username)
      VALUES ($1);
    `
    insertCsrStack.push(db.none(qs, [csr.username]))
  })
  return Promise.all(insertCsrStack)
}

function addIssue(issueid, csrid) {
  const qs = `
    INSERT INTO issues (issueid, csrid)
    VALUES ($1, $2);
  `
  return db.none(qs, [issueid, csrid])
}

function clearissues() {
  const qs = `
    DELETE FROM issues;
  `
  return db.none(qs)
}

module.exports = {
  getCsrs,
  setCsrs,
  addIssue,
  clearIssues,
}