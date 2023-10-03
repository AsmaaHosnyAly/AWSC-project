import { CanActivateFn } from '@angular/router';

export const hrEmployeesGuard: CanActivateFn = (route, state) => {
  return true;
};
