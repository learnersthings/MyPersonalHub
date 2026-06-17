import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Platform,
    Modal,
    FlatList
} from "react-native";

import {
    useState,
    useEffect
} from "react";

import {
    useNavigation,
    useRoute
} from "@react-navigation/native";

import {
    Ionicons,
} from "@expo/vector-icons";

import DateTimePicker from "@react-native-community/datetimepicker";
import { RecurrenceType } from "../types/Reminder";

import {
    getReminders,
    saveReminders,
} from "../services/remindersStorage";

import {
    scheduleReminderNotification,
    cancelReminderNotification,
} from "../services/notificationService";

import {
    globalStyles,
} from "../theme/styles";

import {
    useTheme,
} from "../context/ThemeContext";

export default function ReminderEditorScreen() {

    const navigation =
        useNavigation<any>();

    const route =
        useRoute<any>();

    const {
        colors,
    } = useTheme();

    const editingReminder =
        route.params?.reminder;

    const [
        title,
        setTitle,
    ] =
        useState("");

    const [dueDate, setDueDate] = useState<Date | null>(null);
    const [mode, setMode] = useState<any>('date');
    const [showPicker, setShowPicker] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    
    // We add 'specific' to represent the "Specific Date & Time" option
    const [scheduleType, setScheduleType] = useState<string>('none');
    const [showRecurrencePicker, setShowRecurrencePicker] = useState(false);

    const scheduleOptions: { label: string, value: string }[] = [
        { label: "No Reminder", value: "none" },
        { label: "Specific Date & Time", value: "specific" },
        { label: "Every 5 Mins", value: "5m" },
        { label: "Every 10 Mins", value: "10m" },
        { label: "Every 15 Mins", value: "15m" },
        { label: "Every 20 Mins", value: "20m" },
        { label: "Every 30 Mins", value: "30m" },
        { label: "Every 45 Mins", value: "45m" },
        { label: "Every 1 Hour", value: "1h" },
        { label: "Every 2 Hours", value: "2h" },
        { label: "Every 3 Hours", value: "3h" },
        { label: "Every 6 Hours", value: "6h" },
        { label: "Every 12 Hours", value: "12h" },
        { label: "Daily", value: "daily" },
        { label: "Weekly", value: "weekly" },
        { label: "Monthly", value: "monthly" },
        { label: "Yearly", value: "yearly" },
    ];

    useEffect(() => {

        if (editingReminder) {

            setTitle(
                editingReminder.title
            );

            if (editingReminder.dueDate) {
                setDueDate(new Date(editingReminder.dueDate));
            }
            if (editingReminder.recurrence && editingReminder.recurrence !== 'none') {
                setScheduleType(editingReminder.recurrence);
            } else if (editingReminder.dueDate) {
                setScheduleType('specific');
            } else {
                setScheduleType('none');
            }

        }

    }, []);

    const onChangeDate = (event: any, selectedDate?: Date) => {
        const currentDate = selectedDate || dueDate;
        setShowPicker(Platform.OS === 'ios'); // On iOS it can stay open, but we'll close it on Android
        if (currentDate) {
            setDueDate(currentDate);
        }
    };

    const showMode = (currentMode: any) => {
        setShowPicker(true);
        setMode(currentMode);
    };

    async function saveReminder() {

        if (
            !title.trim() || isSaving
        )
            return;
        
        setIsSaving(true);

        let newNotificationId: string | string[] | undefined = undefined;

        if (editingReminder && editingReminder.notificationId) {
            await cancelReminderNotification(editingReminder.notificationId);
        }

        const isCompleted = editingReminder ? editingReminder.completed : false;

        let finalDueDate = scheduleType === 'specific' ? dueDate : null;
        let finalRecurrence: RecurrenceType = 'none';

        if (scheduleType !== 'none' && scheduleType !== 'specific') {
            finalRecurrence = scheduleType as RecurrenceType;
            finalDueDate = new Date(); // Use current time as base for intervals/daily
        }

        if (finalDueDate && !isCompleted) {
            newNotificationId = await scheduleReminderNotification(title, finalDueDate, finalRecurrence);
        }

        const reminders =
            await getReminders();

        let updatedReminders =
            [];

        if (editingReminder) {

            updatedReminders =
                reminders.map(reminder =>

                    reminder.id ===
                        editingReminder.id

                        ? {
                            ...reminder,
                            title,
                            dueDate: finalDueDate ? finalDueDate.toISOString() : undefined,
                            notificationId: newNotificationId,
                            recurrence: finalRecurrence,
                        }

                        : reminder
                );

        } else {

            const newReminder = {

                id:
                    Date.now()
                        .toString(),

                title,

                completed:
                    false,

                dueDate: finalDueDate ? finalDueDate.toISOString() : undefined,
                notificationId: newNotificationId,
                recurrence: finalRecurrence,

                createdAt:
                    new Date()
                        .toISOString(),
            };

            updatedReminders = [
                newReminder,
                ...reminders,
            ];
        }

        await saveReminders(
            updatedReminders
        );

        setIsSaving(false);
        navigation.goBack();
    }

    return (

        <ScrollView

            style={[
                globalStyles.screen,
                {
                    backgroundColor:
                        colors.background,
                },
            ]}

            showsVerticalScrollIndicator={
                false
            }
        >

            <View
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: 20,
                }}
            >

                <TouchableOpacity
                    onPress={() =>
                        navigation.goBack()
                    }
                    style={{
                        marginRight: 12,
                    }}
                >
                    <Ionicons
                        name="arrow-back"
                        size={28}
                        color={colors.text}
                    />
                </TouchableOpacity>

                <Text
                    style={{
                        fontSize: 24,
                        fontWeight: "700",
                        color: colors.text,
                    }}
                >
                    {
                        editingReminder
                            ? "Edit Reminder"
                            : "Create Reminder"
                    }
                </Text>

            </View>

            <TextInput

                placeholder="Enter reminder..."

                placeholderTextColor={
                    colors.subText
                }

                value={
                    title
                }

                onChangeText={
                    setTitle
                }

                style={[
                    globalStyles.input,
                    {
                        backgroundColor:
                            colors.input,

                        color:
                            colors.text,

                        borderColor:
                            colors.border,
                    },
                ]}
            />

            <Text
                style={{
                    fontSize: 16,
                    fontWeight: "600",
                    marginBottom: 10,
                    marginTop: 10,
                    color: colors.text,
                }}
            >
                Notification Schedule
            </Text>

            <TouchableOpacity
                onPress={() => setShowRecurrencePicker(true)}
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    paddingVertical: 14,
                    paddingHorizontal: 16,
                    backgroundColor: colors.card,
                    borderWidth: 1,
                    borderColor: colors.border,
                    borderRadius: 10,
                    marginBottom: 20,
                }}
            >
                <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                    <Ionicons name="notifications-outline" size={20} color={colors.primary} />
                    <Text style={{ color: colors.text, fontWeight: "600", fontSize: 16 }}>
                        {scheduleOptions.find(o => o.value === scheduleType)?.label || "No Reminder"}
                    </Text>
                </View>
                <Ionicons name="chevron-down" size={20} color={colors.subText} />
            </TouchableOpacity>

            {scheduleType === 'specific' && (
                <>
                    <Text
                        style={{
                            fontSize: 16,
                            fontWeight: "600",
                            marginBottom: 10,
                            color: colors.text,
                        }}
                    >
                        Set Date & Time
                    </Text>

                    <View style={{ flexDirection: "row", gap: 10, marginBottom: 20 }}>
                        <TouchableOpacity
                            onPress={() => showMode('date')}
                            style={{
                                flex: 1,
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "center",
                                paddingVertical: 12,
                                backgroundColor: colors.card,
                                borderWidth: 1,
                                borderColor: colors.border,
                                borderRadius: 10,
                                gap: 8,
                            }}
                        >
                            <Ionicons name="calendar-outline" size={20} color={colors.primary} />
                            <Text style={{ color: colors.text, fontWeight: "600" }}>
                                {dueDate ? dueDate.toLocaleDateString() : "Select Date"}
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => showMode('time')}
                            style={{
                                flex: 1,
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "center",
                                paddingVertical: 12,
                                backgroundColor: colors.card,
                                borderWidth: 1,
                                borderColor: colors.border,
                                borderRadius: 10,
                                gap: 8,
                            }}
                        >
                            <Ionicons name="time-outline" size={20} color={colors.primary} />
                            <Text style={{ color: colors.text, fontWeight: "600" }}>
                                {dueDate ? dueDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : "Select Time"}
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {dueDate && (
                        <TouchableOpacity
                            onPress={() => setDueDate(null)}
                            style={{
                                alignSelf: 'flex-start',
                                marginBottom: 20,
                                paddingVertical: 6,
                                paddingHorizontal: 12,
                                backgroundColor: 'rgba(244, 67, 54, 0.1)',
                                borderRadius: 20,
                            }}
                        >
                            <Text style={{ color: '#F44336', fontWeight: '600' }}>Clear Date & Time</Text>
                        </TouchableOpacity>
                    )}
                </>
            )}

            {showPicker && (
                <DateTimePicker
                    value={dueDate || new Date()}
                    mode={mode}
                    is24Hour={true}
                    display="default"
                    onChange={onChangeDate}
                />
            )}

            <TouchableOpacity

                onPress={
                    saveReminder
                }
                disabled={isSaving}

                style={[
                    globalStyles.button,
                    {
                        backgroundColor:
                            colors.primary,
                        marginTop: 10,
                    },
                ]}
            >

                <View
                    style={{
                        flexDirection:
                            "row",

                        alignItems:
                            "center",

                        justifyContent:
                            "center",

                        gap:
                            8,
                    }}
                >

                    <Ionicons
                        name="save"
                        size={18}
                        color="#fff"
                    />

                    <Text
                        style={
                            globalStyles.buttonText
                        }
                    >

                        {
                            editingReminder
                                ? "Update"
                                : "Save"
                        }

                    </Text>

                </View>

            </TouchableOpacity>

            <Modal visible={showRecurrencePicker} transparent={true} animationType="fade">
                <TouchableOpacity 
                    style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' }}
                    activeOpacity={1}
                    onPress={() => setShowRecurrencePicker(false)}
                >
                    <View style={{ backgroundColor: colors.card, width: '80%', maxHeight: '70%', borderRadius: 20, overflow: 'hidden' }}>
                        <View style={{ padding: 16, borderBottomWidth: 1, borderBottomColor: colors.border, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Text style={{ color: colors.text, fontSize: 18, fontWeight: '700' }}>Notification Schedule</Text>
                            <TouchableOpacity onPress={() => setShowRecurrencePicker(false)}>
                                <Ionicons name="close" size={24} color={colors.text} />
                            </TouchableOpacity>
                        </View>
                        <FlatList
                            data={scheduleOptions}
                            keyExtractor={(item) => item.value}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={{
                                        padding: 16,
                                        borderBottomWidth: 1,
                                        borderBottomColor: colors.border,
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        alignItems: 'center'
                                    }}
                                    onPress={() => {
                                        setScheduleType(item.value);
                                        // Auto set a due date if they pick specific and it was null
                                        if (item.value === 'specific' && !dueDate) {
                                            setDueDate(new Date());
                                        }
                                        setShowRecurrencePicker(false);
                                    }}
                                >
                                    <Text style={{ color: colors.text, fontSize: 16, fontWeight: scheduleType === item.value ? '700' : '400' }}>{item.label}</Text>
                                    {scheduleType === item.value && <Ionicons name="checkmark" size={20} color={colors.primary} />}
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                </TouchableOpacity>
            </Modal>

            <View
                style={{
                    height: 40,
                }}
            />

        </ScrollView>

    );
}
