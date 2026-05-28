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

import { Ionicons } from "@expo/vector-icons";

import {
    useNavigation,
    useFocusEffect,
} from "@react-navigation/native";

import { useCallback } from "react";

import {
    getTasks,
    saveTasks,
} from "../services/tasksStorage";

import {
    globalStyles,
} from "../theme/styles";

const categoryStyles: any = {

    Personal: {
        color: "#2196F3",
        icon: "person",
    },

    Study: {
        color: "#9C27B0",
        icon: "book",
    },

    Work: {
        color: "#FF9800",
        icon: "briefcase",
    },

    Fitness: {
        color: "#4CAF50",
        icon: "barbell",
    },

    Shopping: {
        color: "#E91E63",
        icon: "cart",
    },

    Travel: {
        color: "#43B581",
        icon: "train",
    },

    Other: {
        color: "#7F8C8D",
        icon: "ellipsis-horizontal",
    },
};

export default function TasksScreen() {

    const navigation =
        useNavigation<any>();

    const [
        tasks,
        setTasks,
    ] = useState<any[]>([]);

    const [
        filter,
        setFilter,
    ] = useState("All");

    useFocusEffect(
        useCallback(() => {
            loadTasks();
        }, [])
    );

    async function loadTasks() {

        const data =
            await getTasks();

        const priorityOrder: Record<
            string,
            number
        > = {
            High: 1,
            Medium: 2,
            Low: 3,
        };

        data.sort(
            (a, b) =>
                priorityOrder[a.priority]
                -
                priorityOrder[b.priority]
        );

        setTasks(data);
    }

    async function toggleTask(
        id: string
    ) {

        const updated =
            tasks.map(task =>
                task.id === id
                    ? {
                        ...task,
                        completed:
                            !task.completed,
                    }
                    : task
            );

        setTasks(updated);

        await saveTasks(updated);
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

        await saveTasks(updated);
    }

    const completedCount =
        tasks.filter(
            t => t.completed
        ).length;

    const progress =
        tasks.length
            ? (
                completedCount
                /
                tasks.length
            ) * 100
            : 0;

    const filteredTasks =
        tasks.filter(task => {

            if (
                filter ===
                "Completed"
            )
                return task.completed;

            if (
                filter ===
                "Pending"
            )
                return !task.completed;

            if (
                filter ===
                "Tasks"
            )

                return !task.isHabit;

            if (
                filter ===
                "Habits"
            )
                return task.isHabit;

            if (
                task.category ===
                filter
            )
                return true;

            return filter === 'All';
        });

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

            {/* Dashboard */}

            <View
                style={{
                    backgroundColor:
                        "#2196F3",

                    padding: 16,

                    borderRadius: 14,

                    marginBottom: 18,
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
                            color: "#fff",
                            fontSize: 18,
                            fontWeight: "700",
                        }}
                    >

                        Completed

                    </Text>

                    <Text
                        style={{
                            color: "#fff",
                            fontSize: 24,
                            fontWeight: "bold",
                        }}
                    >

                        {
                            Math.round(
                                progress
                            )
                        }%

                    </Text>

                </View>

                <Text
                    style={{
                        color: "#E3F2FD",
                        marginTop: 5,
                    }}
                >

                    {
                        completedCount
                    }

                    /

                    {
                        tasks.length
                    }

                    {" Completed"}

                </Text>

                {/* Progress Bar */}

                <View
                    style={{
                        height: 10,
                        backgroundColor:
                            "rgba(255,255,255,0.3)",

                        borderRadius: 10,

                        marginTop: 14,

                        overflow: "hidden",
                    }}
                >

                    <View
                        style={{
                            width:
                                `${progress}%`,

                            height: "100%",

                            backgroundColor:
                                "#fff",

                            borderRadius: 10,
                        }}
                    />

                </View>

            </View>

            {/* Filters */}

            <View
                style={{
                    height: 42,
                    marginBottom: 12,
                }}
            >

                <FlatList

                    horizontal

                    showsHorizontalScrollIndicator={
                        false
                    }

                    data={[
                        "All",
                        "Tasks",
                        "Habits",
                        "Completed",
                        "Pending",
                        "Personal",
                        "Study",
                        "Work",
                        "Fitness",
                        "Shopping",
                        "Travel",
                        "Other"
                    ]}

                    keyExtractor={
                        item => item
                    }

                    contentContainerStyle={{
                        alignItems: "center",
                        paddingRight: 10,
                        gap: 8,
                    }}

                    renderItem={({ item }) => {

                        const count =
                            tasks.filter(task => {

                                if (item === "All")
                                    return true;

                                if (item === "Completed")
                                    return task.completed;

                                if (item === "Pending")
                                    return !task.completed;

                                if (item === "Tasks")
                                    return task.taskMode;

                                if (item === "Habits")
                                    return task.isHabit;

                                return (
                                    task.category === item
                                );

                            }).length;

                        return (

                            <TouchableOpacity

                                onPress={() =>
                                    setFilter(item)
                                }

                                style={{
                                    backgroundColor:
                                        filter === item
                                            ? "#2196F3"
                                            : "#E0E0E0",

                                    paddingHorizontal: 14,

                                    height: 32,

                                    borderRadius: 16,

                                    alignItems: "center",

                                    justifyContent: "center",

                                    flexDirection: "row",

                                    gap: 6,
                                }}
                            >

                                <Text
                                    style={{
                                        color:
                                            filter === item
                                                ? "#fff"
                                                : "#333",

                                        fontSize: 13,

                                        fontWeight: "600",
                                    }}
                                >

                                    {item}

                                </Text>

                                <View
                                    style={{
                                        backgroundColor:
                                            filter === item
                                                ? "rgba(255,255,255,0.25)"
                                                : "#C5C5C5",

                                        minWidth: 18,

                                        height: 18,

                                        borderRadius: 9,

                                        alignItems: "center",

                                        justifyContent: "center",

                                        paddingHorizontal: 5,
                                    }}
                                >

                                    <Text
                                        style={{
                                            color:
                                                filter === item
                                                    ? "#fff"
                                                    : "#333",

                                            fontSize: 11,

                                            fontWeight: "700",
                                        }}
                                    >

                                        {count}

                                    </Text>

                                </View>

                            </TouchableOpacity>

                        );
                    }}
                />

            </View>

            <FlatList

                data={
                    filteredTasks
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
                                fontSize: 16,

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
                                flexDirection: "row",

                                alignItems: "center",

                                alignSelf: "flex-start",

                                marginTop: 8,

                                backgroundColor:
                                    `${categoryStyles[item.category]?.color}20`,

                                paddingVertical: 5,
                                paddingHorizontal: 10,

                                borderRadius: 20,
                            }}
                        >

                            <Ionicons
                                name={
                                    categoryStyles[
                                        item.category
                                    ]?.icon
                                }

                                size={14}

                                color={
                                    categoryStyles[
                                        item.category
                                    ]?.color
                                }
                            />

                            <Text
                                style={{
                                    color:
                                        categoryStyles[
                                            item.category
                                        ]?.color,

                                    fontSize: 12,

                                    fontWeight: "700",

                                    marginLeft: 5,
                                }}
                            >

                                {item.category}

                            </Text>

                        </View>

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

                                        justifyContent:
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

                                        justifyContent:
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
                                flexDirection: "row",
                                alignItems: "center",
                                marginTop: 10,
                            }}
                        >

                            <View
                                style={{
                                    width: 10,
                                    height: 10,
                                    borderRadius: 5,

                                    backgroundColor:
                                        item.priority === "High"
                                            ? "#F44336"
                                            : item.priority === "Medium"
                                                ? "#FF9800"
                                                : "#4CAF50",
                                }}
                            />

                            <Text
                                style={{
                                    marginLeft: 6,
                                    fontSize: 13,
                                    fontWeight: "600",
                                    color: "#555",
                                }}
                            >

                                {item.priority}

                            </Text>

                        </View>

                        <View
                            style={{
                                flexDirection:
                                    "row",

                                alignItems:
                                    "center",

                                marginTop: 10,
                            }}
                        >

                            <Ionicons
                                name="calendar-outline"

                                size={14}

                                color="#555"
                            />

                            <Text
                                style={{
                                    marginLeft: 5,
                                    color: "#555",
                                    fontSize: 13,
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
                            textAlign: "center",
                            marginTop: 80,
                            color: "#555",
                            fontSize: 16,
                        }}
                    >

                        No tasks found

                    </Text>

                }

            />

            {/* Floating Button */}

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
}