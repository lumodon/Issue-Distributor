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

module.exports = {
  getCsrs,
  addCsr,
  deleteCsr,
}

