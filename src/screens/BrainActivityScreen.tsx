import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
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

export default function BrainActivityScreen() {

    const navigation =
        useNavigation<any>();

    const {
        colors,
    } = useTheme();

    function GameCard({
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

                        justifyContent:
                            "center",

                        alignItems:
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

            {/* FIXED HEADER */}

            <Text
                style={{
                    fontSize: 32,

                    fontWeight: "800",

                    color:
                        colors.text,

                    marginBottom: 8,
                }}
            >

                🧠 Brain Activity

            </Text>

            <Text
                style={{
                    color:
                        colors.subText,

                    fontSize: 16,

                    marginBottom: 25,
                }}
            >

                Improve memory, logic, focus and reaction speed.

            </Text>

            {/* SCROLLABLE CARDS */}

            <ScrollView
                showsVerticalScrollIndicator={false}
            >

                <GameCard
                    title="Memory Recall"
                    subtitle="Recall the memory sequence"
                    icon="list"
                    color="#c8e91e"
                    screen="NumberRecall"
                />

                <GameCard
                    title="Reaction Time"
                    subtitle="Test your reflex speed"
                    icon="flash"
                    color="#E91E63"
                    screen="ReactionChallenge"
                />

                <GameCard
                    title="Quick Decision"
                    subtitle="Make quick decisions"
                    icon="ellipse"
                    color="#1e49e9"
                    screen="QuickDecision"
                />

            </ScrollView>

        </View>
    );
}