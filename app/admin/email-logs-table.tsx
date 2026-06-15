'use client';

import { useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    ChevronLeft,
    ChevronRight,
    Mail,
    MailOpen,
    MailCheck,
    MailX,
    MailWarning,
    Eye,
    MousePointerClick,
    Clock,
    AlertCircle
} from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';

interface EmailLog {
    id: string;
    email: string;
    name: string;
    type: string;
    status: string;
    subject: string;
    sentAt: string;
    deliveredAt: string | null;
    openedAt: string | null;
    clickedAt: string | null;
    createdAt: string;
    messageId: string;
    errorMessage: string | null;
}

interface EmailLogsTableProps {
    logs: EmailLog[];
    isLoading: boolean;
    page: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

const getStatusIcon = (status: string) => {
    switch (status) {
        case 'sent':
            return <Mail className="h-4 w-4 text-blue-500" />;
        case 'delivered':
            return <MailCheck className="h-4 w-4 text-green-500" />;
        case 'opened':
            return <MailOpen className="h-4 w-4 text-purple-500" />;
        case 'clicked':
            return <MousePointerClick className="h-4 w-4 text-indigo-500" />;
        case 'failed':
            return <MailX className="h-4 w-4 text-red-500" />;
        case 'bounced':
            return <MailWarning className="h-4 w-4 text-orange-500" />;
        default:
            return <Clock className="h-4 w-4 text-gray-500" />;
    }
};

const getStatusBadge = (status: string) => {
    switch (status) {
        case 'sent':
            return <Badge className="bg-blue-500">Sent</Badge>;
        case 'delivered':
            return <Badge className="bg-green-500">Delivered</Badge>;
        case 'opened':
            return <Badge className="bg-purple-500">Opened</Badge>;
        case 'clicked':
            return <Badge className="bg-indigo-500">Clicked</Badge>;
        case 'failed':
            return <Badge variant="destructive">Failed</Badge>;
        case 'bounced':
            return <Badge className="bg-orange-500">Bounced</Badge>;
        default:
            return <Badge variant="outline">Pending</Badge>;
    }
};

const getTypeBadge = (type: string) => {
    switch (type) {
        case 'welcome':
            return <Badge variant="outline" className="border-green-500 text-green-500">Welcome</Badge>;
        case 'password_reset':
            return <Badge variant="outline" className="border-orange-500 text-orange-500">Password Reset</Badge>;
        case 'password_changed':
            return <Badge variant="outline" className="border-blue-500 text-blue-500">Password Changed</Badge>;
        case 'account_locked':
            return <Badge variant="outline" className="border-red-500 text-red-500">Account Locked</Badge>;
        case 'magic_link':
            return <Badge variant="outline" className="border-purple-500 text-purple-500">Magic Link</Badge>;
        case 'otp':
            return <Badge variant="outline" className="border-yellow-500 text-yellow-500">OTP</Badge>;
        default:
            return <Badge variant="outline">{type}</Badge>;
    }
};

function EmailLogDetails({ log, onClose }: { log: EmailLog | null; onClose: () => void }) {
    if (!log) return null;

    return (
        <Dialog open={!!log} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Email Details</DialogTitle>
                    <DialogDescription>
                        Detailed information about this email
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-medium text-muted-foreground">To</label>
                            <p className="text-sm">{log.email}</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-muted-foreground">Recipient Name</label>
                            <p className="text-sm">{log.name}</p>
                        </div>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-muted-foreground">Subject</label>
                        <p className="text-sm font-medium">{log.subject}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-medium text-muted-foreground">Type</label>
                            <div className="mt-1">{getTypeBadge(log.type)}</div>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-muted-foreground">Status</label>
                            <div className="mt-1 flex items-center gap-2">
                                {getStatusIcon(log.status)}
                                {getStatusBadge(log.status)}
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-medium text-muted-foreground">Sent At</label>
                            <p className="text-sm">{log.sentAt ? new Date(log.sentAt).toLocaleString() : 'Not sent'}</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-muted-foreground">Delivered At</label>
                            <p className="text-sm">{log.deliveredAt ? new Date(log.deliveredAt).toLocaleString() : 'Not delivered'}</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-medium text-muted-foreground">Opened At</label>
                            <p className="text-sm">{log.openedAt ? new Date(log.openedAt).toLocaleString() : 'Not opened'}</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-muted-foreground">Clicked At</label>
                            <p className="text-sm">{log.clickedAt ? new Date(log.clickedAt).toLocaleString() : 'Not clicked'}</p>
                        </div>
                    </div>
                    {log.errorMessage && (
                        <div>
                            <label className="text-sm font-medium text-red-500">Error Message</label>
                            <p className="text-sm text-red-600 bg-red-50 p-2 rounded-md mt-1">{log.errorMessage}</p>
                        </div>
                    )}
                    <div>
                        <label className="text-sm font-medium text-muted-foreground">Message ID</label>
                        <p className="text-xs text-muted-foreground break-all">{log.messageId}</p>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

export function EmailLogsTable({ logs, isLoading, page, totalPages, onPageChange }: EmailLogsTableProps) {
    const [selectedLog, setSelectedLog] = useState<EmailLog | null>(null);

    if (isLoading) {
        return (
            <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (logs.length === 0) {
        return (
            <div className="text-center py-8 text-muted-foreground">
                No email logs found
            </div>
        );
    }

    return (
        <>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Recipient</TableHead>
                            <TableHead>Subject</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Sent Date</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {logs.map((log) => (
                            <TableRow key={log.id}>
                                <TableCell>
                                    <div>
                                        <p className="font-medium">{log.name}</p>
                                        <p className="text-xs text-muted-foreground">{log.email}</p>
                                    </div>
                                </TableCell>
                                <TableCell className="max-w-md truncate">
                                    {log.subject}
                                </TableCell>
                                <TableCell>{getTypeBadge(log.type)}</TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        {getStatusIcon(log.status)}
                                        {getStatusBadge(log.status)}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    {log.sentAt ? new Date(log.sentAt).toLocaleString() : '-'}
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setSelectedLog(log)}
                                    >
                                        <Eye className="h-4 w-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                    <p className="text-sm text-muted-foreground">
                        Page {page} of {totalPages}
                    </p>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onPageChange(page - 1)}
                            disabled={page <= 1}
                        >
                            <ChevronLeft className="h-4 w-4" />
                            Previous
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onPageChange(page + 1)}
                            disabled={page >= totalPages}
                        >
                            Next
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            )}

            <EmailLogDetails log={selectedLog} onClose={() => setSelectedLog(null)} />
        </>
    );
}