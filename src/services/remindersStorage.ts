import AsyncStorage from "@react-native-async-storage/async-storage";
import { Reminder } from "../types/Reminder";

const STORAGE_KEY = "reminders";

export async function getReminders(): Promise<Reminder[]> {
    const data =
        await AsyncStorage.getItem(
            STORAGE_KEY
        );

    return data
        ? JSON.parse(data)
        : [];
}

export async function saveReminders(
    reminders: Reminder[]
) {
    await AsyncStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(reminders)
    );
}
