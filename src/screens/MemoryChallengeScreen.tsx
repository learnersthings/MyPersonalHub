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
    Ionicons,
} from "@expo/vector-icons";

import {
    useTheme,
} from "../context/ThemeContext";

import {
    globalStyles,
} from "../theme/styles";

export default function MemoryChallengeScreen() {

    const {
        colors,
    } = useTheme();

    const [
        sequence,
        setSequence,
    ] = useState("");

    const [
        hidden,
        setHidden,
    ] = useState(true);

    const [
        userAnswer,
        setUserAnswer,
    ] = useState("");

    const [
        result,
        setResult,
    ] = useState("");

    const [
        score,
        setScore,
    ] = useState(0);

    const [
        totalRounds,
        setTotalRounds,
    ] = useState(0);

    const [
        gameStarted,
        setGameStarted,
    ] = useState(false);

    const rounds = [4, 5, 6, 8, 8];

    const [
        currentRound,
        setCurrentRound,
    ] = useState(0);

    const MAX_ROUNDS = 5;

    const [
        gameOver,
        setGameOver,
    ] = useState(false);

    const [
        canSubmit,
        setCanSubmit,
    ] = useState(false);

    function generateSequence() {

        if (
            gameStarted ||
            gameOver
        ) {
            return;
        }

        const digitCount =
            rounds[currentRound];

        if (!digitCount)
            return;

        setGameStarted(true);

        setCanSubmit(false);

        const numbers = [];

        for (
            let i = 0;
            i < digitCount;
            i++
        ) {

            numbers.push(
                Math.floor(
                    Math.random() * 10
                )
            );
        }

        const finalSequence =
            numbers.join(" ");

        setSequence(
            finalSequence
        );

        setHidden(false);

        setUserAnswer("");

        setResult("");

        setCanSubmit(false);

        setTimeout(() => {

            setHidden(true);

            setCanSubmit(true);

        }, 5000);
    }

    function checkAnswer() {

        if (
            !canSubmit ||
            gameOver ||
            userAnswer.trim().length === 0
        ) {
            return;
        }

        setCanSubmit(false);

        setGameStarted(false);

        const cleanUserAnswer =
            userAnswer.replace(/\s/g, "");

        const cleanSequence =
            sequence.replace(/\s/g, "");

        const nextTotal =
            totalRounds + 1;

        setTotalRounds(
            nextTotal
        );

        let nextScore =
            score;

        if (
            cleanUserAnswer
            ===
            cleanSequence
        ) {

            nextScore =
                score + 1;

            setScore(
                nextScore
            );

            setResult(
                `✅ Correct! (${nextScore}/${nextTotal})`
            );

        } else {

            setResult(
                `❌ Wrong! (${score}/${nextTotal})`
            );
        }

        const nextRound =
            currentRound + 1;

        setCurrentRound(
            nextRound
        );

        if (
            nextRound >=
            rounds.length
        ) {

            setGameStarted(false);

            setGameOver(true);

            setTimeout(() => {

                setResult(
                    `🏁 Game Over! Final Score: ${nextScore}/${MAX_ROUNDS}`
                );

                setSequence("");

                setUserAnswer("");

            }, 1500);

            return;
        }

        setTimeout(() => {

            const digitCount =
                rounds[nextRound];

            const numbers = [];

            for (
                let i = 0;
                i < digitCount;
                i++
            ) {

                numbers.push(
                    Math.floor(
                        Math.random() * 10
                    )
                );
            }

            const finalSequence =
                numbers.join(" ");

            setSequence(
                finalSequence
            );

            setHidden(false);

            setUserAnswer("");

            setGameStarted(true);

            setCanSubmit(false);

            setTimeout(() => {

                setHidden(true);

                setCanSubmit(true);

            }, 5000);

        }, 2000);
    }

    function restartGame() {

        setSequence("");

        setHidden(true);

        setUserAnswer("");

        setResult("");

        setScore(0);

        setTotalRounds(0);

        setCurrentRound(0);

        setGameStarted(false);

        setGameOver(false);

        setCanSubmit(false);
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

                    color:
                        colors.text,

                    textAlign: "center",

                    marginBottom: 10,
                }}
            >

                🧠 Memory Challenge

            </Text>

            <Text
                style={{
                    color:
                        colors.subText,

                    textAlign: "center",

                    marginBottom: 30,

                    fontSize: 16,
                }}
            >

                Memorize the sequence before it disappears

            </Text>

            {/* SCORE */}

            <View
                style={{
                    backgroundColor:
                        colors.card,

                    padding: 18,

                    borderRadius: 18,

                    marginBottom: 25,

                    alignItems: "center",
                }}
            >

                <Text
                    style={{
                        color:
                            colors.subText,

                        fontSize: 16,
                    }}
                >

                    Score

                </Text>

                <Text
                    style={{
                        color:
                            colors.primary,

                        fontSize: 40,

                        fontWeight: "800",
                    }}
                >

                    {score}/{MAX_ROUNDS}

                </Text>

            </View>

            {/* MEMORY CARD */}

            <View
                style={{
                    backgroundColor:
                        colors.card,

                    padding: 30,

                    borderRadius: 24,

                    alignItems: "center",

                    marginBottom: 25,

                    minHeight: 140,

                    justifyContent: "center",
                }}
            >

                {
                    sequence.length > 0 ? (

                        <Text
                            style={{
                                fontSize: 36,

                                fontWeight: "800",

                                color:
                                    colors.text,

                                letterSpacing: 6,
                            }}
                        >

                            {
                                hidden
                                    ? "• • • •"
                                    : sequence
                            }

                        </Text>

                    ) : (

                        <Ionicons
                            name="sparkles"
                            size={50}
                            color={
                                colors.primary
                            }
                        />
                    )
                }

            </View>

            {/* INPUT */}

            <TextInput

                placeholder="Enter sequence"

                placeholderTextColor={
                    colors.subText
                }

                value={userAnswer}

                onChangeText={
                    setUserAnswer
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

                    fontSize: 18,

                    marginBottom: 18,

                    textAlign: "center",
                }}
            />

            {/* BUTTONS */}

            <TouchableOpacity

                disabled={
                    gameStarted
                    ||
                    gameOver ||
                    sequence.length > 0
                }

                onPress={
                    generateSequence
                }

                style={[
                    globalStyles.button,
                    {
                        marginBottom: 14,

                        opacity:
                            gameStarted
                                ||
                                gameOver
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

                    Start Challenge

                </Text>

            </TouchableOpacity>

            <TouchableOpacity

                disabled={
                    !canSubmit ||
                    gameOver ||
                    userAnswer.trim().length === 0
                }

                onPress={checkAnswer}

                style={[
                    globalStyles.button,
                    {
                        backgroundColor: "#4CAF50",

                        opacity:
                            !canSubmit ||
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

            {
                gameOver && (

                    <View
                        style={{
                            marginTop: 30,

                            alignItems: "center",
                        }}
                    >

                        <Text
                            style={{
                                fontSize: 28,

                                fontWeight: "800",

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

                                fontWeight: "700",

                                marginBottom: 20,
                            }}
                        >

                            Final Score:
                            {" "}
                            {score}/{MAX_ROUNDS}

                        </Text>

                        <TouchableOpacity

                            onPress={
                                restartGame
                            }

                            style={[
                                globalStyles.button,
                                {
                                    paddingHorizontal: 30,
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
                )
            }

            {/* RESULT */}

            {
                result.length > 0 && (

                    <Text
                        style={{
                            marginTop: 25,

                            textAlign: "center",

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
                )
            }

        </View>
    );
}