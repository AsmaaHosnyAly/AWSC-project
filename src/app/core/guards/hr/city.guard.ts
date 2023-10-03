import { CanActivateFn } from '@angular/router';

export const cityGuard: CanActivateFn = (route, state) => {
  return true;
};
