import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
} from "react-native";

import {
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
    saveBrainStats,
} from "../services/brainStorage";

export default function PatternChallengeScreen() {

    const {
        colors,
    } = useTheme();

    const [
        difficulty,
        setDifficulty,
    ] = useState("Easy");

    const [
        score,
        setScore,
    ] = useState(0);

    const [
        round,
        setRound,
    ] = useState(1);

    const [
        userAnswer,
        setUserAnswer,
    ] = useState("");

    const [
        result,
        setResult,
    ] = useState("");

    const [
        gameOver,
        setGameOver,
    ] = useState(false);

    const MAX_ROUNDS = 5;

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
            stats.patternBest
        ) {

            stats.patternBest =
                finalScore;
        }

        await saveBrainStats(
            stats
        );
    }

    function generatePattern() {

        let sequence: number[] = [];

        let answer = 0;

        if (difficulty === "Easy") {

            const start =
                Math.floor(
                    Math.random() * 20
                ) + 1;

            const step =
                Math.floor(
                    Math.random() * 5
                ) + 1;

            sequence = [
                start,
                start + step,
                start + step * 2,
                start + step * 3,
            ];

            answer =
                start + step * 4;

        } else if (
            difficulty === "Medium"
        ) {

            const start =
                Math.floor(
                    Math.random() * 10
                ) + 2;

            const multiplier =
                Math.floor(
                    Math.random() * 3
                ) + 2;

            sequence = [
                start,
                start * multiplier,
                start * multiplier * multiplier,
                start * multiplier * multiplier * multiplier,
            ];

            answer =
                start *
                multiplier *
                multiplier *
                multiplier *
                multiplier;

        } else {

            const first =
                Math.floor(
                    Math.random() * 5
                ) + 1;

            const second =
                Math.floor(
                    Math.random() * 5
                ) + 2;

            sequence = [
                first,
                second,
            ];

            for (
                let i = 2;
                i < 5;
                i++
            ) {

                sequence.push(
                    sequence[i - 1]
                    +
                    sequence[i - 2]
                );
            }

            answer =
                sequence[4]
                +
                sequence[3];
        }

        return {

            question:
                sequence.join(", ")
                +
                ", ?",

            answer:
                answer.toString(),
        };
    }

    const [
        currentPattern,
        setCurrentPattern,
    ] = useState(
        generatePattern()
    );

    function checkAnswer() {

        if (
            userAnswer.trim().length === 0
        ) {
            return;
        }

        let nextScore = score;

        if (userAnswer.trim() === currentPattern.answer) {
            nextScore = score + 1;
            setScore(nextScore);
            setResult("✅ Correct");
        } else {
            setResult(`❌ Wrong (Answer: ${currentPattern.answer})`);
        }

        const nextRound = round + 1;

        if (nextRound > MAX_ROUNDS) {
            setTimeout(async () => {
                await updateBrainStats(nextScore);
                setGameOver(true);
            }, 1000);
            return;
        }

        setTimeout(() => {
            setRound(nextRound);
            setCurrentPattern(generatePattern());
            setUserAnswer("");
            setResult("");
        }, 1000);
    }

    function restartGame() {

        setScore(0);

        setRound(1);

        setUserAnswer("");

        setResult("");

        setGameOver(false);

        setCurrentPattern(
            generatePattern()
        );
    }

    return (

        <View
            style={[
                globalStyles.screen,
                {
                    backgroundColor:
                        colors.background,

                    justifyContent:
                        "center",
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

                    marginBottom: 25,
                }}
            >

                🔢 Pattern Challenge

            </Text>

            {/* Difficulty */}

            <View
                style={{
                    flexDirection: "row",

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
                    ].map(level => (

                        <TouchableOpacity

                            key={level}

                            disabled={
                                round > 1
                            }

                            onPress={() => {

                                setDifficulty(
                                    level
                                );

                                setCurrentPattern(
                                    generatePattern()
                                );
                            }}

                            style={{
                                flex: 1,

                                marginHorizontal: 4,

                                padding: 12,

                                borderRadius: 12,

                                backgroundColor:
                                    difficulty === level
                                        ? colors.primary
                                        : colors.card,
                            }}
                        >

                            <Text
                                style={{
                                    textAlign:
                                        "center",

                                    color:
                                        difficulty === level
                                            ? "#FFF"
                                            : colors.text,

                                    fontWeight:
                                        "700",
                                }}
                            >

                                {level}

                            </Text>

                        </TouchableOpacity>
                    ))
                }

            </View>

            <View
                style={{
                    backgroundColor:
                        colors.card,

                    padding: 25,

                    borderRadius: 20,

                    marginBottom: 20,
                }}
            >

                <Text
                    style={{
                        color:
                            colors.text,

                        fontSize: 30,

                        textAlign: "center",

                        fontWeight: "800",
                    }}
                >

                    {
                        currentPattern.question
                    }

                </Text>

            </View>

            <TextInput

                value={userAnswer}

                onChangeText={
                    setUserAnswer
                }

                keyboardType="number-pad"

                placeholder="Your Answer"

                placeholderTextColor={
                    colors.subText
                }

                editable={!gameOver}

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

                    textAlign: "center",

                    fontSize: 20,

                    marginBottom: 20,
                }}
            />

            <TouchableOpacity

                onPress={
                    checkAnswer
                }

                disabled={
                    gameOver ||
                    userAnswer.trim().length === 0
                }

                style={[
                    globalStyles.button,
                    {
                        opacity:
                            gameOver ||
                                userAnswer.trim().length === 0
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

            <Text
                style={{
                    marginTop: 20,

                    textAlign: "center",

                    fontSize: 18,

                    color:
                        colors.primary,
                }}
            >

                Round: {round}/{MAX_ROUNDS}

            </Text>

            <Text
                style={{
                    textAlign: "center",

                    fontSize: 18,

                    color:
                        colors.primary,

                    marginTop: 5,
                }}
            >

                Score: {score}/{MAX_ROUNDS}

            </Text>

            {result.length > 0 && (

                <Text
                    style={{
                        textAlign: "center",

                        marginTop: 15,

                        fontSize: 18,

                        fontWeight: "700",

                        color:
                            result.includes("Correct")
                                ? "#4CAF50"
                                : "#F44336",
                    }}
                >

                    {result}

                </Text>
            )}

            {gameOver && (

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
            )}

        </View>
    );
}