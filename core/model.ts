export type ChallengeItemMeta = {
    id: string;
    name: string;
    totalParticipants: number;
    currentParticipants: number;
    dateEnd: Date;
}

export type UserItemMeta = {
    id: string;
    username: string;
    thumbnailId: string;
}

export type CouponItemMeta = {
    id: string;
    itemName: string;
    brandName: string;
    thumbnailId: string;
    expiredAt: string;
}

export type ChallengeRecoordItem = {
    userId: string;
    recordId: string;
    uploadDate: Date;
    approved: boolean;
}

export enum ItemState {
    UNDEFINED,
    PENDING,
    ACTIVE,
    INACTIVE,
    FINISHED,
    FAILED
}

export type DonationItemMeta = {
    id: string;
    name: string;
    currentPoint: number;
    targetPoint: number;
    thumbnailId: string;
}

export type RewardItemMeta = {
    id: string;
    itemName: string;
    brandName: string;
    itemType: string;
    price: number;
    thumbnailId: string;
}

export type FileData = {
    id: string;
    owner: string;
    name: string;
    size: number;
    date: string;
    contentType: string;
    file: string;
}

export type FileInput = {
    id: string;
    name: string;
    fileUri: string;
    localLocation?: boolean;
}




export type UserItem = {
    id: string;
    username: string;
    point: number;
    challengeList: ChallengeItemMeta[];
    couponList: CouponItemMeta[];
    thumbnailId: string;
}

export type CouponItem = {
    id: string;
    itemName: string;
    brandName: string;
    thumbnailId: string;
    expiredAt: string;
    description: string;
    couponId: string;
}


export type ChallengeItem = {
    id: string;
    name: string;
    totalParticipants: number;
    currentParticipants: number;
    createdBy: string;
    participants: UserItemMeta[];
    participantsRecord: ChallengeRecoordItem[];
    dateStart: Date;
    dateEnd: Date;
    description: string;
}



export type DonationItem = {
    id: string;
    name: string;
    currentPoint: number;
    targetPoint: number;
    description: string;
    participants: string[];
    thumbnailId: string;
    state: ItemState;
}

export type RewardItem = {
    id: string;
    itemName: string;
    brandName: string;
    itemType: string;
    description: string;
    price: number;
    imageId: string;
    thumbnailId: string;
    provider: string;
}



export const NO_USER: UserItem = {
    id: "",
    username: "",
    point: 0,
    challengeList: [],
    couponList: [],
    thumbnailId: ""
}

export const NO_COUPON: CouponItem = {
    id: "",
    itemName: "",
    brandName: "",
    thumbnailId: "",
    expiredAt: "",
    description: "",
    couponId: ""
}

export const NO_CHALLENGE: ChallengeItem = {
    id: "",
    name: "",
    totalParticipants: 0,
    currentParticipants: 0,
    createdBy: "",
    participants: [],
    participantsRecord: [],
    dateStart: new Date(),
    dateEnd: new Date(),
    description: ""
}

export const NO_REWARD: RewardItem = {
    id: "",
    itemName: "",
    brandName: "",
    itemType: "",
    description: "",
    price: 0,
    imageId: "",
    thumbnailId: "",
    provider: ""
}

export const NO_DONATION: DonationItem = {
    id: "",
    name: "",
    currentPoint: 0,
    targetPoint: 0,
    description: "",
    participants: [],
    thumbnailId: "",
    state: 0
}

export const NO_FILE: FileData = {
    id: "",
    name: "",
    size: 0,
    contentType: "",
    owner: "",
    date: "",
    file: ""
}