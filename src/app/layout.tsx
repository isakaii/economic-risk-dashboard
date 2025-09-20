import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Economic Risk Dashboard',
  description: 'Monitor economic indicators to assess credit risk',
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