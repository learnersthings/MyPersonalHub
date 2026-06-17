export type RecurrenceType = 'none' | '5m' | '10m' | '15m' | '20m' | '30m' | '45m' | '1h' | '2h' | '3h' | '6h' | '12h' | 'daily' | 'weekly' | 'monthly' | 'yearly';

export interface Reminder {
    id: string;
    title: string;
    completed: boolean;
    dueDate?: string;
    notificationId?: string | string[];
    recurrence?: RecurrenceType;
    createdAt: string;
}
