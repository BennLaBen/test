import Head from 'next/head'

interface SEOProps {
  title?: string
  description?: string
  canonical?: string
  ogImage?: string
  ogType?: string
  jsonLd?: object
  noindex?: boolean
  nofollow?: boolean
}

export function SEO({
  title,
  description,
  canonical,
  ogImage = '/logo.png',
  ogType = 'website',
  jsonLd,
  noindex = false,
  nofollow = false,
}: SEOProps) {
  const siteUrl = 'https://lledo-industries.com'
  const fullTitle = title ? `${title} | LLEDO Industries` : 'LLEDO Industries - Usinage de Précision & Maintenance Industrielle'
  const fullDescription = description || 'LLEDO Industries : Expert en usinage de précision, tôlerie-chaudronnerie, maintenance industrielle et conception mécanique. 36 ans d\'excellence au service de l\'aéronautique et de la défense. Certifié EN 9100.'
  const fullCanonical = canonical ? `${siteUrl}${canonical}` : siteUrl
  const fullOgImage = ogImage.startsWith('http') ? ogImage : `${siteUrl}${ogImage}`

  const robots = []
  if (noindex) robots.push('noindex')
  if (nofollow) robots.push('nofollow')
  if (!noindex && !nofollow) robots.push('index', 'follow')

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={fullDescription} />
      <meta name="keywords" content="outillage aéronautique, outillage hélicoptère, GSE, ground support equipment, équipements de maintenance aéronautique, LLEDO Industries, LLEDO Aerotools, barre de remorquage hélicoptère, Airbus Helicopters, H125, EC120, AS350, Directive Machines 2006/42/CE, EN 12312, EN 1915" />
      <meta name="author" content="LLEDO Industries" />
      <meta name="robots" content={robots.join(', ')} />
      <link rel="canonical" href={fullCanonical} />

      {/* Open Graph */}
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={fullDescription} />
      <meta property="og:url" content={fullCanonical} />
      <meta property="og:image" content={fullOgImage} />
      <meta property="og:image:width" content="512" />
      <meta property="og:image:height" content="512" />
      <meta property="og:image:alt" content={title || 'LLEDO Industries'} />
      <meta property="og:site_name" content="LLEDO Industries" />
      <meta property="og:locale" content="fr_FR" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={fullDescription} />
      <meta name="twitter:image" content={fullOgImage} />
      <meta name="twitter:image:alt" content={title || 'LLEDO Industries'} />

      {/* Additional Meta Tags */}
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="theme-color" content="#0c4a6e" />
      <meta name="msapplication-TileColor" content="#0c4a6e" />
      
      {/* Favicon */}
      <link rel="icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="manifest" href="/site.webmanifest" />

      {/* Preconnect to external domains */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

      {/* JSON-LD Structured Data */}
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
    </Head>
  )
}
