import { CanActivateFn } from '@angular/router';

export const cityStateGuard: CanActivateFn = (route, state) => {
  return true;
};
