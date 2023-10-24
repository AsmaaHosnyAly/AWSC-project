import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FiReportsComponent } from './fi-reports.component';

describe('FiReportsComponent', () => {
  let component: FiReportsComponent;
  let fixture: ComponentFixture<FiReportsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FiReportsComponent]
    });
    fixture = TestBed.createComponent(FiReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
