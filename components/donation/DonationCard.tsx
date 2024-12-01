import { DonationItem } from "@/core/model";
import { Modal, Text, TouchableOpacity, ImageBackground, ScrollView, Image, View, StyleSheet, Button, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from "react";
import * as Progress from 'react-native-progress';
import { getFileSource } from '@/api/main';

export function DonationCard({ donationInfo }: { donationInfo: DonationItem }) {
    return (<View style={styles.frame}>
        <View style={styles.imageWrapper}>
            <Image
                source={getFileSource(donationInfo.thumbnailId)}
                style={styles.image}
            />
        </View>

        <View style={styles.overlay}>
            <Text style={styles.description}>{donationInfo.name}</Text>
            <Progress.Bar
                progress={donationInfo.currentPoint / donationInfo.targetPoint}
                width={150}
                height={25}
                color="#3b5998"
                unfilledColor="lightgray"
                style={styles.progressBar}
                borderWidth={0}
                borderRadius={3}
            />
            <View style={styles.progressText}>
                <Text>
                    {donationInfo.currentPoint} / {donationInfo.targetPoint}
                </Text>
                <Text>
                    {(100 * donationInfo.currentPoint / donationInfo.targetPoint).toFixed(0)}%
                </Text>
            </View>
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
        position: 'relative',
    },
    imageWrapper: {
        width: '100%',
        height: '75%',
        borderRadius: 20,
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    overlay: {
        position: 'absolute',
        bottom: 0,
        width: 0,
        height: 100,
        padding: 10,
        backgroundColor: 'white',
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    description: {
        flex: 2,
        fontSize: 20,
        justifyContent: 'center'
    },
    progressBar: {
        flex: 1,
        marginBottom: 5,
    },
    progressText: {
        flex: 1,
        fontSize: 15,
        color: '#333',
        marginLeft: 20,
        flexDirection: 'row'
    },
});
