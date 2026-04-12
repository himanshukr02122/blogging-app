"use client";

import {
  createContext,
  useEffect,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
} from "react";

import { User } from "@/app/types/blog";
import {
  AuthResponse,
  clearSession,
  getStoredToken,
  getStoredUser,
  logoutRequest,
  persistSession,
} from "@/lib/auth";

type AppContextType = {
  selectedTags: string[];
  setSelectedTags: React.Dispatch<SetStateAction<string[]>>;
  token: string | null;
  currentUser: User | null;
  isHydrated: boolean;
  isAuthenticated: boolean;
  setSession: (session: AuthResponse) => void;
  logout: () => Promise<void>;
};

const initialValues: AppContextType = {
  selectedTags: [],
  setSelectedTags: () => {},
  token: null,
  currentUser: null,
  isHydrated: false,
  isAuthenticated: false,
  setSession: () => {},
  logout: async () => {},
};

export const AppContext = createContext<AppContextType>(initialValues);

export const useAppContext = () => useContext(AppContext);

const AppProvider = ({ children }: { children: ReactNode }) => {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [token, setToken] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setToken(getStoredToken());
    setCurrentUser(getStoredUser());
    setIsHydrated(true);
  }, []);

  const setSession = (session: AuthResponse) => {
    persistSession(session);
    setToken(session.access_token);
    setCurrentUser(session.user);
    setIsHydrated(true);
  };

  const logout = async () => {
    try {
      await logoutRequest(token);
    } catch {
      // Ignore logout transport errors because the client session is authoritative here.
    } finally {
      clearSession();
      setToken(null);
      setCurrentUser(null);
      setIsHydrated(true);
    }
  };

  return (
    <AppContext.Provider
      value={{
        selectedTags,
        setSelectedTags,
        token,
        currentUser,
        isHydrated,
        isAuthenticated: Boolean(token && currentUser),
        setSession,
        logout,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;
