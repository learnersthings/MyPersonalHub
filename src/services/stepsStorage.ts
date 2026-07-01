import AsyncStorage from "@react-native-async-storage/async-storage";

export interface StepGoals {
    daily: number;
    weekly: number;
    monthly: number;
}

export interface StepProgress {
    dailySteps: number;
    weeklySteps: number;
    monthlySteps: number;
    yesterdaySteps: number;
    lastWeekSteps: number;
    lastMonthSteps: number;
    lastUpdateDate: string;
}

const DEFAULT_GOALS: StepGoals = {
    daily: 10000,
    weekly: 50000,
    monthly: 300000,
};

const DEFAULT_PROGRESS: StepProgress = {
    dailySteps: 0,
    weeklySteps: 0,
    monthlySteps: 0,
    yesterdaySteps: 0,
    lastWeekSteps: 0,
    lastMonthSteps: 0,
    lastUpdateDate: new Date().toISOString(),
};

const STORAGE_KEY_GOALS = "STEP_GOALS";
const STORAGE_KEY_PROGRESS = "STEP_PROGRESS";

export async function getStepGoals(): Promise<StepGoals> {
    try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY_GOALS);
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
        await AsyncStorage.setItem(STORAGE_KEY_GOALS, JSON.stringify(goals));
    } catch (e) {
        console.error("Error saving step goals", e);
    }
}

export async function getStepProgress(): Promise<StepProgress> {
    try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY_PROGRESS);
        if (stored !== null) {
            return JSON.parse(stored);
        }
        return DEFAULT_PROGRESS;
    } catch (e) {
        console.error("Error reading step progress", e);
        return DEFAULT_PROGRESS;
    }
}

export async function saveStepProgress(progress: StepProgress): Promise<void> {
    try {
        await AsyncStorage.setItem(STORAGE_KEY_PROGRESS, JSON.stringify(progress));
    } catch (e) {
        console.error("Error saving step progress", e);
    }
}
