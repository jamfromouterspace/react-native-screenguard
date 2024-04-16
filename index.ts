/* eslint-disable @typescript-eslint/no-unused-vars */
import { NativeModules, NativeEventEmitter } from 'react-native';
import { 
  ScreenGuardBlurDataObject, 
  ScreenGuardImageDataObject, 
  ScreenGuardScreenShotPathDataObject 
} from './data';

import * as ScreenGuardConstants from './constant';
import { Platform } from 'react-native';

const { ScreenGuard } = NativeModules;

var screenShotEmitter: NativeEventEmitter | null = null;

var screenRecordingEmitter: NativeEventEmitter | null = null;

export default {
  /**
   * activate screenshot blocking (iOS 13+, Android 5+)
   * @param capturedBackgroundColor background color layout after taking a screenshot
   * @version v0.0.2+
   */
  register(capturedBackgroundColor: String | null) {
    let currentColor =
      capturedBackgroundColor == null ||
      capturedBackgroundColor.trim().length === 0 ||
      !capturedBackgroundColor.trim().startsWith('#') ||
      ScreenGuardConstants.REGEX.test(
        capturedBackgroundColor.trim().substring(1)
      )
        ? ScreenGuardConstants.BLACK_COLOR
        : capturedBackgroundColor;
    ScreenGuard.activateShield(currentColor);
  },

  /**
   * Activate screenshot blocking with a blur effect after captured (iOS 13+, Android 6+)
   * @param data ScreenGuardBlurDataObject data object
   * @param callback void callback after a screenshot or a video capture has been taken
   * @version v0.1.2+
   */
  registerWithBlurView(data: ScreenGuardBlurDataObject) {
    const {
      radius = ScreenGuardConstants.RADIUS_DEFAULT,
      timeAfterResume = ScreenGuardConstants.TIME_DELAYED,
    } = data;
    if (typeof radius !== 'number') {
      throw new Error('radius must be a number and bigger than 1');
    }
    if (radius < 1) {
      throw new Error('radius must bigger than 1!');
    }
    if (radius >= 1 && radius < 15) {
      console.warn(
        'Consider a radius value bigger than 15, as content still very clear and easy to read!'
      );
    }
    if (radius > 50) {
      console.warn(
        'Consider a radius value in between 15 and 50, as blur contents may vanish inside the view!'
      );
    }
    if (Platform.OS === 'android' && timeAfterResume > 3000) {
      console.warn(
        'Consider a number in between 1000 and 3000 for better user experience!'
      );
    }
    if (
      Platform.OS === 'android' &&
      (timeAfterResume < 0 || isNaN(timeAfterResume))
    ) {
      throw new Error('timeAfterResume must be > 0!');
    }
    if (Platform.OS === 'ios') {
      ScreenGuard.activateShieldWithBlurView(radius);
    } else {
      ScreenGuard.activateShieldWithBlurView({ radius, timeAfterResume });
    }
  },

  /**
   * activate with an Image uri (iOS 13+, Android 8+)
   * @param data ScreenGuardImageDataObject data object,
   * @param callback void callback after a screenshot or a video screen capture has been taken
   * @version v1.0.0+
   */
  registerWithImage(
    data: ScreenGuardImageDataObject,
  ) {
    const {
      uri,
      width,
      height,
      backgroundColor = ScreenGuardConstants.BLACK_COLOR,
      alignment = ScreenGuardConstants.Alignment.center,
      timeAfterResume = ScreenGuardConstants.TIME_DELAYED,
    } = data;

    if (uri.length === 0) {
      throw new Error('uri must not be empty!');
    }
    if (width < 1) {
      throw new Error('width of image must bigger than 0!');
    }
    if (height < 1) {
      throw new Error('height of image must bigger than 0!');
    }
    if (!ScreenGuardConstants.IMAGE_REGEX.test(data.uri)) {
      console.warn(
        'Looks like the uri is not an image uri. Try to provide a correct image uri for better result!'
      );
    }
    if (alignment != null && (alignment > 8 || alignment < 0)) {
      throw new Error(
        'alignment must be in range from 0 -> 8 only, values: \n topLeft: 0; \n topCenter: 1; \n topRight: 2; \n centerLeft: 3; \n Center: 4; \n centerRight: 5; \n bottomLeft: 6; \n bottomCenter: 7;\n bottomRight: 8; \n If you want to center the image, leave null instead!'
      );
    }

    ScreenGuard.activateShieldWithImage({
      uri,
      width,
      height,
      alignment,
      backgroundColor,
      timeAfterResume,
    });
  },

  /**
   * Deactivate screenguard
   * Clear all screen protector and event listening
   * @version v0.0.2+
   */
  unregister() {
    ScreenGuard.deactivateShield();
    if (screenShotEmitter != null) {
      screenShotEmitter.removeAllListeners(ScreenGuardConstants.SCREENSHOT_EVT);
      screenShotEmitter = null;
    }
    if (screenRecordingEmitter != null) {
      screenRecordingEmitter.removeAllListeners(
        ScreenGuardConstants.SCREEN_RECORDING_EVT
      );
      screenRecordingEmitter = null;
    }
  },

  /**
   * Screenshot event listener
   * Register for screenshot event listener
   * @param getScreenShotPath if true, callback will return a ScreenGuardScreenShotPathDataObject containing info of an image after captured, null otherwise. Default = false
   * @param callback callback after a screenshot has been triggered.
   * @version v0.3.6+
   */
  registerScreenshotEventListener(
    getScreenShotPath: boolean = false,
    callback: (data?: ScreenGuardScreenShotPathDataObject) => void
  ) {
    const _onScreenCapture = (res?: ScreenGuardScreenShotPathDataObject | null) => {
      callback(res);
    };
    const listenerCount = screenShotEmitter.listenerCount(
      ScreenGuardConstants.SCREENSHOT_EVT
    );
    if (!listenerCount) {
      screenShotEmitter.addListener(
        ScreenGuardConstants.SCREENSHOT_EVT,
        _onScreenCapture
      );
    }
  },

  /**
   * Screen recording event listener (iOS only)
   * Register for screen recording event listener
   * @version v0.3.6+
   */
  registerScreenRecordingEventListener(callback: (arg: any) => void) {
    if (Platform.OS === 'ios') {
      ScreenGuard.registerScreenRecordingEventListener();
      if (screenRecordingEmitter == null) {
        screenRecordingEmitter = new NativeEventEmitter(ScreenGuard);
      }
      const _onScreenRecording = (res: any) => {
        callback(res);
      };
      const listenerCount = screenRecordingEmitter.listenerCount(
        ScreenGuardConstants.SCREEN_RECORDING_EVT
      );
      if (!listenerCount) {
        screenRecordingEmitter.addListener(
          ScreenGuardConstants.SCREEN_RECORDING_EVT,
          _onScreenRecording
        );
      }
    }
  },
};
