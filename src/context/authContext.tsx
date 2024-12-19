import { createContext, useContext, createSignal, onMount } from "solid-js";
import SD from "../SD";
import { jwtDecode, JwtPayload } from "jwt-decode";

type AuthContextType = {
  isAuthenticated: () => boolean;
  login: () => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType>();

export const AuthProvider = (props: any) => {
  const [authenticated, setAuthenticated] = createSignal(false);

  const login = () => setAuthenticated(true);
  const logout = () => setAuthenticated(false);

  // helper
  const isTokenExpired = (token: string) => {
    if (!token) return true;
    try {
      const decodedToken: JwtPayload = jwtDecode(token);
      if (!decodedToken || !decodedToken?.exp) {
        return true;
      }
      const currentTime = Date.now() / 1000;
      return decodedToken.exp < currentTime;
    } catch (error) {
      console.error("Error decoding token:", error);
      return true;
    }
  };

  onMount(() => {
    const token: string | null = window.localStorage.getItem(
      SD.localStorageKeys.jwt
    ) as string;
    var flag = !isTokenExpired(token);
    console.log(flag, "flag");
    setAuthenticated(flag);
  });

  return (
    <AuthContext.Provider
      value={{ isAuthenticated: () => authenticated(), login, logout }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
