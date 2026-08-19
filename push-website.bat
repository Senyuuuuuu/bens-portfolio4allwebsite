@echo off
setlocal enabledelayedexpansion

echo.
echo ============================================================
echo   🚀 AUTOMATED WEBSITE PUSH - BENYAMIN NAMTALASHVILI
echo ============================================================
echo.

:: Ensure in correct directory
cd /d "%~dp0"

echo [1/3] 📦 Staging all website changes...
git add -A

echo [2/3] 📝 Creating commit...
for /f "tokens=2 delims==" %%I in ('wmic os get localdatetime /value 2^>nul') do set datetime=%%I
if defined datetime (
    set datestr=!datetime:~0,4!-!datetime:~4,2!-!datetime:~6,2! !datetime:~8,2!:!datetime:~10,2!
) else (
    set datestr=Automated Website Update
)

git commit -m "feat: website update (!datestr!)"

echo [3/3] ☁️ Pushing to GitHub (origin/main)...
git push origin main

if %errorlevel% equ 0 (
    echo.
    echo ============================================================
    echo   ✅ SUCCESS! Website pushed to GitHub.
    echo   ⚡ Netlify is now automatically deploying your live site!
    echo ============================================================
) else (
    echo.
    echo ============================================================
    echo   ❌ Push failed. Please check network/credentials.
    echo ============================================================
)

echo.
