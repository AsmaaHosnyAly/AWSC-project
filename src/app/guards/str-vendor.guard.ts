import { CanActivateFn } from '@angular/router';

export const strVendorGuard: CanActivateFn = (route, state) => {
  return true;
};
