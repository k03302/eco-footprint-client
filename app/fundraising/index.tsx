import { Modal, Text, TouchableOpacity, ImageBackground, ScrollView, Image, View, StyleSheet, Button, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from "react";
import * as Progress from 'react-native-progress';
import { repo, util } from '@/service/main';
import { DonationItemMeta } from '@/core/model';
import { adService } from '@/service/ad';
// import { participateDonation } from '@/service/user';

function AdViewCard({ donationInfo, onRewardEarned }: { donationInfo: DonationItemMeta, onRewardEarned: () => void }) {
    const [isModalVisible, setisModalVisible] = useState<boolean>(false);

    useEffect(() => {
        console.log(donationInfo);
        if (!adService.isAdLoaded() && !adService.isAdOnLoading()) {
            adService.loadAd();
        }

        adService.registerEarnedHandler(async ({ amount, type }) => {
            adService.loadAd();
            // const userInfo = await participateDonation(donationInfo.id);
            onRewardEarned();
        });

        return () => {
            adService.registerEarnedHandler(() => { });
        }
    }, []);



    const onPressModalOpen = () => {
        setisModalVisible(true);
    }

    const viewAdHandler = () => {
        setisModalVisible(false);
        adService.showAd();
    }

    const cancelAdHandler = () => {
        setisModalVisible(false);
    }

    const progressRate = donationInfo.currentPoint / donationInfo.targetPoint;
    console.log("donationInfo.currentPoint", donationInfo.currentPoint);
    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={onPressModalOpen}>
                <View style={styles.frame}>
                    <View style={styles.imageWrapper}>
                        <Image
                            // source={util.getFileSource(donationInfo.thumbnailId)}
                            style={styles.image}
                        />
                    </View>

                    <View style={styles.overlay}>
                        <Text>{donationInfo.name}</Text>
                        <Progress.Bar
                            progress={progressRate}
                            width={150}
                            color="#3b5998"
                            style={styles.progressBar}
                        />
                        <Text style={styles.progressText}>
                            {(progressRate * 100).toFixed(0)}%
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>


            <Modal
                animationType='slide'
                visible={isModalVisible}
                transparent={true}>
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <View style={styles.frame}>
                            <View style={styles.imageWrapper}>
                                <Image
                                    // source={util.getFileSource(donationInfo.thumbnailId)}
                                    style={styles.image}
                                />
                            </View>

                            <View style={styles.overlay}>
                                <Progress.Bar
                                    progress={progressRate}
                                    width={150}
                                    color="#3b5998"
                                    style={styles.progressBar}
                                />
                                <Text style={styles.progressText}>
                                    {(progressRate * 100).toFixed(0)}%
                                </Text>
                            </View>
                        </View>
                        <View style={{ flexDirection: 'row', }}>
                            <TouchableOpacity onPress={cancelAdHandler}>
                                <Image source={require("@/assets/images/rejectbutton.png")}
                                    style={[styles.image_button,]} />
                            </TouchableOpacity>
                            <Text>   </Text>
                            <TouchableOpacity onPress={viewAdHandler}>
                                <Image source={require("@/assets/images/pluspointbutton.png")}
                                    style={[styles.image_button]} />
                            </TouchableOpacity>
                        </View>

                    </View>
                </View>
            </Modal>
        </View>

    )


}


export default function DonationScreen() {
    const [fundraisingList, setFundraisingList] = useState<DonationItemMeta[]>([]);
    const [version, setVersion] = useState<number>(0);


    useEffect(() => {
        (async () => {
            // setFundraisingList(await repo.donations.getAllDonations());
        })();
    }, [version]);

    if (fundraisingList.length === 0) {
        return <ActivityIndicator size="large"></ActivityIndicator>
    }



    return (
        <ScrollView showsVerticalScrollIndicator={false} >
            <View style={styles.container}>
                {
                    fundraisingList.map((fundraisingInfo, index) => {
                        if (fundraisingInfo.currentPoint >= fundraisingInfo.targetPoint) {
                            return <View key={index}></View>
                        }
                        return <AdViewCard donationInfo={fundraisingInfo} key={index} onRewardEarned={() => { setVersion(version + 1) }}></AdViewCard>
                    })
                }
            </View>
        </ScrollView>
    );
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
    },
    modalView: {
        marginTop: 130,
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
