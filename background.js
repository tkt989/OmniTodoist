import api from './api'

const CLEAR_NOTIFICATION_PREFIX = 'clear-notification:'

chrome.omnibox.onInputEntered.addListener((text, disposition) => {
  addTask(text)
})

chrome.alarms.onAlarm.addListener(alarm => {
  if (!alarm.name.startsWith(CLEAR_NOTIFICATION_PREFIX)) {
    return
  }

  const notificationId = alarm.name.slice(CLEAR_NOTIFICATION_PREFIX.length)
  chrome.notifications.clear(notificationId)
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
      chrome.alarms.create(`${CLEAR_NOTIFICATION_PREFIX}${notificationId}`, {
        delayInMinutes: 1
      })
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
