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
import { HrEmployeeVacationBalanceDialogComponent } from '../hr-employee-vacation-balance-dialog/hr-employee-vacation-balance-dialog.component';

@Component({
  selector: 'app-hr-employee-vacation-balance',
  templateUrl: './hr-employee-vacation-balance.component.html',
  styleUrls: ['./hr-employee-vacation-balance.component.css']
})
export class HrEmployeeVacationBalanceComponent implements OnInit{
  displayedColumns: string[] = ['name', 'balance', 'employeeName', 'vactionName', 'year', 'action'];

  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private dialog: MatDialog, private api: ApiService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.getHrEmployeeVacationBalance();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  openDialog() {
    this.dialog.open(HrEmployeeVacationBalanceDialogComponent, {
      width: '30%'
    }).afterClosed().subscribe(val => {
      if (val === 'save') {
        this.getHrEmployeeVacationBalance();
      }
    })
  }

  getHrEmployeeVacationBalance() {
    this.api.getHrEmployeeVacationBalance()
      .subscribe({
        next: (res) => {
          console.log("res of get all HrEmployeeVacationBalance: ", res);
          this.dataSource = new MatTableDataSource(res);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        },
        error: () => {
          alert("خطأ أثناء جلب سجلات رصيد اجازات الموظفين !!");
        }
      })
  }

  editEmployeeVacationBalance(row: any) {
    // console.log("edit row: ", row)
    this.dialog.open(HrEmployeeVacationBalanceDialogComponent, {
      width: '30%',
      data: row
    }).afterClosed().subscribe(val => {
      if (val === 'update') {
        this.getHrEmployeeVacationBalance();
      }
    })
  }

  deleteEmployeeVacationBalance(id: number) {
    var result = confirm("هل ترغب بتاكيد مسح رصيد اجازة الموظف ؟ ");
    if (result) {
      this.api.deleteHrEmployeeVacationBalance(id)
        .subscribe({
          next: (res) => {
            this.toastrDeleteSuccess();
            // alert("تم حذف رصيد اجازة الموظف بنجاح");
            this.getHrEmployeeVacationBalance()
          },
          error: () => {
            alert("خطأ أثناء حذف رصيد اجازة الموظف !!");
          }
        })
    }

  }

  toastrDeleteSuccess(): void {
    this.toastr.success("تم الحذف بنجاح");
  }
}
