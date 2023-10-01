import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StrReportAddItemComponent } from './str-report-add-item.component';

describe('StrReportAddItemComponent', () => {
  let component: StrReportAddItemComponent;
  let fixture: ComponentFixture<StrReportAddItemComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StrReportAddItemComponent]
    });
    fixture = TestBed.createComponent(StrReportAddItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
