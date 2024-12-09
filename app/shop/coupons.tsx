import { Modal, ScrollView, Image, TouchableOpacity, Text, View, StyleSheet, Touchable, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from "react";
import { router } from 'expo-router';
import { getFileSource, repo } from '@/localApi/main';
import { CouponItemMeta, NO_USER, RewardItem } from '@/core/model';
import { useIsFocused } from '@react-navigation/native';
import { PointDisplay } from '@/components/PointDisplay';
import { getMyProfile } from '@/localApi/user';

export default function CouponScreen() {
    const [confirmModalVisible, setConfirmModalVisible] = useState<boolean>(false);
    const [couponList, setCouponList] = useState<CouponItemMeta[]>([]);
    const [userPoint, setUserPoint] = useState<number>(0);
    const [selectedCoupon, setSelectedCoupon] = useState<CouponItemMeta | null>(null);
    const [selectedReward, setSelectedReward] = useState<RewardItem | null>(null);
    const isFocused = useIsFocused();

    useEffect(() => {
        (async () => {
            const userInfo = await getMyProfile();
            if (userInfo === NO_USER) return;
            setCouponList(userInfo.couponList);
            setUserPoint(userInfo.point);
        })()
    }, [isFocused])


    useEffect(() => { console.log(selectedReward) }, [selectedReward])



    const onPressModalClose = () => {
        setConfirmModalVisible(false);
    }


    return (
        <View style={styles.container}>
            <View style={{ flex: 9 }}>
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
                    <View style={{
                        flexDirection: 'row', alignItems: 'flex-start', flexWrap: 'wrap',
                    }}>
                        {
                            couponList.length > 0 ? couponList.map((rewardItem, index) => <CouponItemCard
                                setModalVisible={setConfirmModalVisible} couponInfo={rewardItem} setSelectedCoupon={setSelectedCoupon} key={index}
                                setSelectedReward={setSelectedReward}
                            >

                            </CouponItemCard>) : <></>
                        }
                    </View>

                </ScrollView>
            </View>

            <Modal
                animationType="slide"
                visible={confirmModalVisible}
                transparent={true}
                onRequestClose={onPressModalClose}>

                <View style={styles.centeredView}>
                    <TouchableOpacity onPress={() => { setConfirmModalVisible(false) }}>
                        <View style={styles.modalView}>
                            {
                                selectedReward ? <>
                                    <Image
                                        source={getFileSource(selectedReward.thumbnailId)}
                                        style={[styles.image_coupon, { resizeMode: 'contain' }]} />
                                    <Text style={styles.text_brand_modal}>{selectedReward.brandName}</Text>
                                    <Text style={styles.text_product_modal}>{selectedReward.itemName}</Text>
                                    <Image source={require("@/assets/images/barcode.png")}
                                        style={[styles.image_barcode, { resizeMode: 'contain' }]} />
                                </> : <></>
                            }
                        </View>
                    </TouchableOpacity>
                </View>
            </Modal>

        </View>
    );
}

const CouponItemCard = ({ setModalVisible, couponInfo, setSelectedCoupon, setSelectedReward }:
    {
        setModalVisible: React.Dispatch<React.SetStateAction<boolean>>,
        couponInfo: CouponItemMeta,
        setSelectedCoupon: React.Dispatch<React.SetStateAction<CouponItemMeta | null>>,
        setSelectedReward: React.Dispatch<React.SetStateAction<RewardItem | null>>
    }
) => {

    const [rewardInfo, setRewardInfo] = useState<RewardItem | null>(null);

    useEffect(() => {
        (async () => {
            const info = await repo.coupons.getCoupon(couponInfo.id);
            const reward = await repo.rewards.getRewardInfo(info.couponId);
            setRewardInfo(reward);
        })()
    }, []);

    const onPressModalOpen = () => {
        setSelectedCoupon(couponInfo);
        setSelectedReward(rewardInfo);
        setModalVisible(true);
    }

    if (!rewardInfo) {
        return <ActivityIndicator size="large"></ActivityIndicator>
    }


    return (
        <View style={styles.couponrowcontainer}>
            <TouchableOpacity onPress={onPressModalOpen}>
                <View style={styles.box}>
                    <Image
                        source={getFileSource(rewardInfo.thumbnailId)}
                        style={[styles.image_product, { resizeMode: 'contain' }]} />
                    <Text style={styles.text_brand}>{rewardInfo.brandName}</Text>
                    <Text style={styles.text_product}>{rewardInfo.itemName}</Text>
                </View>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    couponboximage: {
        width: 106, height: 40, margin: 10,
    },
    couponlistcontainer: {
        flex: 9,
        alignItems: 'center',
        justifyContent: 'center',
        flexWrap: 'wrap',
        maxWidth: 360,
    },
    couponrowcontainer: {
        maxHeight: 280,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: '50%'
    },
    image_product: {
        width: 150, height: 200, marginLeft: 15,
        borderRadius: 10, justifyContent: 'center'
    },
    text_brand: {
        opacity: 0.8, fontSize: 12, marginLeft: 20
    },
    text_product: {
        opacity: 1, fontSize: 15, marginLeft: 20
    },
    price_container: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    image_point: {
        width: 15, height: 15, marginLeft: 20,
    },
    text_price: {
        fontSize: 15, marginLeft: 3,
    },
    box: {
        width: 180,
        height: 270,
        backgroundColor: 'white',
    },


    //modal
    centeredView: {
        flex: 1,
        alignContent: "center",
        textAlignVertical: 'center',
        backgroundColor: "rgba(0, 0, 0, 0.3)#",
    },
    modalView: {
        marginTop: 230,
        margin: 30,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    failModalView: {
        marginTop: 230,
        margin: 30,
        backgroundColor: 'white',
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        borderColor: 'black',
    },
    modalTextStyle: {
        color: '#17191c',
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 50
    },
    image_coupon: {
        width: 200, height: 230,
    },
    container_info: {
        width: 200,
    },
    image_button: {
        width: 95, height: 30, marginTop: 10
    },
    text_brand_modal: {
        opacity: 0.8, fontSize: 12, marginTop: 5
    },
    text_product_modal: {
        opacity: 1, fontSize: 15,
    },
    price_container_modal: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    image_point_modal: {
        width: 15, height: 15,
    },
    text_price_modal: {
        fontSize: 15, marginLeft: 3,
    },
    image_barcode: {
        width: 300, height: 100,
    }
});
