import {
    View,
    Text,
    TouchableOpacity,
    Switch,
    ScrollView,
} from "react-native";

import {
    useEffect,
    useState,
} from "react";

import AsyncStorage
    from "@react-native-async-storage/async-storage";

import {
    Ionicons,
} from "@expo/vector-icons";

import {
    globalStyles,
} from "../theme/styles";

import {
    useTheme,
} from "../context/ThemeContext";

export default function SettingsScreen() {

    const {
        darkMode,
        toggleTheme,
    } = useTheme();

    const [
        autoSave,
        setAutoSave,
    ] = useState(true);

    const [
        showCompleted,
        setShowCompleted,
    ] = useState(true);

    useEffect(() => {
        loadSettings();
    }, []);

    async function loadSettings() {

        const dark =
            await AsyncStorage.getItem(
                "darkMode"
            );

        const save =
            await AsyncStorage.getItem(
                "autoSave"
            );

        const completed =
            await AsyncStorage.getItem(
                "showCompleted"
            );

        if (save !== null)
            setAutoSave(
                JSON.parse(save)
            );

        if (completed !== null)
            setShowCompleted(
                JSON.parse(completed)
            );
    }

    async function toggleDarkMode(
        value: boolean
    ) {

        await AsyncStorage.setItem(
            "darkMode",
            JSON.stringify(value)
        );
    }

    async function toggleAutoSave(
        value: boolean
    ) {

        setAutoSave(value);

        await AsyncStorage.setItem(
            "autoSave",
            JSON.stringify(value)
        );
    }

    async function toggleCompleted(
        value: boolean
    ) {

        setShowCompleted(value);

        await AsyncStorage.setItem(
            "showCompleted",
            JSON.stringify(value)
        );
    }

    function SettingRow({
        icon,
        title,
        value,
        onValueChange,
    }: any) {

        return (

            <View
                style={{
                    flexDirection: "row",

                    alignItems: "center",

                    justifyContent:
                        "space-between",

                    paddingVertical: 16,

                    borderBottomWidth: 1,

                    borderBottomColor:
                        "#ECECEC",
                }}
            >

                <View
                    style={{
                        flexDirection: "row",

                        alignItems: "center",
                    }}
                >

                    <Ionicons
                        name={icon}
                        size={22}
                        color="#2196F3"
                    />

                    <Text
                        style={{
                            marginLeft: 12,

                            fontSize: 16,

                            fontWeight: "500",
                        }}
                    >

                        {title}

                    </Text>

                </View>

                <Switch
                    value={value}
                    onValueChange={
                        onValueChange
                    }
                />

            </View>
        );
    }

    return (

        <ScrollView
            style={
                globalStyles.screen
            }

            showsVerticalScrollIndicator={
                false
            }
        >

            <Text
                style={{
                    fontSize: 26,

                    fontWeight: "700",

                    marginBottom: 20,
                }}
            >

                ⚙️ Settings

            </Text>

            {/* Appearance */}

            <View
                style={{
                    backgroundColor: "#fff",

                    borderRadius: 16,

                    paddingHorizontal: 16,

                    marginBottom: 18,
                }}
            >

                <Text
                    style={{
                        fontSize: 18,

                        fontWeight: "700",

                        marginTop: 16,

                        marginBottom: 8,
                    }}
                >

                    Appearance

                </Text>

                <SettingRow
                    icon="moon-outline"
                    title="Dark Mode"
                    value={darkMode}
                    onValueChange={
                        toggleTheme
                    }
                />

            </View>

            {/* Notes */}

            <View
                style={{
                    backgroundColor: "#fff",

                    borderRadius: 16,

                    paddingHorizontal: 16,

                    marginBottom: 18,
                }}
            >

                <Text
                    style={{
                        fontSize: 18,

                        fontWeight: "700",

                        marginTop: 16,

                        marginBottom: 8,
                    }}
                >

                    Notes

                </Text>

                <SettingRow
                    icon="save-outline"
                    title="Auto Save"
                    value={autoSave}
                    onValueChange={
                        toggleAutoSave
                    }
                />

            </View>

            {/* Tasks */}

            <View
                style={{
                    backgroundColor: "#fff",

                    borderRadius: 16,

                    paddingHorizontal: 16,

                    marginBottom: 18,
                }}
            >

                <Text
                    style={{
                        fontSize: 18,

                        fontWeight: "700",

                        marginTop: 16,

                        marginBottom: 8,
                    }}
                >

                    Tasks

                </Text>

                <SettingRow
                    icon="checkmark-done-outline"
                    title="Show Completed Tasks"
                    value={showCompleted}
                    onValueChange={
                        toggleCompleted
                    }
                />

            </View>

            {/* About */}

            <View
                style={{
                    backgroundColor: "#fff",

                    borderRadius: 16,

                    padding: 18,

                    marginBottom: 40,
                }}
            >

                <Text
                    style={{
                        fontSize: 18,

                        fontWeight: "700",

                        marginBottom: 14,
                    }}
                >

                    About

                </Text>

                <Text
                    style={{
                        color: "#555",

                        marginBottom: 8,
                    }}
                >

                    Personal Productivity App

                </Text>

                <Text
                    style={{
                        color: "#555",
                    }}
                >

                    Version 1.0.0

                </Text>

            </View>

        </ScrollView>
    );
}