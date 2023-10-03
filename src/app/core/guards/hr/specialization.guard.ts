import { CanActivateFn } from '@angular/router';

export const specializationGuard: CanActivateFn = (route, state) => {
  return true;
};
