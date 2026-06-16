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

export default function QuickDecisionScreen() {

    const {
        colors,
    } = useTheme();

    const MAX_ROUNDS = 10;

    const [
        round,
        setRound,
    ] = useState(1);

    const [
        score,
        setScore,
    ] = useState(0);

    const [
        timer,
        setTimer,
    ] = useState(10);

    const [
        gameOver,
        setGameOver,
    ] = useState(false);

    const [
        question,
        setQuestion,
    ] = useState("");

    const [
        correctAnswer,
        setCorrectAnswer,
    ] = useState(false);

    const [
        result,
        setResult,
    ] = useState("");

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
            stats.decisionBest
        ) {

            stats.decisionBest =
                finalScore;
        }

        await saveBrainStats(
            stats
        );
    }

    function generateQuestion() {

        const type =
            Math.floor(
                Math.random() * 4
            );

        let questionText =
            "";

        let answer =
            false;

        if (
            type === 0
        ) {

            const a =
                Math.floor(
                    Math.random() * 20
                );

            const b =
                Math.floor(
                    Math.random() * 20
                );

            const shown =
                Math.random() > 0.5
                    ? a + b
                    : a + b + 1;

            questionText =
                `${a} + ${b} = ${shown}`;

            answer =
                shown ===
                a + b;
        }

        if (
            type === 1
        ) {

            const a =
                Math.floor(
                    Math.random() * 20
                ) + 5;

            const b =
                Math.floor(
                    Math.random() * 10
                );

            const shown =
                Math.random() > 0.5
                    ? a - b
                    : a - b + 2;

            questionText =
                `${a} - ${b} = ${shown}`;

            answer =
                shown ===
                a - b;
        }

        if (
            type === 2
        ) {

            const num =
                Math.floor(
                    Math.random() * 20
                ) + 1;

            const shownEven =
                Math.random() > 0.5;

            questionText =
                `${num} is even`;

            answer =
                shownEven
                    ? num % 2 === 0
                    : num % 2 === 0;

            if (
                !shownEven
            ) {

                questionText =
                    `${num} is odd`;

                answer =
                    num % 2 !== 0;
            }
        }

        if (type === 3) {
            const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
            const isBefore = Math.random() > 0.5;
            const isTrueStatement = Math.random() > 0.5;
            
            const idx1 = Math.floor(Math.random() * 25);
            const idx2 = idx1 + 1;
            
            const l1 = letters[idx1];
            const l2 = letters[idx2];
            
            if (isBefore) {
                if (isTrueStatement) {
                    questionText = `${l1} is before ${l2}`;
                    answer = true;
                } else {
                    questionText = `${l2} is before ${l1}`;
                    answer = false;
                }
            } else {
                if (isTrueStatement) {
                    questionText = `${l2} is after ${l1}`;
                    answer = true;
                } else {
                    questionText = `${l1} is after ${l2}`;
                    answer = false;
                }
            }
        }

        setQuestion(
            questionText
        );

        setCorrectAnswer(
            answer
        );

        setTimer(5);

        setResult("");
    }

    useEffect(() => {

        generateQuestion();

    }, []);

    useEffect(() => {

        if (
            gameOver
        ) {
            return;
        }

        if (
            timer <= 0
        ) {

            handleAnswer(
                false
            );

            return;
        }

        const interval =
            setInterval(
                () => {

                    setTimer(
                        prev =>
                            prev - 1
                    );

                },
                1000
            );

        return () =>
            clearInterval(
                interval
            );

    }, [
        timer,
        gameOver,
    ]);

    function nextRound(currentScore: number) {
        if (round >= MAX_ROUNDS) {
            updateBrainStats(currentScore);
            setGameOver(true);
            return;
        }

        setRound(prev => prev + 1);
        generateQuestion();
    }

    function handleAnswer(answer: boolean | null) {
        if (gameOver) return;

        let nextScore = score;

        if (answer === correctAnswer) {
            nextScore = score + 1;
            setScore(nextScore);
            setResult("✅ Correct");
        } else {
            setResult("❌ Wrong");
        }

        setTimeout(() => {
            nextRound(nextScore);
        }, 1000);
    }

    function restartGame() {

        setRound(1);

        setScore(0);

        setTimer(5);

        setGameOver(false);

        setResult("");

        generateQuestion();
    }

    if (
        gameOver
    ) {

        return (

            <View
                style={[
                    globalStyles.screen,
                    {
                        backgroundColor:
                            colors.background,

                        justifyContent:
                            "center",

                        alignItems:
                            "center",
                    },
                ]}
            >

                <Text
                    style={{
                        fontSize: 32,
                        fontWeight: "800",
                        color:
                            colors.text,
                    }}
                >
                    🎉 Game Over
                </Text>

                <Text
                    style={{
                        fontSize: 22,
                        marginTop: 15,
                        color:
                            colors.primary,
                    }}
                >
                    Score: {score}/{MAX_ROUNDS}
                </Text>

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
                },
            ]}
        >

            <Text
                style={{
                    fontSize: 30,
                    fontWeight: "800",
                    color:
                        colors.text,
                    textAlign:
                        "center",
                    marginBottom: 20,
                }}
            >
                ⚡ Quick Decision
            </Text>

            <Text
                style={{
                    textAlign:
                        "center",
                    color:
                        colors.primary,
                    fontSize: 18,
                }}
            >
                Round {round}/{MAX_ROUNDS}
            </Text>

            <Text
                style={{
                    textAlign:
                        "center",
                    color:
                        timer <= 3
                            ? "#F44336"
                            : colors.text,
                    fontSize: 18,
                    marginBottom: 20,
                }}
            >
                Time: {timer}s
            </Text>

            <View
                style={{
                    backgroundColor:
                        colors.card,

                    padding: 35,

                    borderRadius: 20,

                    marginBottom: 30,

                    alignItems:
                        "center",
                }}
            >

                <Text
                    style={{
                        fontSize: 32,
                        fontWeight:
                            "800",
                        color:
                            colors.text,
                    }}
                >
                    {question}
                </Text>

            </View>

            <TouchableOpacity

                onPress={() =>
                    handleAnswer(
                        true
                    )
                }

                style={[
                    globalStyles.button,
                    {
                        backgroundColor:
                            "#4CAF50",

                        marginBottom: 15,
                    },
                ]}
            >

                <Text
                    style={
                        globalStyles.buttonText
                    }
                >
                    TRUE
                </Text>

            </TouchableOpacity>

            <TouchableOpacity

                onPress={() =>
                    handleAnswer(
                        false
                    )
                }

                style={[
                    globalStyles.button,
                    {
                        backgroundColor:
                            "#F44336",
                    },
                ]}
            >

                <Text
                    style={
                        globalStyles.buttonText
                    }
                >
                    FALSE
                </Text>

            </TouchableOpacity>

            {
                result.length > 0 && (

                    <Text
                        style={{
                            textAlign:
                                "center",

                            marginTop: 20,

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

        </View>
    );
}