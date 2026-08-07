import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { PortfolioService } from '../../services/portfolio.service';
import { Experience as ExperienceModel } from '../../models/portfolio.model';
import { ScrollRevealDirective } from '../../directives/scroll-reveal.directive';

@Component({
  selector: 'app-experience',
  imports: [AsyncPipe, ScrollRevealDirective],
  templateUrl: './experience.html',
  styleUrl: './experience.css',
})
export class Experience {
  readonly portfolio$ = inject(PortfolioService).portfolio$;

  formatYear(iso: string): string {
    return new Date(iso).getFullYear().toString();
  }

  formatRange(start: string, end: string | null): string {
    const s = new Date(start).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    const e = end
      ? new Date(end).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
      : 'Present';
    return `${s} → ${e}`;
  }

  duration(start: string, end: string | null): string {
    const from = new Date(start);
    const to = end ? new Date(end) : new Date();
    const months =
      (to.getFullYear() - from.getFullYear()) * 12 + (to.getMonth() - from.getMonth());
    const years = Math.floor(months / 12);
    const remaining = months % 12;
    const parts: string[] = [];
    if (years > 0) parts.push(`${years}y`);
    if (remaining > 0) parts.push(`${remaining}m`);
    return parts.join(' ') || '< 1m';
  }

  isCurrentRole(exp: ExperienceModel): boolean {
    return exp.endDate === null;
  }
}
