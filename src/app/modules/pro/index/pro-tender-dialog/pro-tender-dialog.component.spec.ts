import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProTenderDialogComponent } from './pro-tender-dialog.component';

describe('ProTenderDialogComponent', () => {
  let component: ProTenderDialogComponent;
  let fixture: ComponentFixture<ProTenderDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProTenderDialogComponent]
    });
    fixture = TestBed.createComponent(ProTenderDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
