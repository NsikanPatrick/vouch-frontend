'use client';

import Link from "next/link";
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Suspense } from 'react';

function GoogleCallbackContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        // Your backend redirects to /api/v1/auth/google/debug-view with tokens
        // We need to extract tokens from the URL hash or query params
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const queryParams = searchParams;

        // Check both hash and query params for tokens
        let token = hashParams.get('token') || queryParams.get('token');
        let refreshToken = hashParams.get('refresh') || queryParams.get('refresh');

        // Your backend redirects to /api/v1/auth/google/debug-view?token=xxx&refresh=xxx
        // But we can also handle the callback directly
        if (token && refreshToken) {
            // Store tokens
            localStorage.setItem('accessToken', token);
            localStorage.setItem('refreshToken', refreshToken);

            // Try to get user profile from the backend
            fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/profile`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            })
                .then(res => res.json())
                .then(user => {
                    if (user && user.id) {
                        localStorage.setItem('user', JSON.stringify(user));
                        setStatus('success');
                        // Redirect to dashboard after 2 seconds
                        setTimeout(() => {
                            router.push('/dashboard');
                        }, 2000);
                    } else {
                        throw new Error('Failed to fetch user profile');
                    }
                })
                .catch(err => {
                    console.error('Failed to fetch user profile:', err);
                    setStatus('error');
                    setErrorMessage('Failed to complete Google sign-in. Please try again.');
                });
        } else {
            // Check for error in URL
            const error = queryParams.get('error');
            if (error) {
                setStatus('error');
                setErrorMessage(decodeURIComponent(error));
            } else {
                setStatus('error');
                setErrorMessage('Google sign-in failed. Please try again.');
            }
        }
    }, [router, searchParams]);

    if (status === 'loading') {
        return (
            <div className="flex min-h-screen items-center justify-center bg-background p-4">
                <Card className="w-full max-w-md">
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <Loader2 className="h-12 w-12 animate-spin text-primary" />
                        <p className="mt-4 text-muted-foreground">Completing Google sign-in...</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (status === 'success') {
        return (
            <div className="flex min-h-screen items-center justify-center bg-background p-4">
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <div className="flex justify-center mb-4">
                            <CheckCircle className="h-16 w-16 text-green-500" />
                        </div>
                        <CardTitle className="text-center">Login Successful!</CardTitle>
                        <CardDescription className="text-center">
                            Redirecting you to your dashboard...
                        </CardDescription>
                    </CardHeader>
                </Card>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-background p-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <div className="flex justify-center mb-4">
                        <XCircle className="h-16 w-16 text-red-500" />
                    </div>
                    <CardTitle className="text-center">Login Failed</CardTitle>
                    <CardDescription className="text-center">
                        {errorMessage || 'Something went wrong. Please try again.'}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Button className="w-full" asChild>
                        <Link href="/login">Back to Login</Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}

export default function GoogleCallbackPage() {
    return (
        <Suspense fallback={
            <div className="flex min-h-screen items-center justify-center bg-background p-4">
                <Card className="w-full max-w-md">
                    <CardContent className="flex justify-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </CardContent>
                </Card>
            </div>
        }>
            <GoogleCallbackContent />
        </Suspense>
    );
}