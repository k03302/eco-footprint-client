import AsyncStorage from '@react-native-async-storage/async-storage';
import { hasDatePassed } from '@/utils/time'
import { BlockDirection, MapCoordData, MapCoordAngleData, getFullPolygon, getBlockPolygon, getCornerTypesFromAdjointDirections, BlockCornerType } from '@/utils/geo';

const MIDNIGHT_MAP_INITIALIZED_KEY = 'map_initialized';

const UNIT_SIZE = 0.0001;
const UNIT_SCALER = 10000;
const UNIT_COUNT = 10;
export const METER_PER_DEGREE = 100000;
export const DEGREE_PER_METER = 0.00001;
const MAX_BLOCK_BUFFER_SIZE = 100;
const MAP_AREA_MARGIN_RATE = 0.1;


type BlockInfoData = {
    latAsInteger: number;
    lngAsInteger: number;
    timestamp: number;
    firstMoveDirection: BlockDirection;
    adjointDirection: BlockDirection[];
    itemPos: MapCoordData | null;
    footstepPos: MapCoordData | null;
    footstepDirection: BlockDirection;
    isLeftFoot: boolean;
}




class MapBlockService {
    private blockInfoMap = new Map<string, BlockInfoData>();

    private lastBlockInfo: BlockInfoData | null = null;
    private blockSize: number;
    private multiplier: number;
    private blockScaler: number;
    private blockCount: number = 0;

    private itemCount: number = 0;
    private itemLocations: MapCoordData[] = [];
    private averageItemCountPerBlock: number = 0.2;
    private currentItemIndex: number = 0;

    private overlayUpdateHandler = () => { };

    private lastInitStampCache: number | null = null;

    /*
        Block size is multiple of unit size.
        Multiplier should be integer in form of 2^n * 5^m.
        This is for hashing of the block.
    */
    constructor(multiplier: number) {
        this.multiplier = multiplier;
        this.blockSize = multiplier * UNIT_SIZE;
        this.blockScaler = Math.floor(UNIT_SCALER / multiplier);
    }

    getItemCount() {
        return this.itemCount;
    }

    getBlockSizeInMeter() {
        return METER_PER_DEGREE * this.blockSize;
    }

    getBlockCount() {
        return this.blockCount;
    }

    registerUpdateHandler(handler: () => void) {
        this.overlayUpdateHandler = handler;
    }

