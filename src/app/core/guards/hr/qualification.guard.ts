import { CanActivateFn } from '@angular/router';

export const qualificationGuard: CanActivateFn = (route, state) => {
  return true;
};
