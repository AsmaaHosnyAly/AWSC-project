import { CanActivateFn } from '@angular/router';

export const modelGuard: CanActivateFn = (route, state) => {
  return true;
};
