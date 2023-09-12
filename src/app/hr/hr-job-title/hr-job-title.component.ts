

import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { StrGroupDialogComponent } from '../../str/str-group-dialog/str-group-dialog.component';
import { GlobalService } from '../../services/global.service';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ApiService } from '../../services/api.service';
import { ToastrService } from 'ngx-toastr';
import { HrJobTitleDialogComponent } from '../hr-job-title-dialog/hr-job-title-dialog.component';
import {DomSanitizer, SafeHtml} from '@angular/platform-browser';
// import { GlobalService } from '../services/global.service';

@Component({
  selector: 'app-hr-job-title',
  templateUrl: './hr-job-title.component.html',
  styleUrls: ['./hr-job-title.component.css']
})
export class HrJobTitleComponent  implements OnInit {
 
  displayedColumns: string[] = ['name', 'action'];

  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private dialog: MatDialog, private api: ApiService, private toastr: ToastrService) {
   }

  ngOnInit(): void {
    this.getAllJobTitle();
    // console.log("shortlink",this.shortLink)
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }


  getAllJobTitle() {
    this.api.getHrJobTitle()
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
    this.dialog.open(HrJobTitleDialogComponent, {
      width: '30%'
    }).afterClosed().subscribe(val => {
      if (val === 'save') {
        this.getAllJobTitle();
      }
    })
  }


  editJobTitle(row: any) {
    // console.log("edit row: ", row)
    this.dialog.open(HrJobTitleDialogComponent, {
      width: '30%',
      data: row
    }).afterClosed().subscribe(val => {
      if (val === 'update') {
        this.getAllJobTitle();
      }
    })
  }
   


deleteJobTitle(id: number) {
    var result = confirm("هل ترغب بتاكيد مسح المنتج ؟ ");
    if (result) {
      this.api.deleteHrJobTitle(id)
        .subscribe({
          next: (res) => {
            this.toastrDeleteSuccess();
            alert("تم حذف المنتج بنجاح");
            this.getAllJobTitle()
          },
          error: () => {
            alert("خطأ أثناء حذف المنتج !!");
          }
        })
    }

  }

  toastrDeleteSuccess(): void {
    this.toastr.success("تم الحذف بنجاح");
  }

}