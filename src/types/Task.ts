export interface Task {
    id: string;
    title: string;
    completed: boolean;
    isHabit: boolean;
    taskMode: boolean;
    category: string;
    priority: string;
    createdAt: string;
}