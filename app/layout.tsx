
import type React from "react"
import "./globals.css"
import '@mantine/core/styles.css';
import type { Metadata } from "next"
import { Manrope, Sora } from "next/font/google"
import Script from "next/script"
import { ColorSchemeScript, MantineProvider } from '@mantine/core';
import Providers from './providers';
import { theme } from '../lib/mantine-theme';
import { brand } from "@/lib/brand"

const manrope = Manrope({ subsets: ["latin"], display: "swap", variable: "--font-sans" })
const sora = Sora({ subsets: ["latin"], display: "swap", variable: "--font-display" })

export const metadata: Metadata = {
  metadataBase: new URL(brand.url),
  title: `${brand.shortName} | AI Brokerage Intelligence Engine`,
  description: brand.description,
  generator: brand.name,
  icons: {
    icon: "/icons/mtc-logo.svg",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`dark ${manrope.variable} ${sora.variable}`}>
      <head>
        <ColorSchemeScript />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover"
        />

        {/* Google Tag Manager (deferred) */}
        <Script id="gtm-script" strategy="lazyOnload">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','GTM-NFLHXXGK');`}
        </Script>

        {/* Google Analytics (deferred) */}
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-W6LV22900R" strategy="lazyOnload" />
        <Script id="gtag-init" strategy="lazyOnload">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-W6LV22900R');
          `}
        </Script>
      </head>
      <body suppressHydrationWarning>
        <MantineProvider theme={theme}>
          <Providers>{children}</Providers>
        </MantineProvider>
      </body>
    </html>
  )
}
