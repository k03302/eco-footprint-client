import { Modal, ScrollView, Image, TouchableOpacity, Text, View, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import React, { useEffect, useState } from "react";
import { router } from 'expo-router';
import { repo, util } from '@/service/main';
import { CouponItem, RewardItemMeta } from '@/core/model';
import { useFocusEffect } from '@react-navigation/native';

export default function ShopScreen() {
    const [confirmModalVisible, setConfirmModalVisible] = useState<boolean>(false);
    const [couponModalVisible, setCouponModalVisible] = useState<boolean>(false);
    const [rewardList, setRewardList] = useState<RewardItemMeta[]>([]);
    const [selectedReward, setSelectedReward] = useState<RewardItemMeta | null>(null);
    const [selectedCoupon, setSelectedCoupon] = useState<CouponItem | null>(null);

    useEffect(() => {
        (async () => {
            const rewards = await repo.rewards.getAllRewards();
            setRewardList(rewards);
            console.log(rewards);
        })()
    }, []);

    // useEffect(() => {
    //     console.log(selectedReward);
    // }, [selectedReward]);

    const purchaseHandler = () => {
        (async () => {
            // if (!selectedReward) return;
            // const couponInfo = await purchaseReward(selectedReward.id);
            // if (couponInfo) {
            //     setSelectedCoupon(couponInfo);
            //     setConfirmModalVisible(false);
            //     setCouponModalVisible(true);
            // } else {
            //     setConfirmModalVisible(false);
            //     alert("포인트가 부족합니다.");
            // }
        })()
    }
    const cancelHandler = () => {
        setConfirmModalVisible(false);
    }


    if (!rewardList) {
        return <ActivityIndicator size="large"></ActivityIndicator>
    }


    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={() => { router.push('/shop/coupons') }}>
                <View style={{ height: 55, backgroundColor: 'white' }}>
                    <Image source={require("@/assets/images/couponbox_2.png")}
                        style={[styles.couponboximage, { resizeMode: 'contain' }]} />
                </View>
            </TouchableOpacity>

            <View style={{ flex: 9 }}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={{ flexDirection: 'row' }}>
                        {
                            rewardList.length > 0 ? rewardList.map((rewardItem, index) => <RewardItemCard
                                setModalVisible={setConfirmModalVisible} reward={rewardItem} setSelectedReward={setSelectedReward} key={index}
                            >

                            </RewardItemCard>) : <></>
                        }
                    </View>

                </ScrollView>
            </View>

            <Modal
                animationType="slide"
                visible={confirmModalVisible}
                transparent={true}>
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        {
                            selectedReward ? <>
                                <Image
                                    // source={util.getFileSource(selectedReward.thumbnailId)}
                                    style={[styles.image_coupon, { resizeMode: 'contain' }]} />
                                <Text style={styles.text_brand_modal}>{selectedReward.brandName}</Text>
                                <Text style={styles.text_product_modal}>{selectedReward.itemName}</Text>
                                <View style={styles.price_container_modal}>
                                    <Image source={require("@/assets/images/point.png")}
                                        style={[styles.image_point_modal, { resizeMode: 'contain' }]} />
                                    <Text style={styles.text_price_modal}>{selectedReward.price}</Text>
                                </View>
                                <Text style={{ fontSize: 17, marginTop: 20 }}>위 상품을 정말 구매하시겠습니까?</Text>
                                <View style={{ flexDirection: 'row' }}>
                                    <TouchableOpacity onPress={purchaseHandler}>
                                        <Image source={require("@/assets/images/purchase.png")}
                                            style={[styles.image_button, { resizeMode: 'contain' }]} />
                                    </TouchableOpacity>
                                    <Text>    </Text>
                                    <TouchableOpacity onPress={cancelHandler}>
                                        <Image source={require("@/assets/images/cancel.png")}
                                            style={[styles.image_button, { resizeMode: 'contain' }]} />
                                    </TouchableOpacity>
                                </View>
                            </> : <></>
                        }
                    </View>
                </View>
            </Modal>

            {/* <Modal
                animationType="slide"
                visible={couponModalVisible}
                transparent={true}>
                <TouchableOpacity onPress={() => { setCouponModalVisible(false) }}>
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            {
                                selectedReward ? <>
                                    <Image source={util.getFileSource(selectedReward.thumbnailId)}
                                        style={[styles.image_coupon, { resizeMode: 'contain' }]} />
                                    <Text style={styles.text_brand_modal}>{selectedReward.brandName}</Text>
                                    <Text style={styles.text_product_modal}>{selectedReward.itemName}</Text>
                                    <Image source={require("@/assets/images/barcode.png")}
                                        style={[styles.image_barcode, { resizeMode: 'contain' }]} />
                                </> : <></>
                            }
                        </View>
                    </View>
                </TouchableOpacity>
            </Modal> */}

        </View>
    );
}

const RewardItemCard = ({ setModalVisible, reward, setSelectedReward }:
    {
        setModalVisible: React.Dispatch<React.SetStateAction<boolean>>,
        reward: RewardItemMeta,
        setSelectedReward: React.Dispatch<React.SetStateAction<RewardItemMeta | null>>
    }
) => {


    useEffect(() => {
    }, []);

    const onPressModalOpen = () => {
        setSelectedReward(reward);
        setModalVisible(true);
    }



    return (
        <View style={styles.couponrowcontainer}>
            <TouchableOpacity onPress={onPressModalOpen}>
                <View style={styles.box}>
                    <Image
                        // source={util.getFileSource(reward.thumbnailId)}
                        style={[styles.image_product, { resizeMode: 'contain' }]} />
                    <Text style={styles.text_brand}>{reward.brandName}</Text>
                    <Text style={styles.text_product}>{reward.itemName}</Text>
                    <View style={styles.price_container}>
                        <Image source={require("@/assets/images/point.png")}
                            style={[styles.image_point, { resizeMode: 'contain' }]} />
                        <Text style={styles.text_price}>{reward.price}</Text>
                    </View>
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
