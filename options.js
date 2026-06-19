import api from './api'

chrome.storage.sync.get('token', result => {
  if (result['token'] !== undefined) {
    showLoggedIn()
  }
})

document.querySelector('#login').addEventListener('click', async () => {
  await api.authorize()
  showLoggedIn()
})

document.querySelector('#logout').addEventListener('click', () => {
  chrome.storage.sync.remove('token', () => {
    delete api.token
    showLoggedOut()
  })
})

function showLoggedIn() {
  document.querySelector('#not-login').style.display = 'none'
  document.querySelector('#logged-in').style.display = 'block'
}

function showLoggedOut() {
  document.querySelector('#not-login').style.display = 'block'
  document.querySelector('#logged-in').style.display = 'none'
}
