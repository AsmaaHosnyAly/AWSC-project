import { CanActivateFn } from '@angular/router';

export const costCenterGuard: CanActivateFn = (route, state) => {
  return true;
};
