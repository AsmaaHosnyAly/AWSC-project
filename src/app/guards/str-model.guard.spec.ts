import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { strModelGuard } from './str-model.guard';

describe('strModelGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => strModelGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
