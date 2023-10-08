import { CanActivateFn } from '@angular/router';

export const storesAccountsGuard: CanActivateFn = (route, state) => {
  return true;
};
