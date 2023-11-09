import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProTenderTypeDailogComponent } from './pro-tender-type-dailog.component';

describe('ProTenderTypeDailogComponent', () => {
  let component: ProTenderTypeDailogComponent;
  let fixture: ComponentFixture<ProTenderTypeDailogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProTenderTypeDailogComponent]
    });
    fixture = TestBed.createComponent(ProTenderTypeDailogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
