import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";
import * as DocumentPicker from "expo-document-picker";
import { Platform } from "react-native";

export async function createBackup(): Promise<boolean> {
    try {
        // 1. Gather all data
        const keys = await AsyncStorage.getAllKeys();
        const result = await AsyncStorage.multiGet(keys);
        
        const backupData: Record<string, string | null> = {};
        result.forEach(([key, value]) => {
            backupData[key] = value;
        });

        const jsonString = JSON.stringify(backupData, null, 2);
        const fileName = `MyPersonalHub_Backup_${new Date().getTime()}.json`;

        if (Platform.OS === 'android') {
            const permissions = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
            if (permissions.granted) {
                const directoryUri = permissions.directoryUri;
                const fileUri = await FileSystem.StorageAccessFramework.createFileAsync(directoryUri, fileName, 'application/json');
                await FileSystem.writeAsStringAsync(fileUri, jsonString, { encoding: FileSystem.EncodingType.UTF8 });
                return true;
            } else {
                return false;
            }
        } else {
            // iOS or other
            const fileUri = `${FileSystem.documentDirectory}${fileName}`;
            await FileSystem.writeAsStringAsync(fileUri, jsonString, { encoding: FileSystem.EncodingType.UTF8 });
            
            const canShare = await Sharing.isAvailableAsync();
            if (canShare) {
                await Sharing.shareAsync(fileUri, {
                    mimeType: 'application/json',
                    dialogTitle: 'Save Backup',
                });
                return true;
            }
            return false;
        }
    } catch (e) {
        console.error("Failed to create backup", e);
        return false;
    }
}

export async function restoreBackup(): Promise<boolean> {
    try {
        const result = await DocumentPicker.getDocumentAsync({
            type: ['application/json', '*/*'],
            copyToCacheDirectory: true,
        });

        if (result.canceled) {
            return false;
        }

        const file = result.assets[0];
        if (!file) return false;

        const fileContent = await FileSystem.readAsStringAsync(file.uri, { encoding: FileSystem.EncodingType.UTF8 });
        const backupData = JSON.parse(fileContent);

        if (typeof backupData !== 'object' || backupData === null) {
            throw new Error("Invalid backup format");
        }

        // Restore keys
        const pairs: [string, string][] = [];
        for (const key in backupData) {
            const value = backupData[key];
            if (typeof value === 'string') {
                pairs.push([key, value]);
            }
        }

        if (pairs.length > 0) {
            await AsyncStorage.multiSet(pairs);
            return true;
        }
        
        return false;
    } catch (e) {
        console.error("Failed to restore backup", e);
        return false;
    }
}
