import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { BehaviorSubject, switchMap } from 'rxjs';
import { NewsService } from '../../services/news.service';
import { Item } from './item/item';

@Component({
  selector: 'app-list',
  imports: [CommonModule, Item],
  templateUrl: './list.html',
  styleUrl: './list.css',
})
export class List {
  private newsService = inject(NewsService);
  page$ = new BehaviorSubject(1);
  items$ = this.page$.pipe(switchMap((page) => this.newsService.getNews(page)));

  nextPage() {
    if (this.page$.value === 20) return;
    this.page$.next(this.page$.value + 1);
  }

  prevPage() {
    if (this.page$.value === 1) return;
    this.page$.next(this.page$.value - 1);
  }
}
