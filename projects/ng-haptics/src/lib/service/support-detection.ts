import { isPlatformBrowser } from '@angular/common';
import { HapticsSupport } from '../types/haptics.types';

export function detectHapticsSupport(
    platformId: object,
    reducedMotion: boolean,
    isSupported: boolean,
    method: HapticsSupport['method'],
): HapticsSupport {
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
    } else if (
        userAgent.includes('iphone') ||
        userAgent.includes('ipad') ||
        userAgent.includes('ipod') ||
        (userAgent.includes('macintosh') && userAgent.includes('mobile'))
    ) {
        platform = 'ios';
    } else if (userAgent.includes('mac') || userAgent.includes('windows') || userAgent.includes('linux')) {
        platform = 'desktop';
    }

    let browser: HapticsSupport['browser'] = 'unknown';
    if (userAgent.includes('edg')) {
        browser = 'edge';
    } else if (userAgent.includes('crios') || userAgent.includes('chrome')) {
        browser = 'chrome';
    } else if (userAgent.includes('fxios') || userAgent.includes('firefox')) {
        browser = 'firefox';
    } else if (userAgent.includes('safari')) {
        browser = 'safari';
    }

    return {
        supported: isSupported,
        platform,
        method,
        browser,
        reducedMotion,
    };
}
