import { Component } from '@angular/core';
import { GlobalService } from 'src/app/pages/services/global.service';

@Component({
  selector: 'app-hr-attendanc-home',
  templateUrl: './hr-attendanc-home.component.html',
  styleUrls: ['./hr-attendanc-home.component.css']
})
export class HrAttendancHomeComponent {
constructor(global:GlobalService){
  global.getPermissionUserRoles('Attendance', 'hr-AttendanceHome', 'الحضور والإنصراف', 'book')
}
}
