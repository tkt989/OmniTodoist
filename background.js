import axios from 'axios'
import uuid from 'uuid'
import api from './api'

const ids = []

chrome.omnibox.onInputEntered.addListener((text, disposition) => {
  addTask(text)
})

function addTask(text) {
  chrome.storage.sync.get(['token'], result => {
    if (result['token'] === undefined) {
      chrome.runtime.openOptionsPage()
      return
    }

    let token = result['token']

    api.token = token
    api.addTask(text).then(success(text), error)
  })
}

const success = text => () => {
  chrome.notifications.create(
    null,
    {
      type: 'basic',
      iconUrl: './img/success.png',
      title: 'Success',
      message: `Success to add a todo\n${text}`
    },
    notificationId => {
      ids.push(notificationId)
      setTimeout(() => {
        ids = ids.filter(id => id !== notificationId)
        chrome.notifications.clear(notificationId)
      }, 5000)
    }
  )
}

function error(e) {
  chrome.notifications.create(null, {
    type: 'basic',
    iconUrl: './img/error.png',
    title: 'Error',
    message: `Failed to add a todo\n${e.message}`
  })
}
