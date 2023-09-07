import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StrReportComponent } from './str-report.component';

describe('StrReportComponent', () => {
  let component: StrReportComponent;
  let fixture: ComponentFixture<StrReportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StrReportComponent]
    });
    fixture = TestBed.createComponent(StrReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
