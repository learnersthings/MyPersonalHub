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

export default function MathChallengeScreen() {

    const { colors } =
        useTheme();

    const TOTAL_QUESTIONS = 10;

    const [
        difficulty,
        setDifficulty,
    ] = useState<
        "Easy" |
        "Medium" |
        "Hard" |
        null
    >(null);

    const [
        question,
        setQuestion,
    ] = useState("");

    const [
        answer,
        setAnswer,
    ] = useState(0);

    const [
        userAnswer,
        setUserAnswer,
    ] = useState("");

    const [
        score,
        setScore,
    ] = useState(0);

    const [
        currentQuestion,
        setCurrentQuestion,
    ] = useState(1);

    const [
        result,
        setResult,
    ] = useState("");

    const [
        gameOver,
        setGameOver,
    ] = useState(false);

    const [
        timer,
        setTimer,
    ] = useState(15);

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
            stats.mathBest
        ) {

            stats.mathBest =
                finalScore;
        }

        await saveBrainStats(
            stats
        );
    }

    function generateQuestion() {

        let a = 0;
        let b = 0;

        if (
            difficulty === "Easy"
        ) {

            a =
                Math.floor(
                    Math.random() * 10
                ) + 1;

            b =
                Math.floor(
                    Math.random() * 10
                ) + 1;

            setQuestion(
                `${a} + ${b}`
            );

            setAnswer(a + b);

        } else if (
            difficulty === "Medium"
        ) {

            a =
                Math.floor(
                    Math.random() * 50
                ) + 10;

            b =
                Math.floor(
                    Math.random() * 50
                ) + 10;

            setQuestion(
                `${a} - ${b}`
            );

            setAnswer(a - b);

        } else {

            a =
                Math.floor(
                    Math.random() * 12
                ) + 1;

            b =
                Math.floor(
                    Math.random() * 12
                ) + 1;

            setQuestion(
                `${a} × ${b}`
            );

            setAnswer(a * b);
        }

        setTimer(15);

        setUserAnswer("");
    }

    useEffect(() => {

        if (
            difficulty &&
            !gameOver
        ) {
            generateQuestion();
        }

    }, [difficulty]);

    useEffect(() => {

        if (
            !difficulty ||
            gameOver
        ) {
            return;
        }

        const interval =
            setInterval(() => {

                setTimer(prev => {

                    if (prev <= 1) {

                        clearInterval(interval);

                        checkAnswer(true);

                        return 0;
                    }

                    return prev - 1;
                });

            }, 1000);

        return () =>
            clearInterval(interval);

    }, [
        difficulty,
        gameOver,
        currentQuestion,
    ]);

    function checkAnswer(
        timeout = false
    ) {

        let nextScore =
            score;

        if (
            !timeout &&
            Number(
                userAnswer
            ) === answer
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
                `❌ Answer: ${answer}`
            );
        }

        if (
            currentQuestion >=
            TOTAL_QUESTIONS
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

            setCurrentQuestion(
                prev =>
                    prev + 1
            );

            generateQuestion();

            setResult("");

        }, 1000);
    }

    function restartGame() {

        setDifficulty(
            null
        );

        setScore(0);

        setCurrentQuestion(
            1
        );

        setResult("");

        setGameOver(
            false
        );
    }

    if (!difficulty) {

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
                        marginBottom: 30,
                    }}
                >
                    ➕ Math Challenge
                </Text>

                {[
                    "Easy",
                    "Medium",
                    "Hard",
                ].map(level => (

                    <TouchableOpacity

                        key={level}

                        onPress={() =>
                            setDifficulty(
                                level as any
                            )
                        }

                        style={[
                            globalStyles.button,
                            {
                                marginBottom: 15,
                            },
                        ]}
                    >

                        <Text
                            style={
                                globalStyles.buttonText
                            }
                        >
                            {level}
                        </Text>

                    </TouchableOpacity>
                ))}

            </View>
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
                    color:
                        colors.primary,
                    textAlign:
                        "center",
                    fontSize: 20,
                    marginBottom: 15,
                }}
            >
                ⏱ {timer}s
            </Text>

            <Text
                style={{
                    color:
                        colors.text,
                    fontSize: 30,
                    textAlign:
                        "center",
                    fontWeight: "800",
                    marginBottom: 20,
                }}
            >
                {question}
            </Text>

            <TextInput

                value={
                    userAnswer
                }

                onChangeText={
                    setUserAnswer
                }

                keyboardType="number-pad"

                placeholder="Answer"

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

                style={
                    globalStyles.button
                }
            >

                <Text
                    style={
                        globalStyles.buttonText
                    }
                >
                    Submit
                </Text>

            </TouchableOpacity>

            <Text
                style={{
                    textAlign:
                        "center",

                    marginTop: 20,

                    color:
                        colors.primary,

                    fontSize: 18,
                }}
            >
                Score: {score}/{TOTAL_QUESTIONS}
            </Text>

            {result ? (

                <Text
                    style={{
                        textAlign:
                            "center",

                        marginTop: 15,

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

            ) : null}

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