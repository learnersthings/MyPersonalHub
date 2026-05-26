import {
    View,
    Text,
    FlatList,
    TextInput,
    TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

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
    const [content, setContent] = useState("");

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
                    ? { ...note, title, content }
                    : note
            );

            setNotes(updated);
            await saveNotes(updated);

            setEditingId(null);
        } else {
            const newNote = {
                id: Date.now().toString(),
                title,
                content,
                createdAt: new Date().toISOString(),
                pinned: false,
            };

            const updated = [newNote, ...notes];

            setNotes(updated);
            await saveNotes(updated);
        }

        setTitle("");
        setContent("");
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
        <View style={{
            flex: 1,
            padding: 16,
            backgroundColor: "#f5f5f5",
        }}>
            <Text
                style={{
                    fontWeight: "600",
                    marginBottom: 5,
                }}
            >
                Note Title
            </Text>

            <TextInput
                placeholder="Note title"
                value={title}
                onChangeText={setTitle}
                style={{
                    borderWidth: 1,
                    borderColor: "#ddd",
                    borderRadius: 10,
                    paddingHorizontal: 10,
                    paddingVertical: 12,
                    backgroundColor: "#fff",
                    fontSize: 16,
                    marginBottom: 10,
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
                    borderWidth: 1,
                    borderColor: "#ddd",
                    borderRadius: 10,
                    paddingVertical: 12,
                    paddingHorizontal: 10,
                    minHeight: 120,
                    backgroundColor: "#fff",
                    marginBottom: 15,
                    fontSize: 16,
                }}
            />

            <TouchableOpacity
                onPress={saveNote}
                style={{
                    backgroundColor: "#2196F3",
                    paddingVertical: 14,
                    borderRadius: 10,
                    alignItems: "center",
                    marginBottom: 10,
                }}
            >
                <Text style={{
                    color: "#fff",
                    fontSize: 16,
                    fontWeight: "bold"
                }}>
                    {editingId ? "Update Note" : "Add Note"}
                </Text>
            </TouchableOpacity>

            <Text
                style={{
                    fontSize: 20,
                    fontWeight: "bold",
                    marginBottom: 10,
                }}
            >
                My Notes
            </Text>

            <View style={{
                flexDirection: "row",
                alignItems: "center",
                borderWidth: 1,
                borderColor: "#ddd",
                borderRadius: 10,
                backgroundColor: "#fff",
                marginBottom: 15,
                paddingHorizontal: 10,
            }}>
                <Ionicons
                    name="search-outline"
                    size={20}
                    color="gray"
                />

                <TextInput
                    placeholder="Search notes..."
                    value={searchText}
                    onChangeText={setSearchText}
                    style={{
                        flex: 1,
                        paddingHorizontal: 10,
                        paddingVertical: 12,
                        fontSize: 16,
                    }}
                />

                {searchText.length > 0 && (
                    <TouchableOpacity
                        onPress={() => setSearchText("")}
                    >
                        <Ionicons
                            name="close-circle"
                            size={20}
                            color="gray"
                        />
                    </TouchableOpacity>
                )}
            </View>

            <FlatList
                data={filteredNotes}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View
                        style={{
                            marginBottom: 8,
                            borderWidth: 1,
                            padding: 12,
                        }}
                    >
                        <Text style={{
                            padding: 8,
                            borderRadius: 5,
                            flex: 1,
                            alignItems: "center",
                            backgroundColor: "#fff",
                            justifyContent: "center"
                        }}>{item.title}</Text>

                        <Text
                            numberOfLines={3}
                            style={{
                                color: "#555",
                                marginTop: 5,
                            }}
                        >
                            {item.content}
                        </Text>

                        <View style={{
                            flexDirection: "row",
                            gap: 8,
                            marginTop: 8,
                        }}>
                            <TouchableOpacity
                                onPress={() => {
                                    setTitle(item.title);
                                    setContent(item.content);
                                    setEditingId(item.id);
                                }}
                                style={{
                                    backgroundColor: "blue",
                                    padding: 8,
                                    borderRadius: 5,
                                    flex: 1,
                                    alignItems: "center",
                                    justifyContent: "center"
                                }}
                            >
                                <Text style={{ color: "#fff" }}>Edit</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => deleteNote(item.id)}
                                style={{
                                    backgroundColor: "red",
                                    padding: 8,
                                    borderRadius: 5,
                                    flex: 1,
                                    alignItems: "center",
                                    justifyContent: "center"
                                }}
                            >
                                <Text style={{ color: "#fff" }}>
                                    Delete
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => togglePin(item.id)}
                                style={{
                                    backgroundColor: "black",
                                    padding: 8,
                                    borderRadius: 5,
                                    flex: 1,
                                    alignItems: "center",
                                    justifyContent: "center"
                                }}
                            >
                                <Text style={{ color: "#fff" }}>
                                    {item.pinned
                                        ? "Unpin"
                                        : "Pin"}
                                </Text>
                            </TouchableOpacity>
                        </View>

                        <Text style={{
                            padding: 8,
                            borderRadius: 5,
                            flex: 1,
                            alignItems: "center",
                            justifyContent: "center"
                        }}>
                            {new Date(
                                item.createdAt
                            ).toLocaleDateString()}
                        </Text>
                    </View>
                )
                }
            />

        </View >
    );
}