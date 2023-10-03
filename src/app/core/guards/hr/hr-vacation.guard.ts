import { CanActivateFn } from '@angular/router';

export const hrVacationGuard: CanActivateFn = (route, state) => {
  return true;
};
