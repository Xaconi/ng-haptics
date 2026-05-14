export function debugLog(enabled: boolean, message: string, payload?: unknown): void {
    if (!enabled) {
        return;
    }

    if (payload !== undefined) {
        console.log('[ng-haptics]', message, payload);
    } else {
        console.log('[ng-haptics]', message);
    }
}
