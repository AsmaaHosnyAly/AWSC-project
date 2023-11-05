import { Component, Inject, LOCALE_ID, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from '../../services/api.service';
import { HttpClient } from '@angular/common/http';
import { formatDate } from '@angular/common';
import { StrOpeningStockDialogComponent } from '../str-opening-stock-dialog/str-opening-stock-dialog.component';
import { ToastrService } from 'ngx-toastr';
import { HotkeysService } from 'angular2-hotkeys';
import { Hotkey } from 'angular2-hotkeys';
import {
  FormControl,
  FormControlName,
  FormBuilder,
  FormGroup,
} from '@angular/forms';
import { Observable, map, startWith, tap } from 'rxjs';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { PrintDialogComponent } from '../print-dialog/print-dialog.component';
import { GlobalService } from 'src/app/pages/services/global.service';

export class store {
  constructor(public id: number, public name: string) {}
}

export class item {
  constructor(public id: number, public name: string) {}
}

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
  // storeList: any;
  storeName: any;
  fiscalYearsList: any;
  loading :boolean=false;
  // itemsList: any;
  groupMasterForm!: FormGroup;
  groupDetailsForm!: FormGroup;
  storeList: store[] = [];
  storeCtrl: FormControl;
  filteredstore: Observable<store[]>;
  selectedstore: store | undefined;

  itemsList: item[] = [];
  itemCtrl: FormControl;
  filtereditem: Observable<item[]>;
  selecteditem: item | undefined;

  dataSource2!: MatTableDataSource<any>;
  pdfurl = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private api: ApiService,
    private dialog: MatDialog,
    private http: HttpClient,
    private hotkeysService: HotkeysService,
    private formBuilder: FormBuilder,
    @Inject(LOCALE_ID) private locale: string,
    private toastr: ToastrService,
    private global:GlobalService
  ) {
    global.getPermissionUserRoles('Store', 'stores', 'إدارة المخازن وحسابات المخازن ', 'store')
    this.storeCtrl = new FormControl();
    this.filteredstore = this.storeCtrl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filterstores(value))
    );

    this.itemCtrl = new FormControl();
    this.filtereditem = this.itemCtrl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filteritems(value))
    );
  }

  ngOnInit(): void {
    this.getAllMasterForms();
    this.getStores();
    this.getFiscalYears();
    this.getItems();

    this.groupDetailsForm = this.formBuilder.group({
      stR_Opening_StockId: [''], //MasterId
      qty: ['1'],
      price: [''],
      total: [''],
      transactionUserId: [''],
      itemId: [''],
      itemName: [''],
    });

    this.groupMasterForm = this.formBuilder.group({
      no: [''],
      employee: [''],
      // costcenter:[],
      itemName: [''],
      fiscalYear: [''],
      date: [''],
      store: [''],
      storeId: [''],
      // itemId:[''],
      StartDate: [''],
      EndDate: [''],
      report: [''],
      reportType: [''],
    });
    this.hotkeysService.add(
      new Hotkey('ctrl+o', (event: KeyboardEvent): boolean => {
        // Call the deleteGrade() function in the current component
        this.openOpeningStockDialog();
        return false; // Prevent the default browser behavior
      })
    );
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource2.filter = filterValue.trim().toLowerCase();

    if (this.dataSource2.paginator) {
      this.dataSource2.paginator.firstPage();
    }
  }

  getsearch(code: any) {
    if (code.keyCode == 13) {
      this.getAllMasterForms();
    }
  }
  getAllMasterForms() {
    this.api.getStrOpen().subscribe({
      next: (res) => {
        console.log('response of get all getGroup from api: ', res);
        this.dataSource2 = new MatTableDataSource(res);
        this.dataSource2.paginator = this.paginator;
        this.dataSource2.sort = this.sort;
        this.groupMasterForm.reset();
        // this.groupDetailsForm.reset();
      },
      error: () => {
        // alert('خطأ أثناء جلب سجلات المجموعة !!');
      },
    });
  }
  openOpeningStockDialog() {
    this.dialog
      .open(StrOpeningStockDialogComponent, {
        width: '98%',
        height: '85%',
      })
      .afterClosed()
      .subscribe((val) => {
        if (val === 'save') {
          this.getAllMasterForms();
        }
      });
  }
  editMasterForm(row: any) {
    this.dialog
      .open(StrOpeningStockDialogComponent, {
        width: '95%',
        height: '85%',
        data: row,
      })
      .afterClosed()
      .subscribe((val) => {
        if (val === 'update' || val === 'save') {
          this.getAllMasterForms();
        }
      });
  }
  displaystoreName(store: any): string {
    return store && store.name ? store.name : '';
  }
  storeSelected(event: MatAutocompleteSelectedEvent): void {
    const store = event.option.value as store;
    console.log('store selected: ', store);
    this.selectedstore = store;
    this.groupMasterForm.patchValue({ storeId: store.id });
    console.log('store in form: ', this.groupMasterForm.getRawValue().storeId);
  }
  private _filterstores(value: string): store[] {
    const filterValue = value;
    return this.storeList.filter((store: { name: string }) =>
      store.name.toLowerCase().includes(filterValue)
    );
  }

  openAutostore() {
    this.storeCtrl.setValue(''); // Clear the input field value

    // Open the autocomplete dropdown by triggering the value change event
    this.storeCtrl.updateValueAndValidity();
  }

  displayitemName(item: any): string {
    return item && item.name ? item.name : '';
  }
  itemSelected(event: MatAutocompleteSelectedEvent): void {
    const item = event.option.value as item;
    console.log('item selected: ', item);
    this.selecteditem = item;
    this.groupDetailsForm.patchValue({ itemId: item.id });
    console.log('item in form: ', this.groupDetailsForm.getRawValue().itemId);
  }
  private _filteritems(value: string): item[] {
    const filterValue = value;
    return this.itemsList.filter((item: { name: string }) =>
      item.name.toLowerCase().includes(filterValue)
    );
  }

  openAutoitem() {
    this.itemCtrl.setValue(''); // Clear the input field value

    // Open the autocomplete dropdown by triggering the value change event
    this.itemCtrl.updateValueAndValidity();
  }

  deleteBothForms(id: number) {
    // // var result = confirm('تاكيد الحذف ؟ ');

    // // if (result) {

    // //   this.api.deleteStrOpen(id).subscribe({
    // //     next: (res) => {
    // //       // alert("تم حذف المجموعة بنجاح");

    // //       this.http
    // //         .get<any>(
    // //           'http://ims.aswan.gov.eg/api/STROpeningStockDetails/get/all'
    // //         )
    // //         .subscribe(
    // //           (res) => {
    // //             this.matchedIds = res.filter((a: any) => {
    // //               // console.log("matched Id & HeaderId : ", a.stR_Opening_StockId === id)
    // //               return a.stR_Opening_StockId === id;
    // //             });

    // //             for (let i = 0; i < this.matchedIds.length; i++) {
    // //               this.deleteFormDetails(this.matchedIds[i].id);
    // //             }
    // //           },
    // //           (err) => {
    // //             // alert('خطا اثناء تحديد المجموعة !!');
    // //           }
    // //         );

    // //       this.toastrDeleteSuccess();
    // //       this.getAllMasterForms();
    // //     },
    // //     error: () => {
    // //       // alert('خطأ أثناء حذف المجموعة !!');
    // //     },
    // //   });
    // // }

    // this.http
    //   .get<any>('http://ims.aswan.gov.eg/api/STROpeningStockDetails/get/all')
    //   .subscribe(
    //     (res) => {
    //       this.matchedIds = res.filter((a: any) => {
    //         return a.stR_Opening_StockId === id;
    //       });
    //       var result = confirm('هل ترغب بتاكيد حذف التفاصيل و الرئيسي؟');

    //       if (this.matchedIds.length) {
    //         for (let i = 0; i < this.matchedIds.length; i++) {
    //           if (result) {
    //             this.api.deleteStrOpenDetails(this.matchedIds[i].id).subscribe({
    //               next: (res) => {
    //                 this.api.deleteStrOpen(id).subscribe({
    //                   next: (res) => {
    //                     this.toastrDeleteSuccess();
    //                     this.getAllMasterForms();
    //                   },
    //                   error: () => {
    //                     // alert("خطأ أثناء حذف الرئيسي !!");
    //                   },
    //                 });
    //               },
    //               error: () => {
    //                 // alert("خطأ أثناء حذف التفاصيل !!");
    //               },
    //             });
    //           }
    //         }
    //       } else {
    //         if (result) {
    //           this.api.deleteStrOpen(id).subscribe({
    //             next: (res) => {
    //               this.toastrDeleteSuccess();
    //               this.getAllMasterForms();
    //             },
    //             error: () => {
    //               // alert("خطأ أثناء حذف الرئيسي !!");
    //             },
    //           });
    //         }
    //       }
    //     },
    //     (err) => {
    //       // alert("خطا اثناء تحديد المجموعة !!")
    //     }
    //   );

    var result = confirm('تاكيد الحذف ؟ ');
    console.log(' id in delete:', id);
    if (result) {
      this.api.deleteStrOpen(id).subscribe({
        next: (res) => {
          this.api.getStrOpenAllDetails().subscribe({
            next: (res) => {
              this.matchedIds = res.filter((a: any) => {
                // console.log("matched Id & HeaderId : ", a.HeaderId === id)
                return a.stR_Opening_StockId === id;
              });

              for (let i = 0; i < this.matchedIds.length; i++) {
                this.deleteFormDetails(this.matchedIds[i].id);
              }
            },
            error: (err) => {
              // alert('خطا اثناء تحديد المجموعة !!');
            },
          });

          this.toastrDeleteSuccess();
          this.getAllMasterForms();
        },
        error: () => {
          // alert('خطأ أثناء حذف المجموعة !!');
        },
      });
    }
  }

  deleteFormDetails(id: number) {
    this.api.deleteStrOpenDetails(id).subscribe({
      next: (res) => {
        // alert('تم حذف الصنف بنجاح');
        this.getAllMasterForms();
      },
      error: (err) => {
        console.log('delete details err: ', err);
        // alert('خطأ أثناء حذف الصنف !!');
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
      },
      error: (err) => {
        // console.log("fetch fiscalYears data err: ", err);
        // alert("خطا اثناء جلب العناصر !");
      },
    });
  }

  getItems() {
    this.api.getItems().subscribe({
      next: (res) => {
        this.itemsList = res;
      },
      error: (err) => {
        // console.log("fetch items data err: ", err);
        // alert("خطا اثناء جلب العناصر !");
      },
    });
  }

  getSearchStrOpen(no: any, StartDate: any, EndDate: any, fiscalYear: any) {
    let store = this.groupMasterForm.getRawValue().storeId;
    let item = this.groupDetailsForm.getRawValue().itemId;
this.loading=true;
    this.api
      .getStrOpenSearach(no, store, fiscalYear, item, StartDate, EndDate)
      .subscribe({
        next: (res) => {
          this.loading=false;
          this.dataSource2 = res;
          this.dataSource2.paginator = this.paginator;
          this.dataSource2.sort = this.sort;
        },
      });
  }

  downloadPdf(
    no: any,
    StartDate: any,
    EndDate: any,
    fiscalYear: any,
    report: any,
    reportType: any
  ) {
    let store = this.groupMasterForm.getRawValue().storeId;
    let item = this.groupMasterForm.getRawValue().itemId;
    let costCenter = this.groupMasterForm.getRawValue().costCenterId;
    let employee = this.groupMasterForm.getRawValue().employeeId;

    this.api
      .openingStock(
        no,
        store,
        StartDate,
        EndDate,
        fiscalYear,
        item,
        employee,
        costCenter,
        report,
        reportType
      )
      .subscribe({
        next: (res) => {
          console.log('search:', res);
          const url: any = res.url;
          window.open(url);
          // let blob: Blob = res.body as Blob;
          // let url = window.URL.createObjectURL(blob);

          // this.dataSource = res;
          // this.dataSource.paginator = this.paginator;
          // this.dataSource.sort = this.sort;
        },
        error: (err) => {
          console.log('eroorr', err);
          window.open(err.url);
        },
      });
  }
  // previewPdf(no: any, date: any, fiscalYear: any) {
  //   let store = this.groupMasterForm.getRawValue().storeId;
  //   let item = this.groupMasterForm.getRawValue().itemId;

  //   this.api.openingStock(no, store, date, fiscalYear, item).subscribe({
  //     next: (res) => {
  //       let blob: Blob = res.body as Blob;
  //       console.log(blob);
  //       let url = window.URL.createObjectURL(blob);
  //       localStorage.setItem('url', JSON.stringify(url));
  //       this.pdfurl = url;
  //       this.dialog.open(PrintDialogComponent, {
  //         width: '50%',
  //       });

  //       // this.dataSource = res;
  //       // this.dataSource.paginator = this.paginator;
  //       // this.dataSource.sort = this.sort;
  //     },
  //     error: (err) => {
  //       console.log('eroorr', err);
  //       window.open(err.url);
  //     },
  //   });
  // }

  previewPrint(
    no: any,
    StartDate: any,
    EndDate: any,
    fiscalYear: any,
    report: any,
    reportType: any
  ) {
    let costCenter = this.groupMasterForm.getRawValue().costCenterId;
    let employee = this.groupMasterForm.getRawValue().employeeId;
    let item = this.groupMasterForm.getRawValue().itemId;
    let store = this.groupMasterForm.getRawValue().storeId;
    if (report != null && reportType != null) {
      this.loading=true;
      this.api
        .openingStock(
          no,
          store,
          StartDate,
          EndDate,
          fiscalYear,
          item,
          employee,
          costCenter,
          report,
          'pdf'
        )
        .subscribe({
          next: (res) => {
            this.loading=false;
            let blob: Blob = res.body as Blob;
            console.log(blob);
            let url = window.URL.createObjectURL(blob);
            localStorage.setItem('url', JSON.stringify(url));
            this.pdfurl = url;
            this.dialog.open(PrintDialogComponent, {
              width: '50%',
            });

            // this.dataSource = res;
            // this.dataSource.paginator = this.paginator;
            // this.dataSource.sort = this.sort;
          },
          error: (err) => {
            this.loading=false;
            console.log('eroorr', err);
            window.open(err.url);
          },
        });
    } else {
      alert('ادخل التقرير و نوع التقرير!');
    }
  }

  toastrDeleteSuccess(): void {
    this.toastr.success('تم الحذف بنجاح');
  }
}
