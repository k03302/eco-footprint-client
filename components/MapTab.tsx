import { View, TouchableOpacity, Text, StyleSheet, Image } from "react-native";
import { router, Link } from 'expo-router';

export default function MapTab() {
    return (<View style={styles.tabcontainer}>
        <Link href="/challenge">
            <TouchableOpacity style={styles.iconbutton}>
                <Image source={require("@/assets/images/challenge.png")}
                    style={{ width: 35, height: 35, margin: 1 }} />
                <Text style={{ opacity: 0.9, fontSize: 12 }}>챌린지</Text>
            </TouchableOpacity>
        </Link>
        <Link href="/fundraising">
            <TouchableOpacity style={styles.iconbutton}>
                <Image source={require("@/assets/images/donation.png")}
                    style={{ width: 35, height: 35, margin: 1 }} />
                <Text style={{ opacity: 0.9, fontSize: 12 }}>환경 모금</Text>
            </TouchableOpacity>
        </Link>
        <Link href="/shop">
            <TouchableOpacity style={styles.iconbutton}>
                <Image source={require("@/assets/images/shop.png")}
                    style={{ width: 35, height: 35, margin: 1 }} />
                <Text style={{ opacity: 0.9, fontSize: 12 }}>리워드 샵</Text>
            </TouchableOpacity>
        </Link>

    </View>)
}

const styles = StyleSheet.create({
    tabcontainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: 'white'
    },
    iconbutton: {
        margin: 10,
        alignItems: 'center',
        width: 100,
        height: 50,
    },
});
