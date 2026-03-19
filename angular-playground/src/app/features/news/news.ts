import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map, switchMap } from 'rxjs';
import { NewsService } from '../../services/news.service';

@Component({
  selector: 'app-news',
  imports: [CommonModule],
  templateUrl: './news.html',
  styleUrl: './news.css',
})
export class News {
  router = inject(Router);
  route = inject(ActivatedRoute);
  newsService = inject(NewsService);

  newsDetails$ = this.newsService.newDetailsObs$;

  ngOnInit() {
    this.route.paramMap
      .pipe(
        map((params) => Number(params.get('id'))),
        switchMap((id) => this.newsService.getSpecificNews(id)),
      )
      .subscribe();
  }

  handleQuantityChange(operation: 'increase' | 'decrease') {
    const current = this.newsService.currentNewsDetails;
    if (!current) return;
    const newQuantity = operation === 'increase' ? current.quantity + 1 : current.quantity - 1;
    this.newsService.changeQuantity(current.id, newQuantity)?.subscribe();
  }

  onClick() {
    this.router.navigate(['/'], { queryParams: { something: 2 } });
  }
}
