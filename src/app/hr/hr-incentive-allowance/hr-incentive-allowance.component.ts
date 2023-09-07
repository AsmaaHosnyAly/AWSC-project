import { Component,OnInit,ViewChild } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { StrGroupDialogComponent } from '../../str/str-group-dialog/str-group-dialog.component';
import { GlobalService } from '../../services/global.service';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatSort, MatSortModule} from '@angular/material/sort';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { ApiService } from '../../services/api.service';
import { ToastrService } from 'ngx-toastr';
import { HrIncentiveAllowanceDialogComponent } from '../hr-incentive-allowance-dialog/hr-incentive-allowance-dialog.component';

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

  constructor(private dialog: MatDialog, private api: ApiService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.getAllIncentiveAllowance();
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
