import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProTenderTypeComponent } from './pro-tender-type.component';

describe('ProTenderTypeComponent', () => {
  let component: ProTenderTypeComponent;
  let fixture: ComponentFixture<ProTenderTypeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProTenderTypeComponent]
    });
    fixture = TestBed.createComponent(ProTenderTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
