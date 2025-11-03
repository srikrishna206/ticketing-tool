










// src/context/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from "react"; // <-- CORRECTED LINE

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = () => {
      console.log("AuthContext: Starting initial user load from localStorage...");
      try {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          if (parsedUser && parsedUser.email && parsedUser.id) {
            setUser(parsedUser);
            // FIX: Changed 'parsed.email' to 'parsedUser.email' as 'parsed' was undefined
            console.log("AuthContext: User found in localStorage:", parsedUser.email);
          } else {
            console.warn("AuthContext: Malformed user data in localStorage, clearing it.");
            localStorage.removeItem("user");
          }
        } else {
          console.log("AuthContext: No user found in localStorage.");
        }
      } catch (error) {
        console.error("AuthContext: Error parsing user from localStorage:", error);
        localStorage.removeItem("user");
      } finally {
        setLoading(false);
        console.log("AuthContext: Initial user load finished. Loading state set to false.");
      }
    };

    loadUser();
  }, []);

  // --- REAL BACKEND LOGIN FUNCTION ---
  const login = async (email, password) => {
    setLoading(true); // Set loading to true during login process
    console.log(`AuthContext: Login attempt for email: ${email}`);
    try {
      // Call the real backend API
      const response = await fetch('http://localhost:8000/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store admin info in localStorage
        localStorage.setItem('adminUser', JSON.stringify(data));
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('user', JSON.stringify(data)); // Also store in 'user' for compatibility
        
        setUser(data);
        console.log("AuthContext: Login successful! User set and stored.", data);
        return data;
      } else {
        console.error("AuthContext: Login failed:", data.detail);
        setUser(null);
        localStorage.removeItem("user");
        localStorage.removeItem("adminUser");
        localStorage.removeItem("isAuthenticated");
        throw new Error(data.detail || 'Invalid email or password');
      }

    } catch (error) {
      console.error("AuthContext: Login failed:", error.message);
      setUser(null);
      localStorage.removeItem("user");
      localStorage.removeItem("adminUser");
      localStorage.removeItem("isAuthenticated");
      throw error;
    } finally {
      setLoading(false); // Always set loading to false after login attempt
      console.log("AuthContext: Login process finished. Loading state set to false.");
    }
  };
  // --- END OF MODIFIED LOGIN FUNCTION ---

  const logout = () => {
    console.log("AuthContext: User logging out.");
    setLoading(true);
    setUser(null);
    localStorage.removeItem("user");
    setLoading(false);
    console.log("AuthContext: Logout complete.");
  };

  const authContextValue = {
    user,
    loading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};