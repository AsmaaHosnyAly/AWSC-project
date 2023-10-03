import { CanActivateFn } from '@angular/router';

export const employeesQualificationGuard: CanActivateFn = (route, state) => {
  return true;
};
