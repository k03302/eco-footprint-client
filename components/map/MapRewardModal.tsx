import { Modal, Text, TouchableOpacity, ImageBackground, ScrollView, Image, View, StyleSheet, Button, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from "react";
import * as Progress from 'react-native-progress';
import { getFileSource } from '@/api/main';
import { DonationItem } from '@/core/model';
import { DonationCard } from '@/components/donation/DonationCard';
import { adService } from '@/service/ad';
import { participateDonation } from '@/api/user';
import { GreenButton } from '../GreenButton';
import { useIsFocused } from '@react-navigation/native';

export function MapRewardModal({ modalVisible, setModalVisible, donationInfo, earnedHandler = () => { } }
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



    const closeAdHandler = (donationPoint = 0) => {
        if (adWatchFinished) {
            participateDonation(donationInfo.id, donationPoint).then(() => {
                earnedHandler();
            }).then(() => {
                if (donationPoint > 0) {
                    donationInfo.currentPoint += donationPoint;
                    setTimeout(() => {
                        console.log('ok');
                        setModalVisible(false);
                        setAdWatchFinished(false);
                    }, 2000);
                } else {
                    setModalVisible(false);
                    setAdWatchFinished(false);
                }

            })
        } else {
            setModalVisible(false);
            setAdWatchFinished(false);
        }


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
        onRequestClose={() => { setModalVisible(false); }}>
        <TouchableOpacity style={styles.centeredView} onPress={() => { closeAdHandler() }}>
            <View style={styles.modalView}>

                <DonationCard donationInfo={donationInfo}></DonationCard>


                {
                    !adWatchFinished ?
                        <View style={{ flexDirection: 'column' }}>
                            <Text style={{ paddingVertical: 20, fontSize: 20 }}>
                                {donationInfo.description}
                            </Text>
                            <GreenButton title="광고 안보기" onPress={() => { closeAdHandler(0) }}></GreenButton>
                            <GreenButton title="20 리워드 받고 도와주기" onPress={() => {
                                viewAdHandler();
                            }}></GreenButton>
                        </View>
                        :
                        <View style={{ flexDirection: 'column', }}>
                            <GreenButton title="1리워드 기부" onPress={() => { closeAdHandler(1) }} />
                            <GreenButton title="5리워드 기부" onPress={() => { closeAdHandler(5) }} />
                            <GreenButton title="20리워드 모두 받기" onPress={() => { closeAdHandler(0) }} />

                        </View>
                }
            </View>
        </TouchableOpacity>
    </Modal>)
}





const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
    },
    adviewcontainer: {
        width: '100%'

    },
    frame: {
        width: 300,
        height: 400,
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative', // 겹친 요소를 위한 상대적 위치 설정        
    },
    imageWrapper: {
        width: '100%',
        height: '75%',
        borderRadius: 20,
        overflow: 'hidden', // 라운딩된 모서리를 유지
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    overlay: {
        position: 'absolute',
        bottom: 0,
        width: 220,
        height: 100,
        backgroundColor: '#ffffff',
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    progressBar: {
        marginBottom: 5,
    },
    progressText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    centeredView: {
        flex: 1,
        alignContent: "center",
        textAlignVertical: 'center',
        backgroundColor: "rgba(0, 0, 0, 0.3)#",
        justifyContent: 'center'
    },
    modalView: {
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
    image_donation: {
        width: 400,
        height: 500
    },
    image_button: {
        width: 114,
        height: 38
    }
});
