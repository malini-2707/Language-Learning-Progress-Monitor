import { createContext, useContext, useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import api from '../utils/api';

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = jwtDecode(token);
        // fetch profile to get name and details
        (async () => {
          try {
            const { data } = await api.get('/me');
            setUser({ id: payload.id, role: payload.role, name: data?.name, email: data?.email });
          } catch {
            setUser({ id: payload.id, role: payload.role });
          }
        })();
      } catch {
        localStorage.removeItem('token');
      }
    }
  }, []);

  return (
    <AuthCtx.Provider value={{ user, setUser }}>
      {children}
    </AuthCtx.Provider>
  );
}

export function useAuth() {
  return useContext(AuthCtx);
}
