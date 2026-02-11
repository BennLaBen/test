import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// JSON Job Feed for job boards (alternative format)
export async function GET() {
  try {
    const jobs = await prisma.job.findMany({
      where: { published: true },
      orderBy: { createdAt: 'desc' },
    })

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.lledo-industries.com'

    const feed = {
      publisher: 'LLEDO Industries',
      publisherUrl: baseUrl,
      lastUpdated: new Date().toISOString(),
      jobCount: jobs.length,
      jobs: jobs.map(job => ({
        id: job.id,
        title: job.title,
        url: `${baseUrl}/offres/${job.slug}`,
        company: job.department ? `LLEDO Industries - ${job.department}` : 'LLEDO Industries',
        location: job.location,
        country: 'FR',
        type: job.type,
        salary: job.salary,
        description: job.description.replace(/<[^>]*>/g, '').trim(),
        requirements: job.requirements.replace(/<[^>]*>/g, '').trim(),
        benefits: job.benefits?.replace(/<[^>]*>/g, '').trim(),
        postedDate: job.createdAt.toISOString(),
        updatedDate: job.updatedAt.toISOString(),
      })),
    }

    return NextResponse.json(feed, {
      headers: {
        'Cache-Control': 'public, max-age=3600',
      },
    })
  } catch (error) {
    console.error('Error generating JSON feed:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
