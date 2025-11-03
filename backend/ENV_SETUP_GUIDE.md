# Environment Configuration Setup Guide

## 📋 Overview

This guide explains how to set up environment variables for the FlowTrack backend application for better security and deployment practices.

## 🚀 Quick Start

### 1. Create Your .env File

Copy the template file to create your `.env` file:

```bash
# On Linux/Mac
cp env.template .env

# On Windows (PowerShell)
Copy-Item env.template .env

# On Windows (Command Prompt)
copy env.template .env
```

### 2. Update Configuration Values

Edit the `.env` file with your actual values:

```bash
# Use your preferred text editor
nano .env
# or
code .env
# or
notepad .env
```

## 🔧 Configuration Details

### Database Configuration

**Current Setup (Development):**
```env
DATABASE_URL=postgresql+asyncpg://postgres:12345@localhost:5432/flow
```

**Production Setup:**
```env
DATABASE_URL=postgresql+asyncpg://prod_user:secure_password@your-db-host:5432/flowtrack_prod
```

### Security Settings

**Generate a Secret Key:**
```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

Copy the output and set it in your `.env`:
```env
SECRET_KEY=your-generated-secret-key-here
```

### CORS Origins

**Development:**
```env
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001
```

**Production:**
```env
ALLOWED_ORIGINS=https://flowtrack.yourdomain.com,https://admin.flowtrack.yourdomain.com
```

## 📝 Environment Variables Reference

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `DATABASE_URL` | PostgreSQL connection string | - | ✅ Yes |
| `BACKEND_HOST` | Server host address | `0.0.0.0` | ✅ Yes |
| `BACKEND_PORT` | Server port | `8000` | ✅ Yes |
| `ENVIRONMENT` | Environment type | `development` | ✅ Yes |
| `DEBUG` | Debug mode | `True` | ✅ Yes |
| `SECRET_KEY` | Security secret key | - | ⚠️ Recommended |
| `ALLOWED_ORIGINS` | CORS allowed origins | `*` | ⚠️ Recommended |
| `SMTP_HOST` | Email server host | - | ❌ Optional |
| `SMTP_USER` | Email username | - | ❌ Optional |
| `LOG_LEVEL` | Logging level | `INFO` | ❌ Optional |

## 🔒 Security Best Practices

### ✅ DO:
- ✅ Keep `.env` file out of version control (already in `.gitignore`)
- ✅ Use strong, unique passwords for database
- ✅ Generate a random `SECRET_KEY` for production
- ✅ Set `DEBUG=False` in production
- ✅ Specify exact origins in `ALLOWED_ORIGINS` for production
- ✅ Use environment-specific configuration files
- ✅ Regularly rotate passwords and keys
- ✅ Use SSL/TLS for database connections in production

### ❌ DON'T:
- ❌ Commit `.env` files to Git
- ❌ Use default passwords in production
- ❌ Use `ALLOWED_ORIGINS=*` in production
- ❌ Share credentials in plain text
- ❌ Keep `DEBUG=True` in production
- ❌ Use the same SECRET_KEY across environments

## 🌍 Environment-Specific Configurations

### Development Environment

```env
ENVIRONMENT=development
DEBUG=True
DATABASE_URL=postgresql+asyncpg://postgres:12345@localhost:5432/flow
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001
```

### Staging Environment

```env
ENVIRONMENT=staging
DEBUG=False
DATABASE_URL=postgresql+asyncpg://staging_user:staging_pass@staging-db:5432/flowtrack_staging
ALLOWED_ORIGINS=https://staging.flowtrack.com
SECRET_KEY=<staging-secret-key>
```

### Production Environment

```env
ENVIRONMENT=production
DEBUG=False
DATABASE_URL=postgresql+asyncpg://prod_user:secure_pass@prod-db.example.com:5432/flowtrack_prod
ALLOWED_ORIGINS=https://flowtrack.com,https://admin.flowtrack.com
SECRET_KEY=<production-secret-key>
```

## 🐳 Docker Deployment

When deploying with Docker, you can:

### Option 1: Use .env file
```bash
docker run --env-file .env flowtrack-backend
```

### Option 2: Pass individual variables
```bash
docker run \
  -e DATABASE_URL="postgresql+asyncpg://..." \
  -e SECRET_KEY="..." \
  -e ENVIRONMENT="production" \
  flowtrack-backend
```

### Option 3: Docker Compose
```yaml
services:
  backend:
    image: flowtrack-backend
    env_file:
      - .env
    # or
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - SECRET_KEY=${SECRET_KEY}
```

## ☁️ Cloud Deployment

### AWS EC2 / Elastic Beanstalk
- Use AWS Secrets Manager for sensitive data
- Set environment variables in EB configuration
- Use IAM roles for database access

### Azure App Service
- Use Azure Key Vault for secrets
- Set environment variables in App Settings
- Use Managed Identity for database access

### Google Cloud Platform
- Use Secret Manager for sensitive data
- Set environment variables in Cloud Run/App Engine
- Use Cloud SQL connections

### Heroku
```bash
heroku config:set DATABASE_URL="postgresql+asyncpg://..."
heroku config:set SECRET_KEY="..."
heroku config:set ENVIRONMENT="production"
```

## 🧪 Testing Configuration

Create a separate `.env.test` for testing:

```env
ENVIRONMENT=test
DEBUG=True
DATABASE_URL=postgresql+asyncpg://test_user:test_pass@localhost:5432/flowtrack_test
```

Run tests with test environment:
```bash
pytest --env-file=.env.test
```

## 📚 Additional Resources

- [Pydantic Settings Documentation](https://docs.pydantic.dev/latest/concepts/pydantic_settings/)
- [FastAPI Configuration Guide](https://fastapi.tiangolo.com/advanced/settings/)
- [PostgreSQL Connection Strings](https://www.postgresql.org/docs/current/libpq-connect.html#LIBPQ-CONNSTRING)
- [12-Factor App Configuration](https://12factor.net/config)

## 🆘 Troubleshooting

### Environment variables not loading?
1. Check `.env` file is in the backend directory
2. Verify file name is exactly `.env` (not `.env.txt`)
3. Ensure no extra spaces around `=` sign
4. Restart the application after changes

### Database connection errors?
1. Verify `DATABASE_URL` format is correct
2. Check database is running
3. Confirm credentials are correct
4. Test connection manually with psql

### CORS errors?
1. Add your frontend URL to `ALLOWED_ORIGINS`
2. Include protocol (http:// or https://)
3. No trailing slashes
4. Restart backend after changes

## 📞 Support

For issues or questions:
- Check the main README.md
- Review backend logs
- Verify all environment variables are set correctly

---

**Note:** This configuration setup maintains all existing functionality while preparing the application for production deployment.

