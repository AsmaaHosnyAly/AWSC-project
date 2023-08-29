import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HrQualificationLevelDialogComponent } from './hr-qualification-level-dialog.component';

describe('HrQualificationLevelDialogComponent', () => {
  let component: HrQualificationLevelDialogComponent;
  let fixture: ComponentFixture<HrQualificationLevelDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HrQualificationLevelDialogComponent]
    });
    fixture = TestBed.createComponent(HrQualificationLevelDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
