import { isPlatformBrowser } from '@angular/common';
import { HapticsSupport } from '../types/haptics.types';

export function detectHapticsSupport(platformId: object, reducedMotion: boolean, isSupported: boolean): HapticsSupport {
    if (!isPlatformBrowser(platformId)) {
        return {
            supported: false,
            platform: 'unknown',
            method: 'unsupported',
            browser: 'unknown',
            reducedMotion: false,
        };
    }

    const userAgent = navigator.userAgent.toLowerCase();

    let platform: HapticsSupport['platform'] = 'unknown';
    if (userAgent.includes('android')) {
        platform = 'android';
    } else if (userAgent.includes('iphone') || userAgent.includes('ipad') || userAgent.includes('ipod')) {
        platform = 'ios';
    } else if (userAgent.includes('mac') || userAgent.includes('windows') || userAgent.includes('linux')) {
        platform = 'desktop';
    }

    let browser: HapticsSupport['browser'] = 'unknown';
    if (userAgent.includes('chrome') && !userAgent.includes('edg')) {
        browser = 'chrome';
    } else if (userAgent.includes('safari') && !userAgent.includes('chrome')) {
        browser = 'safari';
    } else if (userAgent.includes('firefox')) {
        browser = 'firefox';
    } else if (userAgent.includes('edg')) {
        browser = 'edge';
    }

    let method: HapticsSupport['method'] = 'unsupported';
    if ('vibrate' in navigator) {
        method = 'vibration-api';
    } else {
        method = 'noop';
    }

    return {
        supported: isSupported,
        platform,
        method,
        browser,
        reducedMotion,
    };
}
