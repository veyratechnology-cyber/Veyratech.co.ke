# 🗄️ Complete Database Setup Guide

This guide explains how to set up the complete VeyraTech database from scratch using the single SQL file.

---

## 📦 What's Included

The `COMPLETE_DATABASE_SCHEMA.sql` file contains:

### ✅ **All Tables (40+ tables)**
- CRM System (Leads, Prospects, Consultations, Proposals, Projects)
- Learning Module (Applications, Profiles, Programmes, Modules, Lessons, Enrollments)
- Invoicing & Billing (Invoices, Invoice Items, Payments)
- Content Management (Insights, Services, Industries)
- Admin System (Admins, Notifications, Audit Logs)
- Documents & Assessments

### ✅ **All Enums (20+ types)**
- Industry, CompanySize, ServiceArea
- LeadStatus, ProspectStatus, ConsultationStatus
- ProposalStatus, ProjectStatus, InvoiceStatus
- And more...

### ✅ **All Indexes**
- Performance-optimized indexes on foreign keys
- Email, status, and date indexes
- Full-text search ready

### ✅ **Initial Data**
- 7 Services (Website Development, Custom Software, etc.)
- 6 Industries (Retail, Healthcare, Hospitality, etc.)
- 4 Learning Programmes (Web Dev, Cybersecurity, Data Science, Mobile)

### ✅ **Verification Queries**
- Shows all created tables
- Lists all enums with values
- Displays record counts
- Confirms successful setup

---

## 🚀 Quick Start

### Option 1: Using psql Command Line

```bash
# Navigate to project directory
cd c:\Users\HomePC\Documents\RoyalTech\royaltech

# Run the SQL file
psql $env:DATABASE_URL -f COMPLETE_DATABASE_SCHEMA.sql
```

### Option 2: Using Prisma (Recommended)

```bash
# Navigate to project directory
cd c:\Users\HomePC\Documents\RoyalTech\royaltech

# Execute via Prisma
npx prisma db execute --file COMPLETE_DATABASE_SCHEMA.sql --schema prisma/schema.prisma
```

### Option 3: Using Supabase Dashboard

1. Go to your Supabase project
2. Click "SQL Editor" in the sidebar
3. Click "New Query"
4. Copy and paste the entire contents of `COMPLETE_DATABASE_SCHEMA.sql`
5. Click "Run" (F5)

### Option 4: Using PowerShell

```powershell
# Load DATABASE_URL from .env
$env:DATABASE_URL = (Get-Content .env | Select-String -Pattern '^DATABASE_URL=' | ForEach-Object { $_ -replace '^DATABASE_URL=', '' })

# Run the SQL file
psql $env:DATABASE_URL -f COMPLETE_DATABASE_SCHEMA.sql
```

---

## 📋 Pre-requisites

### What You Need:
1. **PostgreSQL Database** (Supabase, Railway, Render, or local)
2. **Database URL** in your `.env` file
3. **Prisma CLI** (optional but recommended)

### Check Your Setup:

```bash
# 1. Verify .env file has DATABASE_URL
cat .env | grep DATABASE_URL

# 2. Test database connection
npx prisma db pull

# 3. Check Prisma is working
npx prisma --version
```

---

## 🔧 Step-by-Step Setup

### Step 1: Backup Existing Database (If Any)

```bash
# Export current database (if you have existing data)
pg_dump $env:DATABASE_URL > backup_$(Get-Date -Format 'yyyy-MM-dd').sql
```

### Step 2: Drop Existing Tables (CAUTION!)

**⚠️ WARNING: This will delete ALL existing data!**

```sql
-- Only run if you want to start completely fresh
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO public;
```

### Step 3: Run the Schema File

```bash
npx prisma db execute --file COMPLETE_DATABASE_SCHEMA.sql --schema prisma/schema.prisma
```

### Step 4: Verify Setup

```bash
# Generate Prisma Client
npx prisma generate

# Check tables were created
npx prisma db execute --file verify-tables.sql --schema prisma/schema.prisma
```

### Step 5: Seed Additional Data (Optional)

```bash
# If you have a seed file
npx prisma db seed
```

---

## 🧪 Verification

