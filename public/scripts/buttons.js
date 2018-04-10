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

function activateUpdateIssuesButton() {
  const fetchIssueButton = document.getElementById('fetch-issueids')
  fetchIssueButton.addEventListener('click', () => {
    fetchIssueButton.style.display = 'none'
    fetch('/api/issueids', {
      'method': 'POST',
      'body': JSON.stringify({ 'validation': 'validation_confirmed' }),
      'headers': {
        'content-type': 'application/json',
      },
    })
      .then(response => response.json())
      .then((response) => {
        if(response.issueIds) {
          location.reload()
        } else {
          alertMessage(response.error)
        }
        setTimeout(() => {
          fetchIssueButton.style.display = 'block'
        }, 10 * 1000)
      })
  })
}