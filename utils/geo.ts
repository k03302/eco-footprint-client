export const METER_PER_DEGREE = 100000;
export const DEGREE_PER_METER = 0.00001;


export const Direction = {
    NONE: [0, 0],
    UP: [1, 0],
    DOWN: [-1, 0],
    LEFT: [0, -1],
    RIGHT: [0, 1],
    UPLEFT: [1, -1],
    UPRIGHT: [1, 1],
    DOWNLEFT: [-1, -1],
    DOWNRIGHT: [-1, 1],

    getAngle(direction: number[]) {
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
    },
    getDirectionContinuous(from: LocationCoordinate, to: LocationCoordinate): number[] {
        const dLat = to.latitude - from.latitude;
        const dLng = to.longitude - from.longitude;
        return [dLat, dLng];
    }
}


export type LocationCoordinate = {
    latitude: number;
    longitude: number;
}

export type RotatableCoordinate = {
    location: LocationCoordinate;
    rotation: number;
}

export type PolygonCoordinates = LocationCoordinate[]


