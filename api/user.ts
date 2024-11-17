import AsyncStorage from '@react-native-async-storage/async-storage';
import { repo } from '@/api/main';
import axios from 'axios';
import { getLoggedInPlatform } from '@/api/auth'
import { UserItem } from '@/core/model';

export async function getUserId(): Promise<string | null> {
    const platform = await getLoggedInPlatform();
    if (!platform) return null;
    return await platform.getUserId();

}



export async function getMyProfile(): Promise<UserItem | null> {
    const userId = await getUserId();
    return await repo.users.getUserInfo(userId!);
}

export async function purchaseReward(rewardId: string) {
    const userId = await getUserId();
    if (!userId) return false;
    const userInfo = await repo.users.getUserInfo(userId!);
    if (!userInfo) return false;
    const newCouponInfo = await repo.coupons.getNewCoupon(userId!, rewardId);
    userInfo.couponList.push(newCouponInfo);
    await repo.users.updateUserInfo(userInfo);
    return true;
}

export async function getRewardPoint(amount: number) {
    const userId = await getUserId();
    if (!userId) return;
    const userInfo = await repo.users.getUserInfo(userId!);
    if (!userInfo) return false;
    userInfo.currentPoints += amount;
    await repo.users.updateUserInfo(userInfo);
}

export async function participateDonation(donationId: string) {
    const userId = await getUserId();
    if (!userId) return;
    const userInfo = await repo.users.getUserInfo(userId!);
    const donationInfo = await repo.donations.getDonation(donationId);
    donationInfo.currentPoint += 1;

}

export async function participateChallenge(challengeId: string) {

}

export async function uploadProofShoot(challengeId: string, imgUri: string) {

}

export async function approveProofShot(challengeId: string, userId: string) {

}

export async function createChallenge(name: string, type: string, description: string) {

}