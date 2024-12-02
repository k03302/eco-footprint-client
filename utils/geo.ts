const CORNER_SIZE_RATIO = 0.3;


export enum BlockCornerType {
    NONE = 0,
    ROUNDED = -1,
    VERTICAL_EXTRUDED = 1,
}



function getRoundedCornerLine(
    cornerPoint: MapCoordData,
    cornerLength: number,
    cornerDirection: BlockDirection
): MapCoordData[] {
    const { latitude: cornerLat, longitude: cornerLng } = cornerPoint;
    const dLat = cornerDirection.lat * cornerLength;
    const dLng = cornerDirection.lng * cornerLength;


    if (cornerDirection === BlockDirection.DOWNLEFT || cornerDirection === BlockDirection.UPRIGHT) {
        return [
            { latitude: cornerLat - dLat * 1, longitude: cornerLng - dLng * 0 },
            { latitude: cornerLat - dLat * 0.5, longitude: cornerLng - dLng * 0.2 },
            { latitude: cornerLat - dLat * 0.3, longitude: cornerLng - dLng * 0.3 },
            { latitude: cornerLat - dLat * 0.2, longitude: cornerLng - dLng * 0.5 },
            { latitude: cornerLat - dLat * 0, longitude: cornerLng - dLng * 1 }
        ];
    } else {
        return [
            { latitude: cornerLat - dLat * 0, longitude: cornerLng - dLng * 1 },
            { latitude: cornerLat - dLat * 0.2, longitude: cornerLng - dLng * 0.5 },
            { latitude: cornerLat - dLat * 0.3, longitude: cornerLng - dLng * 0.3 },
            { latitude: cornerLat - dLat * 0.5, longitude: cornerLng - dLng * 0.2 },
            { latitude: cornerLat - dLat * 1, longitude: cornerLng - dLng * 0 }
        ];
    }
}


function getVerticalExtrudedCornerLine(
    cornerPoint: MapCoordData,
    cornerLength: number,
    cornerDirection: BlockDirection
): MapCoordData[] {
    const { latitude: cornerLat, longitude: cornerLng } = cornerPoint;
    const dLat = -cornerDirection.lat * cornerLength;
    const dLng = cornerDirection.lng * cornerLength;

    if (cornerDirection === BlockDirection.DOWNLEFT || cornerDirection === BlockDirection.UPRIGHT) {
        return [
            { latitude: cornerLat - dLat * 1, longitude: cornerLng - dLng * 0 },
            { latitude: cornerLat - dLat * 0.5, longitude: cornerLng - dLng * 0.2 },
            { latitude: cornerLat - dLat * 0.3, longitude: cornerLng - dLng * 0.3 },
            { latitude: cornerLat - dLat * 0.2, longitude: cornerLng - dLng * 0.5 },
            { latitude: cornerLat - dLat * 0, longitude: cornerLng - dLng * 1 }
        ];
    } else {
        return [
            { latitude: cornerLat - dLat * 0, longitude: cornerLng - dLng * 1 },
            { latitude: cornerLat - dLat * 0.2, longitude: cornerLng - dLng * 0.5 },
            { latitude: cornerLat - dLat * 0.3, longitude: cornerLng - dLng * 0.3 },
            { latitude: cornerLat - dLat * 0.5, longitude: cornerLng - dLng * 0.2 },
            { latitude: cornerLat - dLat * 1, longitude: cornerLng - dLng * 0 }
        ];
    }

}

function getCornerLine(
    cornerPoint: MapCoordData,
    cornerLength: number,
    cornerDirection: BlockDirection,
    cornerType: BlockCornerType
): MapCoordData[] {
    switch (cornerType) {
        case BlockCornerType.NONE:
            return [cornerPoint];
        case BlockCornerType.ROUNDED:
            return getRoundedCornerLine(cornerPoint, cornerLength, cornerDirection);
        case BlockCornerType.VERTICAL_EXTRUDED:
            return getVerticalExtrudedCornerLine(cornerPoint, cornerLength, cornerDirection);
    }
}


export function getFullPolygon(mapRegion: MapRegion): MapCoordData[] {
    return [
        { latitude: mapRegion.latitude, longitude: mapRegion.longitude },
        { latitude: mapRegion.latitude, longitude: mapRegion.longitude + mapRegion.longitudeDelta },
        { latitude: mapRegion.latitude + mapRegion.latitudeDelta, longitude: mapRegion.longitude + mapRegion.longitudeDelta },
        { latitude: mapRegion.latitude + mapRegion.latitudeDelta, longitude: mapRegion.longitude },
        { latitude: mapRegion.latitude, longitude: mapRegion.longitude },
    ];
}



