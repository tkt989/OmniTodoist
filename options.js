import axios from 'axios'
import api from './api'

chrome.storage.sync.get('token', result => {
  if (result['token'] !== undefined) {
    loggingIn()
  }
})

document.querySelector('#login').addEventListener('click', () => {
  api.authorize().then(() => {
    loggingIn()
  })
})

document.querySelector('#logout').addEventListener('click', () => {
  chrome.storage.sync.set({ token: undefined }, () => {
    document.querySelector('#not-login').style.display = 'block'
    document.querySelector('#logging').style.display = 'none'
  })
})

function loggingIn() {
  document.querySelector('#not-login').style.display = 'none'
  document.querySelector('#logging').style.display = 'block'
}
