import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { PortfolioService } from '../../services/portfolio.service';
import { ScrollRevealDirective } from '../../directives/scroll-reveal.directive';

@Component({
  selector: 'app-education',
  imports: [AsyncPipe, ScrollRevealDirective],
  templateUrl: './education.html',
  styleUrl: './education.css',
})
export class Education {
  readonly portfolio$ = inject(PortfolioService).portfolio$;

  formatYear(iso: string): string {
    return new Date(iso).getFullYear().toString();
  }
}
