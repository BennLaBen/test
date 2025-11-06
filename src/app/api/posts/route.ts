import { NextResponse } from 'next/server'
import { getAllPosts } from '@/lib/posts'

export async function GET(request: Request) {
  try {
    // Récupérer tous les posts (on ne filtre plus par locale)
    // Les articles sont en français, mais l'interface sera traduite
    const allPosts = getAllPosts()

    return NextResponse.json({ posts: allPosts, success: true })
  } catch (error) {
    console.error('Error fetching posts:', error)
    return NextResponse.json(
      { posts: [], success: false, error: 'Failed to fetch posts' },
      { status: 500 }
    )
  }
}

