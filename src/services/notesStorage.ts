import AsyncStorage from "@react-native-async-storage/async-storage";
import { Note } from "../types/Note";

const STORAGE_KEY = "notes";

export async function getNotes(): Promise<Note[]> {
    const data = await AsyncStorage.getItem(STORAGE_KEY);

    if (!data) return [];

    return JSON.parse(data);
}

export async function saveNotes(notes: Note[]) {
    await AsyncStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(notes)
    );
}