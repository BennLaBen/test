import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { getAdminFromRequest } from '@/lib/auth/admin-guard'
import { z } from 'zod'

// GET /api/admin/companies - Get all companies (admin)
export async function GET(request: NextRequest) {
  try {
    const admin = await getAdminFromRequest()
    if (!admin) {
      return NextResponse.json(
        { success: false, error: 'Accès non autorisé' },
        { status: 403 }
      )
    }

    const companies = await prisma.company.findMany({
      orderBy: { order: 'asc' }
    })

    return NextResponse.json({ success: true, companies })
  } catch (error) {
    console.error('Error fetching companies:', error)
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la récupération' },
      { status: 500 }
    )
  }
}

// POST /api/admin/companies - Create company (admin)
const createCompanySchema = z.object({
  slug: z.string().min(1),
  name: z.string().min(1),
  tagline: z.string().min(1),
  description: z.string().min(10),
  logoUrl: z.string().optional(),
  heroImage: z.string().optional(),
  galleryImages: z.array(z.string()).default([]),
  capabilities: z.any().optional(),
  expertise: z.array(z.string()).default([]),
  certifications: z.array(z.string()).default([]),
  stats: z.any().optional(),
  contactEmail: z.string().email().optional(),
  contactPhone: z.string().optional(),
  address: z.string().optional(),
  published: z.boolean().default(true),
  order: z.number().default(0),
})

export async function POST(request: NextRequest) {
  try {
    const admin = await getAdminFromRequest()
    if (!admin) {
      return NextResponse.json(
        { success: false, error: 'Accès non autorisé' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const data = createCompanySchema.parse(body)

    // Check if slug exists
    const existing = await prisma.company.findUnique({ where: { slug: data.slug } })
    if (existing) {
      return NextResponse.json(
        { success: false, error: 'Ce slug existe déjà' },
        { status: 400 }
      )
    }

    const company = await prisma.company.create({ 
      data: {
        slug: data.slug,
        name: data.name,
        tagline: data.tagline,
        description: data.description,
        logoUrl: data.logoUrl,
        heroImage: data.heroImage,
        galleryImages: data.galleryImages,
        capabilities: data.capabilities,
        expertise: data.expertise,
        certifications: data.certifications,
        stats: data.stats,
        contactEmail: data.contactEmail,
        contactPhone: data.contactPhone,
        address: data.address,
        published: data.published,
        order: data.order,
      }
    })

    // Revalidate pages
    revalidatePath('/nos-expertises')
    revalidatePath(`/societes/${company.slug}`)

    return NextResponse.json({ success: true, company }, { status: 201 })
  } catch (error) {
    console.error('Error creating company:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, errors: error.errors },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la création' },
      { status: 500 }
    )
  }
}
