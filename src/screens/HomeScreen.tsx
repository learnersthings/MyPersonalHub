import {
    View,
    Text,
    TouchableOpacity,
} from "react-native";

import {
    Ionicons,
} from "@expo/vector-icons";

import {
    useNavigation,
} from "@react-navigation/native";

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

                <Text
                    style={{
                        fontSize: 34,

                        fontWeight: "800",

                        color:
                            colors.text,

                        marginTop: 4,
                    }}
                >

                    User

                </Text>

            </View>

            {/* Tiles */}

            <FeatureCard
                title="Brain Dashboard"
                subtitle="View overall progress"
                icon="stats-chart"
                color="#2196F3"
                screen="BrainDashboard"
            />

            <FeatureCard
                title="Brain Activity"
                subtitle="Train your brain daily"
                icon="fitness"
                color="#2096F3"
                screen="BrainActivity"
            />

        </View>
    );
}