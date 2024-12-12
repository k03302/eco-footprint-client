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
                    imgSource ?
                        <MaterialIcons
                            name="star"
                            size={24}
                            color={isApproved ? "gold" : "gray"}
                            style={styles.icon}
                        /> : <></>
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
                            isApproved ? <Image style={{ width: imgSize, height: imgSize }} source={require('@/assets/images/approved.png')}></Image> : <></>
                        }
                    </View>

                </ImageBackground>
            </TouchableOpacity>
        </View>
    )
}


const _ChallengeGallery = ({ userInfo, challengeInfo, onTodayImagePress = () => { }, onDatedImagePress = () => { } }: {
    userInfo: UserItemMeta, challengeInfo: ChallengeItem,
    onTodayImagePress?: (record?: ChallengeRecordItem) => void,
    onDatedImagePress?: (record?: ChallengeRecordItem) => void,
}) => {
    const [myGalleryList, setMyGalleryList] = useState<ChallengeRecordItem[]>([]);
    const [credit, setCredit] = useState<number>(0);

    useEffect(() => {

        let approvedCount = 0;

        const challengeRecords = challengeInfo.participantRecords || [];
        const myRecords = challengeRecords.filter((record) => {
            const isMine = record.userId === userInfo.id;
            if (isMine) {
                if (record.approved) {
                    approvedCount += 1;
                }
            }
            return isMine;
        })

        const sortedRecords = myRecords.sort((a, b) => {
            const first = new Date(a.date);
            const next = new Date(b.date);
            return new Date(next).getTime() - new Date(first).getTime();
        })
        setMyGalleryList(sortedRecords);

        setCredit(myRecords.length + approvedCount);

        console.log(challengeInfo !== null, challengeInfo.participantRecords);
    }, [userInfo, challengeInfo]);



    return (
        <View>
            <View style={{ marginBottom: 10, justifyContent: 'center', flexDirection: 'column' }}>
                <UserIcon message={userInfo.username}
                    iconSize={1}
                    imgSource={userInfo.thumbnailId ? getImageSource({ imageId: userInfo.thumbnailId }) : undefined}
                />
                <View style={{ marginRight: 30, flexDirection: 'row', gap: 10 }}>
                    <Text>챌린지 기여</Text>
                    <Text style={{ color: 'forestgreen', fontWeight: 'bold' }}>{credit}</Text>
                </View>
                <View style={{ marginRight: 30, flexDirection: 'row', gap: 10 }}>
                    <Text>포인트를 받기 위해 남은 기여</Text>
                    <Text style={{ color: 'forestgreen', fontWeight: 'bold' }}>
                        {
                            Math.max(MIN_CREDIT_FOR_REWARD - credit, 0)
                        }
                    </Text>
                </View>
                <View style={{ marginRight: 30, flexDirection: 'row', gap: 10 }}>
                    <Text>받을 포인트</Text>
                    <Text style={{ color: 'forestgreen', fontWeight: 'bold' }}>
                        {credit >= MIN_CREDIT_FOR_REWARD ? DEFAULT_REWARD + credit * REWARD_PER_CREDIT : 0}
                    </Text>
                    <Image source={require("@/assets/images/point.png")} style={{ width: 10, height: 10, marginTop: 5 }} />
                </View>
            </View>
            <View style={{ flexDirection: 'row', backgroundColor: 'ghostwhite', padding: 8, borderRadius: 10 }}>
                <ScrollView horizontal={true} showsVerticalScrollIndicator={false}>
                    {
                        myGalleryList.length === 0 ? <ChallengeImageToday
                            onPress={() => {
                                onTodayImagePress()
                            }}
                            imgSize={IMAGE_SIZE}
                            isApproved={false}
                            key={1000}
                        /> : (
                            !hasDatePassed(new Date(myGalleryList[0].date)) ? <ChallengeImageToday
                                onPress={() => {
                                    onTodayImagePress(myGalleryList[0])
                                }}
                                imgSize={IMAGE_SIZE}
                                isApproved={myGalleryList[0].approved}
                                imgSource={getImageSource({ imageId: myGalleryList[0].imageId })}
                                key={0}
                            /> : <>
                                <ChallengeImageToday
                                    onPress={() => {
                                        onTodayImagePress()
                                    }}
                                    imgSize={IMAGE_SIZE}
                                    isApproved={false}
                                    key={-1}
                                />
                                <ChallengeImageDated
                                    onPress={() => {
                                        onDatedImagePress(myGalleryList[0])
                                    }}
                                    imgSize={IMAGE_SIZE}
                                    imgSource={getImageSource({ imageId: myGalleryList[0].imageId }) || require('@/assets/images/empty.png')}
                                    isApproved={myGalleryList[0].approved}
                                    key={0} />
                            </>
                        )
                    }
                    {
                        myGalleryList.slice(1, myGalleryList.length).map((record, index) => {
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