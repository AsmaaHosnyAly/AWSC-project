import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ApiService } from '../../services/api.service';
import { ToastrService } from 'ngx-toastr';
import { HrHiringTypeDialogComponent } from '../hr-hiring-type-dialog/hr-hiring-type-dialog.component';
import { HrEmployeeVacationDialogComponent } from '../hr-employee-vacation-dialog/hr-employee-vacation-dialog.component';
import { HotkeysService } from 'angular2-hotkeys';
import { Hotkey } from 'angular2-hotkeys';
import { GlobalService } from 'src/app/pages/services/global.service';
@Component({
  selector: 'app-hr-employee-vacation',
  templateUrl: './hr-employee-vacation.component.html',
  styleUrls: ['./hr-employee-vacation.component.css']
})
export class HrEmployeeVacationComponent implements OnInit{
  displayedColumns: string[] = ['name', 'nodDays', 'emplpoyeeName','substituteEmpolyeeName', 'vacationName', 'startDate', 'endDate', 'action'];

  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private dialog: MatDialog,private hotkeysService: HotkeysService, private api: ApiService, private toastr: ToastrService,private global:GlobalService) {
    global.getPermissionUserRoles('HR', '', 'شئون العاملين', '')
   }

  ngOnInit(): void {
    this.getHrEmployeeVacation();
    this.hotkeysService.add(new Hotkey('ctrl+o', (event: KeyboardEvent): boolean => {
      // Call the deleteGrade() function in the current component
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

  openDialog() {
    this.dialog.open(HrEmployeeVacationDialogComponent, {
      width: '70%',
      height:'75%',
        }).afterClosed().subscribe(val => {
      if (val === 'save') {
        this.getHrEmployeeVacation();
      }
    })
  }

  getHrEmployeeVacation() {
    this.api.getHrEmployeeVacation()
      .subscribe({
        next: (res) => {
          console.log("res of get all HrEmployeeVacation: ", res);
          this.dataSource = new MatTableDataSource(res);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        },
        error: () => {
          alert("خطأ أثناء جلب سجلات انواع اجازات الموظفين !!");
        }
      })
  }

  editEmployeeVacation(row: any) {
    // console.log("edit row: ", row)
    this.dialog.open(HrEmployeeVacationDialogComponent, {
      width: '70%',
      height:'75%',
            data: row
    }).afterClosed().subscribe(val => {
      if (val === 'update') {
        this.getHrEmployeeVacation();
      }
    })
  }

  deleteEmployeeVacation(id: number) {
    var result = confirm("هل ترغب بتاكيد مسح نوع اجازة الموظف ؟ ");
    if (result) {
      this.api.deleteHrEmployeeVacation(id)
        .subscribe({
          next: (res) => {
            this.toastrDeleteSuccess();
            // alert("تم حذف نوع اجازة الموظف بنجاح");
            this.getHrEmployeeVacation()
          },
          error: () => {
            alert("خطأ أثناء حذف نوع اجازة الموظف !!");
          }
        })
    }

  }

  toastrDeleteSuccess(): void {
    this.toastr.success("تم الحذف بنجاح");
  }
}
