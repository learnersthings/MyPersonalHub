import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    Alert,
} from "react-native";
import { useState, useCallback } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import Swipeable from "react-native-gesture-handler/Swipeable";

import { getReminders, saveReminders } from "../services/remindersStorage";
import { Reminder } from "../types/Reminder";
import { globalStyles } from "../theme/styles";
import { useTheme } from "../context/ThemeContext";

export default function RemindersScreen() {
    const navigation = useNavigation<any>();
    const { colors } = useTheme();

    const [reminders, setReminders] = useState<Reminder[]>([]);

    useFocusEffect(
        useCallback(() => {
            loadReminders();
        }, [])
    );

    async function loadReminders() {
        const data = await getReminders();
        // Sort by newest first or just keep array order
        setReminders(data);
    }

    async function toggleReminder(id: string) {
        const updated = reminders.map(reminder =>
            reminder.id === id
                ? { ...reminder, completed: !reminder.completed }
                : reminder
        );
        setReminders(updated);
        await saveReminders(updated);
    }

    async function deleteReminder(id: string) {
        Alert.alert(
            "Delete",
            "Are you sure you want to delete this?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        const updated = reminders.filter(reminder => reminder.id !== id);
                        setReminders(updated);
                        await saveReminders(updated);
                    },
                },
            ]
        );
    }

    return (
        <View style={[globalStyles.screen, { backgroundColor: colors.background }]}>
            <Text style={{ fontSize: 24, fontWeight: "700", marginBottom: 15, color: colors.text }}>
                📝 Reminders
            </Text>

            <FlatList
                data={reminders}
                keyExtractor={item => item.id}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => (
                    <Swipeable
                        renderLeftActions={() => (
                            <TouchableOpacity
                                onPress={() => toggleReminder(item.id)}
                                style={{
                                    backgroundColor: item.completed ? "#2196F3" : "#4CAF50",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    width: 90,
                                    borderRadius: 14,
                                    marginBottom: 14,
                                }}
                            >
                                <Ionicons name={item.completed ? "refresh" : "checkmark"} size={26} color="#fff" />
                            </TouchableOpacity>
                        )}
                        renderRightActions={() => (
                            <TouchableOpacity
                                onPress={() => deleteReminder(item.id)}
                                style={{
                                    backgroundColor: "#F44336",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    width: 90,
                                    borderRadius: 14,
                                    marginBottom: 14,
                                }}
                            >
                                <Ionicons name="trash" size={26} color="#fff" />
                            </TouchableOpacity>
                        )}
                    >
                        <TouchableOpacity
                            activeOpacity={0.9}
                            onPress={() => navigation.navigate("ReminderEditor", { reminder: item })}
                            style={[
                                globalStyles.card,
                                {
                                    backgroundColor: colors.card,
                                    opacity: item.completed ? 0.8 : 1,
                                    borderLeftWidth: 5,
                                    borderLeftColor: item.completed ? "#4CAF50" : "#2196F3",
                                    marginBottom: 14,
                                },
                            ]}
                        >
                            <Text
                                style={{
                                    fontSize: 16,
                                    color: colors.text,
                                    textDecorationLine: item.completed ? "line-through" : "none",
                                }}
                            >
                                ⏰ {item.title}
                            </Text>

                            {item.dueDate && (
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 6, gap: 4 }}>
                                    <Ionicons name="calendar-outline" size={14} color={colors.subText} />
                                    <Text style={{ fontSize: 12, color: colors.subText }}>
                                        {new Date(item.dueDate).toLocaleDateString()} at {new Date(item.dueDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </Text>
                                </View>
                            )}
                        </TouchableOpacity>
                    </Swipeable>
                )}
                contentContainerStyle={{ paddingBottom: 100 }}
                ListEmptyComponent={
                    <View style={{ alignItems: "center", marginTop: 50 }}>
                        <Ionicons name="alarm-outline" size={64} color={colors.subText} />
                        <Text style={{ color: colors.subText, marginTop: 10, fontSize: 16 }}>
                            No reminders yet.
                        </Text>
                    </View>
                }
            />

            <TouchableOpacity
                onPress={() => navigation.navigate("ReminderEditor")}
                style={[globalStyles.floatingButton, { backgroundColor: colors.primary }]}
            >
                <Ionicons name="add" size={32} color="#fff" />
            </TouchableOpacity>
        </View>
    );
}
