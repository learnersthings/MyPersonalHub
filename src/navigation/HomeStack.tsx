import {
    createNativeStackNavigator,
} from "@react-navigation/native-stack";

import HomeScreen from "../screens/HomeScreen";

import BrainActivityScreen from "../screens/BrainActivityScreen";

import PatternChallengeScreen from "../screens/PatternChallengeScreen";

import MathChallengeScreen from "../screens/MathChallengeScreen";

import ReactionChallengeScreen from "../screens/ReactionChallengeScreen";

import WordPuzzleScreen from "../screens/WordPuzzleScreen";

import VisualMemoryScreen from "../screens/VisualMemoryScreen";

import ColorMatchScreen from "../screens/ColorMatchScreen";

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
                name="NumberRecall"
                component={NumberRecallScreen}
            />

            <Stack.Screen
                name="PatternChallenge"
                component={PatternChallengeScreen}
            />

            <Stack.Screen
                name="MathChallenge"
                component={MathChallengeScreen}
            />

            <Stack.Screen
                name="ReactionChallenge"
                component={ReactionChallengeScreen}
            />

            <Stack.Screen
                name="WordPuzzle"
                component={WordPuzzleScreen}
            />

            <Stack.Screen
                name="VisualMemory"
                component={VisualMemoryScreen}
            />

            <Stack.Screen
                name="ColorMatch"
                component={ColorMatchScreen}
            />

            <Stack.Screen
                name="QuickDecision"
                component={QuickDecisionScreen}
            />

        </Stack.Navigator>
    );
}