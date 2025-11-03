# 🔐 Environment Variables Configuration

## Quick Setup

### Windows Users
```bash
cd backend
setup_env.bat
```

### Linux/Mac Users
```bash
cd backend
chmod +x setup_env.sh
./setup_env.sh
```

### Manual Setup
```bash
cd backend
copy env.template .env     # Windows
cp env.template .env       # Linux/Mac
```

Then edit `.env` with your actual values.

## 📋 What's Included

### Files Created:

1. **`env.template`** - Template with all configuration options
   - Contains current development settings
   - Ready to copy and use
   - Safe to commit to Git

2. **`ENV_SETUP_GUIDE.md`** - Comprehensive setup guide
   - Detailed explanations for each variable
   - Security best practices
   - Cloud deployment instructions
   - Troubleshooting tips

3. **`.gitignore`** - Updated to exclude `.env` files
   - Prevents accidental commits of secrets
   - Standard Python/FastAPI ignores

4. **Setup Scripts** - Automated setup
   - `setup_env.bat` (Windows)
   - `setup_env.sh` (Linux/Mac)

## 🎯 Current Configuration

Your current settings (from `config.py`):
```python
database_url = "postgresql+asyncpg://postgres:12345@localhost:5432/flow"
backend_host = "0.0.0.0"
backend_port = 8000
```

These values are already in the template file - just copy it to `.env`!

## ⚙️ How It Works

### Before (Hardcoded):
```python
# config.py
database_url: str = "postgresql+asyncpg://postgres:12345@localhost:5432/flow"
```

### After (Using .env):
```python
# config.py
database_url: str = "postgresql+asyncpg://postgres:12345@localhost:5432/flow"  # default fallback

# .env file
DATABASE_URL=postgresql+asyncpg://prod_user:secure_pass@prod-db:5432/flowtrack
```

The `.env` file values override the defaults when present!

## 🚀 Production Deployment

### Before Deploying:

1. ✅ Create `.env` file: `copy env.template .env`
2. ✅ Generate secure SECRET_KEY:
   ```bash
   python -c "import secrets; print(secrets.token_urlsafe(32))"
   ```
3. ✅ Update database credentials
4. ✅ Set production settings:
   ```env
   ENVIRONMENT=production
   DEBUG=False
   ALLOWED_ORIGINS=https://yourdomain.com
   ```
5. ✅ Verify `.env` is in `.gitignore`
6. ✅ Test locally before deploying

### Deployment Checklist:

```
[ ] .env file created
[ ] Strong SECRET_KEY generated
[ ] Production database URL set
[ ] DEBUG=False
[ ] ENVIRONMENT=production
[ ] ALLOWED_ORIGINS updated
[ ] SMTP configured (if using email)
[ ] .env added to .gitignore
[ ] Tested locally
[ ] Secrets secured (not in Git)
```

## 🔒 Security Notes

### ✅ DO:
- Keep `.env` out of version control ✅ (already in .gitignore)
- Use strong, unique passwords
- Generate random SECRET_KEY for production
- Set DEBUG=False in production
- Specify exact CORS origins in production

### ❌ DON'T:
- Don't commit `.env` files
- Don't use default/weak passwords
- Don't use ALLOWED_ORIGINS=* in production
- Don't share credentials in plain text

## 📚 Additional Resources

- **ENV_SETUP_GUIDE.md** - Full documentation
- **env.template** - Configuration template
- **config.py** - Current settings implementation

## 🆘 Need Help?

1. Check `ENV_SETUP_GUIDE.md` for detailed instructions
2. Verify `.env` file is in backend directory
3. Ensure file name is exactly `.env` (no extension)
4. Restart backend after making changes

---

**Note:** All existing functionality remains unchanged. This setup only adds environment variable support for better deployment practices.

