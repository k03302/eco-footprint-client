import AsyncStorage from '@react-native-async-storage/async-storage';
import { hasDatePassed } from '@/utils/time'

const MIDNIGHT_MAP_INITIALIZED_KEY = 'map_initialized';

const UNIT_SIZE = 0.0001;
const UNIT_SCALER = 10000;
const UNIT_COUNT = 1;
export const METER_PER_DEGREE = 100000;
export const DEGREE_PER_METER = 0.00001;
const MAX_BLOCK_BUFFER_SIZE = 100;

const Direction = {
    NONE: [0, 0],
    UP: [1, 0],
    DOWN: [-1, 0],
    LEFT: [0, -1],
    RIGHT: [0, 1],
    UPLEFT: [1, -1],
    UPRIGHT: [1, 1],
    DOWNLEFT: [-1, -1],
    DOWNRIGHT: [-1, 1],

    angleFromYaxis(direction: number[]) {
        const [x, y] = [direction[0], direction[1]];

        // Calculate the angle in radians relative to the positive Y-axis
        const angleRad = Math.atan2(y, x);

        // Convert radians to degrees and adjust to measure clockwise from the X-axis
        const angleDeg = (angleRad * (180 / Math.PI) + 360) % 360;

        return angleDeg;
    },
    add(dir1: number[], dir2: number[]): number[] {
        return [dir1[0] + dir2[0], dir1[1] + dir2[1]];
    },
    opposite(target: number[]): number[] {
        return [-target[0], -target[1]];
    },
    isNone(target: number[]): boolean {
        return (target[0] === 0 && target[1] === 0);
    },
    getDirection(from: LocationCoordinate, to: LocationCoordinate): number[] {
        if (from.latitude < to.latitude) {
            if (from.longitude < to.longitude) {
                return this.UPRIGHT;
            } else if (from.longitude > to.longitude) {
                return this.UPLEFT;
            } else {
                return this.UP;
            }
        } else if (from.latitude > to.latitude) {
            if (from.longitude < to.longitude) {
                return this.DOWNRIGHT;
            } else if (from.longitude > to.longitude) {
                return this.DOWNLEFT;
            } else {
                return this.DOWN;
            }
        } else {
            if (from.longitude < to.longitude) {
                return this.RIGHT
            } else if (from.longitude > to.longitude) {
                return this.LEFT;
            } else {
                return this.NONE;
            }
        }
    }
}



type BlockInfoData = {
    latAsInteger: number;
    lngAsInteger: number;
    timestamp: number;
    firstMoveDirection: number[];
    adjointDirection: number[][];
    itemPos: LocationCoordinate | null;
    footstepPos: LocationCoordinate | null;
    footstepDirection: number[];
}

type LocationCoordinate = {
    latitude: number;
    longitude: number;
}

type RotatableCoordinate = {
    location: LocationCoordinate;
    rotation: number;
}

type PolygonCoordinates = LocationCoordinate[]



class MapBlockService {
    private blockInfoMap = new Map<string, BlockInfoData>();
    private newBlockIndexBuffer: string[] = [];

    private itemLocations: LocationCoordinate[] = [];
    private averageItemCountPerBlock: number = 1;

    private secondLastBlockInfo: BlockInfoData | null = null;
    private lastBlockInfo: BlockInfoData | null = null;
    private blockSize: number;
    private blockUnitCount: number;
    private blockScaler: number;
    private blockCount: number = 0;

    private overlayUpdateHandler = () => { };

    private onCalculatingOverlay: boolean = false;
    private lastInitStampCache: number | null = null;

    constructor(blockUnitCount: number) {
        this.blockUnitCount = blockUnitCount;
        this.blockSize = blockUnitCount * UNIT_SIZE;
        this.blockScaler = Math.floor(UNIT_SCALER / blockUnitCount);
    }

    getBlockSizeInMeter() {
        return METER_PER_DEGREE * this.blockSize;
    }

    getBlockCount() {
        return this.blockCount;
    }

    async registerOverlayUpdateHandler(handler: () => void) {
        this.overlayUpdateHandler = handler;
    }

    async initialize() {
        this.blockInfoMap = new Map<string, BlockInfoData>();
        this.itemLocations = [];
        this.lastBlockInfo = null;
        this.secondLastBlockInfo = null;
        this.blockCount = 0;

        this.newBlockIndexBuffer = [];

        const timestamp = Date.now();
        this.lastInitStampCache = timestamp
        await AsyncStorage.setItem(MIDNIGHT_MAP_INITIALIZED_KEY, timestamp.toString());
    }

