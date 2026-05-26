import {
    View,
    Text,
    FlatList,
    TextInput,
    TouchableOpacity,
} from "react-native";

import { useEffect, useState } from "react";
import { getNotes, saveNotes } from "../services/notesStorage";

export default function NotesScreen() {
    const [title, setTitle] = useState("");
    const [notes, setNotes] = useState<any[]>([]);

    useEffect(() => {
        loadNotes();
    }, []);

    async function loadNotes() {
        const data = await getNotes();
        setNotes(data);
    }

    async function addNote() {
        if (!title.trim()) return;

        const newNote = {
            id: Date.now().toString(),
            title,
            content: "",
            createdAt: new Date().toISOString(),
        };

        const updated = [newNote, ...notes];

        setNotes(updated);

        await saveNotes(updated);

        setTitle("");
    }

    return (
        <View style={{ flex: 1, padding: 16 }}>

            <TextInput
                placeholder="Note title"
                value={title}
                onChangeText={setTitle}
                style={{
                    borderWidth: 1,
                    padding: 10,
                    marginBottom: 10,
                }}
            />

            <TouchableOpacity
                onPress={addNote}
                style={{
                    backgroundColor: "#2196F3",
                    padding: 12,
                    marginBottom: 15,
                }}
            >
                <Text style={{ color: "#fff" }}>
                    Add Note
                </Text>
            </TouchableOpacity>

            <FlatList
                data={notes}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View
                        style={{
                            borderWidth: 1,
                            padding: 12,
                            marginBottom: 8,
                        }}
                    >
                        <Text>{item.title}</Text>
                    </View>
                )}
            />

        </View>
    );
}