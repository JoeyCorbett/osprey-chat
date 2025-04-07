import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/react'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/sonner'
import { ReactQueryProvider } from '@/lib/react-query-provider'


const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Osprey Chat',
  description:
    'Real-time course-based chat app for Stockton University students',
  icons: {
    icon: '/light-favi.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ReactQueryProvider>
          {children}
        </ReactQueryProvider>
        <Toaster closeButton />
        <Analytics />
      </body>
    </html>
  )
}
