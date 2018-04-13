function avgDeltaSum(list, avg, iterationFunc) {
  let sum = 0
  list.forEach(listItem => {
    const delta = iterationFunc(listItem) - avg
    if(delta > 0) sum += delta
  })
  return sum
}

module.exports = {
  avgDeltaSum,
}