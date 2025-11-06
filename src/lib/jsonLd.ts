interface OrganizationData {
  name: string
  url: string
  logo: string
  description: string
  address: {
    streetAddress: string
    addressLocality: string
    postalCode: string
    addressCountry: string
  }
  contactPoint: {
    telephone: string
    contactType: string
    email: string
  }
  sameAs: string[]
}

interface ProductData {
  name: string
  description: string
  sku: string
  brand: {
    name: string
  }
  manufacturer: {
    name: string
  }
  category: string
  offers: {
    price: string
    priceCurrency: string
    availability: string
    seller: {
      name: string
    }
  }
  image: string[]
}

interface FAQData {
  question: string
  answer: string
}

interface BreadcrumbData {
  name: string
  item: string
}

interface ArticleData {
  headline: string
  description: string
  image: string
  datePublished: string
  dateModified: string
  author: {
    name: string
  }
  publisher: {
    name: string
    logo: string
  }
}

interface WebPageData {
  name: string
  description: string
  url: string
}

interface LocalBusinessData extends OrganizationData {
  priceRange: string
  openingHours: string[]
  geo: {
    latitude: number
    longitude: number
  }
}

interface JsonLdData {
  Organization: OrganizationData
  Product: ProductData
  FAQPage: FAQData[]
  BreadcrumbList: BreadcrumbData[]
  Article: ArticleData
  WebPage: WebPageData
  LocalBusiness: LocalBusinessData
}

export function generateJsonLd<T extends keyof JsonLdData>({
  type,
  data,
}: {
  type: T
  data: JsonLdData[T]
}) {
  const baseUrl = 'https://lledo-industries.com'

  switch (type) {
    case 'Organization':
      return {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: data.name,
        url: data.url,
        logo: data.logo,
        description: data.description,
        address: {
          '@type': 'PostalAddress',
          streetAddress: data.address.streetAddress,
          addressLocality: data.address.addressLocality,
          postalCode: data.address.postalCode,
          addressCountry: data.address.addressCountry,
        },
        contactPoint: {
          '@type': 'ContactPoint',
          telephone: data.contactPoint.telephone,
          contactType: data.contactPoint.contactType,
          email: data.contactPoint.email,
        },
        sameAs: data.sameAs,
        foundingDate: '1989',
        numberOfEmployees: '70',
        industry: 'Aéronautique',
        areaServed: ['France', 'Europe', 'Afrique', 'Moyen-Orient'],
        knowsAbout: [
          'Outillage aéronautique',
          'Équipements GSE',
          'Maintenance hélicoptère',
          'Conformité normes aéronautiques',
        ],
      }

    case 'Product':
      return {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: data.name,
        description: data.description,
        sku: data.sku,
        brand: {
          '@type': 'Brand',
          name: data.brand.name,
        },
        manufacturer: {
          '@type': 'Organization',
          name: data.manufacturer.name,
        },
        category: data.category,
        offers: {
          '@type': 'Offer',
          price: data.offers.price,
          priceCurrency: data.offers.priceCurrency,
          availability: data.offers.availability,
          seller: {
            '@type': 'Organization',
            name: data.offers.seller.name,
          },
        },
        image: data.image,
        additionalProperty: [
          {
            '@type': 'PropertyValue',
            name: 'Certification',
            value: 'EN 12312',
          },
          {
            '@type': 'PropertyValue',
            name: 'Test CMU',
            value: '1,25×',
          },
          {
            '@type': 'PropertyValue',
            name: 'Conformité',
            value: 'Directive Machines 2006/42/CE',
          },
        ],
      }

    case 'FAQPage':
      return {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: data.map((faq) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.answer,
          },
        })),
      }

    case 'BreadcrumbList':
      return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: data.map((item, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: item.name,
          item: `${baseUrl}${item.item}`,
        })),
      }

    case 'Article':
      return {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: data.headline,
        description: data.description,
        image: data.image,
        datePublished: data.datePublished,
        dateModified: data.dateModified,
        author: {
          '@type': 'Person',
          name: data.author.name,
        },
        publisher: {
          '@type': 'Organization',
          name: data.publisher.name,
          logo: {
            '@type': 'ImageObject',
            url: data.publisher.logo,
          },
        },
      }

    case 'WebPage':
      return {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: data.name,
        description: data.description,
        url: data.url,
      }

    case 'LocalBusiness':
      return {
        '@context': 'https://schema.org',
        '@type': 'LocalBusiness',
        name: data.name,
        url: data.url,
        logo: data.logo,
        description: data.description,
        priceRange: data.priceRange,
        address: {
          '@type': 'PostalAddress',
          streetAddress: data.address.streetAddress,
          addressLocality: data.address.addressLocality,
          postalCode: data.address.postalCode,
          addressCountry: data.address.addressCountry,
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: data.geo.latitude,
          longitude: data.geo.longitude,
        },
        contactPoint: {
          '@type': 'ContactPoint',
          telephone: data.contactPoint.telephone,
          contactType: data.contactPoint.contactType,
          email: data.contactPoint.email,
        },
        openingHoursSpecification: data.openingHours.map((hours) => ({
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: hours,
        })),
        sameAs: data.sameAs,
      }

    default:
      return {}
  }
}

