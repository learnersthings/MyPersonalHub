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
    globalStyles,
} from "../theme/styles";

import DateTimePicker
    from
    "@react-native-community/datetimepicker";

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
        habitMode,
        setHabitMode,
    ] =
        useState(false);

    const [
        category,
        setCategory,
    ] =
        useState("Personal");

    const [
        priority,
        setPriority,
    ] =
        useState("Medium");

    const [
        dueDate,
        setDueDate,
    ] =
        useState(
            new Date()
        );

    const [
        showDatePicker,
        setShowDatePicker,
    ] =
        useState(false);

    useEffect(() => {

        if (editingTask) {

            setTitle(
                editingTask.title
            );

            setHabitMode(
                editingTask.isHabit
            );

            setCategory(
                editingTask.category
                || "Personal"
            );

            setPriority(
                editingTask.priority
                || "Medium"
            );

            if (
                editingTask.dueDate
            ) {

                setDueDate(
                    new Date(
                        editingTask.dueDate
                    )
                );
            }
        }

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

                            isHabit:
                                habitMode,

                            taskMode:
                                !habitMode,

                            category,

                            priority,

                            dueDate:
                                dueDate.toISOString(),
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

                isHabit:
                    habitMode,

                taskMode:
                    !habitMode,

                category,

                priority,

                dueDate:
                    dueDate
                        .toISOString(),

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
                            ? "Edit Task or Habit"
                            : "Create Task or Habit"
                    }
                </Text>

            </View>

            <TextInput

                placeholder="Enter task or habit..."

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

                Mode

            </Text>

            <View
                style={{
                    flexDirection: "row",
                    backgroundColor: colors.card,
                    borderRadius: 14,
                    padding: 4,
                    marginBottom: 20,
                    borderWidth: 1,
                    borderColor: colors.border,
                }}
            >

                <TouchableOpacity

                    onPress={() =>
                        setHabitMode(false)
                    }

                    style={{
                        flex: 1,

                        backgroundColor:
                            !habitMode
                                ? "#2196F3"
                                : "transparent",

                        paddingVertical: 12,

                        borderRadius: 10,

                        alignItems: "center",

                        flexDirection: "row",

                        justifyContent: "center",

                        gap: 6,
                    }}
                >

                    <Ionicons
                        name="clipboard"
                        size={18}
                        color={
                            !habitMode
                                ? "#fff"
                                : colors.text
                        }
                    />

                    <Text
                        style={{
                            color:
                                !habitMode
                                    ? "#fff"
                                    : colors.text,

                            fontWeight: "700",
                        }}
                    >

                        Task

                    </Text>

                </TouchableOpacity>

                <TouchableOpacity

                    onPress={() =>
                        setHabitMode(true)
                    }

                    style={{
                        flex: 1,

                        backgroundColor:
                            habitMode
                                ? "#FF9800"
                                : "transparent",

                        paddingVertical: 12,

                        borderRadius: 10,

                        alignItems: "center",

                        flexDirection: "row",

                        justifyContent: "center",

                        gap: 6,
                    }}
                >

                    <Ionicons
                        name="flame"
                        size={18}
                        color={
                            habitMode
                                ? "#fff"
                                : colors.text
                        }
                    />

                    <Text
                        style={{
                            color:
                                habitMode
                                    ? "#fff"
                                    : colors.text,

                            fontWeight: "700",
                        }}
                    >

                        Habit

                    </Text>

                </TouchableOpacity>

            </View>

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

                {[
                    "Personal",
                    "Study",
                    "Work",
                    "Fitness",
                    "Shopping",
                    "Travel",
                    "Other"
                ].map(item => (

                    <TouchableOpacity

                        key={item}

                        onPress={() =>
                            setCategory(item)
                        }

                        style={{
                            paddingVertical: 10,
                            paddingHorizontal: 16,

                            borderRadius: 20,

                            backgroundColor:
                                category === item
                                    ? colors.primary
                                    : colors.card,

                            borderWidth: 1,

                            borderColor:
                                colors.border,
                        }}
                    >

                        <Text
                            style={{
                                color:
                                    category === item
                                        ? "#fff"
                                        : colors.text,

                                fontWeight: "600",
                            }}
                        >

                            {item}

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

            <Text
                style={{
                    fontSize: 16,
                    fontWeight: "600",
                    marginBottom: 10,
                    color: colors.text,
                }}
            >

                Due Date

            </Text>

            <TouchableOpacity

                onPress={() =>
                    setShowDatePicker(
                        true
                    )
                }

                style={{
                    backgroundColor:
                        colors.card,

                    borderWidth: 1,

                    borderColor:
                        colors.border,

                    borderRadius: 12,

                    padding: 14,

                    marginBottom: 24,

                    flexDirection: "row",

                    alignItems: "center",

                    justifyContent: "space-between",
                }}
            >

                <Text
                    style={{
                        fontSize: 15,
                        color: colors.text,
                    }}
                >

                    {
                        dueDate
                            .toLocaleDateString()
                    }

                </Text>

                <Ionicons
                    name="calendar-outline"
                    size={20}
                    color={colors.subText}
                />

            </TouchableOpacity>

            {
                showDatePicker && (

                    <DateTimePicker

                        value={dueDate}

                        mode="date"

                        display="default"

                        onChange={(
                            event,
                            selectedDate
                        ) => {

                            setShowDatePicker(
                                false
                            );

                            if (
                                selectedDate
                            ) {

                                setDueDate(
                                    selectedDate
                                );
                            }
                        }}
                    />
                )
            }

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