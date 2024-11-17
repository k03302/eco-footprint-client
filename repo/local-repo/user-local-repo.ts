import { UserRepo } from "@/core/repository";
import { UserItem } from "@/core/model";
import AsyncStorage from '@react-native-async-storage/async-storage';

class UserLocalRepo implements UserRepo {
    private prefix: string = 'user_';

    // Helper function to generate the storage key
    private generateKey(userId: string): string {
        return `${this.prefix}${userId}`;
    }

    // Create a new user
    async createUser(userItem: UserItem): Promise<UserItem> {
        const key = this.generateKey(userItem.id);
        const existingUser = await AsyncStorage.getItem(key);
        if (existingUser) {
            throw new Error(`User with ID ${userItem.id} already exists.`);
        }

        await AsyncStorage.setItem(key, JSON.stringify(userItem));
        return userItem;
    }

    // Get user info by userId
    async getUserInfo(userId: string): Promise<UserItem | null> {
        const key = this.generateKey(userId);
        const userString = await AsyncStorage.getItem(key);
        if (!userString) {
            return null;
        }

        return JSON.parse(userString) as UserItem;
    }

    // Update user info
    async updateUserInfo(userItem: UserItem): Promise<UserItem> {
        const key = this.generateKey(userItem.id);
        const existingUser = await AsyncStorage.getItem(key);
        if (!existingUser) {
            throw new Error(`User with ID ${userItem.id} not found.`);
        }

        const updatedUser = { ...JSON.parse(existingUser), ...userItem };
        await AsyncStorage.setItem(key, JSON.stringify(updatedUser));
        return updatedUser;
    }

    // Delete a user by userId
    async deleteUser(userId: string): Promise<boolean> {
        const key = this.generateKey(userId);
        const user = await AsyncStorage.getItem(key);
        if (!user) {
            throw new Error(`User with ID ${userId} not found.`);
        }

        await AsyncStorage.removeItem(key);
        return true;
    }
}

export default UserLocalRepo;