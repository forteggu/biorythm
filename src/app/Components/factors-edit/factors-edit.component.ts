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
  newFactorTitle: string = '';
  newFactorAlreadyInUse:boolean=false;
  factorOnDelete:Factors = {} as Factors;
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
        'inputFactor_'+targetId
      ) as HTMLInputElement;
      console.log("factorInput", factorInput);
      this.factorOnDelete.id=targetId;
      this.factorOnDelete.title=factorInput.value;

      console.log("factorOnDelete ",this.factorOnDelete);
      trigger.click();
    }
  }
  onAcceptRemove(){
    try {
      let trigger: HTMLElement = document.getElementById(
        'cancelConfirmationModalButton'
      ) as HTMLElement;
        trigger.click();
      this._dataService.removeFactor(this.factorOnDelete.id!).then((r) => {
        this.loadData();
      });
    } catch (e) {
      openModal({ t: 'Exception', b: e as string });
    }
  }
  onUpdateNewFactor(){
    this.newFactorAlreadyInUse=false;
  }
  onClickCancel(element: HTMLElement) {
    let targetId = this.getElementTargetId(element);
    if (targetId !== NaN) {
      this.factorsListEditionMap[targetId].inEdition = false;
    }
  }
  getElementTargetId(element: HTMLElement) {
    let id = element.id;
    return parseInt(id.split('_')[1]);
  }
  onAddNewFactor() {
    try {
      this._dataService
        .checkFactorAlreadyExists(this.newFactorTitle, getUserId())
        .then((c) => {
          if (c > 0) {
            this.newFactorAlreadyInUse=true;
          } else {
            this._dataService
              .addFactor({
                title: this.newFactorTitle,
                userId: getUserId(),
              })
              .then((r) => {
                this.loadData();
                this.newFactorTitle = '';
              });
          }
        });
    } catch (e) {
      openModal({ t: 'Exception', b: e as string });
    }
  }
}
