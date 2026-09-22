import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('lb_user');
    return saved ? JSON.parse(saved) : {
      uid: 'user-demo-123',
      displayName: 'Danilo Silva',
      email: 'danilo@example.com',
      handle: '@danilosilva',
      avatarUrl: null
    };
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('lb_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('lb_user');
    }
  }, [currentUser]);

  const login = (email, password) => {
    const user = {
      uid: 'user-' + Date.now(),
      displayName: email.split('@')[0],
      email,
      handle: `@${email.split('@')[0]}`,
      avatarUrl: null
    };
    setCurrentUser(user);
    setIsAuthModalOpen(false);
  };

  const signup = (displayName, email, password) => {
    const user = {
      uid: 'user-' + Date.now(),
      displayName,
      email,
      handle: `@${displayName.toLowerCase().replace(/\s+/g, '')}`,
      avatarUrl: null
    };
    setCurrentUser(user);
    setIsAuthModalOpen(false);
  };

  const logout = () => {
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      login,
      signup,
      logout,
      isAuthModalOpen,
      setIsAuthModalOpen
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
