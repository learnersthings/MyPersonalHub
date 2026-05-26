import {
    createNativeStackNavigator,
}
    from
    "@react-navigation/native-stack";

import TasksScreen
    from "../screens/TasksScreen";

import TaskEditorScreen
    from "../screens/TaskEditorScreen";

const Stack =
    createNativeStackNavigator();

export default function TasksStack() {

    return (

        <Stack.Navigator

            screenOptions={{
                headerTitleAlign:
                    "center",

                headerShadowVisible:
                    false,

                headerTitleStyle: {
                    fontSize: 18,
                },
            }}

        >

            <Stack.Screen
                name="TasksList"

                component={
                    TasksScreen
                }

                options={{
                    title:
                        "My Tasks",
                }}
            />

            <Stack.Screen
                name="TaskEditor"

                component={
                    TaskEditorScreen
                }

                options={{
                    title:
                        "Create Task",
                }}
            />

        </Stack.Navigator>

    );

}