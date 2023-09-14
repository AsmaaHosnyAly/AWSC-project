import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  userRoles :any
  pageTitle: any
  stores=true
  roles=true
  accounts=true
  time=true
  Benefits=true
  costs=true
  hr=true
  MechanicalCampaign=true
  labs=true
  LegalAffairs=true
  CentralWater=true
training=true
  withdraw=true;
  STRAdd=true;
  openingStock=true;
  employeeOpening=true;
  employeeOpeningCustody=true
  commodity=true
  grade=true
  strPlatoon=true
  group1=true
  unit=true
  items1 =true
  products=true
  store=true
  costCenter=true
  vendor=true
  model=true
  storesAccounts=true
  prUser=true
  prGroup=true
  transactionUserId=localStorage.getItem('transactionUserId')

  constructor() { 
    this.userRoles = localStorage.getItem('userRoles')?.split(',');
  }
}
