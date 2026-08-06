import { OmniAirEngine, AttachmentType } from '../../core/database/schema';

export interface RouteDecision {
  engine: OmniAirEngine;
  engineName: string;
  reason: string;
  iconName: string;
  badgeColor: string;
  recommendedSpeed: string;
  estimatedTime: string;
  protocol: string;
}

export function routeTransferEngine(
  text: string,
  attachmentType?: AttachmentType,
  fileSize?: number,
  isNearbyBroadcast?: boolean,
  isBatterySaver?: boolean
): RouteDecision {
  if (isNearbyBroadcast) {
    return {
      engine: 'omni_bluetooth',
      engineName: 'OmniBluetooth (BLE Mesh)',
      reason: 'Nearby P2P BLE mesh suited for silent group pings and offline messaging.',
      iconName: 'Bluetooth',
      badgeColor: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20',
      recommendedSpeed: '2.5 MB/s',
      estimatedTime: 'Instant',
      protocol: 'Bluetooth Low Energy 5.3',
    };
  }

  // Battery Saver mode overrides to low-power optical QR or BLE
  if (isBatterySaver && (!fileSize || fileSize < 10 * 1024 * 1024)) {
    return {
      engine: 'omni_beam',
      engineName: 'OmniBeam (Eco Optical)',
      reason: 'Battery Saver Active: Optical QR selected to conserve 85% Wi-Fi radio power.',
      iconName: 'QrCode',
      badgeColor: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
      recommendedSpeed: '1.2 MB/s (Low Power)',
      estimatedTime: '< 3 seconds',
      protocol: 'Eco-QR Frame Stream',
    };
  }

  // Large file check (> 500 KB or video/archive)
  if (
    (fileSize && fileSize > 500 * 1024) ||
    attachmentType === 'gallery' ||
    (attachmentType === 'document' && fileSize && fileSize > 500 * 1024)
  ) {
    const sizeMb = fileSize ? fileSize / (1024 * 1024) : 50;
    const estimatedSeconds = Math.max(1, Math.round(sizeMb / 45));

    return {
      engine: 'omni_direct',
      engineName: 'OmniDirect (Wi-Fi Direct P2P)',
      reason: 'High-speed WebRTC / Android Wi-Fi Direct chosen for high throughput media.',
      iconName: 'Wifi',
      badgeColor: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
      recommendedSpeed: '120.5 MB/s',
      estimatedTime: `${estimatedSeconds} sec`,
      protocol: 'WebRTC DataChannel / Wi-Fi P2P',
    };
  }

  // Default QR Animated Beam for Text, Passwords, Contacts, Cards, Timetables, Small Files
  return {
    engine: 'omni_beam',
    engineName: 'OmniBeam (High Density QR)',
    reason: 'Zero-network optical QR stream selected for instant offline transfer.',
    iconName: 'QrCode',
    badgeColor: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
    recommendedSpeed: '5.8 MB/s',
    estimatedTime: '< 1 sec',
    protocol: 'OmniBeam Optical Stream v2.4',
  };
}

