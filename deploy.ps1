# Script de déploiement automatisé pour LLEDO Industries
# Exécuter: .\deploy.ps1

Write-Host "🚀 DÉPLOIEMENT LLEDO INDUSTRIES" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Vérifier si Git est installé
if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Git n'est pas installé. Installez-le depuis https://git-scm.com" -ForegroundColor Red
    exit 1
}

# Vérifier si Node.js est installé
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Node.js n'est pas installé. Installez-le depuis https://nodejs.org" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Prérequis vérifiés" -ForegroundColor Green
Write-Host ""

# Étape 1: Vérifier les modifications
Write-Host "📝 Étape 1: Vérification des modifications..." -ForegroundColor Yellow
git status

Write-Host ""
$commit = Read-Host "Message de commit (ou appuyez sur Entrée pour 'deploy: production deployment')"
if ([string]::IsNullOrWhiteSpace($commit)) {
    $commit = "deploy: production deployment"
}

# Étape 2: Commit et Push
Write-Host ""
Write-Host "📤 Étape 2: Commit et push vers GitHub..." -ForegroundColor Yellow
git add .
git commit -m "$commit"

$pushResult = git push origin main 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erreur lors du push. Vérifiez votre connexion GitHub." -ForegroundColor Red
    Write-Host $pushResult -ForegroundColor Red
    exit 1
}

Write-Host "✅ Code pushé sur GitHub" -ForegroundColor Green
Write-Host ""

# Étape 3: Vérifier Vercel CLI
Write-Host "🔧 Étape 3: Vérification de Vercel CLI..." -ForegroundColor Yellow
if (-not (Get-Command vercel -ErrorAction SilentlyContinue)) {
    Write-Host "⚠️  Vercel CLI non installé. Installation..." -ForegroundColor Yellow
    npm install -g vercel
}

Write-Host "✅ Vercel CLI prêt" -ForegroundColor Green
Write-Host ""

# Étape 4: Déploiement Vercel
Write-Host "🌐 Étape 4: Déploiement sur Vercel..." -ForegroundColor Yellow
Write-Host "Connectez-vous à Vercel si demandé..." -ForegroundColor Cyan
Write-Host ""

vercel --prod

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ DÉPLOIEMENT RÉUSSI!" -ForegroundColor Green
    Write-Host ""
    Write-Host "🎉 Votre site est maintenant en ligne!" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "📋 Prochaines étapes:" -ForegroundColor Yellow
    Write-Host "1. Vérifiez que la base de données Railway est configurée" -ForegroundColor White
    Write-Host "2. Ajoutez les variables d'environnement dans Vercel Dashboard" -ForegroundColor White
    Write-Host "3. Initialisez la base de données avec: npm run db:push" -ForegroundColor White
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "❌ Erreur lors du déploiement" -ForegroundColor Red
    Write-Host "Consultez les logs ci-dessus pour plus de détails" -ForegroundColor Yellow
    exit 1
}
