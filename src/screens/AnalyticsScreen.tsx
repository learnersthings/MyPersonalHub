import {
    View,
    Text,
    ScrollView,
} from "react-native";

import {
    useState,
    useCallback,
} from "react";

import {
    useFocusEffect,
} from "@react-navigation/native";

import {
    Ionicons,
} from "@expo/vector-icons";

import {
    getTasks,
} from "../services/tasksStorage";

import {
    getCategories,
} from "../services/categoryStorage";

import { Category } from "../types/Category";

import {
    globalStyles,
} from "../theme/styles";

import {
    useTheme,
} from "../context/ThemeContext";

export default function AnalyticsScreen() {

    const {
        colors,
    } = useTheme();

    const [
        tasks,
        setTasks,
    ] = useState<any[]>([]);

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

        setTasks(data);
        setCategories(cats);
    }

    const totalTasks =
        tasks.length;

    const completedTasks =
        tasks.filter(
            task =>
                task.completed
        ).length;

    const pendingTasks =
        totalTasks -
        completedTasks;

    const progress =
        totalTasks > 0

            ? Math.round(
                (
                    completedTasks
                    /
                    totalTasks
                ) * 100
            )

            : 0;


    function getCategoryCount(
        category: string
    ) {

        return tasks.filter(
            task =>
                task.category
                === category
        ).length;
    }

    function getPriorityCount(
        priority: string
    ) {

        return tasks.filter(
            task =>
                task.priority
                === priority
        ).length;
    }

    function StatCard({
        title,
        value,
        icon,
        color,
    }: any) {

        return (

            <View
                style={{
                    flex: 1,

                    backgroundColor:
                        colors.card,

                    padding: 18,

                    borderRadius: 18,

                    margin: 6,
                }}
            >

                <View
                    style={{
                        width: 50,
                        height: 50,

                        borderRadius: 25,

                        backgroundColor:
                            `${color}20`,

                        alignItems:
                            "center",

                        justifyContent:
                            "center",

                        marginBottom: 14,
                    }}
                >

                    <Ionicons
                        name={icon}
                        size={24}
                        color={color}
                    />

                </View>

                <Text
                    style={{
                        color:
                            colors.subText,

                        fontSize: 14,
                    }}
                >

                    {title}

                </Text>

                <Text
                    style={{
                        color:
                            colors.text,

                        fontSize: 28,

                        fontWeight: "700",

                        marginTop: 6,
                    }}
                >

                    {value}

                </Text>

            </View>
        );
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

            <Text
                style={{
                    fontSize: 28,

                    fontWeight: "700",

                    marginBottom: 20,

                    color:
                        colors.text,
                }}
            >

                📊 Analytics

            </Text>

            {/* Progress Card */}

            <View
                style={{
                    backgroundColor:
                        colors.primary,

                    borderRadius: 22,

                    padding: 22,

                    marginBottom: 22,
                }}
            >

                <Text
                    style={{
                        color: "#fff",

                        fontSize: 18,

                        fontWeight: "600",
                    }}
                >

                    Overall Progress

                </Text>

                <Text
                    style={{
                        color: "#fff",

                        fontSize: 42,

                        fontWeight: "700",

                        marginTop: 10,
                    }}
                >

                    {progress}%

                </Text>

                <View
                    style={{
                        height: 10,

                        backgroundColor:
                            "rgba(255,255,255,0.25)",

                        borderRadius: 10,

                        marginTop: 18,

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

            {/* Stats */}

            <View
                style={{
                    flexDirection: "row",
                }}
            >

                <StatCard
                    title="All"
                    value={totalTasks}
                    icon="apps"
                    color="#2196F3"
                />

                <StatCard
                    title="Completed"
                    value={completedTasks}
                    icon="checkmark-done"
                    color="#4CAF50"
                />

                <StatCard
                    title="Pending"
                    value={pendingTasks}
                    icon="time"
                    color="#F44336"
                />

            </View>

            {/* Priority */}

            <View
                style={{
                    backgroundColor:
                        colors.card,

                    borderRadius: 18,

                    padding: 18,

                    marginTop: 18,

                    marginBottom: 40,
                }}
            >

                <Text
                    style={{
                        color:
                            colors.text,

                        fontSize: 20,

                        fontWeight: "700",

                        marginBottom: 18,
                    }}
                >

                    Priorities

                </Text>

                {
                    [
                        {
                            label: "High",
                            color: "#F44336",
                        },

                        {
                            label: "Medium",
                            color: "#FF9800",
                        },

                        {
                            label: "Low",
                            color: "#4CAF50",
                        },
                    ].map(item => (

                        <View
                            key={item.label}

                            style={{
                                flexDirection:
                                    "row",

                                justifyContent:
                                    "space-between",

                                marginBottom: 14,
                            }}
                        >

                            <View
                                style={{
                                    flexDirection:
                                        "row",

                                    alignItems:
                                        "center",
                                }}
                            >

                                <View
                                    style={{
                                        width: 10,
                                        height: 10,

                                        borderRadius: 5,

                                        backgroundColor:
                                            item.color,

                                        marginRight: 10,
                                    }}
                                />

                                <Text
                                    style={{
                                        color:
                                            colors.text,
                                    }}
                                >

                                    {item.label}

                                </Text>

                            </View>

                            <Text
                                style={{
                                    color:
                                        item.color,

                                    fontWeight:
                                        "700",
                                }}
                            >

                                {
                                    getPriorityCount(
                                        item.label
                                    )
                                }

                            </Text>

                        </View>
                    ))
                }

            </View>

        </ScrollView>
    );
}