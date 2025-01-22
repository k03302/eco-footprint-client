import { ChallengeItem, ChallengeRecordItem, UserItemMeta } from "@/core/model"
import { MaterialIcons } from "@expo/vector-icons"
import { ImageSourcePropType, View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, ImageBackground } from "react-native"
import { UserIcon } from "../UserIcon"
import { hasDatePassed } from "@/utils/time"
import { memo, useEffect, useState } from "react"
import * as Progress from 'react-native-progress';
import { getImageSource } from "@/api/file"

const IMAGE_SIZE = 75;
const OBJECTIVE_CREDIT = 100;
const MIN_CREDIT_FOR_REWARD = 30;
const DEFAULT_REWARD = 600;
const RATIONAL_REWARD_TOTAL = 1000;
const REWARD_PER_CREDIT = 10;

export const GalleryBlankImage = ({ imgSize }: { imgSize: number }) => {
    return (<View
        style={{ width: imgSize, height: imgSize, borderRadius: imgSize / 4, backgroundColor: 'lightgray', marginRight: 5 }}
    >
    </View>);
}


export const GalleryImage = ({ imgSize, imgSource }: { imgSize: number, imgSource: ImageSourcePropType }) => {
    return (<Image
        source={imgSource} // Replace with your image URI
        style={{
            width: imgSize,
            height: imgSize,
            borderRadius: imgSize / 4, // Optional, for rounded corners
            marginRight: 5
        }}
    />)
}

export const ChallengeImageToday = ({ imgSize, imgSource, isApproved, onPress = () => { } }:
    { imgSize: number, imgSource?: ImageSourcePropType, isApproved: boolean, onPress: () => void }) => {
    return (
        <View style={{ position: 'relative' }}>
            <TouchableOpacity onPress={onPress}>
                <GalleryImage imgSize={imgSize}
                    imgSource={imgSource ? imgSource : require('@/assets/images/upload.png')} />
                {
                    imgSource &&
                    <MaterialIcons
                        name="star"
                        size={24}
                        color={isApproved ? "gold" : "gray"}
                        style={styles.icon}
                    />
                }
            </TouchableOpacity>
        </View>
    )
}

export const ChallengeImageDated = ({ imgSize, imgSource, isApproved, onPress = () => { } }:
    { imgSize: number, imgSource: ImageSourcePropType, isApproved: boolean, onPress: () => void }) => {
    return (
        <View style={{ position: 'relative', marginRight: 5 }}>
            <TouchableOpacity onPress={onPress}>
                <ImageBackground
                    source={imgSource}
                    style={{ width: imgSize, height: imgSize, borderRadius: imgSize / 4, overflow: 'hidden' }}
                >
                    <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
                        {
                            isApproved && <Image style={{ width: imgSize, height: imgSize }} source={require('@/assets/images/approved.png')}></Image>
                        }
                    </View>

                </ImageBackground>
            </TouchableOpacity>
        </View>
    )
}


