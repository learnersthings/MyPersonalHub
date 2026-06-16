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

export default function RemindersScreen() {

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
                },
            ]}
        >

            {/* Header */}

            <View
                style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 20,
                }}
            >
                <Text
                    style={{
                        fontSize: 32,
                        fontWeight: "800",
                        color: colors.text,
                    }}
                >
                    ⏰ Reminders
                </Text>
            </View>

            <View
                style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <Text
                    style={{
                        color: colors.subText,
                        fontSize: 16,
                    }}
                >
                    No reminders yet. Add one to get started!
                </Text>
            </View>

        </View>
    );
}
