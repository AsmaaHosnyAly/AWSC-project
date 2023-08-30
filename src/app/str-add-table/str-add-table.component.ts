import { Component, Inject, LOCALE_ID, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from '../services/api.service';
import { HttpClient } from '@angular/common/http';
import { formatDate } from '@angular/common';
import { STRAddDialogComponent } from '../str-add-dialog/str-add-dialog.component';
import { GlobalService } from '../services/global.service';

@Component({
  selector: 'app-str-add-table',
  templateUrl: './str-add-table.component.html',
  styleUrls: ['./str-add-table.component.css'],
})
export class STRAddTableComponent implements OnInit {
  displayedColumns: string[] = [
    'no',
    'storeName',
    'sourceStoreName',
    'sellerName',
    'receiptName',
    'employeeName',
    'TypeName',
    'date',
    'Action',
  ];
  matchedIds: any;
  storeList: any;
  typeList: any;
  ReceiptList: any;
  sourceStoreList: any;
  employeeList: any;
  sellerList: any;
  storeName: any;
  sourceStoreName: any;
  sellerName: any;
  receiptName: any;
  employeeName: any;
  TypeName: any;

  dataSource2!: MatTableDataSource<any>;
  

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  
  dataSource!: MatTableDataSource<any>;

  
  constructor(private api: ApiService,private global:GlobalService, private dialog: MatDialog, private http: HttpClient, @Inject(LOCALE_ID) private locale: string) {
    this.global.getPermissionUserRoles(2, 'stores', ' إذن إضافة ', '')
  }

  ngOnInit(): void {
    this.getAllMasterForms();
    this.getStores();
    this.getTypes();
    this.getSellers();
    this.getReciepts();
    this.getEmployees();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource2.filter = filterValue.trim().toLowerCase();

    if (this.dataSource2.paginator) {
      this.dataSource2.paginator.firstPage();
    }
  }

  getAllMasterForms() {
    this.api.getStrAdd().subscribe({
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

  openAddDialog() {
    this.dialog.open(STRAddDialogComponent, {
      width: '90%'
    }).afterClosed().subscribe(val => {
      if (val === 'save') {
        this.getAllGroups();
      }
    })
  }

  getAllGroups() {
    this.api.getGroup()
      .subscribe({
        next: (res) => {
          this.dataSource = new MatTableDataSource(res);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        },
        error: () => {
          // alert("خطأ أثناء جلب سجلات المجموعة !!");
        }
      })
  }

  editMasterForm(row: any) {
    this.dialog
      .open(STRAddDialogComponent, {
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
      this.api.deleteStrAdd(id).subscribe({
        next: (res) => {
          // alert("تم حذف المجموعة بنجاح");

          this.http
            .get<any>('http://ims.aswan.gov.eg/api/STRAddDetails/get/all')
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

          this.getAllMasterForms();
        },
        error: () => {
          alert('خطأ أثناء حذف المجموعة !!');
        },
      });
    }
  }

  deleteFormDetails(id: number) {
    this.api.deleteStrAdd(id).subscribe({
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
  getTypes() {
    this.api.getType().subscribe({
      next: (res) => {
        this.typeList = res;
        // console.log("store res: ", this.storeList);
      },
      error: (err) => {
        // console.log("fetch store data err: ", err);
        // alert("خطا اثناء جلب المخازن !");
      },
    });
  }
  getSellers() {
    this.api.getSeller().subscribe({
      next: (res) => {
        this.sellerList = res;
        // console.log("store res: ", this.storeList);
      },
      error: (err) => {
        // console.log("fetch store data err: ", err);
        // alert("خطا اثناء جلب المخازن !");
      },
    });
  }
  getReciepts() {
    this.api.getReciept().subscribe({
      next: (res) => {
        this.ReceiptList = res;
        // console.log("store res: ", this.storeList);
      },
      error: (err) => {
        // console.log("fetch store data err: ", err);
        // alert("خطا اثناء جلب المخازن !");
      },
    });
  }
  getEmployees() {
    this.api.getEmployee().subscribe({
      next: (res) => {
        this.employeeList = res;
        // console.log("store res: ", this.storeList);
      },
      error: (err) => {
        // console.log("fetch store data err: ", err);
        // alert("خطا اثناء جلب المخازن !");
      },
    });
  }

  getSearchStrAdd(no: any, store: any, date: any) {
    console.log('no. : ', no, 'store : ', store, 'date: ', date);
    this.api.getStrAddSearach(no, store, date).subscribe({
      next: (res) => {
        console.log('search addStock res: ', res);

        //enter no.
        if (no != '' && !store && !date) {
          // console.log("enter no. ")
          // console.log("no. : ", no, "store: ", store, "date: ", date)
          this.dataSource2 = res.filter((res: any) => res.no == no!);
          console.log('data after if :', this.dataSource2);
          this.dataSource2.paginator = this.paginator;
          this.dataSource2.sort = this.sort;
        }

        //enter store
        else if (!no && store && !date) {
          // console.log("enter store. ")
          // console.log("enter no. & store & date ", "res : ", res, "input no. : ", no, "input store: ", store, "input date: ", date)
          this.dataSource2 = res.filter((res: any) => res.storeId == store);
          this.dataSource2.paginator = this.paginator;
          this.dataSource2.sort = this.sort;
        }

        //enter date
        else if (!no && !store && date) {
          // console.log("enter date. ")
          // console.log("enter no. & store & date ", "res : ", res, "input no. : ", no, "input store: ", store, "input date: ", date)
          this.dataSource2 = res.filter(
            (res: any) => formatDate(res.date, 'M/d/yyyy', this.locale) == date
          );
          this.dataSource2.paginator = this.paginator;
          this.dataSource2.sort = this.sort;
        }

        //enter no. & store
        else if (no && store && !date) {
          // console.log("enter no & store ")
          // console.log("enter no. & store & date ", "res : ", res, "input no. : ", no, "input store: ", store, "input date: ", date)
          this.dataSource2 = res.filter(
            (res: any) => res.no == no! && res.storeId == store
          );
          this.dataSource2.paginator = this.paginator;
          this.dataSource2.sort = this.sort;
        }

        //enter no. & date
        else if (no && !store && date) {
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
        else if (!no && store && date) {
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
        else if (no != '' && store != '' && date != '') {
          // console.log("enter all data. ")
          // console.log("enter no. & store & date ", "res : ", res, "input no. : ", no, "input store: ", store, "input date: ", date)
          this.dataSource2 = res.filter(
            (res: any) =>
              res.no == no! &&
              res.storeId == store &&
              formatDate(res.date, 'M/d/yyyy', this.locale) == date
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

        this.loadDataToLocalStorage(res);
      },
      error: (err) => {
        alert('Error');
      },
    });
  }

  loadDataToLocalStorage(data: any): void {
    localStorage.removeItem('store-data');
    localStorage.setItem('store-data', JSON.stringify(data));
  }
}
