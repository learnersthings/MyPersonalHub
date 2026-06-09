import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY =
    "BRAIN_STATS";

export async function getBrainStats() {

    const data =
        await AsyncStorage.getItem(
            KEY
        );

    if (!data) {

        return {

            numberBest: 0,

            totalGames: 0,

            totalScore: 0,

            xp: 0,

            patternBest: 0,

            mathBest: 0,

            reactionBest: 9999,

            wordBest: 0,

            visualBest: 0,

            colorBest: 0,

            decisionBest: 0,
        };
    }

    return JSON.parse(data);
}

export async function saveBrainStats(
    stats: any
) {

    await AsyncStorage.setItem(
        KEY,
        JSON.stringify(stats)
    );
}