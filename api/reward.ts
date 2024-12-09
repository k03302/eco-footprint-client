import { CouponItem, RewardItem } from '@/core/model';
import { filePost, axiosPost, axiosGet, axiosPut, axiosDelete } from '@/utils/axios';
import { getUserId } from '@/utils/login';


export async function createReward(rewardInfo: RewardItem) {
    return axiosPost('reward/create', rewardInfo);
}

export async function getAllRewards() {
    return axiosGet('reward/all');
}

export async function getReward(rewardId: string) {
    return axiosGet('reward/' + rewardId);
}

export async function updateReward(rewardId: string, update: (rewardInfo: RewardItem) => RewardItem) {

}

export async function deleteReward(rewardId: string) {
    const result = await axiosDelete('reward/delete/' + rewardId);
    return result !== null;
}

export async function perchase(rewardId: string) {
    return axiosPost('reward/purchase/' + rewardId, {});
}

export async function extendCoupon(couponId: string): Promise<CouponItem | null> {
    return axiosPost('reward/extend/' + couponId, {});
}

export async function deleteCoupon(couponId: string): Promise<boolean> {
    const result = await axiosDelete('reward/delete/' + couponId);
    return result !== null;
}