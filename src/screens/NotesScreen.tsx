import {
    View,
    Text,
    FlatList,
    TextInput,
    TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation }
    from "@react-navigation/native";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";

import { useEffect, useState } from "react";
import { getNotes, saveNotes } from "../services/notesStorage";

export default function NotesScreen() {
    const [notes, setNotes] = useState<any[]>([]);
    const [searchText, setSearchText] = useState("");
    const filteredNotes = notes.filter(note =>
        note.title
            .toLowerCase()
            .includes(searchText.toLowerCase())
    );
    const navigation = useNavigation<any>();

    useFocusEffect(
        useCallback(() => {
            loadNotes();
        }, [])
    );

    async function loadNotes() {
        const data = await getNotes();
        setNotes(data);
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
                            backgroundColor: "#fff",
                            borderRadius: 12,
                            padding: 12,
                            marginBottom: 12,
                            elevation: 3,
                        }}
                    >
                        <Text style={{
                            fontSize: 18,
                            fontWeight: "bold",
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
                                onPress={() =>
                                    navigation.navigate("NoteEditor", {
                                        note: item,
                                    })
                                }
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

            <TouchableOpacity
                onPress={() =>
                    navigation.navigate("NoteEditor")
                }
                style={{
                    position: "absolute",
                    right: 20,
                    bottom: 20,
                    width: 60,
                    height: 60,
                    borderRadius: 30,
                    backgroundColor: "#2196F3",
                    justifyContent: "center",
                    alignItems: "center",
                    elevation: 5,
                }}
            >
                <Ionicons
                    name="add"
                    size={32}
                    color="#fff"
                />
            </TouchableOpacity>

        </View >
    );
}