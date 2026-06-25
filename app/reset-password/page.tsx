'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
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
import { Lock, Eye, EyeOff, Loader2, CheckCircle } from 'lucide-react';

// Inner component that uses useSearchParams
function ResetPasswordForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('token');

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    // Validate token on mount
    useEffect(() => {
        if (!token) {
            setError('Invalid or missing reset token. Please request a new password reset link.');
        }
    }, [token]);

    const validatePassword = (pwd: string) => {
        const hasUpperCase = /[A-Z]/.test(pwd);
        const hasLowerCase = /[a-z]/.test(pwd);
        const hasNumbers = /\d/.test(pwd);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(pwd);

        if (pwd.length < 8) return 'Password must be at least 8 characters';
        if (!hasUpperCase) return 'Password must contain at least one uppercase letter';
        if (!hasLowerCase) return 'Password must contain at least one lowercase letter';
        if (!hasNumbers) return 'Password must contain at least one number';
        if (!hasSpecialChar) return 'Password must contain at least one special character';
        return null;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!token) {
            setError('Invalid reset token');
            return;
        }

        const passwordError = validatePassword(password);
        if (passwordError) {
            setError(passwordError);
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/reset-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token, newPassword: password }),
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess(true);
                // Redirect to login after 3 seconds
                setTimeout(() => {
                    router.push('/login');
                }, 3000);
            } else {
                setError(data.message || 'Failed to reset password. The link may have expired.');
            }
        } catch (err) {
            setError('Network error. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    if (!token && error) {
        return (
            <Card className="w-full max-w-md bg-white dark:bg-[#1F2F55] text-primary rounded-md">
                <CardHeader>
                    <CardTitle>Invalid Reset Link</CardTitle>
                    <CardDescription>
                        The password reset link is invalid or missing
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md bg-red-500/10 p-4 text-center text-sm text-red-600">
                        {error}
                    </div>
                    <Button className="mt-4 w-full" asChild>
                        <Link href="/forgot-password">Request New Reset Link</Link>
                    </Button>
                </CardContent>
            </Card>
        );
    }

    if (success) {
        return (
            <Card className="w-full max-w-md bg-white dark:bg-[#1F2F55] text-primary rounded-md">
                <CardHeader>
                    <div className="flex justify-center mb-4">
                        <CheckCircle className="h-16 w-16 text-green-500" />
                    </div>
                    <CardTitle className="text-center">Password Reset Successful!</CardTitle>
                    <CardDescription className="text-center">
                        Your password has been updated successfully
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="rounded-md bg-green-500/10 p-4 text-center text-sm text-green-600">
                        You will be redirected to the login page in a few seconds...
                    </div>
                    <Button className="w-full" asChild>
                        <Link href="/login">Go to Login Now</Link>
                    </Button>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="w-full max-w-md bg-white dark:bg-[#1F2F55] text-primary rounded-md">
            <CardHeader>
                <CardTitle>Reset Your Password</CardTitle>
                <CardDescription>
                    Enter your new password below
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* New Password Field */}
                    <div className="space-y-2">
                        <Label htmlFor="password">New Password</Label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Enter new password"
                                className="pl-9 pr-9"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                disabled={isLoading}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            >
                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Must be 8+ characters with uppercase, lowercase, number, and special character
                        </p>
                    </div>

                    {/* Confirm Password Field */}
                    <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm New Password</Label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                id="confirmPassword"
                                type={showConfirmPassword ? 'text' : 'password'}
                                placeholder="Confirm new password"
                                className="pl-9 pr-9"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                disabled={isLoading}
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            >
                                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="rounded-md bg-red-500/10 p-3 text-sm text-red-600">
                            {error}
                        </div>
                    )}

                    {/* Password Strength Indicator */}
                    {password && !error && (
                        <div className="space-y-1">
                            <div className="h-1 w-full overflow-hidden rounded-full bg-gray-200">
                                <div
                                    className="h-full transition-all duration-300"
                                    style={{
                                        width: `${Math.min((password.length / 8) * 100, 100)}%`,
                                        backgroundColor:
                                            password.length < 8 ? '#ef4444' :
                                                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(password) ? '#22c55e' :
                                                    '#eab308'
                                    }}
                                />
                            </div>
                            <p className="text-xs text-muted-foreground">
                                {password.length < 8 ? 'Weak - Add more characters' :
                                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(password) ? 'Strong password!' :
                                        'Medium - Add numbers or special characters'}
                            </p>
                        </div>
                    )}

                    {/* Submit Button */}
                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Resetting Password...
                            </>
                        ) : (
                            'Reset Password'
                        )}
                    </Button>

                    {/* Back to Login Link */}
                    <div className="text-center text-sm">
                        <Link href="/login" className="text-secondary hover:underline">
                            Back to Login
                        </Link>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}

// Main component with Suspense boundary
export default function ResetPasswordPage() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-blue-50 dark:bg-[#0F172B] p-4">
            <Suspense fallback={
                <Card className="w-full max-w-md bg-white dark:bg-[#1F2F55] text-primary rounded-md">
                    <CardContent className="flex justify-center py-8">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </CardContent>
                </Card>
            }>
                <ResetPasswordForm />
            </Suspense>
        </div>
    );
}