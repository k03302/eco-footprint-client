import { UserRepo, CouponRepo, ChallengeRepo, DonationRepo, RewardRepo, FileRepo } from '@/core/repository';
import ChallengeLocalRepo from "@/repo/local-repo/challenge-local-repo";
import CouponLocalRepo from "@/repo/local-repo/coupon-local-repo";
import DonationLocalRepo from '@/repo/local-repo/donation-local-repo';
import FileLocalRepo from "@/repo/local-repo/file-local-repo";
import RewardLocalRepo from "@/repo/local-repo/reward-local-repo";
import UserLocalRepo from "@/repo/local-repo/user-local-repo";



const challenges: ChallengeRepo = new ChallengeLocalRepo();
const coupons: CouponRepo = new CouponLocalRepo();
const donations: DonationRepo = new DonationLocalRepo();
const files: FileRepo = new FileLocalRepo();
const rewards: RewardRepo = new RewardLocalRepo();
const users: UserLocalRepo = new UserLocalRepo();


export const repo = {
    challenges, coupons, donations, files, rewards, users
};
