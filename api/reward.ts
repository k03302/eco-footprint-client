import { CouponItem, RewardItem, RewardItemMeta } from '@/core/model';
import { filePost, axiosPost, axiosGet, axiosPut, axiosDelete } from '@/utils/axios';
import { getUserIdAsync } from '@/utils/login';


export async function createReward(
    { rewardInfo }:
        { rewardInfo: RewardItem }
): Promise<RewardItem | null> {
    return axiosPost('reward/create', rewardInfo);
}

export async function getAllRewards(): Promise<RewardItemMeta[] | null> {
    return axiosGet('reward/all');
}

export async function getReward(
    { rewardId }:
        { rewardId: string }
): Promise<RewardItem | null> {
    return axiosGet('reward/' + rewardId);
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
    return axiosDelete('reward/delete/' + rewardId);
}

export async function perchaseReward(
    { rewardId }:
        { rewardId: string }
): Promise<CouponItem | null> {
    return axiosPost('reward/purchase/' + rewardId, {});
}

export async function extendCoupon(
    { couponId }:
        { couponId: string }
): Promise<CouponItem | null> {
    return axiosPost('reward/extend/' + couponId, {});
}

export async function deleteCoupon(
    { couponId }:
        { couponId: string }
): Promise<boolean> {
    return axiosDelete('reward/delete/' + couponId);
}