import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProOperationTypeComponent } from './pro-operation-type.component';

describe('ProOperationTypeComponent', () => {
  let component: ProOperationTypeComponent;
  let fixture: ComponentFixture<ProOperationTypeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProOperationTypeComponent]
    });
    fixture = TestBed.createComponent(ProOperationTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
