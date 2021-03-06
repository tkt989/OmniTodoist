import axios from 'axios'
import { v4 } from 'uuid'

const baseURL = 'https://todoist.com'
const state = v4()

const instance = axios.create({
  baseURL: baseURL,
  timeout: 5000
})

class Api {
  authorize() {
    return new Promise((resolve, reject) => {
      chrome.identity.launchWebAuthFlow(
        {
          url: `${baseURL}/oauth/authorize?client_id=${CLIENT_ID}&scope=data:read_write&state=${state}`,
          interactive: true
        },
        responseUrl => {
          if (responseUrl === undefined) {
            return reject()
          }

          let url = new URL(responseUrl)
          let code = url.searchParams.get('code')

          instance
            .post('/oauth/access_token', {
              client_id: CLIENT_ID,
              client_secret: CLIENT_SECRET,
              code: code
            })
            .then(response => {
              if (response === undefined) {
                return reject()
              }

              chrome.storage.sync.set({ token: response.data.access_token })
              resolve()
            })
        }
      )
    })
  }

  getProjectList() {
    let syncToken = '*'
    let resourceTypes = '["projects"]'
    let params = new URLSearchParams()
    params.append('token', this.token)
    params.append('sync_token', syncToken)
    params.append('resource_types', resourceTypes)

    return instance.post('/api/v8/sync', param)
  }

  addTask(content) {
    let uuid = v4()
    let temp_id = v4()
    let params = new URLSearchParams()
    params.append('token', this.token)
    params.append(
      'commands',
      JSON.stringify([
        {
          type: 'item_add',
          uuid: uuid,
          temp_id: temp_id,
          args: {
            content: content
          }
        }
      ])
    )

    return instance.post('/api/v8/sync', params)
  }
}

export default new Api()
