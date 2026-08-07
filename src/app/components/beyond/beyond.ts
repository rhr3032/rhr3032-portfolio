import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { PortfolioService } from '../../services/portfolio.service';
import { ScrollRevealDirective } from '../../directives/scroll-reveal.directive';

@Component({
  selector: 'app-beyond',
  imports: [AsyncPipe, ScrollRevealDirective],
  templateUrl: './beyond.html',
  styleUrl: './beyond.css',
})
export class Beyond {
  readonly portfolio$ = inject(PortfolioService).portfolio$;

  hashnodeUrl(url: string): string {
    return url || 'https://hashnode.com/';
  }
}
