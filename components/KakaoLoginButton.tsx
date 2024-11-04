import { Button } from 'react-native';
import { router } from 'expo-router'

export default function KakaoLoginButton() {
    return (
        <Button
            title="Login with Kakao"
            onPress={() => router.push('kakaologin')}
        />
    )
}