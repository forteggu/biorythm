import { Injectable } from '@angular/core';
import { db, Users, Factors, Data } from '../db/db';
import { liveQuery } from 'dexie';
@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor() { }
  async getDefaults() {
    //await db.initializeMockData();
    console.log("lanzo getFactors");
    const f = await this.getFactors();
    const d = await db.iData.toArray()
    return {data:d,factors:f};
  }
  
  async getFactors(){
    return await db.iFactors.toArray();
  }
}
