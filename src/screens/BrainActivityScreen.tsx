import {
    View,
    Text,
} from "react-native";

import {
    useTheme,
} from "../context/ThemeContext";

import {
    globalStyles,
} from "../theme/styles";

export default function BrainActivityScreen() {

    const {
        colors,
    } = useTheme();

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
                    color:
                        colors.text,

                    fontSize: 26,

                    fontWeight: "700",
                }}
            >

                🧠 Brain Activity

            </Text>

        </View>
    );
}