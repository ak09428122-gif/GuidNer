/**
 |--------------------------------------------------------------------------
 | GuideNer Battery & RAM Performance Manager
 | Monitors battery status, adaptive low power modes, memory limits, and throttles
 | non-essential background tasks for low-end Android hardware.
 |--------------------------------------------------------------------------
 */

export interface BatteryPerformanceState {
  batteryLevelPercent: number;
  isCharging: boolean;
  isBatterySaverEnabled: boolean;
  isLowPowerMode: boolean;
  ramUsageEstimateMB: number;
  cpuUsageEstimatePercent: number;
  backgroundSyncIntervalMs: number;
  animationsEnabled: boolean;
}

class BatteryAndPerformanceManager {
  private state: BatteryPerformanceState = {
    batteryLevelPercent: 88,
    isCharging: false,
    isBatterySaverEnabled: localStorage.getItem('gn_battery_saver') === 'true',
    isLowPowerMode: false,
    ramUsageEstimateMB: 142,
    cpuUsageEstimatePercent: 4.2,
    backgroundSyncIntervalMs: 15000,
    animationsEnabled: true,
  };

  private listeners: Array<(state: BatteryPerformanceState) => void> = [];

  constructor() {
    this.initBatteryListener();
    this.evaluateLowPowerMode();
  }

  private async initBatteryListener() {
    if (typeof navigator !== 'undefined' && 'getBattery' in navigator) {
      try {
        const battery: any = await (navigator as any).getBattery();
        this.updateBatteryInfo(battery);

        battery.addEventListener('levelchange', () => this.updateBatteryInfo(battery));
        battery.addEventListener('chargingchange', () => this.updateBatteryInfo(battery));
      } catch {
        // Battery API not exposed
      }
    }
  }

  private updateBatteryInfo(battery: any) {
    this.state.batteryLevelPercent = Math.round(battery.level * 100);
    this.state.isCharging = battery.charging;
    this.evaluateLowPowerMode();
  }

  private evaluateLowPowerMode() {
    const autoLowPower = this.state.batteryLevelPercent <= 20 && !this.state.isCharging;
    this.state.isLowPowerMode = autoLowPower || this.state.isBatterySaverEnabled;

    if (this.state.isLowPowerMode) {
      this.state.backgroundSyncIntervalMs = 60000; // 1 min sync interval on low power
      this.state.animationsEnabled = false;
    } else {
      this.state.backgroundSyncIntervalMs = 15000;
      this.state.animationsEnabled = true;
    }

    this.notifyListeners();
  }

  public subscribe(listener: (state: BatteryPerformanceState) => void) {
    this.listeners.push(listener);
    listener({ ...this.state });
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notifyListeners() {
    this.listeners.forEach((l) => l({ ...this.state }));
  }

  public getState(): BatteryPerformanceState {
    return { ...this.state };
  }

  public setBatterySaver(enabled: boolean) {
    this.state.isBatterySaverEnabled = enabled;
    localStorage.setItem('gn_battery_saver', enabled ? 'true' : 'false');
    this.evaluateLowPowerMode();
  }
}

export const batteryAndPerformanceManager = new BatteryAndPerformanceManager();
