import * as ScreenGuardData from './data';
declare const _default: {
    /**
     * activate screenshot blocking (iOS 13+, Android 5+)
     * @param data ScreenGuardColorData object
     * @version v0.0.2+
     */
    register(data: ScreenGuardData.ScreenGuardColorData): void;
    /**
     * Activate screenshot blocking with a blur effect after captured (iOS 13+, Android 6+)
     * @param data ScreenGuardBlurDataObject data object
     * @version v0.1.2+
     */
    registerWithBlurView(data: ScreenGuardData.ScreenGuardBlurDataObject): void;
    /**
     * activate with an Image uri (iOS 13+, Android 8+)
     * @param data ScreenGuardImageDataObject data object,
     * @version v1.0.2+
     */
    registerWithImage(data: ScreenGuardData.ScreenGuardImageDataObject): void;
    /**
     * Deactivate screenguard
     * Clear all screen protector and event listening
     * @version v0.0.2+
     */
    unregister(): void;
    /**
     * Screenshot event listener
     * Register for screenshot event listener
     * @param getScreenShotPath if true, callback will return a ScreenGuardScreenShotPathDataObject containing info of an image after captured, null otherwise. Default = false
     * @param callback callback after a screenshot has been triggered.
     * @version v0.3.6+
     */
    registerScreenshotEventListener(getScreenShotPath: boolean | undefined, callback: (data?: ScreenGuardData.ScreenGuardScreenShotPathDataObject | null | undefined) => void): void;
    /**
     * Screen recording event listener (iOS only)
     * Register for screen recording event listener
     * @version v0.3.6+
     */
    registerScreenRecordingEventListener(callback: (arg: any) => void): void;
};
export default _default;
