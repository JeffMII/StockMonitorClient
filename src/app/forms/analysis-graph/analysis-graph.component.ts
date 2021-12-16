import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { JSONstoCSVs } from 'src/app/helpers/data.helper';
import { Db } from 'src/app/services/database.service';
import { DecisionModel } from 'src/app/types/predict.types';
import { SuccessResponse, RejectResponse, ErrorResponse } from 'src/app/types/response.types';
import { Analysis, Day, Meta, Month, Stock, Week } from 'src/app/types/stock.types';
import { ChartConfiguration, ChartEvent, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-analysis-graph',
  templateUrl: './analysis-graph.component.html',
  styleUrls: ['./analysis-graph.component.css']
})
export class AnalysisGraphComponent implements OnInit {

  dayStats : boolean = false;
  weekStats : boolean = false;
  monthStats : boolean = false;

  dayAnalysis : boolean = false;
  weekAnalysis : boolean = false;
  monthAnalysis : boolean = false;

  dayStatsOptions : any;
  weekStatsOptions : any;
  monthStatsOptions : any;

  dayAnalysisOptions : any;
  weekAnalysisOptions : any;
  monthAnalysisOptions : any;

  loading : boolean = false;

  days : Day[] = [];
  weeks : Week[] = [];
  months : Month[] = [];

  model : DecisionModel | undefined;

  public lineChartType: ChartType = 'line';

  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  constructor(@Inject(MAT_DIALOG_DATA) public meta : Meta) { }

  ngOnInit(): void {
  }

  async loadDays() {
    this.loading = true;
    let r : any = await Db.getDays(this.meta.symbol).then(res => { return new SuccessResponse(res); }, rej => { console.error(rej); return new RejectResponse(rej); }).catch(err => { console.error(err); return new ErrorResponse(err); });
    this.loading = false;
    if(r?.error) {}
    else {
      this.days = (r as SuccessResponse).data.days;
    }
  }

  async loadWeeks() {
    this.loading = true;
    let r : any = await Db.getWeeks(this.meta.symbol).then(res => { return new SuccessResponse(res); }, rej => { console.error(rej); return new RejectResponse(rej); }).catch(err => { console.error(err); return new ErrorResponse(err); });
    this.loading = false;
    if(r?.error) {}
    else {
      this.weeks = (r as SuccessResponse).data.weeks;
    }
  }

  async loadMonths() {
    this.loading = true;
    let r : any = await Db.getMonths(this.meta.symbol).then(res => { return new SuccessResponse(res); }, rej => { console.error(rej); return new RejectResponse(rej); }).catch(err => { console.error(err); return new ErrorResponse(err); });
    this.loading = false;
    if(r?.error) {}
    else {
      this.months = (r as SuccessResponse).data.months;
    }
  }

  async loadModel(symbol : string) {
    this.loading = true;
    let r : any = await Db.getModel(symbol).then(res => { return new SuccessResponse(res); }, rej => { console.error(rej); return new RejectResponse(rej); }).catch(err => { console.error(err); return new ErrorResponse(err); });;
    this.loading = false;
    if(r?.error) {}
    else {
      this.model = (r as SuccessResponse).data.model;
    }
  }

  chartDayStats() {
    this.dayStats = true;
    this.weekStats = false;
    this.monthStats = false;

    this.dayAnalysis = false;
    this.weekAnalysis = false;
    this.monthAnalysis = false;

    if(!this.dayStatsOptions) {

      let csv = JSONstoCSVs([this.days])[0];
      let options = { grid3D: {}, tooltip: {}, xAxis3D: {
          type: 'category',
        }, yAxis3D: {
          type: 'category',
        }, zAxis3D: {}, visualMap: {
          max: 1e8,
          dimension: 'adjusted',
        }, dataset: {
          dimensions: [
            'adjusted',
            "dividend",
            "open",
            "high",
            "low",
            "close",
            "volume",
            { name: 'stats', type: 'ordinal' },
          ], source: csv,
        },
        series: [
          {
            type: 'bar3D',
            // symbolSize: symbolSize,
            shading: 'lambert',
            encode: {
              x: 'timestamp',
              y: 'volume',
              z: 'adjusted',
              tooltip: [0, 1, 2, 3, 4],
            },
          },
        ]}
      this.dayStatsOptions = options;
    }
  }

  chartWeekStats() {
    this.dayStats = false;
    this.weekStats = true;
    this.monthStats = false;

    this.dayAnalysis = false;
    this.weekAnalysis = false;
    this.monthAnalysis = false;
    
    if(!this.weekStatsOptions) {

      let csv = JSONstoCSVs([this.weeks])[0];
      let options = { grid3D: {}, tooltip: {}, xAxis3D: {
          type: 'category',
        }, yAxis3D: {
          type: 'category',
        }, zAxis3D: {}, visualMap: {
          max: 1e8,
          dimension: 'adjusted',
        }, dataset: {
          dimensions: [
            'adjusted',
            "dividend",
            "open",
            "high",
            "low",
            "close",
            "volume",
            { name: 'stats', type: 'ordinal' },
          ], source: csv,
        },
        series: [
          {
            type: 'bar3D',
            // symbolSize: symbolSize,
            shading: 'lambert',
            encode: {
              x: 'timestamp',
              y: 'volume',
              z: 'adjusted',
              tooltip: [0, 1, 2, 3, 4],
            },
          },
        ]}
      this.weekStatsOptions = options;
    }
  }

