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
}

export interface Data {
  id?: number;
  factorId: number;
  userId: number;
  date: string;
  value: number;
}

export class AppDB extends Dexie {
  iUsers!: Table<Users, number>;
  iFactors!: Table<Factors, number>;
  iData!: Table<Data, number>;

  constructor() {
    super('BiorChartData');
    this.version(1).stores({
      iUsers: '++id,name',
      iFactors: '++id,title',
      iData: '++id, factorId,userId,date',
    });
  }

  async initializeMockData() {
    await db.iUsers.add({ id: 0, name: 'Default' });
    await db.iFactors.bulkAdd([
      { id: 0, title: 'Sex', userId: 0 },
      { id: 1, title: 'Work / Studies', userId: 0 },
      { id: 2, title: 'Exercise', userId: 0 },
      { id: 3, title: 'Screentime', userId: 0 },
    ]);
    await db.iData.bulkAdd([
      {factorId:0, userId: 0, date: "13/12", value: 1},
      {factorId:0, userId: 0, date: "14/12", value: 2},
      {factorId:0, userId: 0, date: "15/12", value: 3},
      {factorId:0, userId: 0, date: "16/12", value: 4},
      {factorId:0, userId: 0, date: "17/12", value: 5},
      {factorId:0, userId: 0, date: "18/12", value: 4},
      {factorId:1, userId: 0, date: "13/12", value: 4},
      {factorId:1, userId: 0, date: "14/12", value: 1},
      {factorId:1, userId: 0, date: "15/12", value: 2},
      {factorId:1, userId: 0, date: "16/12", value: 1},
      {factorId:1, userId: 0, date: "17/12", value: 1},
      {factorId:1, userId: 0, date: "18/12", value: 5},
      {factorId:2, userId: 0, date: "13/12", value: 1},
      {factorId:2, userId: 0, date: "14/12", value: 2},
      {factorId:2, userId: 0, date: "15/12", value: 3},
      {factorId:2, userId: 0, date: "16/12", value: 2},
      {factorId:2, userId: 0, date: "17/12", value: 7},
      {factorId:2, userId: 0, date: "18/12", value: 5},
      {factorId:3, userId: 0, date: "13/12", value: 6},
      {factorId:3, userId: 0, date: "14/12", value: 6},
      {factorId:3, userId: 0, date: "15/12", value: 6},
      {factorId:3, userId: 0, date: "16/12", value: 6},
      {factorId:3, userId: 0, date: "17/12", value: 4},
      {factorId:3, userId: 0, date: "18/12", value: 7},
     ]);
  }
}

export const db = new AppDB();
