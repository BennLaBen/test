import { NextResponse } from 'next/server'
import { getPostBySlug } from '@/lib/posts'

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params

    // Récupérer le post
    const post = getPostBySlug(slug)

    if (!post) {
      return NextResponse.json(
        { post: null, success: false, error: 'Post not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ post, success: true })
  } catch (error) {
    console.error('Error fetching post:', error)
    return NextResponse.json(
      { post: null, success: false, error: 'Failed to fetch post' },
      { status: 500 }
    )
  }
}

