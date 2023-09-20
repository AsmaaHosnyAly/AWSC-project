import { Component, Inject, LOCALE_ID, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from '../../services/api.service';
import { HttpClient } from '@angular/common/http';
import { formatDate } from '@angular/common';
import { StrOpeningStockDialogComponent } from '../../str/str-opening-stock-dialog/str-opening-stock-dialog.component';
import { ToastrService } from 'ngx-toastr';
import { PrGroupDialogComponent } from '../pr-group-dialog/pr-group-dialog.component';
import { PrUserDialogComponent } from '../pr-user-dialog/pr-user-dialog.component';
import { GlobalPositionStrategy } from '@angular/cdk/overlay';
import { GlobalService } from 'src/app/services/global.service';

@Component({
  selector: 'app-pr-user-table',
  templateUrl: './pr-user-table.component.html',
  styleUrls: ['./pr-user-table.component.css']
})
export class PrUserTableComponent implements OnInit {
  displayedColumns: string[] = [
    'name',
    'isActive',
    'Action',
  ];
  matchedIds: any;
  storeList: any;
  storeName: any;
  fiscalYearsList: any;
  itemsList: any;

  dataSource2!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private api: ApiService,
    private dialog: MatDialog,
    private http: HttpClient,
    @Inject(LOCALE_ID) private locale: string,
    private toastr: ToastrService,
    global:GlobalService
  ) { 
    global.getPermissionUserRoles(1, 'stores', 'الصلاحيات-المستخدمين', '')
  }

  ngOnInit(): void {
    this.getAllMasterForms();
    this.getItems();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource2.filter = filterValue.trim().toLowerCase();

    if (this.dataSource2.paginator) {
      this.dataSource2.paginator.firstPage();
    }
  }


  getAllMasterForms() {
    this.api.getPrUser().subscribe({
      next: (res) => {
        console.log('res of get all PrUser: ', res);
        this.dataSource2 = new MatTableDataSource(res);
        this.dataSource2.paginator = this.paginator;
        this.dataSource2.sort = this.sort;
      },
      error: () => {
        // alert('خطأ أثناء جلب سجلات المجموعة !!');
      },
    });
  }
  openDialog() {
    this.dialog.open(PrUserDialogComponent, {
      width: '98%',
      height:'90%'
    }).afterClosed().subscribe(val => {
      if (val === 'save') {
        this.getAllMasterForms();
      }
    })
  }
  editMasterForm(row: any) {
    this.dialog
      .open(PrUserDialogComponent, {
        width: '98%',
        height:'90%',
     data: row,
      })
      .afterClosed()
      .subscribe((val) => {
        if (val === 'update' || val === 'save') {
          this.getAllMasterForms();
        }
      });
  }

  deleteBothForms(id: number) {
    this.http.get<any>("http://ims.aswan.gov.eg/api/PRUserGroup/get/all")
      .subscribe(res => {
        this.matchedIds = res.filter((a: any) => {
          console.log("matched: ", a.userId === id)
          return a.userId === id
        })
        var result = confirm("هل ترغب بتاكيد حذف التفاصيل و الرئيسي؟");

        if (this.matchedIds.length) {
          for (let i = 0; i < this.matchedIds.length; i++) {
            if (result) {
              this.api.deletePrUserGroup(this.matchedIds[i].id)
                .subscribe({
                  next: (res) => {

                    this.api.deletePrUser(id)
                      .subscribe({
                        next: (res) => {
                          this.toastrDeleteSuccess();
                          this.getAllMasterForms();
                        },
                        error: () => {
                          // alert("خطأ أثناء حذف الرئيسي !!");
                        }
                      })

                  },
                  error: () => {
                    // alert("خطأ أثناء حذف التفاصيل !!");
                  }
                })
            }

          }
        }
        else {
          if (result) {
            this.api.deletePrUser(id)
              .subscribe({
                next: (res) => {
                  // res.code 
                  // if(res.code == 'succeeded'){
                  this.toastrDeleteSuccess();
                  this.getAllMasterForms();
                  // }
                  // else{
                  // alert("خطأ أثناء حذف الرئيسي !!!!!!!");

                  // }

                },
                error: () => {
                  alert("خطأ أثناء حذف الرئيسي !!");
                }
              })
          }
        }

      }, err => {
        // alert("خطا اثناء تحديد المجموعة !!")
      })
  }

  getItems() {
    this.api.getItems()
      .subscribe({
        next: (res) => {
          this.itemsList = res;
        },
        error: (err) => {
          // console.log("fetch items data err: ", err);
          // alert("خطا اثناء جلب العناصر !");
        }
      })
  }

  toastrDeleteSuccess(): void {
    this.toastr.success('تم الحذف بنجاح');
  }
}
