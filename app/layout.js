import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Lettersforme — Write. Listen. Feel.',
  description: 'An anonymous message platform that lets people send heartfelt letters with songs. Each session lasts 21 days before disappearing.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}