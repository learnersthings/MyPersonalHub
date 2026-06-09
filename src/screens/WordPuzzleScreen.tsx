import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
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

export default function WordPuzzleScreen() {

    const {
        colors,
    } = useTheme();

    const easyWords = [
        "APPLE",
        "WATER",
        "HOUSE",
        "TRAIN",
        "LIGHT",
        "PLANT",
        "MUSIC",
        "BREAD",
    ];

    const mediumWords = [
        "ORANGE",
        "MARKET",
        "FUTURE",
        "BUTTON",
        "PLANET",
        "GARDEN",
        "POCKET",
        "WINTER",
    ];

    const hardWords = [
        "COMPUTER",
        "ELEPHANT",
        "NOTEBOOK",
        "LANGUAGE",
        "CHALLENGE",
        "DISCOVERY",
        "MOUNTAINS",
        "ADVENTURE",
    ];

    const [
        difficulty,
        setDifficulty,
    ] = useState("Easy");

    const [
        originalWord,
        setOriginalWord,
    ] = useState("");

    const [
        scrambledWord,
        setScrambledWord,
    ] = useState("");

    const [
        userAnswer,
        setUserAnswer,
    ] = useState("");

    const [
        score,
        setScore,
    ] = useState(0);

    const [
        result,
        setResult,
    ] = useState("");

    const [
        gameOver,
        setGameOver,
    ] = useState(false);

    const [
        timeLeft,
        setTimeLeft,
    ] = useState(15);

    const TOTAL_ROUNDS = 5;

    const [
        currentRound,
        setCurrentRound,
    ] = useState(1);

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
            stats.wordBest
        ) {

            stats.wordBest =
                finalScore;
        }

        await saveBrainStats(
            stats
        );
    }

    function shuffleWord(
        word: string
    ) {

        return word
            .split("")
            .sort(
                () =>
                    Math.random() - 0.5
            )
            .join("");
    }

    function generateWord() {

        let words: string[] =
            easyWords;

        if (
            difficulty === "Medium"
        ) {

            words =
                mediumWords;

        } else if (
            difficulty === "Hard"
        ) {

            words =
                hardWords;
        }

        const randomWord =
            words[
            Math.floor(
                Math.random() *
                words.length
            )
            ];

        setOriginalWord(
            randomWord
        );

        setScrambledWord(
            shuffleWord(
                randomWord
            )
        );

        setUserAnswer("");

        setTimeLeft(15);
    }

    useEffect(() => {

        generateWord();

    }, [difficulty]);

    useEffect(() => {

        if (
            gameOver
        ) {
            return;
        }

        const timer =
            setInterval(() => {

                setTimeLeft(
                    (prev) => {

                        if (
                            prev <= 1
                        ) {

                            checkAnswer(
                                true
                            );

                            return 15;
                        }

                        return prev - 1;
                    }
                );

            }, 1000);

        return () =>
            clearInterval(
                timer
            );

    }, [
        currentRound,
        gameOver,
    ]);

    function checkAnswer(
        timedOut = false
    ) {

        let nextScore =
            score;

        if (
            !timedOut &&
            userAnswer
                .trim()
                .toUpperCase()
            ===
            originalWord
        ) {

            nextScore++;

            setScore(
                nextScore
            );

            setResult(
                "✅ Correct"
            );

        } else {

            setResult(
                `❌ ${originalWord}`
            );
        }

        if (
            currentRound >=
            TOTAL_ROUNDS
        ) {

            setTimeout(async () => {

                await updateBrainStats(
                    nextScore
                );

                setGameOver(
                    true
                );

            }, 1000);

            return;
        }

        setTimeout(() => {

            setCurrentRound(
                (prev) =>
                    prev + 1
            );

            generateWord();

            setResult("");

        }, 1000);
    }

    function restartGame() {

        setScore(0);

        setCurrentRound(1);

        setUserAnswer("");

        setResult("");

        setGameOver(false);

        setTimeLeft(15);

        generateWord();
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
                📝 Word Puzzle
            </Text>

            <View
                style={{
                    flexDirection:
                        "row",
                    justifyContent:
                        "space-between",
                    marginBottom: 20,
                }}
            >

                {
                    [
                        "Easy",
                        "Medium",
                        "Hard",
                    ].map(
                        (
                            level
                        ) => (

                            <TouchableOpacity

                                key={
                                    level
                                }

                                onPress={() => {

                                    if (
                                        currentRound ===
                                        1
                                    ) {

                                        setDifficulty(
                                            level
                                        );
                                    }
                                }}

                                style={{
                                    flex: 1,

                                    backgroundColor:
                                        difficulty ===
                                            level
                                            ? colors.primary
                                            : colors.card,

                                    padding: 12,

                                    marginHorizontal: 4,

                                    borderRadius: 12,
                                }}
                            >

                                <Text
                                    style={{
                                        textAlign:
                                            "center",

                                        color:
                                            difficulty ===
                                                level
                                                ? "#FFF"
                                                : colors.text,

                                        fontWeight:
                                            "700",
                                    }}
                                >
                                    {level}
                                </Text>

                            </TouchableOpacity>
                        )
                    )
                }

            </View>

            <Text
                style={{
                    textAlign:
                        "center",
                    color:
                        colors.primary,
                    fontSize: 18,
                    marginBottom: 8,
                }}
            >
                ⏳ Time Left: {timeLeft}s
            </Text>

            <Text
                style={{
                    textAlign:
                        "center",
                    color:
                        colors.primary,
                    fontSize: 18,
                    marginBottom: 20,
                }}
            >
                Score: {score}/{TOTAL_ROUNDS}
            </Text>

            <View
                style={{
                    backgroundColor:
                        colors.card,

                    padding: 30,

                    borderRadius: 20,

                    marginBottom: 20,
                }}
            >

                <Text
                    style={{
                        fontSize: 34,

                        fontWeight:
                            "800",

                        textAlign:
                            "center",

                        color:
                            colors.text,

                        letterSpacing: 4,
                    }}
                >
                    {scrambledWord}
                </Text>

            </View>

            <TextInput

                value={
                    userAnswer
                }

                onChangeText={
                    setUserAnswer
                }

                autoCapitalize="characters"

                placeholder="Enter word"

                placeholderTextColor={
                    colors.subText
                }

                editable={
                    !gameOver
                }

                style={{
                    backgroundColor:
                        colors.card,

                    color:
                        colors.text,

                    borderWidth: 1,

                    borderColor:
                        colors.border,

                    borderRadius: 14,

                    padding: 16,

                    fontSize: 20,

                    textAlign:
                        "center",

                    marginBottom: 20,
                }}
            />

            <TouchableOpacity

                onPress={() =>
                    checkAnswer()
                }

                disabled={
                    gameOver ||
                    userAnswer
                        .trim()
                        .length === 0
                }

                style={[
                    globalStyles.button,
                    {
                        opacity:
                            gameOver ||
                                userAnswer
                                    .trim()
                                    .length === 0
                                ? 0.5
                                : 1,
                    },
                ]}
            >

                <Text
                    style={
                        globalStyles.buttonText
                    }
                >
                    Check Answer
                </Text>

            </TouchableOpacity>

            {
                result.length > 0 && (

                    <Text
                        style={{
                            marginTop: 20,

                            textAlign:
                                "center",

                            fontSize: 18,

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

                    <TouchableOpacity

                        onPress={
                            restartGame
                        }

                        style={[
                            globalStyles.button,
                            {
                                marginTop: 30,
                            },
                        ]}
                    >

                        <Text
                            style={
                                globalStyles.buttonText
                            }
                        >
                            Play Again
                        </Text>

                    </TouchableOpacity>
                )
            }

        </View>
    );
}