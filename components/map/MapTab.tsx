import { View, StyleSheet, Text } from 'react-native';
import { memo } from 'react';

function MapTab() {
    return <View style={styles.moveinfocontainer}>
        <View style={styles.movecount}>
            <Text style={{ fontSize: 20 }}>탄소저감량  </Text>
            {/* <Text style={{ fontSize: 40 }}>{carbonDecrease.toFixed(1)}g</Text> */}

        </View>
        <View style={styles.extracount}>
            <Text style={{ opacity: 0.8, fontSize: 10 }}>남은 아이템 개수   </Text>
            {/* <Text style={{ fontSize: 18 }}>{currentItemCount}</Text> */}
        </View>
    </View>
}



const styles = StyleSheet.create({
    moveinfocontainer: {
        flex: 2,
        alignItems: 'center',
        borderTopEndRadius: 32,
        borderTopStartRadius: 32,
        backgroundColor: "#A1B58E",
    },
    movecount: {
        flex: 3,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    extracount: {
        flex: 2,
        flexDirection: 'row',
        alignItems: 'center'
    },
});


