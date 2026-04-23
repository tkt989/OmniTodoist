import api from './api'

let ids = []

chrome.omnibox.onInputEntered.addListener((text, disposition) => {
  addTask(text)
})

async function addTask(text) {
  const result = await new Promise(resolve => {
    chrome.storage.sync.get(['token'], resolve)
  })

  if (result['token'] === undefined) {
    chrome.runtime.openOptionsPage()
    return
  }

  api.token = result['token']

  try {
    await api.addTask(text)
    success(text)
  } catch (e) {
    error(e)
  }
}

function success(text) {
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
