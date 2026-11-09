import './globals.css'
import type { Metadata } from 'next'
import localFont from 'next/font/local'
import Script from 'next/script'
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

// Missing /_next/static files are served as 404s cacheable for hours. If one is
// fetched mid-deploy (old/new deployment skew), browsers and Cloudflare keep the
// 404 and the page stays unstyled; refetching with a fresh query string bypasses it.
// Chrome still attaches an empty sheet to a failed stylesheet, so check for rules.
const stylesheetRecovery = `addEventListener("load",function(){document.querySelectorAll('link[rel="stylesheet"]').forEach(function(l){if(l.dataset.retried)return;try{if(l.sheet&&l.sheet.cssRules.length)return}catch(e){return}l.dataset.retried="1";var r=l.cloneNode();r.href=l.href+(l.href.indexOf("?")<0?"?":"&")+"retry="+Date.now();l.after(r)})})`

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
        <html lang="en">
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
                <Script id="stylesheet-recovery" strategy="beforeInteractive">
                    {stylesheetRecovery}
                </Script>
                {children}
                <Analytics />
                <SpeedInsights />
            </body>
        </html>
    )
}
