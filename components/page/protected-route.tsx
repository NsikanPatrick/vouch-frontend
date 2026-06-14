'use client';

import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { user, isLoading } = useAuth();
    const router = useRouter();
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        console.log('ProtectedRoute - isLoading:', isLoading);
        console.log('ProtectedRoute - user:', user);

        const checkAuth = () => {
            // If not loading and no user, check localStorage directly
            if (!isLoading) {
                if (!user) {
                    const storedUser = localStorage.getItem('user');
                    const storedToken = localStorage.getItem('accessToken');

                    console.log('ProtectedRoute - storedUser:', !!storedUser);
                    console.log('ProtectedRoute - storedToken:', !!storedToken);

                    if (!storedUser || !storedToken) {
                        console.log('ProtectedRoute - No user, redirecting to login');
                        router.push("/login");
                    }
                }
                setIsChecking(false);
            }
        };

        checkAuth();
    }, [isLoading, user, router]);

    if (isLoading || isChecking) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-2 text-muted-foreground">Loading...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return null;
    }

    return <>{children}</>;
}