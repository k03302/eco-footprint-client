import { Button, TouchableOpacity, Image, StyleSheet, Alert } from 'react-native';
import { router } from 'expo-router'
import { login } from '@/utils/login';

export function KakaoLoginFakeButton({ fakeIdToken }: { fakeIdToken: string }) {
    return (
        <TouchableOpacity onPress={() => {
            login({
                idToken: fakeIdToken, onLoginFail: () => {
                    Alert.alert('로그인에 실패했습니다.');
                    router.replace('/');
                }, onLoginSuccess: () => {
                    router.replace('/map');
                }, onNeedRegister: () => {
                    router.push('/register');
                }
            });
        }}>
            <Image source={require("@/assets/images/kakao_login.png")}
                style={styles.image_login_kakao} />
        </TouchableOpacity>

    )
}

const styles = StyleSheet.create({
    image_login_kakao: {
        width: 252,
        height: 58,
    },
})