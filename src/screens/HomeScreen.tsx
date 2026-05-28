import {
    View,
    Text,
} from "react-native";

import {
    useTheme,
} from "../context/ThemeContext";

import {
    globalStyles,
} from "../theme/styles";

import {
    Ionicons,
} from "@expo/vector-icons";

export default function HomeScreen() {

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
                        name={greetingIcon as any}
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

        </View>
    );
}