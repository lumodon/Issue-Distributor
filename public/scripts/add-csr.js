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
      .then(({ succeeded }) => {
        if(succeeded) {
          location.reload()
        } else {
          alertMessage('Error adding user')
        }
      })
  })
}