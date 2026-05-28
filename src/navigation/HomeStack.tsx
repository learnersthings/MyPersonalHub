import {
    createNativeStackNavigator,
} from "@react-navigation/native-stack";

import HomeScreen from "../screens/HomeScreen";

import BrainActivityScreen from "../screens/BrainActivityScreen";

import MemoryChallengeScreen from "../screens/MemoryChallengeScreen";

const Stack = createNativeStackNavigator();

export default function HomeStack() {

    return (

        <Stack.Navigator
            screenOptions={{
                headerShown: false,
            }}
        >

            <Stack.Screen
                name="HomeScreen"
                component={HomeScreen}
            />

            <Stack.Screen
                name="BrainActivity"
                component={BrainActivityScreen}
            />

            <Stack.Screen
                name="MemoryChallenge"
                component={MemoryChallengeScreen}
            />

        </Stack.Navigator>
    );
}