import {
    createNativeStackNavigator,
} from "@react-navigation/native-stack";

import NotesScreen from "../screens/NotesScreen";

import NoteEditorScreen from "../screens/NoteEditorScreen";

import NoteViewScreen from "../screens/NoteViewScreen";

const Stack = createNativeStackNavigator<any>();

export default function ScreenStack() {

    return (

        <Stack.Navigator

            screenOptions={{

                headerTitleAlign: "center",
                headerShadowVisible: false,
                headerTitleStyle: {
                    fontSize: 18,
                },
            }}

        >

            <Stack.Screen
                name="NotesList"

                component={
                    NotesScreen
                }

                options={{
                    title: "My Notes",
                }}
            />

            <Stack.Screen
                name="NoteEditor"

                component={
                    NoteEditorScreen
                }

                options={({
                    route,
                }: any) => ({

                    title:
                        route?.params?.note
                            ? "Edit Note"
                            : "Add Note",

                })}
            />

            <Stack.Screen
                name="NoteView"

                component={
                    NoteViewScreen
                }

                options={{
                    title:
                        "View Note",
                }}
            />

        </Stack.Navigator>

    );

}