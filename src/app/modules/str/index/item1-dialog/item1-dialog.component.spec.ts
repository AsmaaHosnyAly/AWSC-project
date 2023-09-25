import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Item1DialogComponent } from './item1-dialog.component';

describe('Item1DialogComponent', () => {
  let component: Item1DialogComponent;
  let fixture: ComponentFixture<Item1DialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Item1DialogComponent]
    });
    fixture = TestBed.createComponent(Item1DialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
