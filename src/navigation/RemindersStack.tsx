import {
    createNativeStackNavigator,
} from "@react-navigation/native-stack";

import RemindersScreen from "../screens/RemindersScreen";

const Stack =
    createNativeStackNavigator();

export default function RemindersStack() {

    return (

        <Stack.Navigator
            screenOptions={{
                headerShown: false,
            }}
        >

            <Stack.Screen
                name="RemindersMain"
                component={RemindersScreen}
            />

        </Stack.Navigator>
    );
}
