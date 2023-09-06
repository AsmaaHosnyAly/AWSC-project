import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { withdrawGuard } from './withdraw.guard';

describe('withdrawGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => withdrawGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
