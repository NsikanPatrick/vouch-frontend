'use client';

import Link from "next/link"; // ✅ Import Link
import { ProtectedRoute } from "@/components/page/protected-route";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";

function DashboardContent() {
    const { user, signOut } = useAuth();
    const router = useRouter();

    const handleLogout = async () => {
        await signOut();
        router.push("/login");
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="border-b">
                <div className="container mx-auto flex h-16 items-center justify-between px-4">
                    <h1 className="text-xl font-bold">Vouch Dashboard</h1>
                    <Button variant="outline" onClick={handleLogout}>
                        Logout
                    </Button>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto p-4">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {/* User Profile Card */}
                    <Card>
                        <CardHeader className="flex flex-row items-center gap-4">
                            <Avatar className="h-16 w-16">
                                <AvatarImage
                                    src={user?.profilePicture || undefined}
                                    alt={user?.name}
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).style.display = 'none';
                                    }}
                                />
                                <AvatarFallback className="text-lg">
                                    {user?.name?.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) || "U"}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <CardTitle>Profile</CardTitle>
                                <CardDescription>Your account information</CardDescription>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Name</p>
                                <p className="text-lg">{user?.name}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Email</p>
                                <p className="text-lg">{user?.email}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Role</p>
                                <p className="text-lg capitalize">{user?.role}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Account Status</p>
                                <p className="text-lg capitalize">{user?.status}</p>
                            </div>
                            {/* ✅ Use Link instead of anchor tag */}
                            <Button variant="outline" className="w-full mt-4" asChild>
                                <Link href="/profile">Edit Profile</Link>
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Account Status Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Account Status</CardTitle>
                            <CardDescription>Your account verification status</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {user?.status === 'active' ? (
                                <div className="rounded-md bg-green-500/10 p-3 text-center text-green-600">
                                    ✅ Account is verified and active
                                </div>
                            ) : user?.status === 'pending_verification' ? (
                                <div className="rounded-md bg-yellow-500/10 p-3 text-center text-yellow-600">
                                    ⏳ Please verify your email address
                                </div>
                            ) : (
                                <div className="rounded-md bg-red-500/10 p-3 text-center text-red-600">
                                    ❌ Account is {user?.status}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Quick Actions Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Quick Actions</CardTitle>
                            <CardDescription>Common tasks</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <Button variant="outline" className="w-full" asChild>
                                <Link href="/profile">Edit Profile</Link>
                            </Button>
                            <Button variant="outline" className="w-full" asChild>
                                <Link href="/change-password">Change Password</Link>
                            </Button>
                            {user?.role === 'admin' && (
                                <Button variant="outline" className="w-full" asChild>
                                    <Link href="/admin">Admin Panel</Link>
                                </Button>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
}

export default function DashboardPage() {
    return (
        <ProtectedRoute>
            <DashboardContent />
        </ProtectedRoute>
    );
}