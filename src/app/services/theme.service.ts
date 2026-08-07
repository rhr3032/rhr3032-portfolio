import { inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export type Theme = 'dark' | 'light';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  readonly theme = signal<Theme>('dark');

  constructor() {
    if (!this.isBrowser) return;

    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    this.apply(systemDark ? 'dark' : 'light');

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      this.apply(e.matches ? 'dark' : 'light');
    });
  }

  private apply(t: Theme): void {
    this.theme.set(t);
    if (this.isBrowser) {
      document.documentElement.setAttribute('data-theme', t);
    }
  }
}
