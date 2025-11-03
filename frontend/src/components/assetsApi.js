const API_URL = "http://localhost:8000"; // FastAPI backend base URL

// Map backend status -> frontend status
const mapStatusOut = (s) => {
  if (!s) return s;
  const m = {
    Open: "active",
    Assigned: "maintenance",
    Closed: "inactive",
  };
  return m[s] ?? String(s).toLowerCase();
};

// Map frontend status -> backend status
const mapStatusIn = (s) => {
  if (!s) return s;
  const m = {
    active: "Open",
    maintenance: "Assigned",
    inactive: "Closed",
  };
  return m[s] ?? s;
};

const mapOut = (item) => {
  if (!item) return item;
  // normalize field names to frontend expectations
  const openDate = item.openDate ?? item.open_date ?? item.open_date_time ?? null;
  const closeDate = item.closeDate ?? item.close_date ?? null;
  const description = item.description ?? item.desc ?? null;
  const id = item.id ?? item.asset_id ?? item.pk ?? null;
  return {
    ...item,
    id,
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
  if (!res.ok) throw new Error("Failed to fetch assets");
  const data = await res.json();

  // Backend may return either an array or an envelope { value: [...] }
  let assets = [];
  if (Array.isArray(data)) assets = data.map(mapOut);
  else if (data && Array.isArray(data.value)) assets = data.value.map(mapOut);
  // fallback: try common shapes
  else if (data && Array.isArray(data.items)) assets = data.items.map(mapOut);

  // Frontend safety filter by user email if provided
  if (userEmail) {
    assets = assets.filter(a => a.email === userEmail);
  }
  return assets;
}

export async function addAsset(asset) {
  // Send only the fields the backend schema expects (frontend status values)
  const toSend = {
    email: asset.email,
    type: asset.type,
    location: asset.location,
    status: asset.status,
    description: asset.description,
  };

  const res = await fetch(`${API_URL}/assets`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(toSend),
  });
  if (!res.ok) throw new Error("Failed to add asset");
  const data = await res.json();
  // normalize returned asset(s)
  if (Array.isArray(data)) return data.map(mapOut);
  if (data && data.value) return data.value.map(mapOut);
  if (data && data.id) return mapOut(data);
  return data;
}

export async function deleteAsset(id) {
  const res = await fetch(`${API_URL}/assets/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete asset");
  const data = await res.json();
  return data;
}

export async function updateAsset(id, patch) {
  // Send only the fields expected by backend
  const toSend = {
    ...(patch.email !== undefined ? { email: patch.email } : {}),
    ...(patch.type !== undefined ? { type: patch.type } : {}),
    ...(patch.location !== undefined ? { location: patch.location } : {}),
    ...(patch.status !== undefined ? { status: patch.status } : {}),
    ...(patch.description !== undefined ? { description: patch.description } : {}),
  };
  const res = await fetch(`${API_URL}/assets/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(toSend),
  });
  if (!res.ok) throw new Error("Failed to update asset");
  const data = await res.json();
  if (Array.isArray(data)) return data.map(mapOut);
  if (data && data.value) return data.value.map(mapOut);
  if (data && data.id) return mapOut(data);
  return data;
}
