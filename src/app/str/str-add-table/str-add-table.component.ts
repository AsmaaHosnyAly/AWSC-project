import { Component, Inject, LOCALE_ID, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { formatDate } from '@angular/common';
import { STRAddDialogComponent } from '../str-add-dialog/str-add-dialog.component';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { GlobalService } from 'src/app/services/global.service';
import { ToastrService } from 'ngx-toastr';
import { Observable, map, startWith, tap } from 'rxjs';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

import { HotkeysService } from 'angular2-hotkeys';
import { Hotkey } from 'angular2-hotkeys';

import {
  FormControl,
  FormControlName,
  FormBuilder,
  FormGroup,
} from '@angular/forms';




export class item {
  constructor(public id: number, public name: string) { }
}

export class Employee {
  constructor(public id: number, public name: string, public code: string) { }
}

export class costcenter {
  constructor(public id: number, public name: string) { }
}

export class store {
  constructor(public id: number, public name: string) { }
}



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
    'employeeName',
    'fiscalyear',
    'date',
    'receiptName',
    'typeName',
    'Action',
  ];
  displayedPendingColumns: string[] = [
    'no',
    'costCenterName',
    'storeName',
    'desstoreName',
    'fiscalyear',
    'date',
    'Action',
  ];

  fiscalYearsList: any;

  matchedIds: any;
  // storeList: any;
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
  dataSourcePendingWithdraws!: MatTableDataSource<any>;
  pdfurl = '';

  groupMasterForm!: FormGroup;


  costcentersList: costcenter[] = [];
  costcenterCtrl: FormControl<any>;
  filteredcostcenter: Observable<costcenter[]>;
  selectedcostcenter: costcenter | undefined;

  employeesList: Employee[] = [];
  employeeCtrl: FormControl<any>;
  filteredEmployee: Observable<Employee[]>;
  selectedEmployee: Employee | undefined;

  itemsList: item[] = [];
  itemCtrl: FormControl;
  filtereditem: Observable<item[]>;
  selecteditem: item | undefined;

  // storeList: store[] = [];
  storeList: any;
  storeCtrl: FormControl;
  filteredstore: Observable<store[]>;
  selectedstore: store | undefined;

  // @ViewChild(MatPaginator) paginator!: MatPaginator;
  // @ViewChild(MatPaginator) paginatorPendingWithdraw!: MatPaginator;
  @ViewChild('paginatorLegal')
  paginatorLegal!: MatPaginator;
  @ViewChild('paginatorGSTN')
  paginatorGSTN!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  dataSource!: MatTableDataSource<any>;
  groupDetailsForm !: FormGroup;
  userRoles: any;

  constructor(
    private api: ApiService,
    private global: GlobalService,
    private hotkeysService: HotkeysService,
    private dialog: MatDialog, private toastr: ToastrService,

    private http: HttpClient,
    private router: Router,
    @Inject(LOCALE_ID) private locale: string,
    private formBuilder: FormBuilder
  ) {
    this.costcenterCtrl = new FormControl();
    this.filteredcostcenter = this.costcenterCtrl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filtercostcenters(value))
    );

    this.employeeCtrl = new FormControl();
    this.filteredEmployee = this.employeeCtrl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filteremployees(value))
    );

    this.itemCtrl = new FormControl();
    this.filtereditem = this.itemCtrl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filteritems(value))
    );

    this.storeCtrl = new FormControl();
    this.filteredstore = this.storeCtrl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filterstores(value))
    );
    this.global.getPermissionUserRoles(2, 'stores', ' إذن إضافة ', '');
  }

  ngOnInit(): void {
    this.getAllMasterForms();
    this.getFiscalYears();
    this.getCostCenters();

    this.getStores();
    this.getTypes();
    this.getSellers();
    this.getReciepts();
    this.getEmployees();

    this.groupDetailsForm = this.formBuilder.group({
      stR_WithdrawId: [''], //MasterId
      employeeId: [''],
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
    this.hotkeysService.add(new Hotkey('ctrl+o', (event: KeyboardEvent): boolean => {
      // Call the deleteGrade() function in the current component
      this.openAddDialog();
      return false; // Prevent the default browser behavior
    }));
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource2.filter = filterValue.trim().toLowerCase();

    if (this.dataSource2.paginator) {
      this.dataSource2.paginator.firstPage();
    }
  }
  applyPendingWithdrawFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourcePendingWithdraws.filter = filterValue.trim().toLowerCase();

    if (this.dataSourcePendingWithdraws.paginator) {
      this.dataSourcePendingWithdraws.paginator.firstPage();
    }
  }

  getAllMasterForms() {
    this.api.getStrAdd().subscribe({
      next: (res) => {
        console.log('response of get all getGroup from api: ', res);
        this.dataSource2 = new MatTableDataSource(res);
        this.dataSource2.paginator = this.paginatorLegal;
        this.dataSource2.sort = this.sort;
        this.loadDataToLocalStorage(res);
      },
      error: () => {
        // alert('خطأ أثناء جلب سجلات المجموعة !!');
      },
    });
  }

  openAddDialog() {
    this.dialog
      .open(STRAddDialogComponent, {
        width: '98%',
        height: '95%',
      })
      .afterClosed()
      .subscribe((val) => {
        if (val === 'save') {
          this.getAllMasterForms();
        }
      });
  }

  getAllGroups() {
    this.api.getGroup().subscribe({
      next: (res) => {
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.paginator = this.paginatorLegal;
        this.dataSource.sort = this.sort;
      },
      error: () => {
        // alert("خطأ أثناء جلب سجلات المجموعة !!");
      },
    });
  }

  editMasterForm(row: any) {
    this.dialog
      .open(STRAddDialogComponent, {
        width: '98%',
        height: '95%',
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
                // alert('خطا اثناء تحديد المجموعة !!');
              }
            );

          this.getAllMasterForms();
        },
        error: () => {
          // alert('خطأ أثناء حذف المجموعة !!');
        },
      });
    }
  }

  deleteFormDetails(id: number) {
    this.api.deleteStrAdd(id).subscribe({
      next: (res) => {
        // alert('تم حذف الصنف بنجاح');
        this.toastrDeleteSuccess();
        this.getAllMasterForms();
      },
      error: (err) => {
        // console.log("delete details err: ", err)
        // alert('خطأ أثناء حذف الصنف !!');
      },
    });
  }
  getCostCenters() {
    this.api.getCostCenter().subscribe({
      next: (res) => {
        this.costcentersList = res;
        console.log('costcenter res: ', this.costcentersList);
      },
      error: (err) => {
        // console.log("fetch store data err: ", err);
        // alert('خطا اثناء جلب مركز التكلفة !');
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

  getStores() {
    this.userRoles = localStorage.getItem('userRoles');
    console.log('userRoles manager: ', this.userRoles.includes('15'))

    if (this.userRoles.includes('15')) {
      this.api.getStore().subscribe({
        next: (res) => {
          this.storeList = res;
          console.log("stores res: ", this.storeList);
        },
        error: (err) => {
          // console.log("fetch store data err: ", err);
          // alert('خطا اثناء جلب المخازن !');
        },
      });
    }
    else {
      console.log('userRoles stores by userID: ', localStorage.getItem('transactionUserId'))
      this.api.getUserStores(localStorage.getItem('transactionUserId'))
        .subscribe({
          next: async (res) => {
            this.storeList = res;
            console.log("user stores res: ", this.storeList);
          },
          error: (err) => {
            console.log("fetch userStore data err: ", err);
            // alert(" خطا اثناء جلب مخازن المستخدم !");
          }
        })
    }

  }


  getsearch(code: any) {
    if (code.keyCode == 13) {
      this.getAllMasterForms();
    }
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
        console.log("employeeeeeeeeee res: ", this.storeList);
      },
      error: (err) => {
        // console.log("fetch store data err: ", err);
        // alert("خطا اثناء جلب المخازن !");
      },
    });
  }

  displaycostcenterName(costcenter: any): string {
    return costcenter && costcenter.name ? costcenter.name : '';
  }
  costcenterSelected(event: MatAutocompleteSelectedEvent): void {
    const costcenter = event.option.value as costcenter;
    console.log('costcenter selected: ', costcenter);
    this.selectedcostcenter = costcenter;
    this.groupMasterForm.patchValue({ costCenterId: costcenter.id });
    console.log(
      'costcenter in form: ',
      this.groupMasterForm.getRawValue().costCenterId
    );

    // this.getSearchStrWithdraw()
    // this.set_store_Null(this.groupMasterForm.getRawValue().costCenterId);
    // return     this.groupMasterForm.patchValue({ costCenterId: costcenter.id });
  }
  private _filtercostcenters(value: string): costcenter[] {
    const filterValue = value;
    return this.costcentersList.filter((costcenter) =>
      costcenter.name.toLowerCase().includes(filterValue)
    );
  }
  openAutocostcenter() {
    this.costcenterCtrl.setValue(''); // Clear the input field value

    // Open the autocomplete dropdown by triggering the value change event
    this.costcenterCtrl.updateValueAndValidity();
  }

  /////employeee

  displayEmployeeName(employee: any): string {
    return employee && employee.name ? employee.name : '';
  }
  employeeSelected(event: MatAutocompleteSelectedEvent): void {
    const employee = event.option.value as Employee;
    console.log('employee selected: ', employee);
    this.selectedEmployee = employee;
    this.groupMasterForm.patchValue({ employeeId: employee.id });
    console.log(
      'employee in form: ',
      this.groupMasterForm.getRawValue().employeeId
    );

    // this.getSearchStrWithdraw()
    // this.set_store_Null(this.groupMasterForm.getRawValue().employeeId);
    // return     this.groupMasterForm.patchValue({ employeeId: employee.id });
  }
  private _filteremployees(value: string): Employee[] {
    const filterValue = value;
    return this.employeesList.filter((employee) =>
      employee.name.toLowerCase().includes(filterValue)
    );
  }
  openAutoEmployee() {
    this.employeeCtrl.setValue(''); // Clear the input field value

    // Open the autocomplete dropdown by triggering the value change event
    this.employeeCtrl.updateValueAndValidity();
  }

  /////itemmm
  displayitemName(item: any): string {
    return item && item.name ? item.name : '';
  }
  itemSelected(event: MatAutocompleteSelectedEvent): void {
    const item = event.option.value as item;
    console.log('item selected: ', item);
    this.selecteditem = item;
    this.groupMasterForm.patchValue({ itemId: item.id });
    console.log('item in form: ', this.groupMasterForm.getRawValue().itemId);
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

  ////storeeee
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

  getSearchStrAdd(no: any, date: any, fiscalyear: any) {
    console.log('fiscalyear in searchhhhh : ', fiscalyear, 'itemId',);
    // let costCenter = this.groupMasterForm.getRawValue().costCenterId;
    let employee = this.groupMasterForm.getRawValue().employeeId;
    let item = this.groupDetailsForm.getRawValue().itemId;
    let store = this.groupMasterForm.getRawValue().storeId;


    this.api.getStrAddSearach(no, date, fiscalyear, employee, item, store).subscribe({
      next: (res) => {
        this.dataSource2 = res;
        this.dataSource2.paginator = this.paginatorLegal;
        this.dataSource2.sort = this.sort;
      },
      error: (err) => {
        console.log('eroorr', err);
      },
    });
  }

  downloadPdf(no: any, store: any, date: any) {
    console.log('no. : ', no, 'store : ', store, 'date: ', date);
    this.api.strAdd(no, store, date).subscribe({
      next: (res) => {
        console.log('search:', res);
        const url: any = res.url;
        window.open(url);
        // let blob: Blob = res.body as Blob;
        // let url = window.URL.createObjectURL(blob);

        // this.dataSource = res;
        // this.dataSource.paginator = this.paginatorLegal;
        // this.dataSource.sort = this.sort;
      },
      error: (err) => {
        console.log('eroorr', err);
        window.open(err.url);
      },
    });
  }
  toastrSuccess(): void {
    this.toastr.success("تم الحفظ بنجاح");
  }
  toastrDeleteSuccess(): void {
    this.toastr.success("تم الحذف بنجاح");
  }
  toastrEditSuccess(): void {
    this.toastr.success('تم التعديل بنجاح');
  }
  loadDataToLocalStorage(data: any): void {
    console.log(data);
    localStorage.removeItem('store-data');
    localStorage.setItem('store-data', JSON.stringify(data));
  }

  print(no: any, date: any, fiscalyear: any) {

    let employee = this.groupMasterForm.getRawValue().employeeId;
    let item = this.groupDetailsForm.getRawValue().itemId;
    let store = this.groupMasterForm.getRawValue().storeId;

    this.api.getStrAddSearach(no, date, fiscalyear, employee, item, store).subscribe({
      next: (res) => {
        console.log('search addStock res: ', res);

        //enter no.
        if (no != '' && !store && !date) {
          // console.log("enter no. ")
          // console.log("no. : ", no, "store: ", store, "date: ", date)
          this.dataSource2 = res.filter((res: any) => res.no == no!);
          console.log('data after if :', this.dataSource2);
          this.dataSource2.paginator = this.paginatorLegal;
          this.dataSource2.sort = this.sort;
        }

        //enter store
        else if (!no && store && !date) {
          // console.log("enter store. ")
          // console.log("enter no. & store & date ", "res : ", res, "input no. : ", no, "input store: ", store, "input date: ", date)
          this.dataSource2 = res.filter((res: any) => res.storeId == store);
          this.dataSource2.paginator = this.paginatorLegal;
          this.dataSource2.sort = this.sort;
        }

        //enter date
        else if (!no && !store && date) {
          // console.log("enter date. ")
          // console.log("enter no. & store & date ", "res : ", res, "input no. : ", no, "input store: ", store, "input date: ", date)
          this.dataSource2 = res.filter(
            (res: any) => formatDate(res.date, 'M/d/yyyy', this.locale) == date
          );
          this.dataSource2.paginator = this.paginatorLegal;
          this.dataSource2.sort = this.sort;
        }

        //enter no. & store
        else if (no && store && !date) {
          // console.log("enter no & store ")
          // console.log("enter no. & store & date ", "res : ", res, "input no. : ", no, "input store: ", store, "input date: ", date)
          this.dataSource2 = res.filter(
            (res: any) => res.no == no! && res.storeId == store
          );
          this.dataSource2.paginator = this.paginatorLegal;
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
          this.dataSource2.paginator = this.paginatorLegal;
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
          this.dataSource2.paginator = this.paginatorLegal;
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
          this.dataSource2.paginator = this.paginatorLegal;
          this.dataSource2.sort = this.sort;
        }

        //didn't enter any data
        else {
          // console.log("enter no data ")
          this.dataSource2 = res;
          this.dataSource2.paginator = this.paginatorLegal;
          this.dataSource2.sort = this.sort;
        }

        this.loadDataToLocalStorage(res);
      },
      error: (err) => {
        alert('Error');
      },
    });
    this.router.navigate(['/add-item-report']);
  }

  storeValueChanges(storeId: any) {
    console.log("storeId selected to get pending withdraw: ", storeId);
    // this.groupMasterForm.controls['storeId'].setValue(storeId);

    this.getAllWithDrawByDestStore(storeId);

  }

  getAllWithDrawByDestStore(storeId: any) {
    let newRes: any[] | undefined = [];
    this.api.GetWithDrawByDestStore(storeId).subscribe({
      next: (res) => {
        console.log("pending withdraws: ", res);

        for (let i = 0; i < res.length; i++) {
          newRes?.push(res[i].strWithdrawGetVM);
        }

        console.log("pending withdraws new res: ", newRes);
        this.dataSourcePendingWithdraws = new MatTableDataSource(newRes);
        this.dataSourcePendingWithdraws.paginator = this.paginatorGSTN;
        this.dataSourcePendingWithdraws.sort = this.sort;

      },
      error: () => {
        // alert("خطأ أثناء جلب سجلات المجموعة !!");
      },
    });
  }

  acceptPendingWithdraw(row: any) {
    console.log("pending withdraw row: ", row.id, "userId: ", localStorage.getItem('transactionUserId'));
    let acceptId = 1;
    let userId = parseInt(localStorage.getItem('transactionUserId')!);

    console.log("type of row: ", typeof (row.id), "userId: ", typeof (userId), "acceptId: ", typeof (acceptId));

    let dataPending = {
      'userId': userId,
      'withDrawId': row.id,
      'state': acceptId
    };

    this.api.postAcceptOrRejectWithDrawByDestStore(dataPending)
      .subscribe({
        next: (res) => {
          console.log("res after accept or reject pending withdraw: ", res);
          this.getAllWithDrawByDestStore(row.storeId);
        },
        error: (err) => {
          console.log("post err after accept or reject pending withdraw: ", err);
          // alert("حدث خطأ أثناء إضافة مجموعة")
        }
      })
  }


  rejectPendingWithdraw(row: any) {
    console.log("pending withdraw row: ", row.id, "userId: ", localStorage.getItem('transactionUserId'));
    let rejectId = 0;
    let userId = parseInt(localStorage.getItem('transactionUserId')!);

    console.log("type of row: ", typeof (row.id), "userId: ", typeof (userId), "rejectId: ", typeof (rejectId));

    let dataPending = {
      'userId': userId,
      'withDrawId': row.id,
      'state': rejectId
    };

    this.api.postAcceptOrRejectWithDrawByDestStore(dataPending)
      .subscribe({
        next: (res) => {
          console.log("res after accept or reject pending withdraw: ", res);
          this.getAllWithDrawByDestStore(row.storeId);
        },
        error: (err) => {
          console.log("post err after accept or reject pending withdraw: ", err);
          // alert("حدث خطأ أثناء إضافة مجموعة")
        }
      })
  }
}