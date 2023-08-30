import { Component, Inject, LOCALE_ID, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from '../services/api.service';
import { HttpClient } from '@angular/common/http';
import { formatDate } from '@angular/common';
import { StrOpeningStockDialogComponent } from '../str-opening-stock-dialog/str-opening-stock-dialog.component';
import { ToastrService } from 'ngx-toastr';
import { PrGroupDialogComponent } from '../pr-group-dialog/pr-group-dialog.component';

@Component({
  selector: 'app-pr-group-table',
  templateUrl: './pr-group-table.component.html',
  styleUrls: ['./pr-group-table.component.css']
})
export class PrGroupTableComponent implements OnInit {
  displayedColumns: string[] = [
    'name',
    'createUserName',
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
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.getAllMasterForms();
    this.getStores();
    this.getFiscalYears();
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
    this.api.getPrGroup().subscribe({
      next: (res) => {
        console.log('res of get all PrGroup: ', res);
        this.dataSource2 = new MatTableDataSource(res);
        this.dataSource2.paginator = this.paginator;
        this.dataSource2.sort = this.sort;
      },
      error: () => {
        // alert('خطأ أثناء جلب سجلات المجموعة !!');
      },
    });
  }
  openOpeningStockDialog() {
    this.dialog.open(PrGroupDialogComponent, {
      width: '90%'
    }).afterClosed().subscribe(val => {
      if (val === 'save') {
        // this.getAllGroups();
      }
    })
  }
  editMasterForm(row: any) {
    this.dialog
      .open(PrGroupDialogComponent, {
        width: '90%',
        data: row,
      })
      .afterClosed()
      .subscribe((val) => {
        if (val === 'update') {
          this.getAllMasterForms();
        }
      });
  }

  deleteBothForms(id: number) {
    this.http.get<any>("http://ims.aswan.gov.eg/api/PRGroupRole/get/all")
      .subscribe(res => {
        this.matchedIds = res.filter((a: any) => {
          console.log("matched: ", a.groupId === id)
          return a.groupId === id
        })
        var result = confirm("هل ترغب بتاكيد حذف التفاصيل و الرئيسي؟");

        if (this.matchedIds.length) {
          for (let i = 0; i < this.matchedIds.length; i++) {
            if (result) {
              this.api.deletePrGroupRole(this.matchedIds[i].id)
                .subscribe({
                  next: (res) => {

                    this.api.deletePrGroup(id)
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
            this.api.deletePrGroup(id)
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

  getStores() {
    this.api.getStore().subscribe({
      next: (res) => {
        this.storeList = res;
        // console.log("store res: ", this.storeList);
      },
      error: (err) => {
        // console.log("fetch store data err: ", err);
        alert('خطا اثناء جلب المخازن !');
      },
    });
  }
  printReport() {
    let buttn: any = document.querySelectorAll('#buttn');
    console.log(buttn);

    let header: any = document.getElementById('header');
    console.log(header);

    let paginator: any = document.getElementById('paginator');
    console.log(paginator);

    let actionheade: any = document.getElementById('action-header');
    actionheade.style.display = 'none';

    let action1: any = document.getElementById('action1');
    console.log(action1);
    let action2: any = document.querySelectorAll('action2');
    console.log(action2);

    let button1: any = document.querySelectorAll('#button1');
    console.log(button1);
    let button2: any = document.getElementById('button2');
    console.log(button2);
    let button: any = document.getElementsByClassName('mdc-icon-button');
    console.log(button);
    let reportFooter: any = document.getElementById('reportFooter');
    console.log(reportFooter);
    let date: any = document.getElementById('date');
    console.log(date);
    header.style.display = 'grid';
    // button1.style.display = 'none';
    // button2.style.display = 'none';
    for (let i = 0; i < buttn.length; i++) {
      buttn[i].hidden = true;
    }
    let printContent: any = document.getElementById('content')?.innerHTML;
    let originalContent: any = document.body.innerHTML;
    document.body.innerHTML = printContent;
    // console.log(document.body.children);
    document.body.style.cssText =
      'direction:rtl;-webkit-print-color-adjust:exact;';
    window.print();
    document.body.innerHTML = originalContent;
    location.reload();
  }

  getFiscalYears() {
    this.api.getFiscalYears().subscribe({
      next: (res) => {
        this.fiscalYearsList = res;
      },
      error: (err) => {
        // console.log("fetch fiscalYears data err: ", err);
        // alert("خطا اثناء جلب العناصر !");
      },
    });
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

  getSearchStrOpen(no: any, store: any, date: any, fiscalYear: any, itemId: any) {
    this.api.getStrOpenSearach(no, store, date, fiscalYear, itemId)
      .subscribe({
        next: (res) => {
          this.dataSource2 = res
          this.dataSource2.paginator = this.paginator;
          this.dataSource2.sort = this.sort;
        }
      });
  }

  toastrDeleteSuccess(): void {
    this.toastr.success('تم الحذف بنجاح');
  }
}
