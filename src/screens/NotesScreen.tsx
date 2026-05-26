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
    const [searchText, setSearchText] = useState("");
    const filteredNotes = notes.filter(note =>
        note.title
            .toLowerCase()
            .includes(searchText.toLowerCase())
    );
    const [editingId, setEditingId] =
        useState<string | null>(null);

    useEffect(() => {
        loadNotes();
    }, []);

    async function loadNotes() {
        const data = await getNotes();
        setNotes(data);
    }

    async function saveNote() {
        if (!title.trim()) return;

        if (editingId) {
            const updated = notes.map(note =>
                note.id === editingId
                    ? { ...note, title }
                    : note
            );

            setNotes(updated);
            await saveNotes(updated);

            setEditingId(null);
        } else {
            const newNote = {
                id: Date.now().toString(),
                title,
                content: "",
                createdAt: new Date().toISOString(),
                pinned: false,
            };

            const updated = [newNote, ...notes];

            setNotes(updated);
            await saveNotes(updated);
        }

        setTitle("");
    }

    async function deleteNote(id: string) {
        const updated = notes.filter(
            note => note.id !== id
        );

        setNotes(updated);

        await saveNotes(updated);
    }

    async function togglePin(id: string) {

        const updated = notes.map(note =>
            note.id === id
                ? {
                    ...note,
                    pinned: !note.pinned,
                }
                : note
        );

        updated.sort(
            (a, b) =>
                Number(b.pinned) -
                Number(a.pinned)
        );

        setNotes(updated);

        await saveNotes(updated);
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
                onPress={saveNote}
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

            <TextInput
                placeholder="Search notes..."
                value={searchText}
                onChangeText={setSearchText}
                style={{
                    borderWidth: 1,
                    padding: 10,
                    marginBottom: 10,
                }}
            />

            <FlatList
                data={filteredNotes}
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

                        <TouchableOpacity
                            onPress={() => {
                                setTitle(item.title);
                                setEditingId(item.id);
                            }}
                            style={{
                                marginTop: 10,
                                backgroundColor: "blue",
                                padding: 8,
                                borderRadius: 5,
                            }}
                        >
                            <Text style={{ color: "#fff" }}>Edit</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => deleteNote(item.id)}
                            style={{
                                marginTop: 10,
                                backgroundColor: "red",
                                padding: 8,
                                borderRadius: 5,
                            }}
                        >
                            <Text style={{ color: "#fff" }}>
                                Delete
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => togglePin(item.id)}
                            style={{
                                marginTop: 10,
                                backgroundColor: "black",
                                padding: 8,
                                borderRadius: 5,
                            }}
                        >
                            <Text style={{ color: "#fff" }}>
                                {item.pinned
                                    ? "Unpin"
                                    : "Pin"}
                            </Text>
                        </TouchableOpacity>

                        <Text>
                            {new Date(
                                item.createdAt
                            ).toLocaleDateString()}
                        </Text>
                    </View>
                )}
            />

        </View>
    );
}