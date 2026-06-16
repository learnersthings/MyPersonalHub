import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Platform
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

import {
    getReminders,
    saveReminders,
} from "../services/remindersStorage";

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

    useEffect(() => {

        if (editingReminder) {

            setTitle(
                editingReminder.title
            );

            if (editingReminder.dueDate) {
                setDueDate(new Date(editingReminder.dueDate));
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
            !title.trim()
        )
            return;

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
                            dueDate: dueDate ? dueDate.toISOString() : undefined,
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

                dueDate: dueDate ? dueDate.toISOString() : undefined,

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

            <View
                style={{
                    height: 40,
                }}
            />

        </ScrollView>

    );
}
