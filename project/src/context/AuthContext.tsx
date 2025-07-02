import React, { createContext, useContext, useState, useEffect } from 'react';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { supabase, signIn, signUp, signOut, getCurrentUser, getProfile, updateProfile as updateProfileDB } from '../lib/supabase';
import { User, Founder, Talent } from '../types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: any) => Promise<boolean>;
  logout: () => void;
  updateProfile?: (userData: User) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const convertSupabaseProfile = (profile: any): User => {
  const baseUser: User = {
    id: profile.id,
    email: profile.email,
    name: profile.name,
    role: profile.role,
    status: profile.status,
    avatar: profile.avatar_url,
    createdAt: new Date(profile.created_at),
  };

  if (profile.role === 'founder') {
    return {
      ...baseUser,
      company: profile.company,
      phone: profile.phone,
      address: profile.address,
      walletBalance: profile.wallet_balance || 0,
    } as Founder;
  }

  if (profile.role === 'talent') {
    return {
      ...baseUser,
      bio: profile.bio,
      portfolio: Array.isArray(profile.portfolio) ? profile.portfolio : [],
      rateLevel: profile.rate_level || 1,
      skills: Array.isArray(profile.skills) ? profile.skills : [],
      socialMedia: profile.social_media || {},
      totalEarnings: profile.total_earnings || 0,
    } as Talent;
  }

  return baseUser;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { user: supabaseUser } = await getCurrentUser();
        
        if (supabaseUser) {
          const { data: profile } = await getProfile(supabaseUser.id);
          if (profile) {
            setUser(convertSupabaseProfile(profile));
          }
        }
      } catch (error) {
        console.error('Error getting initial session:', error);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          const { data: profile } = await getProfile(session.user.id);
          if (profile) {
            setUser(convertSupabaseProfile(profile));
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      const { data, error } = await signIn(email, password);
      
      if (error) {
        console.error('Login error:', error);
        return false;
      }

      if (data.user) {
        const { data: profile } = await getProfile(data.user.id);
        if (profile) {
          setUser(convertSupabaseProfile(profile));
          return true;
        }
      }
      
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: any): Promise<boolean> => {
    try {
      setLoading(true);
      
      const { data, error } = await signUp(userData.email, userData.password, {
        name: userData.name,
        role: userData.role,
        company: userData.company,
        bio: userData.bio,
      });

      if (error) {
        console.error('Registration error:', error);
        return false;
      }

      // For talents, they need admin approval, so don't auto-login
      if (userData.role === 'talent') {
        return true;
      }

      // For founders and admins, auto-login after registration
      if (data.user) {
        const { data: profile } = await getProfile(data.user.id);
        if (profile) {
          setUser(convertSupabaseProfile(profile));
        }
      }

      return true;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (userData: User): Promise<void> => {
    try {
      const updates: any = {
        name: userData.name,
        email: userData.email,
      };

      if (userData.role === 'founder') {
        const founder = userData as Founder;
        updates.company = founder.company;
        updates.phone = founder.phone;
        updates.address = founder.address;
        updates.wallet_balance = founder.walletBalance;
      }

      if (userData.role === 'talent') {
        const talent = userData as Talent;
        updates.bio = talent.bio;
        updates.portfolio = talent.portfolio;
        updates.rate_level = talent.rateLevel;
        updates.skills = talent.skills;
        updates.social_media = talent.socialMedia;
        updates.total_earnings = talent.totalEarnings;
      }

      const { data, error } = await updateProfileDB(userData.id, updates);
      
      if (error) {
        throw error;
      }

      if (data) {
        setUser(convertSupabaseProfile(data));
      }
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut();
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      login, 
      register, 
      logout, 
      updateProfile 
    }}>
      {children}
    </AuthContext.Provider>
  );
};