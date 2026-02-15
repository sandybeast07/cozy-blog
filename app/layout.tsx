import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'My Cozy Journal',
  description: 'A warm place for your thoughts and feelings',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
