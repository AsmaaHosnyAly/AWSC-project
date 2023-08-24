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

@Component({
  selector: 'app-str-opening-stock-table',
  templateUrl: './str-opening-stock-table.component.html',
  styleUrls: ['./str-opening-stock-table.component.css'],
})
export class StrOpeningStockTableComponent implements OnInit {
  displayedColumns: string[] = [
    'no',
    'storeName',
    'fiscalyear',
    'date',
    'Action',
  ];
  matchedIds: any;
  storeList: any;
  storeName: any;
  fiscalYearsList: any;

  dataSource2!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private api: ApiService,
    private dialog: MatDialog,
    private http: HttpClient,
    @Inject(LOCALE_ID) private locale: string,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.getAllMasterForms();
    this.getStores();
    this.getFiscalYears();
  }

  getAllMasterForms() {
    this.api.getStrOpen().subscribe({
      next: (res) => {
        console.log('response of get all getGroup from api: ', res);
        this.dataSource2 = new MatTableDataSource(res);
        this.dataSource2.paginator = this.paginator;
        this.dataSource2.sort = this.sort;
      },
      error: () => {
        alert('خطأ أثناء جلب سجلات المجموعة !!');
      },
    });
  }

  editMasterForm(row: any) {
    this.dialog
      .open(StrOpeningStockDialogComponent, {
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
    var result = confirm('تاكيد الحذف ؟ ');

    if (result) {
      this.api.deleteStrOpen(id).subscribe({
        next: (res) => {
          // alert("تم حذف المجموعة بنجاح");

          this.http
            .get<any>(
              'http://ims.aswan.gov.eg/api/STROpeningStockDetails/get/all'
            )
            .subscribe(
              (res) => {
                this.matchedIds = res.filter((a: any) => {
                  // console.log("matched Id & HeaderId : ", a.HeaderId === id)
                  return a.HeaderId === id;
                });

                for (let i = 0; i < this.matchedIds.length; i++) {
                  this.deleteFormDetails(this.matchedIds[i].id);
                }
              },
              (err) => {
                alert('خطا اثناء تحديد المجموعة !!');
              }
            );

          this.toastrDeleteSuccess();
          this.getAllMasterForms();
        },
        error: () => {
          alert('خطأ أثناء حذف المجموعة !!');
        },
      });
    }
  }

  deleteFormDetails(id: number) {
    this.api.deleteStrOpenDetails(id).subscribe({
      next: (res) => {
        alert('تم حذف الصنف بنجاح');
        this.getAllMasterForms();
      },
      error: (err) => {
        // console.log("delete details err: ", err)
        alert('خطأ أثناء حذف الصنف !!');
      },
    });
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
        console.log('fiscalYears res in search: ', this.fiscalYearsList);
      },
      error: (err) => {
        // console.log("fetch fiscalYears data err: ", err);
        // alert("خطا اثناء جلب العناصر !");
      },
    });
  }

  getSearchStrOpen(no: any, store: any, date: any, fiscalYear: any) {
    console.log(
      'no. : ',
      no,
      'store : ',
      store,
      'date: ',
      date,
      'fiscalYear: ',
      fiscalYear
    );
    this.api.getStrOpenSearach(no, store, date, fiscalYear).subscribe({
      next: (res) => {
        console.log('search openingStock res: ', res);

        //enter no.
        if (no != '' && !store && !date && !fiscalYear) {
          // console.log("enter no. ")
          // console.log("no. : ", no, "store: ", store, "date: ", date)
          this.dataSource2 = res.filter((res: any) => res.no == no!);
          this.dataSource2.paginator = this.paginator;
          this.dataSource2.sort = this.sort;
        }

        //enter store
        else if (!no && store && !date && !fiscalYear) {
          // console.log("enter store. ")
          // console.log("enter no. & store & date ", "res : ", res, "input no. : ", no, "input store: ", store, "input date: ", date)
          this.dataSource2 = res.filter((res: any) => res.storeId == store);
          this.dataSource2.paginator = this.paginator;
          this.dataSource2.sort = this.sort;
        }

        //enter date
        else if (!no && !store && date && !fiscalYear) {
          // console.log("enter date. ")
          // console.log("enter no. & store & date ", "res : ", res, "input no. : ", no, "input store: ", store, "input date: ", date)
          this.dataSource2 = res.filter(
            (res: any) => formatDate(res.date, 'M/d/yyyy', this.locale) == date
          );
          this.dataSource2.paginator = this.paginator;
          this.dataSource2.sort = this.sort;
        }

        //enter fiscalYear
        else if (!no && !store && !date && fiscalYear) {
          // console.log("enter date. ")
          // console.log("enter no. & store & date ", "res : ", res, "input no. : ", no, "input store: ", store, "input date: ", date)
          this.dataSource2 = res.filter(
            (res: any) => res.fiscalyear == fiscalYear
          );
          this.dataSource2.paginator = this.paginator;
          this.dataSource2.sort = this.sort;
        }

        //enter no. & store
        else if (no && store && !date && !fiscalYear) {
          // console.log("enter no & store ")
          // console.log("enter no. & store & date ", "res : ", res, "input no. : ", no, "input store: ", store, "input date: ", date)
          this.dataSource2 = res.filter(
            (res: any) => res.no == no! && res.storeId == store
          );
          this.dataSource2.paginator = this.paginator;
          this.dataSource2.sort = this.sort;
        }

        //enter no. & date
        else if (no && !store && date && !fiscalYear) {
          // console.log("enter no & date ")
          // console.log("enter no. & store & date ", "res : ", res, "input no. : ", no, "input store: ", store, "input date: ", date)
          this.dataSource2 = res.filter(
            (res: any) =>
              res.no == no! &&
              formatDate(res.date, 'M/d/yyyy', this.locale) == date
          );
          this.dataSource2.paginator = this.paginator;
          this.dataSource2.sort = this.sort;
        }

        //enter store & date
        else if (!no && store && date && !fiscalYear) {
          // console.log("enter store & date ")
          // console.log("enter no. & store & date ", "res : ", res, "input no. : ", no, "input store: ", store, "input date: ", date)
          this.dataSource2 = res.filter(
            (res: any) =>
              res.storeId == store &&
              formatDate(res.date, 'M/d/yyyy', this.locale) == date
          );
          this.dataSource2.paginator = this.paginator;
          this.dataSource2.sort = this.sort;
        }

        //enter all data
        else if (no != '' && store != '' && date != '' && fiscalYear != '') {
          // console.log("enter all data. ")
          // console.log("enter no. & store & date ", "res : ", res, "input no. : ", no, "input store: ", store, "input date: ", date)
          this.dataSource2 = res.filter(
            (res: any) =>
              res.no == no! &&
              res.storeId == store &&
              formatDate(res.date, 'M/d/yyyy', this.locale) == date &&
              res.fiscalyear == fiscalYear
          );
          this.dataSource2.paginator = this.paginator;
          this.dataSource2.sort = this.sort;
        }

        //didn't enter any data
        else {
          // console.log("enter no data ")
          this.dataSource2 = res;
          this.dataSource2.paginator = this.paginator;
          this.dataSource2.sort = this.sort;
        }
      },
      error: (err) => {
        alert('Error');
      },
    });
  }

  toastrDeleteSuccess(): void {
    this.toastr.success('تم الحذف بنجاح');
  }
}
