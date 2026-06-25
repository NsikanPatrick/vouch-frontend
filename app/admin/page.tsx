'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/page/protected-route';
import { EmailLogsTable } from './email-logs-table';
import { EmailStatsDashboard } from './email-stats-dashboard';
import { useAuth } from '@/contexts/auth-context';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    Users,
    Shield,
    ShieldAlert,
    UserPlus,
    Loader2,
    Trash2,
    Ban,
    CheckCircle,
    RefreshCw,
    Eye,
    UserCheck,
    UserX,
    AlertTriangle,
    Pencil,
    ShieldCheck,
    UserCog,
    ArrowUpDown,
    BarChart3,
    Mail
} from 'lucide-react';
import { apiClient } from '@/lib/api-client';

// Status options for dropdown
const STATUS_OPTIONS = [
    { value: 'active', label: 'Active', icon: CheckCircle, color: 'text-green-500' },
    { value: 'inactive', label: 'Inactive', icon: UserX, color: 'text-yellow-500' },
    { value: 'suspended', label: 'Suspended', icon: Ban, color: 'text-red-500' },
    { value: 'pending_verification', label: 'Pending Verification', icon: AlertTriangle, color: 'text-orange-500' },
];

// Role options for dropdown
const ROLE_OPTIONS = [
    { value: 'user', label: 'User', icon: UserCheck, color: 'text-blue-500' },
    { value: 'admin', label: 'Admin', icon: ShieldCheck, color: 'text-purple-500' },
];

