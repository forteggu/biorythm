// db.ts
import { NumberSymbol } from '@angular/common';
import Dexie, { Table } from 'dexie';

export interface Users {
  id?: number;
  name: string;
}
export interface Factors {
  id?: number;
  title: string;
  userId: number;
  color?: string;
}

export interface Data {
  factorId: number;
  userId: number;
  date: string;
  value: number;
}

export interface Note {
  id?:number;
  date: string;
  value: string;
}

export class AppDB extends Dexie {
  iUsers!: Table<Users, number>;
  iFactors!: Table<Factors, number>;
  iData!: Table<Data, number>;
  iNote!: Table<Note, number>;

  constructor() {
    super('BiorChartData');
    this.version(1).stores({
      iUsers: '++id,name',
      iFactors: '++id,[userId+title]',
      iNote: 'date',
      iData: '[factorId+userId+date],[userId+factorId],[userId+date],userId,date',
    });
  }

  async initializeMockData() {
    try{

      await db.iUsers.add({ id: 0, name: 'Default' });
      await db.iFactors.bulkAdd([
        { id: 0, title: 'Sex', userId: 0 },
        { id: 1, title: 'Work / Studies', userId: 0 },
        { id: 2, title: 'Exercise', userId: 0 },
        { id: 3, title: 'Screentime', userId: 0 },
      ]);
      await db.iData.bulkAdd([
        {factorId:0, userId: 0, date: "2021-11-13", value: 4},
        {factorId:0, userId: 0, date: "2021-11-14", value: 2},
        {factorId:0, userId: 0, date: "2021-11-15", value: 3},
        {factorId:0, userId: 0, date: "2021-11-16", value: 4},
        {factorId:0, userId: 0, date: "2021-11-17", value: 5},
        {factorId:0, userId: 0, date: "2021-11-18", value: 4},
        {factorId:1, userId: 0, date: "2021-11-13", value: 4},
        {factorId:1, userId: 0, date: "2021-11-14", value: 1},
        {factorId:1, userId: 0, date: "2021-11-15", value: 2},
        {factorId:1, userId: 0, date: "2021-11-16", value: 1},
        {factorId:1, userId: 0, date: "2021-11-17", value: 1},
        {factorId:1, userId: 0, date: "2021-11-18", value: 5},
        {factorId:2, userId: 0, date: "2021-11-13", value: 1},
        {factorId:2, userId: 0, date: "2021-11-14", value: 2},
        {factorId:2, userId: 0, date: "2021-11-15", value: 3},
        {factorId:2, userId: 0, date: "2021-11-16", value: 2},
        {factorId:2, userId: 0, date: "2021-11-17", value: 7},
        {factorId:2, userId: 0, date: "2021-11-18", value: 5},
        {factorId:3, userId: 0, date: "2021-11-13", value: 6},
        {factorId:3, userId: 0, date: "2021-11-14", value: 6},
        {factorId:3, userId: 0, date: "2021-11-15", value: 6},
        {factorId:3, userId: 0, date: "2021-11-16", value: 6},
        {factorId:3, userId: 0, date: "2021-11-17", value: 4},
        {factorId:3, userId: 0, date: "2021-11-18", value: 7},
      ]);
    }catch(error){
      console.warn(error);
    }
  }
}

export const db = new AppDB();
