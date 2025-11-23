# Quick Setup Script for Local Development

Write-Host "🚀 Setting up local development environment..." -ForegroundColor Cyan
Write-Host ""

# Check if server/.env exists
if (Test-Path "server\.env") {
    Write-Host "✅ server\.env already exists" -ForegroundColor Green
} else {
    Write-Host "📝 Creating server\.env from template..." -ForegroundColor Yellow
    Copy-Item "server\.env.template" "server\.env"
    Write-Host "✅ Created server\.env" -ForegroundColor Green
    Write-Host ""
    Write-Host "⚠️  IMPORTANT: Edit server\.env and add your credentials:" -ForegroundColor Yellow
    Write-Host "   - Cloudinary credentials (required)" -ForegroundColor White
    Write-Host "   - Gmail app password (required)" -ForegroundColor White
    Write-Host "   - GitHub token (optional for local dev)" -ForegroundColor White
    Write-Host ""
}

# Install dependencies
Write-Host "📦 Installing dependencies..." -ForegroundColor Cyan
Write-Host ""

Write-Host "Installing root dependencies..." -ForegroundColor White
npm install

Write-Host "Installing client dependencies..." -ForegroundColor White
npm install --prefix client

Write-Host "Installing server dependencies..." -ForegroundColor White
npm install --prefix server

Write-Host ""
Write-Host "✅ Setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📖 Next steps:" -ForegroundColor Cyan
Write-Host "   1. Edit server\.env with your credentials" -ForegroundColor White
Write-Host "   2. Run 'npm run dev:all' to start both servers" -ForegroundColor White
Write-Host "   3. Open http://localhost:5173 in your browser" -ForegroundColor White
Write-Host ""
Write-Host "📚 For detailed setup instructions, see LOCAL_DEVELOPMENT.md" -ForegroundColor Cyan
