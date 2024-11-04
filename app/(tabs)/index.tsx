import { View, Image, StyleSheet, Platform } from 'react-native';
import { Tabs } from 'expo-router'

import { PROVIDER_GOOGLE } from 'react-native-maps';

import MapView from 'react-native-maps';

const GoogleMap = () => {

    return (
        <>
            <Tabs screenOptions={{ tabBarActiveTintColor: 'blue' }}>
                <Tabs.Screen
                    name="index"
                    options={{
                        title: 'Map'
                    }}
                />
            </Tabs>
            <View style={styles.screen}>
                <MapView // 셀프클로징해도 되지만 후의 마커를 위해서
                    style={styles.map}
                    initialRegion={{
                        latitude: 37.00000,
                        longitude: 126.00000,
                        latitudeDelta: 0.01,
                        longitudeDelta: 0.01,
                    }}
                    provider={PROVIDER_GOOGLE}
                >


                </MapView>
            </View></>
    )

}

export default GoogleMap

const styles = StyleSheet.create({
    screen: {
        flex: 1
    },
    map: {
        width: "100%",
        height: "100%"
    }
})