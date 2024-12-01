import { Modal, Text, TouchableOpacity, Image, View, StyleSheet, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from "react";
import * as Progress from 'react-native-progress';
import { getFileSource, repo } from '@/api/main';
import { DonationItem, DonationItemMeta, NO_DONATION } from '@/core/model';
import { adService } from '@/service/ad';
import { participateDonation } from '@/api/user';
import DonationCard from './donation/DonationCard';

export default function DonationUnit({ donationId, onSelected }:
    { donationId: string, onSelected: (info: DonationItem) => void }) {

    const [donationInfo, setDonationInfo] = useState<DonationItem | null>(null);


    useEffect(() => {
        (async () => {
            const result = await repo.donations.getDonation(donationId);
            setDonationInfo(result);
        })()
    }, [donationId]);

    if (!donationInfo) {
        return <View style={styles.container}>
            <View style={{ justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%' }}>
                <ActivityIndicator size="large"></ActivityIndicator>
            </View>
        </View>
    }

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={() => {
                onSelected(donationInfo);
            }}>

                <DonationCard donationInfo={donationInfo} />
            </TouchableOpacity>
        </View>

    )


}





const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
    },
    adviewcontainer: {
        width: '100%'

    },
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
        width: 220,
        height: 100,
        backgroundColor: '#ffffff',
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
    centeredView: {
        flex: 1,
        alignContent: "center",
        textAlignVertical: 'center',
        backgroundColor: "rgba(0, 0, 0, 0.3)#",
    },
    modalView: {
        marginTop: 130,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    image_donation: {
        width: 400,
        height: 500
    },
    image_button: {
        width: 114,
        height: 38
    }
});
