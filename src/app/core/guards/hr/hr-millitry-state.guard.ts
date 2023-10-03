import { CanActivateFn } from '@angular/router';

export const hrMillitryStateGuard: CanActivateFn = (route, state) => {
  return true;
};
