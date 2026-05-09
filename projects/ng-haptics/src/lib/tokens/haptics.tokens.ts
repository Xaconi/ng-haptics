import { InjectionToken } from '@angular/core';
import { HapticsAdapter } from '../adapters/haptics-adapter';
import { HapticsConfig } from '../types/haptics.types';

export const HAPTICS_CONFIG = new InjectionToken<HapticsConfig>('HAPTICS_CONFIG');
export const HAPTICS_ADAPTER = new InjectionToken<HapticsAdapter>('HAPTICS_ADAPTER');
