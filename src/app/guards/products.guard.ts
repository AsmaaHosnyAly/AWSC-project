import { CanActivateFn } from '@angular/router';

export const productsGuard: CanActivateFn = (route, state) => {
  return true;
};
