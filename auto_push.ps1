# Auto-Sync Script for JARVIS AI Platform
# Automatically stages, commits, and pushes code changes to GitHub

param (
    [string]$CommitMessage = "Auto-update JARVIS AI code changes"
)

Write-Host "🔄 Checking for changes..." -ForegroundColor Cyan

$status = git status --porcelain
if ($status) {
    Write-Host "📦 Changes detected. Staging files..." -ForegroundColor Yellow
    git add .
    git commit -m "$CommitMessage"
    Write-Host "🚀 Pushing to GitHub (origin main)..." -ForegroundColor Green
    git push origin main
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Successfully pushed to GitHub!" -ForegroundColor Green
    } else {
        Write-Host "❌ Push failed. Please check repository authorization or token." -ForegroundColor Red
    }
} else {
    Write-Host "✨ Everything is up to date. No changes to push." -ForegroundColor Green
}
