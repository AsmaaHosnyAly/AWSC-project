import { CanActivateFn } from '@angular/router';

export const items1Guard: CanActivateFn = (route, state) => {
  return true;
};
