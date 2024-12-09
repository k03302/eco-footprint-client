import { DonationItem } from '@/core/model';
import { filePost, axiosPost, axiosGet, axiosPut, axiosDelete } from '@/utils/axios';
import { getUserId } from '@/utils/login';

export async function createDonation(donationItem: DonationItem): Promise<DonationItem | null> {
    return axiosPost('donation/create', donationItem)
}

export async function getAllDonations(): Promise<DonationItem[]> {
    return axiosGet('donation/all');
}

export async function getDonation(donationId: string): Promise<DonationItem | null> {
    return axiosGet('donation/' + donationId);
}

export async function updateDonation(donationId: string,
    update: (current: DonationItem) => DonationItem)
    : Promise<DonationItem | null> {

    const donationInfo = await getDonation(donationId);
    if (!donationInfo) return null;
    const updatedInfo = update(donationInfo);
    return axiosPut('donation/' + donationId + '/update', updatedInfo);
}

export async function deleteDonation(donationId: string): Promise<boolean> {
    const result = await axiosDelete('donation/' + donationId + '/delete');
    return result !== null;
}