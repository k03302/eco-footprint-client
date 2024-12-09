import { TouchableOpacity, ScrollView, Image, Text, View, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ChallengeItem } from '@/core/model';
import { getFileSource, repo } from '@/localApi/main';
import { UserIcon } from '@/components/UserIcon';
import { useIsFocused } from '@react-navigation/native';
import { participateChallenge } from '@/localApi/challenge';
import { HorizontalLine } from '@/components/HorizontalLine';
import { ThemeButton } from '@/components/ThemeButton';

export default function ChallengeScreen() {
    const challengeId = useLocalSearchParams().id as string;

    const [challengeInfo, setChallengeInfo] = useState<ChallengeItem | null>(null);
    const isFocused = useIsFocused();
    const [hasToUpdate, setHasToUpdate] = useState<boolean>(false);


    const updatePageInfo = async () => {
        setChallengeInfo(await repo.challenges.getChallenge(challengeId));
    }

    useEffect(() => {
        if (!isFocused) return;
        updatePageInfo();
    }, [isFocused]);

    useEffect(() => {
        if (!hasToUpdate) return;
        updatePageInfo().then(() => {
            setHasToUpdate(false);
        });
    }, [hasToUpdate]);


    const participateChallengeHandler = async () => {
        const success = await participateChallenge(challengeId);
        if (success) {
            router.push({ pathname: '/challenge/room/[id]', params: { id: challengeId } })
        } else {
            Alert.alert('잘못된 요청입니다.');
            router.push('/challenge');
        }
    }


    if (!challengeInfo) {
        return <ActivityIndicator size="large"></ActivityIndicator>
    }

    return (
        <View style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.container_title}>
                    <Text style={{ fontSize: 22, fontWeight: 'bold' }}>{challengeInfo.name}</Text>
                    <HorizontalLine />
                </View>
                <View style={styles.container_member}>
                    <Text style={{ fontSize: 18, fontWeight: 'bold', marginLeft: 10 }}>멤버 ({challengeInfo.currentParticipants}/{challengeInfo.totalParticipants})</Text>
                    <View style={{ flexDirection: 'column' }}>
                        <Text style={{ marginLeft: 10 }}> </Text>
                        {
                            challengeInfo.participants.map((participant, index) => <UserIcon
                                key={index}
                                imgSource={getFileSource(participant.thumbnailId)}
                                iconSize={1}
                                message={participant.username}
                            >
                            </UserIcon>)
                        }
                    </View>
                    <HorizontalLine />
                </View>
                <View style={styles.container_info}>
                    <Text style={{ fontSize: 18, fontWeight: 'bold', marginTop: 10, marginLeft: 10 }}>챌린지 설명</Text>
                    <Text style={{ fontSize: 17, margin: 12, opacity: 0.8 }}>
                        {challengeInfo.description}
                    </Text>
                </View>
                {/* <View style={styles.container_info}>
                    <Text style={{ fontSize: 18, fontWeight: 'bold', marginTop: 10, marginLeft: 10 }}>챌린지 인증사진</Text>
                    <Text style={{ fontSize: 17, margin: 12, opacity: 0.8 }}>

                    </Text>
                </View> */}
            </ScrollView>
            <View style={styles.container_button}>
                <ThemeButton title="챌린지 참가하기" onPress={participateChallengeHandler}></ThemeButton>
            </View>
        </View>
    )
}



const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        alignItems: 'center'
    },
    container_title: {
        flexDirection: 'column',
        alignItems: 'center',
        marginBottom: 10,
    },
    container_part: {
        margin: 10,
    },
    container_member: {
        margin: 10
    },
    container_info: {
        margin: 10
    },
    container_button: {
        position: 'absolute',
        bottom: 10,
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
    }
});