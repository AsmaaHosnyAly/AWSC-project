import { Component } from '@angular/core';
import { GlobalService } from '../services/global.service';
import { SharedService } from '../../core/guards/shared.service';
import { Router } from '@angular/router';
import { PagesEnums } from '../../core/enums/pages.enum';
import jwt_decode from 'jwt-decode';

@Component({
  selector: 'app-menubar',
  templateUrl: './menubar.component.html',
  styleUrls: ['./menubar.component.css'],
})
export class MenubarComponent {
  str1: any;
  pageTitle: any;
  badgevisible = false;
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
  constructor(
    public global: GlobalService,
    public shared: SharedService,
    private router: Router
  ) {
    // this.refresh()

    //  this.str1=localStorage.getItem('stores')
    //   console.log(localStorage.getItem('stores'))
    //   this.shared.roles
    //   console.log('stores', this.shared.stores)
    // //   console.log('roles',this.shared.roles)
    // this.global.getPermissionUserRoles(1||2||3||4||5||6||7||8||9||10||11|12|13|14|15|16|17,'stores','','')
    // this.global.getPermissionRolesScreens(18||19,'الصلاحيات','')

    this.getUserById();

    this.getUserGroupById();
    //  this.global.getPermissionUserRoles(null, 'stores', 'الوحدة', '')
  }

  ngOnInit(): void {
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

    console.log('decodedToken2 ', this.decodedToken2);
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
      console.log('usergrop', this.userGroup);
      if (res) return (this.userGroup = res);
      else this.userGroup = '';
    });
  }

  handleLogOut() {
    localStorage.setItem('transactionUserId', '');
    localStorage.removeItem('userRoles');
    localStorage.removeItem('modules');
    localStorage.removeItem('accessToken');
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
}
