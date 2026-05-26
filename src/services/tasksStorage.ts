import AsyncStorage from "@react-native-async-storage/async-storage";
import { Task } from "../types/Task";

const STORAGE_KEY = "tasks";

export async function getTasks(): Promise<Task[]> {
    const data =
        await AsyncStorage.getItem(
            STORAGE_KEY
        );

    return data
        ? JSON.parse(data)
        : [];
}

export async function saveTasks(
    tasks: Task[]
) {
    await AsyncStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(tasks)
    );
}