import AsyncStorage from "@react-native-async-storage/async-storage";

export interface UserProfile {
    firstName: string;
    lastName: string;
    avatarBase64: string | null;
}

const STORAGE_KEY = "userProfile";

export async function getProfile(): Promise<UserProfile | null> {
    try {
        const data = await AsyncStorage.getItem(STORAGE_KEY);
        if (data) {
            return JSON.parse(data) as UserProfile;
        }
        return null;
    } catch (e) {
        console.error("Failed to load profile", e);
        return null;
    }
}

export async function saveProfile(profile: UserProfile): Promise<boolean> {
    try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
        return true;
    } catch (e) {
        console.error("Failed to save profile", e);
        return false;
    }
}
