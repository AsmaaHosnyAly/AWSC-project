
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { GlobalService } from 'src/app/pages/services/global.service'; 
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ApiService } from '../../services/api.service';
import { ToastrService } from 'ngx-toastr';
import { HrEmployeeAttendanceScheduleDialogeComponent } from '../hr-employee-attendance-schedule-dialoge/hr-employee-attendance-schedule-dialoge.component';
import {DomSanitizer, SafeHtml} from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { HotkeysService } from 'angular2-hotkeys';
import { Hotkey } from 'angular2-hotkeys';

@Component({
  selector: 'app-hr-employee-attendance-schedule',
  templateUrl: './hr-employee-attendance-schedule.component.html',
  styleUrls: ['./hr-employee-attendance-schedule.component.css']
})
export class HrEmployeeAttendanceScheduleComponent implements OnInit {
  // myUrl='javascript:alert("attachment")';
  // mytrustedUrl;
  loading: boolean = false; // Flag variable
  file:any
  File = null;
  displayedColumns: string[] = ['name', 'employeeName', 'attendanceScheduleName', 'attendancePermissionName', 'action'];

  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private dialog: MatDialog, private api: ApiService, private toastr: ToastrService,public global:GlobalService,private hotkeysService: HotkeysService,private http: HttpClient) {
    // this.mytrustedUrl=sanitizer.bypassSecurityTrustUrl(this.myUrl)
 
    global.getPermissionUserRoles(12, 'stores', 'المنتجات', '')
   }

  ngOnInit(): void {
    this.getAllProducts();
    this.hotkeysService.add(new Hotkey('ctrl+o', (event: KeyboardEvent): boolean => {
      this.openDialog();
      return false; // Prevent the default browser behavior
    }));
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }


  getAllProducts() {
    this.api.getHrEmployeeAttendanceSchedule()
      .subscribe({
        next: (res) => {
          console.log("res of get all products: ", res);
          this.dataSource = new MatTableDataSource(res);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        },
        error: () => {
          alert("خطأ أثناء جلب سجلات المنتجات !!");
        }
      })
  }

  openDialog() {
    this.dialog.open(HrEmployeeAttendanceScheduleDialogeComponent, {
      width: '47%'
    }).afterClosed().subscribe(val => {
      if (val === 'save') {
        this.getAllProducts();
      }
    })
  }

  editProduct(row: any) {
    // console.log("edit row: ", row)
    this.dialog.open(HrEmployeeAttendanceScheduleDialogeComponent, {
      width: '47%',
      data: row
    }).afterClosed().subscribe(val => {
      if (val === 'update') {
        this.getAllProducts();
      }
    })
  }


  deleteProduct(id: number) {
    var result = confirm("هل ترغب بتاكيد مسح المنتج ؟ ");
    if (result) {
      this.api.deleteHrEmployeeAttendanceSchedule(id)
        .subscribe({
          next: (res) => {
            if(res == 'Succeeded'){
              console.log("res of deletestore:",res)
            alert('تم الحذف بنجاح');
            // this.toastrDeleteSuccess();

            this.getAllProducts()

          }else{
            alert(" لا يمكن الحذف لارتباطها بجداول اخري!")
          }
            // this.toastrDeleteSuccess();
            // alert("تم حذف المنتج بنجاح");
            // this.getAllProducts()
          },
          error: () => {
            alert('خطأ فى حذف العنصر');
          },
        })
    }

  }


  toastrDeleteSuccess(): void {
    this.toastr.success("تم الحذف بنجاح");
  }

}


