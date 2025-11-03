const API_URL = "http://localhost:8000";

/**
 * Save or update a user profile
 * @param {Object} profileData - The user profile data to save
 * @returns {Promise<Object>} The saved/updated profile
 */
export async function saveUserProfile(profileData) {
  try {
    // Check if profile exists first
    const checkResponse = await fetch(`${API_URL}/user-profiles/email/${encodeURIComponent(profileData.email)}`);
    
    if (checkResponse.ok) {
      // Profile exists, update it
      const existingProfile = await checkResponse.json();
      const response = await fetch(`${API_URL}/user-profiles/${existingProfile.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileData)
      });
      
      if (!response.ok) {
        throw new Error(`Failed to update user profile: ${response.statusText}`);
      }
      
      return await response.json();
    } else {
      // Profile doesn't exist, create it
      const response = await fetch(`${API_URL}/user-profiles`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileData)
      });
      
      if (!response.ok) {
        throw new Error(`Failed to create user profile: ${response.statusText}`);
      }
      
      return await response.json();
    }
  } catch (error) {
    console.error('Error saving user profile:', error);
    throw error;
  }
}

/**
 * Get a user profile by email
 * @param {string} email - The user's email address
 * @returns {Promise<Object>} The user profile
 */
export async function getUserProfile(email) {
  try {
    const response = await fetch(`${API_URL}/user-profiles/email/${encodeURIComponent(email)}`);
    
    if (!response.ok) {
      if (response.status === 404) {
        return null; // Profile not found
      }
      throw new Error(`Failed to fetch user profile: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
}

/**
 * Get all user profiles
 * @returns {Promise<Array>} List of all user profiles
 */
export async function getAllUserProfiles() {
  try {
    const response = await fetch(`${API_URL}/user-profiles`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch user profiles: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching user profiles:', error);
    throw error;
  }
}

/**
 * Delete a user profile
 * @param {number} profileId - The profile ID to delete
 * @returns {Promise<void>}
 */
export async function deleteUserProfile(profileId) {
  try {
    const response = await fetch(`${API_URL}/user-profiles/${profileId}`, {
      method: 'DELETE'
    });
    
    if (!response.ok) {
      throw new Error(`Failed to delete user profile: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error deleting user profile:', error);
    throw error;
  }
}

