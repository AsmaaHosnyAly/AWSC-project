import { CanActivateFn } from '@angular/router';

export const workPlaceGuard: CanActivateFn = (route, state) => {
  return true;
};
