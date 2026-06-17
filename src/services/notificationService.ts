import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

import { RecurrenceType } from "../types/Reminder";

export async function scheduleReminderNotification(title: string, date: Date, recurrence: RecurrenceType = 'none'): Promise<string | string[] | undefined> {
    const triggerDate = new Date(date);
    
    if (recurrence === 'none' && triggerDate.getTime() <= Date.now()) {
        return undefined; // Do not schedule in the past
    }

    let trigger: Notifications.NotificationTriggerInput = {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: triggerDate,
    };

    if (recurrence !== 'none') {
        const intervalMap: Record<string, number> = {
            '5m': 5 * 60,
            '10m': 10 * 60,
            '15m': 15 * 60,
            '20m': 20 * 60,
            '30m': 30 * 60,
            '45m': 45 * 60,
            '1h': 60 * 60,
            '2h': 2 * 60 * 60,
            '3h': 3 * 60 * 60,
            '6h': 6 * 60 * 60,
            '12h': 12 * 60 * 60,
        };

        if (intervalMap[recurrence]) {
            // Reverted back to TIME_INTERVAL because Android AlarmManager has a strict 500 alarm limit
            // and scheduling hundreds of DAILY alarms causes crashes.
            trigger = {
                type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
                seconds: intervalMap[recurrence],
                repeats: true,
            };
        } else if (recurrence === 'daily') {
            trigger = {
                type: Notifications.SchedulableTriggerInputTypes.DAILY,
                hour: triggerDate.getHours(),
                minute: triggerDate.getMinutes(),
            };
        } else if (recurrence === 'weekly') {
            trigger = {
                type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
                weekday: triggerDate.getDay() + 1, // JS getDay() is 0-6 (Sun-Sat), Expo weekday is 1-7 (Sun-Sat)
                hour: triggerDate.getHours(),
                minute: triggerDate.getMinutes(),
            };
        } else if (recurrence === 'monthly') {
            trigger = {
                type: Notifications.SchedulableTriggerInputTypes.MONTHLY,
                day: triggerDate.getDate(),
                hour: triggerDate.getHours(),
                minute: triggerDate.getMinutes(),
            };
        } else if (recurrence === 'yearly') {
            trigger = {
                type: Notifications.SchedulableTriggerInputTypes.YEARLY,
                month: triggerDate.getMonth(), // 0-11
                day: triggerDate.getDate(),
                hour: triggerDate.getHours(),
                minute: triggerDate.getMinutes(),
            };
        }
    }

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
