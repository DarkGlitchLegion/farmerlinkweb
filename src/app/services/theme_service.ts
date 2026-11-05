import { Injectable, signal, effect } from '@angular/core';

export type ThemeMode = 'light' | 'dark' | 'system';
export type EffectiveTheme = 'light' | 'dark';

const STORAGE_KEY = 'farmerlink_theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private mediaQuery?: MediaQueryList;
  private mediaListener?: (e: MediaQueryListEvent) => void;

  readonly mode = signal<ThemeMode>(this.getInitialMode());
  readonly effectiveTheme = signal<EffectiveTheme>(this.computeEffectiveTheme(this.mode()));
  readonly isDark = signal<boolean>(this.effectiveTheme() === 'dark');

  constructor() {
    this.initMediaQueryListener();
    this.applyTheme(this.effectiveTheme());

    // Reactive effect to update theme when mode changes
    effect(() => {
      const currentMode = this.mode();
      const effective = this.computeEffectiveTheme(currentMode);
      this.effectiveTheme.set(effective);
      this.isDark.set(effective === 'dark');
      this.applyTheme(effective);
    });
  }

  setTheme(newMode: ThemeMode): void {
    this.mode.set(newMode);
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, newMode);
      } catch {
        /* localStorage might be disabled */
      }
    }
  }

  toggleTheme(): void {
    const current = this.mode();
    if (current === 'light') this.setTheme('dark');
    else if (current === 'dark') this.setTheme('system');
    else this.setTheme('light');
  }

  private getInitialMode(): ThemeMode {
    if (typeof localStorage !== 'undefined') {
      try {
        const stored = localStorage.getItem(STORAGE_KEY) as ThemeMode | null;
        if (stored === 'light' || stored === 'dark' || stored === 'system') {
          return stored;
        }
      } catch {
        /* fallback to system */
      }
    }
    return 'system';
  }

  private computeEffectiveTheme(mode: ThemeMode): EffectiveTheme {
    if (mode === 'light') return 'light';
    if (mode === 'dark') return 'dark';
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  }

  private initMediaQueryListener(): void {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    this.mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    this.mediaListener = (e: MediaQueryListEvent) => {
      if (this.mode() === 'system') {
        const effective: EffectiveTheme = e.matches ? 'dark' : 'light';
        this.effectiveTheme.set(effective);
        this.isDark.set(effective === 'dark');
        this.applyTheme(effective);
      }
    };
    if (this.mediaQuery.addEventListener) {
      this.mediaQuery.addEventListener('change', this.mediaListener);
    } else {
      (this.mediaQuery as any).addListener(this.mediaListener);
    }
  }

  private applyTheme(theme: EffectiveTheme): void {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    root.setAttribute('data-theme', theme);
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }
}

