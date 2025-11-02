import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const ROLE_CLAIM =
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role";

type AuthContextValue = {
  token: string | null;
  role: string | null;
  initialized: boolean;
  login: (token: string) => string | null;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const decodeRoleFromToken = (token: string): string | null => {
  try {
    const parts = token.split(".");
    if (parts.length < 2) {
      return null;
    }

    const base64Url = parts[1];
    const normalized = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const padding = (4 - (normalized.length % 4)) % 4;
    const base64 = normalized + "=".repeat(padding);
    const jsonPayload = atob(base64);
    const payload = JSON.parse(jsonPayload);

    return (
      payload?.[ROLE_CLAIM] ??
      payload?.role ??
      payload?.Role ??
      payload?.roles ??
      null
    );
  } catch (error) {
    console.warn("Falha ao decodificar token JWT:", error);
    return null;
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);

  const applyToken = useCallback((newToken: string | null) => {
    if (newToken) {
      const extractedRole = decodeRoleFromToken(newToken);
      setToken(newToken);
      setRole(extractedRole);
      localStorage.setItem("token", newToken);
      if (extractedRole) {
        localStorage.setItem("userRole", extractedRole);
      } else {
        localStorage.removeItem("userRole");
      }
    } else {
      setToken(null);
      setRole(null);
      localStorage.removeItem("token");
      localStorage.removeItem("userRole");
    }
  }, []);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      applyToken(storedToken);
    } else {
      setToken(null);
      setRole(null);
    }
    setInitialized(true);
  }, [applyToken]);

  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key === "token") {
        applyToken(event.newValue);
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [applyToken]);

  const login = useCallback(
    (incomingToken: string) => {
      applyToken(incomingToken);
      return decodeRoleFromToken(incomingToken);
    },
    [applyToken]
  );

  const logout = useCallback(() => {
    applyToken(null);
  }, [applyToken]);

  const value = useMemo(
    () => ({
      token,
      role,
      initialized,
      login,
      logout,
    }),
    [token, role, initialized, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

