import { ChallengeRepo } from "@/core/repository";
import { ChallengeItem, ChallengeItemMeta, UserItemMeta, ChallengeRecoordItem } from "@/core/model";
import AsyncStorage from '@react-native-async-storage/async-storage';

class ChallengeLocalRepo implements ChallengeRepo {
    private prefix: string = 'challenge_';

    // Helper function to generate the storage key
    private generateKey(challengeId: string): string {
        return `${this.prefix}${challengeId}`;
    }

    // Create a new challenge in AsyncStorage
    async createChallenge(challengeItem: ChallengeItem): Promise<ChallengeItem> {
        const key = this.generateKey(challengeItem.id);

        // Store the full challenge data
        await AsyncStorage.setItem(key, JSON.stringify(challengeItem));
        return challengeItem;
    }

    async getChallenge(challengeId: string): Promise<ChallengeItem> {
        const key = this.generateKey(challengeId);
        const challengeString = await AsyncStorage.getItem(key);
        if (!challengeString) {
            throw new Error(`Challenge with ID ${challengeId} not found.`);
        }
        return JSON.parse(challengeString) as ChallengeItem;
    }

    // Get all challenges from AsyncStorage
    async getAllChallenges(): Promise<ChallengeItemMeta[]> {
        const keys = await AsyncStorage.getAllKeys();
        const challengeKeys = keys.filter((key) => key.startsWith(this.prefix));

        // Fetch challenge metadata
        const challenges: ChallengeItemMeta[] = [];
        for (let key of challengeKeys) {
            const challengeData = await AsyncStorage.getItem(key);
            if (challengeData) {
                const challenge: ChallengeItem = JSON.parse(challengeData);
                const challengeMeta: ChallengeItemMeta = {
                    id: challenge.id,
                    name: challenge.name,
                    totalParticipants: challenge.totalParticipants,
                    currentParticipants: challenge.currentParticipants,
                    dateEnd: new Date(challenge.dateEnd),
                };
                challenges.push(challengeMeta);
            }
        }
        return challenges;
    }

    // Update an existing challenge in AsyncStorage
    async updateChallenge(challengeItem: ChallengeItem): Promise<ChallengeItem> {
        const key = this.generateKey(challengeItem.id);
        const existingChallengeString = await AsyncStorage.getItem(key);

        if (!existingChallengeString) {
            throw new Error(`Challenge with ID ${challengeItem.id} not found.`);
        }

        // Update challenge details
        const updatedChallenge = { ...JSON.parse(existingChallengeString), ...challengeItem };
        await AsyncStorage.setItem(key, JSON.stringify(updatedChallenge));
        return updatedChallenge;
    }

    // Delete a challenge from AsyncStorage
    async deleteChallenge(challengeId: string): Promise<boolean> {
        const key = this.generateKey(challengeId);
        const existingChallenge = await AsyncStorage.getItem(key);

        if (!existingChallenge) {
            throw new Error(`Challenge with ID ${challengeId} not found.`);
        }

        await AsyncStorage.removeItem(key);
        return true;
    }
}

export default ChallengeLocalRepo;