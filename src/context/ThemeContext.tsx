import {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";

import AsyncStorage
    from "@react-native-async-storage/async-storage";

import {
    darkTheme,
    lightTheme,
} from "../theme/colors";

const ThemeContext =
    createContext<any>({
        darkMode: false,

        toggleTheme: () => { },

        colors: lightTheme,
    });

export function ThemeProvider({
    children,
}: any) {

    const [
        darkMode,
        setDarkMode,
    ] = useState(false);

    useEffect(() => {

        loadTheme();

    }, []);

    async function loadTheme() {

        try {

            const saved =
                await AsyncStorage.getItem(
                    "darkMode"
                );

            if (saved !== null) {

                setDarkMode(
                    JSON.parse(saved)
                );
            }

        } catch (error) {

            console.log(
                "Theme load error:",
                error
            );
        }
    }

    async function toggleTheme(
        value: boolean
    ) {

        try {

            setDarkMode(value);

            await AsyncStorage.setItem(
                "darkMode",
                JSON.stringify(value)
            );

        } catch (error) {

            console.log(
                "Theme save error:",
                error
            );
        }
    }

    return (

        <ThemeContext.Provider
            value={{
                darkMode,

                toggleTheme,

                colors:
                    darkMode
                        ? darkTheme
                        : lightTheme,
            }}
        >

            {children}

        </ThemeContext.Provider>
    );
}

export function useTheme() {

    return useContext(
        ThemeContext
    );
}