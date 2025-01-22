import { CouponItem, RewardItem, RewardItemMeta } from '@/core/model';
import { filePost, axiosPost, axiosGet, axiosPut, axiosDelete } from '@/utils/axios';


export async function createReward(
    { rewardInfo }:
        { rewardInfo: RewardItem }
): Promise<RewardItem | null> {
    return axiosPost({ path: 'reward/create', body: rewardInfo });
}

export async function getAllRewards(): Promise<RewardItemMeta[] | null> {
    return axiosGet({ path: 'reward/all' });
}

export async function getReward(
    { rewardId }:
        { rewardId: string }
): Promise<RewardItem | null> {
    return axiosGet({ path: 'reward/' + rewardId });
}

export async function updateReward(
    { rewardId, update }:
        { rewardId: string, update: (rewardInfo: RewardItem) => RewardItem }
): Promise<RewardItem | null> {
    return null;
}

export async function deleteReward(
    { rewardId }:
        { rewardId: string }
): Promise<boolean> {
    return axiosDelete({ path: 'reward/delete/' + rewardId });
}

export async function perchaseReward(
    { rewardId }:
        { rewardId: string }
): Promise<CouponItem | null> {
    return axiosPost({ path: 'reward/purchase/' + rewardId, body: {} });
}

export async function extendCoupon(
    { couponId }:
        { couponId: string }
): Promise<CouponItem | null> {
    return axiosPost({ path: 'reward/extend/' + couponId, body: {} });
}

export async function deleteCoupon(
    { couponId }:
        { couponId: string }
): Promise<boolean> {
    return axiosDelete({ path: 'reward/delete/' + couponId });
}