import React, { useCallback, useEffect, useState, useRef } from 'react';
import { View, StyleSheet, Alert, BackHandler, Text, Image, ActivityIndicator, Modal, TouchableOpacity, Button } from 'react-native';
import MapView, { Polygon, Marker, Region, Details, Circle } from 'react-native-maps';
import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import * as turf from '@turf/turf';
import { Pedometer } from 'expo-sensors';
import MapTab from '@/components/MapTab';
import { mapService, LocationCoordinate, RotatableCoordinate, PolygonCoordinates, DEGREE_PER_METER } from '@/api/map';
import { adService } from '@/api/ad';
import ViewAdModal from '@/components/ViewAdModal';
import { hasDatePassed } from '@/utils/time';
import { Link, router } from 'expo-router';
import UserIcon from '@/components/UserIcon';

const enum CAM_MODE {
    DEFAULT = 'default mode',
    FOLLOW_USER = 'follow user',
    FOLLOW_NEAREST_ITEM = 'follow nearest item'
}


const LOCATION_TASK_NAME = 'background-location-task';
const CAM_MOVE_ANIMATION_DURATION = 1000;
const FORGROUND_LOCATION_PERIOD = 3000;
const BLOCK_LOAD_DELTA = 0.0005;
const UNIT_ZOOM_DELTA = 0.001;
const ITEM_ICON_SIZE = 50;
const POLYGON_FILL_COLOR = "rgba(0, 255, 0, 0.3)";







