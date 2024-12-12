import { DonationItem } from "@/core/model";
import { Modal, Text, TouchableOpacity, ImageBackground, ScrollView, Image, View, StyleSheet, Button, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from "react";
import * as Progress from 'react-native-progress';
import { getImageSource } from "@/api/file";

export function DonationCard({ donationInfo, waiting = false }: { donationInfo: DonationItem, waiting?: boolean }) {
    return (
        <View style={styles.frame}>
            <View style={styles.imageWrapper}>
                {
                    waiting && <ActivityIndicator size='large' style={{ alignSelf: 'center', position: 'absolute', zIndex: 10 }} />
                }
                <Image
                    source={getImageSource({ imageId: donationInfo.thumbnailId })}
                    style={[styles.image, { tintColor: waiting ? 'lightgray' : undefined }]}
                />
            </View>

            <View style={styles.overlay}>
                <Text style={styles.description}>{donationInfo.name}</Text>
                <View style={styles.progressBarContainer}>
                    <Progress.Bar
                        progress={donationInfo.currentPoint / donationInfo.totalPoint}
                        width={150}
                        height={25}
                        color="green"
                        unfilledColor="lightgray"
                        borderWidth={0}
                        borderRadius={3}
                    />
                    <Text style={{ marginLeft: 10 }}>{(100 * donationInfo.currentPoint / donationInfo.totalPoint).toFixed(0)}%</Text>
                </View>
                <View style={styles.progressText}>
                    <Text style={{ alignItems: 'center' }}>
                        {donationInfo.currentPoint}
                        <Image source={require("@/assets/images/point.png")} style={{ width: 10, height: 10 }} />
                        /{donationInfo.totalPoint}
                        <Image source={require("@/assets/images/point.png")} style={{ width: 10, height: 10 }} />
                    </Text>
                </View>
            </View>
        </View>)
}


const styles = StyleSheet.create({
    frame: {
        width: 300,
        height: 400,
        paddingHorizontal: 30,
        paddingBottom: 30,
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    progressBarContainer: {
        flexDirection: 'row'
    },
    imageWrapper: {
        width: '100%',
        height: '75%',
        borderRadius: 20,
        overflow: 'hidden',
        justifyContent: 'center'
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    overlay: {
        position: 'absolute',
        bottom: -10,
        height: "30%",
        padding: 10,
        backgroundColor: 'white',
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 20,
    },
    description: {
        fontSize: 20,
        paddingHorizontal: 20,
        paddingTop: 10,
        justifyContent: 'center'
    },

    progressText: {
        fontSize: 15,
        color: '#333',
        flexDirection: 'row'
    },
});
