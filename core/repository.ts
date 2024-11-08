import {
    ChallengeItemMeta, UserItemMeta, CouponItemMeta, ChallengeRecoordItem,
    ItemState, DonationItemMeta, RewardItemMeta, FileData, FileInput,
    UserItem, CouponItem, ChallengeItem, DonationItem, RewardItem

} from "./model"

export interface UserRepo {
    createUser(userItem: UserItem): Promise<UserItem>
    getUserInfo(userId: string): Promise<UserItem>
    updateUserInfo(userItem: UserItem): Promise<UserItem>
    deleteUser(userId: string): Promise<boolean>
}

export interface CouponRepo {
    getCoupon(couponId: string): Promise<CouponItem>
    getNewCoupon(userId: string, rewardId: string): Promise<CouponItem>
    updateCoupon(couponItem: CouponItem): Promise<CouponItem>
}

export interface ChallengeRepo {
    createChallenge(challengeItem: ChallengeItem): Promise<ChallengeItem>
    getAllChallenges(): Promise<ChallengeItemMeta[]>
    updateChallenge(challengeItem: ChallengeItem): Promise<ChallengeItem>
    deleteChallenge(challengeId: string): Promise<boolean>
}

export interface DonationRepo {
    getAllDonations(): Promise<DonationItemMeta[]>
    getDonation(donationId: string): Promise<DonationItem>
    updateDonation(donationItem: DonationItem): Promise<DonationItem>
}

export interface RewardRepo {
    getAllRewards(): Promise<RewardItemMeta[]>
    getRewardInfo(rewardId: string): Promise<RewardItem>
}

export interface FileRepo {
    uploadFile(file: FileInput): Promise<FileData>
    updateFile(file: FileInput): Promise<FileData>
    deleteFile(fileId: FileInput): Promise<FileData>
}