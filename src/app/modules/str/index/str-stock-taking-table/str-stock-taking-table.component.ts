import { Component, Inject, LOCALE_ID, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from '../../services/api.service';
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
} from '@angular/forms';
import { Observable, map, startWith, tap } from 'rxjs';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { HotkeysService } from 'angular2-hotkeys';
import { Hotkey } from 'angular2-hotkeys';
import { GlobalService } from 'src/app/pages/services/global.service';
import { PrintDialogComponent } from '../print-dialog/print-dialog.component';

export class store {
  constructor(public id: number, public name: string) { }
}

export class Employee {
  constructor(public id: number, public name: string, public code: string) { }
}

// export class Employee {
//   constructor(public id: number, public name: string, public code: string) { }
// }

// export class costcenter {
//   constructor(public id: number, public name: string) { }
// }
export class item {
  constructor(public id: number, public name: string) { }
}

@Component({
  selector: 'app-str-stock-taking-table',
  templateUrl: './str-stock-taking-table.component.html',
  styleUrls: ['./str-stock-taking-table.component.css'],
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

  constructor(
    private api: ApiService,
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private hotkeysService: HotkeysService,
    private global: GlobalService,
    @Inject(LOCALE_ID) private locale: string,
    private toastr: ToastrService
  ) {
    global.getPermissionUserRoles('Store', 'stores', 'إدارة المخازن وحسابات المخازن ', 'store')
    this.storeCtrl = new FormControl();
    this.filteredstore = this.storeCtrl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filterstores(value))
    );

    // this.costcenterCtrl = new FormControl();
    // this.filteredcostcenter = this.costcenterCtrl.valueChanges.pipe(
    //   startWith(''),
    //   map(value => this._filtercostcenters(value))
    // );

    this.itemCtrl = new FormControl();
    this.filtereditem = this.itemCtrl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filteritems(value))
    );

    // this.employeeCtrl = new FormControl();
    // this.filteredEmployee = this.employeeCtrl.valueChanges.pipe(
    //   startWith(''),
    //   map(value => this._filteremployees(value))
    // );
  }

  ngOnInit(): void {
    this.getAllMasterForms();
    // this.getAllEmployees();
    this.getFiscalYears();
    // this.getEmployees();
    this.getItme();
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
    this.dialog.open(StrStockTakingDialogComponent, {
      width: '72%',
      height: '79%',
    }).afterClosed().subscribe(val => {
      if (val === 'Save') {
        // alert("refreshhhh")
        this.getAllMasterForms();
      }
    })

  }
  editMasterForm(row: any) {
    this.dialog
      .open(StrStockTakingDialogComponent, {
        width: '72%',
        height: '79%',
        data: row,
      })
      .afterClosed()
      .subscribe((val) => {
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
          // this.toastrDeleteSuccess();
          // this.getAllDetailsForms()
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

  getItme() {
    this.api.getItems().subscribe({
      next: (res) => {
        this.itemsList = res;
        console.log('item res: ', this.itemsList);
      },
      error: (err) => {
        console.log('fetch employees data err: ', err);
        // alert("خطا اثناء جلب الموظفين !");
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
    if (report != null && reportType != null) {
      this.api
        .getStrStockTakingItem(
          no, StartDate, EndDate, storeId, fiscalYear, itemId, report, 'pdf'
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


  download(
    no: any,
    StartDate: any,
    EndDate:any,
    fiscalYear: any,
    report: any,
    reportType: any
  ) {
    let itemId = this.groupDetailsForm.getRawValue().itemId;
    let storeId = this.groupMasterForm.getRawValue().storeId;

    if (report != null && reportType != null) {
      this.api
        .getStrStockTakingItem(no, StartDate, EndDate, storeId, fiscalYear, itemId, report, 'pdf')
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

    this.api
      .getStrStockTakingSearach(no, store, fiscalYear, item, StartDate, EndDate)
      .subscribe({
        next: (res) => {
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


}
