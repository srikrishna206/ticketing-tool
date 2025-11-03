#!/usr/bin/env python3
import sys
import os

try:
    from app.main import app
    print("SUCCESS: App loaded successfully")
    
    routes = [r for r in app.routes if hasattr(r, 'path')]
    print(f"Total routes: {len(routes)}")
    
    admin_routes = [r for r in routes if 'admin' in r.path]
    print(f"Admin routes: {len(admin_routes)}")
    
    for r in admin_routes:
        print(f"  {r.methods} {r.path}")
        
    # Check if schemas are imported correctly
    from app import schemas
    print(f"AdminCreate schema exists: {hasattr(schemas, 'AdminCreate')}")
    print(f"AdminOut schema exists: {hasattr(schemas, 'AdminOut')}")
    print(f"AdminLogin schema exists: {hasattr(schemas, 'AdminLogin')}")
    
except Exception as e:
    print(f"ERROR: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)
