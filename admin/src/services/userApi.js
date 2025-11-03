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
    passwordResetNeeded: false,
    profileFile: null,
    created_at: user.created_at,
    updated_at: user.updated_at,
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
    user_status: user.active ? 'Active' : 'Inactive',
  };
};

export async function listUsers() {
  const res = await fetch(`${API_URL}/users/`);
  if (!res.ok) throw new Error(`Failed to fetch users: ${res.status}`);
  const data = await res.json();
  return Array.isArray(data) ? data.map(mapUserOut) : [];
}

export async function addUser(user) {
  const res = await fetch(`${API_URL}/users/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(mapUserIn(user)),
  });
  if (!res.ok) throw new Error(`Failed to create user: ${res.status}`);
  return mapUserOut(await res.json());
}

export async function updateUser(userId, userData) {
  const res = await fetch(`${API_URL}/users/${userId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(mapUserIn(userData)),
  });
  if (!res.ok) throw new Error(`Failed to update user: ${res.status}`);
  return mapUserOut(await res.json());
}

export async function deleteUser(userId) {
  const res = await fetch(`${API_URL}/users/${userId}`, { method: 'DELETE' });
  if (!res.ok) throw new Error(`Failed to delete user: ${res.status}`);
  return { success: true, userId };
}


