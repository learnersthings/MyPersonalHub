import {
    View,
    Text,
    Switch,
    ScrollView,
    TouchableOpacity,
    Alert,
    TextInput,
    Image,
    Modal,
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

import {
    useNavigation,
} from "@react-navigation/native";

import { createBackup, restoreBackup } from "../services/backupService";


export default function SettingsScreen() {

    const navigation =
        useNavigation<any>();

    const {
        darkMode,
        toggleTheme,
        loadTheme,
        colors,
    } = useTheme();

    const [
        showCompleted,
        setShowCompleted,
    ] = useState(true);

    useEffect(() => {
        loadSettings();
    }, []);

    async function loadSettings() {

        const completed =
            await AsyncStorage.getItem(
                "showCompleted"
            );

        if (completed !== null)

            setShowCompleted(
                JSON.parse(completed)
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

    const handleBackup = async () => {
        const success = await createBackup();
        if (success) {
            Alert.alert("Success", "Backup saved successfully.");
        } else {
            Alert.alert("Error", "Failed to save backup or cancelled.");
        }
    };

    const handleRestore = async () => {
        const success = await restoreBackup();
        if (success) {
            Alert.alert("Success", "Backup restored successfully. Please fully restart the app to ensure all data is loaded properly.");
            loadSettings();
            await loadTheme();
        } else {
            Alert.alert("Error", "Failed to restore backup or cancelled.");
        }
    };


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
                    color: colors.text,
                }}
            >
                ⚙️ Settings
            </Text>

            {/* Profile */}
            <View
                style={{
                    backgroundColor: colors.card,
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
                        color: colors.text,
                    }}
                >
                    Profile
                </Text>
                
                <TouchableOpacity
                    onPress={() => navigation.navigate("UserProfile")}
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        paddingVertical: 16,
                        borderBottomWidth: 1,
                        borderBottomColor: colors.border,
                    }}
                >
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <Ionicons name="person-circle-outline" size={24} color={colors.primary} />
                        <Text style={{ marginLeft: 12, fontSize: 16, fontWeight: "500", color: colors.text }}>
                            User Profile
                        </Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color={colors.subText} />
                </TouchableOpacity>
            </View>

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

                    Categories

                </Text>

                <TouchableOpacity
                    onPress={() => navigation.navigate("ManageCategories")}
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        paddingVertical: 16,
                        borderBottomWidth: 1,
                        borderBottomColor: colors.border,
                    }}
                >
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <Ionicons name="pricetags-outline" size={22} color={colors.primary} />
                        <Text style={{ marginLeft: 12, fontSize: 16, fontWeight: "500", color: colors.text }}>
                            Manage Categories
                        </Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color={colors.subText} />
                </TouchableOpacity>

            </View>

            {/* Data Management */}

            <View
                style={{
                    backgroundColor: colors.card,
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
                        color: colors.text,
                    }}
                >
                    Data Management
                </Text>

                <TouchableOpacity
                    onPress={handleBackup}
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        paddingVertical: 16,
                        borderBottomWidth: 1,
                        borderBottomColor: colors.border,
                    }}
                >
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <Ionicons name="save-outline" size={22} color={colors.primary} />
                        <Text style={{ marginLeft: 12, fontSize: 16, fontWeight: "500", color: colors.text }}>
                            Backup Data
                        </Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color={colors.subText} />
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={handleRestore}
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        paddingVertical: 16,
                        borderBottomWidth: 1,
                        borderBottomColor: colors.border,
                    }}
                >
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <Ionicons name="cloud-download-outline" size={22} color={colors.primary} />
                        <Text style={{ marginLeft: 12, fontSize: 16, fontWeight: "500", color: colors.text }}>
                            Restore Data
                        </Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color={colors.subText} />
                </TouchableOpacity>
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