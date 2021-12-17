import { Component, OnInit } from '@angular/core';
import Chart from 'chart.js/auto';
import { getUserId, openModal } from 'src/app/Commons/commons';
import { DataService } from 'src/app/Services/data.service';
import { Factors, Data } from '../../db/db';
interface dataStructure {
  factors: Factors[];
  data: Data[];
}
@Component({
  selector: 'app-chart-view',
  templateUrl: './chart-view.component.html',
  styleUrls: ['./chart-view.component.css'],
})
export class ChartViewComponent implements OnInit {
  showChart: boolean = true;
  showAlert: boolean = false;
  constructor(private _dataService: DataService) {}
  ngOnInit(): void {
    try {
      // if there is no data chart is not displayed
      this._dataService.checkUserHasData(getUserId()).then((h) => {
        if (h > 0) {
          this._dataService.getData().then((data) => this.loadChart(data));
        } else {
          this.showAlert = true;
          this.showChart = false;
        }
      });
    } catch (e) {
      openModal({ t: 'Exception', b: e as string });
    }
  }
  /**
   * fill empty days so that all factors display the correct information
   * @param data data that contains all the chart information and values
   * @param labels labels to display (dates)
   */
  preprocesssData(labels: string[], data: dataStructure) {
    labels.map((l) => {
      data.factors.map((f) => {
        let factorHasDate = false;
        let i=0;
        while(data.data[i] && !factorHasDate){
         if (f.id===data.data[i].factorId && data.data[i].date === l) {
            factorHasDate = true;
          }
          i++;
        }
        
        if(!factorHasDate){
          let newReg:Data={} as Data;
          newReg.date=l;
          newReg.factorId=f.id!;
          newReg.userId=getUserId();
          newReg.value=0;
          data.data.push(newReg);
        }
      });
    });
  }

  parseData(da: dataStructure) {
    // Labels are the dates, no repeated values
    let labels = [...new Set(da.data.map((l) => l.date))];
    // Reorder labels (dates) just in case
    labels.sort((a, b) => {
      let date1 = new Date(a);
      let date2 = new Date(b);
      return date1 < date2 ? -1 : 1;
    });
    this.preprocesssData(labels, da);
    labels = labels.map(l => this.formatDate(l));
    const avgValuesDataSet={
      label:"Average",
      data:this.calcAvg(labels,da.data),
      fill:true,
      borderColor:"rgba(255,0,0,0.8)",
      tension:0
    };
    // Reorder dates just in case
    da.data.sort((a, b) => {
      let date1 = new Date(a.date);
      let date2 = new Date(b.date);
      return date1 < date2 ? -1 : 1;
    });
    // Create dataset structure
    let datasets = da.factors.map((e) => {
      return {
        label: e.title,
        data: da.data
          .filter((x) => {
            return x.factorId === e.id;
          })
          .map((z) => z.value),
        fill: false,
        borderColor: e.color,
        tension: 0.1,
      };
    });
    datasets.push(avgValuesDataSet);
    return {
      labels: labels,
      datasets: datasets,
    };
  }
  loadChart(chartData: dataStructure) {
    const parsedData = this.parseData(chartData);
    const ctx = document.getElementById('myChart')! as HTMLCanvasElement;

    const myChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: parsedData.labels,
        datasets: parsedData.datasets,
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }

  formatDate(date: string) {
    let dateArray = date.split('-');
    return dateArray[2] + '/' + dateArray[1] + '/' + dateArray[0];
  }

  calcAvg(labels:string[] ,data:Data[]){
    let avgValuesPerDay:number[]=[];
    labels.map(l=>{
      let sumDia=0;
      let fCount=0;
      for(let d of data){
        if(this.formatDate(d.date)===l){
          sumDia+=d.value;
          fCount++;
        }
      }
      avgValuesPerDay.push(sumDia/fCount);
    });
   return avgValuesPerDay;
  }
}
