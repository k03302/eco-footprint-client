import { Modal, Text, TouchableOpacity, Image, View, StyleSheet, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from "react";
import * as Progress from 'react-native-progress';
import { DonationItem, DonationItemMeta } from '@/core/model';
import { adService } from '@/service/ad';
import { DonationCard } from '@/components/donation/DonationCard';
import { getDonation } from '@/api/donation';

export function DonationUnit({ donationMetaInfo, active, setActive, onSelected }:
    {
        donationMetaInfo: DonationItemMeta, active: boolean, setActive: React.Dispatch<React.SetStateAction<boolean>>,
        onSelected: (info: DonationItem) => void
    }) {

    const [donationInfo, setDonationInfo] = useState<DonationItem | null>(null);
    const [activeCooltime, setActiveCooltime] = useState<number>(0);

    useEffect(() => {
        (async () => {
            const result = await getDonation({ donationId: donationMetaInfo.id });
            setDonationInfo(result);
        })()
    }, [donationMetaInfo]);

    useEffect(() => {
        if (!active) {
            setActiveCooltime(10);
        }
    }, [active]);

    useEffect(() => {
        if (activeCooltime > 0) {
            setTimeout(() => {
                setActiveCooltime(activeCooltime - 1);
            }, 1000);
        } else {
            setActive(true);
        }
    }, [activeCooltime]);

    if (!donationInfo) {
        return <></>
    }

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={() => {
                if (activeCooltime == 0) {
                    onSelected(donationInfo);
                }
            }}>
                {
                    activeCooltime > 0 && <View style={styles.cooltimedisplay}>
                        <Text style={styles.cooltimetext}>{activeCooltime}</Text>
                    </View>
                }

                <DonationCard donationInfo={donationInfo} waiting={activeCooltime > 0} />
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
    cooltimedisplay: {
        width: 50,
        height: 50,
        borderRadius: 125,
        backgroundColor: 'white',
        position: 'absolute',
        left: 30,
        top: 30,
        zIndex: 1000,
        justifyContent: 'center'
    },
    cooltimetext: {
        fontSize: 20,
        alignSelf: 'center'
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
