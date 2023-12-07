import { Component, Inject, LOCALE_ID, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from '../../services/api.service';
import { ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EmployeeExchangePrintDialogComponent } from '../employee-exchange-print-dialog/employee-exchange-print-dialog.component';
import { formatDate } from '@angular/common';
import { StrOpeningStockDialogComponent } from '../str-opening-stock-dialog/str-opening-stock-dialog.component';
import { ToastrService } from 'ngx-toastr';
import { StrStockTakingDialogComponent } from '../str-stock-taking-dialog/str-stock-taking-dialog.component';
import { PagesEnums } from 'src/app/core/enums/pages.enum';

import {
  FormControl,
  FormControlName,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith, debounceTime } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { HotkeysService } from 'angular2-hotkeys';
import { Hotkey } from 'angular2-hotkeys';
import { GlobalService } from 'src/app/pages/services/global.service';
import { PrintDialogComponent } from '../print-dialog/print-dialog.component';

export class store {
  constructor(public id: number, public name: string) {}
}

export class Employee {
  constructor(public id: number, public name: string, public code: string) {}
}

// export class Employee {
//   constructor(public id: number, public name: string, public code: string) { }
// }

// export class costcenter {
//   constructor(public id: number, public name: string) { }
// }
export class item {
  constructor(public id: number, public name: string) {}
}

@Component({
  selector: 'app-str-stock-taking-table',
  templateUrl: './str-stock-taking-table.component.html',
  styleUrls: ['./str-stock-taking-table.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StrStockTakingTableComponent implements OnInit {
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
  // costCentersList: any;
  pdfurl = '';

  storeList: store[] = [];
  storeCtrl: FormControl;
  filteredstore: Observable<store[]>;
  selectedstore: store | undefined;
  // employeesList: any;
  // itemList:any;
  fiscalYearsList: any;
  loading: boolean = false;
  groupMasterForm!: FormGroup;
  groupDetailsForm!: FormGroup;

  // costCentersList: costcenter[] = [];
  // costcenterCtrl: FormControl<any>;
  // filteredcostcenter: Observable<costcenter[]>;
  // selectedcostcenter: costcenter | undefined;

  itemsList: item[] = [];
  itemCtrl: FormControl;
  filtereditem: Observable<item[]>;
  selecteditem: item | undefined;

  // employeesList: Employee[] = [];
  // employeeCtrl: FormControl<any>;
  // filteredEmployee: Observable<Employee[]>;
  // selectedEmployee: Employee | undefined;
  dataSource2!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  storeSelectedId: any;
  isEdit: boolean = false;
  autoNo: any;
  userRoles: any;
  userRoleStoresAcc = PagesEnums.STORES_ACCOUNTS;

  fiscalYearSelectedId: any;
  defaultStoreSelectValue: any;
  defaultFiscalYearSelectValue: any;
  sumOfTotals = 0;
  getMasterRowId: any;
  MasterGroupInfoEntered = false;
  pageSize: any;
  currentPage: any;
  dataSource: MatTableDataSource<StrStockTakingTableComponent> =
    new MatTableDataSource();
  isLoading = false;
  pageIndex: any;
  length: any;
  getDetailedRowData: any;
  editDataDetails: any;
  editData: any;

  constructor(
    private api: ApiService,
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private hotkeysService: HotkeysService,
    private global: GlobalService,
    @Inject(LOCALE_ID) private locale: string,
    // @Inject(MAT_DIALOG_DATA) public editDataDetail: any,
    private toastr: ToastrService,
    private cdr: ChangeDetectorRef // @Inject(MAT_DIALOG_DATA) public editData: any
  ) {
    global.getPermissionUserRoles(
      'Store',
      'str-home',
      'إدارة المخازن وحسابات المخازن ',
      'store'
    );
    this.storeCtrl = new FormControl();
    this.filteredstore = this.storeCtrl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filterstores(value))
    );

    this.itemCtrl = new FormControl();

    this.filtereditem = this.itemCtrl.valueChanges.pipe(
      startWith(''),
      debounceTime(300), // Adjust the debounce time (in milliseconds) to your preference
      map((value) => this._filteritems(value))
    );
  }

  ngOnInit(): void {
    this.getAllMasterForms();
    // this.getAllEmployees();
    this.getFiscalYears();
    // this.getEmployees();
    this.getItems();
    this.getStores();
    // this.getcostCenter();

    this.groupMasterForm = this.formBuilder.group({
      no: [''],
      // employee:[''],
      // costcenter:[],
      // costCenterId:[''],
      // employeeId:[''],

      itemName: [''],
      itemId: [''],
      fiscalYear: [''],
      date: [''],
      store: [''],
      storeId: [''],
    });

    this.groupDetailsForm = this.formBuilder.group({
      stR_WithdrawId: [''], //MasterId
      systemQty: [''],
      balance: [''],
      qty: [''],
      percentage: [''],
      price: [''],
      total: [''],
      transactionUserId: [1],
      destStoreUserId: [1],
      itemId: [''],
      stateId: [''],

      // withDrawNoId: ['' ],

      itemName: [''],
      // avgPrice: [''],

      stateName: [''],

      // notesName: [''],
    });
    // this.hotkeysService.add(new Hotkey('ctrl+o', (event: KeyboardEvent): boolean => {
    //   // Call the deleteGrade() function in the current component
    //   this.openEmployeeingStockDialog();
    //   return false; // Prevent the default browser behavior
    // }));
  }

  getsearch(code: any) {
    if (code.keyCode == 13) {
      this.getAllMasterForms();
    }
  }
  displaystoreName(store: any): string {
    return store && store.name ? store.name : '';
  }
  storeSelected(event: MatAutocompleteSelectedEvent): void {
    const store = event.option.value as store;
    console.log('store selected: ', store);
    this.selectedstore = store;
    console.log('selectedstore: ', this.selectedstore);

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

  getAllMasterForms() {
    this.api.getStrStockTaking().subscribe({
      next: (res) => {
        console.log('response of get all getGroup from api: ', res);
        this.dataSource2 = new MatTableDataSource(res);
        this.dataSource2.paginator = this.paginator;
        this.dataSource2.sort = this.sort;

        this.groupMasterForm.reset();
        this.groupDetailsForm.reset();

        this.itemCtrl.reset();
        this.storeCtrl.reset();
      },
      error: () => {
        alert('خطأ أثناء جلب سجلات المجموعة !!');
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
        // alert('خطا اثناء جلب المخازن !');
      },
    });
  }
  openStockTkingkDialog() {
    this.dialog
      .open(StrStockTakingDialogComponent, {
        width: '60%',
        height: '79%',
      })
      .afterClosed()
      .subscribe((val) => {
        if (val === 'Save') {
          // alert("refreshhhh")
          this.getAllMasterForms();
        }
      });
  }
  editMasterForm(row: any) {
    // this.loading=true;
    this.dialog
      .open(StrStockTakingDialogComponent, {
        width: '60%',
        height: '79%',
        data: row,
      })
      .afterClosed()
      .subscribe((val) => {
        // this.loading=false;
        if (val === 'Update' || 'Save') {
          // alert("REFRESH")

          this.getAllMasterForms();
        }
      });
  }

  deleteBothForms(id: number) {
    var result = confirm('تاكيد الحذف ؟ ');
    console.log(' id in delete:', id);
    if (result) {
      this.api.deleteStrStockTking(id).subscribe({
        next: (res) => {
          this.api.getStrStockTakingDetailsByMasterId(id).subscribe(
            (res) => {
              this.matchedIds = res;

              for (let i = 0; i < this.matchedIds.length; i++) {
                this.deleteFormDetails(this.matchedIds[i].id);
              }
              // alert("تم حذف الاذن بنجاح");
            },
            (err) => {
              // alert('خطا اثناء تحديد المجموعة !!');
            }
          );

          this.toastrDeleteSuccess();
          this.getAllMasterForms();
        },
        error: () => {
          // alert('خطأ أثناء حذف المجموعة !!');
        },
      });
    }
  }

  deleteFormDetails(id: any) {
    this.api.deleteStockTakingDetails(id).subscribe({
      next: () => {
        // alert("تم الحذف بنجاح");
        // this.toastrDeleteSuccess();
        // this.getAllDetailsForms()
        console.log('details delete res: ');
      },
      error: () => {
        // alert("خطأ أثناء حذف التفاصيل !!");
      },
    });
  }

  getAllEmployees() {
    this.api.getAllEmployees().subscribe({
      next: (res) => {
        this.storeList = res;
        // console.log("store res: ", this.storeList);
      },
      error: (err) => {
        // console.log("fetch store data err: ", err);
        // alert('خطا اثناء جلب المخازن !');
      },
    });
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

  getItems() {
    this.loading = true;
    this.api.getItems().subscribe({
      next: (res) => {
        this.loading = false;
        this.itemsList = res;
        this.cdr.detectChanges(); // Trigger change detection
      },
      error: (err) => {
        this.loading = false;
        // console.log("fetch store data err: ", err);
        alert('خطا اثناء جلب العناصر !');
      },
    });
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
      .getStrOpeningStockReport(
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
        },
        error: (err) => {
          console.log('eroorr', err);
          window.open(err.url);
        },
      });
  }
  previewReportRow(row: any) {
    // console.log("row preview report: ", row);
    let id = row.id;
    // let EndDate = formatDate(row.date, 'MM-dd-yyyy', this.locale);
    let EndDate = row.date;
    let LastYearDate = new Date(EndDate);
    LastYearDate.setFullYear(LastYearDate.getFullYear() - 1);
    let StartDate = LastYearDate;
    // let StartDate = formatDate(LastYearDate, 'MM-dd-yyyy', this.locale);
    let report = 'StockTakingDetailsReport';
    let reportType = 'pdf';

    console.log(
      'row data to print report, id: ',
      id,
      ' StartDate: ',
      StartDate,
      ' EndDate: ',
      EndDate,
      ' reportName: ',
      report,
      ' reportType: ',
      reportType
    );

    if (report != null && reportType != null) {
      if (report == 'StockTakingCommodityIdTotalReport') {
        id = 6;
      }

      this.api
        .getStrStockTakingDetailsReport(
          id,
          StartDate,
          EndDate,
          report,
          reportType
        )
        .subscribe({
          next: (res) => {
            let blob: Blob = res.body as Blob;
            console.log(blob);
            let url = window.URL.createObjectURL(blob);
            localStorage.setItem('url', JSON.stringify(url));
            this.pdfurl = url;
            this.dialog.open(PrintDialogComponent, {
              width: '50%',
            });
          },
          error: (err) => {
            console.log('eroorr', err);
            window.open(err.url);
          },
        });
    } else {
      alert('ادخل التقرير و نوع التقرير!');
    }
  }

  previewPrint(
    no: any,
    StartDate: any,
    EndDate: any,
    fiscalYear: any,
    report: any,
    reportType: any
  ) {
    let itemId = this.groupDetailsForm.getRawValue().itemId;
    let storeId = this.groupMasterForm.getRawValue().storeId;
    let id;
    if (report != null && reportType != null) {
      this.loading = true;

      if (report == 'StockTakingCommodityIdTotalReport') {
        id = 6;
      }

      this.api
        .getStrStockTakingItem(
          id,
          no,
          StartDate,
          EndDate,
          storeId,
          fiscalYear,
          itemId,
          report,
          'pdf'
        )
        .subscribe({
          next: (res) => {
            this.loading = false;
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
            this.loading = false;
            console.log('eroorr', err);
            window.open(err.url);
          },
        });
    } else {
      alert('ادخل التقرير و نوع التقرير!');
    }
  }

  download(
    no: any,
    StartDate: any,
    EndDate: any,
    fiscalYear: any,
    report: any,
    reportType: any
  ) {
    let itemId = this.groupDetailsForm.getRawValue().itemId;
    let storeId = this.groupMasterForm.getRawValue().storeId;
    let id;

    if (report != null && reportType != null) {
      if (report == 'StockTakingCommodityIdTotalReport') {
        id = 6;
      }

      this.api
        .getStrStockTakingItem(
          id,
          no,
          StartDate,
          EndDate,
          storeId,
          fiscalYear,
          itemId,
          report,
          'pdf'
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
    } else {
      alert('ادخل التقرير و نوع التقرير!');
    }
  }

  getSearchStrOpen(no: any, StartDate: any, EndDate: any, fiscalYear: any) {
    let store = this.groupMasterForm.getRawValue().storeId;
    let item = this.groupDetailsForm.getRawValue().itemId;
    this.loading = true;
    this.api
      .getStrStockTakingSearach(no, store, fiscalYear, item, StartDate, EndDate)
      .subscribe({
        next: (res) => {
          this.loading = false;
          this.dataSource2 = res;
          this.dataSource2.paginator = this.paginator;
          this.dataSource2.sort = this.sort;
        },
      });
  }

  toastrSuccess(): void {
    this.toastr.success('تم الحفظ بنجاح');
  }

  toastrDeleteSuccess(): void {
    this.toastr.success('تم الحذف بنجاح');
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource2.filter = filterValue.trim().toLowerCase();

    if (this.dataSource2.paginator) {
      this.dataSource2.paginator.firstPage();
    }
  }

  tabSelected(tab: any) {
    console.log('tab selected: ', tab);
    if (tab.index == 0) {
      console.log('done: ', tab);

      // this.editData = '';
      this.MasterGroupInfoEntered = false;
      this.groupMasterForm.controls['no'].setValue('');
      // this.listCtrl.setValue('');
      // this.costcenterCtrl.setValue('');
      this.storeCtrl.setValue('');
      // this.groupMasterForm.controls['date'].setValue(this.currentDate);
      // this.lists = [];

      this.getAllMasterForms();
    }
  }

  getStrEmployeeOpenAutoNo() {
    this.api.getStrEmployeeOpenAutoNo().subscribe({
      next: (res) => {
        this.autoNo = res;
        return res;
      },
      error: () => {
        // console.log("fetch fiscalYears data err: ", err);
        // alert("خطا اثناء جلب العناصر !");
      },
    });
  }

  storeValueChanges(storeId: any) {
    console.log('store: ', storeId);
    this.storeSelectedId = storeId;
    this.groupMasterForm.controls['storeId'].setValue(this.storeSelectedId);
    this.isEdit = false;
    console.log('kkkkkkkkkkk:', this.isEdit);

    this.getStrEmployeeOpenAutoNo();
  }

  async fiscalYearValueChanges(fiscalyaerId: any) {
    console.log('fiscalyaer: ', fiscalyaerId);
    this.fiscalYearSelectedId = await fiscalyaerId;
    this.groupMasterForm.controls['fiscalYearId'].setValue(
      this.fiscalYearSelectedId
    );
    this.isEdit = false;

    this.getStrOpenAutoNo();
  }

  getStrOpenAutoNo() {
    console.log(
      'storeId: ',
      this.storeSelectedId,
      ' fiscalYearId: ',
      this.fiscalYearSelectedId
    );
    console.log(
      'get default selected storeId & fisclYearId: ',
      this.defaultStoreSelectValue,
      ' , ',
      this.defaultFiscalYearSelectValue
    );

    if (this.groupMasterForm) {
      if (this.editData && !this.fiscalYearSelectedId) {
        console.log('change storeId only in updateHeader');
        this.api
          .getStrOpenAutoNo(
            this.groupMasterForm.getRawValue().storeId,
            this.editData.fiscalYearId
          )
          .subscribe({
            next: (res) => {
              this.autoNo = res;
              console.log('autoNo: ', this.autoNo);
              return res;
            },
            error: (err) => {
              console.log('fetch autoNo err: ', err);
              // alert("خطا اثناء جلب العناصر !");
            },
          });
      } else if (this.editData && !this.storeSelectedId) {
        console.log('change fiscalYearId only in updateHeader');
        this.api
          .getStrOpenAutoNo(
            this.editData.storeId,
            this.groupMasterForm.getRawValue().fiscalYearId
          )
          .subscribe({
            next: (res) => {
              this.autoNo = res;
              console.log('autoNo: ', this.autoNo);
              return res;
            },
            error: (err) => {
              console.log('fetch autoNo err: ', err);
              // alert("خطا اثناء جلب العناصر !");
            },
          });
      } else if (this.editData) {
        console.log('change both in edit data: ', this.isEdit);
        this.api
          .getStrOpenAutoNo(
            this.groupMasterForm.getRawValue().storeId,
            this.groupMasterForm.getRawValue().fiscalYearId
          )
          .subscribe({
            next: (res) => {
              this.autoNo = res;
              // this.editData = null;
              console.log('isEdit : ', this.isEdit);
              // this.groupMasterForm.controls['no'].setValue(666);
              console.log('autoNo: ', this.autoNo);
              return res;
            },
            error: (err) => {
              console.log('fetch autoNo err: ', err);
              // alert("خطا اثناء جلب العناصر !");
            },
          });
      } else {
        console.log(
          'change both values in updateHeader',
          this.groupMasterForm.getRawValue().storeId
        );
        this.api
          .getStrOpenAutoNo(
            this.groupMasterForm.getRawValue().storeId,
            this.groupMasterForm.getRawValue().fiscalYearId
          )
          .subscribe({
            next: (res) => {
              this.autoNo = res;
              // this.editData.no = res
              console.log('isEdit : ', this.isEdit);
              console.log('autoNo: ', this.autoNo);
              return res;
            },
            error: (err) => {
              console.log('fetch autoNo err: ', err);
              // alert("خطا اثناء جلب العناصر !");
            },
          });
      }
    }
  }

  async nextToAddFormDetails() {
    this.groupMasterForm.removeControl('id');

    this.groupMasterForm.controls['total'].setValue(
      Number(this.sumOfTotals.toFixed(2))
    );
    this.storeName = await this.getStoreByID(
      this.groupMasterForm.getRawValue().storeId
    );

    // alert("store name in add: " + this.storeName)
    this.groupMasterForm.controls['storeName'].setValue(this.storeName);
    this.groupMasterForm.controls['fiscalYearId'].setValue(1);
    // console.log("faciaaaaal year add: ", this.groupMasterForm.getRawValue().fiscalYearId)
    console.log('dataName: ', this.groupMasterForm.value);
    if (this.groupMasterForm.getRawValue().no) {
      console.log('no changed: ', this.groupMasterForm.getRawValue().no);
    } else {
      this.groupMasterForm.controls['no'].setValue(this.autoNo);
      console.log(
        'no took auto number: ',
        this.groupMasterForm.getRawValue().no
      );
    }
    if (this.groupMasterForm) {
      // if (this.groupMasterForm.getRawValue().storeName && this.groupMasterForm.valid) {

      console.log('Master add form : ', this.groupMasterForm.value);

      this.api.postStrStockTaking(this.groupMasterForm.value).subscribe({
        next: (res) => {
          // console.log("ID header after post req: ", res);
          this.getMasterRowId = {
            id: res,
          };
          // this.getMasterRowId = res;
          console.log('mastered res: ', this.getMasterRowId.id);
          this.MasterGroupInfoEntered = true;

          // alert("تم الحفظ بنجاح");
          this.toastrSuccess();
          this.getAllDetailsForms();
          // this.addDetailsInfo();
          // this.getAllDetailsForms();
          // this.updateDetailsForm();
          this.updateDetailsForm();

          // this.addDetailsInfo();
        },
        error: (err) => {
          console.log('header post err: ', err);
          // alert("حدث خطأ أثناء إضافة مجموعة")
        },
      });
    }
    // else {
    //   alert("تاكد من ادخال البيانات صحيحة")
    // }
  }
  getStoreByID(id: any) {
    console.log(' store: ', id);
    return fetch(`http://ims.aswan.gov.eg/api/STRStore/get/${id}`)
      .then((response) => response.json())
      .then((json) => {
        // console.log("fetch name by id res: ", json.name);
        return json.name;
      })
      .catch((err) => {
        // console.log("error in fetch name by id: ", err);
        // alert("خطا اثناء جلب رقم المخزن !");
      });
  }

  getAllDetailsForms() {
    console.log('mastered row get all data: ', this.getMasterRowId);
    if (this.getMasterRowId) {
      console.log(
        'currentPage: ',
        this.currentPage,
        'pageSize: ',
        this.pageSize
      );

      if (!this.currentPage && !this.pageSize) {
        this.currentPage = 0;
        this.pageSize = 5;

        // this.isLoading = true;
        console.log('first time: ');

        fetch(
          this.api.getStrStockTakingDetailsPaginateByMasterId(
            this.getMasterRowId.id,
            this.currentPage,
            this.pageSize
          )
        )
          .then((response) => response.json())
          .then(
            (data) => {
              // this.totalRows = data.length;
              console.log('master data paginate first Time: ', data);
              this.dataSource.data = data.items;
              this.pageIndex = data.page;
              this.pageSize = data.pageSize;
              this.length = data.totalItems;
              setTimeout(() => {
                this.paginator.pageIndex = this.currentPage;
                this.paginator.length = this.length;
              });
              this.isLoading = false;
            },
            (error) => {
              console.log(error);
              this.isLoading = false;
            }
          );
      } else {
        this.isLoading = true;
        console.log('second time: ');

        fetch(
          this.api.getStrStockTakingDetailsPaginateByMasterId(
            this.getMasterRowId.id,
            this.currentPage,
            this.pageSize
          )
        )
          .then((response) => response.json())
          .then(
            (data) => {
              // this.totalRows = data.length;
              console.log('master data paginate: ', data);
              this.dataSource.data = data.items;
              this.pageIndex = data.page;
              this.pageSize = data.pageSize;
              this.length = data.totalItems;
              setTimeout(() => {
                this.paginator.pageIndex = this.currentPage;
                this.paginator.length = this.length;
              });
              this.isLoading = false;
            },
            (error) => {
              console.log(error);
              this.isLoading = false;
            }
          );
      }
    }
  }

  async updateDetailsForm() {
    this.storeName = await this.getStoreByID(
      this.groupMasterForm.getRawValue().storeId
    );
    // alert("update Store name: " + this.storeName)
    this.groupMasterForm.controls['storeName'].setValue(this.storeName);
    this.groupMasterForm.controls['storeId'].setValue(
      this.groupMasterForm.getRawValue().storeId
    );
    this.groupMasterForm.controls['fiscalYearId'].setValue(
      this.groupMasterForm.getRawValue().fiscalYearId
    );

    if (this.editData) {
      this.groupMasterForm.addControl(
        'id',
        new FormControl('', Validators.required)
      );
      this.groupMasterForm.controls['id'].setValue(this.editData.id);
      // console.log("data item Name in edit: ", this.groupMasterForm.value)
    }

    this.groupMasterForm.addControl(
      'id',
      new FormControl('', Validators.required)
    );
    this.groupMasterForm.controls['id'].setValue(this.getMasterRowId.id);
    // this.groupMasterForm.controls['employee_ExchangeId'].setValue(this.getMasterRowId.id);
    // console.log("data item Name in edit without id: ", this.groupMasterForm.value)

    this.api.putStrStockTaking(this.groupMasterForm.value).subscribe({
      next: (res) => {
        // alert("تم التعديل بنجاح");
        console.log(
          'update res: ',
          res,
          'details form values: ',
          this.groupDetailsForm.value,
          'details id: ',
          this.getDetailedRowData
        );
        // console.log("update res: ", res, "details form values: ", this.groupDetailsForm.value, "details id: ", this.getDetailedRowData);
        if (this.groupDetailsForm.value && this.getDetailedRowData) {
          // this.groupDetailsForm.addControl('id', new FormControl('', Validators.required));
          // this.groupDetailsForm.controls['id'].setValue(this.getDetailedRowData.id);

          this.api
            .putStrStockTakingDetails(
              this.groupDetailsForm.value,
              this.getDetailedRowData.id
            )
            .subscribe({
              next: () => {
                // alert("تم تحديث التفاصيل بنجاح");
                // this.toastrEditSuccess();
                // console.log("update res: ", res);
                this.groupDetailsForm.reset();
                this.getAllDetailsForms();
                this.getDetailedRowData = '';
                // this.dialogRef.close('update');
              },
              error: () => {
                // console.log("update err: ", err)
                // alert("خطأ أثناء تحديث سجل المجموعة !!")
              },
            });
          this.groupDetailsForm.removeControl('id');
        }

        // this.dialogRef.close('update');
      },
      error: () => {
        // alert("خطأ أثناء تحديث سجل الصنف !!")
      },
    });
  }
}
