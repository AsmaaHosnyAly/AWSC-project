import { Component } from '@angular/core';
import { GlobalService } from '../services/global.service';
import { SharedService } from '../../core/guards/shared.service';
import { Router } from '@angular/router';
import { PagesEnums } from '../../core/enums/pages.enum';
import jwt_decode from 'jwt-decode';
import { Observable, map, startWith, tap, debounceTime } from 'rxjs';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { FormControl } from '@angular/forms';

export class store {
  constructor(public name: string) {}
}

@Component({
  selector: 'app-menubar',
  templateUrl: './menubar.component.html',
  styleUrls: ['./menubar.component.css'],
})
export class MenubarComponent {
  str1: any;
  pageTitle: any;
  badgevisible = false;
  newArr: any;
  badgevisibility() {
    this.badgevisible = true;
  }

  transactionUserId = localStorage.getItem('transactionUserId');
  user: any;
  userGroup: any;
  sharedStores: any;
  pageEnums = PagesEnums;
  decodedToken: any;
  decodedToken1: any;
  decodedToken2: any;
  testRout = 'withdraw';
  storeCtrl: FormControl;
  storeSelectedId: any;
  filteredstore: Observable<store[]>;
  storeList: store[] = [];
  selectedstore: store | undefined;
  sourceSelected: any;
  activeRoute: string | undefined;
  constructor(
    public global: GlobalService,
    public shared: SharedService,
    private router: Router
  ) {
    this.storeCtrl = new FormControl();
    this.filteredstore = this.storeCtrl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filterstores(value))
    );
    this.getUserById();

    this.getUserGroupById();
    //  this.global.getPermissionUserRoles(null, 'stores', 'الوحدة', '')
  }

  ngOnInit(): void {
    // this.getDestStores();

    this.activeRoute = this.router.url;
    this.global.bgColor = document
      .querySelector('section')
      ?.classList.add('screenBackground');

    // Retrieve the access token
    const accessToken: any = localStorage.getItem('accessToken');
    // console.log('accessToken', accessToken);
    // Decode the access token
    this.decodedToken = jwt_decode(accessToken);
    this.decodedToken1 = this.decodedToken.modules;
    this.decodedToken2 = this.decodedToken.roles;
    let tmpTabKV: { name: any}[] = [];

    console.log('decodedToken2 ', this.decodedToken);
    this.storeList = this.decodedToken2;
    console.log('modules list:', this.storeList);
    for (let i = 0; i < this.storeList.length; i++) {
      // this.newArr = {
      //   name: this.storeList[i],
      // };
      tmpTabKV.push({ name: this.storeList[i]});
    }

    console.log('newArr: ', tmpTabKV);
    this.storeList= tmpTabKV
  }
  title = 'str-group';

  showFiller = false;
  toggleButtonCounter = 0;

  plus() {
    this.toggleButtonCounter++;
  }

  getUserById() {
    this.global.getUserById(this.transactionUserId).subscribe((res) => {
      if (res) return (this.user = res);
      else this.user = '';
    });
  }
  getUserGroupById() {
    this.global.getUserGroup(this.transactionUserId).subscribe((res) => {
      // console.log('usergrop', this.userGroup);
      if (res) return (this.userGroup = res);
      else this.userGroup = '';
    });
  }

  handleLogOut() {
    localStorage.setItem('transactionUserId', '');
    localStorage.removeItem('userRoles');
    localStorage.removeItem('modules');
    // localStorage.removeItem('accessToken');
    this.global.isLogIn = false;
  }

  refresh() {
    window.location.reload();
  }

  hasAccessModule(name: string): boolean {
    // console.log('name passed: ', name);
    // const MODULES_LOCAL_STORAGE = window.localStorage.getItem('modules');
    const MODULES_LOCAL_STORAGE = this.decodedToken1;
    const MODULES: Array<any> = MODULES_LOCAL_STORAGE;
    // console.log('array : ', MODULES);
    if (MODULES != undefined) {
      return MODULES.some((i: any) => i == name);
    } else {
      return false;
    }
  }
  hasAccessRole(name: string): boolean {
    const USER_ROLES_LOCAL_STORAGE = this.decodedToken2;
    const USER_ROLES: Array<any> = USER_ROLES_LOCAL_STORAGE;

    if (USER_ROLES != undefined) {
      return USER_ROLES.some((i: any) => i == name);
    } else {
      return false;
    }
  }

  // autocomplete
  getsearch(code: any) {
    if (code.keyCode == 13) {
      // this.getSearchStrWithdraw()
    }
  }

  openAutostore() {
    this.storeCtrl.setValue(''); // Clear the input field value

    // Open the autocomplete dropdown by triggering the value change event
    this.storeCtrl.updateValueAndValidity();
  }

  displaystoreName(store: any): string {
    return store && store.name ? store.name : '';
  }

  storeSelected(event: MatAutocompleteSelectedEvent): void {
    const store = event.option.value as store;
    const store2= event.option.value
    console.log('store selected: ', store);
    this.selectedstore = store;
    console.log("store2: ",store2.name);

    if(store2.name ){
      this.router.navigate([`/${store2.name}`]);
    }
  
      // if(store2.name===this.pageEnums.WITHDRAW  ){
      //   this.router.navigate(['/withdraw']);
      // }
      // else if(store2.name===this.pageEnums.STRAdd  ){
      //   this.router.navigate(['/STRAdd']);
      // }
      // else if(store2.name===this.pageEnums.STR_OPENING_STOCK  ){
      //   this.router.navigate(['/str-openingStock']);
      // }
      // else if(store2.name===this.pageEnums.EMPLOYEE_OPENING  ){
      //   this.router.navigate(['/employeeOpening']);
      // }
    
  }
  storeValueChanges(storeId: any) {}
  getDestStores() {
    // this.global.getStore().subscribe({
    //   next: (res) => {
    //     this.storeList = res;
    //     // console.log('deststore res: ', this.deststoreList);
    //   },
    //   error: (err) => {

    //   },
    // });
    this.storeList = this.decodedToken;
    console.log('modules list:', this.storeList);
  }

  private _filterstores(value: string): store[] {
    const filterValue = value;
    return this.storeList.filter((store: { name: string }) =>
      store.name.toLowerCase().includes(filterValue)
    );
  }
}
