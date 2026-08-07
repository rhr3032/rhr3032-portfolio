import {
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  ViewChild,
  computed,
  inject,
  signal,
} from '@angular/core';
import { AsyncPipe, isPlatformBrowser } from '@angular/common';
import { Subscription } from 'rxjs';
import { PortfolioService } from '../../services/portfolio.service';
import { Project } from '../../models/portfolio.model';

/** Minimum pointer travel (px) that should disqualify a card click at drag-end. */
const DRAG_CLICK_THRESHOLD_PX = 6;

@Component({
  selector: 'app-projects',
  imports: [AsyncPipe],
  templateUrl: './projects.html',
  styleUrl: './projects.css',
})
export class Projects implements OnInit, OnDestroy {
  private readonly svc = inject(PortfolioService);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  readonly portfolio$ = this.svc.portfolio$;

  @ViewChild('rail') railRef?: ElementRef<HTMLElement>;

  readonly activeIndex = signal(0);
  readonly featuredCount = signal(0);
  readonly counter = computed(() => {
    const total = this.featuredCount();
    if (!total) return '00 / 00';
    return `${pad(this.activeIndex() + 1)} / ${pad(total)}`;
  });

  // Drag-to-scroll state
  private isDragging = false;
  private dragStartX = 0;
  private scrollStart = 0;
  private dragMoved = 0;
  private sub?: Subscription;

  ngOnInit(): void {
    this.sub = this.portfolio$.subscribe((data) => {
      const featured = (data.projects ?? []).filter((p) => p.featured).length;
      this.featuredCount.set(featured);
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
    if (!this.isBrowser) return;
    document.removeEventListener('pointermove', this.onPointerMove);
    document.removeEventListener('pointerup', this.onPointerUp);
  }

  onRailScroll(event: Event): void {
    const el = event.target as HTMLElement;
    const cardWidth = el.scrollWidth / Math.max(this.featuredCount(), 1);
    const idx = Math.round(el.scrollLeft / cardWidth);
    if (idx !== this.activeIndex()) {
      this.activeIndex.set(Math.max(0, Math.min(this.featuredCount() - 1, idx)));
    }
  }

  scrollByCard(direction: -1 | 1): void {
    const rail = this.railRef?.nativeElement;
    if (!rail) return;
    const cardWidth = rail.scrollWidth / Math.max(this.featuredCount(), 1);
    rail.scrollBy({ left: direction * cardWidth, behavior: 'smooth' });
  }

  // ── Drag-to-scroll (desktop) ────────────────────────────────
  onPointerDown(event: PointerEvent): void {
    const rail = this.railRef?.nativeElement;
    const target = event.target as HTMLElement | null;
    if (
      !rail ||
      event.pointerType === 'touch' ||
      target?.closest('a, button, input, textarea, select, label')
    ) {
      return;
    }
    this.isDragging = true;
    this.dragStartX = event.clientX;
    this.scrollStart = rail.scrollLeft;
    this.dragMoved = 0;
    rail.classList.add('is-dragging');
    document.addEventListener('pointermove', this.onPointerMove);
    document.addEventListener('pointerup', this.onPointerUp);
  }

  private onPointerMove = (event: PointerEvent): void => {
    if (!this.isDragging || !this.railRef) return;
    const dx = event.clientX - this.dragStartX;
    this.dragMoved = Math.max(this.dragMoved, Math.abs(dx));
    this.railRef.nativeElement.scrollLeft = this.scrollStart - dx;
  };

  private onPointerUp = (): void => {
    if (!this.isDragging) return;
    this.isDragging = false;
    this.railRef?.nativeElement.classList.remove('is-dragging');
    document.removeEventListener('pointermove', this.onPointerMove);
    document.removeEventListener('pointerup', this.onPointerUp);
  };

  /** Suppress link clicks at the end of a drag */
  onCardClick(event: MouseEvent): void {
    if (this.dragMoved > DRAG_CLICK_THRESHOLD_PX) {
      event.preventDefault();
      event.stopPropagation();
    }
  }

  @HostListener('window:keydown', ['$event'])
  onKey(event: KeyboardEvent): void {
    if (!this.railRef) return;
    if (document.activeElement && this.railRef.nativeElement.contains(document.activeElement)) {
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        this.scrollByCard(1);
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault();
        this.scrollByCard(-1);
      }
    }
  }

  hasNonFeatured(projects: Project[] | undefined): boolean {
    return (projects ?? []).some((p) => !p.featured);
  }

  nonFeaturedCount(projects: Project[] | undefined): number {
    return (projects ?? []).filter((p) => !p.featured).length;
  }
}

function pad(n: number): string {
  return n.toString().padStart(2, '0');
}
