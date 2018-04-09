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

module.exports = {
  getCsrs,
  setCsrs,
}