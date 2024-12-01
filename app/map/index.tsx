import React, { useCallback, useEffect, useState, useRef, useMemo } from 'react';
import { View, StyleSheet, Alert, BackHandler, Text, Image, ActivityIndicator, Modal, TouchableOpacity, Button, Touchable } from 'react-native';
import MapView, { Polygon, Marker, Region, Details, Circle, LongPressEvent } from 'react-native-maps';
import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import * as turf from '@turf/turf';
import { Pedometer } from 'expo-sensors';
import { mapService, LocationCoordinate, RotatableCoordinate, PolygonCoordinates, DEGREE_PER_METER } from '@/service/map';
import { adService } from '@/service/ad';
import { hasDatePassed } from '@/utils/time';
import { router } from 'expo-router';
import { useIsFocused } from '@react-navigation/native';

import UserIcon from '@/components/UserIcon';
import { DonationItem, DonationItemMeta, UserItem } from '@/core/model';
import { getFileSource, repo } from '@/api/main';
import * as Progress from 'react-native-progress';
import { getMyProfile, getRewardPoint, participateDonation } from '@/api/user';
import { PedometerResult } from 'expo-sensors/build/Pedometer';
import PointDisplay from '@/components/PointDisplay';
import MapRewardModal from '@/components/MapRewardModal';


const enum CAM_MODE {
    DEFAULT = 'default mode',
    FOLLOW_USER = 'follow user',
    FOLLOW_NEAREST_ITEM = 'follow nearest item'
}

const SEC_TO_MSEC = 1000;
const KM_TO_M = 1000;

const LOCATION_TASK_NAME = 'background-location-task';
const FORGROUND_LOCATION_PERIOD_SEC = 1;
const FORGROUND_LOCATION_ACTIVE_TIME_SEC = 5;
const FORGROUND_LOCATION_PERIOD_MSEC = FORGROUND_LOCATION_PERIOD_SEC * SEC_TO_MSEC;
const FORGROUND_LOCATION_ACTIVE_TIME_MSEC = FORGROUND_LOCATION_ACTIVE_TIME_SEC * SEC_TO_MSEC;

const MAX_MOVE_METER_PER_SEC = 5;
const MAX_MOVE_METER_PER_LOCATION = FORGROUND_LOCATION_PERIOD_SEC * MAX_MOVE_METER_PER_SEC;
const MAX_STEP_PER_METER = 1;
const MAX_STEP_PER_SEC = 0.5;
const MAX_STEP_PER_LOCATION = MAX_STEP_PER_METER * MAX_MOVE_METER_PER_LOCATION;
const NOISE_MOVE_DISTANCE_METER = 1;

const UNIT_ZOOM_DELTA = 0.005;
const ITEM_ICON_SIZE = 50;
const FOOTSTEP_ICON_SIZE = 20;
const POLYGON_FILL_COLOR = "rgba(0, 255, 0, 0.3)";
const CARBON_DECREASE_PER_METER = 0.2;
const AD_ITEM_PERIOD = 2;






