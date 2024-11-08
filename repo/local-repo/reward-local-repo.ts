import { RewardRepo } from "@/core/repository";
import { RewardItemMeta, RewardItem } from "@/core/model";
import AsyncStorage from '@react-native-async-storage/async-storage';

class RewardLocalRepo implements RewardRepo {
    private prefix: string = 'reward_';

    // Helper function to generate the storage key
    private generateKey(rewardId: string): string {
        return `${this.prefix}${rewardId}`;
    }

    // Fetch all rewards from AsyncStorage
    async getAllRewards(): Promise<RewardItemMeta[]> {
        const keys = await AsyncStorage.getAllKeys();
        const rewardKeys = keys.filter((key) => key.startsWith(this.prefix));

        // Fetch all reward metadata
        const rewards: RewardItemMeta[] = [];
        for (let key of rewardKeys) {
            const rewardData = await AsyncStorage.getItem(key);
            if (rewardData) {
                rewards.push(JSON.parse(rewardData));
            }
        }
        return rewards;
    }

    // Get the details of a specific reward by ID
    async getRewardInfo(rewardId: string): Promise<RewardItem> {
        const key = this.generateKey(rewardId);
        const rewardData = await AsyncStorage.getItem(key);
        if (!rewardData) {
            throw new Error(`Reward with ID ${rewardId} not found.`);
        }
        return JSON.parse(rewardData) as RewardItem;
    }

    // Add a new reward to AsyncStorage
    async addReward(rewardItem: RewardItem): Promise<RewardItem> {
        const key = this.generateKey(rewardItem.id);

        // Save the reward details
        await AsyncStorage.setItem(key, JSON.stringify(rewardItem));
        return rewardItem;
    }

    // Update an existing reward
    async updateReward(rewardItem: RewardItem): Promise<RewardItem> {
        const key = this.generateKey(rewardItem.id);
        const existingRewardString = await AsyncStorage.getItem(key);

        if (!existingRewardString) {
            throw new Error(`Reward with ID ${rewardItem.id} not found.`);
        }

        // Update reward details
        const updatedReward = { ...JSON.parse(existingRewardString), ...rewardItem };
        await AsyncStorage.setItem(key, JSON.stringify(updatedReward));
        return updatedReward;
    }

    // Delete a reward by its ID
    async deleteReward(rewardId: string): Promise<boolean> {
        const key = this.generateKey(rewardId);
        const existingReward = await AsyncStorage.getItem(key);

        if (!existingReward) {
            throw new Error(`Reward with ID ${rewardId} not found.`);
        }

        await AsyncStorage.removeItem(key);
        return true;
    }
}

export default RewardLocalRepo;