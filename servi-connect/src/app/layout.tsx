import type { Metadata } from 'next'
import './styles/global.css'

export const metadata: Metadata = {
  title: 'ServiConnect - Tu plataforma de servicios de confianza',
  description:
    'Plataforma de conexión con proveedores de servicios locales confiables como electricistas, plomeros, jardineros, y más. Encuentra y solicita servicios fácilmente.'
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en'>
      <body className='antialiased'>{children}</body>
    </html>
  )
}
