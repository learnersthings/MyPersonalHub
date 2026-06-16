import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

export async function scheduleReminderNotification(title: string, date: Date): Promise<string | undefined> {
    const triggerDate = new Date(date);
    if (triggerDate.getTime() <= Date.now()) {
        return undefined; // Do not schedule in the past
    }

    try {
        const identifier = await Notifications.scheduleNotificationAsync({
            content: {
                title: "⏰ Reminder",
                body: title,
                sound: true, // Default notification sound
            },
            trigger: {
                type: Notifications.SchedulableTriggerInputTypes.DATE,
                date: triggerDate,
            },
        });
        return identifier;
    } catch (e) {
        console.warn("Failed to schedule notification", e);
        return undefined;
    }
}

export async function cancelReminderNotification(notificationId?: string) {
    if (!notificationId) return;

    try {
        await Notifications.cancelScheduledNotificationAsync(notificationId);
    } catch (e) {
        console.warn("Failed to cancel notification", e);
    }
}
