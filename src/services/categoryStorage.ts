import AsyncStorage from "@react-native-async-storage/async-storage";
import { Category } from "../types/Category";

const STORAGE_KEY = "categories";

export async function getCategories(): Promise<Category[]> {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    if (!data) {
        return [];
    }
    return JSON.parse(data);
}

export async function saveCategories(categories: Category[]) {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(categories));
}
