document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('add-csr').addEventListener('click', () => {
      fetch('/api/addcsr', {
        'method': 'POST',
        'body': JSON.stringify({ 'username': document.getElementById('csr-username').value }),
        'headers': {
          'content-type': 'application/json',
        },
      })
        .then(response => response.text())
        .then(response => {
          document.getElementById('list-of-csrs').innerText = response
        })
    })
})