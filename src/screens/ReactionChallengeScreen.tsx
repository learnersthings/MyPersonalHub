import {
    View,
    Text,
    TouchableOpacity,
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

export default function ReactionTimeScreen() {

    const { colors } = useTheme();

    const [status, setStatus] =
        useState("idle");

    const [result, setResult] =
        useState<number | null>(null);

    const [startTime, setStartTime] =
        useState(0);

    function startGame() {

        setStatus("waiting");

        setResult(null);

        const delay =
            Math.random() * 3000 + 2000;

        setTimeout(() => {

            setStatus("ready");

            setStartTime(
                Date.now()
            );

        }, delay);
    }

    function handleTap() {

        if (
            status === "waiting"
        ) {

            setStatus("idle");

            setResult(-1);

            return;
        }

        if (
            status === "ready"
        ) {

            const reactionTime =
                Date.now() - startTime;

            setResult(
                reactionTime
            );

            setStatus("finished");
        }
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

                    alignItems:
                        "center",
                },
            ]}
        >

            <Text
                style={{
                    fontSize: 30,
                    fontWeight: "800",
                    color: colors.text,
                    marginBottom: 30,
                }}
            >
                ⚡ Reaction Time
            </Text>

            {
                status === "idle" && (

                    <TouchableOpacity
                        onPress={startGame}
                        style={
                            globalStyles.button
                        }
                    >

                        <Text
                            style={
                                globalStyles.buttonText
                            }
                        >
                            Start
                        </Text>

                    </TouchableOpacity>
                )
            }

            {
                status === "waiting" && (

                    <TouchableOpacity
                        onPress={handleTap}
                        style={{
                            backgroundColor:
                                "#F44336",

                            padding: 50,

                            borderRadius: 20,
                        }}
                    >

                        <Text
                            style={{
                                color: "#fff",
                                fontSize: 28,
                                fontWeight: "700",
                            }}
                        >
                            Wait...
                        </Text>

                    </TouchableOpacity>
                )
            }

            {
                status === "ready" && (

                    <TouchableOpacity
                        onPress={handleTap}
                        style={{
                            backgroundColor:
                                "#4CAF50",

                            padding: 50,

                            borderRadius: 20,
                        }}
                    >

                        <Text
                            style={{
                                color: "#fff",
                                fontSize: 28,
                                fontWeight: "700",
                            }}
                        >
                            TAP NOW!
                        </Text>

                    </TouchableOpacity>
                )
            }

            {
                status === "finished" && (

                    <>
                        <Text
                            style={{
                                color:
                                    colors.primary,

                                fontSize: 42,

                                fontWeight: "800",

                                marginBottom: 20,
                            }}
                        >
                            {result} ms
                        </Text>

                        <TouchableOpacity
                            onPress={startGame}
                            style={
                                globalStyles.button
                            }
                        >
                            <Text
                                style={
                                    globalStyles.buttonText
                                }
                            >
                                Try Again
                            </Text>
                        </TouchableOpacity>
                    </>
                )
            }

            {
                result === -1 && (

                    <>
                        <Text
                            style={{
                                color: "#F44336",
                                fontSize: 22,
                                fontWeight: "700",
                                marginTop: 20,
                            }}
                        >
                            Too Early!
                        </Text>

                        <TouchableOpacity
                            onPress={startGame}
                            style={[
                                globalStyles.button,
                                {
                                    marginTop: 20,
                                },
                            ]}
                        >
                            <Text
                                style={
                                    globalStyles.buttonText
                                }
                            >
                                Retry
                            </Text>
                        </TouchableOpacity>
                    </>
                )
            }

        </View>
    );
}