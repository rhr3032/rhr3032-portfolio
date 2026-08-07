import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, shareReplay } from 'rxjs';
import { Portfolio } from '../models/portfolio.model';

@Injectable({ providedIn: 'root' })
export class PortfolioService {
  private readonly http = inject(HttpClient);

  /**
   * Fetches and caches portfolio data from the local JSON asset.
   * To load from your Gist instead, swap the URL to:
   * 'https://gist.githubusercontent.com/rhr3032'
   */
  readonly portfolio$: Observable<Portfolio> = this.http
    .get<Portfolio>('/assets/data/portfolio.json')
    .pipe(shareReplay(1));
}
