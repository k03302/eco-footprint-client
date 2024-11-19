import { TouchableOpacity, ScrollView, Image, Text, View, StyleSheet } from 'react-native';
import { Link, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ChallengeItem } from '@/core/model';
import { repo } from '@/api/main';

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
    const [challengeItem, setChallengeItem] = useState<ChallengeItem | null>(null);

    useEffect(() => {
        (async () => {
            const challengeInfo = await repo.challenges.getChallenge(challengeId);
            setChallengeItem(challengeInfo);
        })();
    }, []);

    return (
        <View style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.container_title}>
                    <Text style={{ fontSize: 22, fontWeight: 'bold' }}>건강한 식단하기</Text>
                    <DrawLine />
                </View>
                <View style={styles.container_part}>
                    <Text style={{ fontSize: 18, fontWeight: 'bold', marginLeft: 10 }}>챌린지 종류</Text>
                    <Text style={{ fontSize: 17, marginTop: 10, marginLeft: 10 }}>식사 기록</Text>
                    <DrawLine />
                </View>
                <View style={styles.container_member}>
                    <Text style={{ fontSize: 18, fontWeight: 'bold', marginLeft: 10 }}>멤버 (3/5)</Text>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={{ marginLeft: 10 }}> </Text>
                        <Image source={require("@/assets/images/user.png")}
                            style={{ width: 38, height: 38, marginTop: 10, marginLeft: 3 }} />
                        <Image source={require("@/assets/images/user.png")}
                            style={{ width: 38, height: 38, marginTop: 10, marginLeft: 3 }} />
                        <Image source={require("@/assets/images/user.png")}
                            style={{ width: 38, height: 38, marginTop: 10, marginLeft: 3 }} />
                    </View>
                    <DrawLine />
                </View>
                <View style={styles.container_info}>
                    <Text style={{ fontSize: 18, fontWeight: 'bold', marginTop: 10, marginLeft: 10 }}>챌린지 설명</Text>
                    <Text style={{ fontSize: 17, margin: 12, opacity: 0.8 }}>
                        여러분, 건강한 식단 챌린지 같이 시작해보지 않으실래요? 💪😊
                        {"\n"}{"\n"}
                        건강한 식습관을 함께 실천하면서 활력을 찾고 몸과 마음을 돌보는 시간이 될 거예요. 하루 한 끼라도 더 건강하게 먹고, 작은 변화를 통해 큰 변화를 만들어가는 도전이에요!
                        {"\n"}{"\n"}
                        목표: 채소, 과일, 단백질을 고르게 섭취하며 균형 잡힌 식사를 하는 것!
                        {"\n"}
                        방식: 매일 먹은 식단을 사진으로 기록해요.
                        혼자 하면 힘들 수 있지만, 함께하면 재미도 있고 서로 격려하면서 꾸준히 이어갈 수 있어요. 이 챌린지에 참여하면서 달라진 기분과 활력을 함께 나눠봐요! 작은 습관이 큰 건강을 만든다는 걸 함께 경험해요!
                    </Text>
                </View>
            </ScrollView>
            <View style={styles.container_button}>
                <Link href="/challenge">
                    <TouchableOpacity>
                        <Image source={require("@/assets/images/joinchallengebutton.png")}
                            style={{ width: 265, height: 41, marginTop: 10, marginLeft: 3 }} />
                    </TouchableOpacity>
                </Link>
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