export type ChallengeItemMeta = {
    id: string;
    name: string;
    totalParticipants: number;
    currentParticipants: number;
    dateEnd: Date;
}

export type UserItemMeta = {
    id: string;
    name: string;
    thumbnailId: string | null;
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
    name: string;
    size: number;
    contentType: string;
}

export type FileInput = {
    id: string;
    name: string;
    fileUri: string;
    localLocation?: boolean;
}




export type UserItem = {
    id: string;
    name: string;
    currentPoints: number;
    chellengeList: ChallengeItemMeta[];
    couponList: CouponItemMeta[];
    thumbnailId: string | null;
}

export type CouponItem = {
    id: string;
    itemName: string;
    brandName: string;
    thumbnailId: string;
    expiredAt: string;
    couponId: string;
}


export type ChallengeItem = {
    id: string;
    name: string;
    type: string;
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

