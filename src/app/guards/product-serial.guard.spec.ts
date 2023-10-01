import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { productSerialGuard } from './product-serial.guard';

describe('productSerialGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => productSerialGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
