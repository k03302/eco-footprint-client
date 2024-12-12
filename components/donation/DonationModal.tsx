import { Modal, Text, TouchableOpacity, ImageBackground, ScrollView, Image, View, StyleSheet, Button, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from "react";
import * as Progress from 'react-native-progress';
import { DonationItem } from '@/core/model';
import { DonationCard } from '@/components/donation/DonationCard';
import { adService } from '@/service/ad';
import { ThemeButton } from '@/components/ThemeButton';
import { useIsFocused } from '@react-navigation/native';
import { participateDonation, participateDonation2 } from '@/api/donation';

export function DonationModal({ modalVisible, setModalVisible, donationInfo, earnedHandler = () => { } }
    : {
        modalVisible: boolean, setModalVisible: React.Dispatch<React.SetStateAction<boolean>>,
        donationInfo: DonationItem, earnedHandler?: () => void
    }
) {
    const [adWatchFinished, setAdWatchFinished] = useState<boolean>(false);
    const isFocused = useIsFocused();




    const viewAdHandler = () => {
        adService.showAd();
    }
    const closeAdHandler = () => {
        if (adWatchFinished) {
            participateDonation({ donationId: donationInfo.id, rewardPoint: 10 }).then(() => {
                earnedHandler();
            })
        }

        setModalVisible(false);
        setAdWatchFinished(false);
    }
    const updatePageInfo = async () => {
        if (!adService.isAdLoaded() && !adService.isAdOnLoading()) {
            adService.loadAd();
        }
        adService.registerEarnedHandler(async ({ amount, type }) => {
            adService.loadAd();
            setAdWatchFinished(true);
        });
    }


    useEffect(() => {
        if (!isFocused) return;
        updatePageInfo();
    }, [isFocused, donationInfo]);


    return (<Modal
        animationType='slide'
        visible={modalVisible}
        transparent={true}
        onRequestClose={closeAdHandler}>
        <TouchableOpacity style={styles.centeredView} onPress={() => { closeAdHandler }}>
            <View style={styles.modalView}>

                {
                    adWatchFinished && <>
                        <Text style={{ paddingTop: 10, fontSize: 30, fontWeight: 'bold', color: 'green' }}>
                            10<Image source={require("@/assets/images/point.png")}
                                style={{ width: 30, height: 30 }} />만큼 적립했어요
                        </Text>
                        <Text style={{ padding: 10, fontSize: 30, fontWeight: 'bold', color: 'green' }}>
                            도와주셔서 정말 감사해요!
                        </Text>
                    </>
                }
                <DonationCard donationInfo={donationInfo}></DonationCard>


                {
                    !adWatchFinished ?
                        <View style={{ flexDirection: 'column', }}>
                            <Text style={{ paddingVertical: 20, fontSize: 20 }}>
                                {donationInfo.description}
                            </Text>

                            <ThemeButton title="10 리워드 받고 도와주기" onPress={viewAdHandler} />
                            <ThemeButton title="거절하기" onPress={closeAdHandler} variant='secondary' />
                        </View>
                        :
                        <View style={{ flexDirection: 'row', }}>
                            <ThemeButton title="감사의 10 리워드 받기" onPress={closeAdHandler} />
                        </View>
                }
            </View>
        </TouchableOpacity>
    </Modal>)
}





const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        alignContent: "center",
        textAlignVertical: 'center',
        backgroundColor: "rgba(0, 0, 0, 0.3)#",
        justifyContent: 'center'
    },
    modalView: {
        backgroundColor: 'ghostwhite',
        borderRadius: 20,
        padding: 20,
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
});
