import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Navigation } from '@/components/Navigation'
import { Footer } from '@/components/Footer'
import { SmartNavigator } from '@/components/SmartNavigator'
import { SectionPagination } from '@/components/SectionPagination'
import { TopInfoBar } from '@/components/TopInfoBar'
import { ThemeProvider } from '@/components/ThemeProvider'
import { ClientI18nWrapper } from '@/components/ClientI18nWrapper'
import { AuthProvider } from '@/contexts/AuthContext'
import { QuoteProvider } from '@/contexts/QuoteContext'
import { FloatingCTA } from '@/components/FloatingCTA'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: {
    default: 'LLEDO Industries - Usinage de Précision & Maintenance Industrielle',
    template: '%s | LLEDO Industries'
  },
  description: 'LLEDO Industries : Expert en usinage de précision, tôlerie-chaudronnerie, maintenance industrielle et conception mécanique. 36 ans d\'excellence au service de l\'aéronautique et de la défense. Certifié EN 9100.',
  keywords: [
    'outillage aéronautique',
    'outillage hélicoptère',
    'GSE',
    'ground support equipment',
    'équipements de maintenance aéronautique',
    'LLEDO Industries',
    'LLEDO Aerotools',
    'barre de remorquage hélicoptère',
    'Airbus Helicopters',
    'H125',
    'EC120',
    'AS350',
    'Écureuil',
    'Directive Machines 2006/42/CE',
    'EN 12312',
    'EN 1915'
  ],
  authors: [{ name: 'LLEDO Industries' }],
  creator: 'LLEDO Industries',
  publisher: 'LLEDO Industries',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://lledo-industries.com'),
  alternates: {
    canonical: '/',
    languages: {
      'fr-FR': '/fr',
      'en-US': '/en',
    },
  },
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: 'https://lledo-industries.com',
    title: 'LLEDO Industries - Usinage de Précision & Maintenance Industrielle',
    description: 'LLEDO Industries : Expert en usinage de précision, tôlerie-chaudronnerie, maintenance industrielle et conception mécanique. 36 ans d\'excellence au service de l\'aéronautique et de la défense.',
    siteName: 'LLEDO Industries',
    images: [
      {
        url: '/logo.png',
        width: 512,
        height: 512,
        alt: 'LLEDO Industries - Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LLEDO Industries - Usinage de Précision & Maintenance Industrielle',
    description: 'LLEDO Industries : Expert en usinage de précision, tôlerie-chaudronnerie, maintenance industrielle et conception mécanique. 36 ans d\'excellence.',
    images: ['/logo.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Best-effort: detect locale from pathname on client; default to 'fr'
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        {/* Script pour éviter le flash de contenu - Chargé AVANT tout */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  var shouldBeDark = theme === 'dark' || (!theme && prefersDark);
                  
                  if (shouldBeDark) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
        {process.env.NEXT_PUBLIC_GTM_ID && (
          <script
            dangerouslySetInnerHTML={{
              __html: `
                (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                })(window,document,'script','dataLayer','${process.env.NEXT_PUBLIC_GTM_ID}');
              `,
            }}
          />
        )}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        {/* Theme colors dynamiques selon le mode */}
        <meta name="theme-color" content="#0047FF" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#1E3A8A" media="(prefers-color-scheme: dark)" />
        <meta name="msapplication-TileColor" content="#0047FF" />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        {process.env.NEXT_PUBLIC_GTM_ID && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${process.env.NEXT_PUBLIC_GTM_ID}`}
              height="0"
              width="0"
              style={{ display: 'none', visibility: 'hidden' }}
            />
          </noscript>
        )}
        <ThemeProvider defaultTheme="industrial">
          <ClientI18nWrapper>
            <AuthProvider>
              <QuoteProvider>
                <div className="flex min-h-screen flex-col">
                  <Navigation />
                  <TopInfoBar />
                  <SmartNavigator />
                  <SectionPagination />
                  <FloatingCTA />
                  <main id="main-content" className="flex-1 pt-32">
                    {children}
                  </main>
                  <Footer />
                </div>
              </QuoteProvider>
            </AuthProvider>
          </ClientI18nWrapper>
        </ThemeProvider>
      </body>
    </html>
  )
}
