/**
 |--------------------------------------------------------------------------
 | GuideNer Desktop & Cross-Platform Engine
 | Provides Native Desktop OS integration: Fullscreen API, Web Notifications,
 | Keyboard Shortcuts Dispatcher, Context Menu State, and Drag & Drop Helpers.
 | Supported on Windows (Chrome/Edge), macOS (Safari/Chrome), and Linux Firefox/Chrome.
 |--------------------------------------------------------------------------
 */

export interface ShortcutItem {
  keyCombo: string;
  description: string;
  category: 'Navigation' | 'Actions' | 'View';
}

class DesktopManager {
  private isFullscreen: boolean = false;
  private notificationPermission: NotificationPermission =
    typeof Notification !== 'undefined' ? Notification.permission : 'default';

  constructor() {
    if (typeof document !== 'undefined') {
      document.addEventListener('fullscreenchange', () => {
        this.isFullscreen = !!document.fullscreenElement;
      });
    }
  }

  /**
   * Toggles native browser fullscreen mode
   */
  public async toggleFullscreen(): Promise<boolean> {
    if (typeof document === 'undefined') return false;

    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
        this.isFullscreen = true;
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        }
        this.isFullscreen = false;
      }
    } catch (err) {
      console.warn('Fullscreen request declined or unsupported:', err);
    }
    return this.isFullscreen;
  }

  /**
   * Requests OS Native Desktop Notification permission
   */
  public async requestNotificationPermission(): Promise<boolean> {
    if (typeof Notification === 'undefined') return false;

    try {
      const res = await Notification.requestPermission();
      this.notificationPermission = res;
      return res === 'granted';
    } catch {
      return false;
    }
  }

  /**
   * Triggers a native OS desktop notification
   */
  public sendDesktopNotification(title: string, options?: NotificationOptions) {
    if (
      typeof Notification !== 'undefined' &&
      Notification.permission === 'granted'
    ) {
      try {
        new Notification(title, {
          icon: '/assets/icon.png',
          badge: '/assets/icon.png',
          ...options,
        });
      } catch (e) {
        console.warn('Desktop notification dispatch failed:', e);
      }
    }
  }

  /**
   * Returns list of default GuideNer Desktop Keyboard Shortcuts
   */
  public getShortcutsList(): ShortcutItem[] {
    return [
      { keyCombo: 'Ctrl + K / ⌘K', description: 'Open Universal Command Palette', category: 'Navigation' },
      { keyCombo: 'Ctrl + 1..9', description: 'Switch between Workspaces', category: 'Navigation' },
      { keyCombo: 'Ctrl + B / ⌘B', description: 'Toggle Desktop Sidebar Collapse', category: 'View' },
      { keyCombo: 'F11 / ⌘Shift+F', description: 'Toggle Native Fullscreen Mode', category: 'View' },
      { keyCombo: 'Ctrl + N', description: 'Create Quick Utility Note', category: 'Actions' },
      { keyCombo: 'Ctrl + Shift + S', description: 'Force Cloud Delta Sync', category: 'Actions' },
      { keyCombo: 'Esc', description: 'Close Modals & Context Menu', category: 'View' },
      { keyCombo: '?', description: 'Show Desktop Shortcuts Overlay', category: 'Navigation' },
    ];
  }
}

export const desktopManager = new DesktopManager();
