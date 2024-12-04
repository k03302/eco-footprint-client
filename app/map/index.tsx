import React, { useCallback, useEffect, useState, useRef, useMemo } from 'react';
import { View, StyleSheet, Alert, BackHandler, Text, Image, ActivityIndicator, Modal, TouchableOpacity, Button, Touchable, Pressable } from 'react-native';
import MapView, { Polygon, Marker, Region, Details, Circle, LongPressEvent } from 'react-native-maps';
import * as Location from 'expo-location';
import { Pedometer } from 'expo-sensors';
import { mapService, MapCoordData, MapCoordAngleData, DEGREE_PER_METER } from '@/service/map';
import { adService } from '@/service/ad';
import { walkMonitorService } from '@/service/monitor';
import { locationService } from '@/service/location';
import { hasDatePassed } from '@/utils/time';
import { router } from 'expo-router';
import { useIsFocused } from '@react-navigation/native';

import { UserIcon } from '@/components/UserIcon';
import { DonationItem, DonationItemMeta, UserItem } from '@/core/model';
import { getFileSource, repo } from '@/api/main';
import * as Progress from 'react-native-progress';
import { getMyProfile, getRewardPoint } from '@/api/user';
import { PedometerResult } from 'expo-sensors/build/Pedometer';
import { PointDisplay } from '@/components/PointDisplay';
import { MapRewardModal } from '@/components/map/MapRewardModal';
import { MaterialIcons } from '@expo/vector-icons';
import CircleAnimation from '@/components/CircleAnimation';


const FORGROUND_LOCATION_PERIOD_SEC = 1;
const BACKGROUND_LOCATION_PERIOD_SEC = 1;


const CAMERA_ANIMATION_DURATION = 100;
const UNIT_ZOOM_DELTA = 0.005;
const ITEM_ICON_SIZE = 50;
const FOOTSTEP_ICON_SIZE = 20;
const POLYGON_FILL_COLOR = "rgba(0, 255, 0, 0.3)";
const CARBON_DECREASE_PER_METER = 0.2;
const AD_ITEM_PERIOD = 5;



