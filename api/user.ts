import AsyncStorage from '@react-native-async-storage/async-storage';
import { repo } from '@/api/main';
import axios from 'axios';
import { getLoggedInPlatform } from '@/api/auth'
import { ChallengeItem, UserItem } from '@/core/model';
import { useRenderStore } from '@/store/useRenderStore';


const MAX_DEFAULT_POINT = 3;
const MIN_DEFAULT_POINT = 1;
const CHALLENGE_REWARD_POINT = 100;
const AD_REWARD_POINT = 20;




export async function getMyProfile(): Promise<UserItem | null> {
    const userId = await getUserId();
    return await repo.users.getUserInfo(userId!);
}

export async function getUserId(): Promise<string | null> {
    const platform = await getLoggedInPlatform();
    if (!platform) return null;
    return await platform.getUserId();

}


export async function purchaseReward(rewardId: string): Promise<UserItem | null> {
    const userId = await getUserId();
    if (!userId) return null;
    const userInfo = await repo.users.getUserInfo(userId);
    if (!userInfo) return null;
    const rewardInfo = await repo.rewards.getRewardInfo(rewardId);
    if (userInfo.currentPoints < rewardInfo.price) return null;
    userInfo.currentPoints -= rewardInfo.price;
    const newCouponInfo = await repo.coupons.getNewCoupon(userId!, rewardId);
    userInfo.couponList.push(newCouponInfo);
    await repo.users.updateUserInfo(userInfo);

    //useRenderStore.getState().triggerPointRerender(); // rerender components that uses user's current point
    return userInfo;
}

export async function getRewardPoint(): Promise<UserItem | null> {
    const userId = await getUserId();
    if (!userId) return null;
    const userInfo = await repo.users.getUserInfo(userId);
    if (!userInfo) return null;

    const pointAmount = Math.floor(Math.random() * MAX_DEFAULT_POINT + MIN_DEFAULT_POINT);
    userInfo.currentPoints += pointAmount;
    await repo.users.updateUserInfo(userInfo);

    //useRenderStore.getState().triggerPointRerender(); // rerender components that uses user's current point
    return userInfo;
}

export async function participateDonation(donationId: string): Promise<UserItem | null> {
    const userId = await getUserId();
    if (!userId) return null;
    const userInfo = await repo.users.getUserInfo(userId);
    const donationInfo = await repo.donations.getDonation(donationId);
    if (!userInfo) return null;

    const userPoint = AD_REWARD_POINT / 2;
    const donationPoint = AD_REWARD_POINT - userPoint;

    userInfo.currentPoints += userPoint;
    await repo.users.updateUserInfo(userInfo);

    donationInfo.currentPoint += donationPoint;
    await repo.donations.updateDonation(donationInfo);

    //useRenderStore.getState().triggerPointRerender(); // rerender components that uses user's current point
    return userInfo;
}


export async function getFinalChallengeRewardPoint(challengeId: string): Promise<UserItem | null> {
    const userId = await getUserId();
    if (!userId) return null;
    const userInfo = await repo.users.getUserInfo(userId);
    if (!userInfo) return null;

    const pointAmount = Math.floor(Math.random() * MAX_DEFAULT_POINT + MIN_DEFAULT_POINT);
    userInfo.currentPoints += pointAmount;
    await repo.users.updateUserInfo(userInfo);

    //useRenderStore.getState().triggerPointRerender(); // rerender components that uses user's current point
    return userInfo;
}
