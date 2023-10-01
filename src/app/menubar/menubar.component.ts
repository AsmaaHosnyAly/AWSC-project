import { Component } from '@angular/core';
import { GlobalService } from '../pages/services/global.service'; 
import { SharedService } from '../core/guards/shared.service';
import { Router } from '@angular/router';
import { PagesEnums } from '../core/enums/pages.enum';

@Component({
  selector: 'app-menubar',
  templateUrl: './menubar.component.html',
  styleUrls: ['./menubar.component.css'],
})
export class MenubarComponent {
  str1:any
  pageTitle:any
  badgevisible = false;
  badgevisibility() {
    this.badgevisible = true;
  }

  transactionUserId = localStorage.getItem('transactionUserId');
  user: any;
  userGroup:any
  sharedStores: any;
  pageEnums = PagesEnums
  constructor(public global: GlobalService,  public shared: SharedService,  private router: Router) {
    // this.refresh()
   
  
  //  this.str1=localStorage.getItem('stores')
  //   console.log(localStorage.getItem('stores'))
  //   this.shared.roles
  //   console.log('stores', this.shared.stores)
  // //   console.log('roles',this.shared.roles)
  // this.global.getPermissionUserRoles(1||2||3||4||5||6||7||8||9||10||11|12|13|14|15|16|17,'stores','','')
  // this.global.getPermissionRolesScreens(18||19,'الصلاحيات','')
 
  this.getUserById();
 
   this.getUserGroupById()
    //  this.global.getPermissionUserRoles(null, 'stores', 'الوحدة', '')
  }

  ngOnInit(): void {
    this.global.bgColor = document
      .querySelector('section')
      ?.classList.add('screenBackground');
    
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
      console.log('usergrop',this.userGroup)
      if (res) return (this.userGroup = res);
      else this.userGroup = '';
    });
  }

 

  handleLogOut() {
    localStorage.setItem('transactionUserId','')
    localStorage.removeItem('userRoles');
    localStorage.removeItem('modules');
    this.global.isLogIn = false;
    
  }

refresh(){
  
    window.location.reload();
  }

  hasAccessModule(id:number):boolean{
    const MODULES_LOCAL_STORAGE = window.localStorage.getItem('modules') 
    const MODULES : Array<any> =MODULES_LOCAL_STORAGE!.split(',')
    return MODULES.some((i:any)=>i == id)
  }
  hasAccessRole(id:number):boolean{
    const USER_ROLES_LOCAL_STORAGE = window.localStorage.getItem('userRoles') 
    const USER_ROLES : Array<any> = USER_ROLES_LOCAL_STORAGE!.split(',')
    return USER_ROLES.some((i:any)=>i == id)
  }

   
 
  }


  

