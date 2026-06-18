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
import { getProfile, saveProfile, UserProfile } from "../services/profileStorage";
import * as ImagePicker from "expo-image-picker";

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

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [avatarBase64, setAvatarBase64] = useState<string | null>(null);
    const [showAvatarModal, setShowAvatarModal] = useState(false);
    const [avatarFilter, setAvatarFilter] = useState('All');

    const defaultAvatars = [
        { category: 'Boys', url: "https://api.dicebear.com/9.x/avataaars/png?seed=Felix" },
        { category: 'Boys', url: "https://api.dicebear.com/9.x/avataaars/png?seed=Leo" },
        { category: 'Boys', url: "https://api.dicebear.com/9.x/avataaars/png?seed=Max" },
        { category: 'Boys', url: "https://api.dicebear.com/9.x/avataaars/png?seed=Jack" },
        { category: 'Boys', url: "https://api.dicebear.com/9.x/avataaars/png?seed=Oliver" },
        { category: 'Boys', url: "https://api.dicebear.com/9.x/avataaars/png?seed=Milo" },
        { category: 'Girls', url: "https://api.dicebear.com/9.x/avataaars/png?seed=Luna" },
        { category: 'Girls', url: "https://api.dicebear.com/9.x/avataaars/png?seed=Bella" },
        { category: 'Girls', url: "https://api.dicebear.com/9.x/avataaars/png?seed=Sophie" },
        { category: 'Girls', url: "https://api.dicebear.com/9.x/avataaars/png?seed=Lily" },
        { category: 'Girls', url: "https://api.dicebear.com/9.x/avataaars/png?seed=Chloe" },
        { category: 'Girls', url: "https://api.dicebear.com/9.x/avataaars/png?seed=Mia" },
        { category: 'Men', url: "https://api.dicebear.com/9.x/avataaars/png?seed=George" },
        { category: 'Men', url: "https://api.dicebear.com/9.x/avataaars/png?seed=Arthur" },
        { category: 'Men', url: "https://api.dicebear.com/9.x/avataaars/png?seed=Thomas" },
        { category: 'Men', url: "https://api.dicebear.com/9.x/avataaars/png?seed=James" },
        { category: 'Men', url: "https://api.dicebear.com/9.x/avataaars/png?seed=John" },
        { category: 'Men', url: "https://api.dicebear.com/9.x/avataaars/png?seed=William" },
        { category: 'Womens', url: "https://api.dicebear.com/9.x/avataaars/png?seed=Mary" },
        { category: 'Womens', url: "https://api.dicebear.com/9.x/avataaars/png?seed=Patricia" },
        { category: 'Womens', url: "https://api.dicebear.com/9.x/avataaars/png?seed=Jennifer" },
        { category: 'Womens', url: "https://api.dicebear.com/9.x/avataaars/png?seed=Linda" },
        { category: 'Womens', url: "https://api.dicebear.com/9.x/avataaars/png?seed=Elizabeth" },
        { category: 'Womens', url: "https://api.dicebear.com/9.x/avataaars/png?seed=Barbara" },
    ];

    const filteredAvatars = avatarFilter === 'All' 
        ? defaultAvatars 
        : defaultAvatars.filter(a => a.category === avatarFilter);

    useEffect(() => {
        loadSettings();
        loadProfileData();
    }, []);

    async function loadProfileData() {
        const profile = await getProfile();
        if (profile) {
            setFirstName(profile.firstName || "");
            setLastName(profile.lastName || "");
            setAvatarBase64(profile.avatarBase64 || null);
        }
    }

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
            await loadProfileData();
        } else {
            Alert.alert("Error", "Failed to restore backup or cancelled.");
        }
    };

    const pickImage = async () => {
        setShowAvatarModal(false);
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.5,
            base64: true,
        });

        if (!result.canceled && result.assets && result.assets[0].base64) {
            setAvatarBase64(`data:image/jpeg;base64,${result.assets[0].base64}`);
        }
    };

    const removeAvatar = () => {
        setAvatarBase64(null);
        setShowAvatarModal(false);
    };

    const selectDefaultAvatar = (url: string) => {
        setAvatarBase64(url);
        setShowAvatarModal(false);
    };

    const handleSaveProfile = async () => {
        const success = await saveProfile({
            firstName,
            lastName,
            avatarBase64
        });
        if (success) {
            Alert.alert("Success", "Profile saved successfully.");
        } else {
            Alert.alert("Error", "Failed to save profile.");
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
                    padding: 16,
                    marginBottom: 18,
                    alignItems: "center",
                }}
            >
                <TouchableOpacity onPress={() => setShowAvatarModal(true)} style={{ marginBottom: 16 }}>
                    {avatarBase64 ? (
                        <Image
                            source={{ uri: avatarBase64 }}
                            style={{ width: 80, height: 80, borderRadius: 40 }}
                        />
                    ) : (
                        <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: colors.border, alignItems: 'center', justifyContent: 'center' }}>
                            <Ionicons name="person" size={40} color={colors.subText} />
                        </View>
                    )}
                    <View style={{ position: 'absolute', bottom: 0, right: 0, backgroundColor: colors.primary, borderRadius: 12, padding: 4 }}>
                        <Ionicons name="camera" size={14} color="#fff" />
                    </View>
                </TouchableOpacity>

                <View style={{ width: '100%', marginBottom: 12 }}>
                    <Text style={{ color: colors.subText, marginBottom: 4, fontSize: 12 }}>First Name</Text>
                    <TextInput
                        value={firstName}
                        onChangeText={setFirstName}
                        placeholder="John"
                        placeholderTextColor={colors.subText}
                        style={{
                            backgroundColor: colors.background,
                            color: colors.text,
                            padding: 12,
                            borderRadius: 8,
                            borderWidth: 1,
                            borderColor: colors.border,
                        }}
                    />
                </View>

                <View style={{ width: '100%', marginBottom: 16 }}>
                    <Text style={{ color: colors.subText, marginBottom: 4, fontSize: 12 }}>Last Name</Text>
                    <TextInput
                        value={lastName}
                        onChangeText={setLastName}
                        placeholder="Doe"
                        placeholderTextColor={colors.subText}
                        style={{
                            backgroundColor: colors.background,
                            color: colors.text,
                            padding: 12,
                            borderRadius: 8,
                            borderWidth: 1,
                            borderColor: colors.border,
                        }}
                    />
                </View>

                <TouchableOpacity
                    onPress={handleSaveProfile}
                    style={{
                        backgroundColor: colors.primary,
                        paddingVertical: 12,
                        paddingHorizontal: 24,
                        borderRadius: 8,
                        width: '100%',
                        alignItems: 'center'
                    }}
                >
                    <Text style={{ color: '#fff', fontWeight: '600', fontSize: 16 }}>Save Profile</Text>
                </TouchableOpacity>
            </View>

            {/* Avatar Selection Modal */}
            <Modal visible={showAvatarModal} transparent={true} animationType="fade">
                <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' }}>
                    <View style={{ backgroundColor: colors.card, padding: 24, borderRadius: 16, width: '85%', maxHeight: '80%' }}>
                        <Text style={{ fontSize: 20, fontWeight: '700', color: colors.text, marginBottom: 20, textAlign: 'center' }}>Profile Picture</Text>
                        
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16, maxHeight: 40 }}>
                            {['All', 'Boys', 'Girls', 'Men', 'Womens'].map((cat) => (
                                <TouchableOpacity 
                                    key={cat} 
                                    onPress={() => setAvatarFilter(cat)}
                                    style={{
                                        paddingHorizontal: 16,
                                        paddingVertical: 8,
                                        borderRadius: 20,
                                        backgroundColor: avatarFilter === cat ? colors.primary : colors.background,
                                        marginRight: 8,
                                        borderWidth: avatarFilter === cat ? 0 : 1,
                                        borderColor: colors.border
                                    }}
                                >
                                    <Text style={{ color: avatarFilter === cat ? '#fff' : colors.text, fontWeight: '600' }}>{cat}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>

                        <ScrollView style={{ maxHeight: 200, marginBottom: 24 }}>
                            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12, justifyContent: 'center' }}>
                                {filteredAvatars.map((item, i) => (
                                    <TouchableOpacity key={i} onPress={() => selectDefaultAvatar(item.url)}>
                                        <Image source={{ uri: item.url }} style={{ width: 50, height: 50, borderRadius: 25, backgroundColor: colors.background }} />
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </ScrollView>

                        <TouchableOpacity onPress={pickImage} style={{ backgroundColor: colors.primary, padding: 12, borderRadius: 8, marginBottom: 12, alignItems: 'center' }}>
                            <Text style={{ color: '#fff', fontWeight: '600' }}>Pick from Gallery</Text>
                        </TouchableOpacity>

                        {avatarBase64 && (
                            <TouchableOpacity onPress={removeAvatar} style={{ backgroundColor: 'rgba(244, 67, 54, 0.1)', padding: 12, borderRadius: 8, marginBottom: 12, alignItems: 'center' }}>
                                <Text style={{ color: '#F44336', fontWeight: '600' }}>Remove Picture</Text>
                            </TouchableOpacity>
                        )}

                        <TouchableOpacity onPress={() => setShowAvatarModal(false)} style={{ padding: 12, alignItems: 'center' }}>
                            <Text style={{ color: colors.subText, fontWeight: '600' }}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

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