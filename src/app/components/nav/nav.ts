import {
  AfterViewInit,
  Component,
  HostListener,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  inject,
  signal,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ThemeService } from '../../services/theme.service';

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
export class Nav implements OnInit, AfterViewInit, OnDestroy {
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  readonly themeService = inject(ThemeService);

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

  #mutationObserver: MutationObserver | null = null;

  ngOnInit(): void {
    this.syncViewportState();
  }

  ngAfterViewInit(): void {
    if (!this.isBrowser) return;

    this.#mutationObserver = new MutationObserver(() => this.syncActiveSection());
    this.#mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['id'],
    });

    requestAnimationFrame(() => this.syncViewportState());
  }

  ngOnDestroy(): void {
    this.#mutationObserver?.disconnect();
  }

  @HostListener('window:scroll')
  onScroll(): void {
    this.syncViewportState();
  }

  @HostListener('window:resize')
  onResize(): void {
    this.syncActiveSection();
  }

  toggleMobile(): void {
    this.mobileOpen.update((v) => !v);
  }

  toggleTheme(): void {
    this.themeService.toggle();
  }

  closeMobile(): void {
    this.mobileOpen.set(false);
  }

  private syncViewportState(): void {
    if (!this.isBrowser) return;

    this.scrolled.set(window.scrollY > 24);
    this.syncActiveSection();
  }

  private syncActiveSection(): void {
    if (!this.isBrowser) return;

    const sections = Array.from(document.querySelectorAll<HTMLElement>('section[id]'));
    if (sections.length === 0) return;

    const activationPoint = window.innerHeight * 0.4;
    let nextSection = sections[0].id;

    for (const section of sections) {
      const rect = section.getBoundingClientRect();
      if (rect.top <= activationPoint) {
        nextSection = section.id;
      } else {
        break;
      }
    }

    if (nextSection !== this.activeSection()) {
      this.activeSection.set(nextSection);
    }
  }
}