const _ChallengeGallery = ({ userInfo, challengeInfo, showCredit = true, onTodayImagePress = () => { }, onDatedImagePress = () => { } }: {
    userInfo: UserItemMeta, challengeInfo: ChallengeItem,
    onTodayImagePress?: (record?: ChallengeRecordItem) => void,
    onDatedImagePress?: (record?: ChallengeRecordItem) => void,
    showCredit?: boolean
}) => {
    const [todayGallery, setTodayGallery] = useState<ChallengeRecordItem | null>(null);
    const [datedGalleryList, setDatedGalleryList] = useState<ChallengeRecordItem[] | null>(null);
    const [myCredit, setMyCredit] = useState<number>(0);
    const [totalCredit, setTotalCredit] = useState<number>(0);
    const [myCreditPercent, setMyCreditPercent] = useState<number>(0);
    const [showCreditInfo, setShowCreditInfo] = useState<boolean>(showCredit);

    useEffect(() => {
        const challengeRecords = challengeInfo.participantRecords || [];

        const datedRecords = [];
        let todayRecord = null;
        let myApprovedCount = 0;
        let totalApprovedCount = 0;

        //console.log(challengeRecords);
        for (const record of challengeRecords) {
            if (record.userId === userInfo.id) {
                const timestamp = (new Date(record.date)).getTime();


                const now = new Date();
                const last = new Date(record.date);
                console.log(record.date, now, last, now.toLocaleString(), last.toLocaleString());
                if (hasDatePassed(timestamp)) {
                    datedRecords.push(record);
                } else {
                    todayRecord = record;
                }

                if (record.approved) {
                    myApprovedCount++;
                }
            }
            if (record.approved) {
                totalApprovedCount++;
            }
        }
        const _myCredit = (todayRecord ? 1 : 0) + datedRecords.length + myApprovedCount;
        const _totalCredit = challengeRecords.length + totalApprovedCount;


        setDatedGalleryList(datedRecords);
        setTodayGallery(todayRecord);
        setMyCredit(_myCredit);
        setTotalCredit(_totalCredit);
        setMyCreditPercent((_totalCredit > 0 ? Math.floor((_myCredit / _totalCredit) * 100) : 0));
    }, [userInfo, challengeInfo]);



    return (
        <View>
            <View style={{ marginBottom: 10, justifyContent: 'center', flexDirection: 'column' }}>
                <UserIcon message={userInfo.username}
                    iconSize={1}
                    imgSource={userInfo.thumbnailId ? getImageSource({ imageId: userInfo.thumbnailId }) : undefined}
                    onPress={() => { setShowCreditInfo(!showCreditInfo); }}
                />
                {
                    showCreditInfo && <TouchableOpacity onPress={() => { setShowCreditInfo(!showCreditInfo) }}>
                        <View style={{ marginRight: 30, flexDirection: 'row', gap: 10 }}>
                            <Text>챌린지 기여</Text>
                            <Text style={{ color: 'forestgreen', fontWeight: 'bold' }}>{myCredit}</Text>

                        </View>
                        <View style={{ marginRight: 30, flexDirection: 'row', gap: 10 }}>
                            <Text>포인트를 받기 위해 남은 기여</Text>
                            <Text style={{ color: 'forestgreen', fontWeight: 'bold' }}>
                                {
                                    Math.max(MIN_CREDIT_FOR_REWARD - myCredit, 0)
                                }
                            </Text>
                        </View>
                        <View style={{ marginRight: 30, flexDirection: 'row', gap: 10 }}>
                            <Text>받을 수 있는 포인트</Text>

                            <Text style={{ color: 'forestgreen', fontWeight: 'bold' }}>
                                {DEFAULT_REWARD}
                            </Text>
                            <Image source={require("@/assets/images/point.png")} style={{ width: 10, height: 10, marginTop: 5 }} />
                            <Text style={{ color: 'forestgreen', fontWeight: 'bold' }}>+</Text>
                            <Text style={{ color: 'forestgreen', fontWeight: 'bold' }}>
                                {Math.floor(RATIONAL_REWARD_TOTAL * myCreditPercent / 100)}
                            </Text>
                            <Image source={require("@/assets/images/point.png")} style={{ width: 10, height: 10, marginTop: 5 }} />

                        </View>
                    </TouchableOpacity>
                }
            </View>
            <View style={{ flexDirection: 'row', backgroundColor: 'ghostwhite', padding: 8, borderRadius: 10 }}>
                <ScrollView horizontal={true} showsVerticalScrollIndicator={false}>
                    {
                        todayGallery ? <ChallengeImageToday
                            onPress={() => {
                                onTodayImagePress(todayGallery);
                            }}
                            imgSize={IMAGE_SIZE}
                            isApproved={todayGallery.approved}
                            imgSource={getImageSource({ imageId: todayGallery.imageId }) || require('@/assets/images/empty.png')}
                            key={1000}
                        /> : <ChallengeImageToday
                            onPress={() => {
                                onTodayImagePress();
                            }}
                            imgSize={IMAGE_SIZE}
                            isApproved={false}
                            key={-1}
                        />
                    }

                    {
                        datedGalleryList && datedGalleryList.map((record, index) => {
                            return <ChallengeImageDated
                                onPress={() => {
                                    onDatedImagePress(record)
                                }}
                                imgSize={IMAGE_SIZE}
                                imgSource={getImageSource({ imageId: record.imageId }) || require('@/assets/images/empty.png')}
                                isApproved={record.approved}
                                key={index} />
                        })
                    }

                </ScrollView>
            </View>
        </View>
    );
};
export const ChallengeGallery = memo(_ChallengeGallery);



const styles = StyleSheet.create({
    imageWrapper: {
        position: 'relative', // Allows absolute positioning within this container
    },
    icon: {
        position: 'absolute',
        top: 8, // Distance from the top of the image
        right: 8, // Distance from the right of the image
    },
    transparentoverlay: {
        ...StyleSheet.absoluteFillObject, // Covers the entire ImageBackground
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent black
    },
    progressBar: {
        marginBottom: 5,
    },
})