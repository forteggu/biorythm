import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Data, Factors } from 'src/app/db/db';
import { DataService } from 'src/app/Services/data.service';
import { getUserId, openModal } from 'src/app/Commons/commons';
@Component({
  selector: 'app-add-values',
  templateUrl: './add-values.component.html',
  styleUrls: ['./add-values.component.css'],
})
export class AddValuesComponent implements OnInit {
  factorsList: Factors[] = [];
  rangeValues: number[] = [];
  date: string = '';
  validDate: boolean = true;
  noFactors: boolean = false;

  constructor(private _dataService: DataService, private _router: Router) {}
  ngOnInit(): void {
    this._dataService.getFactors().then((fs) => {
      if (fs && fs.length > 0) {
        this.factorsList = fs;
        this.rangeValues = [];
        this.factorsList = fs;
        for (let i of fs) {
          this.rangeValues[i.id!] = 0;
        }
      } else {
        this.noFactors = true;
      }
    });
  }

  onSave() {
    if (this.validateInputs()) {
      // Build to-save object array
      const regList: Data[] = this.factorsList.map((f) => {
        return {
          factorId: f.id,
          userId: getUserId(),
          date: this.date,
          value: this.rangeValues[f.id!],
        } as Data;
      });
      try {
        this._dataService.addDayData(regList);
        this._router.navigateByUrl('main');
      } catch (e: any) {
        // Modal: something went wrong
        openModal({ t: 'Exception', b: e as string });
      }
    } else {
      //Output error modal
      this.validDate = false;
    }
  }

  validateInputs() {
    // Only date needs validation
    return this.date !== '' ? true : false;
  }
  onChangeDate() {
    // If date already exists, disable save button and display red help
    try {
      this._dataService
        .checkDateAlreadyExists(this.date, getUserId())
        .then((count) => {
          this.validDate = count > 0 ? false : true;
        });
    } catch (error) {
      openModal({ t: 'Exception', b: error as string });
    }
  }
  onReset() {
    this.rangeValues = this.rangeValues.map((i) => 0);
    this.date = '';
  }

  getStyle(factor:Factors){
    return {
      color:factor.color,
      "font-weight":"bold",
      "border":`2px solid ${factor.color}`,
      background:`${factor.color}33`
    }
  }
}
