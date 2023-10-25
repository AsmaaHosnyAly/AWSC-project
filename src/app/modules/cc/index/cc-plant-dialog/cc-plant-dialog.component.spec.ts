import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CcPlantDialogComponent } from './cc-plant-dialog.component';

describe('CcPlantDialogComponent', () => {
  let component: CcPlantDialogComponent;
  let fixture: ComponentFixture<CcPlantDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CcPlantDialogComponent]
    });
    fixture = TestBed.createComponent(CcPlantDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
