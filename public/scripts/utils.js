function alertMessage(message) {
  const alertMessageEle = document.getElementById('alert-message')
  alertMessageEle.style.display = 'block'
  alertMessageEle.innerText = message

  setTimeout(() => {
    alertMessageEle.innerText = ''
    alertMessageEle.style.display = 'none'
  }, (10 * 1000))
}