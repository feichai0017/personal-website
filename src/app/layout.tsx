import './globals.css'
import type { Metadata } from 'next'
import localFont from 'next/font/local'
import { ThemeProvider } from "@/components/theme-provider"
import Navbar from '@/components/Navbar'
import SmoothScroll from '@/components/SmoothScroll'
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/react"
import { SITE_URL, absoluteUrl } from "@/lib/site"

const geistSans = localFont({
    src: './fonts/GeistVF.woff',
    variable: '--font-geist-sans',
    weight: '100 900',
})

const geistMono = localFont({
    src: './fonts/GeistMonoVF.woff',
    variable: '--font-geist-mono',
    weight: '100 900',
})
const ogImage = absoluteUrl('/img/logo.png')

export const metadata: Metadata = {
    metadataBase: new URL(SITE_URL),
    title: {
        default: 'Guocheng Song | ML Systems & AI Infra Engineer',
        template: '%s | Guocheng Song',
    },
    description: 'Portfolio of Guocheng Song: machine learning systems, AI infra, storage engines, distributed systems, and interactive engineering work.',
    keywords: ['Guocheng Song', 'ML Systems Engineer', 'AI Infra', 'Distributed Systems', 'Storage Engine', 'DuckDB', 'Mooncake', 'OrbitKV', 'KV Cache', 'Portfolio'],
    openGraph: {
        type: 'website',
        url: SITE_URL,
        title: 'Guocheng Song | ML Systems & AI Infra Engineer',
        description: 'Portfolio of Guocheng Song: AI infra, machine learning systems, storage engines, and distributed systems.',
        siteName: 'Guocheng Song Portfolio',
        images: [
            {
                url: ogImage,
                width: 1200,
                height: 630,
                alt: 'Guocheng Song Portfolio',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Guocheng Song | ML Systems & AI Infra Engineer',
        description: 'Portfolio of Guocheng Song: AI infra, machine learning systems, storage engines, and distributed systems.',
        images: [ogImage],
    },
    alternates: {
        canonical: '/',
        types: {
            'application/rss+xml': '/rss.xml',
        },
    },
    icons: {
        icon: '/img/logo.png',
        apple: '/img/logo.png',
    },
    authors: [{ name: 'Guocheng Song', url: 'https://github.com/feichai0017' }],
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
                            name: 'Guocheng Song',
                            url: SITE_URL,
                            jobTitle: 'Machine Learning Systems Engineer',
                            sameAs: [
                                'https://github.com/feichai0017',
                                'https://www.linkedin.com/in/guocheng-song-728580318/',
                            ],
                            image: ogImage,
                            worksFor: {
                                '@type': 'Organization',
                                name: 'ByteDance AML',
                            },
                        }),
                    }}
                />
            </head>
            <body className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="light"
                    enableSystem={false}
                    disableTransitionOnChange
                >
                    <SmoothScroll>
                        <div className="flex min-h-screen flex-col">
                            <Navbar />
                            <div className="flex-grow">
                                {children}
                            </div>
                        </div>
                    </SmoothScroll>
                    <Analytics />
                    <SpeedInsights />
                </ThemeProvider>
            </body>
        </html>
    )
}
