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

export default function ColorMatchScreen() {

    const {
        colors,
    } = useTheme();

    const COLORS = [

        {
            name: "RED",
            value: "red",
        },

        {
            name: "BLUE",
            value: "blue",
        },

        {
            name: "GREEN",
            value: "green",
        },

        {
            name: "YELLOW",
            value: "gold",
        },

        {
            name: "PURPLE",
            value: "purple",
        },

        {
            name: "ORANGE",
            value: "orange",
        },
    ];

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
        timer,
        setTimer,
    ] = useState(15);

    const [
        gameOver,
        setGameOver,
    ] = useState(false);

    const [
        word,
        setWord,
    ] = useState("");

    const [
        displayColor,
        setDisplayColor,
    ] = useState<any>(null);

    const [
        options,
        setOptions,
    ] = useState<any[]>([]);

    const [
        result,
        setResult,
    ] = useState("");

    function shuffleArray(
        array: any[]
    ) {

        return [...array]
            .sort(
                () =>
                    Math.random() - 0.5
            );
    }

    function generateQuestion() {

        const wordColor =
            COLORS[
            Math.floor(
                Math.random() *
                COLORS.length
            )
            ];

        let actualColor =
            COLORS[
            Math.floor(
                Math.random() *
                COLORS.length
            )
            ];

        while (
            actualColor.name ===
            wordColor.name
        ) {

            actualColor =
                COLORS[
                Math.floor(
                    Math.random() *
                    COLORS.length
                )
                ];
        }

        setWord(
            wordColor.name
        );

        setDisplayColor(
            actualColor
        );

        setOptions(
            shuffleArray(
                COLORS
            )
        );

        setTimer(10);

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

            handleAnswer("");

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

    function nextRound() {

        if (
            round >=
            MAX_ROUNDS
        ) {

            setGameOver(
                true
            );

            return;
        }

        setRound(
            prev =>
                prev + 1
        );

        generateQuestion();
    }

    function handleAnswer(
        answer: string
    ) {

        if (
            gameOver
        ) {
            return;
        }

        if (
            answer ===
            displayColor.name
        ) {

            setScore(
                prev =>
                    prev + 1
            );

            setResult(
                "✅ Correct"
            );

        } else {

            setResult(
                `❌ Wrong (Answer: ${displayColor.name})`
            );
        }

        setTimeout(
            () => {

                nextRound();

            },
            1000
        );
    }

    function restartGame() {

        setRound(1);

        setScore(0);

        setGameOver(false);

        setTimer(15);

        setResult("");

        generateQuestion();
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
                🎨 Color Match
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
                                fontSize: 18,
                            }}
                        >
                            Round {round}/{MAX_ROUNDS}
                        </Text>

                        <Text
                            style={{
                                color:
                                    colors.primary,
                                textAlign:
                                    "center",
                                fontSize: 18,
                            }}
                        >
                            Score: {score}
                        </Text>

                        <Text
                            style={{
                                color:
                                    timer <= 5
                                        ? "#F44336"
                                        : colors.text,
                                textAlign:
                                    "center",
                                fontSize: 18,
                                marginBottom: 25,
                            }}
                        >
                            Time: {timer}s
                        </Text>

                        <View
                            style={{
                                backgroundColor:
                                    colors.card,

                                padding: 30,

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
                                        displayColor?.value,
                                }}
                            >
                                {word}
                            </Text>

                        </View>

                        {
                            options.map(
                                (
                                    item,
                                    index
                                ) => (

                                    <TouchableOpacity

                                        key={index}

                                        onPress={() =>
                                            handleAnswer(
                                                item.name
                                            )
                                        }

                                        style={[
                                            globalStyles.button,
                                            {
                                                marginBottom: 10,
                                            },
                                        ]}
                                    >

                                        <Text
                                            style={
                                                globalStyles.buttonText
                                            }
                                        >
                                            {item.name}
                                        </Text>

                                    </TouchableOpacity>
                                )
                            )
                        }

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
                            Final Score: {score}/{MAX_ROUNDS}
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