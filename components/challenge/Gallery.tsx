import { getFileSource } from "@/api/main"
import { ChallengeItem, ChallengeRecoordItem, UserItemMeta } from "@/core/model"
import { MaterialIcons } from "@expo/vector-icons"
import { ImageSourcePropType, View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, ImageBackground } from "react-native"
import UserIcon from "../UserIcon"
import { hasDatePassed } from "@/utils/time"
import { memo, useEffect, useState } from "react"
import * as Progress from 'react-native-progress';

const IMAGE_SIZE = 75;
const OBJECTIVE_POINT = 100;
const MIN_BLANK_COUNT = 5;

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


const _ChallengeGallery = ({ yes, userInfo, challengeInfo, onTodayImagePress = () => { }, onDatedImagePress = () => { } }: {
    userInfo: UserItemMeta, challengeInfo: ChallengeItem,
    onTodayImagePress?: (recoord?: ChallengeRecoordItem) => void,
    onDatedImagePress?: (recoord?: ChallengeRecoordItem) => void,
    yes: boolean
}) => {
    const [myGalleryList, setMyGalleryList] = useState<ChallengeRecoordItem[]>([]);
    const [credit, setCredit] = useState<number>(0);

    useEffect(() => {
        let approvedCount = 0;

        const challengeRecoords = challengeInfo.participantsRecord;
        const myRecoords = challengeRecoords.filter((recoord) => {
            const isMine = recoord.userId === userInfo.id;
            if (isMine) {
                if (recoord.approved) {
                    approvedCount += 1;
                }
            }
            return isMine;
        })

        const sortedRecoords = myRecoords.sort((a, b) => {
            return new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime();
        })
        setMyGalleryList(sortedRecoords);

        setCredit(myRecoords.length + approvedCount);
    }, [userInfo, challengeInfo]);

    return (
        <View>
            <View style={{ marginBottom: 10, justifyContent: 'center', flexDirection: 'row' }}>
                <UserIcon message={userInfo.username}
                    iconSize={1}
                    imgSource={userInfo.thumbnailId ? (yes ? { uri: userInfo.thumbnailId } : getFileSource(userInfo.thumbnailId)) : undefined}
                />
                <View style={{ marginRight: 30, justifyContent: 'center' }}>
                    <Text>챌린지 기여도</Text>
                    <Progress.Bar
                        progress={credit / OBJECTIVE_POINT}
                        width={200}
                        height={10}
                        color="#849C6A"
                        style={styles.progressBar}
                        borderWidth={0}
                        unfilledColor='lightgray'
                    />
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
                            key={'a'}
                        /> : <></>
                    }
                    {
                        myGalleryList.map((recoord, index) => {
                            if (index === 0) {
                                if (!hasDatePassed(new Date(myGalleryList[0].uploadDate))) {
                                    return (<ChallengeImageToday
                                        onPress={() => {
                                            onTodayImagePress(myGalleryList[0])
                                        }}
                                        imgSize={IMAGE_SIZE}
                                        isApproved={myGalleryList[0].approved}
                                        imgSource={getFileSource(myGalleryList[0].recordId)}
                                        key={'b' + index}
                                    />)
                                } else {
                                    return (<>
                                        <ChallengeImageToday
                                            onPress={() => {
                                                onTodayImagePress()
                                            }}
                                            imgSize={IMAGE_SIZE}
                                            isApproved={false}
                                            key={'c' + index}
                                        />
                                        <ChallengeImageDated
                                            onPress={() => {
                                                onDatedImagePress(recoord)
                                            }}
                                            imgSize={IMAGE_SIZE}
                                            imgSource={getFileSource(recoord.recordId)}
                                            isApproved={recoord.approved}
                                            key={'d' + index} />
                                    </>)
                                }
                            }
                            return <ChallengeImageDated
                                onPress={() => {
                                    onDatedImagePress(recoord)
                                }}
                                imgSize={IMAGE_SIZE}
                                imgSource={getFileSource(recoord.recordId)}
                                isApproved={recoord.approved}
                                key={'e' + index} />
                        })
                    }
                    {
                        myGalleryList.length < MIN_BLANK_COUNT ? [...Array(MIN_BLANK_COUNT - myGalleryList.length)].map(i => {
                            return <GalleryBlankImage imgSize={IMAGE_SIZE} key={i}></GalleryBlankImage>
                        }) : <></>
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