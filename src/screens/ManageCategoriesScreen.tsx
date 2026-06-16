import { View, Text, TextInput, TouchableOpacity, ScrollView, FlatList, Modal, Alert } from "react-native";
import { useState, useCallback } from "react";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { getCategories, saveCategories } from "../services/categoryStorage";
import { Category } from "../types/Category";
import { globalStyles } from "../theme/styles";
import { useTheme } from "../context/ThemeContext";

const ICONS = [
    "person", "book", "briefcase", "barbell", "cart", "train", "ellipsis-horizontal", "home", 
    "star", "heart", "airplane", "cafe", "camera", "car", "medical", "musical-notes", "paw", 
    "restaurant", "school", "wallet", "game-controller", "globe", "rocket", "bicycle", "boat", 
    "bus", "flask", "desktop", "phone-portrait", "watch", "basketball", "football", "tennisball", 
    "musical-note", "color-palette", "brush", "cut", "hammer", "build", "bug", "bed", "flower", 
    "leaf", "flame", "water", "snow", "moon", "sunny", "umbrella", "pizza", "wine", "beer", 
    "ice-cream", "fast-food", "gift", "balloon", "cash", "pie-chart", "trending-up", "mic", 
    "headset", "film", "images", "document", "folder", "mail", "chatbubbles", "calendar", 
    "time", "alarm", "stopwatch", "key", "lock-closed", "shield", "checkmark-circle", 
    "alert-circle", "information-circle", "help-circle", "fitness"
];

const COLORS = [
    "#F44336", "#E91E63", "#9C27B0", "#673AB7", "#3F51B5", "#2196F3", "#03A9F4", "#00BCD4", 
    "#009688", "#4CAF50", "#8BC34A", "#CDDC39", "#FFEB3B", "#FFC107", "#FF9800", "#FF5722", 
    "#795548", "#9E9E9E", "#607D8B", "#43B581", "#7F8C8D", "#2ECC71", "#1ABC9C", "#3498DB", 
    "#9B59B6", "#34495E", "#F1C40F", "#E67E22", "#E74C3C", "#FF4081", "#E040FB", "#7C4DFF"
];

