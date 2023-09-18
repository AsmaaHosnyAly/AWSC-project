import { StrCostcenterComponent } from './../str-costcenter/str-costcenter.component';
// import { CostCenter } from '../str/StrCostcenterComponent/';
// import { FiscalYear } from './../str-withdraw-dialog2/';
import { Component, OnInit, Inject, ViewChild, LOCALE_ID } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from '@angular/forms';
import { ApiService } from '../../services/api.service';
// import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatDialogRef } from '@angular/material/dialog';
import { formatDate } from '@angular/common';
import { Observable, map, startWith, tap } from 'rxjs';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { ActivatedRoute, Router } from '@angular/router';

export class deststore {
  constructor(public id: number, public name: string) { }
}
// export class store {
//   constructor(public id: number, public name: string) { }
// }
export class Employee {
  constructor(public id: number, public name: string, public code: string) { }
}
// export class FiscalYear {
//   constructor(public id: number, public FiscalYear: string) { }
// }

export class item {
  constructor(public id: number, public name: string) { }
}
export interface Source {
  name: string;
}
export class List {
  constructor(public id: number, public name: string) { }
}
export class costcenter {
  constructor(public id: number, public name: string) { }
}

@Component({
  selector: 'app-str-withdraw-details-dialog',
  templateUrl: './str-withdraw-details-dialog.component.html',
  styleUrls: ['./str-withdraw-details-dialog.component.css'],
})
export class StrWithdrawDetailsDialogComponent {
  groupDetailsForm!: FormGroup;
  getMasterRowEmployeeId: any
  groupMasterForm!: FormGroup;
  actionBtnMaster: string = 'Save';
  actionBtnDetails: string = 'Save';
  actionName: string = 'choose';
  getMasterRowId: any;
  getMasterRowStoreId: any;
  getMasterRowFiscalYearId: any;
  getMasterRowDate: any;
  MasterGroupInfoEntered = false;
  dataSource!: MatTableDataSource<any>;
  matchedIds: any;
  getDetailedRowData: any;
  sumOfTotals = 0;
  storeList: any;
  // itemsList: any;
  withDrawNoList: any;
  statesList: any;
  notesList: any;
  // fiscalYearsList: any;
  storeName: any;
  itemName: any;
  stateName: any;
  // notesName:any;
  withDrawNoName: any;
  // isReadOnly: any = false;
  isReadOnlyEmployee: any = false;
  userIdFromStorage: any;
  deleteConfirmBtn: any;
  dialogRefDelete: any;
  // employeeList: any;
  employeeName: any;
  costcenterName: any;
  // costcenterList: any;
  // deststoreList:any;
  desstoreName: any;
  autoNo: any;

  fiscalYearValue: any;
  deststoreValue: any;
  storeSelectedId: any;
  fiscalYearSelectedId: any;
  displayedColumns: string[] = [
    'itemName',
    'price',
    'qty',
    'total',
    'percentage',
    'action',
  ];

  // isReadOnlyEmployee: any = false;
  isReadOnlyPercentage: any = true;
  deststoresList: any;
  // deststoreCtrl: FormControl<any>;
  // filtereddeststore: Observable<deststore[]>;
  // selecteddeststore: deststore | undefined;
  // formcontrol = new FormControl('');

  employeesList: any;
  // employeeCtrl: FormControl<any>;
  // filteredEmployee: Observable<Employee[]>;
  // selectedEmployee: Employee | undefined;
  // formcontrol = new FormControl('');
  fullCodeValue: any;
  itemByFullCodeValue: any;

  fiscalYearsList: any;
  // fiscalYearCtrl: FormControl;
  // filteredFiscalYear: Observable<FiscalYear[]>;
  // selectedFiscalYear: FiscalYear | undefined;

  // storeCtrl: FormControl;
  // filteredstore: Observable<store[]>;
  // selectedstore: store | undefined;

  itemsList: item[] = [];
  itemCtrl: FormControl;
  filtereditem: Observable<item[]>;
  selecteditem: item | undefined;
  isEditDataReadOnly: boolean = true;

  isEdit: boolean = false;
  stateDefaultValue: any;

  defaultStoreSelectValue: any;
  defaultFiscalYearSelectValue: any;

  selectedList: List | undefined;
  getAddData: any;
  sourceSelected: any;

  userRoles: any;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  confirm: any;

