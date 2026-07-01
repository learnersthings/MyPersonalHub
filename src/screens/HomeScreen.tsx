import {
    View,
    Text,
    TouchableOpacity,
    Image,
} from "react-native";

import { useState, useCallback } from "react";

import {
    Ionicons,
} from "@expo/vector-icons";

import {
    useNavigation,
    useFocusEffect,
} from "@react-navigation/native";

import { getProfile, UserProfile } from "../services/profileStorage";

import {
    useTheme,
} from "../context/ThemeContext";

import {
    globalStyles,
} from "../theme/styles";

export default function HomeScreen() {

    const navigation =
        useNavigation<any>();

    const {
        colors,
    } = useTheme();

    const [profile, setProfile] = useState<UserProfile | null>(null);

    useFocusEffect(
        useCallback(() => {
            async function load() {
                const data = await getProfile();
                setProfile(data);
            }
            load();
        }, [])
    );

    const currentHour =
        new Date().getHours();

    let greeting =
        "Good Time";

    let greetingIcon =
        "sparkles";

    let iconColor =
        "#2196F3";

    if (
        currentHour >= 5 &&
        currentHour < 12
    ) {

        greeting =
            "Good Morning";

        greetingIcon =
            "sunny";

        iconColor =
            "#FDB813";

    } else if (
        currentHour >= 12 &&
        currentHour < 17
    ) {

        greeting =
            "Good Afternoon";

        greetingIcon =
            "partly-sunny";

        iconColor =
            "#FF9800";

    } else if (
        currentHour >= 17 &&
        currentHour < 21
    ) {

        greeting =
            "Good Evening";

        greetingIcon =
            "moon-outline";

        iconColor =
            "#7E57C2";

    } else {

        greeting =
            "Good Night";

        greetingIcon =
            "moon";

        iconColor =
            "#5C6BC0";
    }

    function FeatureCard({
        title,
        subtitle,
        icon,
        color,
        screen,
    }: any) {

        return (

            <TouchableOpacity

                onPress={() =>
                    navigation.navigate(
                        screen
                    )
                }

                style={{
                    backgroundColor:
                        colors.card,

                    borderRadius: 22,

                    padding: 20,

                    marginBottom: 16,

                    borderWidth: 1,

                    borderColor:
                        colors.border,
                }}
            >

                <View
                    style={{
                        width: 60,
                        height: 60,

                        borderRadius: 30,

                        backgroundColor:
                            `${color}20`,

                        alignItems:
                            "center",

                        justifyContent:
                            "center",

                        marginBottom: 16,
                    }}
                >

                    <Ionicons
                        name={icon}
                        size={28}
                        color={color}
                    />

                </View>

                <Text
                    style={{
                        fontSize: 22,

                        fontWeight: "700",

                        color:
                            colors.text,
                    }}
                >

                    {title}

                </Text>

                <Text
                    style={{
                        color:
                            colors.subText,

                        marginTop: 6,

                        fontSize: 15,
                    }}
                >

                    {subtitle}

                </Text>

            </TouchableOpacity>
        );
    }

    return (

        <View
            style={[
                globalStyles.screen,
                {
                    backgroundColor:
                        colors.background,
                },
            ]}
        >

            {/* Header */}

            <View
                style={{
                    marginTop: 10,
                    marginBottom: 30,
                }}
            >

                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                    }}
                >

                    <Ionicons
                        name={
                            greetingIcon as any
                        }
                        size={22}
                        color={iconColor}
                    />

                    <Text
                        style={{
                            fontSize: 18,

                            color:
                                colors.subText,

                            fontWeight: "500",

                            marginLeft: 8,
                        }}
                    >

                        {greeting}

                    </Text>

                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 }}>
                    <Text
                        style={{
                            fontSize: 34,
                            fontWeight: "800",
                            color: colors.text,
                        }}
                    >
                        {profile?.firstName ? profile.firstName : ""}
                    </Text>
                    {profile?.avatarBase64 && (
                        <Image
                            source={{ uri: profile.avatarBase64 }}
                            style={{ width: 48, height: 48, borderRadius: 24 }}
                        />
                    )}
                </View>
            </View>
        </View>
    );
}