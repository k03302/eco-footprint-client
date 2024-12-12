import {
    RewardedAd,
    RewardedAdEventType,
    RewardedAdReward,
    TestIds,
} from 'react-native-google-mobile-ads';


const adUnitId: string = TestIds.REWARDED || "ca-app-pub-5756122103903893/4303746169";

class AdService {
    private rewarded: RewardedAd | null = null;
    private loadedHandler: () => void = () => { };
    private earnedhandler: (payload: RewardedAdReward) => void = (payload: RewardedAdReward) => { };
    private showAdOnLoad: boolean = false;
    private loaded: boolean = false;
    private onLoading: boolean = false;

    isAdOnLoading(): boolean {
        return this.onLoading;
    }

    isAdLoaded(): boolean {
        return this.loaded;
    }

    showAd(showAdOnLoad: boolean = false): boolean {
        if (this.loaded && this.rewarded) {

            this.rewarded.show();
            return true;
        } else if (showAdOnLoad) {
            this.showAdOnLoad = true;
        }
        return false;
    }

    loadAd() {
        console.log('loadAd method');
        this.onLoading = true;
        this.rewarded = RewardedAd.createForAdRequest(adUnitId);

        this.rewarded.addAdEventListener(
            RewardedAdEventType.LOADED,
            () => {
                console.log('ad loaded');
                this.onLoading = false;
                if (this.showAdOnLoad) {
                    this.showAdOnLoad = false;
                    this.loaded = false;
                    this.rewarded?.show();
                } else {
                    this.loaded = true;
                }
                this.loadedHandler();
            },
        );

        // 라워드를 받았을 때 이벤트 리스너
        this.rewarded.addAdEventListener(
            RewardedAdEventType.EARNED_REWARD,
            (payload) => {
                console.log('reward earned', payload);
                this.rewarded?.removeAllListeners();
                this.loaded = false;
                this.showAdOnLoad = false;
                this.earnedhandler(payload);
            }
        );

        this.rewarded.load();
    }

    registerLoadedHandler(loadedHandler: () => void) {
        this.loadedHandler = loadedHandler;
    }

    registerEarnedHandler(earnedHandler: (payload: RewardedAdReward) => void) {
        this.earnedhandler = earnedHandler;
    }
}


export const adService = new AdService();