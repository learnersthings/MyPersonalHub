import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
} from "react-native";

import {
    useState,
} from "react";

import {
    useNavigation,
} from "@react-navigation/native";

import {
    Ionicons,
} from "@expo/vector-icons";

import {
    getTasks,
    saveTasks,
} from "../services/tasksStorage";

import {
    globalStyles,
} from "../theme/styles";

export default function TaskEditorScreen() {

    const navigation =
        useNavigation<any>();

    const [
        title,
        setTitle,
    ] =
        useState("");

    const [
        habitMode,
        setHabitMode,
    ] =
        useState(false);

    async function saveTask() {

        if (
            !title.trim()
        )
            return;

        const tasks =
            await getTasks();

        const newTask = {

            id:
                Date.now()
                    .toString(),

            title,

            completed:
                false,

            isHabit:
                habitMode,

            createdAt:
                new Date()
                    .toISOString(),
        };

        await saveTasks([
            newTask,
            ...tasks,
        ]);

        setTitle("");

        setHabitMode(
            false
        );

        navigation.goBack();
    }

    return (

        <View
            style={
                globalStyles.screen
            }
        >

            <Text
                style={{
                    fontSize: 24,

                    fontWeight:
                        "700",

                    marginBottom:
                        20,
                }}
            >

                ✍️ Create Task

            </Text>

            <TextInput
                placeholder="Enter task or habit..."

                value={
                    title
                }

                onChangeText={
                    setTitle
                }

                style={
                    globalStyles.input
                }
            />

            <TouchableOpacity

                onPress={() =>
                    setHabitMode(
                        !habitMode
                    )
                }

                style={[
                    globalStyles.button,
                    {
                        backgroundColor:
                            habitMode
                                ? "#555"
                                : "#555",

                        marginBottom:
                            12,
                    },
                ]}
            >

                <View
                    style={{
                        flexDirection:
                            "row",

                        alignItems:
                            "center",

                        gap:
                            8,
                    }}
                >

                    <Ionicons
                        name={
                            habitMode
                                ? "flame"
                                : "clipboard"
                        }

                        size={18}

                        color="#fff"
                    />

                    <Text
                        style={
                            globalStyles.buttonText
                        }
                    >

                        {
                            habitMode
                                ? "Habit Mode"
                                : "Task Mode"
                        }

                    </Text>

                </View>

            </TouchableOpacity>

            <TouchableOpacity

                onPress={
                    saveTask
                }

                style={
                    globalStyles.button
                }
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

                        Save

                    </Text>

                </View>

            </TouchableOpacity>

        </View>

    );
}