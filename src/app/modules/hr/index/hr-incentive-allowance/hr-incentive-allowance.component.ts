import { Component,OnInit,ViewChild } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';

import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatSort, MatSortModule} from '@angular/material/sort';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { ApiService } from '../../services/api.service';
import { ToastrService } from 'ngx-toastr';
import { HrIncentiveAllowanceDialogComponent } from '../hr-incentive-allowance-dialog/hr-incentive-allowance-dialog.component';
import { HotkeysService } from 'angular2-hotkeys';
import { Hotkey } from 'angular2-hotkeys';
import { GlobalService } from 'src/app/pages/services/global.service';
@Component({
  selector: 'app-hr-incentive-allowance',
  templateUrl: './hr-incentive-allowance.component.html',
  styleUrls: ['./hr-incentive-allowance.component.css']
})
export class HrIncentiveAllowanceComponent implements OnInit{
  displayedColumns: string[] = ['no', 'employeename', 'fiscalYearName', 'date', 'action'];

  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private dialog: MatDialog,private hotkeysService: HotkeysService, private api: ApiService, private toastr: ToastrService,private global:GlobalService) { 
    global.getPermissionUserRoles('HR', '', 'شئون العاملين', '')
  }

  ngOnInit(): void {
    this.getAllIncentiveAllowance();
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
    this.dialog.open(HrIncentiveAllowanceDialogComponent, {
      width: '30%'
    }).afterClosed().subscribe(val => {
      if (val === 'save') {
        this.getAllIncentiveAllowance();
      }
    })
  }

  getAllIncentiveAllowance() {
    this.api.getHrIncentiveAllowance()
      .subscribe({
        next: (res) => {
          console.log("res of get all IncentiveAllowance: ", res);
          this.dataSource = new MatTableDataSource(res);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        },
        error: () => {
          alert("خطأ أثناء جلب سجلات الحوافز !!");
        }
      })
  }

  editIncentiveAllowance(row: any) {
    // console.log("edit row: ", row)
    this.dialog.open(HrIncentiveAllowanceDialogComponent, {
      width: '30%',
      data: row
    }).afterClosed().subscribe(val => {
      if (val === 'update') {
        this.getAllIncentiveAllowance();
      }
    })
  }

  deleteIncentiveAllowance(id: number) {
    var result = confirm("هل ترغب بتاكيد مسح الحافز ؟ ");
    if (result) {
      this.api.deleteHrIncentiveAllowance(id)
        .subscribe({
          next: (res) => {
            this.toastrDeleteSuccess();
            // alert("تم حذف الحافز بنجاح");
            this.getAllIncentiveAllowance()
          },
          error: () => {
            alert("خطأ أثناء حذف الحافز !!");
          }
        })
    }

  }

  toastrDeleteSuccess(): void {
    this.toastr.success("تم الحذف بنجاح");
  }
}
