import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FactorsEditComponent } from './factors-edit.component';

describe('FactorsEditComponent', () => {
  let component: FactorsEditComponent;
  let fixture: ComponentFixture<FactorsEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FactorsEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FactorsEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
