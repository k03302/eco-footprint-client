import { Stack, router } from 'expo-router';
import { Button } from 'react-native';

export default function Layout() {
    return (
        <>
            <Stack>
                <Stack.Screen
                    name="index"
                    options={{ headerShown: false }} />
                <Stack.Screen
                    name="map"
                    options={{ headerShown: false }} />
                <Stack.Screen
                    name="kakaologin"
                    options={{ headerShown: false }} />
            </Stack>
        </>
    );
}