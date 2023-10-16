import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrTraineeDialogComponent } from './tr-trainee-dialog.component';

describe('TrTraineeDialogComponent', () => {
  let component: TrTraineeDialogComponent;
  let fixture: ComponentFixture<TrTraineeDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TrTraineeDialogComponent]
    });
    fixture = TestBed.createComponent(TrTraineeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
