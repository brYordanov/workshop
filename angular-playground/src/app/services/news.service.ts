import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, catchError, tap, throwError } from 'rxjs';

export interface News {
  id: number;
  name: string;
  description: string;
  createdAt: Date;
  createdBy: string;
  quantity: number;
}

@Injectable({ providedIn: 'root' })
export class NewsService {
  private http = inject(HttpClient);
  private newsDetails$ = new BehaviorSubject<News | null>(null);
  newDetailsObs$ = this.newsDetails$.asObservable();

  get currentNewsDetails() {
    return this.newsDetails$.getValue();
  }

  getNews(page: number) {
    return this.http.get<News[]>(`?page=${page}`);
  }

  getSpecificNews(id: number) {
    return this.http.get<News>(`${id}`).pipe(tap((news) => this.newsDetails$.next(news)));
  }

  changeQuantity(id: number, quantity: number) {
    const current = this.newsDetails$.getValue();
    if (!current) return;

    this.newsDetails$.next({ ...current, quantity });

    return this.http.patch(`${id}`, { quantity }).pipe(
      catchError((err) => {
        this.newsDetails$.next(current);
        return throwError(() => err);
      }),
    );
  }
}
