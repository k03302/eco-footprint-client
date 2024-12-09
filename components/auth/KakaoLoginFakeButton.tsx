import { Button, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { router } from 'expo-router'
import { login } from '@/utils/login';

export function KakaoLoginFakeButton() {
    return (
        <TouchableOpacity onPress={() => { login({ idToken: "12345" }); }}>
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