import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StrUserstoreDialogComponent } from './str-userstore-dialog.component';

describe('StrUserstoreDialogComponent', () => {
  let component: StrUserstoreDialogComponent;
  let fixture: ComponentFixture<StrUserstoreDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StrUserstoreDialogComponent]
    });
    fixture = TestBed.createComponent(StrUserstoreDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
