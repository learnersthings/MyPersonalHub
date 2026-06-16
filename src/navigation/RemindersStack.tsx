import {
    createNativeStackNavigator,
} from "@react-navigation/native-stack";

import RemindersScreen from "../screens/RemindersScreen";
import ReminderEditorScreen from "../screens/ReminderEditorScreen";

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

            <Stack.Screen
                name="ReminderEditor"
                component={ReminderEditorScreen}
            />

        </Stack.Navigator>
    );
}
