import { StyleSheet } from "react-native";

import colors from "./colors";

export const globalStyles =
    StyleSheet.create({

        screen: {
            flex: 1,

            backgroundColor:
                colors.background,

            padding: 16,
        },

        input: {

            backgroundColor:
                colors.white,

            borderWidth: 1,

            borderColor:
                colors.border,

            borderRadius: 10,

            paddingHorizontal: 12,

            paddingVertical: 10,

            marginBottom: 12,
        },

        card: {

            backgroundColor:
                colors.white,

            padding: 15,

            borderRadius: 12,

            marginBottom: 12,

            elevation: 3,
        },

        button: {

            backgroundColor:
                colors.primary,

            paddingVertical: 10,

            borderRadius: 8,

            justifyContent:
                "center",

            alignItems:
                "center",
        },

        buttonText: {

            color:
                colors.white,

            fontSize: 16,

            fontWeight:
                "600",
        },

        floatingButton: {

            position:
                "absolute",

            right: 20,

            bottom: 20,

            width: 60,

            height: 60,

            borderRadius: 30,

            backgroundColor:
                colors.primary,

            justifyContent:
                "center",

            alignItems:
                "center",

            elevation: 5,

            shadowColor:
                "#000",

            shadowOpacity:
                0.2,

            shadowOffset: {
                width: 0,
                height: 2,
            },

            shadowRadius: 4,
        },

    });