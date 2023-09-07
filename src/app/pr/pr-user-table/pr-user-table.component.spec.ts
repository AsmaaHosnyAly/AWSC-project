import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrUserTableComponent } from './pr-user-table.component';

describe('PrUserTableComponent', () => {
  let component: PrUserTableComponent;
  let fixture: ComponentFixture<PrUserTableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PrUserTableComponent]
    });
    fixture = TestBed.createComponent(PrUserTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
