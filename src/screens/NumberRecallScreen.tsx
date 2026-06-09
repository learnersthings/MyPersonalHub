import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
} from "react-native";

import {
    useState,
    useRef,
} from "react";

import {
    useTheme,
} from "../context/ThemeContext";

import {
    globalStyles,
} from "../theme/styles";

export default function NumberRecallScreen() {

    const {
        colors,
    } = useTheme();

    const rounds = [
        3,
        4,
        5,
        6,
        8,
    ];

    const MAX_ROUNDS = 5;

    const [
        currentRound,
        setCurrentRound,
    ] = useState(0);

    const [
        number,
        setNumber,
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
        canSubmit,
        setCanSubmit,
    ] = useState(false);

    const inputRef =
        useRef(null);

    function generateRound() {

        const digits =
            rounds[currentRound];

        let generated =
            "";

        for (
            let i = 0;
            i < digits;
            i++
        ) {

            generated +=
                Math.floor(
                    Math.random() * 10
                );
        }

        setNumber(
            generated
        );

        setHidden(false);

        setUserAnswer("");

        setResult("");

        setCanSubmit(false);

        setTimeout(() => {

            setHidden(true);

            setCanSubmit(true);

            setTimeout(() => {

                (
                    inputRef.current as any
                )?.focus();

            }, 200);

        }, 3000);
    }

    function startGame() {

        generateRound();
    }

    function checkAnswer() {

        if (
            !canSubmit
        ) {
            return;
        }

        (
            inputRef.current as any
        )?.blur();

        let nextScore =
            score;

        if (
            userAnswer ===
            number
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
                `❌ Wrong (${number})`
            );
        }

        const nextRound =
            currentRound + 1;

        if (
            nextRound >=
            MAX_ROUNDS
        ) {

            setTimeout(() => {

                setGameOver(
                    true
                );

            }, 1500);

            return;
        }

        setTimeout(() => {

            setCurrentRound(
                nextRound
            );

            const digits =
                rounds[nextRound];

            let generated =
                "";

            for (
                let i = 0;
                i < digits;
                i++
            ) {

                generated +=
                    Math.floor(
                        Math.random() * 10
                    );
            }

            setNumber(
                generated
            );

            setHidden(false);

            setUserAnswer("");

            setCanSubmit(false);

            setResult("");

            setTimeout(() => {

                setHidden(true);

                setCanSubmit(true);

                setTimeout(() => {

                    (
                        inputRef.current as any
                    )?.focus();

                }, 200);

            }, 3000);

        }, 1500);
    }

    function restartGame() {

        setCurrentRound(0);

        setNumber("");

        setHidden(true);

        setUserAnswer("");

        setScore(0);

        setResult("");

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
                    marginBottom: 25,
                }}
            >
                🔢 Number Recall
            </Text>

            {
                !gameOver && (

                    <>

                        <Text
                            style={{
                                color:
                                    colors.primary,
                                textAlign:
                                    "center",
                                marginBottom: 15,
                                fontSize: 18,
                            }}
                        >
                            Round {currentRound + 1}/{MAX_ROUNDS}
                        </Text>

                        <View
                            style={{
                                backgroundColor:
                                    colors.card,

                                padding: 35,

                                borderRadius: 20,

                                marginBottom: 25,

                                alignItems:
                                    "center",
                            }}
                        >

                            <Text
                                style={{
                                    fontSize: 42,

                                    fontWeight:
                                        "800",

                                    color:
                                        colors.text,
                                }}
                            >
                                {
                                    number.length > 0
                                        ? (
                                            hidden
                                                ? "• • • •"
                                                : number
                                        )
                                        : "?"
                                }
                            </Text>

                        </View>

                        <TextInput

                            ref={inputRef}

                            value={userAnswer}

                            onChangeText={
                                setUserAnswer
                            }

                            keyboardType="number-pad"

                            editable={
                                canSubmit
                            }

                            placeholder="Enter Number"

                            placeholderTextColor={
                                colors.subText
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

                        {
                            number.length === 0 ? (

                                <TouchableOpacity

                                    onPress={
                                        startGame
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
                                        Start Challenge
                                    </Text>

                                </TouchableOpacity>

                            ) : (

                                <TouchableOpacity

                                    onPress={
                                        checkAnswer
                                    }

                                    disabled={
                                        !canSubmit ||
                                        userAnswer.length === 0
                                    }

                                    style={[
                                        globalStyles.button,
                                        {
                                            opacity:
                                                !canSubmit ||
                                                    userAnswer.length === 0
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

                            )
                        }

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
                            Score: {score}/{MAX_ROUNDS}
                        </Text>

                        {
                            result.length > 0 && (

                                <Text
                                    style={{
                                        textAlign:
                                            "center",

                                        marginTop: 15,

                                        fontSize: 18,

                                        fontWeight:
                                            "700",
                                    }}
                                >
                                    {result}
                                </Text>
                            )
                        }

                    </>

                )
            }

            {
                gameOver && (

                    <View
                        style={{
                            flex: 1,
                            justifyContent:
                                "center",
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
                                marginBottom: 15,
                            }}
                        >
                            🎉 Game Over
                        </Text>

                        <Text
                            style={{
                                fontSize: 22,
                                color:
                                    colors.primary,
                                marginBottom: 25,
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