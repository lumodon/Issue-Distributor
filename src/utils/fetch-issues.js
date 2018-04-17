require('dotenv').config()
const fetch = require('node-fetch')
const { getLoginCookie } = require('./get-login-cookie')
const { JSDOM } = require('jsdom')

function fetchDelay(...args) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(fetch.apply(this, args))
    }, 500)
  })
}

function getFetchOptions(sessionToken) {
  return {
    'method': 'GET',
    'headers': {
      'host': 'icobo.cashbet.com',
      'Authorization': 'Basic ' + Buffer.from(process.env.BAusername +
        ':' + process.env.BApassword).toString('base64'),
      'Accept': 'text/html, */*; q=0.01',
      'Accept-Encoding': 'gzip, deflate, br',
      'Accept-Language': 'en-US,en;q=0.9',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Cookie': `${sessionToken};`,
      'Pragma': 'no-cache',
      'Upgrade-Insecure-Requests': 1,
      'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.186 Safari/537.36',
    },
  }
}

function processPage(document) {
  const getChild = (domEle, column) => domEle.querySelector(`td:nth-child(${column})`)
  return Array.from(document.querySelectorAll('.issue.open'))
    .filter(row => getChild(row, 6).textContent.includes('CYNOPSIS'))
    .map(row => Number(getChild(row, 5).textContent))
}

async function getIssueIds() {
  const fetchOptions = getFetchOptions(await getLoginCookie().catch(err => console.error))
  const urlStart = 'https://icobo.cashbet.com/crm/work_queues/index/sort:category/direction:asc/page:1'
  let issueIds = []

  return fetchDelay(urlStart, fetchOptions)
    .then(async res => (await res.text()).toString())
    .then((resultBody) => new JSDOM(resultBody).window.document)
    .then((document) => {
      issueIds = [...issueIds, ...processPage(document)]
      const numberOfPages = (() => {
        const tib = document.querySelectorAll('.table-info-box')[0]
        const pageTotal = tib.textContent.split(' of ')[1]
        return Math.ceil(Number(pageTotal / 50))
      })()

      return numberOfPages
    })
    .then(async (numberOfPages) => {
      for(let pageIterator = 2; pageIterator <= numberOfPages; pageIterator++) {
        const urlPage = `https://icobo.cashbet.com/crm/work_queues/index/sort:category/direction:asc/page:${pageIterator}`
        const appendableIds = await fetchDelay(urlPage, fetchOptions)
          .then(async res => (await res.text()).toString())
          .then((resultBody) => new JSDOM(resultBody).window.document)
          .then(document => processPage(document))
        issueIds = [...issueIds, ...appendableIds]
      }
      return issueIds
    })
}

module.exports = {
  getIssueIds,
}
