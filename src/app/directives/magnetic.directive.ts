import {
  Directive,
  ElementRef,
  HostListener,
  Input,
  OnInit,
  PLATFORM_ID,
  inject,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

/**
 * Magnetic hover effect — translates the host toward the cursor as it nears.
 * Disabled on touch devices and when the user prefers reduced motion.
 */
@Directive({
  selector: '[appMagnetic]',
  standalone: true,
})
export class MagneticDirective implements OnInit {
  /** Maximum pixel offset applied to the element. */
  @Input('appMagnetic') strength: number | string = 14;

  private readonly host = inject(ElementRef<HTMLElement>);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private enabled = false;

  ngOnInit(): void {
    if (!this.isBrowser) return;
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    const touch = window.matchMedia?.('(hover: none)').matches;
    this.enabled = !reduce && !touch;
    if (this.enabled) {
      this.host.nativeElement.style.transition =
        'transform 0.35s cubic-bezier(0.22, 1, 0.36, 1)';
      this.host.nativeElement.style.willChange = 'transform';
    }
  }

  @HostListener('mousemove', ['$event'])
  onMove(event: MouseEvent): void {
    if (!this.enabled) return;
    const el = this.host.nativeElement;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const max = Number(this.strength);
    const dx = ((event.clientX - cx) / (rect.width / 2)) * max;
    const dy = ((event.clientY - cy) / (rect.height / 2)) * max;
    el.style.transform = `translate(${dx.toFixed(1)}px, ${dy.toFixed(1)}px)`;
  }

  @HostListener('mouseleave')
  onLeave(): void {
    if (!this.enabled) return;
    this.host.nativeElement.style.transform = 'translate(0, 0)';
  }
}
