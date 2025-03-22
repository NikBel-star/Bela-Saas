import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

// Define user type
export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  createdAt: string;
}

// Define auth context type
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
}

// Create auth context with default values
const defaultContext: AuthContextType = {
  user: null,
  isLoading: false,
  isAuthenticated: false,
  login: async () => { throw new Error("Not implemented"); },
  logout: async () => { throw new Error("Not implemented"); }
};

export const AuthContext = createContext<AuthContextType>(defaultContext);

// Auth provider props type
interface AuthProviderProps {
  children: ReactNode;
}

// Auth provider component
export function AuthProvider({ children }: AuthProviderProps) {
  const queryClient = useQueryClient();
  const [user, setUser] = useState<User | null>(null);

  // Fetch current user
  const { data, isLoading } = useQuery({ 
    queryKey: ["auth", "me"],
    queryFn: async () => {
      try {
        const response = await apiRequest("GET", "/api/auth/me");
        const userData = await response.json();
        return userData as User;
      } catch (error) {
        return null;
      }
    },
  });

  // Update user state when data changes
  useEffect(() => {
    setUser(data || null);
  }, [data]);

  // Check if user is authenticated
  const isAuthenticated = !!user;

  // Login function
  const login = async (email: string, password: string): Promise<User> => {
    const response = await apiRequest(
      "POST", 
      "/api/auth/login", 
      { email, password }
    );
    
    // Invalidate query to refetch user data
    queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
    
    const userData = await response.json();
    return userData as User;
  };

  // Logout function
  const logout = async (): Promise<void> => {
    await apiRequest("POST", "/api/auth/logout");
    
    // Invalidate query to refetch user data
    queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
    
    // Clear user state
    setUser(null);
  };

  // Create context value object
  const contextValue = {
    user,
    isLoading,
    isAuthenticated,
    login,
    logout
  };

  // Return auth context provider
  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  return context;
}