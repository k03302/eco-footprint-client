import AsyncStorage from '@react-native-async-storage/async-storage';
import { hasDatePassed } from '@/utils/time'
import { BlockDirection, MapCoordData, MapCoordAngleData, getFullPolygon, getBlockPolygon } from '@/utils/geo';

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
    private newBlockIndexBuffer: string[] = [];

    private itemLocations: MapCoordData[] = [];
    private averageItemCountPerBlock: number = 0.2;

    private lastBlockInfo: BlockInfoData | null = null;
    private blockSize: number;
    private blockUnitCount: number;
    private blockScaler: number;
    private blockCount: number = 0;

    private itemCount: number = 0;

    private overlayUpdateHandler = () => { };

    private onCalculatingOverlay: boolean = false;
    private lastInitStampCache: number | null = null;

    constructor(blockUnitCount: number) {
        this.blockUnitCount = blockUnitCount;
        this.blockSize = blockUnitCount * UNIT_SIZE;
        this.blockScaler = Math.floor(UNIT_SCALER / blockUnitCount);
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

    getItemsInRegion(latCenter: number, lngCenter: number, latDelta: number, lngDelta: number) {
        const items: MapCoordData[] = [];
        const latTotalCount = Math.floor(latDelta / this.blockSize);
        const lngTotalCount = Math.floor(lngDelta / this.blockSize);
        const latCenterRound = Math.floor(latCenter * this.blockScaler) * this.blockSize;
        const lngCenterRound = Math.floor(lngCenter * this.blockScaler) * this.blockSize;


        for (let latCount = -latTotalCount; latCount < latTotalCount; latCount++) {
            for (let lngCount = -lngTotalCount; lngCount < lngTotalCount; lngCount++) {
                const blockIndex = this.getResidentBlockIndex(latCenter, lngCenter, latCount, lngCount);
                const blockInfo = this.blockInfoMap.get(blockIndex);
                if (blockInfo) {
                    if (blockInfo.itemPos) {
                        items.push(blockInfo.itemPos);
                    }
                }
            }
        }

        return items;
    }

    getOverlaysInRegion({ latitude, longitude, latitudeDelta, longitudeDelta }
        : { latitude: number, longitude: number, latitudeDelta: number, longitudeDelta: number }
    ) {
        if (this.onCalculatingOverlay) return null;
        this.onCalculatingOverlay = true;

        this.newBlockIndexBuffer = [];
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
                    rects.push(getFullPolygon({
                        latitude: latCenterRound + this.blockSize * latCount,
                        longitude: lngCenterRound + this.blockSize * lngCount,
                        latitudeDelta: this.blockSize,
                        longitudeDelta: this.blockSize
                    }));
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
        }


        const lastBlockInfo = this.lastBlockInfo;



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
                const blockIndex = this.getResidentBlockIndex(latitude, longitude, latCount, lngCount);
                const blockInfo = this.blockInfoMap.get(blockIndex);
                if (blockInfo) {
                    const adjointDirection = new BlockDirection(latCount, lngCount);
                    newBlockInfo.adjointDirection.push(adjointDirection);
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
