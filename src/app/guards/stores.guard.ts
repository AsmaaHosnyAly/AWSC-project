import { CanActivateFn } from '@angular/router';

export const storesGuard: CanActivateFn = (route, state) => {
  return true;
};
