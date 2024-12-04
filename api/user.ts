import AsyncStorage from '@react-native-async-storage/async-storage';
import { repo } from '@/api/main';
import axios from 'axios';
import { ChallengeItem, CouponItem, CouponItemMeta, NO_COUPON, NO_USER, UserItem } from '@/core/model';
import { getUserId } from '@/api/auth';

const MAX_DEFAULT_POINT = 3;
const MIN_DEFAULT_POINT = 1;
const CHALLENGE_REWARD_POINT = 100;
const AD_REWARD_POINT = 20;




export async function getMyProfile(): Promise<UserItem> {
    try {
        const userId = getUserId();
        if (!userId) return NO_USER;
        const result = await repo.users.getUserInfo(userId);
        return result;
    } catch (error) {
        console.log(error);
        return NO_USER;
    }
}



export async function purchaseReward(rewardId: string): Promise<CouponItem> {
    try {
        const userInfo = await getMyProfile();
        if (userInfo === NO_USER) return NO_COUPON;
        const rewardInfo = await repo.rewards.getRewardInfo(rewardId);
        if (userInfo.point < rewardInfo.price) return NO_COUPON;

        userInfo.point -= rewardInfo.price;
        const newCouponInfo = await repo.coupons.getNewCoupon(userInfo.id, rewardId);
        userInfo.couponList.push(newCouponInfo);
        await repo.users.updateUserInfo(userInfo);

        return newCouponInfo;
    } catch (error) {
        console.log(error);
        return NO_COUPON;
    }
}

export async function getRewardPoint(rewardPoint = 1): Promise<boolean> {
    try {
        const userInfo = await getMyProfile();
        if (userInfo === NO_USER) return false;

        //const pointAmount = Math.floor(Math.random() * MAX_DEFAULT_POINT + MIN_DEFAULT_POINT);
        userInfo.point += rewardPoint;
        await repo.users.updateUserInfo(userInfo);

        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
}

export async function participateDonation(donationId: string, donationPoint: number = 10): Promise<boolean> {
    try {
        if (donationPoint < 0 || donationPoint > AD_REWARD_POINT) return false;
        const userInfo = await getMyProfile();
        if (userInfo === NO_USER) return false;
        const donationInfo = await repo.donations.getDonation(donationId);

        const userPoint = AD_REWARD_POINT - donationPoint;

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




export async function getChallengeReward(challengeId: string): Promise<boolean> {
    try {
        const userInfo = await getMyProfile();
        if (userInfo === NO_USER) return false;

        let participated = false;
        for (const chall of userInfo.challengeList) {
            if (chall.id === challengeId) {
                participated = true;
                break;
            }
        }
        if (!participated) return false;



        const challengeInfo = await repo.challenges.getChallenge(challengeId);
        const currentTimestamp = Date.now();
        const endTimestamp = new Date(challengeInfo.dateEnd).getTime();
        if (currentTimestamp < endTimestamp) return false;


        let totalScore = 0;
        let myPoint = 0;

        for (const coord of challengeInfo.participantsRecord) {
            if (coord.userId === userInfo.id) {
                myPoint += 1;
                if (coord.approved) {
                    myPoint += 1;
                }
            }

            totalScore += 1;
            if (coord.approved) {
                totalScore += 1;
            }
        }

        if (totalScore < 100) {
            getRewardPoint(myPoint);
        } else {
            const contributionRate = myPoint / totalScore;
            const challengeReward = challengeInfo.currentParticipants * 100;
            getRewardPoint(myPoint + contributionRate * challengeReward);
        }

        return true;

    } catch (error) {
        console.log(error);
        return false;
    }
}