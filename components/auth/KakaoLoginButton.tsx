import { Button, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { router } from 'expo-router'

export default function KakaoLoginButton() {
    return (
        <TouchableOpacity onPress={() => router.push('/kakaologin')}>
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