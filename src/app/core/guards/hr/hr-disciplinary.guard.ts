import { CanActivateFn } from '@angular/router';

export const hrDisciplinaryGuard: CanActivateFn = (route, state) => {
  return true;
};
