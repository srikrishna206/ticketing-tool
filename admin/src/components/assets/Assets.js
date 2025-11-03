
import React, { useEffect, useState } from "react";

// Real API functions to replace mock API
const listAssets = async () => {
  try {
    const response = await fetch('http://localhost:8000/admin/assets');
    if (response.ok) {
      const adminAssets = await response.json();
      // Convert backend format to frontend format
      return adminAssets.map(asset => ({
        id: asset.admin_asset_id.toString(),
        assetId: asset.id, // Original asset ID
        email: asset.email,
        type: asset.type,
        location: asset.location,
        status: asset.status,
        description: asset.description || '',
        openDate: asset.open_date,
        closeDate: asset.close_date
      }));
    }
  } catch (error) {
    console.error('Error fetching admin assets:', error);
  }
  return [];
};

const addAsset = async (asset) => {
  // Note: Assets should be created from user portal, not admin portal
  // This is just a fallback if needed
  return Promise.resolve(asset);
};

const updateAsset = async (adminAssetId, assetData) => {
  try {
    const response = await fetch(`http://localhost:8000/admin/assets/${adminAssetId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: assetData.email,
        type: assetData.type,
        location: assetData.location,
        description: assetData.description,
        status: assetData.status,
        actions: 'Edit'
      }),
    });
    if (response.ok) {
      return await response.json();
    }
  } catch (error) {
    console.error('Error updating admin asset:', error);
    throw error;
  }
};

const generateId = () =>
  `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

function formatOpenDate(dt) {
  if (!dt) return "";
  const d = new Date(dt);
  return `${d.toLocaleDateString()} ${d.toLocaleTimeString()}`;
}

export default function AssetsBoard() {
  const [assets, setAssets] = useState([]);
  const [email, setEmail] = useState("");
  const [type, setType] = useState("Laptop");
  const [location, setLocation] = useState("WFO");
  const [description, setDescription] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editFields, setEditFields] = useState({});
  const [hoveredId, setHoveredId] = useState(null);
  const [quickAdd, setQuickAdd] = useState({});
  const [draggedAsset, setDraggedAsset] = useState(null);

  useEffect(() => {
    listAssets().then(setAssets);
  }, []);

  const add = async (status = "active") => {
    const assetEmail = status === "form" ? email : quickAdd[status]?.email;
    const assetType =
      status === "form" ? type : quickAdd[status]?.type || "Laptop";
    const assetLocation =
      status === "form" ? location : quickAdd[status]?.location || "WFO";
    const assetDescription =
      status === "form"
        ? description
        : quickAdd[status]?.description || "";

    if (!assetEmail?.trim()) return;

    const a = {
      id: generateId(),
      email: assetEmail,
      type: assetType,
      location: assetLocation,
      description: assetDescription,
      status: status === "form" ? "active" : status,
      openDate: new Date().toISOString(),
    };
    await addAsset(a);
    setAssets(await listAssets());

    if (status === "form") {
      setEmail("");
      setType("Laptop");
      setLocation("WFO");
      setDescription("");
    } else {
      setQuickAdd((prev) => ({
        ...prev,
        [status]: { email: "", type: "Laptop", location: "WFO", description: "" },
      }));
    }
  };

  const statusColumns = {
    Open: { title: "Open", color: "#3B82F6", bgColor: "#DBEAFE" },
    Assigned: { title: "Maintenance", color: "#F59E0B", bgColor: "#FEF3C7" },
    Closed: { title: "Inactive", color: "#EF4444", bgColor: "#FEE2E2" },
  };

  const groupedAssets = Object.keys(statusColumns).reduce((acc, status) => {
    acc[status] = assets.filter((a) => a.status === status);
    return acc;
  }, {});

  const handleDragStart = (e, asset) => {
    setDraggedAsset(asset);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = async (e, newStatus) => {
    e.preventDefault();
    if (draggedAsset && draggedAsset.status !== newStatus) {
      const updatedAsset = { ...draggedAsset, status: newStatus };
      // Update local state immediately for smooth UI
      setAssets(assets.map((a) => (a.id === draggedAsset.id ? updatedAsset : a)));
      
      // Persist the status change to the database
      try {
        await updateAsset(draggedAsset.id, {
          email: draggedAsset.email,
          type: draggedAsset.type,
          location: draggedAsset.location,
          description: draggedAsset.description,
          status: newStatus
        });
        console.log(`Asset ${draggedAsset.id} status updated to ${newStatus} in database`);
      } catch (error) {
        console.error('Failed to update asset status in database:', error);
        // Revert the local state change if API call fails
        setAssets(assets.map((a) => (a.id === draggedAsset.id ? draggedAsset : a)));
        alert('Failed to update asset status. Please try again.');
      }
    }
    setDraggedAsset(null);
  };

  const startEditing = (asset) => {
    setEditingId(asset.id);
    setEditFields({ ...asset });
  };

  const saveEdit = async (id) => {
    try {
      // Update admin asset via API
      const assetToUpdate = assets.find(a => a.id === id);
      if (assetToUpdate) {
        await updateAsset(id, { ...assetToUpdate, ...editFields });
        // Refresh assets list after update
        const updatedAssets = await listAssets();
        setAssets(updatedAssets);
      }
    } catch (error) {
      console.error('Error saving asset:', error);
      alert('Failed to save asset. Please try again.');
    }
    setEditingId(null);
  };

  const cancelEdit = () => setEditingId(null);
  const deleteAsset = (id) => setAssets(assets.filter((a) => a.id !== id));

  return (
    <div
      style={{
        padding: "2rem",
        fontFamily: "Arial, sans-serif",
        background: "#D0F0F4",
        minHeight: "100vh",
      }}
    >
      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <h1
          style={{
            fontSize: "2rem",
            fontWeight: "bold",
            margin: 0,
            letterSpacing: "2px",
          }}
        >
          FLOW TRACK
        </h1>
      </div>

      <div
        style={{
          marginBottom: "2rem",
          background: "#fff",
          padding: "1.5rem",
          borderRadius: "8px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        <h2 style={{ marginBottom: "1rem", fontSize: "1.5rem" }}>Add Asset</h2>
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          <input
            placeholder="Email ID"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              flex: 1,
              padding: "0.5rem",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          />
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            style={{
              flex: 1,
              padding: "0.5rem",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          >
            <option>Laptop</option>
            <option>Charger</option>
            <option>Network Issue</option>
          </select>
          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            style={{
              flex: 1,
              padding: "0.5rem",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          >
            <option>WFO</option>
            <option>WFH</option>
          </select>
          <input
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{
              flex: 2,
              padding: "0.5rem",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          />
          <button
            onClick={() => add("form")}
            style={{
              padding: "0.5rem 1rem",
              background: "#0052CC",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Add
          </button>
        </div>
      </div>

      <div style={{ display: "flex", gap: "1.5rem" }}>
        {Object.keys(statusColumns).map((status) => (
          <div
            key={status}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, status)}
            style={{
              flex: 1,
              background: statusColumns[status].bgColor,
              padding: "1.5rem",
              borderRadius: "12px",
              minHeight: "400px",
            }}
          >
            <h3
              style={{
                color: statusColumns[status].color,
                fontSize: "1.25rem",
                fontWeight: "bold",
                marginBottom: "1rem",
                textAlign: "center",
              }}
            >
              {statusColumns[status].title}
            </h3>

            {groupedAssets[status].map((a) => (
              <div
                key={a.id}
                draggable={editingId !== a.id}
                onDragStart={(e) => handleDragStart(e, a)}
                onMouseEnter={() => setHoveredId(a.id)}
                onMouseLeave={() => setHoveredId(null)}
                style={{
                  padding: "1rem",
                  marginBottom: "0.75rem",
                  borderRadius: "8px",
                  background: statusColumns[status].color,
                  color: "#fff",
                  fontWeight: "600",
                  position: "relative",
                  cursor: editingId === a.id ? "default" : "move",
                }}
              >
                {editingId === a.id ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    <input
                      type="text"
                      value={editFields.email || ''}
                      onChange={(e) => setEditFields({ ...editFields, email: e.target.value })}
                      placeholder="Email"
                      style={{
                        padding: "0.5rem",
                        border: "1px solid #ddd",
                        borderRadius: "4px",
                        fontSize: "0.9rem"
                      }}
                    />
                    <select
                      value={editFields.type || 'Laptop'}
                      onChange={(e) => setEditFields({ ...editFields, type: e.target.value })}
                      style={{
                        padding: "0.5rem",
                        border: "1px solid #ddd",
                        borderRadius: "4px",
                        fontSize: "0.9rem"
                      }}
                    >
                      <option value="Laptop">Laptop</option>
                      <option value="Charger">Charger</option>
                      <option value="NetworkIssue">Network Issue</option>
                    </select>
                    <select
                      value={editFields.location || 'WFO'}
                      onChange={(e) => setEditFields({ ...editFields, location: e.target.value })}
                      style={{
                        padding: "0.5rem",
                        border: "1px solid #ddd",
                        borderRadius: "4px",
                        fontSize: "0.9rem"
                      }}
                    >
                      <option value="WFO">WFO</option>
                      <option value="WFH">WFH</option>
                    </select>
                    <input
                      type="text"
                      value={editFields.description || ''}
                      onChange={(e) => setEditFields({ ...editFields, description: e.target.value })}
                      placeholder="Description"
                      style={{
                        padding: "0.5rem",
                        border: "1px solid #ddd",
                        borderRadius: "4px",
                        fontSize: "0.9rem"
                      }}
                    />
                    <select
                      value={editFields.status || 'active'}
                      onChange={(e) => setEditFields({ ...editFields, status: e.target.value })}
                      style={{
                        padding: "0.5rem",
                        border: "1px solid #ddd",
                        borderRadius: "4px",
                        fontSize: "0.9rem"
                      }}
                    >
                      <option value="active">Active</option>
                      <option value="maintenance">Maintenance</option>
                      <option value="inactive">Inactive</option>
                      <option value="Open">Open</option>
                    </select>
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          saveEdit(a.id);
                        }}
                        style={{
                          padding: "0.5rem 1rem",
                          background: "#36B37E",
                          color: "white",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer",
                          fontSize: "0.9rem",
                          fontWeight: "500"
                        }}
                      >
                        Save
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          cancelEdit();
                        }}
                        style={{
                          padding: "0.5rem 1rem",
                          background: "#FF5630",
                          color: "white",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer",
                          fontSize: "0.9rem",
                          fontWeight: "500"
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div onClick={() => startEditing(a)} style={{ cursor: "pointer" }}>
                    <div style={{ fontWeight: "bold", fontSize: "1rem" }}>{a.email}</div>
                    <div style={{ fontSize: "0.8rem", marginTop: "0.25rem", opacity: 0.9 }}>
                      {a.type} | {a.location}
                    </div>
                    <div style={{ marginTop: "0.25rem", fontSize: "0.85rem", opacity: 0.9 }}>
                      {a.description}
                    </div>
                    <div
                      style={{
                        fontSize: "0.85rem",
                        color: "#e6ffe6",
                        marginTop: "0.25rem",
                        fontWeight: 400,
                        opacity: 0.95,
                      }}
                    >
                      Opened: {formatOpenDate(a.openDate)}
                    </div>
                  </div>
                )}

                {hoveredId === a.id && editingId !== a.id && (
                  <div
                    style={{
                      position: "absolute",
                      top: "4px",
                      right: "4px",
                      display: "flex",
                      gap: "0.5rem",
                    }}
                  >
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        startEditing(a);
                      }}
                      style={{
                        background: "rgba(255,255,255,0.9)",
                        border: "none",
                        color: "#0052CC",
                        cursor: "pointer",
                        fontWeight: "bold",
                        padding: "0.25rem 0.5rem",
                        borderRadius: "4px",
                      }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteAsset(a.id);
                      }}
                      style={{
                        background: "rgba(255,0,0,0.85)",
                        border: "none",
                        color: "#fff",
                        cursor: "pointer",
                        fontWeight: "bold",
                        padding: "0.25rem 0.5rem",
                        borderRadius: "4px",
                      }}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
