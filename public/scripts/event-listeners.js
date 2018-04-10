function deleteAnchorClickEvent(event) {
  event.preventDefault()
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

function checkboxToggle(option, event) {
  event.preventDefault()
  const id = event.target.id.split('checkbox-')[1]
  fetch('/api/toggleissue', {
    'method': 'POST',
    'body': JSON.stringify({ 'issueid': id, 'options': option }),
    'headers': {
      'content-type': 'application/json',
    },
  })
    .then(response => response.json())
    .then(({ succeeded }) => {
      if(succeeded) {
        location.reload()
      } else {
        alertMessage('Error toggling issue difficulty')
      }
    })
}
