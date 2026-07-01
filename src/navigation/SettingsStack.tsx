import { createNativeStackNavigator } from "@react-navigation/native-stack";

import SettingsScreen from "../screens/SettingsScreen";
import ManageCategoriesScreen from "../screens/ManageCategoriesScreen";
import UserProfileScreen from "../screens/UserProfileScreen";

import ManageStepsScreen from "../screens/ManageStepsScreen";

const Stack = createNativeStackNavigator();

export default function SettingsStack() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="SettingsMain" component={SettingsScreen} />
            <Stack.Screen name="ManageCategories" component={ManageCategoriesScreen} />
            <Stack.Screen name="ManageSteps" component={ManageStepsScreen} />
            <Stack.Screen name="UserProfile" component={UserProfileScreen} />
        </Stack.Navigator>
    );
}
