import { DonationRepo } from "@/core/repository";
import { DonationItem, DonationItemMeta, ItemState } from "@/core/model";
import AsyncStorage from '@react-native-async-storage/async-storage';

class DonationLocalRepo implements DonationRepo {
    private prefix: string = 'donation_';

    // Helper function to generate storage keys
    private generateKey(donationId: string): string {
        return `${this.prefix}${donationId}`;
    }

    // Get all donations
    async getAllDonations(): Promise<DonationItemMeta[]> {
        const keys = await AsyncStorage.getAllKeys();
        const donationKeys = keys.filter(key => key.startsWith(this.prefix));

        const donationItems = await AsyncStorage.multiGet(donationKeys);
        return donationItems.map(([_, value]) => JSON.parse(value as string) as DonationItemMeta);
    }

    // Get a single donation by its ID
    async getDonation(donationId: string): Promise<DonationItem> {
        const key = this.generateKey(donationId);
        const donationString = await AsyncStorage.getItem(key);
        if (!donationString) {
            throw new Error(`Donation with ID ${donationId} not found.`);
        }
        return JSON.parse(donationString) as DonationItem;
    }

    // Update an existing donation
    async updateDonation(donationItem: DonationItem): Promise<DonationItem> {
        const key = this.generateKey(donationItem.id);
        const existingDonation = await AsyncStorage.getItem(key);

        if (!existingDonation) {
            throw new Error(`Donation with ID ${donationItem.id} not found.`);
        }

        // Merge existing data with new data
        const updatedDonation = { ...JSON.parse(existingDonation), ...donationItem };
        await AsyncStorage.setItem(key, JSON.stringify(updatedDonation));
        return updatedDonation;
    }

    // Create a new donation
    async createDonation(donationItem: DonationItem): Promise<DonationItem> {
        const key = this.generateKey(donationItem.id);
        const existingDonation = await AsyncStorage.getItem(key);
        if (existingDonation) {
            throw new Error(`Donation with ID ${donationItem.id} already exists.`);
        }

        await AsyncStorage.setItem(key, JSON.stringify(donationItem));
        return donationItem;
    }

    // Delete a donation by its ID
    async deleteDonation(donationId: string): Promise<boolean> {
        const key = this.generateKey(donationId);
        const donation = await AsyncStorage.getItem(key);
        if (!donation) {
            throw new Error(`Donation with ID ${donationId} not found.`);
        }

        await AsyncStorage.removeItem(key);
        return true;
    }
}

export default DonationLocalRepo;