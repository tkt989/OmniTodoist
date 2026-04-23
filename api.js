const baseURL = 'https://todoist.com'
const state = crypto.randomUUID()

class Api {
  async authorize() {
    const redirectURL = chrome.identity.getRedirectURL('oauth2')

    const authURL = new URL(`${baseURL}/oauth/authorize`)
    authURL.searchParams.set('client_id', CLIENT_ID)
    authURL.searchParams.set('scope', 'data:read_write')
    authURL.searchParams.set('state', state)
    authURL.searchParams.set('redirect_uri', redirectURL)

const responseUrl = await new Promise((resolve, reject) => {
      chrome.identity.launchWebAuthFlow(
        { url: authURL.toString(), interactive: true },
        responseUrl => {
          if (responseUrl === undefined) {
            reject(new Error('Authorization failed'))
          } else {
            resolve(responseUrl)
          }
        }
      )
    })

    const url = new URL(responseUrl)
    const code = url.searchParams.get('code')

    const response = await fetch(`${baseURL}/oauth/access_token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        code: code,
        redirect_uri: redirectURL
      })
    })

    const data = await response.json()
    chrome.storage.sync.set({ token: data.access_token })
  }

  async addTask(content) {
    const response = await fetch('https://api.todoist.com/api/v1/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.token}`,
        'X-Request-Id': crypto.randomUUID()
      },
      body: JSON.stringify({ content })
    })

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`)
    }

    return response.json()
  }
}

export default new Api()
