import { defineDocumentType, makeSource } from 'contentlayer/source-files'

export const Post = defineDocumentType(() => ({
  name: 'Post',
  filePathPattern: `blog/**/*.mdx`,
  contentType: 'mdx',
  fields: {
    title: {
      type: 'string',
      description: 'The title of the post',
      required: true,
    },
    description: {
      type: 'string',
      description: 'The description of the post',
      required: true,
    },
    date: {
      type: 'date',
      description: 'The date of the post',
      required: true,
    },
    author: {
      type: 'string',
      description: 'The author of the post',
      required: true,
    },
    tags: {
      type: 'list',
      of: { type: 'string' },
      description: 'Tags for the post',
      required: false,
    },
    locale: {
      type: 'string',
      description: 'The locale of the post',
      required: true,
    },
    featured: {
      type: 'boolean',
      description: 'Whether the post is featured',
      required: false,
      default: false,
    },
    image: {
      type: 'string',
      description: 'Featured image URL',
      required: false,
    },
  },
  computedFields: {
    url: {
      type: 'string',
      resolve: (post) => `/blog/${post._raw.flattenedPath.replace('blog/', '')}`,
    },
    slug: {
      type: 'string',
      resolve: (post) => post._raw.flattenedPath.replace('blog/', ''),
    },
  },
}))

export const Product = defineDocumentType(() => ({
  name: 'Product',
  filePathPattern: `products/**/*.mdx`,
  contentType: 'mdx',
  fields: {
    title: {
      type: 'string',
      description: 'The title of the product',
      required: true,
    },
    description: {
      type: 'string',
      description: 'The description of the product',
      required: true,
    },
    sku: {
      type: 'string',
      description: 'Product SKU',
      required: true,
    },
    price: {
      type: 'number',
      description: 'Product price',
      required: false,
    },
    currency: {
      type: 'string',
      description: 'Currency code',
      required: false,
      default: 'EUR',
    },
    category: {
      type: 'string',
      description: 'Product category',
      required: true,
    },
    specifications: {
      type: 'json',
      description: 'Product specifications',
      required: false,
    },
    images: {
      type: 'list',
      of: { type: 'string' },
      description: 'Product images',
      required: false,
    },
    locale: {
      type: 'string',
      description: 'The locale of the product',
      required: true,
    },
    featured: {
      type: 'boolean',
      description: 'Whether the product is featured',
      required: false,
      default: false,
    },
  },
  computedFields: {
    url: {
      type: 'string',
      resolve: (product) => `/produits/${product._raw.flattenedPath.replace('products/', '')}`,
    },
    slug: {
      type: 'string',
      resolve: (product) => product._raw.flattenedPath.replace('products/', ''),
    },
  },
}))

export default makeSource({
  contentDirPath: 'content',
  documentTypes: [Post, Product],
  disableImportAliasWarning: true,
})
