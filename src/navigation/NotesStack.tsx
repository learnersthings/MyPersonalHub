import { createNativeStackNavigator }
    from "@react-navigation/native-stack";

import NotesScreen from "../screens/NotesScreen";
import NoteEditorScreen
    from "../screens/NoteEditorScreen";

const Stack = createNativeStackNavigator();

export default function NotesStack() {
    return (
        <Stack.Navigator screenOptions={{
            headerTitleAlign: "center",
            headerShadowVisible: false,
            headerTitleStyle: {
                fontSize: 18,
            },
        }}>
            <Stack.Screen
                name="NotesList"
                component={NotesScreen}
                options={{
                    title: "My Notes",
                }}
            />

            <Stack.Screen
                name="NoteEditor"
                component={NoteEditorScreen}
                options={({ route }) => ({
                    title: route.params?.note
                        ? "Edit Note"
                        : "Add Note",
                })}
            />
        </Stack.Navigator>
    );
}