import './globals.css'
import { Inter } from 'next/font/google'
import { ThemeProvider } from "@/components/theme-provider"
import Navbar from '@/components/Navbar'
import { Analytics } from "@vercel/analytics/react"
import {SpeedInsights} from "@vercel/speed-insights/react";

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
    title: 'Eric - Personal Website',
    description: 'Welcome to my personal website showcasing my projects and skills.',
}

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    return (
        <html lang="en" suppressHydrationWarning>
        <body className={`${inter.className} bg-morandi-bg text-morandi-text min-h-screen flex flex-col`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <Navbar />
            {children}
            <Analytics/>
            <SpeedInsights/>

        </ThemeProvider>
        </body>
        </html>
    )
}