export default function ManageCategoriesScreen() {
    const navigation = useNavigation<any>();
    const { colors } = useTheme();

    const [categories, setCategories] = useState<Category[]>([]);
    const [isModalVisible, setModalVisible] = useState(false);
    
    // Form state
    const [editingId, setEditingId] = useState<string | null>(null);
    const [name, setName] = useState("");
    const [selectedColor, setSelectedColor] = useState<string>("");
    const [selectedIcon, setSelectedIcon] = useState<string>("");

    useFocusEffect(
        useCallback(() => {
            loadCategories();
        }, [])
    );

    async function loadCategories() {
        const data = await getCategories();
        setCategories(data);
    }

    function openModal(cat?: Category) {
        if (cat) {
            setEditingId(cat.id);
            setName(cat.name);
            setSelectedColor(cat.color);
            setSelectedIcon(cat.icon);
        } else {
            setEditingId(null);
            setName("");
            setSelectedColor("");
            setSelectedIcon("");
        }
        setModalVisible(true);
    }

    function closeModal() {
        setModalVisible(false);
    }

    async function saveCategory() {
        if (!name.trim()) {
            Alert.alert("Error", "Category name cannot be empty");
            return;
        }

        const colorToSave = selectedColor || COLORS[Math.floor(Math.random() * COLORS.length)];
        const iconToSave = selectedIcon || ICONS[Math.floor(Math.random() * ICONS.length)];

        let newCategories = [...categories];

        if (editingId) {
            newCategories = newCategories.map(c => 
                c.id === editingId ? { ...c, name, color: colorToSave, icon: iconToSave } : c
            );
        } else {
            const newCat: Category = {
                id: Date.now().toString(),
                name,
                color: colorToSave,
                icon: iconToSave,
            };
            newCategories.push(newCat);
        }

        setCategories(newCategories);
        await saveCategories(newCategories);
        closeModal();
    }

    async function deleteCategory(id: string) {
        Alert.alert(
            "Delete Category",
            "Are you sure you want to delete this category? Tasks using this category will still retain the category text but won't have custom styling.",
            [
                { text: "Cancel", style: "cancel" },
                { 
                    text: "Delete", 
                    style: "destructive", 
                    onPress: async () => {
                        const newCategories = categories.filter(c => c.id !== id);
                        setCategories(newCategories);
                        await saveCategories(newCategories);
                    }
                }
            ]
        );
    }

    return (
        <View style={[globalStyles.screen, { backgroundColor: colors.background }]}>
            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 20 }}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: 12 }}>
                    <Ionicons name="arrow-back" size={28} color={colors.text} />
                </TouchableOpacity>
                <Text style={{ fontSize: 24, fontWeight: "700", color: colors.text }}>
                    Manage Categories
                </Text>
            </View>

            <FlatList
                data={categories}
                keyExtractor={item => item.id}
                contentContainerStyle={{ paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => (
                    <View style={{
                        flexDirection: "row",
                        alignItems: "center",
                        backgroundColor: colors.card,
                        padding: 16,
                        borderRadius: 16,
                        marginBottom: 12,
                        borderWidth: 1,
                        borderColor: colors.border
                    }}>
                        <View style={{
                            width: 44, height: 44, borderRadius: 22, backgroundColor: `${item.color}20`,
                            alignItems: "center", justifyContent: "center", marginRight: 14
                        }}>
                            <Ionicons name={item.icon as any} size={22} color={item.color} />
                        </View>
                        <Text style={{ flex: 1, fontSize: 18, fontWeight: "600", color: colors.text }}>
                            {item.name}
                        </Text>
                        <TouchableOpacity onPress={() => openModal(item)} style={{ padding: 8 }}>
                            <Ionicons name="pencil" size={20} color={colors.primary} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => deleteCategory(item.id)} style={{ padding: 8 }}>
                            <Ionicons name="trash" size={20} color="#F44336" />
                        </TouchableOpacity>
                    </View>
                )}
            />

            <TouchableOpacity
                onPress={() => openModal()}
                style={[globalStyles.button, { backgroundColor: colors.primary, position: "absolute", bottom: 40, left: 20, right: 20 }]}
            >
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8 }}>
                    <Ionicons name="add" size={22} color="#fff" />
                    <Text style={globalStyles.buttonText}>Add Category</Text>
                </View>
            </TouchableOpacity>

            <Modal visible={isModalVisible} animationType="slide" transparent={true}>
                <View style={{ flex: 1, justifyContent: "flex-end", backgroundColor: "rgba(0,0,0,0.5)" }}>
                    <View style={{ backgroundColor: colors.background, padding: 24, borderTopLeftRadius: 24, borderTopRightRadius: 24, height: "80%" }}>
                        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                            <Text style={{ fontSize: 20, fontWeight: "700", color: colors.text }}>
                                {editingId ? "Edit Category" : "New Category"}
                            </Text>
                            <TouchableOpacity onPress={closeModal}>
                                <Ionicons name="close" size={24} color={colors.subText} />
                            </TouchableOpacity>
                        </View>

                        <ScrollView showsVerticalScrollIndicator={false}>
                            <Text style={{ fontSize: 16, fontWeight: "600", marginBottom: 8, color: colors.text }}>Name</Text>
                            <TextInput
                                placeholder="Category Name"
                                placeholderTextColor={colors.subText}
                                value={name}
                                onChangeText={setName}
                                style={[globalStyles.input, { backgroundColor: colors.input, color: colors.text, borderColor: colors.border }]}
                            />

                            <Text style={{ fontSize: 16, fontWeight: "600", marginTop: 16, marginBottom: 12, color: colors.text }}>
                                Color (Optional)
                            </Text>
                            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
                                {COLORS.map(color => (
                                    <TouchableOpacity
                                        key={color}
                                        onPress={() => setSelectedColor(color)}
                                        style={{
                                            width: 40, height: 40, borderRadius: 20, backgroundColor: color,
                                            borderWidth: selectedColor === color ? 3 : 0,
                                            borderColor: colors.text,
                                            alignItems: "center", justifyContent: "center"
                                        }}
                                    >
                                        {selectedColor === color && <Ionicons name="checkmark" size={20} color="#fff" />}
                                    </TouchableOpacity>
                                ))}
                            </View>

                            <Text style={{ fontSize: 16, fontWeight: "600", marginTop: 24, marginBottom: 12, color: colors.text }}>
                                Icon (Optional)
                            </Text>
                            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12, marginBottom: 40 }}>
                                {ICONS.map(icon => (
                                    <TouchableOpacity
                                        key={icon}
                                        onPress={() => setSelectedIcon(icon)}
                                        style={{
                                            width: 44, height: 44, borderRadius: 12,
                                            backgroundColor: selectedIcon === icon ? colors.primary : colors.card,
                                            borderWidth: 1, borderColor: selectedIcon === icon ? colors.primary : colors.border,
                                            alignItems: "center", justifyContent: "center"
                                        }}
                                    >
                                        <Ionicons name={icon as any} size={24} color={selectedIcon === icon ? "#fff" : colors.text} />
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </ScrollView>

                        <TouchableOpacity onPress={saveCategory} style={[globalStyles.button, { backgroundColor: colors.primary, marginTop: 10 }]}>
                            <Text style={globalStyles.buttonText}>Save Category</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
}
