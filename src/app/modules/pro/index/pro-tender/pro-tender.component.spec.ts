import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProTenderComponent } from './pro-tender.component';

describe('ProTenderComponent', () => {
  let component: ProTenderComponent;
  let fixture: ComponentFixture<ProTenderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProTenderComponent]
    });
    fixture = TestBed.createComponent(ProTenderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
