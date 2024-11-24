import { DonationRepo } from "@/core/repository";
import { DonationItem, DonationItemMeta, ItemState } from "@/core/model";

export class DonationBackRepo implements DonationRepo {
    getAllDonations(): Promise<DonationItemMeta[]> {
        throw new Error("Method not implemented.");
    }
    getDonation(donationId: string): Promise<DonationItem> {
        throw new Error("Method not implemented.");
    }
    updateDonation(donationItem: DonationItem): Promise<DonationItem> {
        throw new Error("Method not implemented.");
    }
    createDonation(donationItem: DonationItem): Promise<DonationItem> {
        throw new Error("Method not implemented.");
    }

}