export function getBlockPolygon(mapRegion: MapRegion,
    cornerOptions: BlockCornerType[]): MapCoordData[] {

    const { latitude: lat, longitude: lng, latitudeDelta: dLat, longitudeDelta: dLng } = mapRegion;

    const smallerDelta = Math.min(dLat, dLng);
    const cornerSize = smallerDelta * CORNER_SIZE_RATIO;

    const bottomLeftPoint: MapCoordData = { latitude: lat, longitude: lng };
    const bottomRightPoint: MapCoordData = { latitude: lat, longitude: lng + dLng };
    const topRightPoint: MapCoordData = { latitude: lat + dLat, longitude: lng + dLng };
    const topLeftPoint: MapCoordData = { latitude: lat + dLat, longitude: lng };

    const result = [
        ...getCornerLine(bottomLeftPoint, cornerSize, BlockDirection.DOWNLEFT, cornerOptions[0]),
        ...getCornerLine(bottomRightPoint, cornerSize, BlockDirection.DOWNRIGHT, cornerOptions[1]),
        ...getCornerLine(topRightPoint, cornerSize, BlockDirection.UPRIGHT, cornerOptions[2]),
        ...getCornerLine(topLeftPoint, cornerSize, BlockDirection.UPLEFT, cornerOptions[3])
    ];

    result.push(result[0]);
    return result;
}













export function getCornerTypesFromAdjointDirections(adjointDirections: BlockDirection[]): BlockCornerType[] {
    let upBlockExists = false;
    let downBlockExists = false;
    let rightBlockExists = false;
    let leftBlockExists = false;
    let uprightBlockExists = false;
    let upleftBlockExists = false;
    let downrightBlockExists = false;
    let downleftBlockExists = false;

    const cornerTypes = [
        BlockCornerType.ROUNDED, // 0: bottom left
        BlockCornerType.ROUNDED, // 1: bottom right
        BlockCornerType.ROUNDED, // 2: top right
        BlockCornerType.ROUNDED // 3: top left
    ];

    const setNone = (index: number, force = false) => {
        if (force) {
            cornerTypes[index] = BlockCornerType.NONE;
        } else {
            if (cornerTypes[index] != BlockCornerType.VERTICAL_EXTRUDED) {
                cornerTypes[index] = BlockCornerType.NONE;
            }
        }
    }

    const setExtruded = (index: number) => {
        cornerTypes[index] = BlockCornerType.VERTICAL_EXTRUDED;
    }

    for (const direction of adjointDirections) {
        const { lat, lng } = direction;
        if (lat === 1) {
            if (lng === 1) { // UPRIGHT
                uprightBlockExists = true;
                if (!upBlockExists) setExtruded(2);
            } else if (lng === -1) { // UPLEFT
                upleftBlockExists = true;
                if (!upBlockExists) setExtruded(3);
            } else { //UP
                upBlockExists = true;
                setNone(2, uprightBlockExists);
                setNone(3, upleftBlockExists);
            }
        } else if (lat === -1) {
            if (lng === 1) {// DONWRIGHT
                downrightBlockExists = true;
                if (!downBlockExists) {
                    setExtruded(1);
                    console.log('DOWNRIGHT', downBlockExists);
                }
            } else if (lng === -1) { // DOWNLEFT
                downleftBlockExists = true;
                if (!downBlockExists) {
                    setExtruded(0);
                }
            } else { // DOWN
                downBlockExists = true;
                setNone(0, downleftBlockExists);
                setNone(1, downrightBlockExists);
            }
        } else {
            if (lng === 1) { // RIGHT
                rightBlockExists = true;
                setNone(1);
                setNone(2);
            } else if (lng === -1) { // LEFT
                leftBlockExists = true;
                setNone(3);
                setNone(0);
            }
        }
    }


    return cornerTypes;
}


export class BlockDirection {
    lat: number;
    lng: number;

    static NONE = new BlockDirection(0, 0);
    static UP = new BlockDirection(1, 0);
    static DOWN = new BlockDirection(-1, 0);
    static LEFT = new BlockDirection(0, -1);
    static RIGHT = new BlockDirection(0, 1);
    static UPRIGHT = new BlockDirection(1, 1);
    static UPLEFT = new BlockDirection(1, -1);
    static DOWNRIGHT = new BlockDirection(-1, 1);
    static DOWNLEFT = new BlockDirection(-1, -1);

    constructor(lat: number, lng: number) {
        this.lat = lat;
        this.lng = lng;
    }

    opposite() {
        return new BlockDirection(-this.lat, -this.lng);
    }

    isNone() {
        return (this.lat === 0 && this.lng === 0);
    }

    getAngle() {
        const angleRad = Math.atan2(this.lng, this.lat);
        const angleDeg = (angleRad * (180 / Math.PI) + 360) % 360;

        return angleDeg;
    }

    static getDirection(from: MapCoordData, to: MapCoordData): BlockDirection {
        if (from.latitude < to.latitude) {
            if (from.longitude < to.longitude) {
                return BlockDirection.UPRIGHT;
            } else if (from.longitude > to.longitude) {
                return BlockDirection.UPLEFT;
            } else {
                return BlockDirection.UP;
            }
        } else if (from.latitude > to.latitude) {
            if (from.longitude < to.longitude) {
                return BlockDirection.DOWNRIGHT;
            } else if (from.longitude > to.longitude) {
                return BlockDirection.DOWNLEFT;
            } else {
                return BlockDirection.DOWN;
            }
        } else {
            if (from.longitude < to.longitude) {
                return BlockDirection.RIGHT
            } else if (from.longitude > to.longitude) {
                return BlockDirection.LEFT;
            } else {
                return BlockDirection.NONE;
            }
        }
    }


}


export type MapRegion = {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
}

export type MapCoordData = {
    latitude: number,
    longitude: number
}

export type MapCoordAngleData = {
    location: MapCoordData
    rotation: number
}
