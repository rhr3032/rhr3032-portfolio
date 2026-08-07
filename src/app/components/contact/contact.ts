import {
  Component,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  inject,
  signal,
} from '@angular/core';
import { AsyncPipe, isPlatformBrowser } from '@angular/common';
import { PortfolioService } from '../../services/portfolio.service';
import { ScrollRevealDirective } from '../../directives/scroll-reveal.directive';
import { MagneticDirective } from '../../directives/magnetic.directive';

@Component({
  selector: 'app-contact',
  imports: [AsyncPipe, ScrollRevealDirective, MagneticDirective],
  templateUrl: './contact.html',
  styleUrl: './contact.css',
})
export class Contact implements OnInit, OnDestroy {
  private static readonly CLOCK_UPDATE_INTERVAL_MS = 30_000;

  readonly portfolio$ = inject(PortfolioService).portfolio$;
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  readonly clock = signal('');
  private clockTimer: ReturnType<typeof setInterval> | null = null;

  readonly year = new Date().getFullYear();

  ngOnInit(): void {
    if (!this.isBrowser) return;
    this.tick();
    this.clockTimer = setInterval(() => this.tick(), Contact.CLOCK_UPDATE_INTERVAL_MS);
  }

  ngOnDestroy(): void {
    if (this.clockTimer) clearInterval(this.clockTimer);
  }

  private tick(): void {
    try {
      this.clock.set(
        new Date().toLocaleTimeString('en-GB', {
          hour: '2-digit',
          minute: '2-digit',
          timeZone: 'Asia/Dhaka',
        }),
      );
    } catch {
      this.clock.set('--:--');
    }
  }

  async downloadResume(event: Event): Promise<void> {
    event.preventDefault();
    if (!this.isBrowser) return;

    const path = '/resume-of-rafi.pdf';
    let previewWin: Window | null = null;
    try {
      previewWin = window.open('', '_blank');
      const resp = await fetch(path);
      if (!resp.ok) throw new Error('Network response was not ok');
      const blob = await resp.blob();
      const url = URL.createObjectURL(blob);
      if (previewWin) {
        previewWin.location.href = url;
      } else {
        window.open(url, '_blank');
      }
      const shouldDownload = confirm('Preview opened in a new tab. Download the PDF as well?');
      if (shouldDownload) {
        const a = document.createElement('a');
        a.href = url;
        a.download = 'resume-of-rafi.pdf';
        document.body.appendChild(a);
        a.click();
        a.remove();
      }
      if (previewWin) {
        setTimeout(() => URL.revokeObjectURL(url), 60000);
      } else {
        URL.revokeObjectURL(url);
      }
    } catch (err) {
      console.error('Resume preview failed, falling back to direct link', err);
      if (previewWin && !previewWin.closed) previewWin.close();
      window.location.href = path;
    }
  }
}
