import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser, registerUser } from "../api/authApi";
import { requestFreshAccessToken } from "../api/client";
import { tokenStorage } from "../utils/tokenStorage";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [accessToken, setAccessToken] = useState(tokenStorage.get());
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    let ignore = false;

    async function bootstrapSession() {
      if (tokenStorage.get()) {
        setIsInitializing(false);
        return;
      }

      try {
        const nextToken = await requestFreshAccessToken();

        if (ignore) {
          return;
        }

        tokenStorage.set(nextToken);
        setAccessToken(nextToken);
      } catch {
        if (!ignore) {
          tokenStorage.clear();
          setAccessToken(null);
        }
      } finally {
        if (!ignore) {
          setIsInitializing(false);
        }
      }
    }

    bootstrapSession();

    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    function handleForcedLogout() {
      tokenStorage.clear();
      setAccessToken(null);
      navigate("/login", {
        replace: true,
        state: {
          message: "Your session expired. Please sign in again."
        }
      });
    }

    window.addEventListener("auth:logout", handleForcedLogout);

    return () => {
      window.removeEventListener("auth:logout", handleForcedLogout);
    };
  }, [navigate]);

  async function login(credentials) {
    const data = await loginUser(credentials);
    console.log("LOGIN RESPONSE:", data);

    if (!data?.accessToken) {
      throw new Error("Login response did not include an access token.");
    }

    tokenStorage.set(data.accessToken);
    setAccessToken(data.accessToken);
    return data;
  }

  async function register(credentials) {
    return registerUser(credentials);
  }

  function logout() {
    tokenStorage.clear();
    setAccessToken(null);
    navigate("/login", { replace: true });
  }

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        isAuthenticated: Boolean(accessToken),
        isInitializing,
        login,
        register,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
