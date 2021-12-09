// itemlist.component.ts
import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { liveQuery } from 'dexie';
import { db, TodoItem, TodoList } from '../db';

@Component({
  selector: 'itemlist',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.css'],
})
export class ItemListComponent {
  @Input() todoList: TodoList = {} as TodoList;
  // Observe an arbritary query:
  todoItems$ = liveQuery(
    () => this.listTodoItems()
  ); 

  async listTodoItems() {
    return await db.todoItems
      .where({
        todoListId: this.todoList.id,
      })
      .toArray();
  }

  async addItem() {
    await db.todoItems.add({
      title: this.itemName,
      todoListId: this.todoList.id!,
    });
  }

  itemName = 'My new item';
}

