import { TouchableOpacity, ScrollView, Image, Text, View, StyleSheet, ActivityIndicator } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ChallengeItem } from '@/core/model';
import { repo } from '@/api/main';
import UserIcon from '@/components/UserIcon';
import { useIsFocused } from '@react-navigation/native';

const DrawLine = () => {
    return (
        <View style={{ alignItems: 'center' }}>
            <Image source={require("@/assets/images/line.png")}
                style={{ width: 325, height: 1, marginTop: 15, borderRadius: 10 }} />
        </View>
    );
};

export default function ChallengeScreen() {
    const challengeId = useLocalSearchParams().id as string;
    const [challengeInfo, setChallengeInfo] = useState<ChallengeItem | null>(null);
    const isFocused = useIsFocused();

    useEffect(() => {

    }, [isFocused])


    const participateChallengeHandler = async () => {
        //await participateChallenge(challengeId);
        router.replace({ pathname: '/challenge/room/[id]', params: { id: challengeId } })
    }

    useEffect(() => {
        (async () => {
            // const challengeInfo = await repo.challenges.getChallenge(challengeId);
            // setChallengeInfo(challengeInfo);
        })();
    }, []);

    if (!challengeInfo) {
        return <ActivityIndicator size="large"></ActivityIndicator>
    }

    return (
        <View style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.container_title}>
                    <Text style={{ fontSize: 22, fontWeight: 'bold' }}>{challengeInfo.name}</Text>
                    <DrawLine />
                </View>
                <View style={styles.container_part}>
                    <Text style={{ fontSize: 18, fontWeight: 'bold', marginLeft: 10 }}>챌린지 종류</Text>
                    <Text style={{ fontSize: 17, marginTop: 10, marginLeft: 10 }}>{challengeInfo.type}</Text>
                    <DrawLine />
                </View>
                <View style={styles.container_member}>
                    <Text style={{ fontSize: 18, fontWeight: 'bold', marginLeft: 10 }}>멤버 ({challengeInfo.currentParticipants}/{challengeInfo.totalParticipants})</Text>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={{ marginLeft: 10 }}> </Text>
                        {
                            challengeInfo.participants.map((participant, index) => <UserIcon
                                userId={participant.id}>
                            </UserIcon>)
                        }
                    </View>
                    <DrawLine />
                </View>
                <View style={styles.container_info}>
                    <Text style={{ fontSize: 18, fontWeight: 'bold', marginTop: 10, marginLeft: 10 }}>챌린지 설명</Text>
                    <Text style={{ fontSize: 17, margin: 12, opacity: 0.8 }}>
                        {challengeInfo.description}
                    </Text>
                </View>
            </ScrollView>
            <View style={styles.container_button}>
                <TouchableOpacity onPress={participateChallengeHandler}>
                    <Image source={require("@/assets/images/joinchallengebutton.png")}
                        style={{ width: 265, height: 41, marginTop: 10, marginLeft: 3 }} />
                </TouchableOpacity>
            </View>
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
    }
});