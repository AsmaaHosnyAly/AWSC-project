import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  stores=false
  roles=false
  accounts=false
  hr=false
  withdraw=false;
  STRAdd=false;
  openingStock=false;
  employeeOpening=false;
  employeeOpeningCustody=false
  constructor() { }
}
