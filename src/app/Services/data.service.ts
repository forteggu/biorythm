import { Injectable } from '@angular/core';
import { db, Users, Factors, Data, Note } from '../db/db';
import { liveQuery } from 'dexie';
import { getUserId } from '../Commons/commons';
@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor() { }

  async getDefaults() {
    let d = await db.iData.toArray();
    if(d.length===0){
      await db.initializeMockData();
      d = await db.iData.toArray();
    }
    let f = await this.getFactors();
    return {data:d,factors:f};
  }
  async getData() {
    let d = await db.iData.toArray();
    let f = await this.getFactors();
    return {data:d,factors:f};
  }
  async getFactors(){
    return await db.iFactors.toArray();
  }
  async addFactor(reg:Factors){
    return await db.iFactors.add(reg);
  }
  
  async removeFactor(regId:number){
    return await db.iFactors.delete(regId);
  }

  async addDayData(data:Data[]){
    await db.iData.bulkAdd(data);
  }

  async checkDateAlreadyExists(date2Check:string, userId:number){
    return await db.iData.where('[userId+date]').equals([userId,date2Check]).count();
  }

  async checkFactorAlreadyExists(factorTitle:string, userId:number){
    return await db.iFactors.where('[userId+title]').equals([userId,factorTitle]).count();
  }

  async checkUserHasData(userId:number){
    return await db.iData.where('userId').equals(userId).count();
  }

  async removeFactorsData(factorId:number){
    return await db.iData.where({userId:getUserId(),factorId:factorId}).delete();
  }

  async updateFactor(factor:Factors){
    return await db.iFactors.update(factor.id!,factor);
  }

  async getAlreadyRegisteredFactors(date:string){
    return await db.iData.where({userId:getUserId(),date:date}).toArray();
  }

  async saveUpdateRegisters(data:Data[]){
    return await db.iData.bulkPut(data);
  }

  async getNotes(){
    return await db.iNote.toArray();
  }

  async getNotesByDate(date:string){
    return await db.iNote.toArray();
  }
  async addNote(reg:Note){
    return await db.iNote.add(reg);
  }
  async addUpdateNote(reg:Note){
    return await db.iNote.put(reg);
  }

}
