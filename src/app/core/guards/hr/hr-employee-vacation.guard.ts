import { CanActivateFn } from '@angular/router';

export const hrEmployeeVacationGuard: CanActivateFn = (route, state) => {
  return true;
};
