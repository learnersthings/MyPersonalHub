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

export default function MathChallengeScreen() {

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

    function generateQuestion() {

        let a = 0;
        let b = 0;

        let question = "";
        let answer = 0;

        if (
            difficulty === "Easy"
        ) {

            a =
                Math.floor(
                    Math.random() * 20
                ) + 1;

            b =
                Math.floor(
                    Math.random() * 20
                ) + 1;

            question =
                `${a} + ${b}`;

            answer =
                a + b;

        } else if (
            difficulty === "Medium"
        ) {

            a =
                Math.floor(
                    Math.random() * 12
                ) + 1;

            b =
                Math.floor(
                    Math.random() * 12
                ) + 1;

            question =
                `${a} × ${b}`;

            answer =
                a * b;

        } else {

            b =
                Math.floor(
                    Math.random() * 12
                ) + 1;

            answer =
                Math.floor(
                    Math.random() * 12
                ) + 1;

            a =
                b * answer;

            question =
                `${a} ÷ ${b}`;
        }

        return {
            question,
            answer:
                answer.toString(),
        };
    }

    const [
        currentQuestion,
        setCurrentQuestion,
    ] = useState(
        generateQuestion()
    );

    function checkAnswer() {

        if (
            userAnswer.trim().length === 0
        ) {
            return;
        }

        let nextScore =
            score;

        if (
            userAnswer.trim()
            ===
            currentQuestion.answer
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
                `❌ Wrong (Answer: ${currentQuestion.answer})`
            );
        }

        if (
            round >= MAX_ROUNDS
        ) {

            setTimeout(() => {

                setGameOver(true);

            }, 1000);

            return;
        }

        setTimeout(() => {

            setRound(
                prev => prev + 1
            );

            setCurrentQuestion(
                generateQuestion()
            );

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

        setCurrentQuestion(
            generateQuestion()
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
                    color: colors.text,
                    marginBottom: 25,
                }}
            >

                ➗ Math Challenge

            </Text>

            <View
                style={{
                    flexDirection: "row",
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

                            onPress={() =>
                                setDifficulty(
                                    level
                                )
                            }

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

                    padding: 30,

                    borderRadius: 20,

                    marginBottom: 20,
                }}
            >

                <Text
                    style={{
                        fontSize: 36,

                        textAlign: "center",

                        fontWeight: "800",

                        color:
                            colors.text,
                    }}
                >

                    {
                        currentQuestion.question
                    }

                </Text>

            </View>

            <TextInput

                value={userAnswer}

                onChangeText={
                    setUserAnswer
                }

                keyboardType="number-pad"

                placeholder="Answer"

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
                    textAlign: "center",

                    marginTop: 20,

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

                    marginTop: 5,

                    color:
                        colors.primary,

                    fontSize: 18,
                }}
            >

                Score {score}/{MAX_ROUNDS}

            </Text>

            {
                result.length > 0 && (

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