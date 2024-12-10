
export enum ItemState {
    UNDEFINED = -1,
    PENDING = 0,
    ACTIVE = 1,
    INACTIVE = 2,
    FINISHED = 3,
    FAILED = 4
}


export type UserItemMeta = {
    id: string;
    username: string;
    thumbnailId: string;
}

export type DonationItemMeta = {
    id: string;
    name: string;
    currentPoint: number;
    totalPoint: number;
    thumbnailId: string;
}

export type CouponItemMeta = {
    id: string;
    itemName: string;
    brandName: string;
    thumbnailId: string;
    expiredAt: string;
}

export type ChallengeItemMeta = {
    id: string;
    name: string;
    totalParticipants: number;
    currentParticipants: number;
    dateEnd: Date;
}

export type ChallengeRecordItem = {
    id: string;
    userId: string;
    imageId: string;
    date: string;
    approved: boolean;
}

export type RewardItemMeta = {
    id: string;
    itemName: string;
    brandName: string;
    itemType: string;
    price: number;
    thumbnailId: string;
}







export type UserItem = {
    id: string;
    username: string;
    point: number;
    couponList: CouponItemMeta[];
    thumbnailId: string;
}

export type DonationItem = {
    id: string;
    name: string;
    currentPoint: number;
    totalPoint: number;
    description: string;
    thumbnailId: string;
    state: ItemState;
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
    createdAt: string;
    participants: UserItemMeta[];
    participantsRecords: ChallengeRecordItem[];
    dateStart: Date;
    dateEnd: Date;
    description: string;
    state: ItemState;
}

export type RewardItem = {
    id: string;
    itemName: string;
    brandName: string;
    itemType: string;
    description: string;
    imageId: string;
    thumbnailId: string;
    price: number;
    provider: string;
}



export type FileData = {
    id: string;
    owner: string;
    name: string;
    size: number;
    contentType: string;
    file: string;
    isPrivate: boolean;
}

