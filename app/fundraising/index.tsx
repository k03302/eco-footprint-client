import { Modal, Text, TouchableOpacity, ImageBackground, ScrollView, Image, View, StyleSheet, Button } from 'react-native';
import React, { useEffect, useState } from "react";
import * as Progress from 'react-native-progress';
import { repo } from '@/api/main';
import { DonationItemMeta } from '@/core/model';

function AdViewCard({ donationInfo }: { donationInfo: DonationItemMeta }) {
    const [isModalVisible, setisModalVisible] = useState<boolean>(false);

    useEffect(() => {

    }, []);

    const onPressModalOpen = () => {
        setisModalVisible(true);
    }

    const onPressModalClose = () => {
        setisModalVisible(false);
    }

    const progressRate = donationInfo.currentPoint / donationInfo.targetPoint;

    return (
        <View style={styles.container}>
            <View style={styles.frame}>
                <View style={styles.imageWrapper}>
                    <Image
                        source={require('@/assets/images/donation_img.png')}
                        style={styles.image}
                    />
                </View>

                {/* 겹쳐진 라운딩된 직사각형 */}
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


            <Modal
                animationType='slide'
                visible={isModalVisible}
                transparent={true}>
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <ImageBackground source={require("@/assets/images/donationImage1.png")}
                            resizeMode='cover' style={styles.image_donation}>
                            <View style={{ flex: 1, marginBottom: 3, alignItems: 'center', flexDirection: 'column-reverse' }}>
                                <View style={{ flexDirection: 'row', }}>
                                    <TouchableOpacity onPress={onPressModalClose}>
                                        <Image source={require("@/assets/images/rejectbutton.png")}
                                            style={[styles.image_button,]} />
                                    </TouchableOpacity>
                                    <Text>   </Text>
                                    <TouchableOpacity onPress={onPressModalClose}>
                                        <Image source={require("@/assets/images/pluspointbutton.png")}
                                            style={[styles.image_button]} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </ImageBackground>
                    </View>
                </View>
            </Modal>
        </View>

    )


}


const PointWithAD = () => {

    const [isModalVisible, setisModalVisible] = useState<boolean>(false);

    useEffect(() => {
    }, []);

    const onPressModalOpen = () => {
        setisModalVisible(true);
    }

    const onPressModalClose = () => {
        setisModalVisible(false);
    }

    return (
        <View>
            <TouchableOpacity onPress={onPressModalOpen}>
                <View style={{ width: 241, height: 134, margin: 30, }} />
            </TouchableOpacity>
            <Modal
                animationType='slide'
                visible={isModalVisible}
                transparent={true}>
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <View style={{ flex: 1, marginBottom: 3, alignItems: 'center', flexDirection: 'column-reverse' }}>
                            <View style={{ flexDirection: 'row', }}>
                                <TouchableOpacity onPress={onPressModalClose}>
                                    <Image source={require("@/assets/images/rejectbutton.png")}
                                        style={[styles.image_button,]} />
                                </TouchableOpacity>
                                <Text>   </Text>
                                <TouchableOpacity onPress={onPressModalClose}>
                                    <Image source={require("@/assets/images/pluspointbutton.png")}
                                        style={[styles.image_button]} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );

};

export default function DonationScreen() {
    return (
        <ScrollView showsVerticalScrollIndicator={false} >
            <View style={styles.container}>

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
    frame: {
        width: 250,
        height: 400,
        backgroundColor: '#fff',
        borderRadius: 20,
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative', // 겹친 요소를 위한 상대적 위치 설정
        elevation: 5, // 그림자 효과 (Android)
        shadowColor: '#000', // 그림자 색상 (iOS)
        shadowOffset: { width: 0, height: 2 }, // 그림자 위치 (iOS)
        shadowOpacity: 0.3, // 그림자 투명도 (iOS)
        shadowRadius: 5, // 그림자 반경 (iOS)
    },
    imageWrapper: {
        width: '90%',
        height: '70%',
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
        bottom: 20,
        width: 180,
        height: 80,
        backgroundColor: 'rgba(255, 255, 255, 0.9)', // 투명 배경
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 3, // 겹친 직사각형 그림자 효과
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
    image_donation: {
        width: 400,
        height: 500
    },
    image_button: {
        width: 114,
        height: 38
    }
});