// Helper functions for common JSON-LD structures
export function generateOrganizationJsonLd() {
  return generateJsonLd({
    type: 'Organization',
    data: {
      name: 'LLEDO Industries',
      url: 'https://lledo-industries.com',
      logo: 'https://lledo-industries.com/images/logo.png',
      description: 'LLEDO Industries, leader français de l\'outillage aéronautique et des équipements GSE pour hélicoptères.',
      address: {
        streetAddress: '9-11 Boulevard de la Capelane',
        addressLocality: 'Les Pennes-Mirabeau',
        postalCode: '13170',
        addressCountry: 'FR',
      },
      contactPoint: {
        telephone: '+33-4-42-02-96-74',
        contactType: 'customer service',
        email: 'contact@lledo-industries.com',
      },
      sameAs: [
        'https://www.linkedin.com/company/lledo-industries',
        'https://www.youtube.com/channel/lledo-industries',
      ],
    },
  })
}

export function generateProductJsonLd(productData: Partial<ProductData>) {
  return generateJsonLd({
    type: 'Product',
    data: {
      name: productData.name || 'Produit LLEDO Industries',
      description: productData.description || 'Équipement GSE certifié pour hélicoptères',
      sku: productData.sku || 'LLEDO-001',
      brand: {
        name: 'LLEDO Industries',
      },
      manufacturer: {
        name: 'LLEDO Industries',
      },
      category: productData.category || 'Équipements GSE',
      offers: {
        price: productData.offers?.price || '0',
        priceCurrency: productData.offers?.priceCurrency || 'EUR',
        availability: productData.offers?.availability || 'https://schema.org/InStock',
        seller: {
          name: 'LLEDO Industries',
        },
      },
      image: productData.image || ['https://lledo-industries.com/images/product-default.jpg'],
    },
  })
}

export function generateFAQJsonLd(faqs: FAQData[]) {
  return generateJsonLd({
    type: 'FAQPage',
    data: faqs,
  })
}

export function generateBreadcrumbJsonLd(breadcrumbs: BreadcrumbData[]) {
  return generateJsonLd({
    type: 'BreadcrumbList',
    data: breadcrumbs,
  })
}

export function generateArticleJsonLd(articleData: ArticleData) {
  return generateJsonLd({
    type: 'Article',
    data: articleData,
  })
}

export function generateWebPageJsonLd(pageData: WebPageData) {
  return generateJsonLd({
    type: 'WebPage',
    data: pageData,
  })
}

export function generateLocalBusinessJsonLd() {
  return generateJsonLd({
    type: 'LocalBusiness',
    data: {
      name: 'LLEDO Industries',
      url: 'https://lledo-industries.com',
      logo: 'https://lledo-industries.com/images/logo.png',
      description: 'LLEDO Industries, leader français des OUTILLAGES aéronautiques et des équipements GSE pour HÉLICOPTÈRES.',
      priceRange: '€€€',
      address: {
        streetAddress: '9-11 Boulevard de la Capelane',
        addressLocality: 'Les Pennes-Mirabeau',
        postalCode: '13170',
        addressCountry: 'FR',
      },
      geo: {
        latitude: 43.4135,
        longitude: 5.3154,
      },
      contactPoint: {
        telephone: '+33-4-42-02-96-74',
        contactType: 'customer service',
        email: 'contact@lledo-industries.com',
      },
      openingHours: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      sameAs: [
        'https://www.linkedin.com/company/lledo-industries',
        'https://www.youtube.com/channel/lledo-industries',
      ],
    },
  })
}