  chartMonthStats() {
    this.dayStats = false;
    this.weekStats = false;
    this.monthStats = true;

    this.dayAnalysis = false;
    this.weekAnalysis = false;
    this.monthAnalysis = false;
    
    if(!this.monthStatsOptions) {

      let csv = JSONstoCSVs([this.months])[0];
      let options = { grid3D: {}, tooltip: {}, xAxis3D: {
          type: 'category',
        }, yAxis3D: {
          type: 'category',
        }, zAxis3D: {}, visualMap: {
          max: 1e8,
          dimension: 'adjusted',
        }, dataset: {
          dimensions: [
            'adjusted',
            "dividend",
            "open",
            "high",
            "low",
            "close",
            "volume",
            { name: 'stats', type: 'ordinal' },
          ], source: csv,
        },
        series: [
          {
            type: 'bar3D',
            // symbolSize: symbolSize,
            shading: 'lambert',
            encode: {
              x: 'timestamp',
              y: 'volume',
              z: 'adjusted',
              tooltip: [0, 1, 2, 3, 4],
            },
          },
        ]}
      this.monthStatsOptions = options;
    }
  }

  chartDayAnalaysis() {
    this.dayStats = false;
    this.weekStats = false;
    this.monthStats = false;

    this.dayAnalysis = true;
    this.weekAnalysis = false;
    this.monthAnalysis = false;

    if(!this.dayAnalysisOptions) {

      let csv = JSONstoCSVs([this.days])[0];
      let options = { grid3D: {}, tooltip: {}, xAxis3D: {
          type: 'category',
        }, yAxis3D: {
          type: 'category',
        }, zAxis3D: {}, visualMap: {
          max: 1e8,
          dimension: 'adjusted',
        }, dataset: {
          dimensions: [
            'adjusted',
            "dividend",
            "open",
            "high",
            "low",
            "close",
            "volume",
            { name: 'stats', type: 'ordinal' },
          ], source: csv,
        },
        series: [
          {
            type: 'bar3D',
            // symbolSize: symbolSize,
            shading: 'lambert',
            encode: {
              x: 'timestamp',
              y: 'volume',
              z: 'adjusted',
              tooltip: [0, 1, 2, 3, 4],
            },
          },
        ]}
      this.dayAnalysisOptions = options;
    }
  }

  chartWeekAnalysis() {
    this.dayStats = false;
    this.weekStats = false;
    this.monthStats = false;

    this.dayAnalysis = false;
    this.weekAnalysis = true;
    this.monthAnalysis = false;
    
    if(!this.dayStatsOptions) {

      let csv = JSONstoCSVs([this.weeks])[0];
      let options = { grid3D: {}, tooltip: {}, xAxis3D: {
          type: 'category',
        }, yAxis3D: {
          type: 'category',
        }, zAxis3D: {}, visualMap: {
          max: 1e8,
          dimension: 'adjusted',
        }, dataset: {
          dimensions: [
            'adjusted',
            "dividend",
            "open",
            "high",
            "low",
            "close",
            "volume",
            { name: 'stats', type: 'ordinal' },
          ], source: csv,
        },
        series: [
          {
            type: 'bar3D',
            // symbolSize: symbolSize,
            shading: 'lambert',
            encode: {
              x: 'timestamp',
              y: 'volume',
              z: 'adjusted',
              tooltip: [0, 1, 2, 3, 4],
            },
          },
        ]}
      this.dayStatsOptions = options;
    }
  }

  chartMonthAnalysis() {
    this.dayStats = false;
    this.weekStats = false;
    this.monthStats = false;

    this.dayAnalysis = false;
    this.weekAnalysis = false;
    this.monthAnalysis = true;
    
    if(!this.dayStatsOptions) {

      let csv = JSONstoCSVs([this.months])[0];
      let options = { grid3D: {}, tooltip: {}, xAxis3D: {
          type: 'category',
        }, yAxis3D: {
          type: 'category',
        }, zAxis3D: {}, visualMap: {
          max: 1e8,
          dimension: 'adjusted',
        }, dataset: {
          dimensions: [
            'adjusted',
            "dividend",
            "open",
            "high",
            "low",
            "close",
            "volume",
            { name: 'stats', type: 'ordinal' },
          ], source: csv,
        },
        series: [
          {
            type: 'bar3D',
            // symbolSize: symbolSize,
            shading: 'lambert',
            encode: {
              x: 'timestamp',
              y: 'volume',
              z: 'adjusted',
              tooltip: [0, 1, 2, 3, 4],
            },
          },
        ]}
      this.dayStatsOptions = options;
    }
  }

