import { Component, Inject, LOCALE_ID, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
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

import jwt_decode from 'jwt-decode';
import { PagesEnums } from 'src/app/core/enums/pages.enum';
import { MatTabGroup } from '@angular/material/tabs';

export class store {
  constructor(public id: number, public name: string, public storeId: any, public storeName: any) { }
}

export class Employee {
  constructor(public id: number, public name: string, public code: string) { }
}

export class item {
  constructor(public id: number, public name: string) { }
}

interface strStockTakingDetails {
  itemName: any;
  price: any;
  qty: any;
  total: any;
  action: any;
}

@Component({
  selector: 'app-str-stock-taking-table',
  templateUrl: './str-stock-taking-table.component.html',
  styleUrls: ['./str-stock-taking-table.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
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

  storeName: any;

  pdfurl = '';

  storeList: store[] = [];
  storeCtrl: FormControl;
  filteredstore: Observable<store[]>;
  selectedstore: store | undefined;

  fiscalYearsList: any;
  loading: boolean = false;
  groupMasterSearchForm!: FormGroup;
  groupMasterForm!: FormGroup;
  groupDetailsForm!: FormGroup;

  itemsList: item[] = [];
  itemCtrl: FormControl;
  filtereditem: Observable<item[]>;
  selecteditem: item | undefined;

  dataSource2!: MatTableDataSource<any>;

  userIdFromStorage = localStorage.getItem('transactionUserId');
  userRoles: any;

  userRoleStoresAcc = PagesEnums.STORES_ACCOUNTS;

  decodedToken: any;
  decodedToken2: any;
  defaultStoreSelectValue: any;
  editData: any;
  isEditDataReadOnly: boolean = true;
  isEdit: boolean = false;
  sumOfTotals = 0;
  getMasterRowId: any;
  MasterGroupInfoEntered = false;
  itemByFullCodeValue: any;
  fullCodeValue: any;
  storeSelectedId: any;
  fiscalYearSelectedId: any;
  defaultFiscalYearSelectValue: any;


  displayedDetailsColumns: string[] = [
    'itemName',
    'price',
    'qty',
    'total',
    'action',
  ];
  dataSourceDetails: MatTableDataSource<strStockTakingDetails> = new MatTableDataSource();
  pageIndexDetails: any;
  lengthDetails: any;
  // pageSizeDetails: any;
  pageSizeDetails = 5;
  ELEMENT_DATA_DETAILS: strStockTakingDetails[] = [];
  currentPageDetails: any;

  isLoading = false;
  isReadOnly: boolean = true;

  @ViewChild("matgroup", { static: false })
  matgroup!: MatTabGroup;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  editDataDetails: any;

  constructor(
    private api: ApiService,
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private hotkeysService: HotkeysService,
    private global: GlobalService,
    @Inject(LOCALE_ID) private locale: string,
    private toastr: ToastrService,
    private cdr: ChangeDetectorRef,
  ) {
    global.getPermissionUserRoles('Store', 'str-home', 'إدارة المخازن وحسابات المخازن ', 'store')
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
    const accessToken: any = localStorage.getItem('accessToken');
    this.decodedToken = jwt_decode(accessToken);
    this.decodedToken2 = this.decodedToken.roles;
    console.log('accessToken2', this.decodedToken2);

    let dateNow: Date = new Date();
    // console.log('Date = ' + dateNow);

    this.getAllMasterForms();

    this.getFiscalYears();

    this.getItems();
    this.getStores();


    this.groupMasterSearchForm = this.formBuilder.group({
      no: [''],
      itemName: [''],
      itemId: [''],
      fiscalYear: [''],
      date: [''],
      store: [''],
      storeId: [''],
    });

    this.groupMasterForm = this.formBuilder.group({
      no: ['', Validators.required],
      storeId: ['', Validators.required],
      // storeName: ['', Validators.required],

      transactionUserId: [this.userIdFromStorage, Validators.required],
      date: [dateNow, Validators.required],
      total: ['', Validators.required],
      fiscalYearId: ['', Validators.required],

    });

    this.groupDetailsForm = this.formBuilder.group({
      strStockTakingId: [, Validators.required], //MasterId
      systemQty: ['', Validators.required],
      balance: ['', Validators.required],
      qty: [1, Validators.required],
      price: ['', Validators.required],
      total: ['', Validators.required],
      // state: ['', Validators.required],
      notes: [''],
      transactionUserId: [this.userIdFromStorage, Validators.required],
      itemId: ['', Validators.required],
      // itemName: ['', Validators.required],
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

    this.groupMasterSearchForm.patchValue({ storeId: store.id });
    console.log('store in form: ', this.groupMasterSearchForm.getRawValue().storeId);
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

        this.groupMasterSearchForm.reset();
        this.groupDetailsForm.reset();

        this.itemCtrl.reset();
        this.storeCtrl.reset();
      },
      error: () => {
        alert('خطأ أثناء جلب سجلات المجموعة !!');
      },
    });
  }

  // getStores() {
  //   this.api.getStore().subscribe({
  //     next: (res) => {
  //       this.storeList = res;
  //       // console.log("store res: ", this.storeList);
  //     },
  //     error: (err) => {
  //       // console.log("fetch store data err: ", err);
  //       // alert('خطا اثناء جلب المخازن !');
  //     },
  //   });
  // }

  async getStores() {
    // this.userRoles = localStorage.getItem('userRoles');
    this.userRoles = this.decodedToken2;

    console.log('userRoles: ', this.userRoles.includes(this.userRoleStoresAcc))

    if (this.userRoles.includes(this.userRoleStoresAcc)) {
      // console.log('user is manager -all stores available- , role: ', userRoles);

      this.api.getStore()
        .subscribe({
          next: async (res) => {
            this.storeList = res;
            this.defaultStoreSelectValue = await res[Object.keys(res)[0]];
            console.log("selected storebbbbbbbbbbbbbbbbbbbbbbbb: ", this.defaultStoreSelectValue);
            if (this.editData) {
              this.groupMasterForm.controls['storeId'].setValue(this.editData.storeId);
            }
            else {
              this.groupMasterForm.controls['storeId'].setValue(this.defaultStoreSelectValue.id);
            }

          },
          error: (err) => {
            // console.log("fetch store data err: ", err);
            // alert("خطا اثناء جلب المخازن !");
          }
        })
    }
    else {
      this.api.getUserStores(localStorage.getItem('transactionUserId'))
        .subscribe({
          next: async (res) => {
            this.storeList = res;
            this.defaultStoreSelectValue = await res[Object.keys(res)[0]];
            console.log("selected storebbbbbbbbbbbbbbb user: ", this.defaultStoreSelectValue);
            if (this.editData) {
              console.log("selected edit data : ", this.editData);
              this.groupMasterForm.controls['storeId'].setValue(this.editData.storeId);
            }
            else {
              console.log("selected new data : ", this.defaultStoreSelectValue.storeId);
              this.groupMasterForm.controls['storeId'].setValue(this.defaultStoreSelectValue.storeId);
            }

          },
          error: (err) => {
            // console.log("fetch store data err: ", err);
            // alert("خطا اثناء جلب المخازن !");
          }
        })
    }


  }
  openStockTkingkDialog() {
    // this.dialog.open(StrStockTakingDialogComponent, {
    //   width: '60%',
    //   height: '79%',
    // }).afterClosed().subscribe(val => {
    //   if (val === 'Save') {
    //     // alert("refreshhhh")
    //     this.getAllMasterForms();
    //   }
    // })

    let tabGroup = this.matgroup;
    tabGroup.selectedIndex = 1;

    // this.autoNo = '';
    this.editData = '';
    this.groupMasterForm.controls['no'].setValue('');
    this.groupMasterForm.controls['date'].setValue('');
    this.editDataDetails = '';

    // this.lists = [];
    // this.sellerCode = '';
    // this.sellerCodeIsDisabled = true;

    // this.MasterGroupInfoEntered = false;
    // this.groupMasterForm.controls['date'].setValue('');
    // this.groupMasterForm.controls['entryNo'].setValue('');
    // this.groupMasterForm.controls['employeeId'].setValue('');
    // this.groupMasterForm.controls['sellerId'].setValue('');
    // this.groupMasterForm.controls['sourceStoreId'].setValue('');
    // this.listCtrl.setValue('');

    // this.groupMasterForm.controls['commodityId'].setValue('');
    // this.groupMasterForm.controls['approvalStatusId'].setValue('');

    // this.commodityCtrl.setValue('');
    // this.approvalStatusCtrl.setValue('');

    // this.groupMasterForm.controls['addTypeId'].setValue('');
    // this.addTypeCtrl.setValue('');


    // this.getStrApprovalStatus();
    // this.getStrCommodity();
    // this.getStrAddType();
    // this.getStores();
    // this.getItems();
    // this.getTypes();
    // this.getSellers();
    // this.getReciepts();
    // this.getEmployees();
    // this.getProducts();
    // this.getStrAddAutoNo();

    this.getStores();
    this.getFiscalYears();
    this.getItems();


  }

  editMasterForm(row: any) {
    this.getStores();
    this.getFiscalYears();
    this.getItems();

    let tabGroup = this.matgroup;
    tabGroup.selectedIndex = 1;

    // // this.autoNo = '';
    // this.editDataDetails = '';
    // this.groupDetailsForm.reset();
    // this.fullCodeValue = '';
    // this.itemCtrl.setValue('');
    // this.groupDetailsForm.controls['state'].setValue(this.stateDefaultValue);
    // this.groupDetailsForm.controls['qty'].setValue(1);
    // this.isEdit = true;

    this.editData = row;
    console.log("editData master: ", this.editData);

    this.isEdit = true;
    // this.actionBtnMaster = "Update";
    this.groupMasterForm.controls['no'].setValue(this.editData.no);
    this.groupMasterForm.controls['storeId'].setValue(this.editData.storeId);
    // this.groupMasterForm.controls['storeName'].setValue(this.editData.storeName);
    this.groupMasterForm.controls['fiscalYearId'].setValue(this.editData.fiscalYearId);
    this.groupMasterForm.controls['date'].setValue(this.editData.date);
    this.groupMasterForm.controls['total'].setValue(this.editData.total);
    this.groupMasterForm.controls['transactionUserId'].setValue(this.editData.transactionUserId);

    this.groupMasterForm.addControl('id', new FormControl('', Validators.required));
    this.groupMasterForm.controls['id'].setValue(this.editData.id);
    this.isEditDataReadOnly = true;

    this.getAllDetailsForms();
  }

  deleteBothForms(id: number) {
    var result = confirm('تاكيد الحذف ؟ ');
    console.log(' id in delete:', id);
    if (result) {
      this.api.deleteStrStockTking(id).subscribe({
        next: (res) => {
          this.api.getStrStockTakingDetailsByMasterId(id)
            .subscribe(
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
    this.api.deleteStockTakingDetails(id)
      .subscribe({
        next: () => {
          // alert("تم الحذف بنجاح");
          this.toastrDeleteSuccess();
          this.getAllDetailsForms();
          console.log("details delete res: ");
        },
        error: () => {
          // alert("خطأ أثناء حذف التفاصيل !!");
        }
      })
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

  // getFiscalYears() {
  //   this.api.getFiscalYears().subscribe({
  //     next: (res) => {
  //       this.fiscalYearsList = res;
  //       console.log('fiscalYears res in search: ', this.fiscalYearsList);
  //     },
  //     error: (err) => {
  //       // console.log("fetch fiscalYears data err: ", err);
  //       // alert("خطا اثناء جلب العناصر !");
  //     },
  //   });
  // }

  async getFiscalYears() {

    this.api.getFiscalYears()
      .subscribe({
        next: async (res) => {
          this.fiscalYearsList = res;

          this.api.getLastFiscalYear()
            .subscribe({
              next: async (res) => {
                // this.defaultFiscalYearSelectValue = await this.fiscalYearsList.find((yearList: { fiscalyear: number; }) => yearList.fiscalyear == new Date().getFullYear());
                this.defaultFiscalYearSelectValue = await res;
                console.log("selectedYearggggggggggggggggggg: ", this.defaultFiscalYearSelectValue);
                if (this.editData) {
                  console.log("selectedYear id in get: ", this.editData.fiscalYearId);

                  this.groupMasterForm.controls['fiscalYearId'].setValue(this.editData.fiscalYearId);
                }
                else {
                  this.groupMasterForm.controls['fiscalYearId'].setValue(this.defaultFiscalYearSelectValue.id);
                  // this.getStrWithdrawAutoNo();
                  // this.getStrEmployeeOpenAutoNo();
                }
              },
              error: (err) => {
                // console.log("fetch store data err: ", err);
                // alert("خطا اثناء جلب المخازن !");
              }
            })


        },
        error: (err) => {
          // console.log("fetch fiscalYears data err: ", err);
          // alert("خطا اثناء جلب العناصر !");
        }
      })
  }

  getItems() {
    // this.loading = true;
    this.api.getItems().subscribe({
      next: (res) => {
        // this.loading = false;
        this.itemsList = res;
        this.cdr.detectChanges(); // Trigger change detection
      },
      error: (err) => {
        // this.loading = false;
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

    this.getCodeByItem(this.groupDetailsForm.getRawValue().itemId);

    // console.log("getMasterRowStoreId: ", this.getMasterRowStoreId);

    this.api.getSumQuantity(
      this.groupMasterForm.getRawValue().storeId,
      this.groupDetailsForm.getRawValue().itemId,
    )

      .subscribe({
        next: (res) => {
          // this.priceCalled = res;
          console.log("systemqty res:", res)
          this.groupDetailsForm.controls['systemQty'].setValue(res);
          console.log("balanceQty called res: ", this.groupDetailsForm.getRawValue().systemQty);
          this.groupDetailsForm.controls['balance'].setValue((parseFloat(this.groupDetailsForm.getRawValue().systemQty) - parseFloat(this.groupDetailsForm.getRawValue().qty)));

        },
        error: (err) => {
          console.log("fetch fiscalYears data err: ", err);
          alert("خطا اثناء جلب الكمية الحالية  !");
        }
      })
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
    let store = this.groupMasterSearchForm.getRawValue().storeId;
    let item = this.groupMasterSearchForm.getRawValue().itemId;
    let costCenter = this.groupMasterSearchForm.getRawValue().costCenterId;
    let employee = this.groupMasterSearchForm.getRawValue().employeeId;

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
    let EndDate = formatDate(row.date, 'MM-dd-yyyy', this.locale);
    let LastYearDate = new Date(EndDate);
    LastYearDate.setFullYear(LastYearDate.getFullYear() - 1);
    let StartDate = formatDate(LastYearDate, 'MM-dd-yyyy', this.locale);
    let report = 'StockTakingDetailsReport';
    let reportType = 'pdf';

    console.log("row data to print report, id: ", id, " StartDate: ", StartDate, " EndDate: ", EndDate, " reportName: ", report, " reportType: ", reportType);


    if (report != null && reportType != null) {

      if (report == 'StockTakingCommodityIdTotalReport') {
        id = 6;
      }

      this.api
        .getStrStockTakingDetailsReport(
          id, StartDate, EndDate, report, reportType
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
    let storeId = this.groupMasterSearchForm.getRawValue().storeId;
    let id;
    if (report != null && reportType != null) {
      // this.loading = true;

      if (report == 'StockTakingCommodityIdTotalReport') {
        id = 6;
      }

      this.api
        .getStrStockTakingItem(
          id, no, StartDate, EndDate, storeId, fiscalYear, itemId, report, 'pdf'
        )
        .subscribe({
          next: (res) => {
            // this.loading = false;
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
            // this.loading = false;
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
    let storeId = this.groupMasterSearchForm.getRawValue().storeId;
    let id;

    if (report != null && reportType != null) {

      if (report == 'StockTakingCommodityIdTotalReport') {
        id = 6;
      }

      this.api
        .getStrStockTakingItem(id, no, StartDate, EndDate, storeId, fiscalYear, itemId, report, 'pdf')
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
    let store = this.groupMasterSearchForm.getRawValue().storeId;
    let item = this.groupDetailsForm.getRawValue().itemId;
    // this.loading = true;
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


  // -------------------------------------------------------------------------------------------

  tabSelected(tab: any) {
    console.log("tab selected: ", tab);
    if (tab.index == 0) {
      this.getAllMasterForms();
    }
  }

  async nextToAddFormDetails() {
    this.groupMasterForm.removeControl('id')

    this.groupMasterForm.controls['total'].setValue(Number(this.sumOfTotals.toFixed(2)))
    // this.storeName = await this.getStoreByID(this.groupMasterForm.getRawValue().storeId);

    // this.groupMasterForm.controls['storeName'].setValue(this.storeName);

    console.log("dataName: ", this.groupMasterForm.value)
    // if (this.groupMasterForm.getRawValue().no) {
    //   console.log("no changed: ", this.groupMasterForm.getRawValue().no)
    // }
    // else {
    //   this.groupMasterForm.controls['no'].setValue(this.autoNo);
    //   console.log("no took auto number: ", this.groupMasterForm.getRawValue().no)
    // }
    if (this.groupMasterForm.valid) {
      console.log("Master add form : ", this.groupMasterForm.value)

      this.api.postStrStockTaking(this.groupMasterForm.value)
        .subscribe({
          next: (res) => {
            // console.log("ID header after post req: ", res);
            this.getMasterRowId = {
              "id": res
            };
            console.log("mastered res: ", this.getMasterRowId.id)
            this.MasterGroupInfoEntered = true;

            this.toastrSuccess();
            this.getAllMasterForms();
            this.getAllDetailsForms();

            // this.updateDetailsForm()
          },
          error: (err) => {
            console.log("header post err: ", err);
            // alert("حدث خطأ أثناء إضافة مجموعة")
          }
        })
    }
    // else {
    //   alert("تاكد من ادخال البيانات صحيحة")
    // }
  }

  updateMaster() {
    console.log("nnnvvvvvvvvvv: ", this.groupMasterForm.value);
    // console.log("nnnvvvvvvvvvvhhhhhhhhhhh: ", this.isEdit);
    // if (this.isEdit == false) {
    //   this.groupMasterForm.controls['no'].setValue(this.autoNo);
    // }
    // this.groupDetailsForm.controls['transactionUserId'].setValue(this.userIdFromStorage);
    console.log("update both: ", this.groupDetailsForm.valid);
    // console.log("edit : ", this.groupDetailsForm.value)
    this.api.putStrStockTaking(this.groupMasterForm.value)
      .subscribe({
        next: (res) => {
          this.groupDetailsForm.reset();
          this.itemByFullCodeValue = '';
          this.fullCodeValue = '';
          this.groupDetailsForm.controls['qty'].setValue(1);
          this.getAllMasterForms();
          // this.toastrEditSuccess();
        },

      })
  }

  storeValueChanges(storeId: any) {
    console.log('store: ', storeId);
    this.storeSelectedId = storeId;
    this.groupMasterForm.controls['storeId'].setValue(this.storeSelectedId);
    this.isEdit = false;
    console.log('kkkkkkkkkkk:', this.isEdit);

    // this.getStrEmployeeOpenAutoNo();
  }

  async fiscalYearValueChanges(fiscalyaerId: any) {
    console.log("fiscalyaer: ", fiscalyaerId)
    this.fiscalYearSelectedId = await fiscalyaerId;
    this.groupMasterForm.controls['fiscalYearId'].setValue(this.fiscalYearSelectedId);
    this.isEdit = false;

    // this.getStrOpenAutoNo();
  }

  getAllDetailsForms() {

    if (this.editData) {
      this.getMasterRowId = {
        "id": this.editData.id
      }
    }

    this.api.getStrStockTakingDetailsByMasterId(this.getMasterRowId.id).subscribe({
      next: (res) => {
        this.matchedIds = res;
        console.log("eeeeeeeeeeeeeeeeeeeeeeeeeeee: ", res, "paginate: ", this.paginator);

        if (this.matchedIds) {

          this.sumOfTotals = 0;
          for (let i = 0; i < this.matchedIds.length; i++) {
            this.sumOfTotals = this.sumOfTotals + parseFloat(this.matchedIds[i].total);
            this.sumOfTotals = Number(this.sumOfTotals.toFixed(2));
            this.groupMasterForm.controls['total'].setValue(Number(this.sumOfTotals.toFixed(2)));
            // alert('totalll: '+ this.sumOfTotals)
            // this.updateBothForms();
            this.updateMaster();
          }
        }
      },
      error: (err) => {
        // console.log("fetch items data err: ", err);
        // alert("خطا اثناء جلب العناصر !");
      }
    })

    console.log("mastered row get all data: ", this.getMasterRowId);
    if (this.getMasterRowId) {
      console.log("currentPage: ", this.currentPageDetails, "pageSize: ", this.pageSizeDetails);

      if (!this.currentPageDetails) {
        this.currentPageDetails = 0;
        this.pageSizeDetails = 5;

        this.isLoading = true;
        console.log("first time: ");

        fetch(this.api.getStrStockTakingDetailsPaginateByMasterId(this.getMasterRowId.id, this.currentPageDetails, this.pageSizeDetails))
          .then(response => response.json())
          .then(data => {
            // this.totalRows = data.length;
            console.log("master data paginate first Time: ", data);
            this.dataSourceDetails.data = data.items;
            this.pageIndexDetails = data.page;
            this.pageSizeDetails = data.pageSize;
            this.lengthDetails = data.totalItems;
            setTimeout(() => {
              this.paginator.pageIndex = this.currentPageDetails;
              this.paginator.length = this.lengthDetails;
            });
            this.isLoading = false;
          }, error => {
            console.log(error);
            this.isLoading = false;
          });
      }
      else {
        this.isLoading = true;
        console.log("second time: ");

        fetch(this.api.getStrStockTakingDetailsPaginateByMasterId(this.getMasterRowId.id, this.currentPageDetails, this.pageSizeDetails))
          .then(response => response.json())
          .then(data => {
            // this.totalRows = data.length;
            console.log("master data paginate: ", data);
            this.dataSourceDetails.data = data.items;
            this.pageIndexDetails = data.page;
            this.pageSizeDetails = data.pageSize;
            this.lengthDetails = data.totalItems;
            setTimeout(() => {
              this.paginator.pageIndex = this.currentPageDetails;
              this.paginator.length = this.lengthDetails;
            });
            this.isLoading = false;
          }, error => {
            console.log(error);
            this.isLoading = false;
          });
      }

    }
  }

  pageChangedDetails(event: PageEvent) {
    console.log("page event: ", event);
    this.pageSizeDetails = event.pageSize;
    this.currentPageDetails = event.pageIndex;
    // this.currentPage = event.previousPageIndex;
    this.getAllDetailsForms();
  }


  // ------------------------------------------------------------------------------------------------

  editDetailsForm(row: any) {
    console.log("editData details: ", row);
    this.editDataDetails = row;

    this.isEdit = true;
    console.log("nnnnnnnnnnnnnnnnnnn edit d before: ", this.groupDetailsForm);

    // this.actionBtnMaster = "Update";
    this.groupDetailsForm.controls['strStockTakingId'].setValue(this.editDataDetails.strStockTakingId);
    this.groupDetailsForm.controls['transactionUserId'].setValue(this.editDataDetails.transactionUserId);

    this.groupDetailsForm.controls['qty'].setValue(this.editDataDetails.qty);
    this.groupDetailsForm.controls['price'].setValue(this.editDataDetails.price);
    this.groupDetailsForm.controls['systemQty'].setValue(this.editDataDetails.systemQty);
    this.groupDetailsForm.controls['balance'].setValue(this.editDataDetails.balance);
    this.groupDetailsForm.controls['notes'].setValue(this.editDataDetails.notes);

    this.groupDetailsForm.controls['total'].setValue(this.editDataDetails.total);
    this.fullCodeValue = this.editDataDetails.fullCode;

    this.groupDetailsForm.controls['itemId'].setValue(this.editDataDetails.itemId);

    console.log("nnnnnnnnnnnnnnnnnnn edit d after: ", this.editDataDetails);


    this.groupDetailsForm.addControl('id', new FormControl('', Validators.required));
    this.groupDetailsForm.controls['id'].setValue(this.editDataDetails.id);


    if (this.groupDetailsForm.getRawValue().price == 0 || this.editDataDetails?.price == 0) {
      this.isReadOnly = false;
      console.log("change readOnly to enable here");
    }
    else {
      this.isReadOnly = true;
      console.log("change readOnly to disable here");
    }


  }

  getCodeByItem(item: any) {
    console.log("item by code: ", item, "code: ", this.itemsList);

    // if (item.keyCode == 13) {
    this.itemsList.filter((a: any) => {
      if (a.id === item) {
        // this.groupDetailsForm.controls['itemId'].setValue(a.id);
        console.log("item by code selected: ", a)
        // console.log("item by code selected: ", a.fullCode)
        if (a.fullCode) {
          this.fullCodeValue = a.fullCode;
        }
        else {
          this.fullCodeValue = '-';
        }

        // this.itemOnChange(this.groupDetailsForm.getRawValue().itemId)
      }
    })
    // }


  }

  getItemByCode(code: any) {
    if (code.keyCode == 13) {
      this.itemsList.filter((a: any) => {
        if (a.fullCode === code.target.value) {
          this.groupDetailsForm.controls['itemId'].setValue(a.id);
          console.log("item by code: ", a.name);
          this.itemCtrl.setValue(a.name);
          if (a.name) {
            this.itemByFullCodeValue = a.name;

            this.api.getSumQuantity(
              this.groupMasterForm.getRawValue().storeId,
              this.groupDetailsForm.getRawValue().itemId,
            )

              .subscribe({
                next: (res) => {
                  // this.priceCalled = res;
                  console.log("systemqty res:", res)
                  this.groupDetailsForm.controls['systemQty'].setValue(res);
                  console.log("balanceQty called res: ", this.groupDetailsForm.getRawValue().systemQty);
                  this.groupDetailsForm.controls['balance'].setValue((parseFloat(this.groupDetailsForm.getRawValue().systemQty) - parseFloat(this.groupDetailsForm.getRawValue().qty)));

                },
                error: (err) => {
                  console.log("fetch fiscalYears data err: ", err);
                  alert("خطا اثناء جلب الكمية الحالية  !");
                }
              })

          }
          else {
            this.itemByFullCodeValue = '-';
          }
          this.itemByFullCodeValue = a.name;
          // this.itemOnChange(this.groupDetailsForm.getRawValue().itemId);

        }
      })
    }


  }

  addNewDetails() {
    this.groupDetailsForm.controls['balance'].setValue((parseFloat(this.groupDetailsForm.getRawValue().systemQty) - parseFloat(this.groupDetailsForm.getRawValue().qty)));

    this.groupDetailsForm.controls['total'].setValue((parseFloat(this.groupDetailsForm.getRawValue().price) * parseFloat(this.groupDetailsForm.getRawValue().qty)));
    if (this.groupDetailsForm.getRawValue().itemId) {

      // this.itemName = await this.getItemByID(this.groupDetailsForm.getRawValue().itemId);
      // this.groupDetailsForm.controls['itemName'].setValue(this.itemName);

      // this.groupDetailsForm.controls['transactionUserId'].setValue(localStorage.getItem('transactionUserId'));
    }

    console.log("nnnvvvvvvvvvv post d: ", this.groupDetailsForm.value);
    console.log("nnnvvvvvvvvvvhhhhhhhhhhh: ", this.isEdit);
    // if (this.isEdit == false) {
    //   this.groupMasterForm.controls['no'].setValue(this.autoNo);
    // }

    if (!this.editDataDetails) {
      console.log("enter fun: ");

      if (this.getMasterRowId) {
        console.log("enter fun with id: ", this.getMasterRowId);

        // if (this.groupDetailsForm.getRawValue().itemId) {

        //   // this.itemName = await this.getItemByID(this.groupDetailsForm.getRawValue().itemId);
        //   // this.groupDetailsForm.controls['itemName'].setValue(this.itemName);
        //   this.groupDetailsForm.controls['strStockTakingId'].setValue(this.getMasterRowId.id);
        //   // console.log(typeof(this.getMasterRowId))
        //   // this.groupDetailsForm.controls['transactionUserId'].setValue(localStorage.getItem('transactionUserId'));
        // }

        this.groupDetailsForm.controls['strStockTakingId'].setValue(this.getMasterRowId.id);
        this.groupDetailsForm.controls['balance'].setValue((parseFloat(this.groupDetailsForm.getRawValue().systemQty) - parseFloat(this.groupDetailsForm.getRawValue().qty)));

        this.groupDetailsForm.controls['total'].setValue((parseFloat(this.groupDetailsForm.getRawValue().price) * parseFloat(this.groupDetailsForm.getRawValue().qty)));
        this.groupDetailsForm.controls['transactionUserId'].setValue(this.userIdFromStorage);
        console.log("post d: ", this.groupDetailsForm.value);

        if (this.groupDetailsForm.valid) {
          if (this.groupDetailsForm.getRawValue().balance < 0) {
            this.toastrBalanceWarning();
          }
          else {
            console.log("form before post:", this.groupDetailsForm.value)

            this.api.postStrStockTakingDetails(this.groupDetailsForm.value)
              .subscribe({
                next: (res) => {
                  this.toastrSuccess();
                  this.groupDetailsForm.reset();
                  this.groupDetailsForm.controls['qty'].setValue(1);
                  this.groupDetailsForm.controls['systemQty'].setValue(1);
                  // this.updateDetailsForm();
                  // this.getAllDetailsForms();
                  this.itemCtrl.setValue('');
                  this.itemByFullCodeValue = '';
                  this.fullCodeValue = '';
                  // this.dialogRef.close('save');

                  // this.updateDetailsForm()
                  this.getAllDetailsForms();
                },
                error: (err) => {
                  // alert("حدث خطأ أثناء إضافة مجموعة")
                  console.log("err posttttt: ", err)
                }
              })
          }

        }

      }

    }
    else {
      console.log("update d: ", this.groupDetailsForm.valid);

      this.updateDetailsForm();
    }


  }

  async updateDetailsForm() {
    // this.storeName = await this.getStoreByID(this.groupMasterForm.getRawValue().storeId);
    // this.groupMasterForm.controls['storeName'].setValue(this.storeName);

    // this.groupDetailsForm.controls['itemName'].setValue(this.itemName);

    // if (this.editData) {
    //   this.groupMasterForm.addControl('id', new FormControl('', Validators.required));
    //   this.groupMasterForm.controls['id'].setValue(this.editData.id);
    // }

    // this.groupDetailsForm.addControl('id', new FormControl('', Validators.required));
    // this.groupDetailsForm.controls['id'].setValue(this.editData.id);
    this.groupDetailsForm.controls['balance'].setValue((parseFloat(this.groupDetailsForm.getRawValue().systemQty) - parseFloat(this.groupDetailsForm.getRawValue().qty)));

    this.groupDetailsForm.controls['total'].setValue((parseFloat(this.groupDetailsForm.getRawValue().price) * parseFloat(this.groupDetailsForm.getRawValue().qty)));

    this.isEdit = false;
    console.log("edit : ", this.groupDetailsForm.value, "row: ", this.editDataDetails.id)
    // this.api.putStrOpen(this.groupMasterForm.value)
    // .subscribe({
    //   next: (res) => {
    if (this.groupDetailsForm.valid) {
      if (this.groupDetailsForm.getRawValue().balance < 0) {
        this.toastrBalanceWarning();
      }
      else {
        this.api.putStrStockTakingDetails(this.groupDetailsForm.value, this.editDataDetails.id)
          .subscribe({
            next: (res) => {

              this.toastrSuccess();
              this.groupDetailsForm.reset();
              this.itemCtrl.setValue('');
              this.itemByFullCodeValue = '';
              this.fullCodeValue = '';

              // this.getDetailedRowData = '';
              this.groupDetailsForm.controls['qty'].setValue(1);
              this.groupDetailsForm.controls['systemQty'].setValue(1);
              this.getAllDetailsForms();

            },
            error: (err) => {
              console.log("update err: ", err)
              // alert("خطأ أثناء تحديث سجل المجموعة !!")
            }
          })
      }
    }

    //   },

    // })
  }

  toastrSuccess(): void {
    this.toastr.success("تم الحفظ بنجاح");
  }
  toastrBalanceWarning(): void {
    this.toastr.warning("لا يمكن الاضافة او التعديل لعدم وجود الكمية الكفاية من رصيد المخزن !");
  }
  toastrEditSuccess(): void {
    this.toastr.success("تم التعديل بنجاح");
  }

}
