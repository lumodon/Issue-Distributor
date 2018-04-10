function deleteAnchorClickEvent(event) {
  const csrid = Number(event.target.id.split('delete-csr-')[1])
  fetch('/api/deletecsr', {
    'method': 'POST',
    'body': JSON.stringify({ 'csrid': csrid }),
    'headers': {
      'content-type': 'application/json',
    },
  })
    .then(response => response.json())
    .then(({ succeeded }) => {
      if(succeeded) {
        location.reload()
      } else {
        alertMessage('Error deleting user')
      }
    })
}