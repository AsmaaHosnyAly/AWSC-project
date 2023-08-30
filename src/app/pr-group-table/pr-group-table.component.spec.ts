import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrGroupTableComponent } from './pr-group-table.component';

describe('PrGroupTableComponent', () => {
  let component: PrGroupTableComponent;
  let fixture: ComponentFixture<PrGroupTableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PrGroupTableComponent]
    });
    fixture = TestBed.createComponent(PrGroupTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
