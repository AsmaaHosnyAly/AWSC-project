import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProContractorTypeDialogComponent } from './pro-contractor-type-dialog.component';

describe('ProContractorTypeDialogComponent', () => {
  let component: ProContractorTypeDialogComponent;
  let fixture: ComponentFixture<ProContractorTypeDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProContractorTypeDialogComponent]
    });
    fixture = TestBed.createComponent(ProContractorTypeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
