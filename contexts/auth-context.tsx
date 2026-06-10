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

    const signOut = async () => {
        if (refreshToken) {
            try {
                await apiClient.logout(refreshToken);
            } catch (error) {
                console.error('Logout error:', error);
            }
        }

        setAccessToken(null);
        setRefreshToken(null);
        setUser(null);
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