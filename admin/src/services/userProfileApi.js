const API_URL = "http://localhost:8000";

// Get all users from users_management table (filled by user frontend)
export async function getUsersFromManagement() {
  try {
    const response = await fetch(`${API_URL}/users-management`);
    if (!response.ok) throw new Error('Failed to fetch users from management');
    return await response.json();
  } catch (error) {
    console.error('Error fetching users from management:', error);
    throw error;
  }
}

// Get all user profiles from user_profile table
export async function getAllUserProfiles() {
  try {
    const response = await fetch(`${API_URL}/user-profiles`);
    if (!response.ok) throw new Error('Failed to fetch user profiles');
    return await response.json();
  } catch (error) {
    console.error('Error fetching user profiles:', error);
    throw error;
  }
}

// Get user profile by email
export async function getUserProfileByEmail(email) {
  try {
    const response = await fetch(`${API_URL}/user-profiles/email/${encodeURIComponent(email)}`);
    if (!response.ok) {
      if (response.status === 404) {
        return null; // User profile not found
      }
      throw new Error('Failed to fetch user profile');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching user profile by email:', error);
    throw error;
  }
}

// Create user profile in user_profile table (from users_management data)
export async function createUserProfile(profileData) {
  try {
    const response = await fetch(`${API_URL}/user-profiles`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profileData),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to create user profile');
    }
    return await response.json();
  } catch (error) {
    console.error('Error creating user profile:', error);
    throw error;
  }
}

// Update user profile in user_profile table (admin edits)
// This will also update the corresponding users_management entry
export async function updateUserProfile(userId, profileData) {
  try {
    const response = await fetch(`${API_URL}/user-profiles/${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profileData),
    });
    if (!response.ok) throw new Error('Failed to update user profile');
    return await response.json();
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
}

// Delete user profile
export async function deleteUserProfile(userId) {
  try {
    const response = await fetch(`${API_URL}/user-profiles/${userId}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete user profile');
    return true;
  } catch (error) {
    console.error('Error deleting user profile:', error);
    throw error;
  }
}

// Delete user from users_management table (admin portal)
export async function deleteUserFromManagement(userId) {
  try {
    const response = await fetch(`${API_URL}/users-management/${userId}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete user from management');
    return true;
  } catch (error) {
    console.error('Error deleting user from management:', error);
    throw error;
  }
}

