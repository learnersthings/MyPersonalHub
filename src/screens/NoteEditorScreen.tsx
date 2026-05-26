import { useEffect, useState } from "react";
import {
    View,
    TextInput,
    TouchableOpacity,
    Text,
    Alert,
} from "react-native";

import { useNavigation, useRoute } from "@react-navigation/native";

import {
    getNotes,
    saveNotes,
} from "../services/notesStorage";

export default function NoteEditorScreen() {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();

    const note = route.params?.note;

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    useEffect(() => {
        if (note) {
            setTitle(note.title);
            setContent(note.content);
        }
    }, [note]);

    async function handleSave() {
        if (!title.trim()) {
            Alert.alert(
                "Validation",
                "Please enter a title."
            );
            return;
        }

        const notes = await getNotes();

        if (note) {
            const updated = notes.map((n) =>
                n.id === note.id
                    ? {
                        ...n,
                        title,
                        content,
                    }
                    : n
            );

            await saveNotes(updated);
        } else {
            const newNote = {
                id: Date.now().toString(),
                title,
                content,
                createdAt: new Date().toISOString(),
                pinned: false,
            };

            await saveNotes([
                newNote,
                ...notes,
            ]);
        }

        navigation.goBack();
    }

    return (
        <View
            style={{
                flex: 1,
                padding: 16,
                backgroundColor: "#f5f5f5",
            }}
        >
            <Text
                style={{
                    fontWeight: "600",
                    marginBottom: 5,
                }}
            >
                Note Title
            </Text>

            <TextInput
                placeholder="Enter note title..."
                value={title}
                onChangeText={setTitle}
                style={{
                    borderWidth: 1,
                    borderColor: "#ddd",
                    borderRadius: 10,
                    paddingHorizontal: 12,
                    paddingVertical: 12,
                    backgroundColor: "#fff",
                    fontSize: 16,
                    marginBottom: 15,
                }}
            />

            <Text
                style={{
                    fontWeight: "600",
                    marginBottom: 5,
                }}
            >
                Note Content
            </Text>

            <TextInput
                placeholder="Write your note..."
                value={content}
                onChangeText={setContent}
                multiline
                textAlignVertical="top"
                style={{
                    flex: 1,
                    borderWidth: 1,
                    borderColor: "#ddd",
                    borderRadius: 10,
                    padding: 12,
                    backgroundColor: "#fff",
                    fontSize: 16,
                }}
            />

            <TouchableOpacity
                onPress={handleSave}
                style={{
                    backgroundColor: "#2196F3",
                    padding: 14,
                    borderRadius: 10,
                    marginTop: 15,
                    alignItems: "center",
                }}
            >
                <Text
                    style={{
                        color: "#fff",
                        fontSize: 16,
                        fontWeight: "bold",
                    }}
                >
                    {note
                        ? "Update Note"
                        : "Save Note"}
                </Text>
            </TouchableOpacity>
        </View>
    );
}