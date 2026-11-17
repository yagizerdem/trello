import { supabase } from "@/lib/supabase-client";
import type { User } from "@supabase/supabase-js";
import type Profile from "@shared/domain/profile";
import { createContext, useContext, useEffect, useState } from "react";

type AuthProviderProps = {
  children: React.ReactNode;
};

type AuthProviderState = {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  profile: Profile | null;
  setProfile: (profile: Profile | null) => void;
};

const initialState: AuthProviderState = {
  isAuthenticated: false,
  user: null,
  isLoading: true,
  profile: null,
  setProfile: () => null,
};

const AuthProviderContext = createContext<AuthProviderState>(initialState);

export function AuthProvider({ children, ...props }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const isAuthenticated = user !== null;
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      // console.log(event, session);
      if (event === "INITIAL_SESSION") {
        // handle initial session
        if (session?.user) {
          setUser(session.user);
        }
      } else if (event === "SIGNED_IN") {
        // handle sign in event
        if (session?.user) {
          setUser(session.user);
        }
      } else if (event === "SIGNED_OUT") {
        // handle sign out event
        setUser(null);
      } else if (event === "PASSWORD_RECOVERY") {
        // handle password recovery event
      } else if (event === "TOKEN_REFRESHED") {
        // handle token refreshed event
        if (session?.user) {
          setUser(session.user);
        }
      } else if (event === "USER_UPDATED") {
        // handle user updated event
        if (session?.user) {
          setUser(session.user);
        }
      }
      // after initial session or any auth state change, stop loading
      setIsLoading(false);
    });

    return () => {
      // call unsubscribe to remove the callback
      data.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (user) {
      supabase
        .from("profile")
        .select("*")
        .eq("user_id", user.id)
        .single()
        .then(({ data, error }) => {
          if (data && !error) {
            setProfile({
              avatar_url: data.avatar_url,
              createdAt: new Date(data.created_at),
              updatedAt: new Date(data.updated_at),
              first_name: data.first_name,
              last_name: data.last_name,
              id: data.id,
              user_id: data.user_id,
            });
          }
        });
    }
  }, [user]);

  const value: AuthProviderState = {
    isAuthenticated,
    user,
    isLoading,
    profile,
    setProfile,
  };

  console.log(profile);

  return (
    <AuthProviderContext.Provider {...props} value={value}>
      {children}
    </AuthProviderContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthProviderContext);

  if (context === undefined)
    throw new Error("useAuth must be used within an AuthProvider");

  return context;
};
