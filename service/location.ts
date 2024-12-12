import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import { MapCoordData } from './map';
import { Alert } from 'react-native';




const LOCATION_TASK_NAME = 'background-location-task';


let backgroundCallback: (coords: MapCoordData) => void = (coords: MapCoordData) => { };
let foregroundActive: boolean = false;

class LocationService {
    private foregroundSubscription: Location.LocationSubscription | null = null;
    private foregroundUpdated: boolean = false;
    private onActiveChange: (active: boolean) => void = (active: boolean) => { };

    async getPermission() {
        const { status: statusForeground } = await Location.getForegroundPermissionsAsync();
        console.log(statusForeground);
        const { status: statusBackground } = await Location.getBackgroundPermissionsAsync();
        console.log(statusForeground, statusBackground);
        if (statusForeground === 'granted' && statusBackground === 'granted') return true;

        return new Promise<boolean>((resolve, reject) => {

            Alert.alert("지도 기능을 사용하기 위해 위치 기능을 활성화해주세요", "", [
                {
                    text: "확인",
                    onPress: async () => {
                        const { status } = await Location.requestForegroundPermissionsAsync();
                        console.log('0');
                        if (status !== 'granted') resolve(false);
                        console.log('1');
                        const backgroundStatus = await Location.requestBackgroundPermissionsAsync();
                        console.log('2');
                        if (backgroundStatus.status !== 'granted') resolve(false);

                        resolve(true);
                    }
                }, {
                    text: "앱 종료"
                }
            ])
        })
    }

    registerOnActiveChange(callback: (active: boolean) => void) {
        this.onActiveChange = callback;
    }

    async registerForeground(callback: (coords: MapCoordData) => void, periodSec: number) {
        this.foregroundSubscription = await Location.watchPositionAsync({
            accuracy: Location.Accuracy.High,
            timeInterval: periodSec * 1000,
            distanceInterval: 1,
        }, (newLocation: Location.LocationObject) => {
            this.foregroundUpdated = true;
            foregroundActive = true;
            this.onActiveChange(true);
            callback(newLocation.coords);
        });


        setTimeout(() => {
            foregroundActive = this.foregroundUpdated;
            this.foregroundUpdated = false;
            this.onActiveChange(this.foregroundUpdated);
        }, periodSec * 1000 * 2);
    }

    unRegisterForeground() {
        if (this.foregroundSubscription) {
            this.foregroundSubscription.remove();
        }
    }

    async registerBackground(callback: (coords: MapCoordData) => void, periodSec: number) {
        backgroundCallback = callback;
        Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
            accuracy: Location.Accuracy.High,
            distanceInterval: 50, // minimum change in meters to report
            timeInterval: periodSec * 1000, // minimum interval in milliseconds
        });
    }

    unRegisterBackground() {
        Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
    }


    isForegroundActive() {
        return foregroundActive;
    }
}



// TaskManager.defineTask(LOCATION_TASK_NAME, ({ data, error }) => {


//     if (foregroundActive) return;
//     const { locations } = data as { locations: Location.LocationObject[] };
//     backgroundCallback(locations[0].coords);

//     // const coords = newLocation.coords;
//     // const isWalking = walkMonitorService.update(coords, 0);
//     // if (isWalking) {
//     //     mapService.addPoint(coords.latitude, coords.longitude);
//     // }
// });




export const locationService = new LocationService();