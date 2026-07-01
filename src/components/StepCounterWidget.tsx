import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, AppState } from 'react-native';
import { Pedometer } from 'expo-sensors';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useFocusEffect } from '@react-navigation/native';
import { getStepGoals, StepGoals, getStepProgress, saveStepProgress, StepProgress } from '../services/stepsStorage';

export default function StepCounterWidget() {
    const { colors } = useTheme();

    const [isPedometerAvailable, setIsPedometerAvailable] = useState('checking');
    const [goals, setGoals] = useState<StepGoals>({ daily: 10000, weekly: 50000, monthly: 300000 });
    const [progress, setProgress] = useState<StepProgress | null>(null);
    const [activeTab, setActiveTab] = useState<'Daily' | 'Weekly' | 'Monthly'>('Daily');

    // To track the delta from the active pedometer session
    const lastSessionStepsRef = useRef(0);
    const progressRef = useRef<StepProgress | null>(null);
    const subscriptionRef = useRef<Pedometer.Subscription | null>(null);

    // Sync ref when progress state updates (useful for saving)
    useEffect(() => {
        if (progress) progressRef.current = progress;
    }, [progress]);

    // Helpers
    const getStartOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
    const getStartOfWeek = (d: Date) => {
        const date = new Date(d);
        const day = date.getDay();
        const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
        return new Date(date.setDate(diff));
    };
    const getStartOfMonth = (d: Date) => new Date(d.getFullYear(), d.getMonth(), 1);

    const isSameDay = (d1: Date, d2: Date) => getStartOfDay(d1).getTime() === getStartOfDay(d2).getTime();
    const isSameWeek = (d1: Date, d2: Date) => getStartOfDay(getStartOfWeek(d1)).getTime() === getStartOfDay(getStartOfWeek(d2)).getTime();
    const isSameMonth = (d1: Date, d2: Date) => getStartOfMonth(d1).getTime() === getStartOfMonth(d2).getTime();

    // Load data and handle background catchup
    const initializeSteps = async () => {
        const storedGoals = await getStepGoals();
        setGoals(storedGoals);

        let storedProgress = await getStepProgress();
        const now = new Date();
        const lastUpdate = new Date(storedProgress.lastUpdateDate);

        let needsSave = false;

        // Daily Reset Check
        if (!isSameDay(now, lastUpdate)) {
            const yesterday = new Date(now);
            yesterday.setDate(yesterday.getDate() - 1);
            storedProgress.yesterdaySteps = isSameDay(yesterday, lastUpdate) ? storedProgress.dailySteps : 0;
            storedProgress.dailySteps = 0;
            needsSave = true;
        }

        // Weekly Reset Check (Monday start)
        if (!isSameWeek(now, lastUpdate)) {
            const lastWeek = new Date(now);
            lastWeek.setDate(lastWeek.getDate() - 7);
            storedProgress.lastWeekSteps = isSameWeek(lastWeek, lastUpdate) ? storedProgress.weeklySteps : 0;
            storedProgress.weeklySteps = 0;
            needsSave = true;
        }

        // Monthly Reset Check
        if (!isSameMonth(now, lastUpdate)) {
            const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
            storedProgress.lastMonthSteps = isSameMonth(lastMonth, lastUpdate) ? storedProgress.monthlySteps : 0;
            storedProgress.monthlySteps = 0;
            needsSave = true;
        }

        // Catchup missing steps while app was closed
        try {
            const { granted } = await Pedometer.getPermissionsAsync();
            if (granted && await Pedometer.isAvailableAsync()) {
                if (now.getTime() > lastUpdate.getTime()) {
                    // Try catching up since last update (capped at start of today to avoid large syncs if app wasn't opened for days)
                    const catchupStart = lastUpdate.getTime() < getStartOfDay(now).getTime() ? getStartOfDay(now) : lastUpdate;
                    
                    if (now.getTime() > catchupStart.getTime()) {
                        const catchupResult = await Pedometer.getStepCountAsync(catchupStart, now);
                        if (catchupResult && catchupResult.steps > 0) {
                            storedProgress.dailySteps += catchupResult.steps;
                            storedProgress.weeklySteps += catchupResult.steps;
                            storedProgress.monthlySteps += catchupResult.steps;
                            needsSave = true;
                        }
                    }
                }
            }
        } catch (e) {
            console.log("Catchup failed or unavailable, ignoring.", e);
        }

        storedProgress.lastUpdateDate = now.toISOString();
        if (needsSave) {
            await saveStepProgress(storedProgress);
        }

        setProgress(storedProgress);
        progressRef.current = storedProgress;

        startRealtimeTracking();
    };

    const startRealtimeTracking = async () => {
        try {
            const { granted } = await Pedometer.requestPermissionsAsync();
            if (!granted) {
                setIsPedometerAvailable('permission denied');
                return;
            }

            const isAvailable = await Pedometer.isAvailableAsync();
            setIsPedometerAvailable(String(isAvailable));

            if (isAvailable && !subscriptionRef.current) {
                lastSessionStepsRef.current = 0;
                subscriptionRef.current = Pedometer.watchStepCount(result => {
                    const delta = result.steps - lastSessionStepsRef.current;
                    lastSessionStepsRef.current = result.steps;

                    if (delta > 0 && progressRef.current) {
                        const newProgress = { ...progressRef.current };
                        newProgress.dailySteps += delta;
                        newProgress.weeklySteps += delta;
                        newProgress.monthlySteps += delta;
                        newProgress.lastUpdateDate = new Date().toISOString();

                        setProgress(newProgress);
                        progressRef.current = newProgress;
                        
                        // Save asynchronously without blocking
                        saveStepProgress(newProgress).catch(console.error);
                    }
                });
            }
        } catch (e) {
            console.error("Pedometer Watch Error: ", e);
            setIsPedometerAvailable('error');
        }
    };

    const stopRealtimeTracking = () => {
        if (subscriptionRef.current) {
            subscriptionRef.current.remove();
            subscriptionRef.current = null;
        }
    };

    useEffect(() => {
        initializeSteps();
        
        // Handle app state changes (background/foreground) to restart tracker and avoid stale deltas
        const appStateSubscription = AppState.addEventListener('change', nextAppState => {
            if (nextAppState === 'active') {
                initializeSteps(); // re-checks dates and does catchup
            } else if (nextAppState === 'background') {
                stopRealtimeTracking();
            }
        });

        return () => {
            stopRealtimeTracking();
            appStateSubscription.remove();
        };
    }, []);

    if (!progress) return null;

    let currentSteps = 0;
    let currentGoal = 0;
    let comparisonText = "";

    if (activeTab === 'Daily') {
        currentSteps = progress.dailySteps;
        currentGoal = goals.daily;
        comparisonText = `Yesterday: ${progress.yesterdaySteps.toLocaleString()}`;
    } else if (activeTab === 'Weekly') {
        currentSteps = progress.weeklySteps;
        currentGoal = goals.weekly;
        comparisonText = `Last Week: ${progress.lastWeekSteps.toLocaleString()}`;
    } else {
        currentSteps = progress.monthlySteps;
        currentGoal = goals.monthly;
        comparisonText = `Last Month: ${progress.lastMonthSteps.toLocaleString()}`;
    }

    const progressPercentage = Math.min((currentSteps / currentGoal) * 100, 100) || 0;

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
                    {currentSteps.toLocaleString()}
                </Text>
                <Text style={[styles.goalText, { color: colors.subText }]}>
                    / {currentGoal.toLocaleString()} steps
                </Text>
            </View>

            <View style={[styles.progressBarBackground, { backgroundColor: colors.border }]}>
                <View style={[styles.progressBarFill, { width: `${progressPercentage}%`, backgroundColor: colors.primary }]} />
            </View>
            
            <View style={styles.comparisonContainer}>
                <Ionicons name="stats-chart" size={14} color={colors.subText} style={{ marginRight: 6 }} />
                <Text style={[styles.comparisonText, { color: colors.subText }]}>{comparisonText}</Text>
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
    comparisonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 12,
        justifyContent: 'center',
    },
    comparisonText: {
        fontSize: 13,
        fontWeight: '500',
    },
    errorText: {
        color: '#F44336',
        fontSize: 12,
        marginTop: 10,
        textAlign: 'center',
    }
});
