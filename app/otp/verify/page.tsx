'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Key, Loader2, ArrowLeft, RefreshCw } from 'lucide-react';

export default function OtpVerifyPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [code, setCode] = useState(['', '', '', '', '', '']);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [resendCountdown, setResendCountdown] = useState(0);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    // Load email from sessionStorage
    useEffect(() => {
        const storedEmail = sessionStorage.getItem('otpEmail');
        if (storedEmail) {
            setEmail(storedEmail);
        } else {
            // No email found, redirect to request page
            router.push('/otp/request');
        }
    }, [router]);

    // Countdown timer for resend
    useEffect(() => {
        if (resendCountdown > 0) {
            const timer = setTimeout(() => setResendCountdown(resendCountdown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [resendCountdown]);

    const handleCodeChange = (index: number, value: string) => {
        // Only allow digits
        if (value && !/^\d+$/.test(value)) return;

        const newCode = [...code];
        newCode[index] = value.slice(0, 1);
        setCode(newCode);

        // Auto-focus next input
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        // Move to previous input on backspace
        if (e.key === 'Backspace' && !code[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        const otpCode = code.join('');
        if (otpCode.length !== 6) {
            setError('Please enter the 6-digit verification code');
            setIsLoading(false);
            return;
        }

        try {
            console.log('📡 Sending OTP verification for:', email);

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/otp/verify`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, code: otpCode }),
            });

            const data = await response.json();
            console.log('📡 OTP Response:', data);

            if (response.ok) {
                // ✅ Check if user data is present
                if (!data.user) {
                    console.error('❌ No user data in response:', data);
                    setError('Login failed: No user data received');
                    setIsLoading(false);
                    return;
                }

                console.log('✅ Storing user data:', data.user);

                // Store tokens
                localStorage.setItem('accessToken', data.accessToken);
                localStorage.setItem('refreshToken', data.refreshToken);
                localStorage.setItem('user', JSON.stringify(data.user));

                // Clear stored email
                sessionStorage.removeItem('otpEmail');

                // Redirect to dashboard
                console.log('🚀 Redirecting to dashboard...');
                router.push('/dashboard');
            } else {
                console.error('❌ OTP verification failed:', data);
                setError(data.message || 'Invalid or expired verification code');
                // Clear all inputs on error
                setCode(['', '', '', '', '', '']);
                inputRefs.current[0]?.focus();
            }
        } catch (err) {
            console.error('❌ Network error:', err);
            setError('Network error. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleResendCode = async () => {
        if (resendCountdown > 0) return;

        setError('');
        setIsLoading(true);

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/otp/request`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (response.ok) {
                setResendCountdown(60);
                // Clear inputs
                setCode(['', '', '', '', '', '']);
                inputRefs.current[0]?.focus();
                // Show success message temporarily
                const successMsg = document.createElement('div');
                successMsg.className = 'fixed top-4 right-4 rounded-md bg-green-500/10 p-3 text-sm text-green-600';
                successMsg.textContent = 'New verification code sent!';
                document.body.appendChild(successMsg);
                setTimeout(() => successMsg.remove(), 3000);
            } else {
                setError(data.message || 'Failed to resend code');
            }
        } catch (err) {
            setError('Network error. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    if (!email) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-background p-4">
                <Card className="w-full max-w-md">
                    <CardContent className="flex justify-center py-8">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-background p-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <div className="flex justify-center mb-4">
                        <div className="rounded-full bg-primary/10 p-3">
                            <Key className="h-8 w-8 text-primary" />
                        </div>
                    </div>
                    <CardTitle className="text-center">Verify Your Identity</CardTitle>
                    <CardDescription className="text-center">
                        Enter the 6-digit code sent to <strong>{email}</strong>
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* OTP Input Fields */}
                        <div className="space-y-2">
                            <Label className="text-center block">Verification Code</Label>
                            <div className="flex justify-center gap-2">
                                {code.map((digit, index) => (
                                    <Input
                                        key={index}
                                        ref={(el) => { inputRefs.current[index] = el; }}
                                        type="text"
                                        inputMode="numeric"
                                        maxLength={1}
                                        value={digit}
                                        onChange={(e) => handleCodeChange(index, e.target.value)}
                                        onKeyDown={(e) => handleKeyDown(index, e)}
                                        className="h-12 w-12 text-center text-lg font-semibold"
                                        disabled={isLoading}
                                        autoFocus={index === 0}
                                    />
                                ))}
                            </div>
                            <p className="text-center text-xs text-muted-foreground">
                                Enter the 6-digit verification code from your email
                            </p>
                        </div>

                        {error && (
                            <div className="rounded-md bg-red-500/10 p-3 text-sm text-red-600">
                                {error}
                            </div>
                        )}

                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Verifying...
                                </>
                            ) : (
                                'Verify & Login'
                            )}
                        </Button>

                        {/* Resend Code Section */}
                        <div className="text-center">
                            <button
                                type="button"
                                onClick={handleResendCode}
                                disabled={resendCountdown > 0 || isLoading}
                                className="inline-flex items-center text-sm text-primary hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <RefreshCw className="mr-1 h-3 w-3" />
                                {resendCountdown > 0
                                    ? `Resend code in ${resendCountdown}s`
                                    : "Didn't receive code? Resend"
                                }
                            </button>
                        </div>

                        <div className="relative my-4">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-background px-2 text-muted-foreground">
                                    Or
                                </span>
                            </div>
                        </div>

                        <Button variant="outline" className="w-full" asChild>
                            <Link href="/login">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Sign in with Password
                            </Link>
                        </Button>

                        <div className="text-center text-xs text-muted-foreground">
                            The verification code expires in 10 minutes for security
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}