    async hasToInitialize() {
        if (!this.lastInitStampCache) {
            const timeStampString = await AsyncStorage.getItem(MIDNIGHT_MAP_INITIALIZED_KEY);
            if (!timeStampString) {
                return true;
            } else {
                const timeStamp = Number(timeStampString);
                const previousDate = new Date(timeStamp);
                return hasDatePassed(previousDate);
            }
        } else {
            const previousDate = new Date(this.lastInitStampCache);
            return hasDatePassed(previousDate);
        }


    }

    async consumeItemAt(latitude: number, longitude: number) {
        const blockIndex = this.getBlockIndex(latitude, longitude);
        const blockInfo = this.blockInfoMap.get(blockIndex);
        if (blockInfo && blockInfo.itemPos) {
            blockInfo.itemPos = null;
            return true;
        }
        return false;
    }

    getBlockIndex(latitude: number, longitude: number) {
        const latStr = (Math.floor(latitude * this.blockScaler)).toString();
        const lonStr = (Math.floor(longitude * this.blockScaler)).toString();
        return `${latStr},${lonStr}`;
    }

    getResidentBlockIndex(latitude: number, longitude: number, latCount: number, lngCount: number) {
        return this.getBlockIndex(latitude + this.blockSize * latCount, longitude + this.blockSize * lngCount);
    }

    // getItemsInRegion(latCenter: number, lngCenter: number, latDelta: number, lngDelta: number) {
    //     const items: LocationCoordinate[] = [];
    //     const latTotalCount = Math.floor(latDelta / this.blockSize);
    //     const lngTotalCount = Math.floor(lngDelta / this.blockSize);
    //     const latCenterRound = Math.floor(latCenter * this.blockScaler) * this.blockSize;
    //     const lngCenterRound = Math.floor(lngCenter * this.blockScaler) * this.blockSize;


    //     for (let latCount = -latTotalCount; latCount < latTotalCount; latCount++) {
    //         for (let lngCount = -lngTotalCount; lngCount < lngTotalCount; lngCount++) {
    //             const blockIndex = this.getResidentBlockIndex(latCenter, lngCenter, latCount, lngCount);
    //             const blockInfo = this.blockInfoMap.get(blockIndex);
    //             if (blockInfo) {
    //                 if (blockInfo.itemPos) {
    //                     items.push(blockInfo.itemPos);
    //                 }
    //             }
    //         }
    //     }

    //     return items;
    // }

    getUpdatedOverlays() {
        const rects: PolygonCoordinates[] = [];
        const items: LocationCoordinate[] = [];
        const footsteps: RotatableCoordinate[] = [];

        console.log(this.newBlockIndexBuffer);
        for (const blockIndex of this.newBlockIndexBuffer) {
            const blockInfo = this.blockInfoMap.get(blockIndex);
            if (blockInfo) {
                const latRound = blockInfo.latAsInteger * this.blockSize;
                const lngRound = blockInfo.lngAsInteger * this.blockSize;

                rects.push([
                    { latitude: latRound, longitude: lngRound },
                    { latitude: latRound, longitude: lngRound + this.blockSize },
                    { latitude: latRound + this.blockSize, longitude: lngRound + this.blockSize },
                    { latitude: latRound + this.blockSize, longitude: lngRound },
                    { latitude: latRound, longitude: lngRound },
                ]);
                if (blockInfo.itemPos) {
                    items.push(blockInfo.itemPos);
                }
                if (blockInfo.footstepPos && blockInfo.footstepDirection) {
                    footsteps.push({
                        location: blockInfo.footstepPos,
                        rotation: Direction.angleFromYaxis(blockInfo.footstepDirection)
                    });
                }
            }
        }

        return { rects, items, footsteps };
    }

