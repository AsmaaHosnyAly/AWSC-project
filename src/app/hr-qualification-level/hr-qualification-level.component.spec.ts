import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HrQualificationLevelComponent } from './hr-qualification-level.component';

describe('HrQualificationLevelComponent', () => {
  let component: HrQualificationLevelComponent;
  let fixture: ComponentFixture<HrQualificationLevelComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HrQualificationLevelComponent]
    });
    fixture = TestBed.createComponent(HrQualificationLevelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