export default function App() {
    const [stepCount, setStepCount] = useState<number>(0);
    const [carbonDecrease, setCarbonDecrease] = useState<number>(0);

    const [polygonList, setPolygonList] = useState<PolygonCoordinates[]>([]);
    const [itemList, setItemList] = useState<(LocationCoordinate)[]>([]);
    const [footstepList, setFootstepList] = useState<RotatableCoordinate[]>([]);

    const [newPolygonList, setNewPolygonList] = useState<PolygonCoordinates[]>([]);
    const [newItemList, setNewItemList] = useState<(LocationCoordinate)[]>([]);
    const [newFootstepList, setNewFootstepList] = useState<RotatableCoordinate[]>([]);


    const [initMapLocation, setInitMapLocation] = useState<Location.LocationObject | undefined>(undefined);
    // const [cameraMode, setCameraMode] = useState<CAM_MODE>(CAM_MODE.FOLLOW_USER);
    const [userLocation, setUserLocation] = useState<Location.LocationObjectCoords | null>(null);
    // const [lastBlockLoadedRegion, setLastBlockLoadedRegion] = useState<Region | null>(null);
    const [currentRegion, setCurrentRegion] = useState<Region | null>(null);
    const [lastLocationDate, setLastLocationDate] = useState<Date | null>(null);

    const [showAdModal, setShowAdModal] = useState<boolean>(false);

    const mapRef = useRef<MapView | null>(null);


    const onItemPressed = useCallback((latitude: number, longitude: number, index: number) => {
        mapService.consumeItemAt(latitude, longitude);
        const newItemList = [...itemList];
        setItemList(newItemList);
        setShowAdModal(true);
        console.log('item pressed');
    }, [currentRegion]);

    // foreground에서 newLocation을 받았을 때의 콜백함수
    const onNewLocationForeground = useCallback((newLocation: Location.LocationObject) => {
        //console.log('newLocation', newLocation);
        // if the midnight passed, initialize map state
        if (lastLocationDate) {
            if (hasDatePassed(lastLocationDate)) {
                initializeMapState();
            }
        }
        setLastLocationDate(new Date());

        setUserLocation(newLocation.coords);

        const newOverlays = mapService.getNewOverlays();
        if (newOverlays) {
            setNewPolygonList(newOverlays.rects);
            setNewItemList(newOverlays.items);
            setNewFootstepList(newOverlays.footsteps);
        }


        // update mapservice
        if (!mapRef.current) return;
        const coords = newLocation.coords;
        mapService.addPoint(coords.latitude, coords.longitude);
    }, []);

    const onRegionChangeComplete = useCallback((region: Region, details: Details) => {
        setCurrentRegion(region);

        console.log('region changed');
        mapService.getOverlaysInRegion(region.latitude, region.longitude, region.latitudeDelta, region.longitudeDelta)
            .then((overlays) => {
                if (!overlays) return;
                setPolygonList(overlays.rects);
                setItemList(overlays.items);
                setFootstepList(overlays.footsteps);
                console.log(overlays.footsteps);
            });
    }, []);

    useEffect(() => {
        if (!adService.isAdLoaded() && !adService.isAdOnLoading()) {
            adService.loadAd();
        }
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
                    timeInterval: FORGROUND_LOCATION_PERIOD,
                    distanceInterval: 1,
                },
                onNewLocationForeground
            );

            Pedometer.watchStepCount(result => {
                setStepCount(result.steps);
            });

            const currentLocation = await Location.getCurrentPositionAsync();
            setInitMapLocation(currentLocation);
            !!mapRef.current?.animateToRegion({
                latitude: currentLocation.coords.latitude,
                longitude: currentLocation.coords.longitude,
                latitudeDelta: UNIT_ZOOM_DELTA, // Zoom level
                longitudeDelta: UNIT_ZOOM_DELTA, // Zoom level
            }, 0);

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

    const initializeMapState = useCallback(() => {
        setStepCount(0);
        setCarbonDecrease(0);
        setPolygonList([]);
        setItemList([]);
        setFootstepList([]);
        setNewPolygonList([]);
        setNewItemList([]);
        setNewFootstepList([]);
        mapService.initialize();
    }, []);

    const handleMapLoad = useCallback(() => {
        if (initMapLocation) {
            !!mapRef.current?.animateToRegion({
                latitude: initMapLocation.coords.latitude,
                longitude: initMapLocation.coords.longitude,
                latitudeDelta: UNIT_ZOOM_DELTA, // Zoom level
                longitudeDelta: UNIT_ZOOM_DELTA, // Zoom level
            }, 0);
        }
    }, [initMapLocation]);


    return (
        <View style={styles.container}>

            <View style={styles.profilecontainer}>
                <UserIcon isMyIcon={true} message={"프로필"} onPress={() => { router.push('/profile') }} />
            </View>

            <View style={styles.mapcontainer}>
                {
                    initMapLocation ?
                        <MapView style={styles.map}
                            ref={mapRef}
                            rotateEnabled={false}
                            onRegionChangeComplete={onRegionChangeComplete}
                            onMapLoaded={handleMapLoad}
                            showsBuildings={false}
                            showsCompass={false}
                            showsMyLocationButton={true}
                        >
                            {
                                userLocation && <Marker coordinate={userLocation}>

                                </Marker>
                            }
                            {
                                polygonList.map((polygonCoords, index) => <Polygon
                                    coordinates={polygonCoords}
                                    fillColor={POLYGON_FILL_COLOR}
                                    strokeWidth={0}
                                    zIndex={100}
                                    key={`poly${index}`}
                                />)
                            }
                            {
                                itemList.map((itemCoord, index) => {

                                    return (<Marker
                                        coordinate={itemCoord}
                                        key={`item${index}`}
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
                            }
                            {
                                footstepList.map((footstepPose, index) => <CatPaw
                                    key={`catpaw${index}`}
                                    rotation={footstepPose.rotation} coordinate={footstepPose.location}
                                    keyIndex={index}
                                >

                                </CatPaw>)
                            }


                            {
                                newPolygonList.map((polygonCoords, index) => <Polygon
                                    coordinates={polygonCoords}
                                    fillColor={POLYGON_FILL_COLOR}
                                    strokeWidth={0}
                                    zIndex={100}
                                    key={`poly${index}`}
                                />)
                            }
                            {/* {
                                newItemList.map((itemCoord, index) => {

                                    return (<Marker
                                        coordinate={itemCoord}
                                        key={`item${index}`}
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
                            } */}
                            {
                                newFootstepList.map((footstepPose, index) => <CatPaw
                                    key={`catpaw${index}`}
                                    rotation={footstepPose.rotation} coordinate={footstepPose.location}
                                    keyIndex={index}
                                >

                                </CatPaw>)
                            }
                        </MapView> : <ActivityIndicator></ActivityIndicator>


                }
            </View>

            <ViewAdModal showAdModal={showAdModal} setShowAdModal={setShowAdModal} />

            <View style={styles.moveinfocontainer}>
                <View style={styles.movecount}>
                    <Text style={{ fontSize: 40 }}>{stepCount}</Text>
                    <Text style={{ fontSize: 18 }}> 걸음</Text>
                </View>
                <View style={styles.extracount}>
                    <Text style={{ opacity: 0.8, fontSize: 10 }}>탄소저감량  </Text>
                    <Text style={{ fontSize: 18 }}>{carbonDecrease}</Text>
                    <Text style={{ fontSize: 20 }}>   </Text>
                    <Text style={{ fontSize: 18 }}>192m</Text>
                    <Text style={{ opacity: 0.8, fontSize: 10 }}>  걸은거리</Text>

                </View>
            </View>

            <View style={styles.tabcontainer}>
                <Link href="/challenge">
                    <Image source={require("@/assets/images/challenge.png")}
                        style={{ width: 35, height: 35, margin: 1 }} />
                    <Text style={{ opacity: 0.9, fontSize: 12 }}>챌린지</Text>
                </Link>
                <Link href="/fundraising">
                    <Image source={require("@/assets/images/donation.png")}
                        style={{ width: 35, height: 35, margin: 1 }} />
                    <Text style={{ opacity: 0.9, fontSize: 12 }}>환경 모금</Text>
                </Link>
                <Link href="/shop">
                    <Image source={require("@/assets/images/shop.png")}
                        style={{ width: 35, height: 35, margin: 1 }} />
                    <Text style={{ opacity: 0.9, fontSize: 12 }}>리워드 샵</Text>
                </Link>

            </View>
        </View>
    );
}

function CatPaw({ coordinate, rotation, keyIndex }: { coordinate: LocationCoordinate, rotation: number, keyIndex: number }) {
    const footRadius = mapService.getBlockSizeInMeter() / 5;
    const footToeDistance = footRadius * 2;
    const toeRadius = footRadius / 2;

    const toeAngleDelta = 30;
    const degToRad = Math.PI / 180;

    const leftToeRadian = (rotation + toeAngleDelta) * degToRad;
    const centerToeRadian = rotation * degToRad;
    const rightToeRadian = (rotation - toeAngleDelta) * degToRad;

    const leftTeoLocation = {
        latitude: coordinate.latitude - footToeDistance * Math.sin(leftToeRadian) * DEGREE_PER_METER,
        longitude: coordinate.longitude + footToeDistance * Math.cos(leftToeRadian) * DEGREE_PER_METER
    };
    const centerTeoLocation = {
        latitude: coordinate.latitude - footToeDistance * Math.sin(centerToeRadian) * DEGREE_PER_METER,
        longitude: coordinate.longitude + footToeDistance * Math.cos(centerToeRadian) * DEGREE_PER_METER
    };
    const rightTeoLocation = {
        latitude: coordinate.latitude - footToeDistance * Math.sin(rightToeRadian) * DEGREE_PER_METER,
        longitude: coordinate.longitude + footToeDistance * Math.cos(rightToeRadian) * DEGREE_PER_METER
    };


    return (
        <>
            {/* foot */}
            <Circle center={coordinate} radius={footRadius} strokeWidth={0} fillColor={"#000000"} key={`foot${keyIndex}`} zIndex={1000}>
            </Circle>

            {/* toes */}
            <Circle center={leftTeoLocation} radius={toeRadius} strokeWidth={0} fillColor={"#000000"} key={`left${keyIndex}`} zIndex={1000}>

            </Circle>
            <Circle center={centerTeoLocation} radius={toeRadius} strokeWidth={0} fillColor={"#000000"} key={`center${keyIndex}`} zIndex={1000}>

            </Circle>
            <Circle center={rightTeoLocation} radius={toeRadius} strokeWidth={0} fillColor={"#000000"} key={`right${keyIndex}`} zIndex={1000}>

            </Circle>
        </>
    );
}


const styles = StyleSheet.create({
    map: {
        width: "100%",
        height: "100%"
    },
    container: {
        flex: 1,
        backgroundColor: 'gray'
    },
    mapcontainer: {
        flex: 9,
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
        alignItems: 'flex-end'
    },
    extracount: {
        flex: 2,
        flexDirection: 'row',
        alignItems: 'center'
    },
});


