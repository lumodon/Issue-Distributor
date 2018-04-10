require('dotenv').config()
const fetch = require('node-fetch')
const formurlencoded = require('form-urlencoded')

const BAHeaders = {
  'host': 'icobo.cashbet.com',
  'Authorization': 'Basic ' + Buffer.from(process.env.BAusername +
    ':' + process.env.BApassword).toString('base64'),
}

const getOptions = ({ tokenFields, tokenKey }) => ({
  'method': 'POST',
  'body': formurlencoded({
    '_method': 'POST',
    'data[_Token][fields]': tokenFields,
    'data[_Token][key]': tokenKey,
    'data[_Token][unlocked]': '',
    'data[password]': process.env.password,
    'data[remember_me]': '0',
    'data[timezone]': 'America/Los_Angeles',
    'data[username]': process.env.loginusername,
  }),
  'headers': {
    ...BAHeaders,
    'Connection': 'keep-alive',
    'Pragma': 'no-cache',
    'Cache-Control': 'no-cache',
    'Accept': 'text/html, */*; q=0.01',
    'Origin': 'https://icobo.cashbet.com',
    'X-Requested-With': 'XMLHttpRequest',
    'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.186 Safari/537.36',
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    'Referer': 'https://icobo.cashbet.com/crm/login',
    'Accept-Encoding': 'gzip, deflate, br',
    'Accept-Language': 'en-US,en;q=0.9',
  },
})
const URL = 'https://icobo.cashbet.com/crm/login'

function basicAuthFetch() {
  const auth = 'Basic ' + Buffer.from(process.env.BAusername +
    ':' + process.env.BApassword).toString('base64')
  return fetch(URL, {
    headers: {
      'host': 'icobo.cashbet.com',
      'Authorization': auth,
    }
  })
}

async function getLoginCookie() {
  const body = await basicAuthFetch()
    .then(async res => (await res.text()).toString())
    .catch(err => {
      console.error('Error acquiring login page. Check network\n', err)
    })

  const stringMatch = body.match(/name="data\[_Token\]\[key\]" value="([a-zA-Z0-9%]+)"(?:.|\n|\r)*name="data\[_Token\]\[fields\]" value="([a-zA-Z0-9%]+)"/)
  const tokenKey = stringMatch[1]
  const tokenFields = stringMatch[2]

  const newCakeCookie = await fetch(URL, getOptions({ tokenKey, tokenFields }))
    .then(res => res.headers.get('set-cookie').split(';')[0])
    .catch(err => {
      console.error('Error logging in with credentials\n', err)
    })

  return newCakeCookie
}

module.exports = {
  getLoginCookie,
}
