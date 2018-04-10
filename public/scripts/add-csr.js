function activateAddCsrButton() {
  document.getElementById('add-csr').addEventListener('click', () => {
    fetch('/api/addcsr', {
      'method': 'POST',
      'body': JSON.stringify({ 'username': document.getElementById('csr-username').value }),
      'headers': {
        'content-type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(({ username }) => {
        const list = document.getElementById('list-of-csrs')
        if (list.innerText.length > 0) {
          list.innerText += `, ${username}`
          return true
        }
        list.innerText = username
      })
  })
}