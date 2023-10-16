import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrTarckDialogComponent } from './tr-tarck-dialog.component';

describe('TrTarckDialogComponent', () => {
  let component: TrTarckDialogComponent;
  let fixture: ComponentFixture<TrTarckDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TrTarckDialogComponent]
    });
    fixture = TestBed.createComponent(TrTarckDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
