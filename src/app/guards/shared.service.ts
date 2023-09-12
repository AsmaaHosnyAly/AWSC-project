import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  userRoles :any
  pageTitle: any
  stores=false
  roles=false
  accounts=false
  time=false
  Benefits=false
  costs=false
  hr=false
  MechanicalCampaign=false
  labs=false
  LegalAffairs=false
  CentralWater=false
training=false
  withdraw=false;
  STRAdd=false;
  openingStock=false;
  employeeOpening=false;
  employeeOpeningCustody=false
  commodity=false
  grade=false
  strPlatoon=false
  group1=false
  unit=false
  items1 =false
  products=false
  store=false
  costCenter=false
  vendor=false
  model=false
  storesAccounts=false
  prUser=false
  transactionUserId=localStorage.getItem('transactionUserId')

  constructor() { 
    this.userRoles = localStorage.getItem('userRoles')?.split(',');
  }
}
