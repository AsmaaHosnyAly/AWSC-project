import { Component } from '@angular/core';
import { GlobalService } from 'src/app/pages/services/global.service';

@Component({
  selector: 'app-str-accounts',
  templateUrl: './str-accounts.component.html',
  styleUrls: ['./str-accounts.component.css']
})
export class StrAccountsComponent {
constructor(global:GlobalService){
  global.getPermissionUserRoles('Accounts', 'fi-home', 'إدارة الحسابات ', 'iso')
}
}
