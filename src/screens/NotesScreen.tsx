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

import {
    useTheme,
} from "../context/ThemeContext";

export default function NotesScreen() {

    const [notes, setNotes] =
        useState<any[]>([]);

    const [
        searchText,
        setSearchText,
    ] = useState("");

    const navigation =
        useNavigation<any>();

    const {
        colors,
    } = useTheme();

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
                )

                -

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
            style={[
                globalStyles.screen,
                {
                    backgroundColor:
                        colors.background,
                },
            ]}
        >

            {/* SEARCH */}

            <View
                style={[
                    globalStyles.input,
                    {
                        backgroundColor:
                            colors.card,

                        borderColor:
                            colors.border,
                    },
                ]}
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
                        color={
                            colors.subText
                        }
                    />

                    <TextInput

                        placeholder="Search notes..."

                        placeholderTextColor={
                            colors.subText
                        }

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

                            color:
                                colors.text,
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
                                    color={
                                        colors.subText
                                    }
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
                        style={[
                            globalStyles.card,
                            {
                                backgroundColor:
                                    colors.card,
                            },
                        ]}
                    >

                        <Text
                            style={{
                                fontSize: 18,

                                fontWeight:
                                    "700",

                                color:
                                    colors.text,
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
                                    colors.subText,

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
                                flexDirection: "row",

                                gap: 8,

                                marginTop: 12,
                            }}
                        >

                            {/* EDIT */}

                            <TouchableOpacity

                                onPress={() =>
                                    navigation.navigate(
                                        "NoteEditor",
                                        {
                                            note: item,
                                        }
                                    )
                                }

                                style={[
                                    globalStyles.button,
                                    {
                                        flex: 1,
                                    },
                                ]}
                            >

                                <View
                                    style={{
                                        flexDirection: "row",

                                        alignItems: "center",

                                        gap: 6,
                                    }}
                                >

                                    <Ionicons
                                        name="create-outline"
                                        size={18}
                                        color="#fff"
                                    />

                                    <Text
                                        style={
                                            globalStyles.buttonText
                                        }
                                    >

                                        Edit

                                    </Text>

                                </View>

                            </TouchableOpacity>

                            {/* DELETE */}

                            <TouchableOpacity

                                onPress={() =>
                                    deleteNote(
                                        item.id
                                    )
                                }

                                style={[
                                    globalStyles.button,
                                    {
                                        flex: 1,

                                        backgroundColor:
                                            "#F44336",
                                    },
                                ]}
                            >

                                <View
                                    style={{
                                        flexDirection: "row",

                                        alignItems: "center",

                                        gap: 6,
                                    }}
                                >

                                    <Ionicons
                                        name="trash"
                                        size={18}
                                        color="#fff"
                                    />

                                    <Text
                                        style={
                                            globalStyles.buttonText
                                        }
                                    >

                                        Delete

                                    </Text>

                                </View>

                            </TouchableOpacity>

                            {/* PIN */}

                            <TouchableOpacity

                                onPress={() =>
                                    togglePin(
                                        item.id
                                    )
                                }

                                style={[
                                    globalStyles.button,
                                    {
                                        flex: 1,

                                        backgroundColor:
                                            "#555",
                                    },
                                ]}
                            >

                                <View
                                    style={{
                                        flexDirection: "row",

                                        alignItems: "center",

                                        gap: 6,
                                    }}
                                >

                                    <Ionicons
                                        name={
                                            item.pinned
                                                ? "pin"
                                                : "pin-outline"
                                        }

                                        size={18}

                                        color="#fff"
                                    />

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

                                </View>

                            </TouchableOpacity>

                        </View>

                        <View
                            style={{
                                flexDirection: "row",

                                alignItems: "center",

                                marginTop: 10,
                            }}
                        >

                            <Ionicons
                                name="calendar-outline"
                                size={14}
                                color={
                                    colors.subText
                                }
                            />

                            <Text
                                style={{
                                    marginLeft: 5,

                                    color:
                                        colors.subText,

                                    fontSize: 13,
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