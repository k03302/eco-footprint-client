import { DonationItem } from "@/core/model";
import { Modal, Text, TouchableOpacity, ImageBackground, ScrollView, Image, View, StyleSheet, Button, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from "react";
import * as Progress from 'react-native-progress';
import { getFileSource } from '@/api/main';

export default function DonationCard({ donationInfo }: { donationInfo: DonationItem }) {
    return (<View style={styles.frame}>
        <View style={styles.imageWrapper}>
            <Image
                source={getFileSource(donationInfo.thumbnailId)}
                style={styles.image}
            />
        </View>

        <View style={styles.overlay}>
            <Text>{donationInfo.name}</Text>
            <Progress.Bar
                progress={donationInfo.currentPoint / donationInfo.targetPoint}
                width={150}
                color="#3b5998"
                style={styles.progressBar}
                borderWidth={0}
            />
            <Text style={styles.progressText}>
                {(100 * donationInfo.currentPoint / donationInfo.targetPoint).toFixed(0)}%
            </Text>
        </View>
    </View>)
}


const styles = StyleSheet.create({
    frame: {
        width: 300,
        height: 400,
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative', // 겹친 요소를 위한 상대적 위치 설정        
    },
    imageWrapper: {
        width: '100%',
        height: '75%',
        borderRadius: 20,
        overflow: 'hidden', // 라운딩된 모서리를 유지
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    overlay: {
        position: 'absolute',
        bottom: 0,
        width: 220,
        height: 100,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    progressBar: {
        marginBottom: 5,
    },
    progressText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
});
