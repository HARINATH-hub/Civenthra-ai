import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

// Clearly labeled Demo Authority Account for development & presentation evaluation
export const DEMO_AUTHORITY_ACCOUNT = {
  id: 'auth_demo_01',
  name: 'Municipal Grievance Administrator',
  email: 'authority@civenthra.demo',
  role: 'authority',
  designation: 'Executive Engineer / Grievance Review Officer',
  department: 'Public Works & Municipal Administration',
  jurisdiction: 'Greater Municipal Corporation (All Zones)',
  isDemoAccount: true
};

export function AuthProvider({ children }) {
  // Current authenticated user session (null by default for a clean fresh system)
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('civenthra_session_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  // Registered citizens simulated database in localStorage
  const [registeredUsers, setRegisteredUsers] = useState(() => {
    const saved = localStorage.getItem('civenthra_registered_users');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    return [];
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('civenthra_session_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('civenthra_session_user');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('civenthra_registered_users', JSON.stringify(registeredUsers));
  }, [registeredUsers]);

  /**
   * Citizen Registration
   * Required fields: Full Name, Email, Mobile Number, Password, Preferred Language
   */
  const registerCitizen = ({ name, email, phone, password, preferredLanguage = 'en' }) => {
    const trimmedEmail = email.trim().toLowerCase();
    
    // Check if user already registered
    const existing = registeredUsers.find(u => u.email.toLowerCase() === trimmedEmail);
    if (existing) {
      throw new Error('An account with this email address already exists. Please log in.');
    }

    const newUser = {
      id: `cit_${Date.now()}`,
      name: name.trim(),
      email: trimmedEmail,
      phone: phone.trim(),
      password, // In real backend with FastAPI, this will be hashed with bcrypt
      preferredLanguage,
      role: 'citizen',
      registeredAt: new Date().toISOString()
    };

    setRegisteredUsers(prev => [...prev, newUser]);

    // Create session for newly registered citizen
    const sessionUser = { ...newUser };
    delete sessionUser.password;
    setUser(sessionUser);
    return sessionUser;
  };

  /**
   * Citizen Login
   */
  const loginCitizen = ({ email, password }) => {
    const trimmedEmail = email.trim().toLowerCase();
    const found = registeredUsers.find(
      u => u.email.toLowerCase() === trimmedEmail && u.password === password
    );

    if (!found) {
      // If no account exists yet, provide helpful message
      if (registeredUsers.length === 0) {
        throw new Error('No registered citizen accounts found. Please register a new citizen account first.');
      }
      throw new Error('Invalid email or password. Please verify your credentials or register a new account.');
    }

    const sessionUser = { ...found };
    delete sessionUser.password;
    setUser(sessionUser);
    return sessionUser;
  };

  /**
   * Authority Login
   * Explicitly labeled Demo Authority Account
   */
  const loginAuthority = ({ email, password } = {}) => {
    // For demo/dev purposes, accept the authority demo account
    const sessionUser = { ...DEMO_AUTHORITY_ACCOUNT };
    setUser(sessionUser);
    return sessionUser;
  };

  const logout = () => {
    setUser(null);
  };

  const updateProfile = (updatedFields) => {
    setUser(prev => {
      if (!prev) return null;
      const updated = { ...prev, ...updatedFields };
      // Also update in registeredUsers if citizen
      if (prev.role === 'citizen') {
        setRegisteredUsers(list =>
          list.map(u => (u.id === prev.id ? { ...u, ...updatedFields } : u))
        );
      }
      return updated;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || null,
        isAuthenticated: Boolean(user),
        isCitizen: user?.role === 'citizen',
        isAuthority: user?.role === 'authority',
        registerCitizen,
        loginCitizen,
        loginAuthority,
        logout,
        updateProfile,
        registeredUsersCount: registeredUsers.length
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
