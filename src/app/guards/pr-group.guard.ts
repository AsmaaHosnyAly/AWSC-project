import { CanActivateFn } from '@angular/router';

export const prGroupGuard: CanActivateFn = (route, state) => {
  return true;
};
