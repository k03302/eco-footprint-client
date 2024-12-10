import { Modal, ScrollView, Image, TouchableOpacity, Text, View, StyleSheet, Touchable, ActivityIndicator, Alert } from 'react-native';
import React, { useEffect, useState } from "react";
import { router } from 'expo-router';
import { CouponItem, CouponItemMeta, RewardItem } from '@/core/model';
import { useIsFocused } from '@react-navigation/native';
import { PointDisplay } from '@/components/PointDisplay';
import { getProfile } from '@/api/user';
import { getImageSoucre } from '@/api/file';
import { extendCoupon } from '@/api/reward';

export default function CouponScreen() {
    const [confirmModalVisible, setConfirmModalVisible] = useState<boolean>(false);
    const [couponList, setCouponList] = useState<CouponItemMeta[]>([]);
    const [selectedCouponMeta, setSelectedCouponMeta] = useState<CouponItemMeta | null>(null);
    const isFocused = useIsFocused();

    const onFetchError = () => {
        Alert.alert("에러가 발생했습니다.");
        router.push('/map');
    }


    useEffect(() => {
        (async () => {
            const userInfo = await getProfile({ myProfile: true });
            if (userInfo === null) {
                onFetchError();
                return;
            }
            setCouponList(userInfo.couponList);
        })()
    }, [isFocused])


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
                                setModalVisible={setConfirmModalVisible} couponInfoMeta={rewardItem} setSelectedCoupon={setSelectedCouponMeta} key={index}
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
                                selectedCouponMeta ? <>
                                    <Image
                                        source={getImageSoucre({ imageId: selectedCouponMeta.thumbnailId })}
                                        style={[styles.image_coupon, { resizeMode: 'contain' }]} />
                                </> : <></>
                            }
                        </View>
                    </TouchableOpacity>
                </View>
            </Modal>

        </View>
    );
}

const CouponItemCard = ({ setModalVisible, couponInfoMeta, setSelectedCoupon }:
    {
        setModalVisible: React.Dispatch<React.SetStateAction<boolean>>,
        couponInfoMeta: CouponItemMeta,
        setSelectedCoupon: React.Dispatch<React.SetStateAction<CouponItemMeta | null>>,
    }
) => {

    const onPressModalOpen = () => {
        setSelectedCoupon(couponInfoMeta);
        setModalVisible(true);
    }

    return (
        <View style={styles.couponrowcontainer}>
            <TouchableOpacity onPress={onPressModalOpen}>
                <View style={styles.box}>
                    <Image
                        source={getImageSoucre({ imageId: couponInfoMeta.thumbnailId })}
                        style={[styles.image_product, { resizeMode: 'contain' }]} />
                    <Text style={styles.text_brand}>{couponInfoMeta.brandName}</Text>
                    <Text style={styles.text_product}>{couponInfoMeta.itemName}</Text>
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
        width: 300, height: "100%",
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
