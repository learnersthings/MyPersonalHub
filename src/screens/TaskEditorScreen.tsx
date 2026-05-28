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

import DateTimePicker
    from
    "@react-native-community/datetimepicker";

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

            taskMode:
                !habitMode,

            category,

            createdAt:
                new Date()
                    .toISOString(),

            priority,

            dueDate:
                dueDate.toISOString(),
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

                ✍️ Create Task or Habit

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

            <Text
                style={{
                    fontSize: 16,
                    fontWeight: "600",
                    marginBottom: 10,
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
                                    ? "#2196F3"
                                    : "#ddd",
                        }}
                    >

                        <Text
                            style={{
                                color:
                                    category === item
                                        ? "#fff"
                                        : "#333",

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
                }}
            >

                Priority

            </Text>

            <View
                style={{
                    flexDirection: "row",
                    gap: 10,
                    marginBottom: 18,
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
                        color: "#2196F3",
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
                                    : "#E0E0E0",

                            paddingVertical: 10,

                            borderRadius: 10,

                            alignItems: "center",
                        }}
                    >

                        <Text
                            style={{
                                color:
                                    priority === item.label
                                        ? "#fff"
                                        : "#333",

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
                    backgroundColor: "#fff",

                    borderWidth: 1,

                    borderColor: "#ddd",

                    borderRadius: 12,

                    padding: 14,

                    marginBottom: 20,

                    flexDirection: "row",

                    alignItems: "center",

                    justifyContent: "space-between",
                }}
            >

                <Text
                    style={{
                        fontSize: 15,
                        color: "#333",
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
                    color="#555"
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