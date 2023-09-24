import { FiscalYear } from '../../str/str-employee-exchange-dialog/str-employee-exchange-dialog.component';
import { Component, Inject, LOCALE_ID, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from '../../services/api.service';
import { HttpClient } from '@angular/common/http';
import { formatDate } from '@angular/common';
import { StrWithdrawDialogComponent } from '../str-withdraw-dialog2/str-withdraw-dialog2.component';
import { ToastrService } from 'ngx-toastr';
import { SharedService } from '../../guards/shared.service';
import { GlobalService } from '../../services/global.service';
import { Observable, map, startWith, tap } from 'rxjs';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { WithdrawPrintDialogComponent } from 'src/app/str/withdraw-print-dialog/withdraw-print-dialog.component';

import {
  FormControl,
  FormControlName,
  FormBuilder,
  FormGroup,
} from '@angular/forms';

export class item {
  constructor(public id: number, public name: string) {}
}

export class Employee {
  constructor(public id: number, public name: string, public code: string) {}
}

export class costcenter {
  constructor(public id: number, public name: string) {}
}

export class store {
  constructor(public id: number, public name: string) {}
}

@Component({
  selector: 'app-str-withdraw-table2',
  templateUrl: './str-withdraw-table2.component.html',
  styleUrls: ['./str-withdraw-table2.component.css'],
})
export class StrWithdrawTableComponent implements OnInit {
  displayedColumns: string[] = [
    'no',
    'storeName',
    'employeeName',
    'desstoreName',
    'costCenterName',
    'fiscalyear',
    'date',
    'Action',
  ];
  matchedIds: any;
  // storeList: any;
  storeName: any;
  fiscalYearsList: any;
  fiscalyear: any;
  // employeesList: any;
  employeeName: any;
  // costcenterList: any;
  costCenterName: any;
  deststoreList: any;
  desstoreName: any;
  // itemsList:any;
  costCentersList: any;
  sharedStores: any;
  // form: FormGroup;
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

  storeList: store[] = [];
  storeCtrl: FormControl;
  filteredstore: Observable<store[]>;
  selectedstore: store | undefined;

  formcontrol = new FormControl('');
  dataSource2!: MatTableDataSource<any>;
  pdfurl = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private api: ApiService,
    private dialog: MatDialog,
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    @Inject(LOCALE_ID) private locale: string,
    public shared: SharedService,
    private global: GlobalService
  ) {
    // this.form = this.formBuilder.group({
    //   name: [''],
    //   email: ['']
    // });

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

    this.sharedStores = shared.stores;
  }

  ngOnInit(): void {
    this.getDestStores();
    this.getFiscalYears();
    this.getItems();

    this.getCostCenters();
    this.getAllMasterForms();
    this.getStores();
    this.getEmployees();
    console.log('looo', this.sharedStores);

    this.groupMasterForm = this.formBuilder.group({
      no: [''],
      employee: [''],
      costcenter: [''],
      // :[''],
      //  costcentersList:[''],
      costCenterId: [''],
      item: [''],
      fiscalyear: [''],
      date: [''],
      store: [''],
      storeId: [''],
      employeeId: [''],
      employeeName: [''],
    });
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
  openWithdrawDialog() {
    this.dialog
      .open(StrWithdrawDialogComponent, {
        width: '95%',
        height: '95%',
      })
      .afterClosed()
      .subscribe((val) => {
        if (val === 'Save') {
          // alert("refresh")

          this.getAllMasterForms();
        }
      });
    //   dRef.componentInstance.onSubmit.subscribe(() => {

    //    dRef.close();
    // });}
  }
  // getAllAfterCancel(){
  //   this.api.getStrWithdraw().subscribe({
  //     next: (res) => {

  //       console.log('response of get all getGroup from api: ', res);
  //       this.dataSource2 = new MatTableDataSource(res);
  //       this.dataSource2.paginator = this.paginator;
  //       this.dataSource2.sort = this.sort;

  //     },
  //     error: () => {
  //       alert('خطأ أثناء جلب سجلات اذن الصرف !!');
  //     },
  //   });
  // }

  getAllMasterForms() {
    this.api.getStrWithdraw().subscribe({
      next: (res) => {
        console.log('response of get all getGroup from api: ', res);
        this.dataSource2 = new MatTableDataSource(res);
        this.dataSource2.paginator = this.paginator;
        this.dataSource2.sort = this.sort;
        this.groupMasterForm.reset();
        // this.costcenterCtrl.setValue('');

        // this.groupMasterForm.getRawValue().costCenterId= null;
        // this.groupMasterForm.controls['costcenter'].setValue(null)
        // ;this.groupMasterForm.getRawValue().selectedcostcenter?.id.setValue('')

        console.log(
          'costcenterId in getall:',
          this.groupMasterForm.getRawValue().selectedcostcenter?.id
        );

        // this.groupMasterForm.controls('costcenter').setValue('')
        // if (this.selectedcostcenter?.id != undefined) {
        //   this.selectedcostcenter?.id?.se

        // }
      },
      error: () => {
        // alert('خطأ أثناء جلب سجلات اذن الصرف !!');
      },
    });
  }

  editMasterForm(row: any) {
    this.dialog
      .open(StrWithdrawDialogComponent, {
        width: '95%',
        height: '95%',
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
    console.log(' id in delete:', id);
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
                // alert('تم حذف الاذن بنجاح');
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

  deleteFormDetails(id: number) {
    this.api.deleteStrWithdrawDetails(id).subscribe({
      next: (res) => {
        this.toastrDeleteSuccess();
        this.getAllMasterForms();
      },
      error: (err) => {
        // console.log("delete details err: ", err)
        // alert('خطأ أثناء حذف الصنف !!');
      },
    });
  }
  getItems() {
    this.api.getItems().subscribe({
      next: (res) => {
        this.itemsList = res;
        console.log('items res: ', this.itemsList);
      },
      error: (err) => {
        console.log('fetch items data err: ', err);
        // alert("خطا اثناء جلب العناصر !");
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
    this.api.getCostCenter().subscribe({
      next: (res) => {
        this.costcentersList = res;
        console.log('costcenter res: ', this.costCentersList);
      },
      error: (err) => {
        // console.log("fetch store data err: ", err);
        // alert('خطا اثناء جلب مركز التكلفة !');
      },
    });
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
        console.log('deststore res: ', this.deststoreList);
      },
      error: (err) => {
        // console.log("fetch store data err: ", err);
        // alert('خطا اثناء جلب المخازن الخارجية !');
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

  getSearchStrWithdraw(no: any, date: any, fiscalYear: any) {
    let costCenter = this.groupMasterForm.getRawValue().costCenterId;
    let employee = this.groupMasterForm.getRawValue().employeeId;
    let item = this.groupMasterForm.getRawValue().itemId;
    let store = this.groupMasterForm.getRawValue().storeId;

    this.api
      .getStrWithdrawSearch(
        no,
        store,
        date,
        fiscalYear,
        item,
        employee,
        costCenter
      )
      .subscribe({
        next: (res) => {
          this.dataSource2 = res;
          this.dataSource2.paginator = this.paginator;
          this.dataSource2.sort = this.sort;
        },
        error: (err) => {
          console.log('eroorr', err);
        },
      });
  }
  downloadPrint(no: any, date: any, fiscalYear: any) {
    let costCenter = this.groupMasterForm.getRawValue().costCenterId;
    let employee = this.groupMasterForm.getRawValue().employeeId;
    let item = this.groupMasterForm.getRawValue().itemId;
    let store = this.groupMasterForm.getRawValue().storeId;

    this.api
      .printReportStrWithdraw(
        no,
        store,
        date,
        fiscalYear,
        item,
        employee,
        costCenter
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

  // printReport() {
  //   // this.loadAllData();
  //   let header: any = document.getElementById('header');
  //   let paginator: any = document.getElementById('paginator');
  //   let action1: any = document.getElementById('action1');
  //   let action2: any = document.querySelectorAll('action2');
  //   console.log(action2);
  //   let button1: any = document.querySelectorAll('#button1');
  //   console.log(button1);
  //   let button2: any = document.getElementById('button2');
  //   let button: any = document.getElementsByClassName('mdc-icon-button');
  //   console.log(button);
  //   let buttn: any = document.querySelectorAll('#buttn');
  //   for (let index = 0; index < buttn.length; index++) {
  //     buttn[index].hidden = true;
  //   }

  //   let actionHeader: any = document.getElementById('action-header');
  //   actionHeader.style.display = 'none';

  //   let reportFooter: any = document.getElementById('reportFooter');
  //   let date: any = document.getElementById('date');
  //   header.style.display = 'grid';
  //   // button1.style.display = 'none';
  //   // button2.style.display = 'none';

  //   let printContent: any = document.getElementById('content')?.innerHTML;
  //   let originalContent: any = document.body.innerHTML;
  //   document.body.innerHTML = printContent;
  //   // console.log(document.body.children);
  //   document.body.style.cssText =
  //     'direction:rtl;-webkit-print-color-adjust:exact;';
  //   window.print();
  //   document.body.innerHTML = originalContent;
  //   location.reload();
  // }

  previewPrint(no: any, date: any, fiscalYear: any) {
    let costCenter = this.groupMasterForm.getRawValue().costCenterId;
    let employee = this.groupMasterForm.getRawValue().employeeId;
    let item = this.groupMasterForm.getRawValue().itemId;
    let store = this.groupMasterForm.getRawValue().storeId;

    this.api
      .printReportStrWithdraw(
        no,
        store,
        date,
        fiscalYear,
        item,
        employee,
        costCenter
      )
      .subscribe({
        next: (res) => {
          let blob: Blob = res.body as Blob;
          console.log(blob);
          let url = window.URL.createObjectURL(blob);
          localStorage.setItem('url', JSON.stringify(url));
          this.pdfurl = url;
          this.dialog.open(WithdrawPrintDialogComponent, {
            width: '70%',
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
  }

  toastrDeleteSuccess(): void {
    this.toastr.success('تم الحذف بنجاح');
  }
}
