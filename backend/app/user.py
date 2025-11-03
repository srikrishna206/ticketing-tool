from app.database import SessionLocal
from app import models
import bcrypt

# Create a new database session
db = SessionLocal()

# Hash the password
password = "mypassword"  # set the password you want
hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

# Create new user
new_user = models.User(
    full_name="Test User",
    email="test@example.com",
    hashed_password=hashed_password
)

# Add and commit to the database
db.add(new_user)
db.commit()
db.close()

print("✅ User added successfully")
from app.database import SessionLocal
from app import models
import bcrypt

# Create a new database session
db = SessionLocal()

# Hash the password
password = "mypassword"  # set the password you want
hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

# Create new user
new_user = models.User(
    full_name="Test User",
    email="test@example.com",
    hashed_password=hashed_password
)

# Add and commit to the database
db.add(new_user)
db.commit()
db.close()

print("✅ User added successfully")
