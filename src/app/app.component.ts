import { Component } from '@angular/core';
import { Meta, Stock } from './types/stock.types';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  metas : Meta[] = [];
  stock : Stock = {} as Stock;
}
