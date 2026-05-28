import {
    View,
    Text,
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
        colors,
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
                        colors.border,
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
                        color={colors.primary}
                    />

                    <Text
                        style={{
                            marginLeft: 12,

                            fontSize: 16,

                            fontWeight: "500",

                            color:
                                colors.text,
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

                    trackColor={{
                        false: "#777",
                        true: colors.primary,
                    }}

                    thumbColor={
                        value
                            ? "#fff"
                            : "#f4f3f4"
                    }
                />

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
                    fontSize: 26,

                    fontWeight: "700",

                    marginBottom: 20,

                    color:
                        colors.text,
                }}
            >

                ⚙️ Settings

            </Text>

            {/* Appearance */}

            <View
                style={{
                    backgroundColor:
                        colors.card,

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

                        color:
                            colors.text,
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
                    backgroundColor:
                        colors.card,

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

                        color:
                            colors.text,
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
                    backgroundColor:
                        colors.card,

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

                        color:
                            colors.text,
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
                    backgroundColor:
                        colors.card,

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

                        color:
                            colors.text,
                    }}
                >

                    About

                </Text>

                <Text
                    style={{
                        color:
                            colors.subText,

                        marginBottom: 8,
                    }}
                >

                    Personal Productivity App

                </Text>

                <Text
                    style={{
                        color:
                            colors.subText,
                    }}
                >

                    Version 1.0.0

                </Text>

            </View>

        </ScrollView>
    );
}