export default function App() {
    const [stepCount, setStepCount] = useState<number>(0);
    const [carbonDecrease, setCarbonDecrease] = useState<number>(0);
    const [currentItemCount, setCurrentItemCount] = useState<number>(0);
    const [takenItemCount, setTakenItemCount] = useState<number>(0);


    const [polygonList, setPolygonList] = useState<PolygonCoordinates[]>([]);
    const [itemList, setItemList] = useState<(LocationCoordinate)[]>([]);
    const [footstepList, setFootstepList] = useState<RotatableCoordinate[]>([]);

    const [mapLoaded, setMapLoaded] = useState<boolean>(false);
    const [mapUpdated, setMapUpdated] = useState<boolean>(false);
    const [userLocation, setUserLocation] = useState<LocationCoordinate | null>(null);
    const [currentRegion, setCurrentRegion] = useState<Region | null>(null);


    const [locationActive, setForgroundLocationActive] = useState<boolean>(true);

    const [totalStepCount, setTotalStepCount] = useState<number>(0);
    const [validStepCount, setValidStepCount] = useState<number>(0);
    const [lastLocationdate, setLastLocationDate] = useState<Date>(new Date());
    const [lastPedometerDate, setLastPedometerDate] = useState<Date>(new Date());


    const [showAdModal, setShowAdModal] = useState<boolean>(false);
    const [userInfo, setUserInfo] = useState<UserItem | null>(null);
    const [donationList, setDonationList] = useState<DonationItemMeta[]>([]);
    const [selectedDonation, setSelectedDonation] = useState<DonationItem | null>(null);


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










    // mapService가 업데이트했을 때의 콜벡함수
    const onMapserviceUpdate = useCallback(() => {
        setMapUpdated(true);
    }, []);


    // 지도를 움직였을 때의 콜백함수
    const onRegionChangeComplete = useCallback((region: Region, details: Details) => {
        setCurrentRegion(region);
        setMapUpdated(true);
    }, []);


    const onMapPressed = useCallback((event: LongPressEvent) => {
        const coords = event.nativeEvent.coordinate;
        mapService.addPoint(coords.latitude, coords.longitude);
        setCurrentItemCount(mapService.getItemCount());
    }, []);


    const onItemPressed = (latitude: number, longitude: number, index: number) => {
        const success = mapService.consumeItemAt(latitude, longitude);

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
            });
        }


        console.log('item pressed', currentItemCount);
    }

    // foreground에서 newLocation을 받았을 때의 콜백함수
    const onNewLocationForeground = (newLocation: Location.LocationObject) => {


        if (hasDatePassed(lastLocationdate)) {
            initializeMapState();
        }
        const currentDate = new Date();
        const millisecDelta = currentDate.getTime() - lastLocationdate.getTime();
        const secDelta = millisecDelta / SEC_TO_MSEC;
        setLastLocationDate(currentDate);


        //console.log('ok', userLocation, newLocation.coords);
        if (userLocation === null) {
            setUserLocation({ latitude: newLocation.coords.latitude, longitude: newLocation.coords.longitude });
            // update mapservice
            if (!mapRef.current) return;
            const coords = newLocation.coords;
            mapService.addPoint(coords.latitude, coords.longitude);
            return;
        }

        // get distance
        const distanceDeltaInMeter = turf.distance(turf.point([userLocation.longitude, userLocation.latitude]),
            turf.point([newLocation.coords.longitude, newLocation.coords.latitude]),
            'kilometres') * KM_TO_M;
        setUserLocation({ latitude: newLocation.coords.latitude, longitude: newLocation.coords.longitude });

        const maxStepDelta = distanceDeltaInMeter * MAX_STEP_PER_METER;
        if (secDelta * MAX_MOVE_METER_PER_SEC <= distanceDeltaInMeter) return;


        // update mapservice
        if (!mapRef.current) return;
        const coords = newLocation.coords;
        mapService.addPoint(coords.latitude, coords.longitude);
    }


    const initializeMapState = useCallback(() => {
        setStepCount(0);
        setCarbonDecrease(0);
        setCurrentItemCount(0);
        setPolygonList([]);
        setItemList([]);
        setFootstepList([]);
        setTakenItemCount(0);
        setCurrentItemCount(0);
        setTotalStepCount(0);
        setValidStepCount(0);
        setLastLocationDate(new Date());
        setLastPedometerDate(new Date());
        mapService.initialize();
    }, []);


    useEffect(() => {
        if (currentRegion) {
            mapRef.current?.animateToRegion(currentRegion, 0);
        } else {
            Location.getCurrentPositionAsync().then((currentLocation) => {
                const region = {
                    latitude: currentLocation.coords.latitude,
                    longitude: currentLocation.coords.longitude,
                    latitudeDelta: UNIT_ZOOM_DELTA,
                    longitudeDelta: UNIT_ZOOM_DELTA,
                };
                setCurrentRegion(region);
                mapRef.current?.animateToRegion(region, 0);
            });
        }
    }, [mapLoaded]);

    useEffect(() => {
        if (!mapUpdated) return;

        const moveDistanceInMeter = mapService.getBlockCount() * mapService.getBlockSizeInMeter();
        setCarbonDecrease(moveDistanceInMeter * CARBON_DECREASE_PER_METER);

        if (!currentRegion) return;

        const overlays = mapService.getOverlaysInRegion(currentRegion);
        if (overlays) {
            setPolygonList(overlays.rects);
            setItemList(overlays.items);
            setFootstepList(overlays.footsteps);
        }

        setMapUpdated(false);
    }, [mapUpdated])

    useEffect(() => {
        const intervalId = setInterval(() => {
            const currentDate = new Date();
            const millisecDiff = currentDate.getTime() - lastLocationdate.getTime();
            setForgroundLocationActive(millisecDiff < FORGROUND_LOCATION_ACTIVE_TIME_MSEC);
        }, FORGROUND_LOCATION_PERIOD_MSEC);


        mapService.registerUpdateHandler(onMapserviceUpdate);

        if (!adService.isAdLoaded() && !adService.isAdOnLoading()) {
            adService.loadAd();
        }

        // Cleanup the interval on component unmount
        return () => clearInterval(intervalId);
    }, []);



    useEffect(() => {
        (async () => {
            const locationStatus = await requestLocationPermissions();
            const pedometerStatus = await requestPedometerPermissions();

            if (!locationStatus || !pedometerStatus) {
                exitApp();
                return;
            }

            Location.watchPositionAsync(
                {
                    accuracy: Location.Accuracy.High,
                    timeInterval: FORGROUND_LOCATION_PERIOD_MSEC,
                    distanceInterval: 1,
                },
                onNewLocationForeground
            );

            Pedometer.watchStepCount((result) => {
                const nowDate = new Date();
                const dateDiffSec = (nowDate.getTime() - lastPedometerDate.getTime()) / SEC_TO_MSEC;
                const maxStepCount = MAX_STEP_PER_SEC * dateDiffSec;
                setLastPedometerDate(nowDate);
                const stepCountDiff = result.steps - stepCount;
                const validStepCountDiff = Math.floor(stepCountDiff > maxStepCount ? maxStepCount : stepCountDiff);
                setValidStepCount(validStepCount + validStepCountDiff);
                setStepCount(result.steps);
            });

            const currentLocation = await Location.getCurrentPositionAsync();
            setCurrentRegion({
                latitude: currentLocation.coords.latitude,
                longitude: currentLocation.coords.longitude,
                latitudeDelta: UNIT_ZOOM_DELTA,
                longitudeDelta: UNIT_ZOOM_DELTA,
            });

            // if map hasn't initialized after the midnight, initialize
            if (await mapService.hasToInitialize()) {
                initializeMapState();
            }
        })();

    }, []);








    const requestLocationPermissions = async (): Promise<boolean> => {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') return false;

        const backgroundStatus = await Location.requestBackgroundPermissionsAsync();
        if (backgroundStatus.status !== 'granted') return false;

        return true;
    };

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
                coordinate={itemCoord}
                key={`i${index}`}
                onPress={() => {
                    onItemPressed(itemCoord.latitude, itemCoord.longitude, index);
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
                {
                    currentRegion ?
                        <MapView style={styles.map}
                            ref={mapRef}
                            rotateEnabled={false}
                            onRegionChangeComplete={onRegionChangeComplete}
                            onMapLoaded={() => { setMapLoaded(true) }}
                            showsBuildings={false}
                            showsCompass={false}
                            showsMyLocationButton={true}
                            onLongPress={onMapPressed}
                            moveOnMarkerPress={false}
                        >
                            {
                                userLocation && <Marker coordinate={userLocation}></Marker>
                            }
                            {mapPolygons}
                            {itemMarkers}
                            {footstepMarkers}
                        </MapView> : <ActivityIndicator size='large' color={'white'}></ActivityIndicator>


                }

                {/* point display */}
                <View style={styles.pointdisplay}>
                    <PointDisplay pointAmount={userInfo ? userInfo.point : 0} displaySizeLevel={2}></PointDisplay>
                </View>
                {/* track item button */}
                <View style={styles.trackitemdisplay}>
                    <TouchableOpacity onPress={() => { }}>

                    </TouchableOpacity>
                </View>

                <View style={{
                    zIndex: 100,
                    position: 'absolute',
                    top: 10, left: 10, width: 10, height: 10,
                    borderRadius: 5,
                    borderColor: 'black',
                    borderWidth: 0.5,
                    backgroundColor: locationActive ? 'green' : 'gray',
                }} />


            </View>



            <View style={styles.moveinfocontainer}>
                <View style={styles.movecount}>
                    <Text style={{ fontSize: 20 }}>탄소저감량  </Text>
                    <Text style={{ fontSize: 40 }}>{carbonDecrease.toFixed(1)}g</Text>

                </View>
                <View style={styles.extracount}>
                    <Text style={{ opacity: 0.8, fontSize: 10 }}>남은 아이템 개수   </Text>
                    <Text style={{ fontSize: 18 }}>{currentItemCount}</Text>
                </View>
            </View>

            {
                selectedDonation ? <MapRewardModal modalVisible={showAdModal} setModalVisible={setShowAdModal}
                    donationInfo={selectedDonation} earnedHandler={() => { setHasToUpdate(true) }}
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
    map: {
        width: "100%",
        height: "100%"
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
        zIndex: 100,
    },
    trackitemdisplay: {
        position: 'absolute',
        bottom: 10,
        right: 10,
        zIndex: 100,
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
        zIndex: 100
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
        height: 38
    }
});