export default function App() {
    const [carbonDecrease, setCarbonDecrease] = useState<number>(0);
    const [currentItemCount, setCurrentItemCount] = useState<number>(0);
    const [takenItemCount, setTakenItemCount] = useState<number>(0);


    const [polygonList, setPolygonList] = useState<MapCoordData[][]>([]);
    const [itemList, setItemList] = useState<MapCoordData[]>([]);
    const [footstepList, setFootstepList] = useState<MapCoordAngleData[]>([]);

    const [mapLoaded, setMapLoaded] = useState<boolean>(false);
    const [mapUpdated, setMapUpdated] = useState<boolean>(false);
    const [userLocation, setUserLocation] = useState<MapCoordData | null>(null);
    const [currentRegion, setCurrentRegion] = useState<Region | null>(null);
    const [targetRegion, setTargetRegion] = useState<Region | null>(null);


    const [locationActive, setForgroundLocationActive] = useState<boolean>(true);

    const [playCircleAnimation, setPlayCircleAnimation] = useState<boolean>(false);

    const [showAdModal, setShowAdModal] = useState<boolean>(false);
    const [userInfo, setUserInfo] = useState<UserItem | null>(null);
    const [donationList, setDonationList] = useState<DonationItemMeta[]>([]);
    const [selectedDonation, setSelectedDonation] = useState<DonationItem | null>(null);
    const [trackItemMode, setTrackItemMode] = useState<boolean>(false);
    const [targetItemPos, setTargetItemPos] = useState<MapCoordData | null>(null);
    const [currentItemPos, setCurrentItemPos] = useState<MapCoordData | null>(null);


    const mapRef = useRef<MapView | null>(null);
    const isFocused = useIsFocused();
    const [hasToUpdate, setHasToUpdate] = useState<boolean>(false);


    const updatePageInfo = async () => {
        const userInfo = await getMyProfile();
        setUserInfo(userInfo);
        setDonationList(await repo.donations.getAllDonations());
    }

    useEffect(() => {
        if (!isFocused) return;
        updatePageInfo();
    }, [isFocused]);

    useEffect(() => {
        if (!hasToUpdate) return;
        updatePageInfo().then(() => {
            setHasToUpdate(false);
        });
    }, [hasToUpdate]);





    const onMapLoaded = useCallback(() => {
        setMapLoaded(true)
    }, [])

    // mapService가 업데이트했을 때의 콜벡함수
    const onMapserviceUpdate = useCallback(() => {
        setMapUpdated(true);
    }, []);


    // 지도를 움직였을 때의 콜백함수
    const onRegionChangeComplete = useCallback((region: Region, details: Details) => {
        setCurrentRegion(region);
        setMapUpdated(true);
    }, []);


    const onMapLongPressed = useCallback((event: LongPressEvent) => {
        const coords = event.nativeEvent.coordinate;
        mapService.addPoint(coords.latitude, coords.longitude);
        setCurrentItemCount(mapService.getItemCount());
    }, []);


    const onItemPressed = (coords: MapCoordData) => {
        setPlayCircleAnimation(true);
        setTargetItemPos(coords);
    }


    const onNewLocation = (newLocation: MapCoordData) => {
        const isWalking = walkMonitorService.update(newLocation, 0);
        if (isWalking) {
            mapService.addPoint(newLocation.latitude, newLocation.longitude);
        }
    }

    const onLocatonActiveChange = (active: boolean) => {
        setForgroundLocationActive(active);
    }



    const initializeMapState = useCallback(() => {
        setCarbonDecrease(0);
        setCurrentItemCount(0);
        setPolygonList([]);
        setItemList([]);
        setFootstepList([]);
        setTakenItemCount(0);
        setCurrentItemCount(0);
        mapService.initialize();
    }, []);

    const setTargetRegionToUser = useCallback(() => {
        if (userLocation) {
            setTargetRegion({
                latitude: userLocation.latitude,
                longitude: userLocation.longitude,
                latitudeDelta: UNIT_ZOOM_DELTA,
                longitudeDelta: UNIT_ZOOM_DELTA,
            });
        } else {
            Location.getCurrentPositionAsync().then((currentLocation) => {
                setUserLocation(currentLocation.coords);
                setTargetRegion({
                    latitude: currentLocation.coords.latitude,
                    longitude: currentLocation.coords.longitude,
                    latitudeDelta: UNIT_ZOOM_DELTA,
                    longitudeDelta: UNIT_ZOOM_DELTA,
                });
            })
        }
    }, []);



    const setTargetRegionToNextItem = useCallback(() => {
        const itemPos = mapService.getNextItemPos();
        if (!itemPos) {
            setTrackItemMode(false);
            return;
        }
        setCurrentItemPos(itemPos);
        setTargetRegion({
            latitude: itemPos.latitude,
            longitude: itemPos.longitude,
            latitudeDelta: UNIT_ZOOM_DELTA,
            longitudeDelta: UNIT_ZOOM_DELTA,
        })

        setTimeout(() => {
            setTargetItemPos(itemPos);
        }, 1000);

        setPlayCircleAnimation(true);
    }, [])




    useEffect(() => {
        console.log('trackItemMode', trackItemMode);
        if (!trackItemMode) {
            setTargetRegionToUser();
        } else {
            setTargetRegionToNextItem();
        }
    }, [trackItemMode]);


    useEffect(() => {
        if (!targetRegion || !mapRef.current) return;
        setCurrentRegion(targetRegion);
        mapRef.current.animateToRegion(targetRegion, CAMERA_ANIMATION_DURATION);
    }, [targetRegion]);

    useEffect(() => {
        console.log("targetItemPos", targetItemPos);
        if (!targetItemPos) return;

        const success = mapService.consumeItemAt(targetItemPos.latitude, targetItemPos.longitude);
        console.log('success', success);
        if (!success) return;
        setMapUpdated(true);
        setTakenItemCount(takenItemCount + 1);
        setCurrentItemCount(mapService.getItemCount());


        if (takenItemCount % AD_ITEM_PERIOD === AD_ITEM_PERIOD - 1) {
            if (donationList.length === 0) return;
            const randomIndex = Math.floor(Math.random() * donationList.length);
            const donationId = donationList[randomIndex].id;
            repo.donations.getDonation(donationId).then((donationInfo) => {
                setSelectedDonation(donationInfo);
                setShowAdModal(true);
            })

        } else {
            getRewardPoint().then(() => {
                setHasToUpdate(true);
                if (trackItemMode) {
                    setTargetRegionToNextItem();
                }
            });
        }
    }, [targetItemPos]);


    useEffect(() => {
        if (targetRegion) {
            mapRef.current?.animateToRegion(targetRegion, 0);
        } else {
            Location.getCurrentPositionAsync().then((currentLocation) => {
                const region = {
                    latitude: currentLocation.coords.latitude,
                    longitude: currentLocation.coords.longitude,
                    latitudeDelta: UNIT_ZOOM_DELTA,
                    longitudeDelta: UNIT_ZOOM_DELTA,
                };
                setTargetRegion(region);
            });
        }
    }, [mapLoaded]);

    useEffect(() => {
        if (!mapUpdated) return;

        const moveDistanceInMeter = mapService.getBlockCount() * mapService.getBlockSizeInMeter();
        setCarbonDecrease(moveDistanceInMeter * CARBON_DECREASE_PER_METER);

        if (!currentRegion) return;

        mapService.getOverlaysInRegion(currentRegion).then((overlays) => {
            if (overlays) {
                setPolygonList(overlays.rects);
                setItemList(overlays.items);
                setFootstepList(overlays.footsteps);
            }
            setMapUpdated(false);
        })
    }, [mapUpdated])

    useEffect(() => {
        mapService.registerUpdateHandler(onMapserviceUpdate);

        if (!adService.isAdLoaded() && !adService.isAdOnLoading()) {
            adService.loadAd();
        }

        locationService.registerOnActiveChange(onLocatonActiveChange);
    }, []);



    useEffect(() => {
        (async () => {
            const locationStatus = await locationService.getPermission();
            const pedometerStatus = await requestPedometerPermissions();

            if (!locationStatus || !pedometerStatus) {
                exitApp();
                return;
            }

            locationService.registerForeground(onNewLocation, FORGROUND_LOCATION_PERIOD_SEC);
            locationService.registerBackground(onNewLocation, BACKGROUND_LOCATION_PERIOD_SEC);

            setTargetRegionToUser();

            // if map hasn't initialized after the midnight, initialize
            if (await mapService.hasToInitialize()) {
                initializeMapState();
            }
        })();

    }, []);






    const requestPedometerPermissions = async (): Promise<boolean> => {
        const { status } = await Pedometer.requestPermissionsAsync();
        if (status !== 'granted') return false;
        return true;
    };

    const exitApp = useCallback(() => {
        Alert.alert('Permission Denied', 'Required permissions were denied. Exiting the app.', [
            { text: 'OK', onPress: () => BackHandler.exitApp() },
        ]);
    }, []);






    const mapPolygons = useMemo(() => {
        return polygonList.map((polygonCoords, index) => <Polygon
            coordinates={polygonCoords}
            fillColor={POLYGON_FILL_COLOR}
            strokeWidth={0}
            zIndex={100}
            key={`p${index}`}
        />)
    }, [polygonList])

    const itemMarkers = useMemo(() => {
        return itemList.map((itemCoord, index) => {

            return (<Marker
                tracksViewChanges={false}
                coordinate={itemCoord}
                key={`i${index}`}
                onPress={() => {
                    onItemPressed(itemCoord);
                }}

            >
                <Image
                    source={require('@/assets/images/sprout.png')}
                    style={{ width: ITEM_ICON_SIZE, height: ITEM_ICON_SIZE }}
                    resizeMode="contain"
                />
            </Marker>)
        })
    }, [itemList]);

    const footstepMarkers = useMemo(() => {
        return footstepList.map((footstepPose, index) => {
            return (<Marker
                tracksViewChanges={false}
                coordinate={footstepPose.location}
                rotation={footstepPose.rotation}
                key={`f${index}`}
            >
                <Image
                    source={require('@/assets/images/catpaw.png')}
                    style={{ width: FOOTSTEP_ICON_SIZE, height: FOOTSTEP_ICON_SIZE }}
                    resizeMode="contain"
                />
            </Marker>)
        })
    }, [footstepList])










    return (
        <View style={styles.container}>

            <View style={styles.profilecontainer}>
                <UserIcon
                    imgSource={userInfo && userInfo.thumbnailId ? { uri: userInfo.thumbnailId } : undefined}
                    message={"프로필"}
                    onPress={() => { router.push('/profile') }} />
            </View>

            <View style={styles.mapcontainer}>

                <MapView
                    style={styles.map}
                    ref={mapRef}
                    rotateEnabled={false}
                    scrollEnabled={!trackItemMode}
                    zoomEnabled={false}
                    loadingEnabled={true}

                    onRegionChangeComplete={onRegionChangeComplete}
                    onMapLoaded={onMapLoaded}

                    onLongPress={onMapLongPressed}

                    showsBuildings={false}
                    showsCompass={false}
                    showsMyLocationButton={true}
                    moveOnMarkerPress={false}
                >
                    {
                        userLocation && <Marker coordinate={userLocation} tracksViewChanges={false}></Marker>
                    }
                    {mapPolygons}
                    {itemMarkers}
                    {footstepMarkers}
                </MapView>

                {/* point display */}
                <View style={styles.pointdisplay}>
                    <PointDisplay pointAmount={userInfo ? userInfo.point : 0} displaySizeLevel={2} pointAnimationOption={1}></PointDisplay>
                </View>

                {/* track item button */}
                <View style={styles.trackitemdisplay}>
                    <TouchableOpacity onPress={() => { setTrackItemMode(!trackItemMode); }}>
                        <Image source={require('@/assets/images/sprout.png')}
                            style={[styles.trackitembutton, { backgroundColor: trackItemMode ? 'lightgray' : 'white' }]}
                        />
                    </TouchableOpacity>
                </View>

                <View style={{
                    zIndex: 1001,
                    position: 'absolute',
                    top: 10, left: 10, width: 10, height: 10,
                    borderRadius: 5,
                    borderColor: 'black',
                    borderWidth: 0.5,
                    backgroundColor: locationActive ? 'green' : 'gray',
                }} />



            </View>

            <View style={styles.circleanimcontainer}>
                <CircleAnimation playAnimation={playCircleAnimation} setPlayAnimation={setPlayCircleAnimation} />
            </View>

            <View style={styles.moveinfocontainer}>
                <View style={styles.movecount}>
                    <Text style={{ fontSize: 20 }}>탄소</Text>
                    <Text style={{ fontSize: 40, marginHorizontal: 10 }}>{carbonDecrease > 1000 ? (carbonDecrease / 1000).toFixed(2) + 'kg' : carbonDecrease.toFixed(0) + 'g'}</Text>
                    <Text style={{ fontSize: 20 }}>을 줄였어요!</Text>

                </View>
                <View style={styles.extracount}>
                    <Text style={{ opacity: 0.8, fontSize: 10 }}>남은 아이템 개수   </Text>
                    <Text style={{ fontSize: 18 }}>{currentItemCount}</Text>
                </View>
            </View>

            {
                selectedDonation ? <MapRewardModal modalVisible={showAdModal} setModalVisible={setShowAdModal}
                    donationInfo={selectedDonation} onEarnReward={() => {
                        setHasToUpdate(true);
                        setTargetRegionToNextItem();
                    }} onCancel={() => {
                        setTargetRegionToNextItem();
                    }}
                ></MapRewardModal> : <></>
            }

            <View style={styles.tabcontainer}>
                <TouchableOpacity style={styles.tabbutton} onPress={() => { router.push("/challenge") }}>
                    <Image source={require("@/assets/images/challenge.png")}
                        style={{ width: 35, height: 35, margin: 1 }} />
                    <Text style={{ opacity: 0.9, fontSize: 12 }}>챌린지</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.tabbutton} onPress={() => { router.push("/fundraising") }}>
                    <Image source={require("@/assets/images/donation.png")}
                        style={{ width: 35, height: 35, margin: 1 }} />
                    <Text style={{ opacity: 0.9, fontSize: 12 }}>환경 모금</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.tabbutton} onPress={() => { router.push("/shop") }}>
                    <Image source={require("@/assets/images/shop.png")}
                        style={{ width: 35, height: 35, margin: 1 }} />
                    <Text style={{ opacity: 0.9, fontSize: 12 }}>리워드 샵</Text>
                </TouchableOpacity>
            </View>

        </View>
    );
}



