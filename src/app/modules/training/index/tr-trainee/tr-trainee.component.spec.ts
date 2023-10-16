import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrTraineeComponent } from './tr-trainee.component';

describe('TrTraineeComponent', () => {
  let component: TrTraineeComponent;
  let fixture: ComponentFixture<TrTraineeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TrTraineeComponent]
    });
    fixture = TestBed.createComponent(TrTraineeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
