'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

function OAuthRedirectContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const token = searchParams.get('token');
        const refreshToken = searchParams.get('refresh');
        const userParam = searchParams.get('user');

        if (token && refreshToken) {
            // Store tokens
            localStorage.setItem('accessToken', token);
            localStorage.setItem('refreshToken', refreshToken);

            // If user data is passed in URL, use it directly
            if (userParam) {
                try {
                    const user = JSON.parse(decodeURIComponent(userParam));
                    if (user && user.id) {
                        localStorage.setItem('user', JSON.stringify(user));
                        router.push('/dashboard');
                        return;
                    }
                } catch (e) {
                    console.error('Failed to parse user data:', e);
                }
            }

            // ✅ Fallback: Fetch user profile if not passed in URL
            fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/profile`, {
                headers: { 'Authorization': `Bearer ${token}` },
            })
                .then(res => res.json())
                .then(user => {
                    if (user && user.id) {
                        localStorage.setItem('user', JSON.stringify(user));
                        router.push('/dashboard');
                    } else {
                        router.push('/login?error=Failed to fetch user profile');
                    }
                })
                .catch((err) => {
                    console.error('Profile fetch error:', err);
                    router.push('/login?error=Google sign-in failed');
                });
        } else {
            router.push('/login?error=Invalid OAuth response');
        }
    }, [router, searchParams]);

    return (
        <div className="flex min-h-screen items-center justify-center">
            <Card className="w-full max-w-md">
                <CardContent className="flex flex-col items-center justify-center py-12">
                    <Loader2 className="h-12 w-12 animate-spin text-primary" />
                    <p className="mt-4 text-muted-foreground">Completing Google sign-in...</p>
                </CardContent>
            </Card>
        </div>
    );
}

export default function OAuthRedirectPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <OAuthRedirectContent />
        </Suspense>
    );
}