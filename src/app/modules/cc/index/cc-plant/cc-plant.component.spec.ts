import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CcPlantComponent } from './cc-plant.component';

describe('CcPlantComponent', () => {
  let component: CcPlantComponent;
  let fixture: ComponentFixture<CcPlantComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CcPlantComponent]
    });
    fixture = TestBed.createComponent(CcPlantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
