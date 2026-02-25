import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Indeed XML Job Feed
// Format: https://indeed.force.com/employerSupport1/s/article/115005915483
export async function GET() {
  try {
    const jobs = await prisma.job.findMany({
      where: { published: true },
      orderBy: { createdAt: 'desc' },
    })

    const baseUrl = (process.env.NEXT_PUBLIC_APP_URL || 'https://www.lledo-industries.com').trim()
    const companyName = 'LLEDO Industries'

    const xmlJobs = jobs.map(job => {
      const jobUrl = `${baseUrl}/offres/${job.slug}`
      const postedDate = job.createdAt.toISOString().split('T')[0]
      
      // Map job type to Indeed format
      const jobTypeMap: Record<string, string> = {
        'CDI': 'fulltime',
        'CDD': 'contract',
        'Stage': 'internship',
        'Alternance': 'apprenticeship',
        'Intérim': 'temporary',
      }
      const indeedJobType = jobTypeMap[job.type] || 'fulltime'

      // Clean description (remove HTML tags for plain text)
      const cleanDescription = job.description
        .replace(/<[^>]*>/g, '')
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .trim()

      const cleanRequirements = job.requirements
        .replace(/<[^>]*>/g, '')
        .replace(/&nbsp;/g, ' ')
        .trim()

      return `
    <job>
      <title><![CDATA[${job.title}]]></title>
      <date>${postedDate}</date>
      <referencenumber>${job.id}</referencenumber>
      <url><![CDATA[${jobUrl}]]></url>
      <company><![CDATA[${job.department ? `${companyName} - ${job.department}` : companyName}]]></company>
      <city><![CDATA[${job.location.split(',')[0].trim()}]]></city>
      <country>FR</country>
      <description><![CDATA[${cleanDescription}

PROFIL RECHERCHÉ:
${cleanRequirements}

${job.benefits ? `AVANTAGES:\n${job.benefits.replace(/<[^>]*>/g, '')}` : ''}
${job.salary ? `\nSALAIRE: ${job.salary}` : ''}]]></description>
      <jobtype>${indeedJobType}</jobtype>
      ${job.salary ? `<salary><![CDATA[${job.salary}]]></salary>` : ''}
    </job>`
    }).join('')

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<source>
  <publisher>${companyName}</publisher>
  <publisherurl>${baseUrl}</publisherurl>
  <lastBuildDate>${new Date().toISOString()}</lastBuildDate>
${xmlJobs}
</source>`

    return new NextResponse(xml, {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600', // Cache 1 hour
      },
    })
  } catch (error) {
    console.error('Error generating Indeed feed:', error)
    return new NextResponse(
      `<?xml version="1.0" encoding="UTF-8"?><error>Internal server error</error>`,
      { status: 500, headers: { 'Content-Type': 'application/xml' } }
    )
  }
}
