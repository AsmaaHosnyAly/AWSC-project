import { CanActivateFn } from '@angular/router';

export const severanceReasonGuard: CanActivateFn = (route, state) => {
  return true;
};
