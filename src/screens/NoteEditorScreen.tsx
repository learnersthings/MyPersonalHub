import React, {
    useEffect,
    useState,
    useRef
} from "react";

import {
    View,
    TextInput,
    TouchableOpacity,
    Text,
    Alert,
    KeyboardAvoidingView,
    Platform,
} from "react-native";

import {
    useNavigation,
    useRoute
} from "@react-navigation/native";

import {
    getNotes,
    saveNotes,
} from "../services/notesStorage";

import {
    MaterialIcons
} from "@expo/vector-icons";

import {
    actions,
    RichEditor,
    RichToolbar
} from "react-native-pell-rich-editor";

import {
    useTheme,
} from "../context/ThemeContext";

export default function NoteEditorScreen() {

    const navigation =
        useNavigation<any>();

    const route =
        useRoute<any>();

    const note =
        route.params?.note;

    const {
        colors,
    } = useTheme();

    const [
        title,
        setTitle
    ] = useState("");

    const [
        content,
        setContent
    ] = useState("");

    const richText =
        useRef<RichEditor>(null);

    useEffect(() => {

        if (note) {

            setTitle(
                note.title
            );

            setContent(
                note.content
            );
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

        const notes =
            await getNotes();

        if (note) {

            const updated =
                notes.map((n) =>

                    n.id === note.id

                        ? {
                            ...n,
                            title,
                            content,
                        }

                        : n
                );

            await saveNotes(
                updated
            );

        } else {

            const newNote = {

                id:
                    Date.now()
                        .toString(),

                title,

                content,

                createdAt:
                    new Date()
                        .toISOString(),

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

        <KeyboardAvoidingView

            behavior={
                Platform.OS === "ios"
                    ? "padding"
                    : undefined
            }

            style={{
                flex: 1,
                backgroundColor:
                    colors.background,
            }}
        >

            <View
                style={{
                    flex: 1,
                    padding: 16,
                }}
            >

                <Text
                    style={{
                        fontWeight: "600",
                        marginBottom: 5,
                        color: colors.text,
                    }}
                >

                    Note Title

                </Text>

                <TextInput

                    placeholder="Enter note title..."

                    placeholderTextColor={
                        colors.subText
                    }

                    value={title}

                    onChangeText={
                        setTitle
                    }

                    style={{
                        borderWidth: 1,

                        borderColor:
                            colors.border,

                        borderRadius: 10,

                        paddingHorizontal: 12,

                        paddingVertical: 12,

                        backgroundColor:
                            colors.card,

                        color:
                            colors.text,

                        fontSize: 16,

                        marginBottom: 15,
                    }}
                />

                <Text
                    style={{
                        fontWeight: "600",
                        marginBottom: 5,
                        color: colors.text,
                    }}
                >

                    Note Content

                </Text>

                <View
                    style={{
                        flex: 1,

                        borderWidth: 1,

                        borderColor:
                            colors.border,

                        borderRadius: 10,

                        backgroundColor:
                            colors.card,

                        overflow: "hidden",
                    }}
                >

                    <RichEditor

                        ref={richText}

                        initialContentHTML={
                            content
                        }

                        onChange={(
                            descriptionText
                        ) => {

                            setContent(
                                descriptionText
                            );
                        }}

                        placeholder="Write your note here..."

                        style={{
                            flex: 1,
                            backgroundColor:
                                colors.card,
                        }}

                        initialHeight={200}

                        editorStyle={{
                            backgroundColor:
                                colors.card,

                            color:
                                colors.text,

                            placeholderColor:
                                colors.subText,

                            contentCSSText: `
                                font-size: 16px;
                                color: ${colors.text};
                                background-color: ${colors.card};
                                padding: 10px;
                            `,
                        }}
                    />

                    <RichToolbar

                        editor={richText}

                        actions={[
                            actions.setBold,
                            actions.setItalic,
                            actions.setUnderline,
                            actions.insertBulletsList,
                            actions.insertOrderedList,
                        ]}

                        iconMap={{

                            [actions.setBold]:
                                ({ tintColor }: any) => (

                                    <MaterialIcons
                                        name="format-bold"
                                        size={24}
                                        color={tintColor}
                                    />
                                ),

                            [actions.setItalic]:
                                ({ tintColor }: any) => (

                                    <MaterialIcons
                                        name="format-italic"
                                        size={24}
                                        color={tintColor}
                                    />
                                ),

                            [actions.setUnderline]:
                                ({ tintColor }: any) => (

                                    <MaterialIcons
                                        name="format-underlined"
                                        size={24}
                                        color={tintColor}
                                    />
                                ),

                            [actions.insertBulletsList]:
                                ({ tintColor }: any) => (

                                    <MaterialIcons
                                        name="format-list-bulleted"
                                        size={24}
                                        color={tintColor}
                                    />
                                ),

                            [actions.insertOrderedList]:
                                ({ tintColor }: any) => (

                                    <MaterialIcons
                                        name="format-list-numbered"
                                        size={24}
                                        color={tintColor}
                                    />
                                ),
                        }}

                        iconTint={
                            colors.text
                        }

                        selectedIconTint="#2196F3"

                        style={{
                            backgroundColor:
                                colors.background,

                            borderTopWidth: 1,

                            borderColor:
                                colors.border,
                        }}
                    />

                </View>

                <TouchableOpacity

                    onPress={
                        handleSave
                    }

                    style={{
                        backgroundColor:
                            "#2196F3",

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

                        {
                            note
                                ? "Update Note"
                                : "Save Note"
                        }

                    </Text>

                </TouchableOpacity>

            </View>

        </KeyboardAvoidingView>
    );
}