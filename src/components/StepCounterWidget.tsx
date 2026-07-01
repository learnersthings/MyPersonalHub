import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Pedometer } from 'expo-sensors';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useFocusEffect } from '@react-navigation/native';
import { getStepGoals, StepGoals } from '../services/stepsStorage';

export default function StepCounterWidget() {
    const [isPedometerAvailable, setIsPedometerAvailable] = useState('checking');
    const [pastStepCount, setPastStepCount] = useState(0);
    const [currentStepCount, setCurrentStepCount] = useState(0);
    const [weeklySteps, setWeeklySteps] = useState(0);
    const [monthlySteps, setMonthlySteps] = useState(0);

    const [goals, setGoals] = useState<StepGoals>({ daily: 10000, weekly: 50000, monthly: 300000 });
    const [activeTab, setActiveTab] = useState<'Daily' | 'Weekly' | 'Monthly'>('Daily');

    const { colors } = useTheme();

    useFocusEffect(
        useCallback(() => {
            getStepGoals().then(setGoals);
        }, [])
    );

    const subscribe = async () => {
        try {
            const { granted } = await Pedometer.requestPermissionsAsync();
            if (!granted) {
                setIsPedometerAvailable('permission denied');
                return null;
            }

            const isAvailable = await Pedometer.isAvailableAsync();
            setIsPedometerAvailable(String(isAvailable));

            if (isAvailable) {
                const now = new Date();
                
                const startOfDay = new Date();
                startOfDay.setHours(0, 0, 0, 0);

                const startOfWeek = new Date();
                startOfWeek.setDate(now.getDate() - now.getDay());
                startOfWeek.setHours(0, 0, 0, 0);

                const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

                const [dailyRes, weeklyRes, monthlyRes] = await Promise.all([
                    Pedometer.getStepCountAsync(startOfDay, now).catch(() => ({ steps: 0 })),
                    Pedometer.getStepCountAsync(startOfWeek, now).catch(() => ({ steps: 0 })),
                    Pedometer.getStepCountAsync(startOfMonth, now).catch(() => ({ steps: 0 }))
                ]);

                setPastStepCount(dailyRes?.steps || 0);
                setWeeklySteps(weeklyRes?.steps || 0);
                setMonthlySteps(monthlyRes?.steps || 0);

                return Pedometer.watchStepCount(result => {
                    setCurrentStepCount(result.steps);
                });
            }
        } catch (e) {
            console.error("Pedometer Error: ", e);
            setIsPedometerAvailable('error');
        }
        return null;
    };

    useEffect(() => {
        let subscription: Pedometer.Subscription | null = null;
        subscribe().then(sub => {
            subscription = sub as any;
        });
        return () => {
            if (subscription && (subscription as any).remove) {
                (subscription as any).remove();
            }
        };
    }, []);

    const dailyTotal = pastStepCount + currentStepCount;
    const weeklyTotal = weeklySteps + currentStepCount;
    const monthlyTotal = monthlySteps + currentStepCount;

    let totalSteps = 0;
    let goal = 0;

    if (activeTab === 'Daily') {
        totalSteps = dailyTotal;
        goal = goals.daily;
    } else if (activeTab === 'Weekly') {
        totalSteps = weeklyTotal;
        goal = goals.weekly;
    } else {
        totalSteps = monthlyTotal;
        goal = goals.monthly;
    }

    const progress = Math.min((totalSteps / goal) * 100, 100) || 0;

    return (
        <View style={[styles.container, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.header}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={[styles.iconContainer, { backgroundColor: colors.primary + '20' }]}>
                        <Ionicons name="walk" size={24} color={colors.primary} />
                    </View>
                    <Text style={[styles.title, { color: colors.text }]}>Step Tracker</Text>
                </View>
            </View>

            <View style={styles.tabsContainer}>
                {['Daily', 'Weekly', 'Monthly'].map(tab => (
                    <TouchableOpacity 
                        key={tab} 
                        onPress={() => setActiveTab(tab as any)}
                        style={[
                            styles.tab, 
                            activeTab === tab ? { backgroundColor: colors.primary } : { backgroundColor: 'transparent' }
                        ]}
                    >
                        <Text style={[
                            styles.tabText, 
                            activeTab === tab ? { color: '#FFF' } : { color: colors.subText }
                        ]}>
                            {tab}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            <View style={styles.content}>
                <Text style={[styles.stepsText, { color: colors.text }]}>
                    {totalSteps.toLocaleString()}
                </Text>
                <Text style={[styles.goalText, { color: colors.subText }]}>
                    / {goal.toLocaleString()} steps
                </Text>
            </View>

            <View style={[styles.progressBarBackground, { backgroundColor: colors.border }]}>
                <View style={[styles.progressBarFill, { width: `${progress}%`, backgroundColor: colors.primary }]} />
            </View>
            
            {isPedometerAvailable === 'false' || isPedometerAvailable === 'permission denied' || isPedometerAvailable === 'error' ? (
                <Text style={styles.errorText}>
                    {isPedometerAvailable === 'false' ? 'Step counter not available on this device' : 
                     isPedometerAvailable === 'error' ? 'Error loading step counter' : 'Permission denied to count steps'}
                </Text>
            ) : null}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 22,
        padding: 20,
        marginBottom: 16,
        borderWidth: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
    },
    tabsContainer: {
        flexDirection: 'row',
        marginBottom: 16,
        backgroundColor: '#00000008',
        borderRadius: 8,
        padding: 4,
    },
    tab: {
        flex: 1,
        paddingVertical: 6,
        alignItems: 'center',
        borderRadius: 6,
    },
    tabText: {
        fontSize: 13,
        fontWeight: '600',
    },
    content: {
        flexDirection: 'row',
        alignItems: 'baseline',
        marginBottom: 16,
    },
    stepsText: {
        fontSize: 36,
        fontWeight: '800',
        marginRight: 8,
    },
    goalText: {
        fontSize: 16,
    },
    progressBarBackground: {
        height: 8,
        borderRadius: 4,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        borderRadius: 4,
    },
    errorText: {
        color: '#F44336',
        fontSize: 12,
        marginTop: 10,
        textAlign: 'center',
    }
});
