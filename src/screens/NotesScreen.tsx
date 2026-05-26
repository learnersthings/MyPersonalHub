import {
    View,
    Text,
    FlatList,
    TextInput,
    TouchableOpacity,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import {
    useNavigation,
    useFocusEffect,
} from "@react-navigation/native";

import {
    useCallback,
    useState,
} from "react";

import {
    getNotes,
    saveNotes,
} from "../services/notesStorage";

import { stripHtml }
    from "../utils/htmlUtils";

import {
    globalStyles
} from "../theme/styles";

export default function NotesScreen() {

    const [notes, setNotes] =
        useState<any[]>([]);

    const [
        searchText,
        setSearchText,
    ] = useState("");

    const navigation =
        useNavigation<any>();

    const filteredNotes =
        notes.filter(note =>
            note.title
                .toLowerCase()
                .includes(
                    searchText
                        .toLowerCase()
                )
        );

    useFocusEffect(
        useCallback(() => {
            loadNotes();
        }, [])
    );

    async function loadNotes() {
        const data =
            await getNotes();

        setNotes(data);
    }

    async function deleteNote(
        id: string
    ) {

        const updated =
            notes.filter(
                note =>
                    note.id !==
                    id
            );

        setNotes(updated);

        await saveNotes(
            updated
        );
    }

    async function togglePin(
        id: string
    ) {

        const updated =
            notes.map(note =>
                note.id === id
                    ? {
                        ...note,
                        pinned:
                            !note.pinned,
                    }
                    : note
            );

        updated.sort(
            (a, b) =>
                Number(
                    b.pinned
                ) -
                Number(
                    a.pinned
                )
        );

        setNotes(updated);

        await saveNotes(
            updated
        );
    }

    return (

        <View
            style={
                globalStyles.screen
            }
        >

            {/* SEARCH */}

            <View
                style={
                    globalStyles.input
                }
            >
                <View
                    style={{
                        flexDirection:
                            "row",

                        alignItems:
                            "center",
                    }}
                >
                    <Ionicons
                        name="search-outline"
                        size={20}
                        color="gray"
                    />

                    <TextInput
                        placeholder="Search notes..."
                        value={
                            searchText
                        }
                        onChangeText={
                            setSearchText
                        }
                        style={{
                            flex: 1,
                            paddingHorizontal: 10,
                            fontSize: 16,
                        }}
                    />

                    {
                        searchText.length >
                        0 && (
                            <TouchableOpacity
                                onPress={() =>
                                    setSearchText(
                                        ""
                                    )
                                }
                            >
                                <Ionicons
                                    name="close-circle"
                                    size={20}
                                    color="gray"
                                />
                            </TouchableOpacity>
                        )
                    }

                </View>
            </View>

            {/* NOTES */}

            <FlatList
                data={
                    filteredNotes
                }

                keyExtractor={
                    item =>
                        item.id
                }

                renderItem={({
                    item,
                }) => (

                    <View
                        style={
                            globalStyles.card
                        }
                    >

                        <Text
                            style={{
                                fontSize: 18,
                                fontWeight:
                                    "700",
                            }}
                        >
                            {
                                item.title
                            }
                        </Text>

                        <Text
                            numberOfLines={
                                3
                            }
                            style={{
                                color:
                                    "#777",

                                marginTop:
                                    5,

                                fontSize:
                                    14,
                            }}
                        >
                            {
                                stripHtml(
                                    item.content
                                )
                            }
                        </Text>

                        {/* BUTTONS */}

                        <View
                            style={{
                                flexDirection:
                                    "row",

                                gap: 8,

                                marginTop:
                                    12,
                            }}
                        >

                            <TouchableOpacity
                                onPress={() =>
                                    navigation.navigate(
                                        "NoteEditor",
                                        {
                                            note:
                                                item,
                                        }
                                    )
                                }
                                style={[
                                    globalStyles.button,
                                    {
                                        flex:
                                            1,
                                    },
                                ]}
                            >
                                <Text
                                    style={
                                        globalStyles.buttonText
                                    }
                                >
                                    Edit
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() =>
                                    deleteNote(
                                        item.id
                                    )
                                }
                                style={[
                                    globalStyles.button,
                                    {
                                        flex:
                                            1,

                                        backgroundColor:
                                            "#F44336",
                                    },
                                ]}
                            >
                                <Text
                                    style={
                                        globalStyles.buttonText
                                    }
                                >
                                    Delete
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() =>
                                    togglePin(
                                        item.id
                                    )
                                }
                                style={[
                                    globalStyles.button,
                                    {
                                        flex:
                                            1,

                                        backgroundColor:
                                            "#000",
                                    },
                                ]}
                            >
                                <Text
                                    style={
                                        globalStyles.buttonText
                                    }
                                >
                                    {
                                        item.pinned
                                            ? "Unpin"
                                            : "Pin"
                                    }
                                </Text>
                            </TouchableOpacity>

                        </View>

                        <Text
                            style={{
                                marginTop:
                                    10,

                                color:
                                    "#777",

                                fontSize:
                                    13,
                            }}
                        >
                            {
                                new Date(
                                    item.createdAt
                                )
                                    .toLocaleDateString()
                            }
                        </Text>

                    </View>

                )}
            />

            {/* FAB */}

            <TouchableOpacity
                onPress={() =>
                    navigation.navigate(
                        "NoteEditor"
                    )
                }

                style={
                    globalStyles.floatingButton
                }
            >
                <Ionicons
                    name="add"
                    size={32}
                    color="#fff"
                />
            </TouchableOpacity>

        </View>
    );
}