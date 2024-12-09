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
import AsyncStorage from '@react-native-async-storage/async-storage';


const challenges: ChallengeRepo = new ChallengeLocalRepo();
const coupons: CouponRepo = new CouponLocalRepo();
const donations: DonationRepo = new DonationLocalRepo();
const files: FileRepo = new FileLocalRepo();
const rewards: RewardRepo = new RewardLocalRepo();
const users: UserLocalRepo = new UserLocalRepo();

export { getFileSource };

export const repo = {
    challenges, coupons, donations, files, rewards, users
};


const donation1Image: FileInput = {
    id: 'donation1',
    name: 'donation1',
    fileUri: '../assets/images/donation1.png',
    localLocation: true
}
const donation2Image: FileInput = {
    id: 'donation2',
    name: 'donation2',
    fileUri: '../assets/images/donation2.png',
    localLocation: true
}
const recoord1Image: FileInput = {
    id: 'recoord1',
    name: 'recoord1',
    fileUri: '../assets/images/recoord1.png',
    localLocation: true
}
const recoord2Image: FileInput = {
    id: 'recoord2',
    name: 'recoord2',
    fileUri: '../assets/images/recoord2.png',
    localLocation: true
}
const recoord3Image: FileInput = {
    id: 'recoord3',
    name: 'recoord3',
    fileUri: '../assets/images/recoord3.png',
    localLocation: true
}
const reward1Image: FileInput = {
    id: 'reward1',
    name: 'reward1',
    fileUri: '../assets/images/reward1.png',
    localLocation: true
}







const user1meta: UserItemMeta = {
    id: 'user1',
    username: 'user1',
    thumbnailId: 'thumbnail1'
}
const user2meta: UserItemMeta = {
    id: 'user2',
    username: 'user2',
    thumbnailId: 'thumbnail2'
}
const user3meta: UserItemMeta = {
    id: 'user3',
    username: 'user3',
    thumbnailId: 'thumbnail3'
}


const donation1meta: DonationItemMeta = {
    id: 'donation1',
    name: '🐾 북극곰을 도와주세요!',
    currentPoint: 300,
    totalPoint: 10000,
    thumbnailId: 'donation1'///////
}
const donation2meta: DonationItemMeta = {
    id: 'donation2',
    name: '🌱 환경을 위해 나무를 심어요!',
    currentPoint: 2000,
    totalPoint: 10000,
    thumbnailId: 'donation2'///////
}


const challengeRecoordItem1: ChallengeRecoordItem = {
    userId: 'user1',
    recordId: 'recoord1',///////
    uploadDate: new Date(2024, 10, 27, 7),
    approved: false
}

const challengeRecoordItem2: ChallengeRecoordItem = {
    userId: 'user2',
    recordId: 'recoord2',///////
    uploadDate: new Date(2024, 10, 26, 8),
    approved: false
}
const challengeRecoordItem3: ChallengeRecoordItem = {
    userId: 'user3',
    recordId: 'recoord3',///////
    uploadDate: new Date(2024, 10, 26, 8),
    approved: false
}
const challengeRecoordItem4: ChallengeRecoordItem = {
    userId: 'user3',
    recordId: 'recoord4',///////
    uploadDate: new Date(2024, 10, 25, 10),
    approved: false
}
const challengeRecoordItem5: ChallengeRecoordItem = {
    userId: 'user3',
    recordId: 'recoord5',///////
    uploadDate: new Date(2024, 10, 24, 7),
    approved: false
}
const challengeRecoordItem6: ChallengeRecoordItem = {
    userId: 'user1',
    recordId: 'recoord6',///////
    uploadDate: new Date(2024, 10, 25, 20),
    approved: false
}
const challengeRecoordItem7: ChallengeRecoordItem = {
    userId: 'user2',
    recordId: 'recoord7',///////
    uploadDate: new Date(2024, 10, 24, 14),
    approved: true
}
const challengeRecoordItem8: ChallengeRecoordItem = {
    userId: 'user1',
    recordId: 'recoord8',///////
    uploadDate: new Date(2024, 10, 24, 7),
    approved: true
}
const challengeRecoordItem9: ChallengeRecoordItem = {
    userId: 'user1',
    recordId: 'recoord9',///////
    uploadDate: new Date(2024, 10, 23, 7),
    approved: true
}
const challengeRecoordItem10: ChallengeRecoordItem = {
    userId: 'user2',
    recordId: 'recoord10',///////
    uploadDate: new Date(2024, 10, 23, 17),
    approved: true
}
const challengeRecoordItem11: ChallengeRecoordItem = {
    userId: 'user2',
    recordId: 'recoord11',///////
    uploadDate: new Date(2024, 10, 22, 20),
    approved: true
}



const challenge1meta: ChallengeItemMeta = {
    id: 'chall1',
    name: '텀블러 이용하기 ☕🌏',
    totalParticipants: 4,
    currentParticipants: 1,
    dateEnd: new Date(2024, 11, 22, 10)
};
const challenge2meta: ChallengeItemMeta = {
    id: 'chall2',
    name: '친환경 식단하기 🌱🍴',
    totalParticipants: 4,
    currentParticipants: 2,
    dateEnd: new Date(2024, 11, 21, 20)
};




