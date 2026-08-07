import {
  Directive,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  inject,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

/**
 * Adds an `is-revealed` class the first time the host element scrolls into view.
 * Pair with CSS to fade / translate / blur into place. Honors prefers-reduced-motion
 * by revealing immediately.
 */
@Directive({
  selector: '[appReveal]',
  standalone: true,
  host: { class: 'reveal' },
})
export class ScrollRevealDirective implements OnInit, OnDestroy {
  /** Optional stagger delay in ms applied via inline style. */
  @Input('appReveal') delay: number | string = 0;

  private readonly host = inject(ElementRef<HTMLElement>);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private observer?: IntersectionObserver;

  ngOnInit(): void {
    const el = this.host.nativeElement;
    if (this.delay) {
      el.style.setProperty('--reveal-delay', `${Number(this.delay)}ms`);
    }

    if (!this.isBrowser) {
      el.classList.add('is-revealed');
      return;
    }

    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduce || typeof IntersectionObserver === 'undefined') {
      el.classList.add('is-revealed');
      return;
    }

    this.observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            el.classList.add('is-revealed');
            this.observer?.disconnect();
            break;
          }
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    );
    this.observer.observe(el);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
