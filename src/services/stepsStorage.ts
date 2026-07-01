import AsyncStorage from "@react-native-async-storage/async-storage";

export interface StepGoals {
    daily: number;
    weekly: number;
    monthly: number;
}

const DEFAULT_GOALS: StepGoals = {
    daily: 10000,
    weekly: 50000,
    monthly: 300000,
};

const STORAGE_KEY = "STEP_GOALS";

export async function getStepGoals(): Promise<StepGoals> {
    try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored !== null) {
            return JSON.parse(stored);
        }
        return DEFAULT_GOALS;
    } catch (e) {
        console.error("Error reading step goals", e);
        return DEFAULT_GOALS;
    }
}

export async function saveStepGoals(goals: StepGoals): Promise<void> {
    try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(goals));
    } catch (e) {
        console.error("Error saving step goals", e);
    }
}
