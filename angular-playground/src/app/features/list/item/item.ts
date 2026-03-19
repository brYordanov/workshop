import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { News } from '../../../services/news.service';

@Component({
  selector: 'app-item',
  imports: [RouterLink],
  templateUrl: './item.html',
  styleUrl: './item.css',
})
export class Item {
  @Input({ required: true }) item!: News;
}
