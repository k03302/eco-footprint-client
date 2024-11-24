import AsyncStorage from '@react-native-async-storage/async-storage';
import { repo } from '@/api/main';
import axios from 'axios';
import { ChallengeItem, NO_USER, UserItem } from '@/core/model';
import { getUserId } from '@/api/auth';

const MAX_DEFAULT_POINT = 3;
const MIN_DEFAULT_POINT = 1;
const CHALLENGE_REWARD_POINT = 100;
const AD_REWARD_POINT = 20;




export async function getMyProfile(): Promise<UserItem> {
    try {
        const userId = getUserId();
        if (!userId) return NO_USER;
        return await repo.users.getUserInfo(userId);
    } catch (error) {
        console.log(error);
        return NO_USER;
    }
}



export async function purchaseReward(rewardId: string): Promise<boolean> {
    try {
        const userInfo = await getMyProfile();
        if (userInfo === NO_USER) return false;
        const rewardInfo = await repo.rewards.getRewardInfo(rewardId);
        if (userInfo.point < rewardInfo.price) return false;

        userInfo.point -= rewardInfo.price;
        const newCouponInfo = await repo.coupons.getNewCoupon(userInfo.id, rewardId);
        userInfo.couponList.push(newCouponInfo);
        await repo.users.updateUserInfo(userInfo);

        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
}

export async function getRewardPoint(): Promise<boolean> {
    try {
        const userInfo = await getMyProfile();
        if (userInfo === NO_USER) return false;

        const pointAmount = Math.floor(Math.random() * MAX_DEFAULT_POINT + MIN_DEFAULT_POINT);
        userInfo.point += pointAmount;
        await repo.users.updateUserInfo(userInfo);

        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
}

export async function participateDonation(donationId: string): Promise<boolean> {
    try {
        const userInfo = await getMyProfile();
        if (userInfo === NO_USER) return false;
        const donationInfo = await repo.donations.getDonation(donationId);

        const userPoint = AD_REWARD_POINT / 2;
        const donationPoint = AD_REWARD_POINT - userPoint;

        userInfo.point += userPoint;
        await repo.users.updateUserInfo(userInfo);

        donationInfo.currentPoint += donationPoint;
        await repo.donations.updateDonation(donationInfo);

        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
}


export async function getFinalChallengeRewardPoint(challengeId: string): Promise<boolean> {
    try {
        const userInfo = await getMyProfile();
        if (userInfo === NO_USER) return false;

        const pointAmount = Math.floor(Math.random() * MAX_DEFAULT_POINT + MIN_DEFAULT_POINT);
        userInfo.point += pointAmount;
        await repo.users.updateUserInfo(userInfo);

        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
}