    async initialize() {
        this.blockInfoMap = new Map<string, BlockInfoData>();
        this.itemLocations = [];
        this.lastBlockInfo = null;
        this.blockCount = 0;

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

    consumeItemAt(latitude: number, longitude: number): boolean {
        const blockIndex = this.getBlockIndex(latitude, longitude);
        const blockInfo = this.blockInfoMap.get(blockIndex);
        if (blockInfo && blockInfo.itemPos) {
            blockInfo.itemPos = null;
            this.itemCount -= 1;
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


    getOverlaysInRegion({ latitude, longitude, latitudeDelta, longitudeDelta }
        : { latitude: number, longitude: number, latitudeDelta: number, longitudeDelta: number }
    ) {
        this.overlayUpdateHandler();

        const rects: MapCoordData[][] = [];
        const items: MapCoordData[] = [];
        const footsteps: MapCoordAngleData[] = [];


        const latTotalCount = Math.floor(latitudeDelta / this.blockSize);
        const lngTotalCount = Math.floor(longitudeDelta / this.blockSize);
        const latCenterRound = Math.floor(latitude * this.blockScaler) * this.blockSize;
        const lngCenterRound = Math.floor(longitude * this.blockScaler) * this.blockSize;


        for (let latCount = -latTotalCount; latCount < latTotalCount; latCount++) {
            for (let lngCount = -lngTotalCount; lngCount < lngTotalCount; lngCount++) {
                const blockIndex = this.getResidentBlockIndex(latitude, longitude, latCount, lngCount);
                const blockInfo = this.blockInfoMap.get(blockIndex);
                if (blockInfo) {

                    const cornerTypes = getCornerTypesFromAdjointDirections(blockInfo.adjointDirection);

                    rects.push(getBlockPolygon({
                        latitude: latCenterRound + this.blockSize * latCount,
                        longitude: lngCenterRound + this.blockSize * lngCount,
                        latitudeDelta: this.blockSize,
                        longitudeDelta: this.blockSize
                    }, cornerTypes));

                    if (blockInfo.itemPos) {
                        items.push(blockInfo.itemPos);
                    }
                    if (blockInfo.footstepPos && blockInfo.footstepDirection) {
                        footsteps.push({
                            location: blockInfo.footstepPos,
                            rotation: blockInfo.footstepDirection.getAngle()
                        });
                    }
                }
            }
        }
        return { rects, items, footsteps };
    }


    getNextItemPos(): MapCoordData | null {
        while (this.currentItemIndex < this.itemLocations.length) {
            const itemPos = this.itemLocations[this.currentItemIndex];
            const blockIndex = this.getBlockIndex(itemPos.latitude, itemPos.longitude);
            const blockInfo = this.blockInfoMap.get(blockIndex);
            if (blockInfo && blockInfo.itemPos) {
                return itemPos;
            }
            this.currentItemIndex += 1;
        }
        return null;
    }


    addPoint(latitude: number, longitude: number) {
        const blockIndex = this.getBlockIndex(latitude, longitude);
        const blockInfo = this.blockInfoMap.get(blockIndex);

        if (blockInfo) return;


        // get left bottom coord of the block
        const latAsInteger = Math.floor(latitude * this.blockScaler);
        const lngAsInteger = Math.floor(longitude * this.blockScaler);


        // generate item
        let itemPos = null;
        const r = Math.random();
        if (this.averageItemCountPerBlock > r) {
            itemPos = {
                latitude: latAsInteger * this.blockSize + this.blockSize * Math.random(),
                longitude: lngAsInteger * this.blockSize + this.blockSize * Math.random()
            }
            this.itemCount += 1;
            this.itemLocations.push(itemPos);
        }




        const newBlockInfo = {
            latAsInteger: latAsInteger,
            lngAsInteger: lngAsInteger,
            timestamp: Date.now(),
            firstMoveDirection: BlockDirection.NONE,
            adjointDirection: new Array<BlockDirection>(),
            itemPos: itemPos,
            footstepPos: null,
            footstepDirection: BlockDirection.NONE,
            isLeftFoot: true
        }

        this.blockInfoMap.set(blockIndex, newBlockInfo);


        const lastBlockInfo = this.lastBlockInfo;

        // set footstep
        if (lastBlockInfo && lastBlockInfo !== newBlockInfo) {
            if (lastBlockInfo.firstMoveDirection.isNone()) {
                // set first move direction
                lastBlockInfo.firstMoveDirection = BlockDirection.getDirection({
                    latitude: lastBlockInfo.latAsInteger,
                    longitude: lastBlockInfo.lngAsInteger,
                }, {
                    latitude: latAsInteger,
                    longitude: lngAsInteger,
                });


                // set footstep direction. footstep direction is first move direction
                lastBlockInfo.footstepDirection = lastBlockInfo.firstMoveDirection;

                // set footstep position
                const lastFootstepLat = lastBlockInfo.latAsInteger * this.blockSize + this.blockSize * (0.5 * Math.random() + 0.25);
                const lastFootstepLng = lastBlockInfo.lngAsInteger * this.blockSize + this.blockSize * (0.5 * Math.random() + 0.25);
                lastBlockInfo.footstepPos = { latitude: lastFootstepLat, longitude: lastFootstepLng };
            }
        }


        // update adjoint blocks
        for (let latCount = -1; latCount <= 1; ++latCount) {
            for (let lngCount = -1; lngCount <= 1; ++lngCount) {
                if (latCount === 0 && lngCount === 0) continue;
                const otherBlockIndex = this.getResidentBlockIndex(latitude, longitude, latCount, lngCount);
                const otherBlockInfo = this.blockInfoMap.get(otherBlockIndex);
                if (otherBlockInfo) {
                    const adjointDirection = new BlockDirection(latCount, lngCount);
                    newBlockInfo.adjointDirection.push(adjointDirection);
                    otherBlockInfo.adjointDirection.push(adjointDirection.opposite());
                }
            }
        }


        this.lastBlockInfo = newBlockInfo;

        this.blockCount += 1;
        this.overlayUpdateHandler();
    }
}

export const mapService = new MapBlockService(UNIT_COUNT);
export { BlockInfoData, MapCoordData, MapCoordAngleData };