After running the schema file, you should see:

### ✅ Success Output:

```
BEGIN
CREATE TYPE
CREATE TYPE
... (many CREATE statements)
CREATE TABLE
CREATE TABLE
... (40+ tables)
CREATE INDEX
CREATE INDEX
... (many indexes)
INSERT 0 7    (services)
INSERT 0 6    (industries)
INSERT 0 4    (programmes)
COMMIT

 schemaname |       tablename        | column_count 
------------+------------------------+--------------
 public     | admins                 |            7
 public     | applications           |           15
 public     | assignments            |            9
... (shows all tables)

 enum_name            | values
----------------------+----------------------------------------
 admin_status         | ACTIVE, INACTIVE
 audit_action         | ADMIN_LOGIN, FAILED_LOGIN, ...
... (shows all enums)

 table_name       | records
------------------+---------
 services          |       7
 industries_served |       6
 programmes        |       4
 applications      |       0

✅ Database schema created successfully!
📊 Total tables: 42
```

### ✅ Tables Created:

Run this query to verify:

```sql
SELECT tablename 
FROM pg_tables 
WHERE schemaname = 'public' 
ORDER BY tablename;
```

**Expected Tables:**
- admins
- applications
- assignments
- assessments
- audit_logs
- consultations
- documents
- enrollments
- industries_served
- insights
- invoice_items
- invoices
- leads
- learning_profiles
- lessons
- mentor_assignments
- mentorship_sessions
- modules
- notifications
- payments
- programmes
- projects
- proposals
- prospects
- services
- submissions

---

## 🛠️ Troubleshooting

### Problem: "relation already exists"

**Solution:**
```sql
-- Drop all tables first (CAUTION: Deletes all data!)
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
```

Then run the schema file again.

---

### Problem: "type already exists"

**Solution:**
```sql
-- Drop all custom types
DO $$ DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT typname FROM pg_type WHERE typtype = 'e') LOOP
        EXECUTE 'DROP TYPE IF EXISTS ' || quote_ident(r.typname) || ' CASCADE';
    END LOOP;
END $$;
```

Then run the schema file again.

---

### Problem: "permission denied"

**Solution:**
Ensure your database user has CREATE privileges:

```sql
GRANT ALL PRIVILEGES ON DATABASE your_database TO your_user;
GRANT ALL ON SCHEMA public TO your_user;
```

---

### Problem: "psql: command not found"

**Solutions:**

**Option A:** Install PostgreSQL client:
```bash
# Windows (using Chocolatey)
choco install postgresql

# Or download from postgresql.org
```

**Option B:** Use Prisma instead:
```bash
npx prisma db execute --file COMPLETE_DATABASE_SCHEMA.sql --schema prisma/schema.prisma
```

**Option C:** Use Supabase SQL Editor (web interface)

---

### Problem: File encoding issues

**Solution:**
```powershell
# Convert file to UTF-8
Get-Content COMPLETE_DATABASE_SCHEMA.sql | Set-Content -Encoding UTF8 database-utf8.sql
```

---

## 📊 Database Structure

### Core CRM Tables:
```
admins
  ├── leads
  │   ├── consultations
  │   ├── proposals
  │   │   └── projects
  │   └── invoices
  ├── prospects
  └── audit_logs
```

### Learning Module Tables:
```
applications (student applications)
  └── learning_profiles (students & mentors)
      ├── enrollments
      │   └── programmes
      │       └── modules
      │           └── lessons
      │               └── assignments
      │                   └── submissions
      └── mentor_assignments
          └── mentorship_sessions
```

### Supporting Tables:
```
services (7 pre-loaded)
industries_served (6 pre-loaded)
insights (blog/content)
documents
notifications
```

---

## 🔐 Security Notes

### Important:
1. **Never commit** database credentials to Git
2. **Use environment variables** for DATABASE_URL
3. **Backup regularly** before running schema changes
4. **Test on development** database first
5. **Review changes** before running in production

### Recommended .env structure:
```bash
# Development
DATABASE_URL="postgresql://user:pass@localhost:5432/veyratech_dev"

# Production (Supabase)
DATABASE_URL="postgresql://postgres:[PASSWORD]@[PROJECT].supabase.co:5432/postgres"

# Backup
BACKUP_DATABASE_URL="postgresql://..."
```

