import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { AnalysisGraphComponent } from 'src/app/forms/analysis-graph/analysis-graph.component';
import { DecisionModel } from 'src/app/types/predict.types';
import { SuccessResponse, RejectResponse, ErrorResponse } from 'src/app/types/response.types';
import { Meta, Stock } from 'src/app/types/stock.types';
import { Db } from '../../services/database.service';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-stocks-view',
  templateUrl: './stocks-view.component.html',
  styleUrls: ['./stocks-view.component.css']
})
export class StocksViewComponent implements OnInit, AfterViewInit {

  longload: boolean = false;
  loading: boolean = false;

  name : string = '';
  symbol : string = '';
  exchange : string = '';
  type : string = '';
  ipo : string = '';
  
  metas : { meta : Meta }[] = [];
  dataSource! : MatTableDataSource<{ meta : Meta }>;
  stock : Stock | undefined;
  model : DecisionModel | undefined;

  @ViewChild(MatPaginator) paginator! : MatPaginator;

  displayedColumns = ['name', 'symbol', 'exchange', 'type', 'ipo'];
  displayedColumnFilters = ['name-filter', 'symbol-filter', 'exchange-filter', 'type-filter', 'ipo-filter'];

  constructor(private dialog : MatDialog) {}
  
  async ngOnInit() {
  }
  
  async ngAfterViewInit() {
    await this.loadMetas();
    this.dataSource = new MatTableDataSource<{ meta : Meta }>(this.metas);
    this.dataSource.paginator = this.paginator;
  }

  async loadMetas() {
    this.loading = true;
    let r : any = await Db.getStockMetas().then(res => { return new SuccessResponse(res); }, rej => { console.error(rej); return new RejectResponse(rej); }).catch(err => { console.error(err); return new ErrorResponse(err); });;
    this.loading = false;
    if(r?.error) {}
    else {
      this.metas = (r as SuccessResponse).data;
    }
    console.log(this.metas);
  }

  analysisDialog(meta : Meta) {
    this.dialog.open(AnalysisGraphComponent, { data : meta, height: '90%', width: '95%' });
  }

  filterchanged(event : Event, column : string) {
    const { target } = event;
    let s = (target as HTMLInputElement).value;
    if(!s) s = '';
    let c = column;
    if(c == 'name') this.name = s;
    else if(c == 'symbol') this.symbol = s;
    else if(c == 'exchange') this.exchange = s;
    else if(c == 'type') this.type = s;
    else if(c == 'ipo') this.ipo = s;

    let ms : { meta : Meta }[] = this.metas;
    
    if(this.name != '') {
      for(let i = 0; i < ms.length; i++) {
        if(!ms[i].meta.name.toLowerCase().includes(this.name.toLowerCase())) {
          ms.splice(i, 1);
          i--;
        }
      }
    }
    if(this.symbol != '') {
      for(let i = 0; i < ms.length; i++) {
        if(!ms[i].meta.symbol.toLowerCase().includes(this.symbol.toLowerCase())) {
          ms.splice(i, 1);
          i--;
        }
      }
    }
    if(this.exchange != '') {
      for(let i = 0; i < ms.length; i++) {
        if(!ms[i].meta.exchange.toLowerCase().includes(this.exchange.toLowerCase())) {
          ms.splice(i, 1);
          i--;
        }
      }
    }
    if(this.type != '') {
      for(let i = 0; i < ms.length; i++) {
        if(!ms[i].meta.type.toLowerCase().includes(this.type.toLowerCase())) {
          ms.splice(i, 1);
          i--;
        }
      }
    }
    if(this.ipo != '') {
      for(let i = 0; i < ms.length; i++) {
        if(!ms[i].meta.ipo.toISOString().toLowerCase().includes(this.ipo.toLowerCase())) {
          ms.splice(i, 1);
          i--;
        }
      }
    }
    this.dataSource = new MatTableDataSource<{ meta : Meta }>(ms);
  }

}
