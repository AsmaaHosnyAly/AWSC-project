import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';

import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ApiService } from '../../services/api.service';
import { ToastrService } from 'ngx-toastr';
import { HrEmployeeVacationDialogComponent } from '../hr-employee-vacation-dialog/hr-employee-vacation-dialog.component';
import { HrEmployeeVacationBalanceDialogComponent } from '../hr-employee-vacation-balance-dialog/hr-employee-vacation-balance-dialog.component';
import { HotkeysService } from 'angular2-hotkeys';
import { Hotkey } from 'angular2-hotkeys';
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

  constructor(private dialog: MatDialog,private hotkeysService: HotkeysService, private api: ApiService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.getHrEmployeeVacationBalance();
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
    this.dialog.open(HrEmployeeVacationBalanceDialogComponent, {
      width: '70%',
      height:'75%',
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
      width: '70%',
      height:'75%',
      data: row
    }).afterClosed().subscribe(val => {
      if (val === 'update') {
        this.getHrEmployeeVacationBalance();
      }
    })
  }

  deleteEmployeeVacationBalance(id: number) {
    var result = confirm('هل ترغب بتاكيد الحذف ؟ ');
    if (result) {
      this.api.deleteHrEmployeeVacationBalance(id)
      .subscribe({
        next: (res) => {
          if(res == 'Succeeded'){
            console.log("res of deletestore:",res)
            this.toastrDeleteSuccess();
              this.getHrEmployeeVacationBalance()
              
  
        }else{
          alert(" لا يمكن الحذف لارتباطها بجداول اخري!")
        }
        },
        error: () => {
          alert('خطأ فى حذف العنصر'); 
        },
      });
    }

  }


  toastrDeleteSuccess(): void {
    this.toastr.success("تم الحذف بنجاح");
  }
}
