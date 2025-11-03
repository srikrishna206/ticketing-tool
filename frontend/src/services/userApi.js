const API_URL = "http://localhost:8000"; // FastAPI server URL

// Helper function to map backend user profile data to frontend format
const mapUserOut = (user) => {
  if (!user) return user;
  
  return {
    id: user.user_id || user.id,
    firstName: user.full_name ? user.full_name.split(' ')[0] : '',
    lastName: user.full_name ? user.full_name.split(' ').slice(1).join(' ') : '',
    name: user.full_name || '',
    email: user.email || '',
    role: user.role || 'Developer',
    department: user.department || 'Engineering',
    active: user.user_status === 'Active',
    mobileNumber: user.mobile_number || '',
    dateOfBirth: user.date_of_birth || '',
    passwordResetNeeded: false, // Default value since backend doesn't have this field
    profileFile: null, // Default value since backend doesn't have this field
    created_at: user.created_at,
    updated_at: user.updated_at
  };
};

// Helper function to map frontend user data to backend format
const mapUserIn = (user) => {
  return {
    full_name: user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.firstName || user.name || '',
    email: user.email || '',
    mobile_number: user.mobileNumber || null,
    role: user.role || 'Developer',
    department: user.department || 'Engineering',
    date_of_birth: user.dateOfBirth || null,
    user_status: user.active ? 'Active' : 'Inactive'
  };
};

// Get all users
export async function listUsers() {
  try {
    const res = await fetch(`${API_URL}/users/`);
    if (!res.ok) {
      throw new Error(`Failed to fetch users: ${res.status} ${res.statusText}`);
    }
    const data = await res.json();
    if (Array.isArray(data)) {
      return data.map(mapUserOut);
    }
    return [];
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
}

// Get a specific user by ID
export async function getUser(userId) {
  try {
    const res = await fetch(`${API_URL}/users/${userId}`);
    if (!res.ok) {
      throw new Error(`Failed to fetch user: ${res.status} ${res.statusText}`);
    }
    const data = await res.json();
    return mapUserOut(data);
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
}

// Create a new user
export async function addUser(user) {
  try {
    const userData = mapUserIn(user);
    const res = await fetch(`${API_URL}/users/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(`Failed to create user: ${res.status} ${res.statusText}. ${errorData.detail || ''}`);
    }
    
    const data = await res.json();
    return mapUserOut(data);
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
}

// Update an existing user
export async function updateUser(userId, userData) {
  try {
    const mappedData = mapUserIn(userData);
    const res = await fetch(`${API_URL}/users/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(mappedData),
    });
    
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(`Failed to update user: ${res.status} ${res.statusText}. ${errorData.detail || ''}`);
    }
    
    const data = await res.json();
    return mapUserOut(data);
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
}

// Delete a user
export async function deleteUser(userId) {
  try {
    const res = await fetch(`${API_URL}/users/${userId}`, {
      method: 'DELETE',
    });
    
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(`Failed to delete user: ${res.status} ${res.statusText}. ${errorData.detail || ''}`);
    }
    
    return { success: true, userId };
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
}

// Note: Authentication functions are available at /auth/register and /auth/login endpoints
// but they create User objects with passwords, not UserProfile objects.
// For user profile management, use the /users/ endpoints which don't require passwords.
