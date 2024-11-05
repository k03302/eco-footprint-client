import { Stack, router } from 'expo-router';
import { Button } from 'react-native';

export default function Layout() {
    return (
        <>
            <Stack>
                <Stack.Screen
                    name="(auth)/index"
                    options={{ headerShown: false }} />
                <Stack.Screen
                    name="(auth)/kakaologin"
                    options={{ headerShown: false }} />
                <Stack.Screen
                    name="(auth)/register"
                    options={{ headerShown: false }} />
                <Stack.Screen
                    name="map/index"
                    options={{ headerShown: false }} />
            </Stack>
        </>
    );
}