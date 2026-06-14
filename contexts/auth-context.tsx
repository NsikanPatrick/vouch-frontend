'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiClient } from '@/lib/api-client';

interface User {
    id: string;
    email: string;
    name: string;
    role: string;
    status: string;
    profilePicture?: string | null;
}

interface AuthContextType {
    user: User | null;
    accessToken: string | null;
    refreshToken: string | null;
    isLoading: boolean;
    signUp: (email: string, name: string, password: string) => Promise<void>;
    signIn: (email: string, password: string) => Promise<void>;
    signOut: () => Promise<void>;
    refreshAuthToken: () => Promise<void>;
    updateUser: (updatedUserData: Partial<User>) => void;
    refreshUserData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [refreshToken, setRefreshToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Function to load user data from localStorage
    const loadUserFromStorage = () => {
        const storedAccessToken = localStorage.getItem('accessToken');
        const storedRefreshToken = localStorage.getItem('refreshToken');
        const storedUser = localStorage.getItem('user');

        console.log('🔄 Loading from storage - AccessToken:', !!storedAccessToken);
        console.log('🔄 Loading from storage - User:', !!storedUser);

        if (storedAccessToken && storedRefreshToken && storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                setAccessToken(storedAccessToken);
                setRefreshToken(storedRefreshToken);
                setUser(parsedUser);
                console.log('✅ Loaded user from storage:', parsedUser);
                return true;
            } catch (error) {
                console.error('Failed to parse stored user:', error);
            }
        }
        return false;
    };

    // Load tokens from localStorage on mount
    useEffect(() => {
        loadUserFromStorage();
        setIsLoading(false);
    }, []);

    // Listen for storage events (triggered when localStorage changes in another tab/window)
    useEffect(() => {
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === 'user' || e.key === 'accessToken' || e.key === 'refreshToken') {
                console.log('🔄 Storage changed, reloading user data...');
                loadUserFromStorage();
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    const refreshUserData = async () => {
        if (!accessToken) return;

        try {
            const profile = await apiClient.getProfile(accessToken);
            if (profile) {
                const updatedUser = {
                    id: profile.id,
                    email: profile.email,
                    name: profile.name,
                    role: profile.role,
                    status: profile.status,
                    profilePicture: profile.profilePicture || null,
                };
                setUser(updatedUser);
                localStorage.setItem('user', JSON.stringify(updatedUser));
                console.log('🔄 Refreshed user data, profile picture:', updatedUser.profilePicture);
            }
        } catch (error) {
            console.error('Failed to refresh user data:', error);
        }
    };

    // Load tokens from localStorage on mount
    useEffect(() => {
        const storedAccessToken = localStorage.getItem('accessToken');
        const storedRefreshToken = localStorage.getItem('refreshToken');
        const storedUser = localStorage.getItem('user');

        if (storedAccessToken && storedRefreshToken) {
            setAccessToken(storedAccessToken);
            setRefreshToken(storedRefreshToken);

            if (storedUser) {
                try {
                    const parsedUser = JSON.parse(storedUser);
                    setUser(parsedUser);
                    console.log('✅ Loaded user from storage:', parsedUser);
                } catch (error) {
                    console.error('Failed to parse stored user:', error);
                }
            }

            // Refresh user data from server
            refreshUserData();
        }
        setIsLoading(false);
    }, []);

    // Save tokens to localStorage whenever they change
    useEffect(() => {
        if (accessToken && refreshToken && user) {
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', refreshToken);
            localStorage.setItem('user', JSON.stringify(user));
            console.log('💾 Saved user to storage:', user);
        }
    }, [accessToken, refreshToken, user]);

    const signUp = async (email: string, name: string, password: string) => {
        setIsLoading(true);
        try {
            const response = await apiClient.register({ email, name, password });

            setAccessToken(response.accessToken);
            setRefreshToken(response.refreshToken);
            const userData = {
                id: response.user.id,
                email: response.user.email,
                name: response.user.name,
                role: response.user.role,
                status: response.user.status,
                profilePicture: response.user.profilePicture || null,
            };
            setUser(userData);
        } catch (error) {
            console.error('Signup error:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const signIn = async (email: string, password: string) => {
        setIsLoading(true);
        try {
            const response = await apiClient.login({ email, password });

            console.log('🔐 Login response user:', response.user);

            setAccessToken(response.accessToken);
            setRefreshToken(response.refreshToken);

            const userData = {
                id: response.user.id,
                email: response.user.email,
                name: response.user.name,
                role: response.user.role,
                status: response.user.status,
                profilePicture: response.user.profilePicture || null,
            };
            setUser(userData);
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    // const signOut = async () => {
    //     if (refreshToken) {
    //         try {
    //             await apiClient.logout(refreshToken);
    //         } catch (error) {
    //             console.error('Logout error:', error);
    //         }
    //     }

    //     setAccessToken(null);
    //     setRefreshToken(null);
    //     setUser(null);
    // };

    const signOut = async () => {
        setIsLoading(true);

        try {
            // 1. Revoke the refresh token on the backend if it exists
            const currentRefreshToken = localStorage.getItem('refreshToken');
            if (currentRefreshToken) {
                try {
                    await apiClient.logout(currentRefreshToken);
                    console.log('✅ Token revoked on backend');
                } catch (error) {
                    console.error('Logout API error:', error);
                    // Continue with local cleanup even if API fails
                }
            }

            // 2. Clear all authentication data from localStorage
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');

            // 3. Clear sessionStorage if you're using it
            sessionStorage.removeItem('otpEmail');

            // 4. Clear any other app-specific storage
            // Add any other keys you might have stored
            // localStorage.removeItem('someOtherKey');

            // 5. Clear React state
            setAccessToken(null);
            setRefreshToken(null);
            setUser(null);

            console.log('✅ All auth data cleared from storage');

        } catch (error) {
            console.error('Logout error:', error);
            // Still clear local data even if API fails
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');
            setAccessToken(null);
            setRefreshToken(null);
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    };

    const refreshAuthToken = async () => {
        if (!refreshToken) return;

        try {
            const response = await apiClient.refreshToken(refreshToken);
            setAccessToken(response.accessToken);
            await refreshUserData();
        } catch (error) {
            console.error('Token refresh error:', error);
            await signOut();
        }
    };

    const updateUser = (updatedUserData: Partial<User>) => {
        if (user) {
            const newUser = { ...user, ...updatedUserData };
            setUser(newUser);
            localStorage.setItem('user', JSON.stringify(newUser));
            console.log('🔄 Updated user:', newUser);
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                accessToken,
                refreshToken,
                isLoading,
                signUp,
                signIn,
                signOut,
                refreshAuthToken,
                updateUser,
                refreshUserData,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}