import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProContractorTypeComponent } from './pro-contractor-type.component';

describe('ProContractorTypeComponent', () => {
  let component: ProContractorTypeComponent;
  let fixture: ComponentFixture<ProContractorTypeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProContractorTypeComponent]
    });
    fixture = TestBed.createComponent(ProContractorTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
