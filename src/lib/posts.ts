import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

export interface Post {
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
  url: string
  _id: string
}

const postsDirectory = path.join(process.cwd(), 'content/blog')

export function getAllPosts(): Post[] {
  // Vérifier si le dossier existe
  if (!fs.existsSync(postsDirectory)) {
    return []
  }

  const fileNames = fs.readdirSync(postsDirectory)
  const allPostsData = fileNames
    .filter((fileName) => fileName.endsWith('.mdx'))
    .map((fileName) => {
      // Retirer ".mdx" du nom de fichier pour obtenir le slug
      const slug = fileName.replace(/\.mdx$/, '')

      // Lire le fichier markdown
      const fullPath = path.join(postsDirectory, fileName)
      const fileContents = fs.readFileSync(fullPath, 'utf8')

      // Utiliser gray-matter pour parser le frontmatter
      const { data, content } = matter(fileContents)

      // Combiner les données avec le slug
      return {
        slug,
        title: data.title || '',
        description: data.description || '',
        date: data.date || '',
        author: data.author || '',
        tags: data.tags || [],
        locale: data.locale || 'fr',
        featured: data.featured || false,
        image: data.image || '',
        content,
        url: `/blog/${slug}`,
        _id: slug,
      } as Post
    })

  // Trier les posts par date (du plus récent au plus ancien)
  return allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1
    } else {
      return -1
    }
  })
}

export function getPostBySlug(slug: string): Post | undefined {
  const allPosts = getAllPosts()
  return allPosts.find((post) => post.slug === slug)
}

export function getFeaturedPosts(): Post[] {
  const allPosts = getAllPosts()
  return allPosts.filter((post) => post.featured)
}

