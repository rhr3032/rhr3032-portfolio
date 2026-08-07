import {
  Component,
  HostListener,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  inject,
  signal,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

interface NavLink {
  label: string;
  href: string;
}

@Component({
  selector: 'app-nav',
  imports: [],
  templateUrl: './nav.html',
  styleUrl: './nav.css',
})
export class Nav implements OnInit, OnDestroy {
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  readonly links: NavLink[] = [
    { label: 'Index', href: '#hero' },
    { label: 'About', href: '#about' },
    { label: 'Work', href: '#experience' },
    { label: 'Projects', href: '#projects' },
    { label: 'Writing', href: '#blog' },
    { label: 'Contact', href: '#contact' },
  ];

  readonly scrolled = signal(false);
  readonly mobileOpen = signal(false);
  readonly activeSection = signal<string>('hero');

  #observer: IntersectionObserver | null = null;

  ngOnInit(): void {
    if (!this.isBrowser) return;
    this.#observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            this.activeSection.set(entry.target.id);
          }
        }
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 },
    );
    document
      .querySelectorAll('section[id]')
      .forEach((section) => this.#observer!.observe(section));
  }

  ngOnDestroy(): void {
    this.#observer?.disconnect();
  }

  @HostListener('window:scroll')
  onScroll(): void {
    if (!this.isBrowser) return;
    this.scrolled.set(window.scrollY > 24);
  }

  toggleMobile(): void {
    this.mobileOpen.update((v) => !v);
  }

  scrollTo(id: string, event: Event): void {
    event.preventDefault();
    this.mobileOpen.set(false);
    const el = this.isBrowser ? document.querySelector(id) : null;
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
