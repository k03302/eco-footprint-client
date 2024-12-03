import { MapCoordData } from "@/utils/geo";
import * as turf from '@turf/turf';


const AVERAGE_MAX_METER_PER_SEC = 3;
const AVERAGE_MIN_STEP_PER_METER = 0;

class WalkMonitorService {
    private lastStepCount: number = 0;
    private onWalking: boolean = false;
    private lastPos: MapCoordData | null = null;
    private lastPosTimestamp: number = 0;

    private averageMaxMeterPerSec: number;
    private averageMinStepPerMeter: number;

    constructor(_averageMaxMeterPerSec: number, _averageMinStepPerMeter: number) {
        this.averageMaxMeterPerSec = _averageMaxMeterPerSec;
        this.averageMinStepPerMeter = _averageMinStepPerMeter;
    }


    update(currentPos: MapCoordData, stepCount: number) {
        const stepDiff = stepCount - this.lastStepCount;
        this.lastStepCount = stepCount;

        const currentTimestamp = Date.now();
        const timeDiffSec = (currentTimestamp - this.lastPosTimestamp) / 1000;
        this.lastPosTimestamp = currentTimestamp;


        if (!this.lastPos) {
            this.lastPos = currentPos;
        }

        const startPoint = turf.point([this.lastPos.longitude, this.lastPos.latitude]);
        const endPoint = turf.point([currentPos.longitude, currentPos.latitude]);
        const distanceDiffMeter = turf.distance(startPoint, endPoint, 'kilometers') * 1000;
        this.lastPos = currentPos;


        const maxDistanceDiffMeter = this.averageMaxMeterPerSec * timeDiffSec;
        if (distanceDiffMeter > maxDistanceDiffMeter) {
            this.onWalking = false;
            return false;
        }

        const minStepDiff = this.averageMinStepPerMeter * distanceDiffMeter;
        if (minStepDiff > stepDiff) {
            this.onWalking = false;
            return false;
        }

        this.onWalking = true;
        return true;
    }

    isWalking() {
        return this.onWalking;
    }
}



export const walkMonitorService = new WalkMonitorService(AVERAGE_MAX_METER_PER_SEC, AVERAGE_MIN_STEP_PER_METER);