const { db } = require('../db')

function getCsrs() {
  const qs = `
    SELECT * FROM csrs;
  `
  return db.manyOrNone(qs)
    .catch(e => console.error)
}

function addCsr(username) {
  const qs = `
    INSERT INTO csrs (username)
    VALUES ($1)
    RETURNING *;
  `
  return db.one(qs, [username])
    .catch(e => console.error)
}

function deleteCsr(csrid) {
  const qs = `
    BEGIN;
    UPDATE issues
    SET csrid = NULL
    WHERE issues.csrid = $1;
    DELETE FROM csrs
    WHERE csrs.csrid = $1
    RETURNING *;
    COMMIT;
  `
  return db.one(qs, [csrid])
    .catch(e => console.error)
}

module.exports = {
  getCsrs,
  addCsr,
  deleteCsr,
}

