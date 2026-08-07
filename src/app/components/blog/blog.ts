import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { PortfolioService } from '../../services/portfolio.service';
import { ScrollRevealDirective } from '../../directives/scroll-reveal.directive';

@Component({
  selector: 'app-blog',
  imports: [AsyncPipe, ScrollRevealDirective],
  templateUrl: './blog.html',
  styleUrl: './blog.css',
})
export class Blog {
  readonly portfolio$ = inject(PortfolioService).portfolio$;

  formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }
}
