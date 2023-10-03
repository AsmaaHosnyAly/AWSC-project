import { CanActivateFn } from '@angular/router';

export const hrPositionGuard: CanActivateFn = (route, state) => {
  return true;
};
