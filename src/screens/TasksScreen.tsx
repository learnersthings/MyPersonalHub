import {
    View,
    Text,
    TextInput,
    FlatList,
    TouchableOpacity,
} from "react-native";

import {
    useEffect,
    useState,
} from "react";

import { Ionicons } from "@expo/vector-icons";

import {
    getTasks,
    saveTasks,
} from "../services/tasksStorage";

import {
    globalStyles,
} from "../theme/styles";

export default function TasksScreen() {

    const [
        title,
        setTitle,
    ] = useState("");

    const [
        tasks,
        setTasks,
    ] = useState<any[]>([]);

    const [
        habitMode,
        setHabitMode,
    ] = useState(false);

    useEffect(() => {
        loadTasks();
    }, []);

    async function loadTasks() {
        const data =
            await getTasks();

        setTasks(data);
    }

    async function addTask() {

        if (!title.trim())
            return;

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

        const updated = [
            newTask,
            ...tasks,
        ];

        setTasks(updated);

        await saveTasks(
            updated
        );

        setTitle("");

        setHabitMode(
            false
        );
    }

    async function toggleTask(
        id: string
    ) {

        const updated =
            tasks.map(
                task =>
                    task.id === id
                        ? {
                            ...task,
                            completed:
                                !task.completed,
                        }
                        : task
            );

        setTasks(updated);

        await saveTasks(
            updated
        );
    }

    async function deleteTask(
        id: string
    ) {

        const updated =
            tasks.filter(
                task =>
                    task.id !== id
            );

        setTasks(updated);

        await saveTasks(
            updated
        );
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
                    marginBottom: 15,
                }}
            >
                Tasks & Habits
            </Text>

            <TextInput
                placeholder="Enter task..."
                value={title}
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
                                ? "#4CAF50"
                                : "#777",

                        marginBottom:
                            10,
                    },
                ]}
            >
                <Text
                    style={
                        globalStyles.buttonText
                    }
                >
                    {
                        habitMode
                            ? "🔥 Habit Mode"
                            : "📝 Task Mode"
                    }
                </Text>
            </TouchableOpacity>

            <FlatList
                data={tasks}

                keyExtractor={
                    item =>
                        item.id
                }

                renderItem={({
                    item,
                }) => (

                    <View
                        style={
                            globalStyles.card
                        }
                    >

                        <Text
                            style={{
                                fontSize:
                                    16,

                                textDecorationLine:
                                    item.completed
                                        ? "line-through"
                                        : "none",
                            }}
                        >
                            {
                                item.isHabit
                                    ? "🔥 "
                                    : "✅ "
                            }

                            {
                                item.title
                            }
                        </Text>

                        <View
                            style={{
                                flexDirection:
                                    "row",

                                gap: 8,

                                marginTop:
                                    12,
                            }}
                        >

                            <TouchableOpacity
                                onPress={() =>
                                    toggleTask(
                                        item.id
                                    )
                                }
                                style={[
                                    globalStyles.button,
                                    {
                                        flex:
                                            1,

                                        backgroundColor:
                                            "#4CAF50",
                                    },
                                ]}
                            >
                                <Text
                                    style={
                                        globalStyles.buttonText
                                    }
                                >
                                    {
                                        item.completed
                                            ? "Undo"
                                            : "Done"
                                    }
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() =>
                                    deleteTask(
                                        item.id
                                    )
                                }
                                style={[
                                    globalStyles.button,
                                    {
                                        flex:
                                            1,

                                        backgroundColor:
                                            "#F44336",
                                    },
                                ]}
                            >
                                <Text
                                    style={
                                        globalStyles.buttonText
                                    }
                                >
                                    Delete
                                </Text>
                            </TouchableOpacity>

                        </View>

                        <Text
                            style={{
                                marginTop:
                                    10,

                                color:
                                    "#777",

                                fontSize:
                                    13,
                            }}
                        >
                            {
                                new Date(
                                    item.createdAt
                                )
                                    .toLocaleDateString()
                            }
                        </Text>

                    </View>

                )}
            />

            {/* Floating Add */}

            <TouchableOpacity
                onPress={
                    addTask
                }

                style={
                    globalStyles.floatingButton
                }
            >
                <Ionicons
                    name="add"
                    size={32}
                    color="#fff"
                />
            </TouchableOpacity>

        </View>
    );
}