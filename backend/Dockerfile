FROM python:3.10-slim

WORKDIR /app

# Copy requirements and install them
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# ✅ Install missing dependency manually (without changing requirements.txt)
RUN pip install --no-cache-dir "pydantic[email]"

# Copy all backend code
COPY . .

# Run the FastAPI app
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
