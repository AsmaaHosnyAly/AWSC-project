import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CcEquipmentComponent } from './cc-equipment.component';

describe('CcEquipmentComponent', () => {
  let component: CcEquipmentComponent;
  let fixture: ComponentFixture<CcEquipmentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CcEquipmentComponent]
    });
    fixture = TestBed.createComponent(CcEquipmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
