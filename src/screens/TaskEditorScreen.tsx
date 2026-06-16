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

import {
    useTheme,
} from "../context/ThemeContext";

export default function TaskEditorScreen() {

    const navigation =
        useNavigation<any>();

    const route =
        useRoute<any>();

    const {
        colors,
    } = useTheme();

    const editingTask =
        route.params?.task;

    const [
        title,
        setTitle,
    ] =
        useState("");

    const [
        category,
        setCategory,
    ] =
        useState("");

    const [
        priority,
        setPriority,
    ] =
        useState("Medium");

    const [
        categories,
        setCategories,
    ] = useState<Category[]>([]);

    useEffect(() => {

        if (editingTask) {

            setTitle(
                editingTask.title
            );

            setCategory(
                editingTask.category
                || ""
            );

            setPriority(
                editingTask.priority
                || "Medium"
            );
        }

        async function fetchCategories() {
            const cats = await getCategories();
            setCategories(cats);
        }
        fetchCategories();

    }, []);

    async function saveTask() {

        if (
            !title.trim()
        )
            return;

        const tasks =
            await getTasks();

        let updatedTasks =
            [];

        if (editingTask) {

            updatedTasks =
                tasks.map(task =>

                    task.id ===
                        editingTask.id

                        ? {
                            ...task,

                            title,

                            category,

                            priority,
                        }

                        : task
                );

        } else {

            const newTask = {

                id:
                    Date.now()
                        .toString(),

                title,

                completed:
                    false,

                category,

                priority,

                createdAt:
                    new Date()
                        .toISOString(),
            };

            updatedTasks = [
                newTask,
                ...tasks,
            ];
        }

        await saveTasks(
            updatedTasks
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
                        editingTask
                            ? "Edit Task"
                            : "Create Task"
                    }
                </Text>

            </View>

            <TextInput

                placeholder="Enter task..."

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
                    color: colors.text,
                }}
            >

                Select Category

            </Text>

            <View
                style={{
                    flexDirection: "row",
                    flexWrap: "wrap",
                    gap: 10,
                    marginBottom: 20,
                }}
            >

                {categories.map(item => (

                    <TouchableOpacity

                        key={item.id}

                        onPress={() =>
                            setCategory(item.name)
                        }

                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            paddingVertical: 10,
                            paddingHorizontal: 16,

                            borderRadius: 20,

                            backgroundColor:
                                category === item.name
                                    ? item.color
                                    : colors.card,

                            borderWidth: 1,

                            borderColor:
                                category === item.name
                                    ? item.color
                                    : colors.border,
                        }}
                    >

                        <Ionicons 
                            name={item.icon as any} 
                            size={16} 
                            color={category === item.name ? "#fff" : item.color} 
                            style={{ marginRight: 6 }} 
                        />

                        <Text
                            style={{
                                color:
                                    category === item.name
                                        ? "#fff"
                                        : colors.text,

                                fontWeight: "600",
                            }}
                        >

                            {item.name}

                        </Text>

                    </TouchableOpacity>

                ))}

            </View>

            <Text
                style={{
                    fontSize: 16,
                    fontWeight: "600",
                    marginBottom: 10,
                    color: colors.text,
                }}
            >

                Priority

            </Text>

            <View
                style={{
                    flexDirection: "row",
                    gap: 10,
                    marginBottom: 20,
                }}
            >

                {[
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

                    <TouchableOpacity

                        key={item.label}

                        onPress={() =>
                            setPriority(
                                item.label
                            )
                        }

                        style={{
                            flex: 1,

                            backgroundColor:
                                priority === item.label
                                    ? item.color
                                    : colors.card,

                            paddingVertical: 10,

                            borderRadius: 10,

                            alignItems: "center",

                            borderWidth: 1,

                            borderColor:
                                colors.border,
                        }}
                    >

                        <Text
                            style={{
                                color:
                                    priority === item.label
                                        ? "#fff"
                                        : colors.text,

                                fontWeight: "600",
                            }}
                        >

                            {item.label}

                        </Text>

                    </TouchableOpacity>

                ))}

            </View>

            <TouchableOpacity

                onPress={
                    saveTask
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
                            editingTask
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