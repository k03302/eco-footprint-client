import { DonationItem, UserItem } from '@/core/model';
import { filePost, axiosPost, axiosGet, axiosPut, axiosDelete } from '@/utils/axios';
import { getUserId, getUserIdAsync } from '@/utils/login';
import { updateProfile } from './user';

export async function createDonation(
    { donationItem }:
        { donationItem: DonationItem }
): Promise<DonationItem | null> {
    return axiosPost('donation/create', donationItem)
}

export async function getAllDonations(): Promise<DonationItem[] | null> {
    return axiosGet('donation/all');
}

export async function getDonation(
    { donationId }:
        { donationId: string }
): Promise<DonationItem | null> {
    return axiosGet('donation/' + donationId);
}

export async function updateDonation({ donationId, update }: {
    donationId: string,
    update: (current: DonationItem) => DonationItem
}): Promise<DonationItem | null> {

    const donationInfo = await getDonation({ donationId });
    if (!donationInfo) return null;
    const updatedInfo = update(donationInfo);
    return axiosPut('donation/' + donationId + '/update', updatedInfo);
}

export async function deleteDonation(
    { donationId }:
        { donationId: string }
): Promise<boolean> {
    return axiosDelete('donation/' + donationId + '/delete');
}

export async function participateDonation(
    { donationId, rewardPoint }:
        { donationId: string, rewardPoint: number }
): Promise<DonationItem | null> {
    const userId = getUserId();
    return axiosPost(`donation/${donationId}/participate/${userId}`, null, { rewardPoint },
        (data) => { console.log(`donation/${donationId}/participate/${userId}`, data) },
        (error) => { console.error(`donation/${donationId}/participate/${userId}`, error) }
    );
}

export async function participateDonation2(
    { donationId, rewardPoint }:
        { donationId: string, rewardPoint: number }
): Promise<DonationItem | null> {
    const donationUpdate = await updateDonation({
        donationId, update: (donationInfo: DonationItem) => {
            donationInfo.currentPoint = Math.min(donationInfo.currentPoint + rewardPoint, donationInfo.totalPoint);
            return donationInfo;
        }
    })



    const upserUpdate = await updateProfile({
        myProfile: true, update: (userInfo: UserItem) => {
            userInfo.point += rewardPoint;
            return userInfo;
        }
    });

    return donationUpdate;
}
