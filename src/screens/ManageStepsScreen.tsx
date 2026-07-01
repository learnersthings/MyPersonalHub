import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from "react-native";
import { useState, useCallback } from "react";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { getStepGoals, saveStepGoals, StepGoals } from "../services/stepsStorage";
import { globalStyles } from "../theme/styles";
import { useTheme } from "../context/ThemeContext";

export default function ManageStepsScreen() {
    const navigation = useNavigation<any>();
    const { colors } = useTheme();

    const [daily, setDaily] = useState("10000");
    const [weekly, setWeekly] = useState("50000");
    const [monthly, setMonthly] = useState("300000");

    useFocusEffect(
        useCallback(() => {
            loadGoals();
        }, [])
    );

    async function loadGoals() {
        const goals = await getStepGoals();
        setDaily(goals.daily.toString());
        setWeekly(goals.weekly.toString());
        setMonthly(goals.monthly.toString());
    }

    async function handleSave() {
        const d = parseInt(daily, 10);
        const w = parseInt(weekly, 10);
        const m = parseInt(monthly, 10);

        if (isNaN(d) || isNaN(w) || isNaN(m) || d <= 0 || w <= 0 || m <= 0) {
            Alert.alert("Invalid Input", "Please enter valid numbers for step goals.");
            return;
        }

        const newGoals: StepGoals = {
            daily: d,
            weekly: w,
            monthly: m,
        };

        await saveStepGoals(newGoals);
        Alert.alert("Success", "Step goals updated successfully!", [
            { text: "OK", onPress: () => navigation.goBack() }
        ]);
    }

    return (
        <View style={[globalStyles.screen, { backgroundColor: colors.background }]}>
            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 20 }}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: 12 }}>
                    <Ionicons name="arrow-back" size={28} color={colors.text} />
                </TouchableOpacity>
                <Text style={{ fontSize: 24, fontWeight: "700", color: colors.text }}>
                    Manage Steps
                </Text>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={{ backgroundColor: colors.card, padding: 20, borderRadius: 16, borderWidth: 1, borderColor: colors.border, marginBottom: 20 }}>
                    
                    <Text style={{ fontSize: 16, fontWeight: "600", color: colors.text, marginBottom: 8 }}>Daily Goal</Text>
                    <TextInput
                        style={{
                            backgroundColor: colors.background,
                            borderWidth: 1,
                            borderColor: colors.border,
                            borderRadius: 12,
                            padding: 14,
                            color: colors.text,
                            fontSize: 16,
                            marginBottom: 20
                        }}
                        value={daily}
                        onChangeText={setDaily}
                        keyboardType="numeric"
                        placeholder="e.g. 10000"
                        placeholderTextColor={colors.subText}
                    />

                    <Text style={{ fontSize: 16, fontWeight: "600", color: colors.text, marginBottom: 8 }}>Weekly Goal</Text>
                    <TextInput
                        style={{
                            backgroundColor: colors.background,
                            borderWidth: 1,
                            borderColor: colors.border,
                            borderRadius: 12,
                            padding: 14,
                            color: colors.text,
                            fontSize: 16,
                            marginBottom: 20
                        }}
                        value={weekly}
                        onChangeText={setWeekly}
                        keyboardType="numeric"
                        placeholder="e.g. 50000"
                        placeholderTextColor={colors.subText}
                    />

                    <Text style={{ fontSize: 16, fontWeight: "600", color: colors.text, marginBottom: 8 }}>Monthly Goal</Text>
                    <TextInput
                        style={{
                            backgroundColor: colors.background,
                            borderWidth: 1,
                            borderColor: colors.border,
                            borderRadius: 12,
                            padding: 14,
                            color: colors.text,
                            fontSize: 16,
                            marginBottom: 30
                        }}
                        value={monthly}
                        onChangeText={setMonthly}
                        keyboardType="numeric"
                        placeholder="e.g. 300000"
                        placeholderTextColor={colors.subText}
                    />

                    <TouchableOpacity
                        onPress={handleSave}
                        style={{
                            backgroundColor: colors.primary,
                            padding: 16,
                            borderRadius: 12,
                            alignItems: "center"
                        }}
                    >
                        <Text style={{ color: "#FFF", fontSize: 16, fontWeight: "700" }}>Save Goals</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
}