    async getOverlaysInRegion(latCenter: number, lngCenter: number, latDelta: number, lngDelta: number) {
        if (this.onCalculatingOverlay) return null;
        this.onCalculatingOverlay = true;

        this.newBlockIndexBuffer = [];
        this.overlayUpdateHandler();

        const rects: PolygonCoordinates[] = [];
        const items: LocationCoordinate[] = [];
        const footsteps: RotatableCoordinate[] = [];


        const latTotalCount = Math.floor(latDelta / this.blockSize);
        const lngTotalCount = Math.floor(lngDelta / this.blockSize);
        const latCenterRound = Math.floor(latCenter * this.blockScaler) * this.blockSize;
        const lngCenterRound = Math.floor(lngCenter * this.blockScaler) * this.blockSize;


        for (let latCount = -latTotalCount; latCount < latTotalCount; latCount++) {
            for (let lngCount = -lngTotalCount; lngCount < lngTotalCount; lngCount++) {
                const blockIndex = this.getResidentBlockIndex(latCenter, lngCenter, latCount, lngCount);
                const blockInfo = this.blockInfoMap.get(blockIndex);
                if (blockInfo) {
                    rects.push([
                        { latitude: latCenterRound + this.blockSize * latCount, longitude: lngCenterRound + this.blockSize * lngCount },
                        { latitude: latCenterRound + this.blockSize * latCount, longitude: lngCenterRound + this.blockSize * (lngCount + 1) },
                        { latitude: latCenterRound + this.blockSize * (latCount + 1), longitude: lngCenterRound + this.blockSize * (lngCount + 1) },
                        { latitude: latCenterRound + this.blockSize * (latCount + 1), longitude: lngCenterRound + this.blockSize * lngCount },
                        { latitude: latCenterRound + this.blockSize * latCount, longitude: lngCenterRound + this.blockSize * lngCount },
                    ]);
                    if (blockInfo.itemPos) {
                        items.push(blockInfo.itemPos);
                    }
                    if (blockInfo.footstepPos && blockInfo.footstepDirection) {
                        footsteps.push({
                            location: blockInfo.footstepPos,
                            rotation: Direction.angleFromYaxis(blockInfo.footstepDirection)
                        });
                    }
                }
            }
        }
        this.onCalculatingOverlay = false;
        return { rects, items, footsteps };
    }


    addPoint(latitude: number, longitude: number) {
        const blockIndex = this.getBlockIndex(latitude, longitude);
        const blockInfo = this.blockInfoMap.get(blockIndex);

        if (blockInfo) return;






        if (this.newBlockIndexBuffer.length < MAX_BLOCK_BUFFER_SIZE) {
            this.newBlockIndexBuffer.push(blockIndex);
        }


        const latAsInteger = Math.floor(latitude * this.blockScaler);
        const lngAsInteger = Math.floor(longitude * this.blockScaler);

        const randomItemLat = latAsInteger * this.blockSize + this.blockSize * Math.random();
        const randomItemLng = lngAsInteger * this.blockSize + this.blockSize * Math.random();

        const newBlockInfo = {
            latAsInteger: latAsInteger,
            lngAsInteger: lngAsInteger,
            timestamp: Date.now(),
            firstMoveDirection: [0, 0],
            adjointDirection: [],
            itemPos: { latitude: randomItemLat, longitude: randomItemLng },
            footstepPos: null,
            footstepDirection: [0, 0]
        }

        this.blockInfoMap.set(blockIndex, newBlockInfo);
        const lastBlockInfo = this.lastBlockInfo;
        const secondLastBlockInfo = this.secondLastBlockInfo;



        if (lastBlockInfo && lastBlockInfo !== newBlockInfo) {
            if (Direction.isNone(lastBlockInfo.firstMoveDirection)) {
                lastBlockInfo.firstMoveDirection = Direction.getDirection({
                    latitude: lastBlockInfo.latAsInteger,
                    longitude: lastBlockInfo.lngAsInteger,
                }, {
                    latitude: latAsInteger,
                    longitude: lngAsInteger,
                });


                lastBlockInfo.footstepDirection = lastBlockInfo.firstMoveDirection;
                const randomItemLat = latAsInteger * this.blockSize + this.blockSize * Math.random();
                const randomItemLng = lngAsInteger * this.blockSize + this.blockSize * Math.random();
                lastBlockInfo.footstepPos = { latitude: randomItemLat, longitude: randomItemLng };
            }
        }

        this.secondLastBlockInfo = this.lastBlockInfo;
        this.lastBlockInfo = newBlockInfo;

        this.overlayUpdateHandler();
    }
}

export const mapService = new MapBlockService(UNIT_COUNT);
export { BlockInfoData, LocationCoordinate, RotatableCoordinate, PolygonCoordinates };
