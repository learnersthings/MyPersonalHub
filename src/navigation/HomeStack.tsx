import {
    createNativeStackNavigator,
} from "@react-navigation/native-stack";

import HomeScreen from "../screens/HomeScreen";

import BrainActivityScreen from "../screens/BrainActivityScreen";

import BrainDashboardScreen from "../screens/BrainDashboardScreen";

import ReactionChallengeScreen from "../screens/ReactionChallengeScreen";

import NumberRecallScreen from "../screens/NumberRecallScreen";

import QuickDecisionScreen from "../screens/QuickDecisionScreen";

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
                name="BrainDashboard"
                component={BrainDashboardScreen}
            />

            <Stack.Screen
                name="NumberRecall"
                component={NumberRecallScreen}
            />

            <Stack.Screen
                name="ReactionChallenge"
                component={ReactionChallengeScreen}
            />

            <Stack.Screen
                name="QuickDecision"
                component={QuickDecisionScreen}
            />

        </Stack.Navigator>
    );
}