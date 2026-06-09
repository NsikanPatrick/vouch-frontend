'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiClient } from '@/lib/api-client';

interface User {
    id: string;
    email: string;
    name: string;
    role: string;
    status: string;
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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [refreshToken, setRefreshToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Load tokens from localStorage on mount
    useEffect(() => {
        const storedAccessToken = localStorage.getItem('accessToken');
        const storedRefreshToken = localStorage.getItem('refreshToken');
        const storedUser = localStorage.getItem('user');

        if (storedAccessToken && storedRefreshToken && storedUser) {
            setAccessToken(storedAccessToken);
            setRefreshToken(storedRefreshToken);
            setUser(JSON.parse(storedUser));
        }
        setIsLoading(false);
    }, []);

    // Save tokens to localStorage whenever they change
    useEffect(() => {
        if (accessToken && refreshToken && user) {
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', refreshToken);
            localStorage.setItem('user', JSON.stringify(user));
        } else {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');
        }
    }, [accessToken, refreshToken, user]);

    const signUp = async (email: string, name: string, password: string) => {
        setIsLoading(true);
        try {
            const response = await apiClient.register({ email, name, password });

            // Store tokens and user data
            setAccessToken(response.accessToken);
            setRefreshToken(response.refreshToken);
            setUser(response.user);

            // Note: After signup, email verification is required
            // User will have status: 'pending_verification'
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

            setAccessToken(response.accessToken);
            setRefreshToken(response.refreshToken);
            setUser(response.user);
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
        } catch (error) {
            console.error('Token refresh error:', error);
            await signOut();
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