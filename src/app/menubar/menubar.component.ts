import { Component } from '@angular/core';
import { GlobalService } from '../services/global.service';
import { SharedService } from '../guards/shared.service';

@Component({
  selector: 'app-menubar',
  templateUrl: './menubar.component.html',
  styleUrls: ['./menubar.component.css'],
})
export class MenubarComponent {
  badgevisible = false;
  badgevisibility() {
    this.badgevisible = true;
  }

  transactionUserId = localStorage.getItem('transactionUserId');
  user: any;
  sharedStores: any;
  constructor(public global: GlobalService,  public shared: SharedService) {
    this.gitUserById();
    // if(localStorage.getItem('token')) this.global.isLogIn = true
    // console.log(this.global.isLogIn)

    // console.log(this.global.userRoles)
    let userRole = localStorage.getItem('userRoles');
    this.gitUserById();

    //  this.global.getPermissionUserRoles(null, 'stores', 'الوحدة', '')
  }

  ngOnInit(): void {
    this.global.bgColor = document
      .querySelector('section')
      ?.classList.add('screenBackground');

      console.log("vvvv, ",this.shared.stores )
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
    localStorage.removeItem('token');
    this.global.isLogIn = false;
  }
}
