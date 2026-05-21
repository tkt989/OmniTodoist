const baseURL = 'https://todoist.com'

function base64UrlEncode(buffer) {
  const bytes = new Uint8Array(buffer)
  let binary = ''

  for (const byte of bytes) {
    binary += String.fromCharCode(byte)
  }

  return btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')
}

function generateCodeVerifier() {
  const bytes = new Uint8Array(32)
  crypto.getRandomValues(bytes)
  return base64UrlEncode(bytes)
}

async function generateCodeChallenge(codeVerifier) {
  const data = new TextEncoder().encode(codeVerifier)
  const digest = await crypto.subtle.digest('SHA-256', data)
  return base64UrlEncode(digest)
}

class Api {
  async authorize() {
    const redirectURL = chrome.identity.getRedirectURL('oauth2')
    const state = crypto.randomUUID()
    const codeVerifier = generateCodeVerifier()
    const codeChallenge = await generateCodeChallenge(codeVerifier)

    const authURL = new URL(`${baseURL}/oauth/authorize`)
    authURL.searchParams.set('client_id', CLIENT_ID)
    authURL.searchParams.set('scope', 'data:read_write')
    authURL.searchParams.set('state', state)
    authURL.searchParams.set('redirect_uri', redirectURL)
    authURL.searchParams.set('response_type', 'code')
    authURL.searchParams.set('code_challenge', codeChallenge)
    authURL.searchParams.set('code_challenge_method', 'S256')

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
    const error = url.searchParams.get('error')

    if (error !== null) {
      throw new Error(`Authorization failed: ${error}`)
    }

    if (url.searchParams.get('state') !== state) {
      throw new Error('Authorization failed: state mismatch')
    }

    const code = url.searchParams.get('code')

    if (code === null) {
      throw new Error('Authorization failed: missing code')
    }

    const response = await fetch(`${baseURL}/oauth/access_token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: CLIENT_ID,
        code,
        redirect_uri: redirectURL,
        code_verifier: codeVerifier
      })
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error ?? `Token exchange failed: ${response.status}`)
    }

    if (typeof data.access_token !== 'string') {
      throw new Error('Token exchange failed: missing access token')
    }

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
