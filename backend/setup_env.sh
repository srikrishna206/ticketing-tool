#!/bin/bash
# =====================================================
# FlowTrack Backend - Environment Setup Script (Linux/Mac)
# =====================================================

echo ""
echo "========================================"
echo "FlowTrack Environment Setup"
echo "========================================"
echo ""

# Check if .env already exists
if [ -f .env ]; then
    echo "[WARNING] .env file already exists!"
    echo ""
    read -p "Do you want to overwrite it? (y/N): " overwrite
    if [ "$overwrite" != "y" ] && [ "$overwrite" != "Y" ]; then
        echo "Setup cancelled. Existing .env file preserved."
        exit 0
    fi
fi

# Copy template to .env
echo "Creating .env file from template..."
cp env.template .env

if [ $? -ne 0 ]; then
    echo "[ERROR] Failed to create .env file"
    echo "Please manually copy env.template to .env"
    exit 1
fi

echo "[SUCCESS] .env file created successfully!"
echo ""
echo "========================================"
echo "IMPORTANT: Next Steps"
echo "========================================"
echo ""
echo "1. Edit the .env file with your actual values:"
echo "   - Update DATABASE_URL with your database credentials"
echo "   - Generate a SECRET_KEY with: python -c \"import secrets; print(secrets.token_urlsafe(32))\""
echo "   - Update ALLOWED_ORIGINS for your environment"
echo ""
echo "2. For production deployment:"
echo "   - Set ENVIRONMENT=production"
echo "   - Set DEBUG=False"
echo "   - Use strong passwords"
echo ""
echo "3. Review ENV_SETUP_GUIDE.md for detailed instructions"
echo ""
echo "========================================"
echo ""
echo "Would you like to edit the .env file now?"
read -p "(y/N): " edit_now

if [ "$edit_now" = "y" ] || [ "$edit_now" = "Y" ]; then
    # Try to use the user's preferred editor
    if [ -n "$EDITOR" ]; then
        $EDITOR .env
    elif command -v nano &> /dev/null; then
        nano .env
    elif command -v vim &> /dev/null; then
        vim .env
    elif command -v vi &> /dev/null; then
        vi .env
    else
        echo "No editor found. Please manually edit .env file."
    fi
fi

echo ""
echo "Setup complete!"
echo ""

