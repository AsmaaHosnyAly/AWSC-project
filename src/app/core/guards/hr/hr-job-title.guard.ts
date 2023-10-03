import { CanActivateFn } from '@angular/router';

export const hrJobTitleGuard: CanActivateFn = (route, state) => {
  return true;
};
