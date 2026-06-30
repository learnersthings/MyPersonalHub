import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    Keyboard,
    KeyboardEvent
} from "react-native";

import {
    useState,
    useEffect,
    useRef
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
import { Subtask } from "../types/Task";

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

    const [
        subtasks,
        setSubtasks,
    ] = useState<Subtask[]>([]);

    const [
        newSubtaskTitle,
        setNewSubtaskTitle,
    ] = useState("");

    const [
        titleError,
        setTitleError,
    ] = useState(false);

    const scrollViewRef = useRef<ScrollView>(null);

    const [keyboardHeight, setKeyboardHeight] = useState(0);

    useEffect(() => {
        const showSubscription = Keyboard.addListener(
            Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow",
            (e: KeyboardEvent) => setKeyboardHeight(e.endCoordinates.height)
        );
        const hideSubscription = Keyboard.addListener(
            Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide",
            () => setKeyboardHeight(0)
        );
        return () => {
            showSubscription.remove();
            hideSubscription.remove();
        };
    }, []);

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

            setSubtasks(
                editingTask.subtasks || []
            );
        }

        async function fetchCategories() {
            const cats = await getCategories();
            setCategories(cats);
        }
        fetchCategories();

    }, []);

    function addSubtask() {
        if (!newSubtaskTitle.trim()) return;
        setSubtasks([...subtasks, { id: Date.now().toString(), title: newSubtaskTitle.trim(), completed: false }]);
        setNewSubtaskTitle("");
    }

    function toggleSubtask(id: string) {
        setSubtasks(subtasks.map(s => s.id === id ? { ...s, completed: !s.completed } : s));
    }

    function deleteSubtask(id: string) {
        setSubtasks(subtasks.filter(s => s.id !== id));
    }

    async function saveTask() {

        if (
            !title.trim()
        ) {
            setTitleError(true);
            return;
        }

        setTitleError(false);

        const tasks =
            await getTasks();

        let updatedTasks =
            [];

        const hasSubtasks = subtasks.length > 0;
        const allCompleted = hasSubtasks && subtasks.every(s => s.completed);

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

                            subtasks,

                            completed: hasSubtasks ? allCompleted : task.completed,
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
                    hasSubtasks ? allCompleted : false,

                category,

                priority,

                subtasks,

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
        <View style={{ flex: 1, backgroundColor: colors.background }}>
            <ScrollView
                ref={scrollViewRef}
                onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
                contentContainerStyle={{
                    paddingBottom: keyboardHeight > 0 ? keyboardHeight - 20 : 0
                }}
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

                    onChangeText={(text) => {
                        setTitle(text);
                        if (titleError) setTitleError(false);
                    }}

                    style={[
                        globalStyles.input,
                        {
                            backgroundColor:
                                colors.input,

                            color:
                                colors.text,

                            borderColor:
                                titleError ? "#F44336" : colors.border,
                        },
                    ]}
                />

                {titleError && (
                    <Text style={{ color: "#F44336", fontSize: 14, marginTop: -10, marginBottom: 15, marginLeft: 4 }}>
                        Task title is required
                    </Text>
                )}

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
                    Subtasks
                </Text>

                <View style={{ marginBottom: 20 }}>
                    {subtasks.map((subtask) => (
                        <View key={subtask.id} style={{ flexDirection: "row", alignItems: "center", marginBottom: 8, backgroundColor: colors.card, padding: 12, borderRadius: 10, borderWidth: 1, borderColor: colors.border }}>
                            <TouchableOpacity onPress={() => toggleSubtask(subtask.id)} style={{ marginRight: 12 }}>
                                <Ionicons name={subtask.completed ? "checkmark-circle" : "ellipse-outline"} size={24} color={subtask.completed ? "#4CAF50" : colors.subText} />
                            </TouchableOpacity>
                            <Text style={{ flex: 1, color: subtask.completed ? colors.subText : colors.text, textDecorationLine: subtask.completed ? "line-through" : "none", fontSize: 16 }}>{subtask.title}</Text>
                            <TouchableOpacity onPress={() => deleteSubtask(subtask.id)} style={{ padding: 4 }}>
                                <Ionicons name="trash-outline" size={20} color="#F44336" />
                            </TouchableOpacity>
                        </View>
                    ))}

                    <View style={{ flexDirection: "row", alignItems: "center", marginTop: 8 }}>
                        <TextInput
                            placeholder="Add subtask..."
                            placeholderTextColor={colors.subText}
                            value={newSubtaskTitle}
                            onChangeText={setNewSubtaskTitle}
                            onSubmitEditing={addSubtask}
                            style={{ flex: 1, backgroundColor: colors.input, color: colors.text, paddingHorizontal: 16, paddingVertical: 12, borderRadius: 10, borderWidth: 1, borderColor: colors.border, marginRight: 10 }}
                        />
                        <TouchableOpacity onPress={addSubtask} style={{ backgroundColor: colors.primary, width: 48, height: 48, borderRadius: 24, justifyContent: "center", alignItems: "center" }}>
                            <Ionicons name="add" size={24} color="#fff" />
                        </TouchableOpacity>
                    </View>
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
        </View>

    );
}