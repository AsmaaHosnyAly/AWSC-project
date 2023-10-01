import { CanActivateFn } from '@angular/router';

export const strModelGuard: CanActivateFn = (route, state) => {
  return true;
};
