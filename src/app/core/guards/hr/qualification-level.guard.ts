import { CanActivateFn } from '@angular/router';

export const qualificationLevelGuard: CanActivateFn = (route, state) => {
  return true;
};
