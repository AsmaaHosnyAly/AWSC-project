import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CcEquipmentDailogComponent } from './cc-equipment-dailog.component';

describe('CcEquipmentDailogComponent', () => {
  let component: CcEquipmentDailogComponent;
  let fixture: ComponentFixture<CcEquipmentDailogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CcEquipmentDailogComponent]
    });
    fixture = TestBed.createComponent(CcEquipmentDailogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
