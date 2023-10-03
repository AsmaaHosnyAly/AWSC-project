import { CanActivateFn } from '@angular/router';

export const qualitativeGroupGuard: CanActivateFn = (route, state) => {
  return true;
};
