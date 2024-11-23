import { NextResponse } from 'next/server'
import ImageKit from 'imagekit'
import { IMAGEKIT_PRIVATE_KEY, IMAGEKIT_PUBLIC_KEY, IMAGEKIT_URL } from 'config'

const imagekit = new ImageKit({
  publicKey: IMAGEKIT_PUBLIC_KEY,
  privateKey: IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: IMAGEKIT_URL
})

export async function GET() {
  const authenticationParameters = imagekit.getAuthenticationParameters()
  return NextResponse.json(authenticationParameters)
}
