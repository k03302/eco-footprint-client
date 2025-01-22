import { DonationItem, UserItem } from '@/core/model';
import { filePost, axiosPost, axiosGet, axiosPut, axiosDelete } from '@/utils/axios';
import { getItemPoint } from './user';
import { getIdToken } from '@/utils/login';

export async function createDonation(
    { donationItem }:
        { donationItem: DonationItem }
): Promise<DonationItem | null> {
    return axiosPost({ path: 'donation/create', body: donationItem })
}

export async function getAllDonations(): Promise<DonationItem[] | null> {
    return axiosGet({ path: 'donation/all' });
}

export async function getDonation(
    { donationId }:
        { donationId: string }
): Promise<DonationItem | null> {
    return axiosGet({ path: 'donation/' + donationId });
}

export async function updateDonation({ donationId, update }: {
    donationId: string,
    update: (current: DonationItem) => DonationItem
}): Promise<DonationItem | null> {

    const donationInfo = await getDonation({ donationId });
    if (!donationInfo) return null;
    const updatedInfo = update(donationInfo);
    return axiosPut({
        path: 'donation/' + donationId + '/update',
        body: updatedInfo, admin: true,
        onSuccess: () => { },
        onError: error => { console.log(error.response.message, error.response.status) }
    });
}

export async function deleteDonation(
    { donationId }:
        { donationId: string }
): Promise<boolean> {
    return axiosDelete({ path: 'donation/' + donationId + '/delete' });
}

export async function participateDonation(
    { donationId, rewardPoint }:
        { donationId: string, rewardPoint: number }
): Promise<DonationItem | null> {
    const userId = getIdToken();
    return axiosPost({
        path: `donation/${donationId}/participate/${userId}`,
        body: {},
        params: { rewardPoint },
        onSuccess: (data) => { console.log(`donation/${donationId}/participate/${userId}`, data) },
        onError: (error) => { console.log(`donation/${donationId}/participate/${userId}`, error) }
    }
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

    console.log(donationUpdate);


    const update = await getItemPoint({ point: rewardPoint })

    return donationUpdate;
}
