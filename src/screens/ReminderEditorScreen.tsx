import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView
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

    useEffect(() => {

        if (editingReminder) {

            setTitle(
                editingReminder.title
            );

        }

    }, []);

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

            <TouchableOpacity

                onPress={
                    saveReminder
                }

                style={[
                    globalStyles.button,
                    {
                        backgroundColor:
                            colors.primary,
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
