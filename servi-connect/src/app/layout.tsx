import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './styles/global.css'
import { Footer, Header, ModalAuth } from '@/components'
import { Toaster } from 'sonner'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ServiConnect - Your trusted service platform',
  description:
    'Connecting platform with trusted local service providers like electricians, plumbers, gardeners, and more. Find and request services easily.'
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en'>
      <body className={`${inter.className} antialiased`}>
        <Header />
        {children}
        <Footer />
        <Toaster richColors />
        <ModalAuth />
      </body>
    </html>
  )
}
