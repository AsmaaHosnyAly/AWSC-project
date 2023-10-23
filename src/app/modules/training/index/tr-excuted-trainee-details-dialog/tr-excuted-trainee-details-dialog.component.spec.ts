import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrExcutedTraineeDetailsDialogComponent } from './tr-excuted-trainee-details-dialog.component';

describe('TrExcutedTraineeDetailsDialogComponent', () => {
  let component: TrExcutedTraineeDetailsDialogComponent;
  let fixture: ComponentFixture<TrExcutedTraineeDetailsDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TrExcutedTraineeDetailsDialogComponent]
    });
    fixture = TestBed.createComponent(TrExcutedTraineeDetailsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
