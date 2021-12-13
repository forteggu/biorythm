import { Component, OnInit } from '@angular/core';
import Chart from 'chart.js/auto';
import { DataService } from 'src/app/Services/data.service';
import { db, Users, Factors, Data } from '../../db/db';
interface defaultData {
  factors: Factors[];
  data: Data[];
}
@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
})
export class MainComponent implements OnInit {
  constructor(private _dataService: DataService) {}

  ngOnInit(): void {
    this._dataService.getDefaults().then((data) => this.loadChart(data));
  }

  parseData(da: defaultData) {
    // Random color list
    let colorList = ['rgb(75, 192, 192)', 'rgb(255,99,71)', 'rgb(128,0,0)', 'rgb(255,140,0)', 'rgb(255,215,0)', 'rgb(210,105,30)', 'rgb(105,105,105)', 'rgb(148,0,211)', 'rgb(138,43,226)', 'rgb(100,149,237)', 'rgb(70,130,180)', 'rgb(0,255,255)', 'rgb(127,255,0)', 'rgb(154,205,50)', 'rgb(255,165,0)'];
    // Labels are the dates, no repeated values
    let labels = [...new Set(da.data.map((l) => l.date))];
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
    console.log(datasets);
    return {
      labels: labels,
      datasets: datasets
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
}