function AdminContent() {
    const { user } = useAuth();
    const router = useRouter();

    // Tab state
    const [activeTab, setActiveTab] = useState('users');

    // User management state
    const [users, setUsers] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCreatingAdmin, setIsCreatingAdmin] = useState(false);
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [showStatusDialog, setShowStatusDialog] = useState(false);
    const [showRoleDialog, setShowRoleDialog] = useState(false);
    const [showUserDetailsDialog, setShowUserDetailsDialog] = useState(false);
    const [newStatus, setNewStatus] = useState('');
    const [newRole, setNewRole] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);
    const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
    const [isUpdatingRole, setIsUpdatingRole] = useState(false);

    // Create admin form state
    const [adminEmail, setAdminEmail] = useState('');
    const [adminName, setAdminName] = useState('');
    const [adminPassword, setAdminPassword] = useState('');
    const [adminConfirmPassword, setAdminConfirmPassword] = useState('');
    const [adminError, setAdminError] = useState('');
    const [adminSuccess, setAdminSuccess] = useState('');

    // Email state variables
    const [emailStats, setEmailStats] = useState<any>(null);
    const [emailLogs, setEmailLogs] = useState<any[]>([]);
    const [isLoadingEmails, setIsLoadingEmails] = useState(false);
    const [emailLogsPage, setEmailLogsPage] = useState(1);
    const [emailLogsTotal, setEmailLogsTotal] = useState(0);
    const [emailLogsTotalPages, setEmailLogsTotalPages] = useState(1);
    const [selectedDateRange, setSelectedDateRange] = useState<'week' | 'month' | 'all'>('week');

    // Check if current user is admin
    useEffect(() => {
        if (user && user.role !== 'admin') {
            router.push('/dashboard');
        }
    }, [user, router]);

    // Fetch initial data
    useEffect(() => {
        fetchUsers();
        fetchEmailStats();
        fetchEmailLogs();
    }, []);

    // Refresh function that checks the active tab
    const handleRefresh = async () => {
        switch (activeTab) {
            case 'users':
                await fetchUsers();
                break;
            case 'email-stats':
                await fetchEmailStats();
                break;
            case 'email-logs':
                await fetchEmailLogs(emailLogsPage);
                break;
            default:
                // If unknown tab, refresh all
                await Promise.all([fetchUsers(), fetchEmailStats(), fetchEmailLogs(emailLogsPage)]);
                break;
        }
    };

    // Email logs and stats related functions
    const fetchEmailStats = async () => {
        setIsLoadingEmails(true);
        try {
            let url = '/admin/emails/stats';

            // Add date range if needed
            if (selectedDateRange !== 'all') {
                const endDate = new Date();
                const startDate = new Date();
                if (selectedDateRange === 'week') {
                    startDate.setDate(startDate.getDate() - 7);
                } else if (selectedDateRange === 'month') {
                    startDate.setMonth(startDate.getMonth() - 1);
                }
                url += `?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`;
            }

            const response = await apiClient.getEmailStats(url);
            setEmailStats(response);
        } catch (error) {
            console.error('Failed to fetch email stats:', error);
        } finally {
            setIsLoadingEmails(false);
        }
    };

    const fetchEmailLogs = async (page: number = 1) => {
        setIsLoadingEmails(true);
        try {
            const response = await apiClient.getEmailLogs(page, 20);
            setEmailLogs(response.logs);
            setEmailLogsTotal(response.pagination.total);
            setEmailLogsTotalPages(response.pagination.totalPages);
        } catch (error) {
            console.error('Failed to fetch email logs:', error);
        } finally {
            setIsLoadingEmails(false);
        }
    };
    // End of email logs and stats related functions

    // Fetch all users
    const fetchUsers = async () => {
        setIsLoading(true);
        try {
            const response = await apiClient.getAllUsers(1, 100);
            setUsers(response.users);
        } catch (error) {
            console.error('Failed to fetch users:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Get user initials for avatar
    const getInitials = (name: string) => {
        if (!name) return 'U';
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    // Get role badge color
    const getRoleBadge = (role: string) => {
        if (role === 'admin') {
            return <Badge className="bg-purple-500">Admin</Badge>;
        }
        return <Badge variant="secondary">User</Badge>;
    };

    // Get status badge color
    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'active':
                return <Badge className="bg-green-500">Active</Badge>;
            case 'inactive':
                return <Badge variant="destructive">Inactive</Badge>;
            case 'suspended':
                return <Badge className="bg-orange-500">Suspended</Badge>;
            case 'pending_verification':
                return <Badge className="bg-yellow-500">Pending</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    // Get status icon
    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'active':
                return <UserCheck className="h-4 w-4 text-green-500" />;
            case 'inactive':
                return <UserX className="h-4 w-4 text-yellow-500" />;
            case 'suspended':
                return <Ban className="h-4 w-4 text-red-500" />;
            case 'pending_verification':
                return <AlertTriangle className="h-4 w-4 text-orange-500" />;
            default:
                return null;
        }
    };

    // Handle create admin
    const handleCreateAdmin = async (e: React.FormEvent) => {
        e.preventDefault();
        setAdminError('');
        setAdminSuccess('');

        if (adminPassword !== adminConfirmPassword) {
            setAdminError("Passwords don't match");
            return;
        }

        if (adminPassword.length < 8) {
            setAdminError('Password must be at least 8 characters');
            return;
        }

        setIsCreatingAdmin(true);

        try {
            await apiClient.createAdmin({
                email: adminEmail,
                name: adminName,
                password: adminPassword,
            });

            setAdminSuccess('Admin account created successfully!');
            setAdminEmail('');
            setAdminName('');
            setAdminPassword('');
            setAdminConfirmPassword('');

            setTimeout(() => {
                fetchUsers();
                setAdminSuccess('');
            }, 2000);
        } catch (error: any) {
            setAdminError(error.message || 'Failed to create admin');
        } finally {
            setIsCreatingAdmin(false);
        }
    };

    // Handle update user status
    const handleUpdateStatus = async () => {
        if (!selectedUser) return;

        setIsUpdatingStatus(true);
        try {
            await apiClient.updateUserStatus(selectedUser.id, newStatus);
            setShowStatusDialog(false);
            fetchUsers();
        } catch (error) {
            console.error('Failed to update status:', error);
        } finally {
            setIsUpdatingStatus(false);
        }
    };

    // Handle update user role
    const handleUpdateRole = async () => {
        if (!selectedUser) return;

        setIsUpdatingRole(true);
        try {
            await apiClient.updateUserRole(selectedUser.id, newRole);
            setShowRoleDialog(false);
            fetchUsers();
        } catch (error) {
            console.error('Failed to update role:', error);
        } finally {
            setIsUpdatingRole(false);
        }
    };

    // Handle delete user (including admins)
    const handleDeleteUser = async () => {
        if (!selectedUser) return;

        setIsDeleting(true);
        try {
            await apiClient.deleteUser(selectedUser.id);
            setShowDeleteDialog(false);
            fetchUsers();

            // If the deleted user is the current admin, logout
            if (selectedUser.id === user?.id) {
                localStorage.clear();
                window.location.href = '/login';
            }
        } catch (error) {
            console.error('Failed to delete user:', error);
        } finally {
            setIsDeleting(false);
        }
    };

    // Open user details dialog
    const handleViewUserDetails = (userItem: any) => {
        setSelectedUser(userItem);
        setShowUserDetailsDialog(true);
    };

    // Open status dialog
    const handleOpenStatusDialog = (userItem: any) => {
        setSelectedUser(userItem);
        setNewStatus(userItem.status);
        setShowStatusDialog(true);
    };

    // Open role dialog
    const handleOpenRoleDialog = (userItem: any) => {
        setSelectedUser(userItem);
        setNewRole(userItem.role);
        setShowRoleDialog(true);
    };

    // Open delete dialog
    const handleOpenDeleteDialog = (userItem: any) => {
        setSelectedUser(userItem);
        setShowDeleteDialog(true);
    };

    if (user?.role !== 'admin') {
        return null;
    }

    return (
        <div className="min-h-screen justify-center bg-white dark:bg-[#0F172B]">
            {/* Header with Refresh Button */}
            <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container mx-auto flex h-16 items-center justify-between text-primary px-4">
                    <div className="flex items-center gap-4">
                        <a href="/dashboard" className="text-xl font-bold hover:text-primary transition-colors">
                            ← Back to Dashboard
                        </a>
                        <div className="flex items-center gap-2">
                            <ShieldAlert className="h-5 w-5 text-purple-500" />
                            <span className="text-sm font-medium text-purple-500">Admin Panel</span>
                        </div>
                    </div>
                    {/* Refresh button now calls handleRefresh which checks the active tab */}
                    <Button variant="outline" size="sm" onClick={handleRefresh}>
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Refresh
                    </Button>
                </div>
            </header>

            <main className="container mx-auto p-4">
                <Tabs defaultValue="users" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                    <TabsList className='bg-white dark:bg-[#1F2F55] text-primary rounded-md'>
                        <TabsTrigger value="users" className="flex items-center text-primary gap-2 border border-gray-300 hover:cursor-pointer">
                            <Users className="h-4 w-4 text-primary" />
                            All Users
                        </TabsTrigger>
                        <TabsTrigger value="create-admin" className="flex items-center text-primary gap-2 border border-gray-300 hover:cursor-pointer">
                            <Shield className="h-4 w-4 text-primary" />
                            Create Admin
                        </TabsTrigger>
                        <TabsTrigger value="email-stats" className="flex items-center text-primary gap-2 border border-gray-300 hover:cursor-pointer">
                            <BarChart3 className="h-4 w-4 text-primary" />
                            Email Stats
                        </TabsTrigger>
                        <TabsTrigger value="email-logs" className="flex items-center text-primary gap-2 border border-gray-300 hover:cursor-pointer">
                            <Mail className="h-4 w-4 text-primary" />
                            Email Logs
                        </TabsTrigger>
                    </TabsList>

                    {/* Users List Tab */}
                    <TabsContent value="users">
                        <Card className='bg-white dark:bg-[#1F2F55] text-primary rounded-md'>
                            <CardHeader>
                                <CardTitle>User Management</CardTitle>
                                <CardDescription>
                                    Manage all registered users. Click on any user to view details, update status, change roles, or delete accounts.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {isLoading ? (
                                    <div className="flex justify-center py-8">
                                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                    </div>
                                ) : users.length === 0 ? (
                                    <div className="text-center py-8 text-muted-foreground">
                                        No users found
                                    </div>
                                ) : (
                                    <div className="rounded-md border">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>User</TableHead>
                                                    <TableHead>Email</TableHead>
                                                    <TableHead>Role</TableHead>
                                                    <TableHead>Status</TableHead>
                                                    <TableHead>Joined</TableHead>
                                                    <TableHead className="text-right">Actions</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {users.map((userItem) => {
                                                    const isCurrentUser = userItem.id === user?.id;

                                                    return (
                                                        <TableRow
                                                            key={userItem.id}
                                                            className="cursor-pointer hover:bg-muted/50"
                                                            onClick={() => handleViewUserDetails(userItem)}
                                                        >
                                                            <TableCell className="font-medium">
                                                                <div className="flex items-center gap-3">
                                                                    <Avatar className="h-8 w-8">
                                                                        <AvatarImage src={userItem.profilePicture || undefined} />
                                                                        <AvatarFallback>
                                                                            {getInitials(userItem.name)}
                                                                        </AvatarFallback>
                                                                    </Avatar>
                                                                    <span>
                                                                        {userItem.name}
                                                                        {isCurrentUser && (
                                                                            <span className="ml-2 text-xs text-muted-foreground">(You)</span>
                                                                        )}
                                                                    </span>
                                                                </div>
                                                            </TableCell>
                                                            <TableCell>{userItem.email}</TableCell>
                                                            <TableCell>
                                                                <div className="flex items-center gap-2">
                                                                    {userItem.role === 'admin' ? (
                                                                        <ShieldCheck className="h-4 w-4 text-purple-500" />
                                                                    ) : (
                                                                        <UserCheck className="h-4 w-4 text-blue-500" />
                                                                    )}
                                                                    {getRoleBadge(userItem.role)}
                                                                </div>
                                                            </TableCell>
                                                            <TableCell>
                                                                <div className="flex items-center gap-2">
                                                                    {getStatusIcon(userItem.status)}
                                                                    {getStatusBadge(userItem.status)}
                                                                </div>
                                                            </TableCell>
                                                            <TableCell>
                                                                {new Date(userItem.createdAt).toLocaleDateString()}
                                                            </TableCell>
                                                            <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                                                                <div className="flex justify-end gap-2">
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        onClick={() => handleViewUserDetails(userItem)}
                                                                    >
                                                                        <Eye className="h-4 w-4" />
                                                                    </Button>
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        onClick={() => handleOpenRoleDialog(userItem)}
                                                                        disabled={isCurrentUser}
                                                                        title={isCurrentUser ? "Cannot change your own role" : "Change user role"}
                                                                    >
                                                                        <ArrowUpDown className="h-4 w-4" />
                                                                    </Button>
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        onClick={() => handleOpenStatusDialog(userItem)}
                                                                        disabled={isCurrentUser}
                                                                        title={isCurrentUser ? "Cannot change your own status" : "Change user status"}
                                                                    >
                                                                        <Pencil className="h-4 w-4" />
                                                                    </Button>
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        onClick={() => handleOpenDeleteDialog(userItem)}
                                                                        disabled={isCurrentUser}
                                                                        className={!isCurrentUser ? "text-destructive hover:text-destructive" : ""}
                                                                        title={isCurrentUser ? "Cannot delete your own account" : "Delete user account"}
                                                                    >
                                                                        <Trash2 className="h-4 w-4" />
                                                                    </Button>
                                                                </div>
                                                            </TableCell>
                                                        </TableRow>
                                                    );
                                                })}
                                            </TableBody>
                                        </Table>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Create Admin Tab */}
                    <TabsContent value="create-admin">
                        <Card className='bg-white dark:bg-[#1F2F55] text-primary rounded-md'>
                            <CardHeader>
                                <CardTitle>Create Admin Account</CardTitle>
                                <CardDescription>
                                    Create a new administrator account. Only existing admins can perform this action.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleCreateAdmin} className="space-y-4 max-w-md">
                                    <div className="space-y-2">
                                        <Label htmlFor="adminName">Full Name</Label>
                                        <Input
                                            id="adminName"
                                            placeholder="John Doe"
                                            value={adminName}
                                            onChange={(e) => setAdminName(e.target.value)}
                                            required
                                            disabled={isCreatingAdmin}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="adminEmail">Email</Label>
                                        <Input
                                            id="adminEmail"
                                            type="email"
                                            placeholder="admin@example.com"
                                            value={adminEmail}
                                            onChange={(e) => setAdminEmail(e.target.value)}
                                            required
                                            disabled={isCreatingAdmin}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="adminPassword">Password</Label>
                                        <Input
                                            id="adminPassword"
                                            type="password"
                                            placeholder="••••••••"
                                            value={adminPassword}
                                            onChange={(e) => setAdminPassword(e.target.value)}
                                            required
                                            disabled={isCreatingAdmin}
                                        />
                                        <p className="text-xs text-muted-foreground">
                                            Must be at least 8 characters
                                        </p>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="adminConfirmPassword">Confirm Password</Label>
                                        <Input
                                            id="adminConfirmPassword"
                                            type="password"
                                            placeholder="••••••••"
                                            value={adminConfirmPassword}
                                            onChange={(e) => setAdminConfirmPassword(e.target.value)}
                                            required
                                            disabled={isCreatingAdmin}
                                        />
                                    </div>

                                    {adminError && (
                                        <div className="rounded-md bg-red-500/10 p-3 text-sm text-red-600">
                                            {adminError}
                                        </div>
                                    )}

                                    {adminSuccess && (
                                        <div className="rounded-md bg-green-500/10 p-3 text-sm text-green-600">
                                            {adminSuccess}
                                        </div>
                                    )}

                                    <Button type="submit" disabled={isCreatingAdmin}>
                                        {isCreatingAdmin ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Creating Admin...
                                            </>
                                        ) : (
                                            <>
                                                <UserPlus className="mr-2 h-4 w-4" />
                                                Create Admin Account
                                            </>
                                        )}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Email Logs Tab */}
                    <TabsContent value="email-logs">
                        <Card className='bg-white dark:bg-[#1F2F55] text-primary rounded-md'>
                            <CardHeader>
                                <CardTitle>Email Transaction Logs</CardTitle>
                                <CardDescription>
                                    View all email communications sent by the system
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <EmailLogsTable
                                    logs={emailLogs}
                                    isLoading={isLoadingEmails}
                                    page={emailLogsPage}
                                    totalPages={emailLogsTotalPages}
                                    onPageChange={async (page) => {
                                        setEmailLogsPage(page);
                                        await fetchEmailLogs(page);
                                    }}
                                />
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Email Stats Tab */}
                    <TabsContent value="email-stats">
                        <Card className='bg-white dark:bg-[#1F2F55] text-primary rounded-md'>
                            <CardHeader>
                                <CardTitle>Email Analytics</CardTitle>
                                <CardDescription>
                                    Monitor email delivery and engagement metrics
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <EmailStatsDashboard
                                    stats={emailStats}
                                    isLoading={isLoadingEmails}
                                    selectedDateRange={selectedDateRange}
                                    onDateRangeChange={async (range) => {
                                        setSelectedDateRange(range);
                                        await fetchEmailStats();
                                    }}
                                />
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </main>

            {/* User Details Dialog */}
            <Dialog open={showUserDetailsDialog} onOpenChange={setShowUserDetailsDialog}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>User Details</DialogTitle>
                        <DialogDescription>
                            Detailed information about {selectedUser?.name}
                        </DialogDescription>
                    </DialogHeader>
                    {selectedUser && (
                        <div className="space-y-4">
                            <div className="flex justify-center">
                                <Avatar className="h-24 w-24">
                                    <AvatarImage src={selectedUser.profilePicture || undefined} />
                                    <AvatarFallback className="text-2xl">
                                        {getInitials(selectedUser.name)}
                                    </AvatarFallback>
                                </Avatar>
                            </div>
                            <div className="grid gap-3">
                                <div>
                                    <Label className="text-muted-foreground">Full Name</Label>
                                    <p className="text-lg font-medium">{selectedUser.name}</p>
                                </div>
                                <div>
                                    <Label className="text-muted-foreground">Email Address</Label>
                                    <p className="text-lg font-medium">{selectedUser.email}</p>
                                </div>
                                <div>
                                    <Label className="text-muted-foreground">Role</Label>
                                    <div className="mt-1">{getRoleBadge(selectedUser.role)}</div>
                                </div>
                                <div>
                                    <Label className="text-muted-foreground">Account Status</Label>
                                    <div className="mt-1 flex items-center gap-2">
                                        {getStatusIcon(selectedUser.status)}
                                        {getStatusBadge(selectedUser.status)}
                                    </div>
                                </div>
                                <div>
                                    <Label className="text-muted-foreground">Member Since</Label>
                                    <p className="font-medium">
                                        {new Date(selectedUser.createdAt).toLocaleDateString()} at{' '}
                                        {new Date(selectedUser.createdAt).toLocaleTimeString()}
                                    </p>
                                </div>
                                {selectedUser.lastLoginAt && (
                                    <div>
                                        <Label className="text-muted-foreground">Last Login</Label>
                                        <p className="font-medium">
                                            {new Date(selectedUser.lastLoginAt).toLocaleDateString()} at{' '}
                                            {new Date(selectedUser.lastLoginAt).toLocaleTimeString()}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <div className="flex w-full gap-2">
                            {selectedUser?.id !== user?.id && (
                                <>
                                    <Button
                                        variant="outline"
                                        onClick={() => {
                                            setShowUserDetailsDialog(false);
                                            handleOpenRoleDialog(selectedUser);
                                        }}
                                        className="flex-1"
                                    >
                                        <ArrowUpDown className="mr-2 h-4 w-4" />
                                        Change Role
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={() => {
                                            setShowUserDetailsDialog(false);
                                            handleOpenStatusDialog(selectedUser);
                                        }}
                                        className="flex-1"
                                    >
                                        <Pencil className="mr-2 h-4 w-4" />
                                        Change Status
                                    </Button>
                                </>
                            )}
                        </div>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Update Status Dialog */}
            <Dialog open={showStatusDialog} onOpenChange={setShowStatusDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Update User Status</DialogTitle>
                        <DialogDescription>
                            Change the account status for {selectedUser?.name}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                            <Label>Current Status</Label>
                            <div className="flex items-center gap-2">
                                {getStatusIcon(selectedUser?.status)}
                                {getStatusBadge(selectedUser?.status)}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>New Status</Label>
                            <select
                                className="w-full rounded-md border border-input bg-background px-3 py-2"
                                value={newStatus}
                                onChange={(e) => setNewStatus(e.target.value)}
                            >
                                {STATUS_OPTIONS.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowStatusDialog(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleUpdateStatus} disabled={isUpdatingStatus}>
                            {isUpdatingStatus ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Updating...
                                </>
                            ) : (
                                <>
                                    <CheckCircle className="mr-2 h-4 w-4" />
                                    Update Status
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Update Role Dialog */}
            <Dialog open={showRoleDialog} onOpenChange={setShowRoleDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Update User Role</DialogTitle>
                        <DialogDescription>
                            Change the account role for {selectedUser?.name}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                            <Label>Current Role</Label>
                            <div className="flex items-center gap-2">
                                {selectedUser?.role === 'admin' ? (
                                    <ShieldCheck className="h-4 w-4 text-purple-500" />
                                ) : (
                                    <UserCheck className="h-4 w-4 text-blue-500" />
                                )}
                                {getRoleBadge(selectedUser?.role)}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>New Role</Label>
                            <select
                                className="w-full rounded-md border border-input bg-background px-3 py-2"
                                value={newRole}
                                onChange={(e) => setNewRole(e.target.value)}
                            >
                                {ROLE_OPTIONS.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                            <p className="text-xs text-muted-foreground mt-2">
                                {newRole === 'admin'
                                    ? "⚠️ Granting admin privileges gives this user full system access."
                                    : "Revoking admin privileges will restrict this user to standard access."}
                            </p>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowRoleDialog(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleUpdateRole} disabled={isUpdatingRole}>
                            {isUpdatingRole ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Updating...
                                </>
                            ) : (
                                <>
                                    <ShieldCheck className="mr-2 h-4 w-4" />
                                    Update Role
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete User Dialog */}
            <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete User Account</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete {selectedUser?.name}'s account?
                            {selectedUser?.role === 'admin' && (
                                <span className="block mt-2 text-red-600 font-medium">
                                    ⚠️ Warning: This is an admin account. Deleting it cannot be undone.
                                </span>
                            )}
                            This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDeleteUser}
                            disabled={isDeleting}
                        >
                            {isDeleting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Deleting...
                                </>
                            ) : (
                                <>
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete Account
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default function AdminPage() {
    return (
        <ProtectedRoute>
            <AdminContent />
        </ProtectedRoute>
    );
}