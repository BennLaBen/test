import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAdminFromRequest } from '@/lib/auth/admin-guard'

export const dynamic = 'force-dynamic'

// GET /api/v2/products — List products with filters, search, pagination
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'))
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '50')))
    const skip = (page - 1) * limit

    // Filters
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const helicopter = searchParams.get('helicopter')
    const inStock = searchParams.get('inStock')
    const featured = searchParams.get('featured')
    const adminFlag = searchParams.get('admin') // admin=true → include unpublished
    const sort = searchParams.get('sort') || 'name' // name, newest, price

    // Build where clause — admin=true requires actual admin auth
    let showAll = false
    if (adminFlag === 'true') {
      const admin = await getAdminFromRequest()
      showAll = !!admin
    }
    const where: any = showAll ? {} : { published: true }

    if (category && category !== 'all') {
      where.category = { slug: category }
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { shortDescription: { contains: search, mode: 'insensitive' } },
        { sku: { contains: search, mode: 'insensitive' } },
        { compatibility: { has: search } },
      ]
    }

    if (helicopter) {
      where.compatibility = { has: helicopter }
    }

    if (inStock === 'true') {
      where.inStock = true
    }

    if (featured === 'true') {
      where.isFeatured = true
    }

    // Build orderBy
    let orderBy: any = { name: 'asc' }
    if (sort === 'newest') orderBy = { createdAt: 'desc' }
    if (sort === 'price') orderBy = { priceNet: 'asc' }

    const [products, total] = await Promise.all([
      prisma.marketProduct.findMany({
        where,
        include: {
          category: true,
          documents: true,
          _count: { select: { quoteItems: true } },
        },
        orderBy,
        skip,
        take: limit,
      }),
      prisma.marketProduct.count({ where }),
    ])

    return NextResponse.json({
      success: true,
      data: products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    }, {
      headers: { 'Cache-Control': 'no-store, max-age=0' },
    })
  } catch (error) {
    console.error('[API v2] GET /products error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

// POST /api/v2/products — Create a new product (admin only)
export async function POST(request: NextRequest) {
  try {
    const admin = await getAdminFromRequest()
    if (!admin) {
      return NextResponse.json({ success: false, error: 'Accès non autorisé' }, { status: 403 })
    }

    const body = await request.json()

    const { name, slug, sku, categoryId, description, shortDescription, image } = body
    if (!name || !slug || !sku || !categoryId) {
      return NextResponse.json({ success: false, error: 'Champs requis: name, slug, sku, categoryId' }, { status: 400 })
    }

    const product = await prisma.marketProduct.create({
      data: {
        name,
        slug,
        sku,
        categoryId,
        description: description || '',
        shortDescription: shortDescription || '',
        image: image || '',
        gallery: body.gallery || [],
        features: body.features || [],
        specs: body.specs || {},
        tolerances: body.tolerances || undefined,
        materialsData: body.materialsData || undefined,
        priceDisplay: body.priceDisplay || 'SUR DEVIS',
        priceNet: body.priceNet || undefined,
        compatibility: body.compatibility || [],
        usage: body.usage || [],
        material: body.material || '',
        inStock: body.inStock ?? true,
        stockQuantity: body.stockQuantity ?? 0,
        minOrder: body.minOrder ?? 1,
        leadTime: body.leadTime || undefined,
        warranty: body.warranty || undefined,
        isNew: body.isNew ?? false,
        isFeatured: body.isFeatured ?? false,
        published: body.published ?? true,
        model3d: body.model3d || undefined,
        turntable: body.turntable || undefined,
        boughtTogether: body.boughtTogether || [],
        faq: body.faq || undefined,
        certifications: body.certifications || [],
        standards: body.standards || [],
        applications: body.applications || [],
      },
      include: { category: true, documents: true },
    })

    return NextResponse.json({ success: true, data: product }, { status: 201 })
  } catch (error: any) {
    console.error('[API v2] POST /products error:', error)
    if (error?.code === 'P2002') {
      return NextResponse.json({ error: 'Un produit avec ce slug ou SKU existe déjà' }, { status: 409 })
    }
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
