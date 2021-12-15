import { Injectable } from '@angular/core';
import { db, Users, Factors, Data } from '../db/db';
import { liveQuery } from 'dexie';
@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor() { }

  async getDefaults() {
    let d = await db.iData.toArray();
    if(d.length===0){
      console.log("No hay registros, cargamos valores por defecto");
      await db.initializeMockData();
      d = await db.iData.toArray();
    }
    let f = await this.getFactors();
    return {data:d,factors:f};
  }
  
  async getFactors(){
    return await db.iFactors.toArray();
  }
  async addFactor(reg:Factors){
    return await db.iFactors.add(reg);
  }
  async addDayData(data:Data[]){
    await db.iData.bulkAdd(data);
  }

  async checkDateAlreadyExists(date2Check:string, factorId:number, userId:number){
    return await db.iData.where('[factorId+userId+date]').equals([factorId,userId,date2Check]).count();
  }

  async checkUserHasData(userId:number){
    return await db.iData.where('userId').equals(userId).count();
  }
}
