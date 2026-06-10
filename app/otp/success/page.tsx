'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

export default function OtpSuccessPage() {
    const router = useRouter();

    useEffect(() => {
        // Redirect to dashboard after 2 seconds
        const timer = setTimeout(() => {
            router.push('/dashboard');
        }, 2000);
        return () => clearTimeout(timer);
    }, [router]);

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
                <CardContent>
                    <Button className="w-full" asChild>
                        <a href="/dashboard">Go to Dashboard Now</a>
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}