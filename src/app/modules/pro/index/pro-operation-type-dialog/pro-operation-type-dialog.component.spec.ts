import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProOperationTypeDialogComponent } from './pro-operation-type-dialog.component';

describe('ProOperationTypeDialogComponent', () => {
  let component: ProOperationTypeDialogComponent;
  let fixture: ComponentFixture<ProOperationTypeDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProOperationTypeDialogComponent]
    });
    fixture = TestBed.createComponent(ProOperationTypeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
