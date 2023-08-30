import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { StrGroupDialogComponent } from '../str-group-dialog/str-group-dialog.component';
import { GlobalService } from '../services/global.service';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ApiService } from '../services/api.service';
import { ToastrService } from 'ngx-toastr';
import { HrHiringTypeDialogComponent } from '../hr-hiring-type-dialog/hr-hiring-type-dialog.component';
import { HrEmployeeVacationDialogComponent } from '../hr-employee-vacation-dialog/hr-employee-vacation-dialog.component';

@Component({
  selector: 'app-hr-employee-vacation',
  templateUrl: './hr-employee-vacation.component.html',
  styleUrls: ['./hr-employee-vacation.component.css']
})
export class HrEmployeeVacationComponent implements OnInit{
  displayedColumns: string[] = ['name', 'nodDays', 'emplpoyeeName', 'vacationName', 'startDate', 'endDate', 'action'];

  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private dialog: MatDialog, private api: ApiService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.getHrEmployeeVacation();
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
      width: '30%'
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
      width: '30%',
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
