import { CanActivateFn } from '@angular/router';

export const productSerialGuard: CanActivateFn = (route, state) => {
  return true;
};
