















// for description  ok . full code ok 



import React, { useEffect, useState } from "react";
import { listAssets, addAsset, updateAsset, deleteAsset } from "../assetsApi";
import { useAuth } from "../../context/AuthContext";


// Mock API functions
const mockAssets = [
  {
    id: "1",
    email: "john@example.com",
    type: "Laptop",
    location: "WFO",
    status: "active",
    description: "John's primary work laptop.",
    openDate: new Date().toISOString(),
  },
  {
    id: "2",
    email: "user2@example.com",
    type: "Charger",
    location: "WFO",
    status: "active",
    description: "Charger for MacBook Pro.",
    openDate: new Date().toISOString(),
  },
  {
    id: "3",
    email: "user3@example.com",
    type: "NetworkIssue",
    location: "WFO",
    status: "active",
    description: "Reported intermittent connectivity.",
    openDate: new Date().toISOString(),
  },
];

// let assetsDB = [...mockAssets];

// const listAssets = () => Promise.resolve([...assetsDB]);
// const addAsset = (asset) => {
//   assetsDB.push(asset);
//   return Promise.resolve(asset);
// };

const generateId = () =>
  `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

// Helper function to format date/time for display
function formatOpenDate(dt) {
  if (!dt) return "";
  const d = new Date(dt);
  return `${d.toLocaleDateString()} ${d.toLocaleTimeString()}`;
}

export default function AssetsBoard() {
  const { user } = useAuth(); // Get the logged-in user
  const [assets, setAssets] = useState([]);
  const [email, setEmail] = useState(""); // Email state for form
  const [type, setType] = useState("Laptop");
  const [location, setLocation] = useState("WFO");
  const [description, setDescription] = useState(""); // new description state for add form
  const [editingId, setEditingId] = useState(null);
  const [editFields, setEditFields] = useState({});
  const [hoveredId, setHoveredId] = useState(null);
  const [quickAdd, setQuickAdd] = useState({});
  const [draggedAsset, setDraggedAsset] = useState(null);
  const [toast, setToast] = useState(null);

  // toast helper
  const showToast = (msg, kind = 'info') => {
    setToast({ msg, kind });
    setTimeout(() => setToast(null), 3500);
  };

  // Auto-populate email field with logged-in user's email
  useEffect(() => {
    if (user?.email) {
      setEmail(user.email);
    }
  }, [user?.email]);

  useEffect(() => {
    let mounted = true;
    if (!user?.email) {
      setAssets([]);
      return () => (mounted = false);
    }
    // Clear immediately on user switch to avoid showing previous user's assets
    setAssets([]);
    (async () => {
      try {
        // Fetch assets filtered by logged-in user's email from backend
        const res = await listAssets(user?.email);
        if (!mounted) return;
        // res should be an array of assets after normalization in API module
        console.log("Assets: fetched for user", user?.email, "count:", Array.isArray(res) ? res.length : 0, res);
        
        setAssets(Array.isArray(res) ? res : []);
      } catch (err) {
        console.error("Assets: failed to fetch assets", err);
        // keep using mock assets if backend fails to avoid breaking UI
        if (mounted) {
          const userMockAssets = mockAssets.filter(asset => asset.email === user?.email);
          setAssets(userMockAssets);
        }
      }
    })();
    return () => (mounted = false);
  }, [user?.email]); // Re-run when user email changes

  const add = async (status = "active") => {
    // Use the email from the form
    const assetEmail = status === "form" ? email : user?.email;
    const assetType =
      status === "form" ? type : quickAdd[status]?.type || "Laptop";
    const assetLocation =
      status === "form" ? location : quickAdd[status]?.location || "WFO";
    const assetDescription =
      status === "form"
        ? description
        : quickAdd[status]?.description || ""; // include description

    if (!assetEmail?.trim()) {
      showToast('Please log in to add assets', 'error');
      return;
    }

    const a = {
      id: generateId(),
      email: assetEmail,
      type: assetType,
      location: assetLocation,
      description: assetDescription,
      status: status === "form" ? "active" : status,
      openDate: new Date().toISOString(), // Save open date/time
    };
    try {
      await addAsset(a);
      const fresh = await listAssets(user?.email);
      setAssets(Array.isArray(fresh) ? fresh : []);
      showToast('Asset added successfully', 'success');
    } catch (err) {
      console.error('Assets: failed to add asset', err);
      showToast(`Failed to add asset: ${err.message}`, 'error');
      // Show a user-friendly message and fall back to mock data so UI remains usable
      try {
        const fresh = await listAssets(user?.email);
        setAssets(Array.isArray(fresh) ? fresh : []);
      } catch (e) {
        const userMockAssets = mockAssets.filter(asset => asset.email === user?.email);
        setAssets(userMockAssets);
      }
    }

    if (status === "form") {
      setEmail(user?.email || ""); // Reset to user's email instead of clearing
      setType("Laptop");
      setLocation("WFO");
      setDescription(""); // reset description input
    } else {
      setQuickAdd((prev) => ({
        ...prev,
        [status]: { email: "", type: "Laptop", location: "WFO", description: "" },
      }));
    }
  };

  const statusColumns = {
    active: { title: "Active", color: "#22C55E", bgColor: "#C8E9DD" },
  };

  const groupedAssets = {
    active: assets // Show ALL assets in single column regardless of status
  };

  const handleDragStart = (e, asset) => {
    setDraggedAsset(asset);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e, newStatus) => {
    e.preventDefault();
    if (draggedAsset && draggedAsset.status !== newStatus) {
      const updatedAsset = { ...draggedAsset, status: newStatus };
      // update locally, then persist to backend
      setAssets(assets.map((a) => (a.id === draggedAsset.id ? updatedAsset : a)));
      // try to persist
      (async () => {
        try {
          await updateAsset(draggedAsset.id, { status: newStatus });
          showToast('Asset updated', 'success');
        } catch (err) {
          console.error('Failed to persist asset update', err);
          showToast('Failed to update asset', 'error');
        }
      })();
    }
    setDraggedAsset(null);
  };

  const startEditing = (asset) => {
    setEditingId(asset.id);
    setEditFields({ ...asset });
  };

  const saveEdit = async (id) => {
    const newAssets = assets.map((a) => (a.id === id ? { ...a, ...editFields } : a));
    setAssets(newAssets);
    setEditingId(null);
    try {
      await updateAsset(id, editFields);
      showToast('Changes saved', 'success');
    } catch (err) {
      console.error('Failed to save changes', err);
      showToast('Failed to save changes', 'error');
    }
  };

  const cancelEdit = () => setEditingId(null);

  const handleDelete = async (id) => {
    // optimistic UI update
    const remaining = assets.filter((a) => a.id !== id);
    setAssets(remaining);
    try {
      await deleteAsset(id);
      showToast('Asset deleted', 'success');
    } catch (err) {
      console.error('Failed to delete asset', err);
      // revert to fresh list from backend or mock, filtered for current user
      try {
        const fresh = await listAssets(user?.email);
        setAssets(Array.isArray(fresh) ? fresh : []);
      } catch (e) {
        const userMockAssets = mockAssets.filter(asset => asset.email === user?.email);
        setAssets(userMockAssets);
      }
      showToast('Failed to delete asset', 'error');
    }
  };

  return (
    <div
      style={{
        padding: "2rem",
        fontFamily: "Arial, sans-serif",
        background: "#D0F0F4",
        minHeight: "100vh",
      }}
    >
      {/* Toast */}
      {toast && (
        <div
          role="status"
          aria-live="polite"
          style={{
            position: 'fixed',
            top: 20,
            right: 20,
            zIndex: 9999,
            padding: '0.75rem 1rem',
            background: toast.kind === 'error' ? '#F87171' : '#10B981',
            color: '#fff',
            borderRadius: 8,
            boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
          }}
        >
          {toast.msg}
        </div>
      )}
      {/* Header */}
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
        {user?.email && (
          <p style={{ 
            margin: "0.5rem 0 0 0", 
            fontSize: "1rem", 
            color: "#666",
            fontWeight: "500"
          }}>
            Assets for: {user.email}
          </p>
        )}
      </div>

      {/* Add Asset Top Form */}
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
            placeholder="Email ID (auto-filled with your email)"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              flex: 1,
              padding: "0.5rem",
              borderRadius: "4px",
              border: "1px solid #ccc",
              backgroundColor: email === user?.email ? "#f0f8ff" : "#fff", // Light blue if auto-filled
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
            <option>NetworkIssue</option>
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

      {/* Kanban Board */}
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

            {/* Assets */}
            {(!groupedAssets[status] || groupedAssets[status].length === 0) && (
              <div style={{ textAlign: 'center', color: '#1f2937', opacity: 0.7 }}>
                No items
              </div>
            )}
            {groupedAssets[status] && groupedAssets[status].map((a) => (
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
                  boxShadow:
                    draggedAsset?.id === a.id
                      ? "0 4px 12px rgba(0,0,0,0.2)"
                      : "0 2px 4px rgba(0,0,0,0.1)",
                  position: "relative",
                  cursor: editingId === a.id ? "default" : "move",
                  opacity: draggedAsset?.id === a.id ? 0.5 : 1,
                }}
              >
                {editingId === a.id ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    <input
                      value={editFields.email}
                      onChange={(e) =>
                        setEditFields({ ...editFields, email: e.target.value })
                      }
                      style={{ padding: "0.5rem", borderRadius: "4px", border: "none" }}
                    />
                    <select
                      value={editFields.type}
                      onChange={(e) =>
                        setEditFields({ ...editFields, type: e.target.value })
                      }
                      style={{ padding: "0.5rem", borderRadius: "4px", border: "none" }}
                    >
                      <option>Laptop</option>
                      <option>Charger</option>
                      <option>NetworkIssue</option>
                    </select>
                    <select
                      value={editFields.location}
                      onChange={(e) =>
                        setEditFields({ ...editFields, location: e.target.value })
                      }
                      style={{ padding: "0.5rem", borderRadius: "4px", border: "none" }}
                    >
                      <option>WFH</option>
                      <option>WFO</option>
                    </select>
                    <select
                      value={editFields.status}
                      onChange={(e) =>
                        setEditFields({ ...editFields, status: e.target.value })
                      }
                      style={{ padding: "0.5rem", borderRadius: "4px", border: "none" }}
                    >
                      {Object.keys(statusColumns).map((s) => (
                        <option key={s} value={s}>
                          {statusColumns[s].title}
                        </option>
                      ))}
                    </select>
                    <textarea
                      value={editFields.description}
                      onChange={(e) =>
                        setEditFields({ ...editFields, description: e.target.value })
                      }
                      placeholder="Description"
                      style={{ padding: "0.5rem", borderRadius: "4px", border: "none", resize: "vertical" }}
                      rows={3}
                    />
                    {/* Open Date/Time and Status field visible in edit mode */}
                    <div
                      style={{
                        fontSize: "0.85rem",
                        color: "#e6ffe6",
                        margin: "0.25rem 0",
                        fontWeight: 400,
                        opacity: 0.95,
                        display: "flex",
                        gap: "1rem",
                        alignItems: "center"
                      }}
                    >
                      <span>Opened: {formatOpenDate(editFields.openDate)}</span>
                      <span style={{
                        padding: "2px 8px",
                        borderRadius: "4px",
                        fontSize: "0.8rem",
                        fontWeight: "600",
                        background: editFields.status === 'active' ? '#22C55E' : 
                                   editFields.status === 'maintenance' ? '#F59E0B' : '#6B7280',
                        color: "#fff"
                      }}>
                        {editFields.status === 'active' ? 'Active' : 
                         editFields.status === 'maintenance' ? 'Maintenance' : 'Inactive'}
                      </span>
                    </div>
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <button
                        onClick={() => saveEdit(a.id)}
                        style={{
                          background: "#36B37E",
                          color: "#fff",
                          border: "none",
                          borderRadius: "4px",
                          padding: "0.5rem",
                          flex: 1,
                          cursor: "pointer",
                        }}
                      >
                        Save
                      </button>
                      <button
                        onClick={cancelEdit}
                        style={{
                          background: "#DE350B",
                          color: "#fff",
                          border: "none",
                          borderRadius: "4px",
                          padding: "0.5rem",
                          flex: 1,
                          cursor: "pointer",
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div onClick={() => startEditing(a)} style={{ cursor: "pointer" }}>
                    <div style={{ fontWeight: "bold", fontSize: "1rem" }}>{a.email}</div>
                    <div
                      style={{
                        fontSize: "0.8rem",
                        marginTop: "0.25rem",
                        opacity: 0.9,
                      }}
                    >
                      {a.type} | {a.location}
                    </div>
                    <div style={{ marginTop: "0.25rem", fontSize: "0.85rem", opacity: 0.9 }}>
                      {a.description}
                    </div>
                    {/* Open Date/Time and Status Display */}
                    <div
                      style={{
                        fontSize: "0.85rem",
                        color: "#e6ffe6",
                        marginTop: "0.25rem",
                        fontWeight: 400,
                        opacity: 0.95,
                        display: "flex",
                        gap: "1rem",
                        alignItems: "center"
                      }}
                    >
                      <span>Opened: {formatOpenDate(a.openDate)}</span>
                      <span style={{
                        padding: "2px 8px",
                        borderRadius: "4px",
                        fontSize: "0.8rem",
                        fontWeight: "600",
                        background: a.status === 'active' ? '#22C55E' : 
                                   a.status === 'maintenance' ? '#F59E0B' : '#6B7280',
                        color: "#fff"
                      }}>
                        {a.status === 'active' ? 'Active' : 
                         a.status === 'maintenance' ? 'Maintenance' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                )}

                {/* Hover Toolbar */}
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
                    {/* <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm('Delete this asset?')) handleDelete(a.id);
                      }}
                      style={{
                        background: "rgba(255,255,255,0.9)",
                        border: "none",
                        color: "#DE350B",
                        cursor: "pointer",
                        fontWeight: "bold",
                        padding: "0.25rem 0.5rem",
                        borderRadius: "4px",
                      }}
                    >
                      Delete
                    </button> */}
                  </div>
                )}
              </div>
            ))}

            {/* Quick Add in Column */}
            <div
              style={{
                marginTop: "0.75rem",
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
              }}
            ></div>
          </div>
        ))}
      </div>
    </div>
  );
}

















