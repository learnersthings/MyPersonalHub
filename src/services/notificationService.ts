import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

export async function scheduleReminderNotification(title: string, date: Date): Promise<string | string[] | undefined> {
    const triggerDate = new Date(date);
    
    if (triggerDate.getTime() <= Date.now()) {
        return undefined; // Do not schedule in the past
    }

    let trigger: Notifications.NotificationTriggerInput = {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: triggerDate,
    };

    try {
        const identifier = await Notifications.scheduleNotificationAsync({
            content: {
                title: "⏰ Reminder",
                body: title,
                sound: true, // Default notification sound
            },
            trigger,
        });
        return identifier;
    } catch (e) {
        console.warn("Failed to schedule notification", e);
        return undefined;
    }
}

export async function cancelReminderNotification(notificationId?: string | string[]) {
    if (!notificationId) return;

    try {
        if (Array.isArray(notificationId)) {
            await Promise.all(notificationId.map(id => Notifications.cancelScheduledNotificationAsync(id).catch(e => console.warn(e))));
        } else {
            await Notifications.cancelScheduledNotificationAsync(notificationId);
        }
    } catch (e) {
        console.warn("Failed to cancel notification", e);
    }
}
