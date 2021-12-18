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
  validForm: boolean = false;
  alreadyUsedFactors: { id: number; desc: string; val: number }[] = [];

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
  onClickSave() {
    if (this.validDate) {
      this.onSave();
    } else {
      try {
        this._dataService.getAlreadyRegisteredFactors(this.date).then((r) => {
          this.alreadyUsedFactors = r.map((i) => {
            return {
              id: i.factorId,
              desc: this.factorsList.filter((x) => x.id === i.factorId)[0]
                .title,
              val: i.value,
            };
          });
          const b: HTMLElement = document.getElementById(
            'confirmationModalTrigger_addValues'
          ) as HTMLElement;
          b.click();
        });
      } catch (e) {}
    }
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
        this._router.navigateByUrl('main/chartView');
      } catch (e: any) {
        // Modal: something went wrong
        openModal({ t: 'Exception', b: e as string });
      }
    } else {
      //Output error modal
      this.validDate = false;
    }
  }

  onSaveUpdate() {
    const updatedRegs: Data[] = this.factorsList.map((n) => {
      return {
        factorId: n.id,
        userId: getUserId(),
        date: this.date,
        value: this.rangeValues[n.id!],
      } as Data;
    });
    try {
      this._dataService.saveUpdateRegisters(updatedRegs).then((result) => {
        const b: HTMLElement = document.getElementById(
          'cancelConfirmationModalButton_addValues'
        ) as HTMLElement;
        b.click();
        this._router.navigateByUrl('main/chartView');
      });
    } catch (e: any) {
      // Modal: something went wrong
      openModal({ t: 'Exception', b: e as string });
    }
  }
  validateInputs() {
    // Only date needs validation
    return this.date !== '' ? true : false;
  }
  onChangeDate() {
    // If date already exists, disable save button and display red help
    this.validForm = this.date.trim() != '' ? true : false;
    try {
      this._dataService
        .checkDateAlreadyExists(this.date, getUserId())
        .then((count) => {
          this.validDate = count > 0 ? false : true;
          if (count > 0) {
            this.validDate = false;
            this._dataService.getAlreadyRegisteredFactors(this.date).then((r) => {
              r.map((i) => {
                this.rangeValues[i.factorId]=i.value;
              });
            });
          } else {
            this.validDate = true;
          }
        });
    } catch (error) {
      openModal({ t: 'Exception', b: error as string });
    }
  }
  onReset() {
    this.rangeValues = this.rangeValues.map((i) => 0);
    this.date = '';
    this.validForm = false;
    this.validDate = true;
  }

  getStyle(factor: Factors) {
    return {
      color: factor.color,
      'font-weight': 'bold',
      border: `2px solid ${factor.color}`,
      background: `${factor.color}33`,
    };
  }
}
