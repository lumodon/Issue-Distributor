document.addEventListener('DOMContentLoaded', () => {
  Array.from(document.querySelectorAll('.delete-csr')).forEach(deleteButton => {
    deleteButton.addEventListener('click', deleteAnchorClickEvent)
  })

  activateAddCsrButton()
  activateUpdateIssuesButton()
  activateChangeDifficultyButton()
})