const styles = StyleSheet.create({
    circleanimcontainer: {
        justifyContent: 'center'
    },
    map: {
        width: "100%",
        height: "100%",
        zIndex: 0
    },
    container: {
        flex: 1,
        backgroundColor: 'lightgray'
    },
    mapcontainer: {
        flex: 9,
        alignItems: 'center',
        justifyContent: 'center'
    },
    tabcontainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: 'white'
    },
    tabbutton: {
        flex: 1,
        flexDirection: 'column',
        margin: 10,
        alignItems: 'center',
        width: 100,
        height: 50,
    },
    pointdisplay: {
        position: 'absolute',
        bottom: 10,
        left: 10,
        zIndex: 1001,
    },
    trackitemdisplay: {
        position: 'absolute',
        bottom: 10,
        right: 10,
        zIndex: 1001,
        justifyContent: 'center',
        alignContent: 'center'
    },
    trackitembutton: {
        width: 40, height: 40, borderRadius: 20,
        borderWidth: 1.5, borderColor: 'gray'
    },

    profilebutton: {
        margin: 10,
        flexDirection: 'row',
        alignItems: 'center',
        width: 100,
        height: 50,
    },
    profilecontainer: {
        position: 'absolute',
        top: 0,
        right: 0,
        justifyContent: 'flex-end',
        zIndex: 1001
    },
    emptycontainer: {
        flex: 8,
    },
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
    adviewcontainer: {
        width: '100%'

    },
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
        height: 38,
    },
    mappressable: {
        width: "100%",
        height: "50%",
        position: "absolute",
        justifyContent: "center"
    }
});


