// for UI/UX  ok

import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";

export default function ForYou() {
  const [user, setUser] = useState(null);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [yourBoards, setYourBoards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredBoard, setHoveredBoard] = useState(null);
  const [isViewAllHovered, setIsViewAllHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const { user: authUser } = useAuth();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  useEffect(() => {
    setRecentlyViewed([]);
    setYourBoards([]);
    const fetchData = async () => {
      try {
        setLoading(true);
        if (authUser) {
          setUser(authUser);
        } else {
          setUser({ name: "" });
        }
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, [authUser]);

  const styles = {
    container: {
      minHeight: "100vh",
      backgroundColor: "#d1ecf6", // MATCH screenshot: light blue background
      padding: isMobile ? "1rem" : "2rem",
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      position: "relative",
      overflow: "hidden",
    },
    content: {
      position: "relative",
      zIndex: 10,
      maxWidth: "1400px",
      margin: "0 auto",
    },
    welcomeTitle: {
      fontSize: isMobile ? "2rem" : "2rem", // Match screenshot size
      fontWeight: "700",
      color: "#2d2d2d", // Dark gray (for strong contrast)
      margin: "0 0 0.5rem 0",
      textAlign: isMobile ? "center" : "left",
      lineHeight: isMobile ? "1.2" : "1.3",
    },
    subtitle: {
      color: "#2d2d2d",
      fontSize: isMobile ? "1rem" : "1.2rem",
      fontWeight: "400",
      margin: "0 0 2rem 0",
      textAlign: isMobile ? "center" : "left",
    },
    cardsContainer: {
      display: "grid",
      gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
      gap: isMobile ? "1rem" : "2rem",
      marginBottom: "2rem",
    },
    card: {
      padding: isMobile ? "1.5rem" : "2rem", // lighter padding for screenshot matching
      borderRadius: isMobile ? "10px" : "16px",
      border: "1px solid #d6dee3", // soft gray border
      background: "#fff", // White card background matching screenshot
      boxShadow: "0 2px 8px rgba(60, 60, 110, 0.08)",
      position: "relative",
      overflow: "hidden",
    },
    cardGlow: {
      display: "none", // No glow in screenshot
    },
    cardHeader: {
      display: "flex",
      justifyContent: "flex-start", // align left
      alignItems: isMobile ? "flex-start" : "center",
      marginBottom: isMobile ? "1rem" : "1.5rem",
      flexDirection: isMobile ? "column" : "row",
      gap: isMobile ? "1rem" : "0",
    },
    cardTitle: {
      fontSize: isMobile ? "1.1rem" : "1.1rem", // Match screenshot size
      fontWeight: "700",
      color: "#333", // dark gray
      margin: "0",
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
    },
    boardList: {
      listStyle: "none",
      padding: "0",
      margin: "0",
      display: "flex",
      flexDirection: "column",
      gap: isMobile ? "0.75rem" : "1rem",
    },
    boardItem: {
      padding: isMobile ? "1rem" : "1rem",
      background: "#f6f8fa", // soft card/row background
      borderRadius: isMobile ? "8px" : "12px",
      border: "none",
      transition: "background 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
      cursor: "pointer",
      boxShadow: "none",
      color: "#383838",
    },
    boardItemHover: {
      background: "#e6f7ff", // subtle blue highlight for hover (if any)
    },
    boardTitle: {
      fontSize: isMobile ? "0.9rem" : "1rem",
      fontWeight: "600",
      color: "#3a3a3a",
      margin: "0 0 0.25rem 0",
      display: "flex",
      alignItems: "center",
      gap: "0.75rem",
    },
    boardMeta: {
      display: "flex",
      justifyContent: "flex-start",
      alignItems: "center",
      fontSize: isMobile ? "0.8rem" : "0.9rem",
      flexDirection: "row",
      gap: "1rem",
      color: "#383838",
    },
    teamBadge: {
      padding: isMobile ? "0.2rem 0.5rem" : "0.2rem 0.75rem",
      borderRadius: "8px",
      fontSize: "0.8rem",
      fontWeight: "600",
      background: "#dbeafe", // pale blue
      color: "#3366cc",
      border: "none",
    },
    itemsCount: {
      padding: isMobile ? "0.2rem 0.5rem" : "0.2rem 0.75rem",
      borderRadius: "8px",
      fontSize: "0.8rem",
      fontWeight: "600",
      background: "#ede9fe",
      color: "#6846b6",
      border: "none",
    },
    colorIndicator: {
      width: "4px",
      height: isMobile ? "16px" : "18px",
      borderRadius: "2px",
      background: "#b5bfd8",
    },
    emptyState: {
      textAlign: "center",
      color: "#6c757d", // subtle gray "no data" text
      padding: isMobile ? "2rem 1rem" : "2rem 1rem",
      fontSize: isMobile ? "0.9rem" : "1rem",
      fontStyle: "italic",
    },
    loadingSpinner: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: isMobile ? "3rem" : "4rem",
      color: "#FFFFFF",
      zIndex: 10,
    },
    spinner: {
      width: isMobile ? "40px" : "45px",
      height: isMobile ? "40px" : "45px",
      border: "3px solid #cbe7fa",
      borderTop: "3px solid #7fcaf6",
      borderRadius: "50%",
      animation: "spin 1s linear infinite",
    },
    viewAllButton: {
      background: "#f1f5f9",
      border: "1px solid #cbe4fa",
      color: "#30527a",
      padding: isMobile ? "0.4rem 0.8rem" : "0.5rem 1rem",
      borderRadius: "8px",
      fontSize: "0.9rem",
      fontWeight: "600",
      cursor: "pointer",
      transition: "background 0.3s ease",
      width: isMobile ? "100%" : "auto",
      textAlign: "center",
    },
    viewAllButtonHover: {
      background: "#e6f7ff",
    },
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingSpinner}>
          <div style={styles.spinner}></div>
        </div>
        <style>
          {`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}
        </style>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        {/* Header */}
        <h1 style={styles.welcomeTitle}>
          👋 Welcome{user?.name ? `, ${user.name}` : ""}
        </h1>
        <p style={styles.subtitle}>Here's what's happening this week</p>
        <div style={styles.cardsContainer}>
          {/* Your Boards Card */}
          <div style={styles.card}>
            <div style={styles.cardGlow} />
            <div style={styles.cardHeader}>
              <h2 style={styles.cardTitle}>🗂️ Your Boards</h2>
            </div>
            <ul style={styles.boardList}>
              {yourBoards.length > 0 ? (
                yourBoards.map((board) => (
                  <li
                    key={board.id}
                    style={{
                      ...styles.boardItem,
                      ...(hoveredBoard === board.id
                        ? styles.boardItemHover
                        : {}),
                    }}
                    onMouseEnter={() => !isMobile && setHoveredBoard(board.id)}
                    onMouseLeave={() => !isMobile && setHoveredBoard(null)}
                    onTouchStart={() => isMobile && setHoveredBoard(board.id)}
                    onTouchEnd={() => isMobile && setHoveredBoard(null)}
                  >
                    <div style={styles.boardTitle}>
                      <div style={styles.colorIndicator} />
                      {board.title}
                    </div>
                    <div style={styles.boardMeta}>
                      <span style={styles.itemsCount}>
                        {board.items || 0} items
                      </span>
                      <span>Updated {board.updated || "recently"}</span>
                    </div>
                  </li>
                ))
              ) : (
                <li style={styles.emptyState}>No tasks found</li>
              )}
            </ul>
          </div>
          {/* Recently Viewed Card */}
          <div style={styles.card}>
            <div style={styles.cardGlow} />
            <div style={styles.cardHeader}>
              <h2 style={styles.cardTitle}>🕒 Recently Viewed</h2>
            </div>
            <ul style={styles.boardList}>
              {recentlyViewed.length > 0 ? (
                recentlyViewed.map((board) => (
                  <li
                    key={board.id}
                    style={{
                      ...styles.boardItem,
                      ...(hoveredBoard === board.id
                        ? styles.boardItemHover
                        : {}),
                    }}
                    onMouseEnter={() => !isMobile && setHoveredBoard(board.id)}
                    onMouseLeave={() => !isMobile && setHoveredBoard(null)}
                    onTouchStart={() => isMobile && setHoveredBoard(board.id)}
                    onTouchEnd={() => isMobile && setHoveredBoard(null)}
                  >
                    <div style={styles.boardTitle}>
                      <div style={styles.colorIndicator} />
                      {board.title}
                    </div>
                    <div style={styles.boardMeta}>
                      <span style={styles.teamBadge}>
                        {board.team || "Team"}
                      </span>
                      <span>Viewed {board.lastViewed || "recently"}</span>
                    </div>
                  </li>
                ))
              ) : (
                <li style={styles.emptyState}>No recently viewed boards</li>
              )}
            </ul>
          </div>
        </div>
      </div>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
}
