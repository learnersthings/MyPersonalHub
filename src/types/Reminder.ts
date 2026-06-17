export interface Reminder {
    id: string;
    title: string;
    completed: boolean;
    dueDate?: string;
    notificationId?: string | string[];
    createdAt: string;
}
