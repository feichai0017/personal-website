import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ThemeProvider } from "@/components/theme-provider"
import Navbar from '@/components/Navbar'
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/react"

const inter = Inter({ subsets: ['latin'] })
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://personal-website.example.com'
const ogImage = new URL('/img/logo.png', siteUrl).toString()

export const metadata: Metadata = {
    metadataBase: new URL(siteUrl),
    title: {
        default: 'Eric Song | Full Stack & DevOps Engineer',
        template: '%s | Eric Song',
    },
    description: 'Full stack engineer specialising in backend, distributed systems, and DevOps. Projects, experience, and ways to contact Eric.',
    keywords: ['Eric Song', 'Full Stack Engineer', 'DevOps', 'Backend', 'Go', 'TypeScript', 'Distributed Systems', 'Portfolio'],
    openGraph: {
        type: 'website',
        url: siteUrl,
        title: 'Eric Song | Full Stack & DevOps Engineer',
        description: 'Portfolio of Eric Song: backend, distributed systems, DevOps, and full stack projects.',
        siteName: 'Eric Song Portfolio',
        images: [
            {
                url: ogImage,
                width: 1200,
                height: 630,
                alt: 'Eric Song Portfolio',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Eric Song | Full Stack & DevOps Engineer',
        description: 'Portfolio of Eric Song: backend, distributed systems, DevOps, and full stack projects.',
        images: [ogImage],
    },
    alternates: {
        canonical: '/',
    },
    icons: {
        icon: '/img/logo.png',
        apple: '/img/logo.png',
    },
    authors: [{ name: 'Eric Song', url: 'https://github.com/feichai0017' }],
}

export const viewport = {
    width: 'device-width',
    initialScale: 1,
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <link rel="icon" href="/img/logo.png" />
                <link rel="apple-touch-icon" href="/img/logo.png" />
                <link rel="shortcut icon" type="image/png" href="/img/logo.png" />
                <script
                    type="application/ld+json"
                    suppressHydrationWarning
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            '@context': 'https://schema.org',
                            '@type': 'Person',
                            name: 'Eric Song',
                            url: siteUrl,
                            jobTitle: 'Full Stack / DevOps Engineer',
                            sameAs: [
                                'https://github.com/feichai0017',
                                'https://www.linkedin.com/in/guocheng-song-728580318/',
                            ],
                            image: ogImage,
                            worksFor: {
                                '@type': 'Organization',
                                name: 'Independent',
                            },
                        }),
                    }}
                />
            </head>
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
