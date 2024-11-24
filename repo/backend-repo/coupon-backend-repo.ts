import { CouponRepo } from "@/core/repository";
import { CouponItem } from "@/core/model";
import { axiosPost, axiosPut, axiosGet, axiosDelete } from '@/utils/axios';


export class CouponBackRepo implements CouponRepo {
    getCoupon(couponId: string): Promise<CouponItem> {
        throw new Error("Method not implemented.");
    }
    getNewCoupon(rewardId: string): Promise<CouponItem> {
        throw new Error("Method not implemented.");
    }
    updateCoupon(couponItem: CouponItem): Promise<CouponItem> {
        throw new Error("Method not implemented.");
    }

}