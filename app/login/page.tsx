'use client';

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Mail, Lock, Eye, EyeOff, Loader2, Shield } from 'lucide-react';
import {FaGoogle} from 'react-icons/fa'
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/contexts/auth-context";

export default function LoginPage() {
    const router = useRouter();
    const { signIn, isLoading } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);

    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");

        if (!email.trim()) {
            setError("Email is required");
            return;
        }

        if (!password) {
            setError("Password is required");
            return;
        }

        // Clear any existing session data before new login
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        sessionStorage.removeItem('otpEmail');

        try {
            await signIn(email, password);
            router.push("/dashboard");
        } catch (err: any) {
            setError(err.message || "Invalid email or password");
        }
    };

    const handleGoogleLogin = () => {
        setIsGoogleLoading(true);
        // Redirect to backend Google OAuth endpoint
        window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`;
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-background p-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className={`text-primary`}>Login</CardTitle>
                    <CardDescription className={`text-primary`}>Welcome back! Please sign in to continue</CardDescription>
                </CardHeader>
                <CardContent className={`text-primary`}>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                disabled={isLoading}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                disabled={isLoading}
                            />
                        </div>
                        <div className="text-right text-sm">
                            <Link href="/forgot-password" className="text-primary hover:underline">
                                Forgot password?
                            </Link>
                        </div>
                        {error && (
                            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                                {error}
                            </div>
                        )}
                        <Button type="submit" className="w-full bg-primary hover:bg-blue-900" disabled={isLoading}>
                            {isLoading ? "Signing you in..." : "Sign In"}
                        </Button>

                        <div className="relative my-4">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-background px-2 text-muted-foreground">
                                    Or continue with
                                </span>
                            </div>
                        </div>

                        {/* Google Login Button */}
                        <Button
                            variant="outline"
                            className="w-full"
                            onClick={handleGoogleLogin}
                            disabled={isGoogleLoading}
                        >
                            {isGoogleLoading ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                    <FaGoogle className="mr-2 h-4 w-4" />
                            )}
                            {isGoogleLoading ? "Redirecting..." : "Continue with Google"}
                        </Button>

                        {/* Magic Code Login Button */}
                        <Button variant="outline" className="w-full" asChild>
                            <Link href="/otp/request">
                                <Shield className="mr-2 h-4 w-4" />
                                Sign in with Magic Code
                            </Link>
                        </Button>
                    </form>
                </CardContent>
                <div className="pb-6 text-center text-sm">
                    Don't have an account?{" "}
                    <Link href="/signup" className="text-primary hover:underline">
                        Sign up
                    </Link>
                </div>
            </Card>
        </div>
    );
}