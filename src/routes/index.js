const router = require('express').Router()

router.get('/', async (request, response) => {
  const csrs = await getCsrs() || [{ 'username': 'sample', 'issues': [101, 102] }]

  response.render('index', csrs)
})

module.exports = router