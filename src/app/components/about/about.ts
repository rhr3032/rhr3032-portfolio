import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { PortfolioService } from '../../services/portfolio.service';
import { ScrollRevealDirective } from '../../directives/scroll-reveal.directive';

interface Stat {
  value: string;
  label: string;
}

@Component({
  selector: 'app-about',
  imports: [AsyncPipe, ScrollRevealDirective],
  templateUrl: './about.html',
  styleUrl: './about.css',
})
export class About {
  readonly portfolio$ = inject(PortfolioService).portfolio$;

  readonly stats: Stat[] = [
    { value: '5+',  label: 'Years of Experience' },
    { value: '360+', label: 'Projects in flight' },
    { value: '95%',   label: 'Client satisfaction rate' },
    { value: '∞',   label: 'Cups of coffee' },
  ];

  initials(full: string): string {
    return full
      .trim()
      .split(/\s+/)
      .map((p) => p[0])
      .filter(Boolean)
      .slice(0, 2)
      .join('')
      .toUpperCase();
  }

  firstName(full: string): string {
    return full.trim().split(/\s+/)[0] ?? full;
  }
}
