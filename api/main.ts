import { UserRepo, CouponRepo, ChallengeRepo, DonationRepo, RewardRepo, FileRepo } from '@/core/repository';
import ChallengeLocalRepo from "@/repo/local-repo/challenge-local-repo";
import CouponLocalRepo from "@/repo/local-repo/coupon-local-repo";
import DonationLocalRepo from '@/repo/local-repo/donation-local-repo';
import FileLocalRepo, { getFileSource } from "@/repo/local-repo/file-local-repo";
import RewardLocalRepo from "@/repo/local-repo/reward-local-repo";
import UserLocalRepo from "@/repo/local-repo/user-local-repo";
import {
    ChallengeItemMeta, UserItemMeta, CouponItemMeta, ChallengeRecoordItem,
    ItemState, DonationItemMeta, RewardItemMeta, FileData, FileInput,
    UserItem, CouponItem, ChallengeItem, DonationItem, RewardItem

} from "@/core/model"


const challenges: ChallengeRepo = new ChallengeLocalRepo();
const coupons: CouponRepo = new CouponLocalRepo();
const donations: DonationRepo = new DonationLocalRepo();
const files: FileRepo = new FileLocalRepo();
const rewards: RewardRepo = new RewardLocalRepo();
const users: UserLocalRepo = new UserLocalRepo();

export const util = {
    getFileSource: getFileSource
}

export const repo = {
    challenges, coupons, donations, files, rewards, users
};


const donation1Image: FileInput = {
    id: 'donation1',
    name: 'donation1',
    fileUri: '../assets/datas/donation1.png',
    localLocation: true
}
const donation2Image: FileInput = {
    id: 'donation2',
    name: 'donation2',
    fileUri: '../assets/datas/donation2.png',
    localLocation: true
}
const recoord1Image: FileInput = {
    id: 'recoord1',
    name: 'recoord1',
    fileUri: '../assets/datas/recoord1.png',
    localLocation: true
}
const recoord2Image: FileInput = {
    id: 'recoord2',
    name: 'recoord2',
    fileUri: '../assets/datas/recoord2.png',
    localLocation: true
}
const recoord3Image: FileInput = {
    id: 'recoord3',
    name: 'recoord3',
    fileUri: '../assets/datas/recoord3.png',
    localLocation: true
}
const reward1Image: FileInput = {
    id: 'reward1',
    name: 'reward1',
    fileUri: '../assets/datas/reward1.png',
    localLocation: true
}
files.uploadFile(donation1Image);
files.uploadFile(donation2Image);
files.uploadFile(recoord1Image);
files.uploadFile(recoord2Image);
files.uploadFile(recoord3Image);
files.uploadFile(reward1Image);







const user1meta: UserItemMeta = {
    id: 'user1',
    name: 'user1',
    thumbnailId: null
}
const user2meta: UserItemMeta = {
    id: 'user2',
    name: 'user2',
    thumbnailId: null
}
const user3meta: UserItemMeta = {
    id: 'user3',
    name: 'user3',
    thumbnailId: null
}


const donation1meta: DonationItemMeta = {
    id: 'donation1',
    name: '북극곰 돕기',
    currentPoint: 300,
    targetPoint: 10000,
    thumbnailId: 'donation1'///////
}
const donation2meta: DonationItemMeta = {
    id: 'donation2',
    name: '친환경 실천',
    currentPoint: 2000,
    targetPoint: 10000,
    thumbnailId: 'donation2'///////
}


const challengeRecoordItem1: ChallengeRecoordItem = {
    userId: 'user1',
    recordId: 'recoord1',///////
    uploadDate: new Date(),
    approved: false
}

const challengeRecoordItem2: ChallengeRecoordItem = {
    userId: 'user2',
    recordId: 'recoord2',///////
    uploadDate: new Date(),
    approved: false
}
const challengeRecoordItem3: ChallengeRecoordItem = {
    userId: 'user3',
    recordId: 'recoord3',///////
    uploadDate: new Date(),
    approved: false
}



const challenge1meta: ChallengeItemMeta = {
    id: 'chall1',
    name: '여기 모여라',
    totalParticipants: 4,
    currentParticipants: 1,
    dateEnd: new Date(2024, 12, 10)
};
const challenge2meta: ChallengeItemMeta = {
    id: 'chall2',
    name: '같이 할사람?',
    totalParticipants: 4,
    currentParticipants: 2,
    dateEnd: new Date(2024, 12, 10)
};




const user1: UserItem = {
    ...user1meta,
    currentPoints: 0,
    chellengeList: [challenge1meta],
    couponList: [],
}
const user2: UserItem = {
    ...user2meta,
    currentPoints: 0,
    chellengeList: [challenge2meta],
    couponList: []
}
const user3: UserItem = {
    ...user3meta,
    currentPoints: 0,
    chellengeList: [challenge2meta],
    couponList: []
}



const donation1: DonationItem = {
    ...donation1meta,
    description: '',
    participants: [],
    state: ItemState.ACTIVE
}
const donation2: DonationItem = {
    ...donation2meta,
    description: '',
    participants: [],
    state: ItemState.ACTIVE
}





const challenge1: ChallengeItem = {
    ...challenge1meta,
    type: '텀블러 이용하기',
    createdBy: 'user1',
    participants: [user1meta],
    participantsRecord: [challengeRecoordItem1],
    dateStart: new Date(2024, 11, 10),
    description: ''
}
const challenge2: ChallengeItem = {
    ...challenge2meta,
    type: '친환경 식사하기',
    createdBy: 'user2',
    participants: [user2meta, user3meta],
    participantsRecord: [challengeRecoordItem2, challengeRecoordItem3],
    dateStart: new Date(2024, 11, 10),
    description: ''
}






const reward1meta: RewardItemMeta = {
    id: 'reward1',
    itemName: '스타벅스 커피 쿠폰',
    brandName: '스타벅스',
    itemType: '커피',
    price: 6000,
    thumbnailId: 'reward1'///////
}

const reward1: RewardItem = {
    ...reward1meta,
    description: '',
    imageId: 'reward1',
    provider: ''
}


const reward2meta: RewardItemMeta = {
    id: 'reward2',
    itemName: '맘스터치 불싸이버거',
    brandName: '맘스터치',
    itemType: '햄버거',
    price: 7000,
    thumbnailId: 'reward2'///////
}

const reward2: RewardItem = {
    ...reward2meta,
    description: '',
    imageId: 'reward2',
    provider: ''
}





users.createUser(user1);
users.createUser(user2);
users.createUser(user3);

donations.createDonation(donation1);
donations.createDonation(donation2);

challenges.createChallenge(challenge1);
challenges.createChallenge(challenge2);

rewards.addReward(reward1);
rewards.addReward(reward2);