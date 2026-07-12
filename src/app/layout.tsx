import type { Metadata } from 'next'
import { Cairo, Inter } from 'next/font/google'
import { ThemeProvider } from 'next-themes'
import { Toaster } from 'sonner'
import AppLayout from '@/components/layout/AppLayout'
import './globals.css'

const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  variable: '--font-cairo',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'TrainEye AI | مركز إدارة مترو الرياض',
  description: 'منصة إدارة عمليات المترو الذكية - Riyadh Metro Command Center. نظام متكامل لإدارة وmonitoring شبكة مترو الرياض بالوقت الفعلي.',
  keywords: ['Riyadh Metro', 'TrainEye', 'metro operations', 'command center', 'عمليات المترو', 'مركز الأوامر'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ar" dir="rtl" className={`${cairo.variable} ${inter.variable}`} suppressHydrationWarning>
      <body className="font-cairo antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <AppLayout>
            {children}
          </AppLayout>
          <Toaster theme="dark" position="top-center" />
        </ThemeProvider>
      </body>
    </html>
  )
}
