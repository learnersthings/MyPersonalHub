import {
    View,
    Text,
    TouchableOpacity,
} from "react-native";

import {
    useState,
    useEffect,
} from "react";

import {
    useTheme,
} from "../context/ThemeContext";

import {
    globalStyles,
} from "../theme/styles";

import {
    getBrainStats,
    saveBrainStats,
} from "../services/brainStorage";

export default function VisualMemoryScreen() {

    const {
        colors,
    } = useTheme();

    const MAX_ROUNDS = 5;

    const [
        round,
        setRound,
    ] = useState(1);

    const [
        score,
        setScore,
    ] = useState(0);

    const [
        pattern,
        setPattern,
    ] = useState<number[]>([]);

    const [
        selectedTiles,
        setSelectedTiles,
    ] = useState<number[]>([]);

    const [
        showPattern,
        setShowPattern,
    ] = useState(true);

    const [
        result,
        setResult,
    ] = useState("");

    const [
        gameOver,
        setGameOver,
    ] = useState(false);

    async function updateBrainStats(
        finalScore: number
    ) {

        const stats =
            await getBrainStats();

        stats.totalGames += 1;

        stats.totalScore +=
            finalScore;

        stats.xp +=
            finalScore * 10;

        if (
            finalScore >
            stats.visualBest
        ) {

            stats.visualBest =
                finalScore;
        }

        await saveBrainStats(
            stats
        );
    }

    function generatePattern(
        count: number
    ) {

        const tiles: number[] = [];

        while (
            tiles.length < count
        ) {

            const random =
                Math.floor(
                    Math.random() * 9
                );

            if (
                !tiles.includes(
                    random
                )
            ) {

                tiles.push(
                    random
                );
            }
        }

        return tiles;
    }

    function startRound() {

        const newPattern =
            generatePattern(
                round
            );

        setPattern(
            newPattern
        );

        setSelectedTiles([]);

        setShowPattern(
            true
        );

        setResult("");

        setTimeout(() => {

            setShowPattern(
                false
            );

        }, 2000);
    }

    useEffect(() => {

        startRound();

    }, [round]);

    function handleTilePress(
        index: number
    ) {

        if (
            showPattern ||
            gameOver
        ) {
            return;
        }

        if (
            selectedTiles.includes(
                index
            )
        ) {
            return;
        }

        const updated =
            [
                ...selectedTiles,
                index,
            ];

        setSelectedTiles(
            updated
        );

        if (
            updated.length ===
            pattern.length
        ) {

            const correct =
                pattern.every(
                    tile =>
                        updated.includes(
                            tile
                        )
                );

            if (
                correct
            ) {

                const nextScore =
                    score + round;

                setScore(
                    nextScore
                );

                setResult(
                    "✅ Correct!"
                );

            } else {

                setResult(
                    "❌ Wrong!"
                );
            }

            if (
                round >=
                MAX_ROUNDS
            ) {

                setTimeout(async () => {

                    await updateBrainStats(
                        score
                    );

                    setGameOver(
                        true
                    );

                }, 1000);

                return;
            }

            setTimeout(() => {

                setRound(
                    prev =>
                        prev + 1
                );

            }, 1500);
        }
    }

    function restartGame() {

        setRound(1);

        setScore(0);

        setPattern([]);

        setSelectedTiles([]);

        setResult("");

        setGameOver(false);

        setShowPattern(true);
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

            <Text
                style={{
                    fontSize: 30,
                    fontWeight: "800",
                    textAlign: "center",
                    color:
                        colors.text,
                    marginBottom: 20,
                }}
            >
                🧩 Visual Memory
            </Text>

            <Text
                style={{
                    textAlign: "center",
                    color:
                        colors.primary,
                    fontSize: 18,
                }}
            >
                Round {round}/{MAX_ROUNDS}
            </Text>

            <Text
                style={{
                    textAlign: "center",
                    color:
                        colors.primary,
                    fontSize: 18,
                    marginBottom: 25,
                }}
            >
                Score: {score}
            </Text>

            <View
                style={{
                    alignItems:
                        "center",
                }}
            >

                <View
                    style={{
                        flexDirection:
                            "row",
                        flexWrap:
                            "wrap",
                        width: 270,
                    }}
                >

                    {
                        [...Array(9)].map(
                            (_, index) => {

                                const active =
                                    pattern.includes(
                                        index
                                    );

                                const selected =
                                    selectedTiles.includes(
                                        index
                                    );

                                return (

                                    <TouchableOpacity

                                        key={
                                            index
                                        }

                                        onPress={() =>
                                            handleTilePress(
                                                index
                                            )
                                        }

                                        style={{
                                            width: 80,

                                            height: 80,

                                            margin: 5,

                                            borderRadius: 12,

                                            backgroundColor:
                                                showPattern
                                                    ? active
                                                        ? colors.primary
                                                        : colors.card
                                                    : selected
                                                        ? colors.primary
                                                        : colors.card,

                                            borderWidth: 1,

                                            borderColor:
                                                colors.border,
                                        }}
                                    />
                                );
                            }
                        )
                    }

                </View>

            </View>

            {
                !showPattern &&
                !gameOver && (

                    <Text
                        style={{
                            textAlign:
                                "center",

                            marginTop: 25,

                            color:
                                colors.subText,

                            fontSize: 16,
                        }}
                    >
                        Tap the tiles you remember
                    </Text>
                )
            }

            {
                result.length > 0 && (

                    <Text
                        style={{
                            textAlign:
                                "center",

                            marginTop: 20,

                            fontSize: 20,

                            fontWeight:
                                "700",

                            color:
                                result.includes(
                                    "Correct"
                                )
                                    ? "#4CAF50"
                                    : "#F44336",
                        }}
                    >
                        {result}
                    </Text>
                )
            }

            {
                gameOver && (

                    <View
                        style={{
                            marginTop: 30,
                            alignItems:
                                "center",
                        }}
                    >

                        <Text
                            style={{
                                fontSize: 28,
                                fontWeight:
                                    "800",
                                color:
                                    colors.text,
                                marginBottom: 10,
                            }}
                        >
                            🎉 Game Over
                        </Text>

                        <Text
                            style={{
                                fontSize: 20,
                                color:
                                    colors.primary,
                                marginBottom: 20,
                            }}
                        >
                            Final Score: {score}
                        </Text>

                        <TouchableOpacity

                            onPress={
                                restartGame
                            }

                            style={
                                globalStyles.button
                            }
                        >

                            <Text
                                style={
                                    globalStyles.buttonText
                                }
                            >
                                Play Again
                            </Text>

                        </TouchableOpacity>

                    </View>
                )
            }

        </View>
    );
}