import { Stack } from 'expo-router';
import { Image, View, Text } from 'react-native';

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
                <Stack.Screen
                    name="challenge/index"
                    options={{
                        title: '챌린지',
                        headerStyle: {
                            backgroundColor: '#fff',
                        },
                        headerTitleStyle: {
                            fontWeight: 'bold',
                            fontSize: 20,
                        },
                        headerBackVisible: true,
                        headerTitleAlign: 'center',
                        headerBackTitleVisible: true,
                    }} />
                <Stack.Screen
                    name="shop/index"
                    options={{
                        title: '리워드샵',
                        headerRight: () => (
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 10 }}>
                                <Image source={require("@/assets/images/point.png")}
                                    style={{ width: 25, height: 25 }} />
                                <Text style={{ fontSize: 15, margin: 8 }}>3800</Text>
                            </View>
                        ),
                        headerStyle: {
                            backgroundColor: '#fff',
                        },
                        headerTitleStyle: {
                            fontWeight: 'bold',
                            fontSize: 20,
                        },
                        headerBackVisible: true,
                        headerTitleAlign: 'center'
                    }} />
                <Stack.Screen
                    name="fundraising/index"
                    options={{
                        title: '환경 모금',
                        headerRight: () => (
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 10 }}>
                                <Image source={require("@/assets/images/point.png")}
                                    style={{ width: 25, height: 25 }} />
                                <Text style={{ fontSize: 15, margin: 8 }}>3800</Text>
                            </View>
                        ),
                        headerStyle: {
                            backgroundColor: '#fff',
                        },
                        headerTitleStyle: {
                            fontWeight: 'bold',
                            fontSize: 20,
                        },
                        headerBackVisible: true,
                        headerTitleAlign: 'center'
                    }} />
            </Stack>
        </>
    );
}