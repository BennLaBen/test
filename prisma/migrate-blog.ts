/**
 * Migration script: MDX Blog Posts → PostgreSQL Database
 * Run with: npx tsx prisma/migrate-blog.ts
 */

import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

// Set DATABASE_URL for Docker PostgreSQL on port 5433 if not already set
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = 'postgresql://lledo:lledo_secret_2024@localhost:5433/lledo_db'
}

const prisma = new PrismaClient()

const BLOG_DIR = path.join(process.cwd(), 'content/blog')

interface MdxPost {
  slug: string
  title: string
  description: string
  date: string
  author: string
  tags: string[]
  locale: string
  featured: boolean
  image: string
  content: string
}

function parseMdxFile(filePath: string): MdxPost | null {
  try {
    const fileContents = fs.readFileSync(filePath, 'utf8')
    const { data, content } = matter(fileContents)
    const slug = path.basename(filePath, '.mdx')

    return {
      slug,
      title: data.title || '',
      description: data.description || '',
      date: data.date || new Date().toISOString(),
      author: data.author || 'LLEDO Industries',
      tags: data.tags || [],
      locale: data.locale || 'fr',
      featured: data.featured || false,
      image: data.image || '',
      content: content.trim(),
    }
  } catch (error) {
    console.error(`Error parsing ${filePath}:`, error)
    return null
  }
}

async function migrateBlogPosts() {
  console.log('🚀 Starting blog migration: MDX → Database\n')

  // Check if blog directory exists
  if (!fs.existsSync(BLOG_DIR)) {
    console.error('❌ Blog directory not found:', BLOG_DIR)
    process.exit(1)
  }

  // Get all MDX files
  const files = fs.readdirSync(BLOG_DIR).filter(f => f.endsWith('.mdx'))
  console.log(`📁 Found ${files.length} MDX files\n`)

  let migrated = 0
  let skipped = 0
  let errors = 0

  for (const file of files) {
    const filePath = path.join(BLOG_DIR, file)
    const post = parseMdxFile(filePath)

    if (!post) {
      console.log(`❌ Failed to parse: ${file}`)
      errors++
      continue
    }

    try {
      // Check if post already exists
      const existing = await prisma.blogPost.findUnique({
        where: { slug: post.slug }
      })

      if (existing) {
        console.log(`⏭️  Skipping (exists): ${post.slug}`)
        skipped++
        continue
      }

      // Create new post in database
      await prisma.blogPost.create({
        data: {
          slug: post.slug,
          title: post.title,
          excerpt: post.description,
          content: post.content,
          image: post.image,
          tags: post.tags,
          published: true,
          featured: post.featured,
          authorName: post.author,
          publishedAt: new Date(post.date),
        }
      })

      console.log(`✅ Migrated: ${post.slug}`)
      migrated++
    } catch (error) {
      console.error(`❌ Error migrating ${post.slug}:`, error)
      errors++
    }
  }

  console.log('\n' + '='.repeat(50))
  console.log('📊 Migration Summary:')
  console.log(`   ✅ Migrated: ${migrated}`)
  console.log(`   ⏭️  Skipped:  ${skipped}`)
  console.log(`   ❌ Errors:   ${errors}`)
  console.log('='.repeat(50))

  await prisma.$disconnect()
}

migrateBlogPosts()
  .catch((error) => {
    console.error('Migration failed:', error)
    process.exit(1)
  })
