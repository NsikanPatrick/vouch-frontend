'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
    Mail,
    MailCheck,
    MailOpen,
    MailX,
    MailWarning,
    MousePointerClick,
    Send,
    TrendingUp,
    Eye,
    BarChart3
} from 'lucide-react';

interface StatCard {
    type: string;
    total: number;
    sent: number;
    delivered: number;
    opened: number;
    clicked: number;
    failed: number;
    bounced: number;
}

interface EmailStatsDashboardProps {
    stats: { stats: StatCard[]; totalEmails?: number } | null;
    isLoading: boolean;
    selectedDateRange: 'week' | 'month' | 'all';
    onDateRangeChange: (range: 'week' | 'month' | 'all') => void;
}

const getTypeIcon = (type: string) => {
    switch (type) {
        case 'welcome':
            return <Mail className="h-5 w-5 text-green-500" />;
        case 'password_reset':
            return <MailWarning className="h-5 w-5 text-orange-500" />;
        case 'password_changed':
            return <MailCheck className="h-5 w-5 text-blue-500" />;
        case 'account_locked':
            return <MailX className="h-5 w-5 text-red-500" />;
        case 'magic_link':
            return <MousePointerClick className="h-5 w-5 text-purple-500" />;
        default:
            return <Mail className="h-5 w-5 text-gray-500" />;
    }
};

function StatSummaryCards({ stats }: { stats: EmailStatsDashboardProps['stats'] }) {
    if (!stats?.stats) return null;

    const totals = stats.stats.reduce(
        (acc, stat) => ({
            total: acc.total + (parseInt(stat.total as any) || 0),
            sent: acc.sent + (parseInt(stat.sent as any) || 0),
            delivered: acc.delivered + (parseInt(stat.delivered as any) || 0),
            opened: acc.opened + (parseInt(stat.opened as any) || 0),
            clicked: acc.clicked + (parseInt(stat.clicked as any) || 0),
            failed: acc.failed + (parseInt(stat.failed as any) || 0),
            bounced: acc.bounced + (parseInt(stat.bounced as any) || 0),
        }),
        { total: 0, sent: 0, delivered: 0, opened: 0, clicked: 0, failed: 0, bounced: 0 }
    );

    const deliveryRate = totals.sent > 0 ? ((totals.delivered / totals.sent) * 100).toFixed(1) : '0';
    const openRate = totals.delivered > 0 ? ((totals.opened / totals.delivered) * 100).toFixed(1) : '0';
    const clickRate = totals.opened > 0 ? ((totals.clicked / totals.opened) * 100).toFixed(1) : '0';

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Emails</CardTitle>
                    <Send className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{totals.total}</div>
                    <p className="text-xs text-muted-foreground">
                        {totals.sent} sent, {totals.failed} failed
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Delivery Rate</CardTitle>
                    <MailCheck className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{deliveryRate}%</div>
                    <p className="text-xs text-muted-foreground">
                        {totals.delivered} delivered of {totals.sent} sent
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Open Rate</CardTitle>
                    <Eye className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{openRate}%</div>
                    <p className="text-xs text-muted-foreground">
                        {totals.opened} opened of {totals.delivered} delivered
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Click Rate</CardTitle>
                    <MousePointerClick className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{clickRate}%</div>
                    <p className="text-xs text-muted-foreground">
                        {totals.clicked} clicked of {totals.opened} opened
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}

function EmailTypeStats({ stats }: { stats: EmailStatsDashboardProps['stats'] }) {
    if (!stats?.stats || stats.stats.length === 0) {
        return (
            <div className="text-center py-8 text-muted-foreground">
                No email data available for the selected period
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold">Breakdown by Email Type</h3>
            <div className="rounded-md border">
                <table className="w-full">
                    <thead>
                        <tr className="border-b bg-muted/50">
                            <th className="p-3 text-left font-medium">Type</th>
                            <th className="p-3 text-center font-medium">Sent</th>
                            <th className="p-3 text-center font-medium">Delivered</th>
                            <th className="p-3 text-center font-medium">Opened</th>
                            <th className="p-3 text-center font-medium">Clicked</th>
                            <th className="p-3 text-center font-medium">Failed</th>
                            <th className="p-3 text-center font-medium">Bounced</th>
                        </tr>
                    </thead>
                    <tbody>
                        {stats.stats.map((stat) => (
                            <tr key={stat.type} className="border-b">
                                <td className="p-3">
                                    <div className="flex items-center gap-2">
                                        {getTypeIcon(stat.type)}
                                        <span className="capitalize font-medium">
                                            {stat.type.replace('_', ' ')}
                                        </span>
                                    </div>
                                </td>
                                <td className="p-3 text-center">{stat.sent || 0}</td>
                                <td className="p-3 text-center">{stat.delivered || 0}</td>
                                <td className="p-3 text-center">{stat.opened || 0}</td>
                                <td className="p-3 text-center">{stat.clicked || 0}</td>
                                <td className="p-3 text-center text-red-600">{stat.failed || 0}</td>
                                <td className="p-3 text-center text-orange-600">{stat.bounced || 0}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export function EmailStatsDashboard({
    stats,
    isLoading,
    selectedDateRange,
    onDateRangeChange
}: EmailStatsDashboardProps) {
    if (isLoading) {
        return (
            <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Date Range Selector */}
            <div className="flex justify-end">
                <div className="inline-flex rounded-md border">
                    <button
                        onClick={() => onDateRangeChange('week')}
                        className={`px-3 py-1.5 text-sm rounded-l-md transition-colors ${selectedDateRange === 'week'
                                ? 'bg-primary text-primary-foreground'
                                : 'hover:bg-muted'
                            }`}
                    >
                        Last 7 Days
                    </button>
                    <button
                        onClick={() => onDateRangeChange('month')}
                        className={`px-3 py-1.5 text-sm transition-colors ${selectedDateRange === 'month'
                                ? 'bg-primary text-primary-foreground'
                                : 'hover:bg-muted'
                            }`}
                    >
                        Last 30 Days
                    </button>
                    <button
                        onClick={() => onDateRangeChange('all')}
                        className={`px-3 py-1.5 text-sm rounded-r-md transition-colors ${selectedDateRange === 'all'
                                ? 'bg-primary text-primary-foreground'
                                : 'hover:bg-muted'
                            }`}
                    >
                        All Time
                    </button>
                </div>
            </div>

            {/* Summary Cards */}
            <StatSummaryCards stats={stats} />

            {/* Detailed Stats by Email Type */}
            <EmailTypeStats stats={stats} />
        </div>
    );
}