  // public lineChartData: ChartConfiguration['data'] = {
  //   datasets: [
  //     {
  //       data: [ 65, 59, 80, 81, 56, 55, 40 ],
  //       label: 'Series A',
  //       backgroundColor: 'rgba(148,159,177,0.2)',
  //       borderColor: 'rgba(148,159,177,1)',
  //       pointBackgroundColor: 'rgba(148,159,177,1)',
  //       pointBorderColor: '#fff',
  //       pointHoverBackgroundColor: '#fff',
  //       pointHoverBorderColor: 'rgba(148,159,177,0.8)',
  //       fill: 'origin',
  //     },
  //     {
  //       data: [ 28, 48, 40, 19, 86, 27, 90 ],
  //       label: 'Series B',
  //       backgroundColor: 'rgba(77,83,96,0.2)',
  //       borderColor: 'rgba(77,83,96,1)',
  //       pointBackgroundColor: 'rgba(77,83,96,1)',
  //       pointBorderColor: '#fff',
  //       pointHoverBackgroundColor: '#fff',
  //       pointHoverBorderColor: 'rgba(77,83,96,1)',
  //       fill: 'origin',
  //     },
  //     {
  //       data: [ 180, 480, 770, 90, 1000, 270, 400 ],
  //       label: 'Series C',
  //       yAxisID: 'y-axis-1',
  //       backgroundColor: 'rgba(255,0,0,0.3)',
  //       borderColor: 'red',
  //       pointBackgroundColor: 'rgba(148,159,177,1)',
  //       pointBorderColor: '#fff',
  //       pointHoverBackgroundColor: '#fff',
  //       pointHoverBorderColor: 'rgba(148,159,177,0.8)',
  //       fill: 'origin',
  //     }
  //   ],
  //   labels: [ 'January', 'February', 'March', 'April', 'May', 'June', 'July' ]
  // };

  // public lineChartOptions: ChartConfiguration['options'] = {
  //   elements: {
  //     line: {
  //       tension: 0.5
  //     }
  //   },
  //   scales: {
  //     // We use this empty structure as a placeholder for dynamic theming.
  //     x: {},
  //     'y-axis-0':
  //       {
  //         position: 'left',
  //       },
  //     'y-axis-1': {
  //       position: 'right',
  //       grid: {
  //         color: 'rgba(255,0,0,0.3)',
  //       },
  //       ticks: {
  //         color: 'red'
  //       }
  //     }
  //   },

  //   plugins: {
  //     legend: { display: true },
  //     annotation: {
  //       annotations: [
  //         {
  //           type: 'line',
  //           scaleID: 'x',
  //           value: 'March',
  //           borderColor: 'orange',
  //           borderWidth: 2,
  //           label: {
  //             position: 'center',
  //             enabled: true,
  //             color: 'orange',
  //             content: 'LineAnno',
  //             font: {
  //               weight: 'bold'
  //             }
  //           }
  //         },
  //       ],
  //     }
  //   }
  // };

  // private static generateNumber(i: number): number {
  //   return Math.floor((Math.random() * (i < 2 ? 100 : 1000)) + 1);
  // }

  // public randomize(): void {
  //   for (let i = 0; i < this.lineChartData.datasets.length; i++) {
  //     for (let j = 0; j < this.lineChartData.datasets[i].data.length; j++) {
  //       this.lineChartData.datasets[i].data[j] = LineChartComponent.generateNumber(i);
  //     }
  //   }
  //   this.chart?.update();
  // }

  // // events
  // public chartClicked({ event, active }: { event?: ChartEvent, active?: {}[] }): void {
  //   console.log(event, active);
  // }

  // public chartHovered({ event, active }: { event?: ChartEvent, active?: {}[] }): void {
  //   console.log(event, active);
  // }

  // public hideOne(): void {
  //   const isHidden = this.chart?.isDatasetHidden(1);
  //   this.chart?.hideDataset(1, !isHidden);
  // }

  // public pushOne(): void {
  //   this.lineChartData.datasets.forEach((x, i) => {
  //     const num = AnalysisGraphComponent.generateNumber(i);
  //     x.data.push(num);
  //   });
  //   this.lineChartData?.labels?.push(`Label ${ this.lineChartData.labels.length }`);

  //   this.chart?.update();
  // }

  // public changeColor(): void {
  //   this.lineChartData.datasets[2].borderColor = 'green';
  //   this.lineChartData.datasets[2].backgroundColor = `rgba(0, 255, 0, 0.3)`;

  //   this.chart?.update();
  // }

  // public changeLabel(): void {
  //   if (this.lineChartData.labels) {
  //     this.lineChartData.labels[2] = [ '1st Line', '2nd Line' ];
  //   }

  //   this.chart?.update();
  // }
}
