# Quick script to show your database connection info

Write-Host ""
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "VeyraTech Database Information" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# Read .env file
if (Test-Path ".env") {
    $envContent = Get-Content .env -Raw
    
    # Extract DATABASE_URL
    if ($envContent -match 'DATABASE_URL\s*=\s*"?([^"\r\n]+)"?') {
        $dbUrl = $matches[1]
        
        # Extract project reference
        if ($dbUrl -match 'db\.([a-zA-Z0-9]+)\.supabase\.co') {
            $projectRef = $matches[1]
            
            Write-Host "Supabase Project Reference:" -ForegroundColor Yellow
            Write-Host "  $projectRef" -ForegroundColor Green
            Write-Host ""
            
            Write-Host "Supabase Dashboard URL:" -ForegroundColor Yellow
            Write-Host "  https://supabase.com/dashboard/project/$projectRef" -ForegroundColor Cyan
            Write-Host ""
            
            Write-Host "Connection String (masked):" -ForegroundColor Yellow
            $maskedUrl = $dbUrl -replace ':[^@]+@', ':****@'
            Write-Host "  $maskedUrl" -ForegroundColor Gray
            Write-Host ""
            
            Write-Host "=====================================" -ForegroundColor Cyan
            Write-Host "NEXT STEPS:" -ForegroundColor Yellow
            Write-Host "=====================================" -ForegroundColor Cyan
            Write-Host ""
            Write-Host "1. Click the URL above to open Supabase Dashboard" -ForegroundColor White
            Write-Host "2. Go to 'SQL Editor' in the left menu" -ForegroundColor White
            Write-Host "3. Look for tables like 'admins', 'leads', 'consultations'" -ForegroundColor White
            Write-Host "4. If you see VeyraTech data, this is the correct database!" -ForegroundColor White
            Write-Host ""
            
        } else {
            Write-Host "❌ Could not extract project reference from DATABASE_URL" -ForegroundColor Red
            Write-Host ""
            Write-Host "Your DATABASE_URL format seems incorrect." -ForegroundColor Yellow
            Write-Host "Expected format: postgresql://...@db.XXXXXX.supabase.co:5432/..." -ForegroundColor Gray
        }
        
    } else {
        Write-Host "❌ DATABASE_URL not found in .env file" -ForegroundColor Red
    }
    
} else {
    Write-Host "❌ .env file not found!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Make sure you're in the royaltech directory:" -ForegroundColor Yellow
    Write-Host "  cd c:\Users\HomePC\Documents\RoyalTech\royaltech" -ForegroundColor White
}

Write-Host ""
