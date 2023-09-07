import { FiscalYear } from './../str-employee-exchange-dialog/str-employee-exchange-dialog.component';
import { Component, Inject, LOCALE_ID, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from '../services/api.service';
import { HttpClient } from '@angular/common/http';
import { formatDate } from '@angular/common';
import { StrWithdrawDialogComponent } from '../str-withdraw-dialog2/str-withdraw-dialog2.component';
import { ToastrService } from 'ngx-toastr';
import { SharedService } from '../guards/shared.service';
import { GlobalService } from '../services/global.service';

@Component({
  selector: 'app-str-withdraw-table2',
  templateUrl: './str-withdraw-table2.component.html',
  styleUrls: ['./str-withdraw-table2.component.css'],
})
export class StrWithdrawTableComponent implements OnInit {
  displayedColumns: string[] = ['no', 'storeName', 'employeeName',  'desstoreName', 'costCenterName','fiscalyear', 'date', 'Action'];
  matchedIds: any;
  storeList: any;
  storeName: any;
  fiscalYearsList: any;
  fiscalyear:any;
  employeesList: any;
  employeeName: any;
  // costcenterList: any;
  costCenterName: any;
  deststoreList: any;
  desstoreName: any;
  itemsList:any;
  costCentersList:any;
  sharedStores:any




  dataSource2!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private api: ApiService,
    private dialog: MatDialog,
    private http: HttpClient,
    private toastr: ToastrService,
    @Inject(LOCALE_ID) private locale: string,
    public shared:SharedService,
     private global:GlobalService,
  ) {
    this.sharedStores =shared.stores 

    this.global.getPermissionUserRoles(2, 'stores', ' إذن إضافة ', '');
   }

  ngOnInit(): void {
    this.getDestStores();
    this.getFiscalYears();

    this.getCostCenters();
    this.getAllMasterForms();
    this.getStores();
    this.getEmployees();
    console.log("looo",this.sharedStores)
  
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource2.filter = filterValue.trim().toLowerCase();

    if (this.dataSource2.paginator) {
      this.dataSource2.paginator.firstPage();
    }
  }

  openWithdrawDialog() {
    this.dialog.open(StrWithdrawDialogComponent, {
      width: '90%'
    }).afterClosed().subscribe(val => {
      if (val === 'Save') {
        // alert("refresh")

        this.getAllMasterForms();
      }
    });
  //   dRef.componentInstance.onSubmit.subscribe(() => {
   
  //    dRef.close();
  // });}
  }
  getAllMasterForms() {
    this.api.getStrWithdraw().subscribe({
      next: (res) => {
        console.log('response of get all getGroup from api: ', res);
        this.dataSource2 = new MatTableDataSource(res);
        this.dataSource2.paginator = this.paginator;
        this.dataSource2.sort = this.sort;
      },
      error: () => {
        alert('خطأ أثناء جلب سجلات اذن الصرف !!');
      },
    });
  }

  editMasterForm(row: any) {
    this.dialog
      .open(StrWithdrawDialogComponent, {
        width: '90%',
        data: row,
      })
      .afterClosed()
      .subscribe((val) => {
        if (val === 'Update' || 'Save') {
          // alert("refresh")
          this.getAllMasterForms();
        }
      });
  }

  deleteBothForms(id: number) {
    var result = confirm('تاكيد الحذف ؟ ');
console.log(" id in delete:",id)
    if (result) {
      
      this.api.deleteStrWithdraw(id).subscribe({
        next: (res) => {

          this.http
            .get<any>('http://ims.aswan.gov.eg/api/STRWithdrawDetails/get/all ')
            .subscribe(
              (res) => {
                this.matchedIds = res.filter((a: any) => {
                  // console.log("matched Id & HeaderId : ", a.HeaderId === id)
                  return a.HeaderId === id;
                });

                // for (let i = 0; i < this.matchedIds.length; i++) {
                //   this.deleteFormDetails(this.matchedIds[i].id);
                // }
                alert("تم حذف الاذن بنجاح");

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
    this.api.deleteStrWithdrawDetails(id)
      .subscribe({
        next: (res) => {
          alert("تم الحذف  بنجاح");
          this.getAllMasterForms()
        },
        error: (err) => {
          // console.log("delete details err: ", err)
          alert("خطأ أثناء حذف الصنف !!");
        }
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
  getEmployees() {
    this.api.getEmployee().subscribe({
      next: (res) => {
        this.employeesList = res;
        // console.log("store res: ", this.storeList);
      },
      error: (err) => {
        // console.log("fetch store data err: ", err);
        // alert("خطا اثناء جلب المخازن !");
      },
    });
  }


  getCostCenters() {
    this.api.getCostCenter()
      .subscribe({
        next: (res) => {
          this.costCentersList = res;
          console.log("costcenter res: ", this.costCentersList);
        },
        error: (err) => {
          // console.log("fetch store data err: ", err);
          alert("خطا اثناء جلب مركز التكلفة !");
        }
      })
  }
  // getDestStores() {
  //   this.api.getStore().subscribe({
  //     next: (res) => {
  //       this.deststoreList = res;
  //       console.log("deststore res: ", this.storeList);
  //     },
  //     error: (err) => {
  //       // console.log("fetch store data err: ", err);
  //       alert('خطا اثناء جلب المخازن !');
  //     },
  //   });
  // }

  getDestStores() {
    this.api.getStore().subscribe({
      next: (res) => {
        this.deststoreList = res;
        console.log("deststore res: ", this.deststoreList);
      },
      error: (err) => {
        // console.log("fetch store data err: ", err);
        alert('خطا اثناء جلب المخازن الخارجية !');
      },
    });
  }

  getFiscalYears() {
    this.api.getFiscalYears().subscribe({
      next: (res) => {
        this.fiscalYearsList = res;
        console.log('fiscalYears list: ', this.fiscalYearsList);
      },
      error: (err) => {
        // console.log("fetch fiscalYears data err: ", err);
        // alert("خطا اثناء جلب العناصر !");
      },
    });
  }



  getSearchStrWithdraw(no: any, store: any, date: any, fiscalYear: any, item: any, employee:any ,costCenter:any) {
    console.log(
      'no. : ',
      no, 'store : ',
      store,
      'date: ',
      date,
      'fiscalYear: ',
      fiscalYear, 'item:',item,  'employee: ',
      employee,
      'costCenter:',
      costCenter
    );
    this.api.getStrWithdrawSearch(no, store, date, fiscalYear, item, employee ,costCenter).subscribe({
      next: (res) => {
        this.dataSource2 = res
        this.dataSource2.paginator = this.paginator;
        this.dataSource2.sort = this.sort;
      },
      error: (err) => {
        // alert("Error")
      }
    })
}




  printReport() {
    // this.loadAllData();
    let header: any = document.getElementById('header');
    let paginator: any = document.getElementById('paginator');
    let action1: any = document.getElementById('action1');
    let action2: any = document.querySelectorAll('action2');
    console.log(action2);
    let button1: any = document.querySelectorAll('#button1');
    console.log(button1);
    let button2: any = document.getElementById('button2');
    let button: any = document.getElementsByClassName('mdc-icon-button');
    console.log(button);
    let buttn: any = document.querySelectorAll('#buttn');
    for (let index = 0; index < buttn.length; index++) {
      buttn[index].hidden = true;
    }

    let actionHeader: any = document.getElementById('action-header');
    actionHeader.style.display = 'none';

    let reportFooter: any = document.getElementById('reportFooter');
    let date: any = document.getElementById('date');
    header.style.display = 'grid';
    // button1.style.display = 'none';
    // button2.style.display = 'none';

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

  toastrDeleteSuccess(): void {
    this.toastr.success('تم الحذف بنجاح');
  }
}