---

## 📈 Performance Optimization

The schema includes optimized indexes for:
- ✅ Foreign key relationships
- ✅ Email lookups (leads, prospects, consultations)
- ✅ Status filtering (all main tables)
- ✅ Date range queries (created_at, updated_at)
- ✅ Admin assignment lookups

### Additional Optimization (Optional):

```sql
-- Analyze tables for query optimization
ANALYZE;

-- Vacuum to reclaim space
VACUUM ANALYZE;

-- Create full-text search indexes (if needed)
CREATE INDEX idx_leads_name_fts ON leads USING gin(to_tsvector('english', name));
CREATE INDEX idx_insights_content_fts ON insights USING gin(to_tsvector('english', content));
```

---

## 🔄 Migration from Existing Database

If you have existing data and want to migrate:

### Step 1: Export Existing Data

```bash
# Export only data (no schema)
pg_dump --data-only --table=admins $env:DATABASE_URL > admins_data.sql
pg_dump --data-only --table=leads $env:DATABASE_URL > leads_data.sql
# ... repeat for other tables
```

### Step 2: Run New Schema

```bash
npx prisma db execute --file COMPLETE_DATABASE_SCHEMA.sql --schema prisma/schema.prisma
```

### Step 3: Import Data

```bash
psql $env:DATABASE_URL < admins_data.sql
psql $env:DATABASE_URL < leads_data.sql
# ... repeat for other data files
```

---

## 📞 Support

### If You Need Help:

1. **Check the logs:**
   ```bash
   # Run with verbose output
   psql $env:DATABASE_URL -f COMPLETE_DATABASE_SCHEMA.sql -v ON_ERROR_STOP=1
   ```

2. **Verify your DATABASE_URL:**
   ```bash
   echo $env:DATABASE_URL
   ```

3. **Test connection:**
   ```bash
   psql $env:DATABASE_URL -c "SELECT version();"
   ```

4. **Check Prisma:**
   ```bash
   npx prisma validate
   ```

---

## ✅ Post-Setup Checklist

After running the schema:

- [ ] All 40+ tables created
- [ ] All 20+ enums created
- [ ] All indexes created
- [ ] 7 services inserted
- [ ] 6 industries inserted  
- [ ] 4 programmes inserted
- [ ] Verification queries passed
- [ ] Prisma client generated (`npx prisma generate`)
- [ ] Application builds successfully (`npm run build`)
- [ ] Database connection works in app
- [ ] Admin login works
- [ ] Application form submits successfully

---

## 🎯 Quick Commands Reference

```bash
# Run schema
npx prisma db execute --file COMPLETE_DATABASE_SCHEMA.sql --schema prisma/schema.prisma

# Generate Prisma client
npx prisma generate

# View database structure
npx prisma studio

# Check database connection
npx prisma db pull

# Reset database (CAUTION!)
npx prisma db push --force-reset

# Create migration
npx prisma migrate dev --name init

# Deploy migration
npx prisma migrate deploy
```

---

## 📝 File Location

```
c:\Users\HomePC\Documents\RoyalTech\royaltech\COMPLETE_DATABASE_SCHEMA.sql
```

**File Size:** ~30KB  
**Lines:** ~800+  
**Tables:** 40+  
**Enums:** 20+  
**Initial Records:** 17 (7 services + 6 industries + 4 programmes)

---

## 🚀 Ready to Deploy

Once your local database is set up and tested:

1. **Update Vercel Environment Variables:**
   - Go to Vercel Dashboard
   - Settings → Environment Variables
   - Ensure DATABASE_URL points to production database

2. **Deploy:**
   ```bash
   vercel --prod
   ```

3. **Run migrations on production:**
   ```bash
   # Connect to production database and run schema
   npx prisma db execute --file COMPLETE_DATABASE_SCHEMA.sql --schema prisma/schema.prisma
   ```

---

**Created:** August 23, 2026  
**Database:** PostgreSQL 14+  
**Compatible with:** Supabase, Railway, Render, AWS RDS, Local PostgreSQL
