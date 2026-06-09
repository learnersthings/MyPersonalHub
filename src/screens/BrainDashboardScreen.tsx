import {
    View,
    Text,
    ScrollView,
} from "react-native";

import {
    useEffect,
    useState,
} from "react";

import {
    useTheme,
} from "../context/ThemeContext";

import {
    globalStyles,
} from "../theme/styles";

import {
    getBrainStats,
} from "../services/brainStorage";

export default function BrainDashboardScreen() {

    const {
        colors,
    } = useTheme();

    const [
        stats,
        setStats,
    ] = useState<any>(null);

    useEffect(() => {

        loadStats();

    }, []);

    async function loadStats() {

        const data =
            await getBrainStats();

        setStats(data);
    }

    if (!stats) {

        return null;
    }

    const level =
        Math.floor(
            stats.xp / 100
        ) + 1;

    const currentXP =
        stats.xp % 100;

    return (

        <ScrollView
            style={[
                globalStyles.screen,
                {
                    backgroundColor:
                        colors.background,
                },
            ]}
            showsVerticalScrollIndicator={false}
        >

            {/* HEADER */}

            <Text
                style={{
                    fontSize: 32,
                    fontWeight: "800",
                    color:
                        colors.text,
                    marginBottom: 8,
                }}
            >
                🧠 Brain Dashboard
            </Text>

            <Text
                style={{
                    color:
                        colors.subText,
                    fontSize: 16,
                    marginBottom: 25,
                }}
            >
                Track your overall brain performance
            </Text>

            {/* LEVEL CARD */}

            <View
                style={{
                    backgroundColor:
                        colors.card,
                    padding: 20,
                    borderRadius: 20,
                    marginBottom: 20,
                }}
            >

                <Text
                    style={{
                        color:
                            colors.text,
                        fontSize: 28,
                        fontWeight: "800",
                    }}
                >
                    Level {level}
                </Text>

                <Text
                    style={{
                        color:
                            colors.primary,
                        marginTop: 8,
                        marginBottom: 15,
                    }}
                >
                    XP: {stats.xp}
                </Text>

                <View
                    style={{
                        height: 12,
                        backgroundColor:
                            colors.border,
                        borderRadius: 10,
                        overflow: "hidden",
                    }}
                >

                    <View
                        style={{
                            height: 12,
                            width:
                                `${currentXP}%`,
                            backgroundColor:
                                colors.primary,
                        }}
                    />

                </View>

                <Text
                    style={{
                        color:
                            colors.subText,
                        marginTop: 8,
                    }}
                >
                    {currentXP}/100 XP
                </Text>

            </View>

            {/* STATS */}

            <View
                style={{
                    backgroundColor:
                        colors.card,
                    padding: 20,
                    borderRadius: 20,
                    marginBottom: 20,
                }}
            >

                <Text
                    style={{
                        color:
                            colors.text,
                        fontSize: 22,
                        fontWeight: "700",
                        marginBottom: 15,
                    }}
                >
                    📊 Overall Stats
                </Text>

                <Text
                    style={{
                        color:
                            colors.text,
                        fontSize: 18,
                        marginBottom: 10,
                    }}
                >
                    Games Played:
                    {" "}
                    {stats.totalGames}
                </Text>

                <Text
                    style={{
                        color:
                            colors.text,
                        fontSize: 18,
                    }}
                >
                    Total Score:
                    {" "}
                    {stats.totalScore}
                </Text>

            </View>

            {/* BEST SCORES */}

            <View
                style={{
                    backgroundColor:
                        colors.card,
                    padding: 20,
                    borderRadius: 20,
                    marginBottom: 30,
                }}
            >

                <Text
                    style={{
                        color:
                            colors.text,
                        fontSize: 22,
                        fontWeight: "700",
                        marginBottom: 15,
                    }}
                >
                    🏆 Best Scores
                </Text>

                <Text style={{ color: colors.text }}>
                    Number Recall: {stats.numberBest}
                </Text>

                <Text style={{ color: colors.text }}>
                    Pattern Challenge: {stats.patternBest}
                </Text>

                <Text style={{ color: colors.text }}>
                    Math Challenge: {stats.mathBest}
                </Text>

                <Text style={{ color: colors.text }}>
                    Reaction Time: {stats.reactionBest}
                </Text>

                <Text style={{ color: colors.text }}>
                    Word Puzzle: {stats.wordBest}
                </Text>

                <Text style={{ color: colors.text }}>
                    Visual Memory: {stats.visualBest}
                </Text>

                <Text style={{ color: colors.text }}>
                    Color Match: {stats.colorBest}
                </Text>

                <Text style={{ color: colors.text }}>
                    Quick Decision: {stats.decisionBest}
                </Text>

            </View>

            {/* ACHIEVEMENTS */}

            <View
                style={{
                    backgroundColor:
                        colors.card,
                    padding: 20,
                    borderRadius: 20,
                    marginBottom: 20,
                }}
            >

                <Text
                    style={{
                        color:
                            colors.text,
                        fontSize: 22,
                        fontWeight: "700",
                        marginBottom: 15,
                    }}
                >
                    🎖 Achievements
                </Text>

                {
                    stats.xp >= 0 &&
                    (
                        <Text
                            style={{
                                color:
                                    colors.text,
                            }}
                        >
                            🥉 Beginner Brain
                        </Text>
                    )
                }

                {
                    stats.xp >= 300 &&
                    (
                        <Text
                            style={{
                                color:
                                    colors.text,
                            }}
                        >
                            🥈 Smart Thinker
                        </Text>
                    )
                }

                {
                    stats.xp >= 600 &&
                    (
                        <Text
                            style={{
                                color:
                                    colors.text,
                            }}
                        >
                            🥇 Brain Master
                        </Text>
                    )
                }

                {
                    stats.xp >= 1000 &&
                    (
                        <Text
                            style={{
                                color:
                                    colors.text,
                            }}
                        >
                            👑 Genius Level
                        </Text>
                    )
                }

            </View>

        </ScrollView>
    );
}