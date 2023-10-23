import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrExcutedDialogComponent } from './tr-excuted-dialog.component';

describe('TrExcutedDialogComponent', () => {
  let component: TrExcutedDialogComponent;
  let fixture: ComponentFixture<TrExcutedDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TrExcutedDialogComponent]
    });
    fixture = TestBed.createComponent(TrExcutedDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
