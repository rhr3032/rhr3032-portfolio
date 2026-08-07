import { inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export type Theme = 'dark' | 'light';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  readonly theme = signal<Theme>('dark');

  constructor() {
    if (!this.isBrowser) return;

    const saved = window.localStorage.getItem('theme');
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    this.apply(saved === 'light' || saved === 'dark' ? saved : systemDark ? 'dark' : 'light');
  }

  private apply(t: Theme): void {
    this.theme.set(t);
    if (this.isBrowser) {
      document.documentElement.setAttribute('data-theme', t);
      window.localStorage.setItem('theme', t);
    }
  }

  toggle(): void {
    this.apply(this.theme() === 'dark' ? 'light' : 'dark');
  }
}
