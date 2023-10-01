import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StrAddDetailsDialogComponent } from './str-add-details-dialog.component';

describe('StrAddDetailsDialogComponent', () => {
  let component: StrAddDetailsDialogComponent;
  let fixture: ComponentFixture<StrAddDetailsDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StrAddDetailsDialogComponent]
    });
    fixture = TestBed.createComponent(StrAddDetailsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
