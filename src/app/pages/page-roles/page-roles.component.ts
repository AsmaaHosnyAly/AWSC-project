import { Component } from '@angular/core';
import { GlobalService } from '../services/global.service';
import { SharedService } from '../../core/guards/shared.service';

@Component({
  selector: 'app-page-roles',
  templateUrl: './page-roles.component.html',
  styleUrls: ['./page-roles.component.css']
})
export class PageRolesComponent {

  str1:any
  badgevisible = false;
  badgevisibility() {
    this.badgevisible = true;
  }

  transactionUserId = localStorage.getItem('transactionUserId');
  user: any;
  sharedStores: any;
  constructor(public global: GlobalService,  public shared: SharedService) {
    // this.refresh()
   
  
  //  this.str1=localStorage.getItem('stores')
  //   console.log(localStorage.getItem('stores'))
  //   this.shared.roles
  //   console.log('stores', this.shared.stores)
  // //   console.log('roles',this.shared.roles)
  // this.global.getPermissionUserRoles(1||2||3||4||5||6||7||8||9||10||11|12|13|14|15|16|17,'stores','','')
  // this.global.getPermissionRolesScreens(18||19,'الصلاحيات','')
 
  this.gitUserById();
 
   
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

  gitUserById() {
    this.global.getUserById(this.transactionUserId).subscribe((res) => {
      if (res) return (this.user = res);
      else this.user = '';
    });
  }

  handleLogOut() {
    localStorage.removeItem('userRoles');
    this.global.isLogIn = false;
  }

refresh(){
  
    window.location.reload();
  }
   
 
  }


  

