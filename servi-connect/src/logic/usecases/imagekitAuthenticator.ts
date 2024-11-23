import { HOST_URL } from 'config'

export const imagekitAuthenticator = async () => {
  try {
    const response = await fetch(`${HOST_URL}api/auth/imagekit`)
    if (!response.ok) {
      return { signature: null, expire: null, token: null }
    }
    return await response.json()
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (_) {
    return { signature: null, expire: null, token: null }
  }
}
