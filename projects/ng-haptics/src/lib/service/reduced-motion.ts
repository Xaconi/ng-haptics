import { DestroyRef } from '@angular/core';

export interface ReducedMotionTracker {
    value: boolean;
}

export function createReducedMotionTracker(destroyRef: DestroyRef, respectReducedMotion: boolean): ReducedMotionTracker {
    const tracker: ReducedMotionTracker = { value: false };

    if (!respectReducedMotion || typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
        return tracker;
    }

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    tracker.value = mediaQuery.matches;

    const listener = (event: MediaQueryListEvent) => {
        tracker.value = event.matches;
    };

    if ('addEventListener' in mediaQuery) {
        mediaQuery.addEventListener('change', listener);
    } else if ('addListener' in mediaQuery) {
        (mediaQuery as any).addListener(listener);
    }

    destroyRef.onDestroy(() => {
        if ('removeEventListener' in mediaQuery) {
            mediaQuery.removeEventListener('change', listener);
        } else if ('removeListener' in mediaQuery) {
            (mediaQuery as any).removeListener(listener);
        }
    });

    return tracker;
}
