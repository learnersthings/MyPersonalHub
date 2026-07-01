import {
    createNativeStackNavigator,
} from "@react-navigation/native-stack";

import HomeScreen from "../screens/HomeScreen";


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


        </Stack.Navigator>
    );
}