import { NextResponse } from 'next/server'

const openApiSpec = {
  openapi: '3.1.0',
  info: {
    title: 'LLEDO Aerotools Marketplace API',
    version: '2.0.0',
    description: 'API B2B pour la marketplace d\'outillage sol hélicoptères LLEDO Aerotools. Permet la gestion des produits, devis (RFQ), commandes, traçabilité et organisations.',
    contact: { name: 'LLEDO Aerotools', email: 'contact@mpeb13.com', url: 'https://lledo-industries.com' },
    license: { name: 'Proprietary' },
  },
  servers: [
    { url: '/api/v2', description: 'API v2 — Production' },
  ],
  tags: [
    { name: 'Products', description: 'Catalogue produits GSE' },
    { name: 'Categories', description: 'Catégories de produits' },
    { name: 'Quotes', description: 'Demandes de devis (RFQ)' },
    { name: 'Orders', description: 'Commandes' },
    { name: 'Traceability', description: 'Traçabilité par numéro de série' },
    { name: 'Search', description: 'Recherche full-text' },
    { name: 'Notifications', description: 'Notifications utilisateur' },
    { name: 'Webhooks', description: 'Webhooks pour intégration ERP' },
  ],
  paths: {
    '/products': {
      get: {
        tags: ['Products'],
        summary: 'Lister les produits',
        description: 'Retourne une liste paginée de produits avec filtres optionnels.',
        parameters: [
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 50, maximum: 100 } },
          { name: 'category', in: 'query', schema: { type: 'string' }, description: 'Slug de catégorie' },
          { name: 'search', in: 'query', schema: { type: 'string' }, description: 'Recherche texte (nom, description, SKU)' },
          { name: 'helicopter', in: 'query', schema: { type: 'string' }, description: 'Type d\'hélicoptère (ex: H160, NH90)' },
          { name: 'inStock', in: 'query', schema: { type: 'boolean' } },
          { name: 'featured', in: 'query', schema: { type: 'boolean' } },
          { name: 'sort', in: 'query', schema: { type: 'string', enum: ['name', 'newest', 'price'] } },
        ],
        responses: {
          200: { description: 'Liste de produits', content: { 'application/json': { schema: { $ref: '#/components/schemas/ProductListResponse' } } } },
        },
      },
    },
    '/products/{id}': {
      get: {
        tags: ['Products'],
        summary: 'Détail d\'un produit',
        description: 'Retourne un produit par slug, ID, ou SKU avec produits associés.',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'Slug, ID ou SKU du produit' }],
        responses: {
          200: { description: 'Produit trouvé' },
          404: { description: 'Produit introuvable' },
        },
      },
      patch: {
        tags: ['Products'],
        summary: 'Mettre à jour un produit (admin)',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: { content: { 'application/json': { schema: { $ref: '#/components/schemas/ProductUpdate' } } } },
        responses: { 200: { description: 'Produit mis à jour' } },
      },
      delete: {
        tags: ['Products'],
        summary: 'Supprimer un produit (admin)',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Produit supprimé' } },
      },
    },
    '/products/categories': {
      get: {
        tags: ['Categories'],
        summary: 'Lister les catégories',
        description: 'Retourne toutes les catégories avec le nombre de produits.',
        responses: { 200: { description: 'Liste de catégories' } },
      },
    },
    '/quotes': {
      get: {
        tags: ['Quotes'],
        summary: 'Lister les devis',
        parameters: [
          { name: 'status', in: 'query', schema: { type: 'string', enum: ['DRAFT', 'SUBMITTED', 'IN_REVIEW', 'QUOTED', 'ACCEPTED', 'REJECTED', 'EXPIRED', 'CONVERTED'] } },
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 20 } },
        ],
        responses: { 200: { description: 'Liste de devis' } },
      },
      post: {
        tags: ['Quotes'],
        summary: 'Créer un devis (RFQ)',
        description: 'Soumet une demande de devis. Envoie un email à l\'admin et une confirmation au client.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/QuoteCreate' },
              example: {
                contactName: 'Jean Dupont',
                contactEmail: 'jean@airbus.com',
                contactCompany: 'Airbus Helicopters',
                contactPhone: '+33 4 42 00 00 00',
                notes: 'Besoin urgent pour maintenance H160',
                items: [{ productId: 'cmXXX', quantity: 2, notes: 'Livraison Marignane' }],
              },
            },
          },
        },
        responses: {
          201: { description: 'Devis créé' },
          400: { description: 'Validation échouée' },
        },
      },
    },
    '/quotes/{id}': {
      get: {
        tags: ['Quotes'],
        summary: 'Détail d\'un devis',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'ID ou référence (QUO-YYYY-NNNN)' }],
        responses: { 200: { description: 'Devis trouvé' }, 404: { description: 'Devis introuvable' } },
      },
      patch: {
        tags: ['Quotes'],
        summary: 'Mettre à jour un devis (admin)',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          content: { 'application/json': { schema: { type: 'object', properties: {
            status: { type: 'string', enum: ['SUBMITTED', 'IN_REVIEW', 'QUOTED', 'ACCEPTED', 'REJECTED', 'EXPIRED', 'CONVERTED'] },
            internalNotes: { type: 'string' },
            totalAmount: { type: 'number' },
            validUntil: { type: 'string', format: 'date-time' },
          } } } },
        },
        responses: { 200: { description: 'Devis mis à jour' } },
      },
    },
    '/orders': {
      get: {
        tags: ['Orders'],
        summary: 'Lister les commandes',
        parameters: [
          { name: 'status', in: 'query', schema: { type: 'string', enum: ['PENDING', 'CONFIRMED', 'IN_PRODUCTION', 'READY_TO_SHIP', 'SHIPPED', 'DELIVERED', 'CANCELLED'] } },
          { name: 'page', in: 'query', schema: { type: 'integer' } },
          { name: 'limit', in: 'query', schema: { type: 'integer' } },
        ],
        responses: { 200: { description: 'Liste de commandes' } },
      },
      post: {
        tags: ['Orders'],
        summary: 'Créer une commande (depuis un devis accepté)',
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { type: 'object', required: ['quoteId'], properties: {
            quoteId: { type: 'string' },
            poNumber: { type: 'string', description: 'N° bon de commande client' },
            paymentMethod: { type: 'string', enum: ['PO', 'WIRE', 'CB'] },
            shippingAddress: { type: 'object' },
            billingAddress: { type: 'object' },
          } } } },
        },
        responses: { 201: { description: 'Commande créée' }, 400: { description: 'Devis non accepté' } },
      },
    },
    '/traceability': {
      get: {
        tags: ['Traceability'],
        summary: 'Rechercher par numéro de série',
        parameters: [{ name: 'serial', in: 'query', required: true, schema: { type: 'string', minLength: 3 } }],
        responses: { 200: { description: 'Résultat de traçabilité' } },
      },
    },
    '/search': {
      get: {
        tags: ['Search'],
        summary: 'Recherche full-text',
        parameters: [
          { name: 'q', in: 'query', required: true, schema: { type: 'string' } },
          { name: 'type', in: 'query', schema: { type: 'string', enum: ['products', 'quotes', 'orders', 'all'] } },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 20 } },
        ],
        responses: { 200: { description: 'Résultats de recherche' } },
      },
    },
    '/notifications': {
      get: {
        tags: ['Notifications'],
        summary: 'Lister les notifications',
        parameters: [
          { name: 'unreadOnly', in: 'query', schema: { type: 'boolean' } },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 20 } },
        ],
        responses: { 200: { description: 'Liste de notifications' } },
      },
    },
    '/webhooks': {
      post: {
        tags: ['Webhooks'],
        summary: 'Enregistrer un webhook ERP',
        requestBody: {
          content: { 'application/json': { schema: { type: 'object', required: ['url', 'events'], properties: {
            url: { type: 'string', format: 'uri' },
            events: { type: 'array', items: { type: 'string', enum: ['quote.created', 'quote.status_changed', 'order.created', 'order.shipped', 'order.delivered', 'product.updated', 'stock.low'] } },
            secret: { type: 'string', description: 'HMAC secret pour vérification' },
          } } } },
        },
        responses: { 201: { description: 'Webhook enregistré' } },
      },
    },
  },
  components: {
    schemas: {
      ProductListResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean' },
          data: { type: 'array', items: { $ref: '#/components/schemas/Product' } },
          pagination: { type: 'object', properties: { page: { type: 'integer' }, limit: { type: 'integer' }, total: { type: 'integer' }, pages: { type: 'integer' } } },
        },
      },
      Product: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          slug: { type: 'string' },
          sku: { type: 'string', description: 'Part Number' },
          name: { type: 'string' },
          category: { $ref: '#/components/schemas/Category' },
          description: { type: 'string' },
          shortDescription: { type: 'string' },
          features: { type: 'array', items: { type: 'string' } },
          specs: { type: 'object' },
          image: { type: 'string' },
          gallery: { type: 'array', items: { type: 'string' } },
          priceDisplay: { type: 'string' },
          compatibility: { type: 'array', items: { type: 'string' }, description: 'Types d\'hélicoptères compatibles' },
          inStock: { type: 'boolean' },
          stockQuantity: { type: 'integer' },
          certifications: { type: 'array', items: { type: 'string' } },
          documents: { type: 'array', items: { $ref: '#/components/schemas/ProductDocument' } },
        },
      },
      Category: {
        type: 'object',
        properties: { id: { type: 'string' }, slug: { type: 'string' }, label: { type: 'string' }, description: { type: 'string' }, icon: { type: 'string' } },
      },
      ProductDocument: {
        type: 'object',
        properties: { id: { type: 'string' }, type: { type: 'string', enum: ['DATASHEET', 'CERTIFICATE', 'MANUAL', 'DRAWING', 'TEST_REPORT'] }, title: { type: 'string' }, url: { type: 'string' } },
      },
      ProductUpdate: {
        type: 'object',
        properties: { name: { type: 'string' }, description: { type: 'string' }, priceDisplay: { type: 'string' }, inStock: { type: 'boolean' }, stockQuantity: { type: 'integer' }, published: { type: 'boolean' } },
      },
      QuoteCreate: {
        type: 'object',
        required: ['contactName', 'contactEmail', 'contactCompany', 'items'],
        properties: {
          contactName: { type: 'string' },
          contactEmail: { type: 'string', format: 'email' },
          contactPhone: { type: 'string' },
          contactCompany: { type: 'string' },
          notes: { type: 'string' },
          items: { type: 'array', items: { type: 'object', required: ['productId', 'quantity'], properties: { productId: { type: 'string' }, quantity: { type: 'integer', minimum: 1 }, notes: { type: 'string' } } } },
        },
      },
    },
  },
}

// GET /api/v2/docs — Return OpenAPI spec
export async function GET() {
  return NextResponse.json(openApiSpec, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'public, s-maxage=3600',
    },
  })
}
