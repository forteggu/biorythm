import { Component, OnInit } from '@angular/core';
import Chart from 'chart.js/auto';
import { getUserId, openModal } from 'src/app/Commons/commons';
import { DataService } from 'src/app/Services/data.service';
import { db, Users, Factors, Data } from '../../db/db';
interface defaultData {
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
      // if no data no show
      this._dataService.checkUserHasData(getUserId()).then((h) => {
        if (h > 0) {
          this._dataService.getDefaults().then((data) => this.loadChart(data));
        } else {
          this.showAlert = true;
          this.showChart = false;
        }
      });
    } catch (e) {
      openModal({ t: 'Exception', b: e as string });
    }
  }

  parseData(da: defaultData) {
    // Random color list
    let colorList = [
      'rgb(75, 192, 192)',
      'rgb(255,99,71)',
      'rgb(128,0,0)',
      'rgb(255,140,0)',
      'rgb(255,215,0)',
      'rgb(210,105,30)',
      'rgb(105,105,105)',
      'rgb(148,0,211)',
      'rgb(138,43,226)',
      'rgb(100,149,237)',
      'rgb(70,130,180)',
      'rgb(0,255,255)',
      'rgb(127,255,0)',
      'rgb(154,205,50)',
      'rgb(255,165,0)',
    ];
    // Labels are the dates, no repeated values
    let labels = [...new Set(da.data.map((l) => this.formatDate(l.date)))];
    // Reorder factors just in case
    da.factors.sort((a, b) => {
      return a.id! - b.id!;
    });
    // Create dataset structure
    let datasets = da.factors.map((e) => {
      const randomNumber = Math.floor(Math.random() * colorList.length);
      let iterationColor = colorList[randomNumber];
      colorList.splice(randomNumber, 1);
      return {
        label: e.title,
        data: da.data
          .filter((x) => {
            return x.factorId === e.id;
          })
          .map((z) => z.value),
        fill: false,
        borderColor: iterationColor,
        tension: 0.1,
      };
    });
    return {
      labels: labels,
      datasets: datasets,
    };
  }
  loadChart(chartData: defaultData) {
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
    dateArray.shift();
    return dateArray[1] + '/' + dateArray[0];
  }
}
