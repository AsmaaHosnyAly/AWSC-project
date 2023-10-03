import { CanActivateFn } from '@angular/router';

export const hrEmployeePositionGuard: CanActivateFn = (route, state) => {
  return true;
};
