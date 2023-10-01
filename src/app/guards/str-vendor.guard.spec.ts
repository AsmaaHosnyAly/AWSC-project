import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { strVendorGuard } from './str-vendor.guard';

describe('strVendorGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => strVendorGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
