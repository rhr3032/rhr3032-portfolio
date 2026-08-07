import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { PortfolioService } from '../../services/portfolio.service';
import { SkillLevel } from '../../models/portfolio.model';
import { ScrollRevealDirective } from '../../directives/scroll-reveal.directive';

@Component({
  selector: 'app-skills',
  imports: [AsyncPipe, ScrollRevealDirective],
  templateUrl: './skills.html',
  styleUrl: './skills.css',
})
export class Skills {
  readonly portfolio$ = inject(PortfolioService).portfolio$;

  levelLabel(level: SkillLevel): string {
    switch (level) {
      case 'expert':     return 'Expert';
      case 'proficient': return 'Proficient';
      default:           return 'Familiar';
    }
  }
}
