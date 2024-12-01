const CORNER_SIZE_RATIO = 0.2;


enum BlockCornerType {
    NONE = 0,
    ROUNDED = 1,
    VERTICAL_EXTRUDED = 2,
}


function linearCombination(coord1: MapCoordData, coord2: MapCoordData, coord1Factor: number, coord2Factor: number): MapCoordData {
    return {
        latitude: coord1.latitude * coord1Factor + coord2.latitude * coord2Factor,
        longitude: coord1.longitude * coord1Factor + coord2.longitude * coord2Factor
    }
}



function getRoundedCornerLine(
    startLocation: MapCoordData,
    endLocation: MapCoordData
): MapCoordData[] {

    return [
        startLocation,
        linearCombination(startLocation, endLocation, 0.8, 0.5),
        linearCombination(startLocation, endLocation, 0.7, 0.7),
        linearCombination(startLocation, endLocation, 0.8, 0.5),
        endLocation
    ];
}


function getVerticalExtrudedCornerLine(
    startLocation: MapCoordData,
    endLocation: MapCoordData
): MapCoordData[] {
    const verticalDistance = endLocation.latitude - startLocation.latitude;
    const symmatricStartLocation = {
        latitude: startLocation.latitude + 2 * verticalDistance,
        longitude: startLocation.longitude
    }
    return [
        startLocation,
        ...getRoundedCornerLine(symmatricStartLocation, endLocation)
    ];
}

function getCornerLine(
    cornerPoint: MapCoordData,
    cornerLength: number,
    cornerDirection: BlockUnitDirectionType,
    cornerType: BlockCornerType
): MapCoordData[] {
    switch (cornerType) {
        case BlockCornerType.NONE:
            return [cornerPoint];
        case BlockCornerType.ROUNDED:
        case BlockCornerType.VERTICAL_EXTRUDED:
            const outerDirection = BlockDirection.getUnitDirection(cornerDirection);
            const latSign = Math.sign(outerDirection.lat);
            const lngSign = Math.sign(outerDirection.lng);

            const latCornerPoint = {
                latitude: cornerPoint.latitude - latSign * cornerLength,
                longitude: cornerPoint.longitude
            }
            const lngCornerPoint = {
                latitude: cornerPoint.latitude,
                longitude: cornerPoint.longitude - lngSign * cornerLength
            }

            if (cornerType === BlockCornerType.ROUNDED) {
                return getRoundedCornerLine(latCornerPoint, lngCornerPoint);
            } else {
                return getVerticalExtrudedCornerLine(latCornerPoint, lngCornerPoint);
            }
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
        ...getCornerLine(bottomLeftPoint, cornerSize, BlockUnitDirectionType.DOWNLEFT, cornerOptions[0]),
        ...getCornerLine(bottomRightPoint, cornerSize, BlockUnitDirectionType.DOWNRIGHT, cornerOptions[1]),
        ...getCornerLine(topRightPoint, cornerSize, BlockUnitDirectionType.UPRIGHT, cornerOptions[2]),
        ...getCornerLine(topLeftPoint, cornerSize, BlockUnitDirectionType.UPLEFT, cornerOptions[3])
    ];

    result.push(result[0]);
    return result;
}













enum BlockUnitDirectionType {
    NONE = 0,
    UP = 1,
    DOWN = 2,
    LEFT = 3,
    RIGHT = 4,
    UPLEFT = 5,
    UPRIGHT = 6,
    DOWNLEFT = 7,
    DOWNRIGHT = 8
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

    getLatDirection() {
        return new BlockDirection(this.lat, 0);
    }

    getLngDirection() {
        return new BlockDirection(0, this.lng);
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

    static getUnitDirection(directionType: BlockUnitDirectionType): BlockDirection {
        switch (directionType) {
            case BlockUnitDirectionType.NONE:
                return BlockDirection.NONE;
            case BlockUnitDirectionType.UP:
                return BlockDirection.UP;
            case BlockUnitDirectionType.DOWN:
                return BlockDirection.DOWN;
            case BlockUnitDirectionType.LEFT:
                return BlockDirection.LEFT;
            case BlockUnitDirectionType.RIGHT:
                return BlockDirection.RIGHT;
            case BlockUnitDirectionType.UPRIGHT:
                return BlockDirection.UPRIGHT;
            case BlockUnitDirectionType.UPLEFT:
                return BlockDirection.UPLEFT;
            case BlockUnitDirectionType.DOWNRIGHT:
                return BlockDirection.DOWNRIGHT;
            case BlockUnitDirectionType.DOWNLEFT:
                return BlockDirection.DOWNLEFT;
        }
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

export type RotableItemData = {
    location: MapCoordData,
    rotation: number
}