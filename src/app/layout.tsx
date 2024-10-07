import './globals.css'
import { Inter } from 'next/font/google'
import { ThemeProvider } from "@/components/theme-provider"
import Navbar from '@/components/Navbar'
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/react"

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
    title: 'Eric - Personal Website',
    description: 'Welcome to my personal website showcasing my projects and skills.',
    viewport: 'width=device-width, initial-scale=1',
}

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    return (
        <html lang="en" suppressHydrationWarning>
        <body className={`${inter.className} antialiased`}>
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
            <div className="flex flex-col min-h-screen">
                <Navbar />
                <main className="flex-grow">
                    {children}
                </main>
            </div>
            <Analytics />
            <SpeedInsights />
        </ThemeProvider>
        </body>
        </html>
    )
}