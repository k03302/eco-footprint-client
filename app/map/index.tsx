import { View, Image, StyleSheet, Platform, TouchableOpacity, Text } from 'react-native';
import { Tabs, router } from 'expo-router'

import { PROVIDER_GOOGLE } from 'react-native-maps';

import MapView from 'react-native-maps';

const GoogleMap = () => {

    return (
        <>
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
                <View style={styles.container}>
                    <View style={styles.tabContainer}>
                        <TouchableOpacity
                            style={styles.tab}
                            onPress={() => router.push("/fundraising")}
                        >
                            <Text style={styles.tabText}>Fundraising</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.tab}
                            onPress={() => router.push("/chellenge")}
                        >
                            <Text style={styles.tabText}>Chellenge</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.tab}
                            onPress={() => router.push("/shop")}
                        >
                            <Text style={styles.tabText}>Shop</Text>
                        </TouchableOpacity>
                    </View>
                </View>
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
        height: "80%"
    },
    container: {
        flex: 1,
        justifyContent: 'space-between',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontSize: 18,
    },
    tabContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingVertical: 10,
        backgroundColor: '#f8f8f8',
        borderTopWidth: 1,
        borderTopColor: '#ddd',
    },
    tab: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 10,
    },
    activeTab: {
        backgroundColor: '#ddd', // Optional: change color for active tab
    },
    tabText: {
        fontSize: 16,
        color: '#333',
    },
})