const user1: UserItem = {
    ...user1meta,
    point: 0,
    challengeList: [challenge1meta],
    couponList: [],
}
const user2: UserItem = {
    ...user2meta,
    point: 0,
    challengeList: [challenge2meta],
    couponList: []
}
const user3: UserItem = {
    ...user3meta,
    point: 0,
    challengeList: [challenge2meta],
    couponList: []
}



const donation1: DonationItem = {
    ...donation1meta,
    description: `기후 변화로 북극곰들이 서식지를 잃고 있어요! 🧊✨
👉 “지금이 아니면 늦어요!”`,
    state: ItemState.ACTIVE
}
const donation2: DonationItem = {
    ...donation2meta,
    description: `🌟 나무는 이산화탄소를 흡수해 지구를 더 푸르게 만듭니다.
나무 한 그루를 더 심는 데 함께해주세요! 🌳🌎`,
    state: ItemState.ACTIVE
}





const challenge1: ChallengeItem = {
    ...challenge1meta,
    createdBy: 'user1',
    participants: [user1meta],
    participantsRecord: [challengeRecoordItem1, challengeRecoordItem8, challengeRecoordItem9],
    dateStart: new Date(2024, 10, 22, 10),
    description: `👋 일회용 컵은 이제 그만~! 🛑

텀블러 하나면 쓰레기를 줄이고 환경 보호에 기여할 수 있어요. 🥤 예쁜 텀블러에 좋아하는 음료를 담아 나만의 스타일을 뽐내 보세요! 😎💖 텀블러를 사용하면 할인도 받을 수 있다는 꿀팁은 덤!

📸 목표: 일회용 컵 사용을 줄이고 텀블러를 사용해 지속 가능한 소비를 실천하기!
📸 방식: 텀블러에 음료가 담겨있는 모습이나 텀블러로 음료를 마시는 순간을 사진으로 남겨주세요!`
}
const challenge2: ChallengeItem = {
    ...challenge2meta,
    createdBy: 'user2',
    participants: [user2meta, user3meta],
    participantsRecord: [challengeRecoordItem2, challengeRecoordItem3, challengeRecoordItem4, challengeRecoordItem5, challengeRecoordItem6, challengeRecoordItem7, challengeRecoordItem10, challengeRecoordItem11],
    dateStart: new Date(2024, 10, 21, 20),
    description: `🌍 지구를 위한 한 끼, 얼마나 멋진 일일까요? 🥗

이번 챌린지는 육류를 잠시 쉬게 하고, 채식 위주의 한 끼를 실천하는 거예요! 🥕🥬 맛있는 샐러드, 고소한 두부 요리, 색색의 과일 플레이트로 나만의 그린 플레이팅을 만들어보세요. 💚 지구도 살리고 건강도 챙기는 일석이조!

📸 목표: 환경을 보호하고 지속 가능한 식습관을 만들기 위해 채식 위주의 식단을 하기!
📸 방식: 고기가 들어가지 않은 채식 위주의 식단을 먹은 후 사진을 찍어 인증해주세요!`
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




const reward3meta: RewardItemMeta = {
    id: 'reward3',
    itemName: '이디야 아메리카노',
    brandName: '이디야',
    itemType: '커피',
    price: 5000,
    thumbnailId: 'reward3'///////
}

const reward3: RewardItem = {
    ...reward3meta,
    description: '',
    imageId: 'reward3',
    provider: ''
}





const reward4meta: RewardItemMeta = {
    id: 'reward4',
    itemName: 'CGV영화쿠폰',
    brandName: 'CGV',
    itemType: '영화쿠폰',
    price: 20000,
    thumbnailId: 'reward4'///////
}

const reward4: RewardItem = {
    ...reward4meta,
    description: '',
    imageId: 'reward4',
    provider: ''
}



const reward5meta: RewardItemMeta = {
    id: 'reward5',
    itemName: '몬스테라 화분',
    brandName: '환경발자국',
    itemType: '식물',
    price: 20000,
    thumbnailId: 'reward5'///////
}

const reward5: RewardItem = {
    ...reward5meta,
    description: '',
    imageId: 'reward5',
    provider: ''
}




const reward6meta: RewardItemMeta = {
    id: 'reward6',
    itemName: '선인장 화분',
    brandName: '환경발자국',
    itemType: '식물',
    price: 7000,
    thumbnailId: 'reward6'///////
}

const reward6: RewardItem = {
    ...reward6meta,
    description: '',
    imageId: 'reward6',
    provider: ''
}



const reward7meta: RewardItemMeta = {
    id: 'reward7',
    itemName: '테스트',
    brandName: '환경발자국',
    itemType: '테스트',
    price: 1,
    thumbnailId: 'reward7'///////
}

const reward7: RewardItem = {
    ...reward7meta,
    description: '',
    imageId: 'reward7',
    provider: ''
}





export async function initialize() {
    AsyncStorage.clear();
    users.createUser(user1);
    users.createUser(user2);
    users.createUser(user3);

    donations.createDonation(donation1);
    donations.createDonation(donation2);

    challenges.createChallenge(challenge1);
    challenges.createChallenge(challenge2);

    rewards.addReward(reward1);
    rewards.addReward(reward2);
    rewards.addReward(reward3);
    rewards.addReward(reward4);
    rewards.addReward(reward5);
    rewards.addReward(reward6);
    rewards.addReward(reward7);

}