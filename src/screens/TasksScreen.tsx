import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    TextInput,
    Alert,
} from "react-native";

import {
    useState,
} from "react";

import { Ionicons } from "@expo/vector-icons";

import {
    useNavigation,
    useFocusEffect,
} from "@react-navigation/native";

import { useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import {
    getTasks,
    saveTasks,
} from "../services/tasksStorage";

import {
    getCategories,
} from "../services/categoryStorage";

import { Category } from "../types/Category";

import {
    globalStyles,
} from "../theme/styles";

import Swipeable
    from "react-native-gesture-handler/Swipeable";

import {
    useTheme,
} from "../context/ThemeContext";


export default function TasksScreen() {

    const navigation =
        useNavigation<any>();

    const { colors } =
        useTheme();

    const [
        tasks,
        setTasks,
    ] = useState<any[]>([]);

    const [
        showCompleted,
        setShowCompleted,
    ] = useState(true);

    const [
        filter,
        setFilter,
    ] = useState("All");

    const [
        searchText,
        setSearchText,
    ] = useState("");

    const [
        categories,
        setCategories,
    ] = useState<Category[]>([]);

    useFocusEffect(
        useCallback(() => {
            loadTasks();
        }, [])
    );

    async function loadTasks() {

        const data =
            await getTasks();

        const cats = 
            await getCategories();
            
        setCategories(cats);

        const completedSetting = await AsyncStorage.getItem("showCompleted");
        if (completedSetting !== null) {
            setShowCompleted(JSON.parse(completedSetting));
        }

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

        Alert.alert(
            "Delete",
            "Are you sure you want to delete this?",
            [
                {
                    text: "Cancel",
                    style: "cancel",
                },
                {
                    text: "Delete",
                    style: "destructive",

                    onPress: async () => {

                        const updated =
                            tasks.filter(
                                task =>
                                    task.id !== id
                            );

                        setTasks(updated);

                        await saveTasks(
                            updated
                        );
                    },
                },
            ]
        );
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

    const today =
        new Date();

    today.setHours(
        0,
        0,
        0,
        0
    );

    const weekLater =
        new Date();

    weekLater.setDate(
        today.getDate() + 7
    );

    const filteredTasks =
        tasks.filter(task => {

            const matchesSearch =

                task.title
                    .toLowerCase()
                    .includes(
                        searchText.toLowerCase()
                    )

                ||

                task.category
                    .toLowerCase()
                    .includes(
                        searchText.toLowerCase()
                    )

                ||

                task.priority
                    .toLowerCase()
                    .includes(
                        searchText.toLowerCase()
                    );

            if (!matchesSearch)
                return false;

            if (!showCompleted && filter !== "Completed" && task.completed) {
                return false;
            }

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
                "Today"
            )

                return (
                    new Date(
                        task.dueDate
                    )
                        .toDateString()
                    ===
                    today.toDateString()
                );

            if (
                filter ===
                "Upcoming"
            )

                return (
                    new Date(
                        task.dueDate
                    ) > today
                );

            if (
                filter ===
                "Overdue"
            )

                return (
                    !task.completed
                    &&
                    new Date(
                        task.dueDate
                    ) < today
                );

            if (
                filter ===
                "This Week"
            )

                return (

                    new Date(
                        task.dueDate
                    ) >= today

                    &&

                    new Date(
                        task.dueDate
                    ) <= weekLater
                );

            if (
                task.category ===
                filter
            )
                return true;

            return filter === "All";
        });

    return (

        <View
            style={[
                globalStyles.screen,
                {
                    backgroundColor:
                        colors.background,
                },
            ]}
        >

            <Text
                style={{
                    fontSize: 24,
                    fontWeight: "700",
                    marginBottom: 15,
                    color: colors.text,
                }}
            >

                📝 Tasks

            </Text>

            {/* Search */}

            <View
                style={{
                    flexDirection: "row",
                    alignItems: "center",

                    backgroundColor:
                        colors.card,

                    borderWidth: 1,

                    borderColor:
                        colors.border,

                    borderRadius: 12,

                    paddingHorizontal: 12,

                    marginBottom: 15,
                }}
            >

                <Ionicons
                    name="search-outline"
                    size={20}
                    color={colors.subText}
                />

                <TextInput

                    placeholder="Search tasks..."

                    placeholderTextColor={
                        colors.subText
                    }

                    value={searchText}

                    onChangeText={
                        setSearchText
                    }

                    style={{
                        flex: 1,

                        paddingVertical: 12,

                        paddingHorizontal: 10,

                        fontSize: 15,

                        color: colors.text,
                    }}
                />

                {
                    searchText.length > 0 && (

                        <TouchableOpacity
                            onPress={() =>
                                setSearchText("")
                            }
                        >

                            <Ionicons
                                name="close-circle"
                                size={20}
                                color={colors.subText}
                            />

                        </TouchableOpacity>
                    )
                }

            </View>

            {/* Dashboard */}

            <View
                style={{
                    backgroundColor:
                        colors.primary,

                    padding: 16,

                    borderRadius: 14,

                    marginBottom: 18,
                }}
            >

                <View
                    style={{
                        flexDirection: "row",

                        justifyContent:
                            "space-between",

                        alignItems: "center",
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
                        "Completed",
                        "Pending",
                        ...categories.map(c => c.name),
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
                                            ? colors.primary
                                            : colors.card,

                                    paddingHorizontal: 14,

                                    height: 32,

                                    borderRadius: 16,

                                    alignItems: "center",

                                    justifyContent: "center",

                                    flexDirection: "row",

                                    gap: 6,

                                    borderWidth: 1,

                                    borderColor:
                                        colors.border,
                                }}
                            >

                                <Text
                                    style={{
                                        color:
                                            filter === item
                                                ? "#fff"
                                                : colors.text,

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
                                                : colors.border,

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
                                                    : colors.text,

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

            {/* Tasks List */}

            <FlatList

                data={filteredTasks}

                keyExtractor={
                    item => item.id
                }

                renderItem={({ item }) => (

                    <Swipeable

                        renderLeftActions={() => (

                            <TouchableOpacity
                                onPress={() =>
                                    toggleTask(
                                        item.id
                                    )
                                }

                                style={{
                                    backgroundColor:
                                        item.completed
                                            ? "#2196F3"
                                            : "#4CAF50",

                                    justifyContent:
                                        "center",

                                    alignItems:
                                        "center",

                                    width: 90,

                                    borderRadius: 14,

                                    marginBottom: 14,
                                }}
                            >

                                <Ionicons
                                    name={
                                        item.completed
                                            ? "refresh"
                                            : "checkmark"
                                    }

                                    size={26}
                                    color="#fff"
                                />

                            </TouchableOpacity>
                        )}

                        renderRightActions={() => (

                            <TouchableOpacity
                                onPress={() =>
                                    deleteTask(
                                        item.id
                                    )
                                }

                                style={{
                                    backgroundColor:
                                        "#F44336",

                                    justifyContent:
                                        "center",

                                    alignItems:
                                        "center",

                                    width: 90,

                                    borderRadius: 14,

                                    marginBottom: 14,
                                }}
                            >

                                <Ionicons
                                    name="trash"
                                    size={26}
                                    color="#fff"
                                />

                            </TouchableOpacity>
                        )}
                    >

                        <TouchableOpacity

                            activeOpacity={0.9}

                            onPress={() =>
                                navigation.navigate(
                                    "TaskEditor",
                                    {
                                        task: item,
                                    }
                                )
                            }

                            style={[
                                globalStyles.card,
                                {
                                    backgroundColor:
                                        colors.card,

                                    opacity:
                                        item.completed
                                            ? 0.8
                                            : 1,

                                    borderLeftWidth: 5,

                                    borderLeftColor:
                                        item.completed
                                            ? "#4CAF50"
                                            : new Date() >
                                                new Date(item.dueDate)
                                                ? "#2196F3"
                                                : "#F44336",
                                },
                            ]}
                        >
                            <Text
                                style={{
                                    fontSize: 16,

                                    color:
                                        colors.text,

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

                                {item.title}

                            </Text>

                            {item.category ? (
                                <View
                                    style={{
                                        flexDirection: "row",

                                        alignItems: "center",

                                        alignSelf: "flex-start",

                                        marginTop: 8,

                                        backgroundColor:
                                            `${categories.find(c => c.name === item.category)?.color || "#7F8C8D"}20`,

                                        paddingVertical: 5,

                                        paddingHorizontal: 10,

                                        borderRadius: 20,
                                    }}
                                >

                                    <Ionicons
                                        name={
                                            (categories.find(c => c.name === item.category)?.icon as any)
                                            || "ellipsis-horizontal"
                                        }

                                        size={14}

                                        color={
                                            categories.find(c => c.name === item.category)?.color || "#7F8C8D"
                                        }
                                    />

                                    <Text
                                        style={{
                                            color:
                                                categories.find(c => c.name === item.category)?.color || "#7F8C8D",

                                            fontSize: 12,

                                            fontWeight: "700",

                                            marginLeft: 5,
                                        }}
                                    >

                                        {item.category}

                                    </Text>

                                </View>
                            ) : null}

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
                                        color:
                                            colors.subText,
                                    }}
                                >

                                    {item.priority}

                                </Text>

                            </View>

                            <View
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    marginTop: 8,
                                }}
                            >

                                <Ionicons
                                    name="time-outline"
                                    size={14}
                                    color={
                                        colors.subText
                                    }
                                />

                                <Text
                                    style={{
                                        marginLeft: 5,
                                        fontSize: 13,
                                        color:
                                            colors.subText,
                                    }}
                                >

                                    Due:{" "}

                                    {
                                        new Date(
                                            item.dueDate
                                        ).toLocaleDateString()
                                    }

                                </Text>

                            </View>

                            <View
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    marginTop: 10,
                                }}
                            >

                                <Ionicons
                                    name="calendar-outline"
                                    size={14}
                                    color={
                                        colors.subText
                                    }
                                />

                                <Text
                                    style={{
                                        marginLeft: 5,
                                        color:
                                            colors.subText,

                                        fontSize: 13,
                                    }}
                                >

                                    {
                                        new Date(
                                            item.createdAt
                                        ).toLocaleDateString()
                                    }

                                </Text>

                            </View>

                        </TouchableOpacity>

                    </Swipeable>

                )}

                ListEmptyComponent={

                    <Text
                        style={{
                            textAlign: "center",
                            marginTop: 80,
                            color: colors.subText,
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

                style={[
                    globalStyles.floatingButton,
                    {
                        backgroundColor:
                            colors.primary,
                    },
                ]}
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