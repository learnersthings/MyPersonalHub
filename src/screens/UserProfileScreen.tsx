import {
    View,
    Text,
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

import { getProfile, saveProfile } from "../services/profileStorage";
import * as ImagePicker from "expo-image-picker";

export default function UserProfileScreen() {

    const navigation = useNavigation<any>();
    const { colors } = useTheme();

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

        // Boys - Classic, Modern, Cool, Expressions
        { category: 'Boys', url: "https://api.dicebear.com/9.x/avataaars/png?seed=Felix&mouth=smile" },
        { category: 'Boys', url: "https://api.dicebear.com/9.x/avataaars/png?seed=Leo&mouth=sad" },
        { category: 'Boys', url: "https://api.dicebear.com/9.x/avataaars/png?seed=Max&mouth=grimace" },
        { category: 'Boys', url: "https://api.dicebear.com/9.x/micah/png?seed=Jack" },
        { category: 'Boys', url: "https://api.dicebear.com/9.x/adventurer/png?seed=Oliver" },
        { category: 'Boys', url: "https://api.dicebear.com/9.x/fun-emoji/png?seed=Milo" },
        { category: 'Boys', url: "https://robohash.org/Milo.png?set=set4" },

        // Girls - Classic, Modern, Cool, Expressions
        { category: 'Girls', url: "https://api.dicebear.com/9.x/avataaars/png?seed=Luna&mouth=smile" },
        { category: 'Girls', url: "https://api.dicebear.com/9.x/avataaars/png?seed=Bella&mouth=sad" },
        { category: 'Girls', url: "https://api.dicebear.com/9.x/avataaars/png?seed=Sophie&mouth=screamOpen" },
        { category: 'Girls', url: "https://api.dicebear.com/9.x/micah/png?seed=Lily" },
        { category: 'Girls', url: "https://api.dicebear.com/9.x/adventurer/png?seed=Chloe" },
        { category: 'Girls', url: "https://api.dicebear.com/9.x/fun-emoji/png?seed=Mia" },
        { category: 'Girls', url: "https://robohash.org/Mia.png?set=set4" },

        // Men - Classic, Modern, Cool, Expressions
        { category: 'Men', url: "https://api.dicebear.com/9.x/avataaars/png?seed=George&mouth=smile&facialHair=beardLight" },
        { category: 'Men', url: "https://api.dicebear.com/9.x/avataaars/png?seed=Arthur&mouth=sad&facialHair=beardMedium" },
        { category: 'Men', url: "https://api.dicebear.com/9.x/avataaars/png?seed=Thomas&mouth=grimace&facialHair=moustacheMagnum" },
        { category: 'Men', url: "https://api.dicebear.com/9.x/micah/png?seed=James" },
        { category: 'Men', url: "https://api.dicebear.com/9.x/adventurer/png?seed=John" },
        { category: 'Men', url: "https://api.dicebear.com/9.x/fun-emoji/png?seed=William" },
        { category: 'Men', url: "https://robohash.org/William.png?set=set2" },

        // Womens - Classic, Modern, Cool, Expressions
        { category: 'Womens', url: "https://api.dicebear.com/9.x/avataaars/png?seed=Mary&mouth=smile" },
        { category: 'Womens', url: "https://api.dicebear.com/9.x/avataaars/png?seed=Patricia&mouth=sad" },
        { category: 'Womens', url: "https://api.dicebear.com/9.x/avataaars/png?seed=Jennifer&mouth=screamOpen" },
        { category: 'Womens', url: "https://api.dicebear.com/9.x/micah/png?seed=Linda" },
        { category: 'Womens', url: "https://api.dicebear.com/9.x/adventurer/png?seed=Elizabeth" },
        { category: 'Womens', url: "https://api.dicebear.com/9.x/fun-emoji/png?seed=Barbara" },
        { category: 'Womens', url: "https://robohash.org/Barbara.png?set=set4" },
    ];

    const filteredAvatars = avatarFilter === 'All'
        ? defaultAvatars
        : defaultAvatars.filter(a => a.category === avatarFilter);

    useEffect(() => {
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
            Alert.alert("Success", "Profile saved successfully.", [
                { text: "OK", onPress: () => navigation.goBack() }
            ]);
        } else {
            Alert.alert("Error", "Failed to save profile.");
        }
    };

    return (
        <View style={[globalStyles.screen, { backgroundColor: colors.background }]}>
            
            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 20 }}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: 12 }}>
                    <Ionicons name="arrow-back" size={28} color={colors.text} />
                </TouchableOpacity>
                <Text style={{ fontSize: 24, fontWeight: "700", color: colors.text }}>
                    User Profile
                </Text>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
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
            </ScrollView>

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
        </View>
    );
}
