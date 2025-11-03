const API_URL = "http://localhost:8000"; // your FastAPI server

const mapStatusOut = (s) => {
  if (!s) return s;
  const m = { Open: "active", Assigned: "maintenance", Closed: "inactive" };
  return m[s] ?? String(s).toLowerCase();
};

const mapStatusIn = (s) => {
  if (!s) return s;
  const m = { active: "active", maintenance: "maintenance", inactive: "inactive" };
  return m[s] ?? "active"; // Default to "active" if status not recognized
};

const mapOut = (item) => {
  if (!item) return item;
  const openDate = item.openDate ?? item.open_date ?? item.assigned_date ?? null;
  const closeDate = item.closeDate ?? item.close_date ?? item.return_date ?? null;
  const description = item.description ?? item.desc ?? null;
  const id = item.id ?? item.asset_id ?? item.pk ?? null;
  const email = item.email ?? item.email_id ?? null;
  const type = item.type ?? item.asset_type ?? null;
  return {
    ...item,
    id,
    email,
    type,
    status: mapStatusOut(item.status),
    openDate,
    closeDate,
    description,
  };
};

export async function listAssets(userEmail = null) {
  const url = userEmail
    ? `${API_URL}/assets?user_email=${encodeURIComponent(userEmail)}`
    : `${API_URL}/assets`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch assets`);
  const data = await res.json();
  let assets = [];
  if (Array.isArray(data)) assets = data.map(mapOut);
  else if (data && Array.isArray(data.value)) assets = data.value.map(mapOut);
  else if (data && Array.isArray(data.items)) assets = data.items.map(mapOut);
  
  // Filter by user email on the frontend if provided
  if (userEmail) {
    assets = assets.filter(asset => asset.email === userEmail);
  }
  
  return assets;
}

export async function addAsset(asset) {
  // Send only the expected frontend fields (backend schemas accept frontend status values)
  const toSend = {
    email: asset.email,
    type: asset.type === "Network issue" ? "Network Issue" : asset.type, // Map "Network issue" to "Network Issue"
    location: asset.location,
    status: mapStatusIn(asset.status), // Map frontend status to backend status
    description: asset.description,
  };
  

  const res = await fetch(`${API_URL}/assets`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(toSend),
  });
  if (!res.ok) throw new Error(`Failed to add asset`);
  const data = await res.json();
  if (Array.isArray(data)) return data.map(mapOut);
  if (data && data.value) return data.value.map(mapOut);
  if (data && data.id) return mapOut(data);
  return {};
}

export async function deleteAsset(id) {
  const res = await fetch(`${API_URL}/assets/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error(`Failed to delete asset`);
  const data = await res.json();
  return data;
}

export async function updateAsset(id, patch) {
  const toSend = {
    ...(patch.email !== undefined ? { email: patch.email } : {}),
    ...(patch.type !== undefined ? { type: patch.type } : {}),
    ...(patch.location !== undefined ? { location: patch.location } : {}),
    ...(patch.status !== undefined ? { status: patch.status } : {}),
    ...(patch.description !== undefined ? { description: patch.description } : {}),
  };
  const res = await fetch(`${API_URL}/assets/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(toSend),
  });
  if (!res.ok) throw new Error('Failed to update asset');
  const data = await res.json();
  if (Array.isArray(data)) return data.map(mapOut);
  if (data && data.value) return data.value.map(mapOut);
  if (data && data.id) return mapOut(data);
  return data;
}
