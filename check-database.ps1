# ============================================================
# VeyraTech Database Checker
# Quick script to identify which Supabase database you're using
# ============================================================

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "VeyraTech Database Identifier" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if .env file exists
if (-Not (Test-Path ".env")) {
    Write-Host "❌ ERROR: .env file not found!" -ForegroundColor Red
    Write-Host "Please make sure you're in the royaltech directory" -ForegroundColor Yellow
    exit 1
}

Write-Host "✓ Found .env file" -ForegroundColor Green
Write-Host ""

# Read DATABASE_URL from .env
$databaseUrl = Get-Content .env | Select-String -Pattern "DATABASE_URL=" | ForEach-Object { $_.Line.Split('=', 2)[1].Trim('"') }

if (-Not $databaseUrl) {
    Write-Host "❌ ERROR: DATABASE_URL not found in .env file!" -ForegroundColor Red
    exit 1
}

Write-Host "DATABASE CONNECTION INFO:" -ForegroundColor Yellow
Write-Host "=========================" -ForegroundColor Yellow

# Extract project reference from URL
if ($databaseUrl -match "db\.([a-zA-Z0-9]+)\.supabase\.co") {
    $projectRef = $matches[1]
    Write-Host "Supabase Project Reference: $projectRef" -ForegroundColor Cyan
    Write-Host "Supabase Dashboard URL: https://supabase.com/dashboard/project/$projectRef" -ForegroundColor Cyan
    Write-Host ""
}

# Show partial connection string (hide password)
$maskedUrl = $databaseUrl -replace ":[^@]+@", ":****@"
Write-Host "Connection String (masked): $maskedUrl" -ForegroundColor Gray
Write-Host ""

# Try to connect and get database info
Write-Host "ATTEMPTING TO CONNECT..." -ForegroundColor Yellow
Write-Host ""

try {
    # Run a simple query to check connection
    $query = @"
SELECT 
    current_database() as db_name,
    (SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public') as table_count,
    pg_size_pretty(pg_database_size(current_database())) as db_size;
"@

    $result = Invoke-Expression "psql `"$databaseUrl`" -t -c `"$query`"" 2>&1

    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ CONNECTION SUCCESSFUL!" -ForegroundColor Green
        Write-Host ""
        Write-Host "DATABASE INFO:" -ForegroundColor Yellow
        Write-Host $result
        Write-Host ""
        
        # Check for VeyraTech tables
        Write-Host "CHECKING FOR VEYRATECH TABLES..." -ForegroundColor Yellow
        $tableCheck = @"
SELECT 
    table_name,
    (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name) as column_count
FROM information_schema.tables t
WHERE table_schema = 'public' 
    AND table_name IN ('admins', 'leads', 'consultations', 'proposals', 'projects', 'invoices')
ORDER BY table_name;
"@
        
        $tables = Invoke-Expression "psql `"$databaseUrl`" -t -c `"$tableCheck`"" 2>&1
        Write-Host $tables
        Write-Host ""
        
        # Check for admin users
        Write-Host "CHECKING FOR ADMIN USERS..." -ForegroundColor Yellow
        $adminCheck = @"
SELECT 
    email,
    name,
    status,
    TO_CHAR(created_at, 'YYYY-MM-DD') as created
FROM admins
ORDER BY created_at
LIMIT 5;
"@
        
        $admins = Invoke-Expression "psql `"$databaseUrl`" -t -c `"$adminCheck`"" 2>&1
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host $admins
            Write-Host ""
        } else {
            Write-Host "⚠ admins table not found or empty" -ForegroundColor Yellow
            Write-Host ""
        }
        
        Write-Host "========================================" -ForegroundColor Green
        Write-Host "✅ THIS IS YOUR DATABASE!" -ForegroundColor Green
        Write-Host "========================================" -ForegroundColor Green
        Write-Host ""
        Write-Host "Next Steps:" -ForegroundColor Cyan
        Write-Host "1. Go to: https://supabase.com/dashboard/project/$projectRef" -ForegroundColor White
        Write-Host "2. Click on 'SQL Editor'" -ForegroundColor White
        Write-Host "3. Paste the contents of 'add-all-latest-features.sql'" -ForegroundColor White
        Write-Host "4. Click 'Run' to add invoice tables" -ForegroundColor White
        
    } else {
        Write-Host "❌ CONNECTION FAILED!" -ForegroundColor Red
        Write-Host $result -ForegroundColor Red
    }
    
} catch {
    Write-Host "❌ ERROR: Could not connect to database" -ForegroundColor Red
    Write-Host "Error details: $_" -ForegroundColor Red
    Write-Host ""
    Write-Host "TROUBLESHOOTING:" -ForegroundColor Yellow
    Write-Host "1. Check if 'psql' is installed: psql --version" -ForegroundColor White
    Write-Host "2. Verify DATABASE_URL is correct in .env" -ForegroundColor White
    Write-Host "3. Check if your IP is allowed in Supabase" -ForegroundColor White
    Write-Host ""
    Write-Host "ALTERNATIVE: Use Supabase Dashboard" -ForegroundColor Cyan
    Write-Host "1. Go to https://supabase.com/dashboard" -ForegroundColor White
    Write-Host "2. Look for project with name containing 'VeyraTech' or 'royaltech'" -ForegroundColor White
    Write-Host "3. Open SQL Editor and run check-supabase-database.sql" -ForegroundColor White
}

Write-Host ""
Write-Host "Press any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
