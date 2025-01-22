import { Button, TouchableOpacity, Image, StyleSheet, Alert } from 'react-native';
import { router } from 'expo-router'
import { login } from '@/utils/login';
import { isRegistered } from '@/utils/register';

export function KakaoLoginFakeButton({ fakeIdToken }: { fakeIdToken: string }) {
    return (
        <TouchableOpacity onPress={async () => {
            login(fakeIdToken);
            if (await isRegistered()) {
                router.replace('/map');
            } else {
                router.replace('/register');
            }
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