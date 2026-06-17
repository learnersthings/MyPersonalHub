export interface Subtask {
    id: string;
    title: string;
    completed: boolean;
}

export interface Task {
    id: string;
    title: string;
    completed: boolean;
    category: string;
    priority: string;
    createdAt: string;
    subtasks?: Subtask[];
}