import { elementEventFullName } from '@angular/compiler/src/view_compiler/view_compiler';
import { Component, OnInit } from '@angular/core';
import { getUserId, openModal } from 'src/app/Commons/commons';
import { Factors } from 'src/app/db/db';
import { DataService } from 'src/app/Services/data.service';

@Component({
  selector: 'app-factors-edit',
  templateUrl: './factors-edit.component.html',
  styleUrls: ['./factors-edit.component.css'],
})
export class FactorsEditComponent implements OnInit {
  factorsList: Factors[] = [];
  factorsListEditionMap: { id: number; inEdition: boolean }[] = [];
  newFactorObject: { t: string; c: string } = {
    t: '',
    c: this.randomColor(),
  };
  newFactorInvalid: boolean = false;
  factorOnDelete: Factors = {} as Factors;
  constructor(private _dataService: DataService) {}

  ngOnInit(): void {
    this.loadData();
  }
  loadData() {
    try {
      this._dataService.getFactors().then((factors) => {
        this.factorsList = [];
        this.factorsListEditionMap = [];
        if (factors && factors.length > 0) {
          this.factorsList = factors;
          for (let i of factors) {
            this.factorsListEditionMap[i.id!] = { id: i.id!, inEdition: false };
          }
        }
      });
    } catch (e) {
      openModal({ t: 'Exception', b: e as string });
    }
  }
  onClickEdit(element: any) {
    let targetId = this.getElementTargetId(element);
    if (targetId !== NaN) {
      this.factorsListEditionMap[targetId].inEdition = true;
    }
  }
  onClickSave(element: HTMLElement) {
    let targetId = this.getElementTargetId(element);
    if (targetId !== NaN) {
      this.factorsListEditionMap[targetId].inEdition = false;
      let factorInput: HTMLInputElement = document.getElementById(
        'inputFactor_' + targetId
      ) as HTMLInputElement;
      let factorColorInput: HTMLInputElement = document.getElementById(
        'factorColor_' + targetId
      ) as HTMLInputElement;
      let updatedFactor: Factors = {
        id: targetId,
        title: factorInput.value,
        color: factorColorInput.value,
        userId: getUserId(),
      };
      try {
        this._dataService.updateFactor(updatedFactor).then(() => {
          this.updateFactorStyle(updatedFactor);
        });
      } catch (e) {
        openModal({ t: 'Exception', b: e as string });
      }
    }
  }
  onClickRemove(element: HTMLElement) {
    let targetId = this.getElementTargetId(element);
    if (targetId !== NaN) {
      // Show pop up
      let trigger: HTMLElement = document.getElementById(
        'confirmationModalTrigger'
      ) as HTMLElement;
      let factorInput: HTMLInputElement = document.getElementById(
        'inputFactor_' + targetId
      ) as HTMLInputElement;
      this.factorOnDelete.id = targetId;
      this.factorOnDelete.title = factorInput.value;
      trigger.click();
    }
  }
  onAcceptRemove() {
    try {
      let trigger: HTMLElement = document.getElementById(
        'cancelConfirmationModalButton'
      ) as HTMLElement;
      trigger.click();
      this._dataService.removeFactor(this.factorOnDelete.id!).then((r) => {
        this._dataService
          .removeFactorsData(this.factorOnDelete.id!)
          .then((rd) => {
            this.loadData();
          });
      });
    } catch (e) {
      openModal({ t: 'Exception', b: e as string });
    }
  }
  onUpdateNewFactor() {
    this.newFactorInvalid = false;
  }
  onClickCancel(element: HTMLElement) {
    let targetId = this.getElementTargetId(element);
    if (targetId !== NaN) {
      this.factorsListEditionMap[targetId].inEdition = false;
      let factorInput: HTMLInputElement = document.getElementById(
        'inputFactor_' + targetId
      ) as HTMLInputElement;
      let originalFactorObj = this.factorsList.filter(
        (f) => f.id === targetId
      )[0];
      factorInput.value = originalFactorObj.title;
      let factorColorInput: HTMLInputElement = document.getElementById(
        'factorColor_' + targetId
      ) as HTMLInputElement;
      factorColorInput.value = originalFactorObj.color || this.randomColor();
    }
  }
  getElementTargetId(element: HTMLElement) {
    let id = element.id;
    return parseInt(id.split('_')[1]);
  }
  onAddNewFactor() {
    if (this.newFactorObject.t.trim().length === 0) {
      this.newFactorInvalid = true;
    } else {
      try {
        this._dataService
          .checkFactorAlreadyExists(this.newFactorObject.t, getUserId())
          .then((c) => {
            if (c > 0) {
              this.newFactorInvalid = true;
            } else {
              this._dataService
                .addFactor({
                  title: this.newFactorObject.t,
                  color: this.newFactorObject.c,
                  userId: getUserId(),
                })
                .then((r) => {
                  this.loadData();
                  this.newFactorObject.t = '';
                  this.newFactorObject.c = this.randomColor();
                });
            }
          });
      } catch (e) {
        openModal({ t: 'Exception', b: e as string });
      }
    }
  }

  randomColor() {
    let color = '#';
    for (let i = 0; i < 6; i++) {
      const random = Math.random();
      const bit = (random * 16) | 0;
      color += bit.toString(16);
    }
    return color;
  }

  /**
   * Updates factor without reloading all data
   * @param uf updatedFactor
   */
  updateFactorStyle(uf: Factors) {
    let notFound = true;
    let i = 0;
    while (notFound && this.factorsList[i]) {
      if (this.factorsList[i].id === uf.id) {
        this.factorsList[i].color = uf.color;
        this.factorsList[i].title = uf.title;
        notFound=false;
      }else{
        i++;
      }
    }
  }
  getStyle(factor: Factors) {
    return {
      color: factor.color,
      'font-weight': 'bold',
      border: `1px solid ${factor.color}`
    };
  }
}
