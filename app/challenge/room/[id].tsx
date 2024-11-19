import { Modal, TouchableOpacity, ScrollView, Image, Text, View, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import React, { useEffect, useState } from "react";
import { Link } from 'expo-router';
import { useLocalSearchParams } from 'expo-router';
import { ChallengeItem } from '@/core/model';
import { repo } from '@/api/main';
import * as ImagePicker from 'expo-image-picker';
import { uploadProofShoot } from '@/api/challenge';



const DrawLine = () => {
    return (
        <View style={{ alignItems: 'center' }}>
            <Image source={require("@/assets/images/line.png")}
                style={{ width: 325, height: 1, marginTop: 15, borderRadius: 10 }} />
        </View>
    );
};

const MyChallengeImage = () => {
    return (
        <View>
            <Image source={require("@/assets/images/user.png")}
                style={{ width: 38, height: 38, marginTop: 10, marginBottom: 5, marginLeft: 5 }} />
            <View style={{ flexDirection: 'row' }}>
                <ScrollView horizontal={true} showsVerticalScrollIndicator={false}>
                    <Text style={{ marginLeft: 10 }}> </Text>
                    <Image source={require("@/assets/images/food1.png")}
                        style={{ width: 72, height: 75, marginLeft: 10 }} />
                    <Image source={require("@/assets/images/empty.png")}
                        style={{ width: 72, height: 75, marginLeft: 3 }} />
                    <Image source={require("@/assets/images/empty.png")}
                        style={{ width: 72, height: 75, marginLeft: 3 }} />
                    <Image source={require("@/assets/images/empty.png")}
                        style={{ width: 72, height: 75, marginLeft: 3 }} />
                </ScrollView>
            </View>
        </View>
    );
};

const MemberChallengeImage = () => {
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
            <Image source={require("@/assets/images/user.png")}
                style={{ width: 38, height: 38, marginTop: 10, marginBottom: 5, marginLeft: 5 }} />
            <View style={{ flexDirection: 'row' }}>
                <Text style={{ marginLeft: 10 }}> </Text>
                <TouchableOpacity onPress={onPressModalOpen}>
                    <Image source={require("@/assets/images/empty.png")}
                        style={{ width: 72, height: 75, marginLeft: 3 }} />
                </TouchableOpacity>

                <Image source={require("@/assets/images/empty.png")}
                    style={{ width: 72, height: 75, marginLeft: 3 }} />
                <Image source={require("@/assets/images/empty.png")}
                    style={{ width: 72, height: 75, marginLeft: 3 }} />
                <Image source={require("@/assets/images/empty.png")}
                    style={{ width: 72, height: 75, marginLeft: 3 }} />
                <Image source={require("@/assets/images/empty.png")}
                    style={{ width: 72, height: 75, marginLeft: 3 }} />
            </View>
            <Modal
                animationType="slide"
                visible={isModalVisible}
                transparent={true}>
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Image source={require("@/assets/images/food2.png")}
                            style={[styles.image_modal, { resizeMode: 'contain' }]} />
                        <Text style={{ fontSize: 17, marginTop: 20 }}>오늘 아침 식단은 간단한 샐러드</Text>
                        <View style={{ alignItems: 'center' }}>
                            <TouchableOpacity onPress={onPressModalClose}>
                                <Image source={require("@/assets/images/agreechallengebutton.png")}
                                    style={{ width: 265, height: 41, marginTop: 50, marginLeft: 3 }} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    )
}

export default function ChallengeScreen() {
    const challengeId = useLocalSearchParams().id as string;
    const [challengeItem, setChallengeItem] = useState<ChallengeItem | null>(null);



    useEffect(() => {
        (async () => {
            const challengeInfo = await repo.challenges.getChallenge(challengeId);
            setChallengeItem(challengeInfo);
        })();
    }, []);


    const takePhoto = async () => {
        // Request permissions
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('인증을 위해 카메라 권한이 필요합니다.');
            return;
        }

        // Launch the camera
        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true, // Allow the user to crop the image
            quality: 1, // Set the image quality (1 is best)
        });

        if (!result.canceled) {
            await uploadProofShoot(challengeId, result.assets[0].uri);
        }
    };

    if (!challengeItem) {
        return <ActivityIndicator size="large"></ActivityIndicator>
    }

    return (
        <View style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.container_title}>
                    <DrawLine />
                    <Text style={{ fontSize: 22, fontWeight: 'bold', margin: 20 }}>{challengeItem.name}</Text>
                    <DrawLine />
                </View>
                <View style={styles.container_progress}>
                    <Text style={{ fontSize: 18, fontWeight: 'bold', marginLeft: 10 }}>현재 챌린지 진행률</Text>
                    <View style={{ alignItems: 'center' }}>

                    </View>
                    <DrawLine />
                </View>
                <View style={styles.container_myrecord}>
                    <Text style={{ fontSize: 18, fontWeight: 'bold', marginLeft: 10 }}>나의 챌린지 기록</Text>
                    <MyChallengeImage />
                    <View style={{ alignItems: 'center' }}>
                        <TouchableOpacity onPress={takePhoto}>
                            <Image source={require("@/assets/images/writechallengebutton.png")}
                                style={{ width: 265, height: 41, marginTop: 20, marginLeft: 3 }} />
                        </TouchableOpacity>
                    </View>
                    <DrawLine />
                </View>
                <View style={styles.container_memberrecord}>
                    <View style={{ alignItems: 'center' }}>
                        <Text style={{ fontSize: 13 }}>멤버의 기록을 확인하세요!</Text>
                    </View>
                    <MemberChallengeImage />
                    <MemberChallengeImage />
                    <MemberChallengeImage />
                    <MemberChallengeImage />
                </View>
            </ScrollView>
        </View>
    )
}



const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    container_title: {
        flexDirection: 'column',
        alignItems: 'center',
        marginBottom: 10,
    },
    container_progress: {
        margin: 10,
    },
    container_myrecord: {
        margin: 10
    },
    container_memberrecord: {
        margin: 10
    },
    container_button: {
        flex: 1,
        margin: 10,
        alignItems: 'center'
    },
    text_1: {
        fontSize: 15,
        fontWeight: 'bold',
        color: 'black',
        textAlign: 'left',
        marginLeft: 10,
        marginTop: 10,
        marginBottom: 10,
    },
    goalContainer: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        marginTop: 10,
        marginLeft: 10,
        marginRight: 10,
        backgroundColor: '#FAF7F7',
        borderRadius: 10,
        height: 65
    },
    goalrowContainer: {
        flexDirection: 'row',
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
    image_modal: {
        width: 300,
        height: 320,
    }
});

function useCallback(arg0: () => void, arg1: never[]) {
    throw new Error('Function not implemented.');
}
