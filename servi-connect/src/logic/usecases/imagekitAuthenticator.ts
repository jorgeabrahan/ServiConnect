import { HOST_URL } from 'config'

export const imagekitAuthenticator = async () => {
  try {
    const response = await fetch(`${HOST_URL}api/auth/imagekit`)
    if (!response.ok) {
      return { signature: null, expire: null, token: null }
    }
    return await response.json()
  } catch (error) {
    return { signature: null, expire: null, token: null }
  }
}
