import { UserRepo, CouponRepo, ChallengeRepo, DonationRepo, RewardRepo, FileRepo } from '@/core/repository';

import { ChallengeBackRepo } from '@/repo/backend-repo/challenge-backend-repo';
import { CouponBackRepo } from '@/repo/backend-repo/coupon-backend-repo';
import { DonationBackRepo } from '@/repo/backend-repo/donation-backend-repo';
import { FileBackRepo } from '@/repo/backend-repo/file-backend-repo';
import { RewardBackRepo } from '@/repo/backend-repo/reward-backend-repo';
import { UserBackRepo } from '@/repo/backend-repo/user-backend-repo';

import {
    ChallengeItemMeta, UserItemMeta, CouponItemMeta, ChallengeRecoordItem,
    ItemState, DonationItemMeta, RewardItemMeta, FileData, FileInput,
    UserItem, CouponItem, ChallengeItem, DonationItem, RewardItem

} from "@/core/model"
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';

const challenges: ChallengeRepo = new ChallengeBackRepo();
const coupons: CouponBackRepo = new CouponBackRepo();
const donations: DonationBackRepo = new DonationBackRepo();
const files: FileBackRepo = new FileBackRepo();
const rewards: RewardBackRepo = new RewardBackRepo();
const users: UserBackRepo = new UserBackRepo();


export const util = {

}

export const repo = {
    challenges, coupons, donations, files, rewards, users
};
