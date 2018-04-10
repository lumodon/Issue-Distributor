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
      .then(({ csrid, username }) => {
        const list = document.getElementById('list-of-csrs')
        const newCsrListItem = document.createElement('li')
        const csrInfo = document.createElement('div')
        const deleteAnchor = document.createElement('a')
        const csrNameHeader = document.createElement('h3')

        csrInfo.className = 'csr-info'
        csrNameHeader.innerText = username

        deleteAnchor.className = 'delete-csr'
        deleteAnchor.id = `delete-csr-${csrid}`
        deleteAnchor.href = '#'
        deleteAnchor.innerText = 'X'
        deleteAnchor.addEventListener('click', deleteAnchorClickEvent)

        list.appendChild(newCsrListItem)
        newCsrListItem.appendChild(csrInfo)
        csrInfo.appendChild(deleteAnchor)
        csrInfo.appendChild(csrNameHeader)
      })
  })
}