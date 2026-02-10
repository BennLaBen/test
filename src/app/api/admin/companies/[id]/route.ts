import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { getAdminFromRequest } from '@/lib/auth/admin-guard'
import { z } from 'zod'

// GET /api/admin/companies/[id]
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await getAdminFromRequest()
    if (!admin) {
      return NextResponse.json(
        { success: false, error: 'Accès non autorisé' },
        { status: 403 }
      )
    }

    const company = await prisma.company.findUnique({
      where: { id: params.id }
    })

    if (!company) {
      return NextResponse.json(
        { success: false, error: 'Entreprise non trouvée' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, company })
  } catch (error) {
    console.error('Error fetching company:', error)
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la récupération' },
      { status: 500 }
    )
  }
}

// PUT /api/admin/companies/[id]
const updateCompanySchema = z.object({
  name: z.string().min(1).optional(),
  tagline: z.string().min(1).optional(),
  description: z.string().min(10).optional(),
  logoUrl: z.string().optional().nullable(),
  heroImage: z.string().optional().nullable(),
  galleryImages: z.array(z.string()).optional(),
  capabilities: z.any().optional(),
  expertise: z.array(z.string()).optional(),
  certifications: z.array(z.string()).optional(),
  stats: z.any().optional(),
  contactEmail: z.string().email().optional().nullable(),
  contactPhone: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  published: z.boolean().optional(),
  order: z.number().optional(),
})

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await getAdminFromRequest()
    if (!admin) {
      return NextResponse.json(
        { success: false, error: 'Accès non autorisé' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const data = updateCompanySchema.parse(body)

    const existing = await prisma.company.findUnique({ where: { id: params.id } })
    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'Entreprise non trouvée' },
        { status: 404 }
      )
    }

    const company = await prisma.company.update({
      where: { id: params.id },
      data,
    })

    // Revalidate pages
    revalidatePath('/nos-expertises')
    revalidatePath(`/societes/${company.slug}`)

    return NextResponse.json({ success: true, company })
  } catch (error) {
    console.error('Error updating company:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, errors: error.errors },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la mise à jour' },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/companies/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await getAdminFromRequest()
    if (!admin) {
      return NextResponse.json(
        { success: false, error: 'Accès non autorisé' },
        { status: 403 }
      )
    }

    const company = await prisma.company.findUnique({ where: { id: params.id } })
    
    await prisma.company.delete({ where: { id: params.id } })

    // Revalidate pages
    revalidatePath('/nos-expertises')
    if (company?.slug) {
      revalidatePath(`/societes/${company.slug}`)
    }

    return NextResponse.json({ success: true, message: 'Entreprise supprimée' })
  } catch (error) {
    console.error('Error deleting company:', error)
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la suppression' },
      { status: 500 }
    )
  }
}