  constructor(
    private formBuilder: FormBuilder,
    private api: ApiService,
    @Inject(MAT_DIALOG_DATA) public editData: any,
    @Inject(MAT_DIALOG_DATA) public editDataDetails: any,
    @Inject(LOCALE_ID) private locale: string,
    private http: HttpClient,
    private toastr: ToastrService,
    private dialog: MatDialog,
    private router: Router,
    private dialogRef: MatDialogRef<StrWithdrawDetailsDialogComponent>,
    private route: ActivatedRoute
  ) {
    this.stateDefaultValue = true;
    // this.costcenterCtrl = new FormControl();
    // this.filteredcostcenter = this.costcenterCtrl.valueChanges.pipe(
    //   startWith(''),
    //   map((value) => this._filtercostcenters(value))
    // );

    this.itemCtrl = new FormControl();
    this.filtereditem = this.itemCtrl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filteritems(value))
    );

    // this.listCtrl = new FormControl();
    // this.filteredList = this.listCtrl.valueChanges.pipe(
    //   startWith(''),
    //   map((value) => this._filterLists(value))
    // );
  }

  ngOnInit(): void {
    // this.getStores();
    this.getItems();
    // this.getFiscalYears();
    // this.getEmployees();
    // this.getCostCenters();
    this.getDestStores();
    // this.dialogRef.backdropClick().subscribe(() => { this.closeDialog; });

    // this.dialogRef.disableClose = true;
    // this.dialogRef.backdropClick().subscribe(async () => await this.safeClose());
    // this.createForm();

    let dateNow: Date = new Date();
    console.log('Date = ' + dateNow);
    // this.employeeName();
    // this.getStrWithdrawAutoNo();

    this.getMasterRowId = this.editData;


    this.groupDetailsForm = this.formBuilder.group({
      stR_WithdrawId: ['', Validators.required], //MasterId
      qty: ['1', Validators.required],
      percentage: ['100', Validators.required],
      price: ['', Validators.required],
      total: ['', Validators.required],
      transactionUserId: [1, Validators.required],
      destStoreUserId: [1, Validators.required],
      itemId: ['', Validators.required],
      state: [this.stateDefaultValue, Validators.required],
      fullCode: [''],
      // withDrawNoId: ['' ],

      itemName: [''],
      // avgPrice: [''],

      stateName: [''],

      // notesName: [''],
    });

    console.log("get params: ", this.route.snapshot.queryParamMap.get('date'));
    this.getMasterRowId = this.route.snapshot.queryParamMap.get('masterId');
    this.getMasterRowStoreId = this.route.snapshot.queryParamMap.get('store');
    this.getMasterRowFiscalYearId = this.route.snapshot.queryParamMap.get('fiscalYear');
    this.getMasterRowDate = formatDate(this.route.snapshot.queryParamMap.get('date')!, 'yyyy-MM-dd', this.locale);

    // this.getMasterRowDate = this.route.snapshot.queryParamMap.get('date');
    // this.getMasterRowEmployeeId = this.route.snapshot.queryParamMap.get('employeeId');
    console.log("get params after: ", "masterId: ", this.getMasterRowId, "storeId: ", this.getMasterRowStoreId, "fisclaYear: ", this.getMasterRowFiscalYearId, "date: ", this.getMasterRowDate, "employeeId: ", this.getMasterRowEmployeeId);

    if (this.editData) {
      console.log("edit Data: ", this.editData);

      this.groupDetailsForm.controls['fullCode'].setValue(this.editData.fullCode);
      this.groupDetailsForm.controls['itemId'].setValue(this.editData.itemId);
      this.groupDetailsForm.controls['percentage'].setValue(this.editData.percentage);
      this.groupDetailsForm.controls['price'].setValue(this.editData.price);
      this.groupDetailsForm.controls['qty'].setValue(this.editData.qty);
      this.groupDetailsForm.controls['stR_WithdrawId'].setValue(this.editData.stR_WithdrawId);
      this.groupDetailsForm.controls['state'].setValue(this.editData.state);
      this.groupDetailsForm.controls['total'].setValue(this.editData.total);
      this.groupDetailsForm.controls['transactionUserId'].setValue(localStorage.getItem('transactionUserId'));


      // if (this.groupDetailsForm.getRawValue().price == 0 || this.editData?.price == 0) {
      //   this.isReadOnly = false;
      //   console.log("change readOnly to enable here");
      // }
      // else {
      //   this.isReadOnly = true;
      //   console.log("change readOnly to disable here");
      // }

      console.log('state value changed: ', this.groupDetailsForm.getRawValue().state);
      if (this.groupDetailsForm.getRawValue().state == false) {
        this.isReadOnlyPercentage = false;
        this.groupDetailsForm.controls['state'].setValue(this.groupDetailsForm.getRawValue().state);
      } else {
        this.isReadOnlyPercentage = true;
        this.groupDetailsForm.controls['state'].setValue(this.groupDetailsForm.getRawValue().state);
        this.groupDetailsForm.controls['percentage'].setValue(100);
      }

      //   this.isEdit = true;
      //   this.groupMasterForm.controls['no'].setValue(this.editData.no);

      //   if (this.editData.employeeId == null) {
      //     this.actionName = 'sss';
      //     console.log('action btnnnnnnnnnnnnn', this.actionName);
      //     this.groupMasterForm.controls['source'].setValue('المخزن');
      //     this.groupMasterForm.controls['sourceInput'].setValue(
      //       this.groupMasterForm.getRawValue().desstoreName
      //     );

      //     // alert("deststore in edit:"+this.editData.deststoreId)
      //   } else {
      //     this.actionName = 'choose';
      //     this.groupMasterForm.controls['source'].setValue('الموظف');
      //     this.groupMasterForm.controls['sourceInput'].setValue(
      //       this.groupMasterForm.getRawValue().employeeName
      //     );
      //     console.log(
      //       'employee in edit:',
      //       this.groupMasterForm.getRawValue().employeeName
      //     );
      //     // alert("employee in edit:"+this.editData.employeeId)
      //   }

      //   console.log('master edit form: ', this.editData);
      //   // this.actionName= "ssss";
      //   this.actionBtnMaster = 'Update';

      //   console.log('employeeId in edittttt', this.editData.employeeId);

      //   this.employeeName = this.getemployeeByID(this.editData.employeeId);
      //   console.log('desstore id in edit data', this.editData.deststoreId);
      //   this.desstoreName = this.getDestStoreById(this.editData.deststoreId);

      //   console.log('employeename in edit', this.employeeName);

      //   this.groupMasterForm.controls['employeeName'].setValue(
      //     this.editData.employeeName
      //   );

      //   this.groupMasterForm.controls['desstoreName'].setValue(
      //     this.editData.desstoreName
      //   );
      //   this.groupMasterForm.controls['storeId'].setValue(this.editData.storeId);
      //   this.groupMasterForm.controls['storeName'].setValue(
      //     this.editData.storeName
      //   );

      //   // alert("facialId before: "+ this.editData.fiscalYearId)
      //   this.groupMasterForm.controls['fiscalYearId'].setValue(
      //     this.editData.fiscalYearId
      //   );

      //   this.groupMasterForm.controls['date'].setValue(this.editData.date);
      //   this.groupMasterForm.controls['transactionUserId'].setValue(
      //     this.editData.transactionUserId
      //   );
      //   // this.groupMasterForm.controls['destStoreUserId'].setValue(this.editData.destStoreUserId);
      //   // this.groupMasterForm.controls['destStoreUserName'].setValue(this.editData.destStoreUserName);

      //   this.groupMasterForm.addControl(
      //     'id',
      //     new FormControl('', Validators.required)
      //   );
      //   this.groupMasterForm.controls['id'].setValue(this.getMasterRowId.id);
      //   this.groupMasterForm.controls['employeeId'].setValue(
      //     this.editData.employeeId
      //   );

      //   // this.groupMasterForm.controls['itemId'].setValue(this.editData.itemId);

      //   this.groupMasterForm.controls['deststoreId'].setValue(
      //     this.editData.deststoreId
      //   );

      //   console.log('costcenter:', this.editData.costCenterId);

      //   this.groupMasterForm.controls['costCenterId'].setValue(
      //     this.editData.costCenterId
      //   );
      //   this.groupMasterForm.controls['costcenterName'].setValue(
      //     this.editData.costcenterName
      //   );
      //   this.isEditDataReadOnly = true;
      // }


      // this.getAllDetailsForms();

      // localStorage.setItem('transactionUserId', JSON.stringify("mehrail"));
      // this.userIdFromStorage = localStorage.getItem('transactionUserId');
      // console.log("userIdFromStorage in localStorage: ", this.userIdFromStorage)
      // console.log("userIdFromStorage after slice from string shape: ", this.userIdFromStorage?.slice(1, length - 1))
      // this.groupMasterForm.controls['transactionUserId'].setValue(this.userIdFromStorage?.slice(1, length - 1));
      // this.groupMasterForm.controls['transactionUserId'].setValue(this.editData.transactionUserId);
      // console.log("transactionuser",this.editData.transactionUserId)
    }
  }

  // displaydeststoreName(deststore: any): string {
  //   return deststore && deststore.name ? deststore.name : '';
  // }
  // deststoreSelected(event: MatAutocompleteSelectedEvent): void {
  //   const deststore = event.option.value as deststore;
  //   console.log("deststore selected: ", deststore);
  //   this.selecteddeststore = deststore;
  //   this.groupMasterForm.patchValue({ deststoreId: deststore.id });
  //   console.log("deststore in form: ", this.groupMasterForm.getRawValue().deststoreId);

  // }
  // private _filterdeststores(value: string): deststore[] {
  //   const filterValue = value;
  //   return this.deststoresList.filter(deststore =>
  //     deststore.name.toLowerCase().includes(filterValue)
  //   );
  // }
  // openAutodeststore() {
  //   this.deststoreCtrl.setValue(''); // Clear the input field value

  //   // Open the autocomplete dropdown by triggering the value change event
  //   this.deststoreCtrl.updateValueAndValidity();
  // }

  // private _filterFiscalYears(value: string): FiscalYear[] {
  //   const filterValue = value;
  //   return this.fiscalYearsList.filter(fiscalyearObj =>
  //     fiscalyearObj.FiscalYear.toLowerCase().includes(filterValue)
  //   );
  // }
  // displayFiscalYearName(vacation: any): string {
  //   return vacation && vacation.fiscalyear ? vacation.fiscalyear : '';
  // }
  // fiscalYearSelected(event: MatAutocompleteSelectedEvent): void {
  //   const fiscalyear = event.option.value as FiscalYear;
  //   console.log("vacation selected: ", fiscalyear);
  //   this.selectedFiscalYear = fiscalyear;
  //   this.groupMasterForm.patchValue({ fiscalYearId: fiscalyear.id });
  //   console.log("vacation in form: ", this.groupMasterForm.getRawValue().fiscalYearId);
  // }
  // openAutoFiscalYear() {
  //   this.fiscalYearCtrl.setValue(''); // Clear the input field value

  //   // Open the autocomplete dropdown by triggering the value change event
  //   this.fiscalYearCtrl.updateValueAndValidity();
  // }

  // displayEmployeeName(employee: any): string {
  //   return employee && employee.name ? employee.name : '';
  // }
  // employeeSelected(event: MatAutocompleteSelectedEvent): void {
  //   const employee = event.option.value as Employee;
  //   console.log("employee selected: ", employee);
  //   this.selectedEmployee = employee;
  //   this.groupMasterForm.patchValue({ employeeId: employee.id });
  //   console.log("employee in form: ", this.groupMasterForm.getRawValue().employeeId);
  //   this.set_store_Null(this.groupMasterForm.getRawValue().employeeId);
  // }
  // private _filterEmployees(value: string): Employee[] {
  //   const filterValue = value;
  //   return this.employeesList.filter(employee =>
  //     employee.name.toLowerCase().includes(filterValue) || employee.code.toLowerCase().includes(filterValue)
  //   );
  // }
  // openAutoEmployee() {
  //   this.employeeCtrl.setValue(''); // Clear the input field value

  //   // Open the autocomplete dropdown by triggering the value change event
  //   this.employeeCtrl.updateValueAndValidity();
  // }

  // displaycostcenterName(costcenter: any): string {
  //   return costcenter && costcenter.name ? costcenter.name : '';
  // }
  // costcenterSelected(event: MatAutocompleteSelectedEvent): void {
  //   const costcenter = event.option.value as costcenter;
  //   console.log('costcenter selected: ', costcenter);
  //   this.selectedcostcenter = costcenter;
  //   this.groupMasterForm.patchValue({ costCenterId: costcenter.id });
  //   console.log(
  //     'costcenter in form: ',
  //     this.groupMasterForm.getRawValue().costCenterId
  //   );
  //   // this.set_store_Null(this.groupMasterForm.getRawValue().costCenterId);
  // }
  // private _filtercostcenters(value: string): costcenter[] {
  //   const filterValue = value;
  //   return this.costcentersList.filter((costcenter) =>
  //     costcenter.name.toLowerCase().includes(filterValue)
  //   );
  // }
  // openAutocostcenter() {
  //   this.costcenterCtrl.setValue(''); // Clear the input field value

  //   // Open the autocomplete dropdown by triggering the value change event
  //   this.costcenterCtrl.updateValueAndValidity();
  // }

  // displaystoreName(store: any): string {
  //   return store && store.name ? store.name : '';
  // }
  // storeSelected(event: MatAutocompleteSelectedEvent): void {
  //   const store = event.option.value as store;
  //   console.log("store selected: ", store);
  //   this.selectedstore = store;
  //   this.groupMasterForm.patchValue({ storeId: store.id });
  //   console.log("store in form: ", this.groupMasterForm.getRawValue().storeId);
  // }
  // private _filterstores(value: string): store[] {
  //   const filterValue = value;
  //   return this.storesList.filter(store =>
  //     store.name.toLowerCase().includes(filterValue)
  //   );
  // }
  // openAutostore() {
  //   this.storeCtrl.setValue(''); // Clear the input field value

  //   // Open the autocomplete dropdown by triggering the value change event
  //   this.storeCtrl.updateValueAndValidity();
  // }

  displayitemName(item: any): string {
    return item && item.name ? item.name : '';
  }
  itemSelected(event: MatAutocompleteSelectedEvent): void {
    const item = event.option.value as item;
    console.log('item selected: ', item);
    this.selecteditem = item;
    this.groupDetailsForm.patchValue({ itemId: item.id });
    console.log('item in form: ', this.groupDetailsForm.getRawValue().itemId);
    this.itemOnChange(this.groupDetailsForm.getRawValue().itemId);

    this.getCodeByItem(this.groupDetailsForm.getRawValue().itemId);

    this.api.getAvgPrice(
      this.getMasterRowStoreId,
      this.getMasterRowFiscalYearId,
      formatDate(this.getMasterRowDate, 'yyyy-MM-dd', this.locale),
      this.groupDetailsForm.getRawValue().itemId
    )
      .subscribe({
        next: (res) => {
          // this.priceCalled = res;
          // this.groupDetailsForm.controls['avgPrice'].setValue(res);
          this.groupDetailsForm.controls['price'].setValue(res);
          // if (this.groupDetailsForm.getRawValue().price == 0 || this.editData?.price == 0) {
          //   this.isReadOnly = false;
          //   console.log("change readOnly to enable here");
          // }
          // else {
          //   this.isReadOnly = true;
          //   console.log("change readOnly to disable here");
          // }
          console.log("price avg called res: ", this.groupDetailsForm.getRawValue().price);
        },
        error: (err) => {
          // console.log("fetch fiscalYears data err: ", err);
          // alert("خطا اثناء جلب متوسط السعر !");
        }
      })

  }
  private _filteritems(value: string): item[] {
    const filterValue = value;
    return this.itemsList.filter((item) =>
      item.name.toLowerCase().includes(filterValue)
    );
  }

  openAutoitem() {
    this.itemCtrl.setValue(''); // Clear the input field value

    // Open the autocomplete dropdown by triggering the value change event
    this.itemCtrl.updateValueAndValidity();
  }

  // async nextToAddFormDetails() {
  //   this.groupMasterForm.removeControl('id');
  //   console.log(
  //     'in next to add storeId',
  //     this.groupMasterForm.getRawValue().storeId
  //   );
  //   this.storeName = await this.getStoreByID(
  //     this.groupMasterForm.getRawValue().storeId
  //   );

  //   // this.sellerName = await this.getsellerByID(this.groupMasterForm.getRawValue().sellerId );
  //   // this.desstoreName =

  //   // this.groupDetailsForm.patchValue({ deststoreName: store.name  });

  //   // console.log("deststoreId in add",this.groupMasterForm.getRawValue().deststoreId)

  //   // alert("cost center id"+this.groupMasterForm.getRawValue().costCenterId)
  //   this.costcenterName = await this.getcostcenterByID(
  //     this.groupMasterForm.getRawValue().costCenterId
  //   );

  //   this.groupMasterForm.controls['storeName'].setValue(this.storeName);
  //   console.log(
  //     'in next to add employee name:',
  //     this.groupMasterForm.getRawValue().employeeName
  //   );

  //   console.log(
  //     'emoloyeeIddddd',
  //     this.groupMasterForm.getRawValue().employeeId
  //   );
  //   this.groupMasterForm.controls['employeeId'].setValue(
  //     this.groupMasterForm.getRawValue().employeeId
  //   );

  //   this.groupMasterForm.controls['employeeName'].setValue(
  //     this.groupMasterForm.getRawValue().employeeName
  //   );
  //   this.groupMasterForm.controls['costcenterName'].setValue(
  //     this.costcenterName
  //   );
  //   console.log(
  //     'in next to add deststore name:',
  //     this.groupMasterForm.getRawValue().desstoreName
  //   );
  //   this.groupMasterForm.controls['desstoreName'].setValue(
  //     this.groupMasterForm.getRawValue().desstoreName
  //   );
  //   // alert("deststore id"+this.groupMasterForm.getRawValue().deststoreId)

  //   this.groupMasterForm.controls['deststoreId'].setValue(
  //     this.groupMasterForm.getRawValue().deststoreId
  //   );

  //   // this.groupMasterForm.controls['fiscalYearId'].setValue(1)
  //   // console.log("faciaaaaal year add: ", this.groupMasterForm.getRawValue().fiscalYearId)
  //   console.log('dataName: ', this.groupMasterForm.value);
  //   if (this.groupMasterForm.getRawValue().no) {
  //     console.log('no changed: ', this.groupMasterForm.getRawValue().no);
  //     this.groupMasterForm.controls['no'].setValue(this.autoNo);
  //   } else {
  //     this.groupMasterForm.controls['no'].setValue(this.autoNo);
  //     console.log(
  //       'no took auto number: ',
  //       this.groupMasterForm.getRawValue().no
  //     );
  //   }
  //   console.log('Master add form : ', this.groupMasterForm.value);

  //   if (this.groupMasterForm.getRawValue().storeId) {
  //     // this.groupMasterForm.removeControl('id');
  //     // alert("facialId in add: "+ this.editData.fiscalYearId)

  //     console.log('Master add form in : ', this.groupMasterForm.value);
  //     this.api.postStrWithdraw(this.groupMasterForm.value).subscribe({
  //       next: (res) => {
  //         console.log('res code: ', res.status);
  //         // console.log("ID header after post req: ", res);
  //         this.getMasterRowId = {
  //           id: res,
  //         };
  //         console.log('mastered res: ', this.getMasterRowId.id);
  //         this.MasterGroupInfoEntered = true;

  //         alert('تم الحفظ بنجاح');
  //         this.toastrSuccess();
  //         this.getAllDetailsForms();
  //         this.updateDetailsForm();
  //         // this.addDetailsInfo();
  //       },
  //       error: (err) => {
  //         console.log('header post err: ', err);
  //         alert('من فضلك اكمل البيانات');
  //       },
  //     });
  //   }
  //   // else {
  //   //   alert("تاكد من ادخال البيانات صحيحة")
  //   // }
  // }

  // set_Employee_Null(deststoreId: any) {
  //   // alert("deststoreId in null fun:"+ deststoreId)

  //   this.groupMasterForm.controls['employeeId'].setValue(null);
  //   this.isReadOnlyEmployee = true;
  //   // this.employeeCtrl = null;
  //   // this.deststoreValue=deststoreId;
  //   this.isReadOnlyEmployee = true;
  // }
  set_store_Null(employeeId: any) {
    // alert("employeeId in null fun:"+employeeId)

    this.groupMasterForm.controls['deststoreId'].setValue(null);
    // console.log("deststoreId in null fun:",this.dest)

    // this.groupMasterForm.controls['employeeId'].setValue('');
    this.isReadOnlyEmployee = true;
  }
  itemOnChange(itemEvent: any) {
    // this.isReadOnly = true;
    console.log("itemId: ", itemEvent)

    // if (this.groupDetailsForm.getRawValue().avgPrice == 0) {
    //   this.isReadOnly = false;
    //   console.log("change readOnly to enable");
    // }
    // else {
    //   this.isReadOnly = true;
    //   console.log("change readOnly to disable");
    // }

    // if (this.groupDetailsForm.getRawValue().price == 0 || this.editData?.price == 0) {
    //   this.isReadOnly = false;
    //   console.log("change readOnly to enable here");
    // }
    // else {
    //   this.isReadOnly = true;
    //   console.log("change readOnly to disable here");
    // }

    this.getAvgPrice(
      this.getMasterRowStoreId,
      this.getMasterRowFiscalYearId,
      formatDate(this.getMasterRowDate, 'yyyy-MM-dd', this.locale),
      itemEvent)

  }

  set_Percentage(state: any) {
    console.log('state value changed: ', state.value);
    if (state.value == false) {
      this.isReadOnlyPercentage = false;
      this.groupDetailsForm.controls['state'].setValue(state.value);
    } else {
      this.isReadOnlyPercentage = true;
      this.groupDetailsForm.controls['state'].setValue(state.value);
      this.groupDetailsForm.controls['percentage'].setValue(100);
    }
  }

  storeValueChanges(storeId: any) {
    console.log('store: ', storeId);
    this.storeSelectedId = storeId;
    this.groupMasterForm.controls['storeId'].setValue(this.storeSelectedId);
    this.isEdit = false;
    console.log('kkkkkkkkkkk:', this.isEdit);

    // this.getStrWithdrawAutoNo();
  }
  // async fiscalYearValueChanges(fiscalyaerId: any) {
  //   console.log('fiscalyaer: ', fiscalyaerId);
  //   this.fiscalYearSelectedId = await fiscalyaerId;
  //   this.groupMasterForm.controls['fiscalYearId'].setValue(
  //     this.fiscalYearSelectedId
  //   );
  //   this.isEdit = false;

  //   this.getStrWithdrawAutoNo();
  // }

  getAvgPrice(storeId: any, fiscalYear: any, date: any, itemId: any) {
    console.log("Avg get inputs: ", "storeId: ", this.getMasterRowStoreId,
      " fiscalYear: ", this.getMasterRowFiscalYearId,
      " date: ", formatDate(this.getMasterRowDate, 'yyyy-MM-dd', this.locale),
      " itemId: ", this.groupDetailsForm.getRawValue().itemId)

    this.api.getAvgPrice(storeId, fiscalYear, date, itemId)

      .subscribe({
        next: (res) => {
          // this.priceCalled = res;
          this.groupDetailsForm.controls['price'].setValue(res);
          console.log("price avg called res: ", this.groupDetailsForm.getRawValue().price);
        },
        error: (err) => {
          // console.log("fetch fiscalYears data err: ", err);
          // alert("خطا اثناء جلب متوسط السعر !");
        }
      })
  }

  closeDialog() {
    this.dialogRef.close();
  }

  // getStrWithdrawAutoNo() {
  //   console.log("storeId: ", this.storeSelectedId, " fiscalYearId: ", this.fiscalYearSelectedId)
  //   if (this.groupMasterForm) {
  //     if (this.editData && !this.fiscalYearSelectedId) {
  //       console.log("change storeId only in updateHeader");

  //       this.api.getStrWithdrawAutoNo(this.groupMasterForm.getRawValue().storeId, this.editData.fiscalYearId)
  //         .subscribe({
  //           next: (res) => {
  //             this.autoNo = res;
  //             console.log("autoNo: ", this.autoNo);
  //             return res;

  //           },
  //           error: (err) => {
  //             console.log("fetch autoNo err: ", err);
  //             // alert("خطا اثناء جلب العناصر !");
  //           }
  //         })
  //     }
  //     else if (this.editData && !this.storeSelectedId) {
  //       console.log("change fiscalYearId only in updateHeader");
  //       this.api.getStrWithdrawAutoNo(this.editData.storeId, this.groupMasterForm.getRawValue().fiscalYearId)
  //         .subscribe({
  //           next: (res) => {
  //             this.autoNo = res;
  //             console.log("autoNo: ", this.autoNo);
  //             return res;
  //           },
  //           error: (err) => {
  //             console.log("fetch autoNo err: ", err);
  //             // alert("خطا اثناء جلب العناصر !");
  //           }
  //         })
  //     }
  //     else {
  //       console.log("change both values in updateHeader",this.groupMasterForm.getRawValue().storeId,"fiscall", this.groupMasterForm.getRawValue().fiscalYearId);
  //       this.api.getStrWithdrawAutoNo(this.groupMasterForm.getRawValue().storeId, this.groupMasterForm.getRawValue().fiscalYearId)
  //         .subscribe({
  //           next: (res) => {
  //             this.autoNo = res;
  //             console.log("autoNo: ", this.autoNo);
  //             return res;
  //           },
  //           error: (err) => {
  //             console.log("fetch autoNo err: ", err);
  //             // alert("خطا اثناء جلب العناصر !");
  //           }
  //         })
  //     }

  //   }

  // }

  getAllDetailsForms() {
    // console.log("mastered row get all data: ", this.getMasterRowId)
    if (this.getMasterRowId) {
      this.api.getStrWithdrawDetails().subscribe(
        (res) => {
          console.log(
            'res to get all details form: ',
            res,
            'masterRowId: ',
            this.getMasterRowId.id
          );

          this.matchedIds = res.filter((a: any) => {
            // console.log("matchedIds: ", a.stR_WithdrawId == this.getMasterRowId.id, "res: ", this.matchedIds)
            return a.stR_WithdrawId == this.getMasterRowId.id;
          });

          if (this.matchedIds) {
            this.dataSource = new MatTableDataSource(this.matchedIds);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;

            this.sumOfTotals = 0;
            for (let i = 0; i < this.matchedIds.length; i++) {
              this.sumOfTotals =
                this.sumOfTotals + parseFloat(this.matchedIds[i].total);
              this.groupMasterForm.controls['total'].setValue(this.sumOfTotals);
              this.updateBothForms();
            }
          }
        },
        (err) => {
          // alert('حدث خطا ما !!');
        }
      );
    }
  }

  closeDetailsDialog() {
    this.dialogRef.close('save');
  }

  async addDetailsInfo() {
    // console.log("check id for insert: ", this.getDetailedRowData, "edit data form: ", this.editData, "main id: ", this.getMasterRowId.id);
    console.log('masterrow', this.getMasterRowId);
    if (!this.editData) {
      if (this.getMasterRowId) {
        // console.log("form  headerId: ", this.getMasterRowId.id)

        if (this.groupDetailsForm.getRawValue().itemId) {
          this.itemName = await this.getItemByID(
            this.groupDetailsForm.getRawValue().itemId
          );
          this.groupDetailsForm.controls['itemName'].setValue(this.itemName);
          this.groupDetailsForm.controls['transactionUserId'].setValue(1);
          // alert("itemId")
        }

        this.groupDetailsForm.controls['stR_WithdrawId'].setValue(
          parseInt(this.getMasterRowId)
        );
        // alert()
        this.groupDetailsForm.controls['total'].setValue(
          parseFloat(this.groupDetailsForm.getRawValue().price) *
          parseFloat(this.groupDetailsForm.getRawValue().qty)
        );

        this.groupDetailsForm.removeControl('id')

        console.log("form details after item: ", this.groupDetailsForm.value)

        if (this.groupDetailsForm.valid) {
          console.log(
            'form details after item: ',
            this.groupDetailsForm.value
          );

          this.api
            .postStrWithdrawDetails(this.groupDetailsForm.value)
            .subscribe({
              next: (res) => {
                this.toastrSuccess();
                this.groupDetailsForm.reset();
                this.updateDetailsForm();
                this.getAllDetailsForms();
                this.itemCtrl.setValue('');
                this.itemByFullCodeValue = '';
                this.fullCodeValue = '';
                // alert('تمت إضافة المجموعة بنجاح');
                this.dialogRef.close('save');

                // this.getAllMasterForms();
                // this.dialogRef.close('save');
                // this.dialogRef.close();
                // this.getAllMasterForms();
              },
              error: (err) => {
                // alert("حدث خطأ أثناء إضافة مجموعة")
                console.log("post err: ", err)

              },
            });
        }
        //  else {
        //   this.updateBothForms();
        // }
      }
    } else {
      this.updateDetailsForm();
    }
  }

  async updateDetailsForm() {
    console.log(
      'store id in update:',
      this.getMasterRowStoreId
    );
    // this.storeName = await this.getStoreByID(
    //   this.groupMasterForm.getRawValue().storeId
    // );
    // alert("update Store name: " + this.storeName)
    // this.groupMasterForm.controls['storeName'].setValue(this.storeName);
    // this.groupMasterForm.controls['storeId'].setValue(
    //   this.groupMasterForm.getRawValue().storeId
    // );
    // this.groupMasterForm.controls['fiscalYearId'].setValue(
    //   this.groupMasterForm.getRawValue().fiscalYearId
    // );

    // this.employeeName = await this.getemployeeByID(this.editData.employeeId);
    // alert("update costcentr id: " + this.groupMasterForm.getRawValue().costcenterId)
    // this.costcenterName = await this.getcostcenterByID(
    //   this.groupMasterForm.getRawValue().costCenterId
    // );

    // this.desstoreName = await this.getDestStoreById(this.editData.deststoreId);

    // console.log("data storeName in edit: ", this.groupMasterForm.value)

    // this.groupDetailsForm.controls['itemName'].setValue(this.itemName);
    // this.groupMasterForm.controls['employeeName'].setValue(
    //   this.groupMasterForm.getRawValue().employeeName
    // );

    // this.groupMasterForm.controls['costcenterName'].setValue(
    //   this.costcenterName
    // );
    // this.groupMasterForm.controls['desstoreName'].setValue(
    //   this.groupMasterForm.getRawValue().desstoreName
    // );

    // this.groupMasterForm.controls['deststoreId'].setValue(
    //   this.groupMasterForm.getRawValue().deststoreId
    // );
    // alert("deststoreId::::::::"+this.groupMasterForm.getRawValue().deststoreId)
    // console.log("values master form: ", this.groupMasterForm.value)
    console.log("values getMasterRowId: ", this.getMasterRowId)
    // console.log("values details form: ", this.groupDetailsForm.value)

    // if (this.editData) {
    this.groupDetailsForm.addControl(
      'id',
      new FormControl('', Validators.required)
    );
    this.groupDetailsForm.controls['id'].setValue(this.editData.id);
    console.log('data item Name in edit: ', this.groupDetailsForm.value);
    // }
    this.groupDetailsForm.controls['price'].setValue(this.editData.price);

    // if (this.getDetailedRowData) {
    console.log('details foorm: ', this.groupDetailsForm.value);
    // this.groupDetailsForm.addControl(
    //   'id',
    //   new FormControl('', Validators.required)
    // );
    // this.groupDetailsForm.controls['id'].setValue(this.editData.id);
    // this.groupDetailsForm.controls['state'].setValue(this.editData.id);
    // this.groupDetailsForm.controls['avgPrice'].setValue(this.editData.avgPrice);
    // }

    // this.groupMasterForm.addControl(
    //   'id',
    //   new FormControl('', Validators.required)
    // );
    // this.groupMasterForm.controls['id'].setValue(this.getMasterRowId.id);

    // console.log('put before', this.groupMasterForm.value);
    this.isEdit = false;

    // this.api.putStrWithdraw(this.groupMasterForm.value).subscribe({
    //   next: (res) => {
    if (this.groupDetailsForm.valid) {
      this.api
        .putStrWithdrawDetails(this.groupDetailsForm.value)
        .subscribe({
          next: (res) => {
            // alert("put")
            // this.toastrSuccess();
            // console.log("update res: ", res);
            this.groupDetailsForm.reset();
            this.getAllDetailsForms();
            this.itemCtrl.setValue('');
            this.itemByFullCodeValue = '';
            this.fullCodeValue = '';
            this.getDetailedRowData = '';
            // alert('تم التعديل بنجاح');
            this.toastrEditSuccess();

            this.dialogRef.close('save');
          },
          error: (err) => {
            console.log("update err: ", err)
            // alert("خطأ أثناء تحديث سجل المجموعة !!")
          },
        });
    }

    // this.dialogRef.close('update');
    // },
    // error: () => {
    //   alert("خطأ أثناء تحديث سجل الصنف !!")
    // }
    // });
  }

  updateBothForms() {
    if (this.isEdit == false) {
      this.groupMasterForm.controls['no'].setValue(this.autoNo);
    }
    console.log("pass id: ", this.getMasterRowId.id, "pass No: ", this.groupMasterForm.getRawValue().no, "pass StoreId: ", this.groupMasterForm.getRawValue().storeId, "pass Date: ", this.groupMasterForm.getRawValue().date)
    if (
      this.groupMasterForm.getRawValue().no != '' &&
      this.groupMasterForm.getRawValue().employeeId != '' &&
      this.groupMasterForm.getRawValue().deststoreId != '' &&
      this.groupMasterForm.getRawValue().costCenterId != '' &&
      this.groupMasterForm.getRawValue().storeId != '' &&
      this.groupMasterForm.getRawValue().fiscalYearId != '' &&
      this.groupMasterForm.getRawValue().date != ''
    ) {
      this.groupDetailsForm.controls['stR_WithdrawId'].setValue(
        this.getMasterRowId.id
      );
      this.groupDetailsForm.controls['total'].setValue(
        parseFloat(this.groupDetailsForm.getRawValue().price) *
        parseFloat(this.groupDetailsForm.getRawValue().qty)
      );

      this.updateDetailsForm();
    }
    // else {
    //   alert("تاكد من ادخال البيانات صحيحة")
    // }
  }

  editDetailsForm(row: any) {
    this.goToPart();
    if (this.editDataDetails || row) {
      this.getDetailedRowData = row;
      console.log('dETAILS ROW: ', this.getDetailedRowData);

      this.actionBtnDetails = 'Update';
      this.groupDetailsForm.controls['stR_WithdrawId'].setValue(
        this.getDetailedRowData.stR_WithdrawId
      );

      this.groupDetailsForm.controls['qty'].setValue(
        this.getDetailedRowData.qty
      );
      this.groupDetailsForm.controls['price'].setValue(
        this.getDetailedRowData.price
      );
      this.groupDetailsForm.controls['percentage'].setValue(
        this.getDetailedRowData.percentage
      );

      // this.groupDetailsForm.controls['avgPrice'].setValue(this.getDetailedRowData.avgPrice);

      this.groupDetailsForm.controls['total'].setValue(
        parseFloat(this.groupDetailsForm.getRawValue().price) *
        parseFloat(this.groupDetailsForm.getRawValue().qty)
      );

      // console.log("itemid focus: ", this.matchedIds);

      this.groupDetailsForm.controls['itemId'].setValue(
        this.getDetailedRowData.itemId
      );
      this.groupDetailsForm.controls['itemName'].setValue(
        this.getDetailedRowData.itemName
      );

      this.groupDetailsForm.controls['stateName'].setValue(
        this.getDetailedRowData.stateName
      );
      // this.groupDetailsForm.controls['notesName'].setValue(this.getDetailedRowData.notes);
      // this.groupDetailsForm.controls['withDrawNoName'].setValue(this.getDetailedRowData.withDrawNoName);
    }
  }

  deleteFormDetails(id: number) {
    var result = confirm('هل ترغب بتاكيد الحذف ؟');
    if (result) {
      this.api.deleteStrWithdrawDetails(id).subscribe({
        next: (res) => {
          // alert('تم الحذف بنجاح');
          this.toastrDeleteSuccess();
          this.getAllDetailsForms();
          // this.getAllMasterForms();
        },
        error: () => {
          // alert("خطأ أثناء حذف التفاصيل !!");
        },
      });
    }
  }

  getAllMasterForms() {
    let result = window.confirm('هل تريد اغلاق الطلب');
    if (result) {
      //   if(this.actionBtnMaster=='save'){
      //     this.dialogRef.close('save');
      // }
      // else{
      //   this.dialogRef.close('update');

      // }
      // this.closeDialog();
      this.dialogRef.close('Save');
      this.api.getStrWithdraw().subscribe({
        next: (res) => {
          // this.groupDetailsForm.controls['itemName'].setValue(this.itemName);
          this.dataSource = new MatTableDataSource(res);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        },
        error: () => {
          // alert("خطأ أثناء جلب سجلات المجموعة !!");
        },
      });
    }
  }

  async getStores() {
    this.userRoles = localStorage.getItem('userRoles');
    console.log('userRoles: ', this.userRoles.includes('15'));

    if (this.userRoles.includes('15')) {
      // console.log('user is manager -all stores available- , role: ', userRoles);

      this.api.getStore().subscribe({
        next: async (res) => {
          this.storeList = res;
          this.defaultStoreSelectValue = await res[Object.keys(res)[0]];
          console.log(
            'selected storebbbbbbbbbbbbbbbbbbbbbbbb: ',
            this.defaultStoreSelectValue
          );
          if (this.editData) {
            this.groupMasterForm.controls['storeId'].setValue(
              this.editData.storeId
            );
          } else {
            this.groupMasterForm.controls['storeId'].setValue(
              this.defaultStoreSelectValue.id
            );
            console.log(
              'selected storebb form: ',
              this.groupMasterForm.getRawValue().storeId
            );
            this.storeValueChanges(this.groupMasterForm.getRawValue().storeId);
          }
        },
        error: (err) => {
          // console.log("fetch store data err: ", err);
          // alert("خطا اثناء جلب المخازن !");
        },
      });
    } else {
      this.api
        .getUserStores(localStorage.getItem('transactionUserId'))
        .subscribe({
          next: async (res) => {
            this.storeList = res;
            this.defaultStoreSelectValue = await res[Object.keys(res)[0]];
            console.log(
              'selected storebbbbbbbbbbbbbbb user: ',
              this.defaultStoreSelectValue
            );
            if (this.editData) {
              console.log('selected edit data : ', this.editData);
              this.groupMasterForm.controls['storeId'].setValue(
                this.editData.storeId
              );
            } else {
              console.log(
                'selected new data : ',
                this.defaultStoreSelectValue.storeId
              );
              this.groupMasterForm.controls['storeId'].setValue(
                this.defaultStoreSelectValue.storeId
              );
            }
          },
          error: (err) => {
            // console.log("fetch store data err: ", err);
            // alert("خطا اثناء جلب المخازن !");
          },
        });
    }
  }
  // getEmployees() {
  //   this.api.getEmployee().subscribe({
  //     next: (res) => {
  //       this.employeesList = res;
  //       console.log('employee list: ', this.employeesList);
  //       // this.employeeName =  this.getemployeeByID(this.groupMasterForm.getRawValue().employeeId);
  //       // console.log("employeeId",this.groupMasterForm.getRawValue().employeeId)
  //       // console.log('employeeName',this.employeeName.value)
  //       // this.employeeName=this.editData(this.employeesList)
  //     },
  //     error: (err) => {
  //       // console.log("fetch store data err: ", err);
  //       // alert("خطا اثناء جلب المخازن !");
  //     },
  //   });
  // }

  // getCostCenters() {
  //   this.api.getCostCenter().subscribe({
  //     next: (res) => {
  //       this.costcentersList = res;
  //       console.log('costcenterrr res: ', this.costcentersList);
  //     },
  //     error: (err) => {
  //       // console.log("fetch store data err: ", err);
  //       // alert("خطا اثناء جلب المخازن !");
  //     },
  //   });
  // }
  resetControls() {
    this.groupDetailsForm.reset();
    this.fullCodeValue = '';
    this.itemByFullCodeValue = '';
    this.itemCtrl.setValue('');
    this.groupDetailsForm.controls['qty'].setValue(1);
    this.groupDetailsForm.controls['percentage'].setValue(100);
  }
  getDestStores() {
    this.api.getStore().subscribe({
      next: (res) => {
        this.deststoresList = res;
        console.log(
          'deststore list in get deststorelist: ',
          this.deststoresList
        );
      },
      error: (err) => {
        // console.log("fetch store data err: ", err);
        // alert("خطا اثناء جلب المخازن !");
      },
    });
  }

  getDestStoreById(id: any) {
    console.log('row deststore id: ', id);
    return fetch(`http://ims.aswan.gov.eg/api/STRStore/get/${id}`)
      .then((response) => response.json())
      .then((json) => {
        console.log('fetch deststore by id res: ', json.name);
        return json.name;
      })
      .catch((err) => {
        // console.log("error in fetch name by id: ", err);
        // alert("خطا اثناء جلب رقم المخزن !");
      });
  }
  // getemployeeByID(id: any) {
  //   console.log('row employee id in getemployeebyid: ', id);
  //   return fetch(`http://ims.aswan.gov.eg/api/HREmployee/get/${id}`)
  //     .then((response) => response.json())
  //     .then((json) => {
  //       console.log('fetch employee by id res: ', json.name);

  //       return json.name;
  //       // console.log("json",json.name)
  //     })
  //     .catch((err) => {
  //       // console.log("error in fetch name by id: ", err);
  //       // alert("خطا اثناء جلب رقم المخزن !");
  //     });
  // }

  // getcostcenterByID(id: any) {
  //   console.log('costcenter idddd: ', id);
  //   return fetch(`http://ims.aswan.gov.eg/api/FICostCenter/get/${id}`)
  //     .then((response) => response.json())
  //     .then((json) => {
  //       console.log('fetch name by id res: ', json.name);
  //       return json.name;
  //     })
  //     .catch((err) => {
  //       // console.log("error in fetch name by id: ", err);
  //       // alert("خطا اثناء جلب رقم المخزن !");
  //     });
  // }

  // getStoreByID(id: any) {
  //   console.log(' store: ', id);
  //   return fetch(`http://ims.aswan.gov.eg/api/STRStore/get/${id}`)
  //     .then((response) => response.json())
  //     .then((json) => {
  //       // console.log("fetch name by id res: ", json.name);
  //       return json.name;
  //     })
  //     .catch((err) => {
  //       // console.log("error in fetch name by id: ", err);
  //       // alert("خطا اثناء جلب رقم المخزن !");
  //     });
  // }
  goToPart(): void {
    this.router.navigate(['/formedit']);
  }

  getItems() {
    this.api.getItems().subscribe({
      next: (res) => {
        this.itemsList = res;
        // console.log("items res: ", this.itemsList);
      },
      error: (err) => {
        // console.log("fetch items data err: ", err);
        // alert("خطا اثناء جلب العناصر !");
      },
    });
  }
  getItemByID(id: any) {
    // console.log("row item id: ", id);
    return fetch(`http://ims.aswan.gov.eg/api/STRItem/get/${id}`)
      .then((response) => response.json())
      .then((json) => {
        console.log('fetch item name by id res: ', json.name);
        return json.name;
      })
      .catch((err) => {
        // console.log("error in fetch item name by id: ", err);
        // alert("خطا اثناء جلب رقم العنصر !");
      });
  }

  // getItemByCode(code: any) {
  //   if (code.keyCode == 13) {
  //     // console.log("code: ", code.target.value);

  //     this.itemsList.filter((a: any) => {
  //       if (a.fullCode === code.target.value) {
  //         this.groupDetailsForm.controls['itemId'].setValue(a.id);
  //       }
  //     });
  //   }
  // }

  getItemByCode(code: any) {
    if (code.keyCode == 13) {
      this.itemsList.filter((a: any) => {
        if (a.fullCode === code.target.value) {
          this.groupDetailsForm.controls['itemId'].setValue(a.id);
          console.log("item by code: ", a.name);
          this.itemCtrl.setValue(a.name);
          if (a.name) {
            this.itemByFullCodeValue = a.name;

            this.api.getAvgPrice(
              this.getMasterRowStoreId,
              this.getMasterRowFiscalYearId,
              formatDate(this.getMasterRowDate, 'yyyy-MM-dd', this.locale),
              this.groupDetailsForm.getRawValue().itemId
            )
              .subscribe({
                next: (res) => {
                  // this.priceCalled = res;
                  // this.groupDetailsForm.controls['avgPrice'].setValue(res);
                  this.groupDetailsForm.controls['price'].setValue(res)
                  console.log("price avg called res: ", this.groupDetailsForm.getRawValue().price);
                },
                error: (err) => {
                  // console.log("fetch fiscalYears data err: ", err);
                  // alert("خطا اثناء جلب متوسط السعر !");
                }
              })


            // this.api.getSumQuantity(
            //   this.getMasterRowStoreId,
            //   this.groupDetailsForm.getRawValue().itemId,
            // )
            //   .subscribe({
            //     next: (res) => {
            //       // this.priceCalled = res;
            //       this.groupDetailsForm.controls['balanceQty'].setValue(res);
            //       console.log("balanceQty called res: ", this.groupDetailsForm.getRawValue().balanceQty);
            //     },
            //     error: (err) => {
            //       // console.log("fetch fiscalYears data err: ", err);
            //       alert("خطا اثناء جلب الرصيد الحالى  !");
            //     }
            //   })
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

  // async getFiscalYears() {
  //   this.api.getFiscalYears().subscribe({
  //     next: async (res) => {
  //       this.fiscalYearsList = res;

  //       this.api.getLastFiscalYear().subscribe({
  //         next: async (res) => {
  //           // this.defaultFiscalYearSelectValue = await this.fiscalYearsList.find((yearList: { fiscalyear: number; }) => yearList.fiscalyear == new Date().getFullYear());
  //           this.defaultFiscalYearSelectValue = await res;
  //           console.log(
  //             'selectedYearggggggggggggggggggg: ',
  //             this.defaultFiscalYearSelectValue
  //           );
  //           if (this.editData) {
  //             console.log(
  //               'selectedYear id in get: ',
  //               this.editData.fiscalYearId
  //             );

  //             this.groupMasterForm.controls['fiscalYearId'].setValue(
  //               this.editData.fiscalYearId
  //             );
  //           } else {
  //             this.groupMasterForm.controls['fiscalYearId'].setValue(
  //               this.defaultFiscalYearSelectValue.id
  //             );
  //             this.getStrWithdrawAutoNo();
  //           }
  //         },
  //         error: (err) => {
  //           // console.log("fetch store data err: ", err);
  //           // alert("خطا اثناء جلب المخازن !");
  //         },
  //       });

  //       // this.defaultFiscalYearSelectValue = await this.fiscalYearsList.find((yearList: { fiscalyear: number; }) => yearList.fiscalyear == new Date().getFullYear());
  //       // console.log("selectedYearggggggggggggggggggg: ", this.defaultFiscalYearSelectValue);
  //       // if (this.editData) {
  //       //   this.groupMasterForm.controls['fiscalYearId'].setValue(this.editData.fiscalYearId);
  //       // }
  //       // else {
  //       //   this.groupMasterForm.controls['fiscalYearId'].setValue(this.defaultFiscalYearSelectValue.id);
  //       //   this.getStrOpenAutoNo();
  //       // }
  //       // this.fiscalYearValueChanges(this.groupMasterForm.getRawValue().fiscalYearId);
  //     },
  //     error: (err) => {
  //       // console.log("fetch fiscalYears data err: ", err);
  //       // alert("خطا اثناء جلب العناصر !");
  //     },
  //   });
  // }

  // getFiscalYearsByID(id: any) {
  //   console.log('row fiscalYear id: ', id);
  //   return fetch(`https://ims.aswan.gov.eg/api/STRFiscalYear/get/${id}`)
  //     .then((response) => response.json())
  //     .then((json) => {
  //       console.log('fetch fiscalYears name by id res: ', json.fiscalyear);
  //       return json.fiscalyear;
  //     })
  //     .catch((err) => {
  //       console.log('error in fetch fiscalYears name by id: ', err);
  //       // alert("خطا اثناء جلب رقم العنصر !");
  //     });
  // }

  toastrSuccess(): void {
    this.toastr.success('تم الحفظ بنجاح');
  }
  toastrDeleteSuccess(): void {
    this.toastr.success('تم الحذف بنجاح');
  }
  toastrEditSuccess(): void {
    this.toastr.success('تم التعديل بنجاح');
  }


  // displayListName(list: any): string {
  //   return list && list.name ? list.name : '';
  // }

  // listSelected(event: MatAutocompleteSelectedEvent): void {
  //   const list = event.option.value as List;
  //   this.selectedList = list;
  //   // if(this.sourceSelected === "المورد"){
  //   //   this.groupMasterForm.patchValue({ sellerId: list.id });
  //   // this.groupMasterForm.patchValue({ sellerName: list.name });
  //   // }
  //   if (this.sourceSelected === 'الموظف') {
  //     this.groupMasterForm.patchValue({ employeeId: list.id });
  //     this.groupMasterForm.patchValue({ employeeName: list.name });
  //     this.set_store_Null(this.groupMasterForm.getRawValue().emolyeeId);
  //   } else {
  //     this.groupMasterForm.patchValue({ deststoreId: list.id });
  //     this.groupMasterForm.patchValue({ desstoreName: list.name });
  //     // alert("deststoreId::::"+ this.groupMasterForm.getRawValue().desstoreName)
  //     this.set_Employee_Null(this.groupMasterForm.getRawValue().deststoreId);
  //   }
  // }

  // getStrWithdrawAutoNo() {
  //   console.log(
  //     'storeId: ',
  //     this.storeSelectedId,
  //     ' fiscalYearId: ',
  //     this.fiscalYearSelectedId
  //   );
  //   console.log(
  //     'get default selected storeId & fisclYearId: ',
  //     this.defaultStoreSelectValue,
  //     ' , ',
  //     this.defaultFiscalYearSelectValue
  //   );

  //   if (this.groupMasterForm) {
  //     if (this.editData && !this.fiscalYearSelectedId) {
  //       console.log('change storeId only in updateHeader');
  //       this.api
  //         .getStrWithdrawAutoNo(
  //           this.groupMasterForm.getRawValue().storeId,
  //           this.editData.fiscalYearId
  //         )
  //         .subscribe({
  //           next: (res) => {
  //             this.autoNo = res;
  //             console.log('autoNo: ', this.autoNo);
  //             return res;
  //           },
  //           error: (err) => {
  //             console.log('fetch autoNo err1: ', err);
  //             // alert("خطا اثناء جلب العناصر !");
  //           },
  //         });
  //     } else if (this.editData && !this.storeSelectedId) {
  //       console.log('change fiscalYearId only in updateHeader');
  //       this.api
  //         .getStrWithdrawAutoNo(
  //           this.editData.storeId,
  //           this.groupMasterForm.getRawValue().fiscalYearId
  //         )
  //         .subscribe({
  //           next: (res) => {
  //             this.autoNo = res;
  //             console.log('autoNo: ', this.autoNo);
  //             return res;
  //           },
  //           error: (err) => {
  //             console.log('fetch autoNo err2: ', err);
  //             // alert("خطا اثناء جلب العناصر !");
  //           },
  //         });
  //     } else if (this.editData) {
  //       console.log('change both in edit data: ', this.isEdit);

  //       this.api
  //         .getStrWithdrawAutoNo(
  //           this.groupMasterForm.getRawValue().storeId,
  //           this.groupMasterForm.getRawValue().fiscalYearId
  //         )
  //         .subscribe({
  //           next: (res) => {
  //             this.autoNo = res;
  //             // this.editData = null;
  //             console.log('isEdit : ', this.isEdit);
  //             // this.groupMasterForm.controls['no'].setValue(666);
  //             console.log('autoNo: ', this.autoNo);
  //             return res;
  //           },
  //           error: (err) => {
  //             console.log('fetch autoNo err3: ', err);
  //             // alert("خطا اثناء جلب العناصر !");
  //           },
  //         });
  //     } else {
  //       console.log(
  //         'change both values in updateHeader, ',
  //         this.groupMasterForm.getRawValue().storeId
  //       );
  //       this.api
  //         .getStrWithdrawAutoNo(
  //           this.groupMasterForm.getRawValue().storeId,
  //           this.groupMasterForm.getRawValue().fiscalYearId
  //         )
  //         .subscribe({
  //           next: (res) => {
  //             this.autoNo = res;
  //             // this.editData.no = res
  //             console.log('isEdit : ', this.isEdit);

  //             console.log('autoNo: ', this.autoNo);
  //             return res;
  //           },
  //           error: (err) => {
  //             console.log('fetch autoNo err4: ', err);
  //             // alert("خطا اثناء جلب العناصر !");
  //           },
  //         });
  //     }
  //   }
  // }
}
