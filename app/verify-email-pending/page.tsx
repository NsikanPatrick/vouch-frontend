'use client';

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

export default function VerifyEmailPendingPage() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-blue-50 dark:bg-[#0F172B] p-4">
            <Card className="w-full max-w-md bg-white dark:bg-[#1F2F55] text-primary rounded-md">
                <CardHeader>
                    <CardTitle>Check Your Email</CardTitle>
                    <CardDescription>
                        We've sent you a verification link
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="rounded-md bg-blue-500/10 p-4 text-center text-sm text-blue-600">
                        ✉️ Please check your email inbox and click the verification link to activate your account.
                    </div>
                    <div className="text-center text-sm text-muted-foreground">
                        Didn't receive the email? Check your spam folder or try again.
                    </div>
                    <Button asChild className="w-full" variant="outline">
                        <Link href="/login">
                            Go to Login
                        </Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}