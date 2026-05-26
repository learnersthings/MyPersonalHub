import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
} from "react-native";

import {
    useEffect,
    useState,
} from "react";

import {
    useFocusEffect,
    useNavigation,
} from "@react-navigation/native";

import {
    useCallback,
} from "react";

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

export default function TasksScreen() {

    const navigation =
        useNavigation<any>();

    const [
        tasks,
        setTasks,
    ] =
        useState<any[]>([]);

    useFocusEffect(
        useCallback(() => {
            loadTasks();
        }, [])
    );

    async function loadTasks() {

        const data =
            await getTasks();

        setTasks(data);
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

    const completed =
        tasks.filter(
            t =>
                t.completed
        ).length;

    const percentage =
        tasks.length
            ? Math.round(
                (
                    completed
                    /
                    tasks.length
                ) * 100
            )
            : 0;

    return (

        <View
            style={
                globalStyles.screen
            }
        >

            <Text
                style={{
                    fontSize: 24,
                    fontWeight: "700",
                    marginBottom: 15,
                }}
            >
                📝 Tasks & Habits
            </Text>

            {/* Progress */}

            <View
                style={{
                    backgroundColor:
                        "#2196F3",

                    padding: 15,

                    borderRadius: 12,

                    marginBottom: 15,
                }}
            >

                <View
                    style={{
                        flexDirection:
                            "row",

                        justifyContent:
                            "space-between",

                        alignItems:
                            "center",
                    }}
                >

                    <Text
                        style={{
                            color:
                                "#fff",

                            fontSize:
                                18,

                            fontWeight:
                                "600",
                        }}
                    >

                        📊 Completed

                        {" "}

                        {
                            completed
                        }

                        /

                        {
                            tasks.length
                        }

                    </Text>

                    <Text
                        style={{
                            color:
                                "#fff",

                            fontSize:
                                22,

                            fontWeight:
                                "700",
                        }}
                    >
                        {
                            percentage
                        }
                        %
                    </Text>

                </View>

            </View>

            <FlatList

                data={
                    tasks
                }

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

                                marginTop: 12,
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
                                        flex: 1,

                                        backgroundColor:
                                            item.completed
                                                ? "#2196F3"
                                                : "#4CAF50",
                                    },
                                ]}
                            >

                                <View
                                    style={{
                                        flexDirection:
                                            "row",

                                        alignItems:
                                            "center",

                                        gap: 6,
                                    }}
                                >

                                    <Ionicons
                                        name={
                                            item.completed
                                                ? "refresh"
                                                : "checkmark"
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
                                            item.completed
                                                ? "Undo"
                                                : "Done"
                                        }

                                    </Text>

                                </View>

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
                                        flex: 1,

                                        backgroundColor:
                                            "#F44336",
                                    },
                                ]}
                            >

                                <View
                                    style={{
                                        flexDirection:
                                            "row",

                                        alignItems:
                                            "center",

                                        gap: 6,
                                    }}
                                >

                                    <Ionicons
                                        name="trash"
                                        size={18}
                                        color="#fff"
                                    />

                                    <Text
                                        style={
                                            globalStyles.buttonText
                                        }
                                    >
                                        Delete
                                    </Text>

                                </View>

                            </TouchableOpacity>

                        </View>

                        <View
                            style={{
                                flexDirection:
                                    "row",

                                alignItems:
                                    "center",

                                marginTop:
                                    10,
                            }}
                        >

                            <Ionicons
                                name="calendar-outline"
                                size={14}
                                color="#555"
                            />

                            <Text
                                style={{
                                    marginLeft:
                                        5,

                                    color:
                                        "#555",

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

                    </View>

                )}

                ListEmptyComponent={

                    <Text
                        style={{
                            textAlign:
                                "center",

                            marginTop:
                                80,

                            color:
                                "#555",

                            fontSize:
                                16,
                        }}
                    >

                        No tasks yet

                    </Text>

                }

            />

            <TouchableOpacity
                onPress={() =>
                    navigation.navigate(
                        "TaskEditor"
                    )
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
} x