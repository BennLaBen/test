import { NextRequest, NextResponse } from 'next/server'

// Stocker les reviews en mémoire (dans une vraie app, utiliser une BDD)
let reviews: any[] = []

export async function GET() {
  try {
    // Récupérer depuis localStorage simulé (dans une vraie app: BDD)
    return NextResponse.json({ success: true, reviews })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la récupération des avis' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userEmail, userName, company, rating, content, sector } = body

    // Validation
    if (!userEmail || !userName || !rating || !content) {
      return NextResponse.json(
        { success: false, error: 'Données manquantes' },
        { status: 400 }
      )
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { success: false, error: 'Note invalide' },
        { status: 400 }
      )
    }

    // Créer le nouvel avis
    const newReview = {
      id: Date.now().toString(),
      author: userName,
      company: company || 'Client LLEDO',
      role: 'Client',
      email: userEmail,
      rating,
      content,
      sector: sector || 'industrie',
      date: new Date().toISOString(),
      approved: false // Les avis doivent être approuvés par un admin
    }

    reviews.push(newReview)

    return NextResponse.json({ 
      success: true, 
      review: newReview,
      message: 'Votre avis a été soumis et sera publié après validation' 
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la soumission de l\'avis' },
      { status: 500 }
    )
  }
}

