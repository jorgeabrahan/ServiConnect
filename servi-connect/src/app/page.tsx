'use client'
import { imagekitAuthenticator } from '@/logic/usecases'
import { IMAGEKIT_PUBLIC_KEY, IMAGEKIT_URL } from 'config'
import { IKUpload, ImageKitProvider } from 'imagekitio-next'

export default function Home() {
  const onError = (err: any) => {
    console.log(err)
  }
  const onSuccess = (res: any) => {
    console.log(res)
  }
  return (
    <main>
      {/* <ImageKitProvider
        publicKey={IMAGEKIT_PUBLIC_KEY}
        urlEndpoint={IMAGEKIT_URL}
        authenticator={imagekitAuthenticator}
      >
        <div>
          <h2>File upload</h2>
          <IKUpload
            fileName='test-upload.png'
            onError={onError}
            onSuccess={onSuccess}
          />
        </div>
      </ImageKitProvider> */}
    </main>
  )
}
