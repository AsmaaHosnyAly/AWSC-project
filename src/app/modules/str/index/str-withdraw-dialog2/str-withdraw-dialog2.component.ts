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
import { Router } from '@angular/router';
import { StrWithdrawDetailsDialogComponent } from '../str-withdraw-details-dialog/str-withdraw-details-dialog.component';
import { HotkeysService } from 'angular2-hotkeys';
import { Hotkey } from 'angular2-hotkeys';
import { PagesEnums } from 'src/app/core/enums/pages.enum';
import jwt_decode from 'jwt-decode';

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
  selector: 'app-withdraw-dialog2',
  templateUrl: './str-withdraw-dialog2.component.html',
  styleUrls: ['./str-withdraw-dialog2.component.css'],
})
export class StrWithdrawDialogComponent implements OnInit {
  loading :boolean =false;
  groupDetailsForm!: FormGroup;
  groupMasterForm!: FormGroup;
  actionBtnMaster: string = 'Save';
  actionBtnDetails: string = 'Save';
  actionName: string = 'choose';

  MasterGroupInfoEntered = false;
  dataSource!: MatTableDataSource<any>;
  matchedIds: any;
  btnDisabled: boolean = false;

  getDetailedRowData: any;
  sumOfTotals = 0;
  getMasterRowId: any;
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
  isReadOnly: any = false;
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
  decodedToken: any;
  decodedToken2: any;
  fiscalYearValue: any;
  deststoreValue: any;
  storeSelectedId: any;
  fiscalYearSelectedId: any;
  displayedColumns: string[] = [
    'itemName',
    'price',
    'qty',
    'total',
    // 'percentage',
    'action',
  ];

  // isReadOnlyEmployee: any = false;
  isReadOnlyPercentage: any = false;
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

  defaultStoreSelectValue: any;
  defaultFiscalYearSelectValue: any;

  costcentersList: costcenter[] = [];
  costcenterCtrl: FormControl<any>;
  filteredcostcenter: Observable<costcenter[]>;
  selectedcostcenter: costcenter | undefined;

  listCtrl: FormControl;
  filteredList: Observable<List[]>;
  lists: List[] = [];
  selectedList: List | undefined;
  getAddData: any;
  sourceSelected: any;

  userRoles: any;
  selectedTitle: any;
  titleList: any;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  confirm: any;

  userRoleStoresAcc = PagesEnums.STORES_ACCOUNTS;

  constructor(
    private formBuilder: FormBuilder,
    private api: ApiService,
    private hotkeysService: HotkeysService,
    @Inject(MAT_DIALOG_DATA) public editData: any,
    @Inject(MAT_DIALOG_DATA) public editDataDetails: any,
    @Inject(LOCALE_ID) private locale: string,
    private http: HttpClient,
    private toastr: ToastrService,
    private dialog: MatDialog,
    private router: Router,
    private dialogRef: MatDialogRef<StrWithdrawDialogComponent>,
  ) {

    this.titleList = [{
      'titleval': 'كشف العجز',
      'titleval1': 'سند خصم الاصناف فتقدة او تالفة',
      'titleval2': 'محضر بيع',
      'titleval3': 'طلب تشغيل',
      'titleval4': 'اهداءات ليست النشاط الرئيسي للجهة',
    }];

    this.costcenterCtrl = new FormControl();
    this.filteredcostcenter = this.costcenterCtrl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filtercostcenters(value))
    );

    this.itemCtrl = new FormControl();
    this.filtereditem = this.itemCtrl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filteritems(value))
    );

    this.listCtrl = new FormControl();
    this.filteredList = this.listCtrl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filterLists(value))
    );
  }

  ngOnInit(): void {
    this.selectedTitle = this.titleList[0].titleval;
    const accessToken: any = localStorage.getItem('accessToken');
    // console.log('accessToken', accessToken);
    // Decode the access token
    this.decodedToken = jwt_decode(accessToken);
    this.decodedToken2 = this.decodedToken.roles;
    console.log('accessToken2', this.decodedToken2);
    this.getStores();
    this.getItems();
    this.getFiscalYears();
    this.getEmployees();
    this.getCostCenters();
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

    this.groupMasterForm = this.formBuilder.group({
      total: ['0', Validators.required],
      no: ['', Validators.required],
      // itemName:['',Validators.required],
      storeId: [''],
      storeName: ['', Validators.required],
      transactionUserId: [1, Validators.required],
      destStoreUserId: [1, Validators.required],
      type: ['', Validators.required],
      sourceInput: ['', Validators.required],

      date: [dateNow, Validators.required],
      fiscalYearId: ['', Validators.required],
      employeeId: [''],
      employeeName: [''],
      costCenterId: [''],
      costcenterName: [''],
      deststoreId: [''],
      desstoreName: [''],
      ListId: ['', Validators.required],
      productionDate: ['', Validators.required],
      expireDate: ['', Validators.required],
    });

    this.groupDetailsForm = this.formBuilder.group({
      stR_WithdrawId: ['', Validators.required], //MasterId
      employeeId: ['', Validators.required],
      qty: ['', Validators.required],
      percentage: [''],
      price: ['', Validators.required],
      total: ['', Validators.required],
      transactionUserId: [1, Validators.required],
      destStoreUserId: [1, Validators.required],
      itemId: [''],
      stateId: [''],
      // sourceInputId:[''],
      // withDrawNoId: ['' ],

      itemName: [''],
      // avgPrice: [''],

      stateName: [''],

      // notesName: [''],
    });
    this.hotkeysService.add(new Hotkey('ctrl+s', (event: KeyboardEvent): boolean => {
      // Call the deleteGrade() function in the current component
      this.nextToAddFormDetails();
      return false; // Prevent the default browser behavior
    }));




    if (this.editData) {
      // console.log("")
      this.isEdit = true;
      this.groupMasterForm.controls['no'].setValue(this.editData.no);

      if (this.editData.employeeId == null) {
        this.actionName = 'sss';
        console.log('action btnnnnnnnnnnnnn', this.actionName);
        let type = 'المخزن';
        this.getListCtrl(type);
        this.getDestStores();
        this.groupMasterForm.controls['type'].setValue('المخزن');
        this.groupMasterForm.controls['sourceInput'].setValue(
        this.groupMasterForm.getRawValue().desstoreName
        );
        // this.groupMasterForm.controls['sourceInputId'].setValue(
        //   this.groupMasterForm.getRawValue().desstorId
        // );

        // alert("deststore in edit:"+this.editData.deststoreId)
      } else {
        this.actionName = 'choose';
        let type = 'الموظف';
        this.getListCtrl(type);
        this.getEmployees();

        this.groupMasterForm.controls['type'].setValue('الموظف');
        this.groupMasterForm.controls['sourceInput'].setValue(
          this.groupMasterForm.getRawValue().employeeName
        );
        console.log(
          'employee in edit:',
          this.groupMasterForm.getRawValue().employeeName
        );
        // alert("employee in edit:"+this.editData.employeeId)
      }

      console.log('master edit form: ', this.editData);
      // this.actionName= "ssss";
      this.actionBtnMaster = 'Update';
      console.log('employeeId in edittttt', this.editData.employeeId);
      this.groupMasterForm.controls['productionDate'].setValue(this.editData.productionDate)
      this.groupMasterForm.controls['expireDate'].setValue(this.editData.expireDate)
      this.employeeName = this.getemployeeByID(this.editData.employeeId);
      console.log('desstore id in edit data', this.editData.destStoreId);
      this.desstoreName = this.getDestStoreById(this.editData.destStoreId);

      console.log('employeename in edit', this.employeeName);

      this.groupMasterForm.controls['employeeName'].setValue(
        this.editData.employeeName
      );

      this.groupMasterForm.controls['desstoreName'].setValue(
        this.editData.desstoreName
      );
      this.groupMasterForm.controls['storeId'].setValue(this.editData.storeId);
      this.groupMasterForm.controls['storeName'].setValue(
        this.editData.storeName
      );

      // alert("facialId before: "+ this.editData.fiscalYearId)
      this.groupMasterForm.controls['fiscalYearId'].setValue(
        this.editData.fiscalYearId
      );

      this.groupMasterForm.controls['date'].setValue(this.editData.date);
      this.groupMasterForm.controls['transactionUserId'].setValue(
        this.editData.transactionUserId
      );
      // this.groupMasterForm.controls['destStoreUserId'].setValue(this.editData.destStoreUserId);
      // this.groupMasterForm.controls['destStoreUserName'].setValue(this.editData.destStoreUserName);

      this.groupMasterForm.addControl(
        'id',
        new FormControl('', Validators.required)
      );
      this.groupMasterForm.controls['id'].setValue(this.getMasterRowId.id);
      this.groupMasterForm.controls['employeeId'].setValue(
        this.editData.employeeId
      );

      // this.groupMasterForm.controls['itemId'].setValue(this.editData.itemId);

      this.groupMasterForm.controls['deststoreId'].setValue(
        this.editData.destStoreId
      );

      console.log('costcenter:', this.editData.costCenterId);

      this.groupMasterForm.controls['costCenterId'].setValue(
        this.editData.costCenterId
      );
      this.groupMasterForm.controls['costcenterName'].setValue(
        this.editData.costcenterName
      );
      this.isEditDataReadOnly = true;
    }
    //
    // this.listSelected();

    this.getAllDetailsForms();

    // localStorage.setItem('transactionUserId', JSON.stringify("mehrail"));
    // this.userIdFromStorage = localStorage.getItem('transactionUserId');
    // console.log("userIdFromStorage in localStorage: ", this.userIdFromStorage)
    // console.log("userIdFromStorage after slice from string shape: ", this.userIdFromStorage?.slice(1, length - 1))
    // this.groupMasterForm.controls['transactionUserId'].setValue(this.userIdFromStorage?.slice(1, length - 1));
    // this.groupMasterForm.controls['transactionUserId'].setValue(this.editData.transactionUserId);
    // console.log("transactionuser",this.editData.transactionUserId)
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
    // this.set_store_Null(this.groupMasterForm.getRawValue().costCenterId);
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

    this.api.getAvgPrice(
      this.groupMasterForm.getRawValue().storeId,
      this.groupMasterForm.getRawValue().fiscalYearId,
      formatDate(this.groupMasterForm.getRawValue().date, 'yyyy-MM-dd', this.locale),
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
          alert("خطا اثناء جلب متوسط السعر !");
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

  async nextToAddFormDetails() {
    this.groupMasterForm.removeControl('id');
    console.log(
      'in next to add storeId',
      this.groupMasterForm.getRawValue().storeId
    );
    this.storeName = await this.getStoreByID(
      this.groupMasterForm.getRawValue().storeId
    );
    this.getAllDetailsForms();


    // this.sellerName = await this.getsellerByID(this.groupMasterForm.getRawValue().sellerId );
    // this.desstoreName =

    // this.groupDetailsForm.patchValue({ deststoreName: store.name  });

    // console.log("deststoreId in add",this.groupMasterForm.getRawValue().deststoreId)

    // alert("cost center id"+this.groupMasterForm.getRawValue().costCenterId)
    // this.costcenterName = await this.getcostcenterByID(
    //   this.groupMasterForm.getRawValue().costCenterId
    // );

    this.groupMasterForm.controls['storeName'].setValue(this.storeName);
    console.log(
      'in next to add employee name:',
      this.groupMasterForm.getRawValue().employeeName
    );

    console.log(
      'emoloyeeIddddd',
      this.groupMasterForm.getRawValue().employeeId
    );
    this.groupMasterForm.controls['employeeId'].setValue(
      this.groupMasterForm.getRawValue().employeeId
    );

    this.costcenterName = await this.getemployeeByID(
      this.groupMasterForm.getRawValue().employeeId
    );
    this.groupMasterForm.controls['employeeName'].setValue(
      this.groupMasterForm.getRawValue().employeeName
    );

    this.costcenterName = await this.getcostcenterByID(
      this.groupMasterForm.getRawValue().costCenterId
    );
    this.groupMasterForm.controls['costcenterName'].setValue(
      this.costcenterName
    );

    // alert("deststore id"+this.groupMasterForm.getRawValue().deststoreId)

    this.groupMasterForm.controls['deststoreId'].setValue(
      this.groupMasterForm.getRawValue().deststoreId
    );
    this.costcenterName = await this.getDestStoreById(
      this.groupMasterForm.getRawValue().deststoreId
    );
    console.log(
      'in next to add deststore name:',
      this.groupMasterForm.getRawValue().desstoreName
    );
    this.groupMasterForm.controls['desstoreName'].setValue(
      this.groupMasterForm.getRawValue().desstoreName
    );

    // this.groupMasterForm.controls['fiscalYearId'].setValue(1)
    // console.log("faciaaaaal year add: ", this.groupMasterForm.getRawValue().fiscalYearId)
    console.log('dataName: ', this.groupMasterForm.value);
    if (this.groupMasterForm.getRawValue().no) {
      console.log('no changed: ', this.groupMasterForm.getRawValue().no);
      this.groupMasterForm.controls['no'].setValue(this.autoNo);
    } else {
      this.groupMasterForm.controls['no'].setValue(this.autoNo);
      console.log(
        'no took auto number: ',
        this.groupMasterForm.getRawValue().no
      );
    }
    console.log('Master add form : ', this.groupMasterForm.value);

    if (this.groupMasterForm.getRawValue().storeId) {
      // this.groupMasterForm.removeControl('id');
      // alert("facialId in add: "+ this.editData.fiscalYearId)

      console.log('Master add form in : ', this.groupMasterForm.value);
      this.api.postStrWithdraw(this.groupMasterForm.value).subscribe({
        next: (res) => {
          console.log('res code: ', res.status);
          // console.log("ID header after post req: ", res);
          this.getMasterRowId = {
            id: res,
          };
          console.log('mastered res: ', this.getMasterRowId.id);
          this.MasterGroupInfoEntered = true;

          // alert('تم الحفظ بنجاح');
          this.toastrSuccess();
          this.getAllDetailsForms();
          this.updateDetailsForm();
          // this.addDetailsInfo();
        },
        error: (err) => {
          console.log('header post err: ', err);
          alert('من فضلك اكمل البيانات');
        },
      });
    }
    // else {
    //   alert("تاكد من ادخال البيانات صحيحة")
    // }
  }

  set_Employee_Null(deststoreId: any) {
    // alert("deststoreId in null fun:" + deststoreId)

    this.groupMasterForm.controls['employeeId'].setValue(null);
    this.isReadOnlyEmployee = true;
    // this.employeeCtrl = null;
    // this.deststoreValue=deststoreId;
    this.isReadOnlyEmployee = true;
  }
  set_store_Null(employeeId: any) {
    // alert("employeeId in null fun:"+employeeId)

    this.groupMasterForm.controls['deststoreId'].setValue(null);
    // console.log("deststoreId in null fun:",this.dest)

    // this.groupMasterForm.controls['employeeId'].setValue('');
    this.isReadOnlyEmployee = true;
  }
  // itemOnChange(itemEvent: any) {
  //   // this.isReadOnly = true;
  //   console.log("itemId: ", itemEvent)

  //   if (this.groupDetailsForm.getRawValue().avgPrice == 0) {
  //     this.isReadOnly = false;
  //     console.log("change readOnly to enable");
  //   }
  //   else {
  //     this.isReadOnly = true;
  //     console.log("change readOnly to disable");
  //   }

  //   this.getAvgPrice(
  //     this.groupMasterForm.getRawValue().storeId,
  //     this.groupMasterForm.getRawValue().fiscalYearId,
  //     formatDate(this.groupMasterForm.getRawValue().date, 'yyyy-MM-dd', this.locale),
  //     itemEvent)

  // }

  set_Percentage(state: any) {
    console.log('state value changed: ', state.value);
    if (state.value == false) {
      this.isReadOnlyPercentage = false;
    } else {
      this.isReadOnlyPercentage = true;
      this.groupDetailsForm.controls['percentage'].setValue(100);
    }
  }

  storeValueChanges(storeId: any) {
    console.log('store: ', storeId);
    this.storeSelectedId = storeId;
    this.groupMasterForm.controls['storeId'].setValue(this.storeSelectedId);
    this.isEdit = false;
    console.log('kkkkkkkkkkk:', this.isEdit);

    this.getStrWithdrawAutoNo();
  }
  async fiscalYearValueChanges(fiscalyaerId: any) {
    console.log('fiscalyaer: ', fiscalyaerId);
    this.fiscalYearSelectedId = await fiscalyaerId;
    this.groupMasterForm.controls['fiscalYearId'].setValue(
      this.fiscalYearSelectedId
    );
    this.isEdit = false;

    this.getStrWithdrawAutoNo();
  }

  // getAvgPrice(storeId: any, fiscalYear: any, date: any, itemId: any) {
  //   console.log("Avg get inputs: ", "storeId: ", this.groupMasterForm.getRawValue().storeId,
  //     " fiscalYear: ", this.groupMasterForm.getRawValue().fiscalYearId,
  //     " date: ", formatDate(this.groupMasterForm.getRawValue().date, 'yyyy-MM-dd', this.locale),
  //     " itemId: ", this.groupDetailsForm.getRawValue().itemId)

  //   this.api.getAvgPrice(storeId, fiscalYear, date, itemId)

  //     .subscribe({
  //       next: (res) => {
  //         // this.priceCalled = res;
  //         this.groupDetailsForm.controls['avgPrice'].setValue(res);
  //         console.log("price avg called res: ", this.groupDetailsForm.getRawValue().avgPrice);
  //       },
  //       error: (err) => {
  //         // console.log("fetch fiscalYears data err: ", err);
  //         alert("خطا اثناء جلب متوسط السعر !");
  //       }
  //     })
  // }

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

  // getAllDetailsForms() {



  //   if (this.getMasterRowId) {
  //     if (this.editData) {
  //       // console.log("check if details belongs to strAdd or strWithdraw: ", this.editData.hasOwnProperty('strWithDrawDetailsGetVM'));

  //       if (this.editData.hasOwnProperty('strWithDrawDetailsGetVM')) {
  //         this.btnDisabled = true;
  //     console.log("masterRowId: ", this.getMasterRowId.id);
  //     this.api.getStrWithdrawDetailsByMasterId(this.getMasterRowId.id)
  //       .subscribe({
  //         next: (res) => {
  //           // this.itemsList = res;
  //           this.matchedIds = res[0].strWithDrawDetailsGetVM;

  //           if (this.matchedIds) {
  //             console.log("eeeeeeeeeeeeeeeeeeeeeeeeeeee: ", res[0].strWithDrawDetailsGetVM);
  //             this.dataSource = new MatTableDataSource(this.matchedIds);
  //             this.dataSource.paginator = this.paginator;
  //             this.dataSource.sort = this.sort;

  //             this.sumOfTotals = 0;
  //             for (let i = 0; i < this.matchedIds.length; i++) {
  //               this.sumOfTotals = this.sumOfTotals + parseFloat(this.matchedIds[i].total);
  //               this.groupMasterForm.controls['total'].setValue(this.sumOfTotals);
  //               // alert('totalll: '+ this.sumOfTotals)
  //               // this.updateBothForms();
  //               this.updateMaster();
  //             }
  //           }
  //         },
  //         error: (err) => {
  //           // console.log("fetch items data err: ", err);
  //           // alert("خطا اثناء جلب العناصر !");
  //         }
  //       })
  //   }
  // }
  getAllDetailsForms() {
    console.log("mastered row get all data: ", this.getMasterRowId)
    if (this.getMasterRowId) {

      this.loading=true;

      this.api.getStrWithdrawDetailsByMasterId(this.getMasterRowId.id)
        .subscribe({
          next: (res) => {
            this.loading =false;
            // this.itemsList = res;
            this.matchedIds = res;

            if (this.matchedIds) {
              console.log("eeeeeeeeeeeeeeeeeeeeeeeeeeee: ", res);
              this.dataSource = new MatTableDataSource(this.matchedIds);
              this.dataSource.paginator = this.paginator;
              this.dataSource.sort = this.sort;

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

    }
  }

  async addDetailsInfo() {
    // console.log("check id for insert: ", this.getDetailedRowData, "edit data form: ", this.editData, "main id: ", this.getMasterRowId.id);
    console.log('masterrow', this.getMasterRowId.id);
    if (this.getMasterRowId.id) {
      if (this.getMasterRowId.id) {
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
          this.getMasterRowId.id
        );
        this.groupDetailsForm.controls['total'].setValue(
          parseFloat(this.groupDetailsForm.getRawValue().price) *
          parseFloat(this.groupDetailsForm.getRawValue().qty)
        );

        // console.log("form details after item: ", this.groupDetailsForm.value, "DetailedRowData: ", !this.getDetailedRowData)

        if (this.groupDetailsForm.valid && !this.getDetailedRowData) {
          console.log(
            'form details after item: ',
            this.groupDetailsForm.value,
            'DetailedRowData: ',
            !this.getDetailedRowData
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
                this.toastrSuccess();

                // this.getAllMasterForms();
                // this.dialogRef.close('save');
                // this.dialogRef.close();
                // this.getAllMasterForms();
              },
              error: () => {
                // alert("حدث خطأ أثناء إضافة مجموعة")
              },
            });
        } else {
          this.updateBothForms();
        }
      }
    } else {
      this.updateDetailsForm();
    }
  }

  async updateDetailsForm() {


    this.desstoreName = await this.getDestStoreById(
      this.groupMasterForm.getRawValue().deststoreId
    );

    this.itemName = await this.getItemByID(
      this.groupMasterForm.getRawValue().itemId
    );


    // this.storeName = await this.getStoreByID(
    //   this.groupMasterForm.getRawValue().storeId
    // );

    // this.storeName = await this.getStoreByID(
    //   this.groupMasterForm.getRawValue().storeId
    // );

    // this.storeName = await this.getStoreByID(
    //   this.groupMasterForm.getRawValue().storeId
    // );
    // alert("update Store name: " + this.storeName)
    this.groupMasterForm.controls['itemName'].setValue(this.storeName);
    this.groupMasterForm.controls['itemId'].setValue(
      this.groupMasterForm.getRawValue().storeId
    );
    this.groupMasterForm.controls['fullCode'].setValue(
      this.groupMasterForm.getRawValue().fullCode
    );
    this.groupMasterForm.controls['percentage'].setValue(
      this.groupMasterForm.getRawValue().percentage
    );
    this.groupMasterForm.controls['price'].setValue(
      this.groupMasterForm.getRawValue().price

    ); this.groupMasterForm.controls['qty'].setValue(
      this.groupMasterForm.getRawValue().qty
    );
    this.groupDetailsForm.controls['stR_WithdrawId'].setValue(
      this.getMasterRowId.id
    );

    this.groupMasterForm.controls['stateName'].setValue(
      this.groupMasterForm.getRawValue().stateName
    );

    this.groupMasterForm.controls['state'].setValue(
      this.groupMasterForm.getRawValue().state
    );
    this.groupMasterForm.controls['total'].setValue(
      this.groupMasterForm.getRawValue().total
    ); this.groupMasterForm.controls['transactionUserId'].setValue(
      this.groupMasterForm.getRawValue().transactionUserId
    );

    if (this.editData) {
      this.groupMasterForm.addControl('id', new FormControl('', Validators.required));
      this.groupMasterForm.controls['id'].setValue(this.editData.id);
      // console.log("data item Name in edit: ", this.groupMasterForm.value)
    }

    this.groupMasterForm.addControl('id', new FormControl('', Validators.required));
    this.groupMasterForm.controls['id'].setValue(this.getMasterRowId.id);
    // this.groupMasterForm.controls['employee_ExchangeId'].setValue(this.getMasterRowId.id);
    // console.log("data item Name in edit without id: ", this.groupMasterForm.value)

    this.api.putStrWithdraw(this.groupMasterForm.value)
      .subscribe({
        next: (res) => {
          // alert("تم التعديل بنجاح");
          console.log("update res: ", res, "details form values: ", this.groupDetailsForm.value, "details id: ", this.getDetailedRowData);
          // console.log("update res: ", res, "details form values: ", this.groupDetailsForm.value, "details id: ", this.getDetailedRowData);
          if (this.groupDetailsForm.value && this.getDetailedRowData) {

            this.groupDetailsForm.addControl('id', new FormControl('', Validators.required));
            this.groupDetailsForm.controls['id'].setValue(this.getDetailedRowData.id);

            this.api.putStrWithdrawDetails(this.groupDetailsForm.value)
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
                }
              })
            this.groupDetailsForm.removeControl('id')

          }

          // this.dialogRef.close('update');
        },
        error: () => {
          // alert("خطأ أثناء تحديث سجل الصنف !!")
        }
      })
  }

  updateBothForms() {
    if (this.isEdit == false) {
      this.groupMasterForm.controls['no'].setValue(this.autoNo);
    }
    // console.log("pass id: ", this.getMasterRowId.id, "pass No: ", this.groupMasterForm.getRawValue().no, "pass StoreId: ", this.groupMasterForm.getRawValue().storeId, "pass Date: ", this.groupMasterForm.getRawValue().date)
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
      this.groupDetailsForm.controls['stR_WithdrawId'].setValue(
        this.getMasterRowId.id
      );
      this.groupDetailsForm.controls['total'].setValue(
        parseFloat(this.groupDetailsForm.getRawValue().price) *
        parseFloat(this.groupDetailsForm.getRawValue().qty)
      );
      // this.api.putStrAdd(this.groupMasterForm.value)
      // .subscribe({
      //   next: (res) => {
      //     // alert("تم الحفظ بنجاح");
      //     console.log("update res: ", res, "details form values: ", this.groupDetailsForm.value, "details id: ", this.getDetailedRowData);
      //     if (this.groupDetailsForm.value && this.getDetailedRowData) {
      //       this.api.putStrWithdrawDetails(this.groupDetailsForm.value)
      //         .subscribe({
      //           next: (res) => {
      //             this.groupDetailsForm.reset();
      //             this.getAllDetailsForms();
      //             this.getDetailedRowData = '';
      //             // this.dialogRef.close('update');
      //           },
      //           error: (err) => {
      //             // console.log("update err: ", err)
      //             // alert("خطأ أثناء تحديث سجل المجموعة !!")
      //           }
      //         })
      //     }

      //     // this.dialogRef.close('update');
      //   },

      // })

      this.updateDetailsForm();
    }
    // else {
    //   alert("تاكد من ادخال البيانات صحيحة")
    // }
  }

  editDetailsForm(row: any) {


    this.router.navigate(['/withdraw'], { queryParams: { masterId: this.getMasterRowId.id, fiscalYear: this.groupMasterForm.getRawValue().fiscalYearId, store: this.groupMasterForm.getRawValue().storeId, date: this.groupMasterForm.getRawValue().date } })
    this.dialog.open(StrWithdrawDetailsDialogComponent, {
      width: '95%',
      height: '85%',
      data: row
    }).afterClosed().subscribe(val => {
      if (val === 'Save' || val === 'Update') {
        this.getAllDetailsForms();
      }
    })
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
    // let result = window.confirm('هل تريد اغلاق الطلب');
    // if (result) {
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
    // }
  }

  async getStores() {
    console.log("dynamic userRole pageEnum: ", this.userRoleStoresAcc);

    this.userRoles = this.decodedToken2;
    console.log('userRoles: ', this.userRoles.includes(this.userRoleStoresAcc));

    if (this.userRoles.includes(this.userRoleStoresAcc)) {
      // console.log('user is manager -all stores available- , role: ', userRoles);

      this.api.getStore().subscribe({
        next: async (res) => {
          this.storeList = res;
          console.log("store res: ", this.storeList);
          this.defaultStoreSelectValue = await res[Object.keys(res)[0]];
          console.log(
            'selected storebbbbbbbbbbbbbbbbbbbbbbbb: ',
            this.defaultStoreSelectValue
          );
          console.log(
            'result ',
            res)

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
          console.log("fetch store data err: ", err);
          alert("خطا اثناء جلب المخازن !");
        },
      });
    } else {
      this.api
        .getUserStores(localStorage.getItem('transactionUserId'))
        .subscribe({
          next: async (res) => {
            this.storeList = res;
            console.log(" user store res: ", this.storeList);

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
  getEmployees() {
    console.log("hey from employeeeeee")
    this.api.getEmployee().subscribe({
      next: (res) => {
        this.employeesList = res;
        console.log('employee list: ', this.employeesList);
        // this.employeeName =  this.getemployeeByID(this.groupMasterForm.getRawValue().employeeId);
        // console.log("employeeId",this.groupMasterForm.getRawValue().employeeId)
        // console.log('employeeName',this.employeeName.value)
        // this.employeeName=this.editData(this.employeesList)
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
        console.log('costcenterrr res: ', this.costcentersList);
      },
      error: (err) => {
        // console.log("fetch store data err: ", err);
        // alert("خطا اثناء جلب المخازن !");
      },
    });
  }
  resetControls() {
    this.groupDetailsForm.reset();
    this.fullCodeValue = '';
    this.itemByFullCodeValue = '';
    this.itemCtrl.setValue('');
    this.groupDetailsForm.controls['qty'].setValue(1);
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
    return fetch(this.api.getStoreById(id))
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
  getemployeeByID(id: any) {
    console.log('row employee id in getemployeebyid: ', id);
    return fetch(this.api.getHrEmployeeById(id))
      .then((response) => response.json())
      .then((json) => {
        console.log('fetch employee by id res: ', json.name);

        return json.name;
        // console.log("json",json.name)
      })
      .catch((err) => {
        // console.log("error in fetch name by id: ", err);
        // alert("خطا اثناء جلب رقم المخزن !");
      });
  }

  getcostcenterByID(id: any) {
    console.log('costcenter idddd: ', id);
    return fetch(this.api.getCostCenterById(id))
      .then((response) => response.json())
      .then((json) => {
        console.log('fetch name by id res: ', json.name);
        return json.name;
      })
      .catch((err) => {
        // console.log("error in fetch name by id: ", err);
        // alert("خطا اثناء جلب رقم المخزن !");
      });
  }

  getStoreByID(id: any) {
    console.log(' store: ', id);
    return fetch(this.api.getStoreById(id))
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
    return fetch(this.api.getItemById(id))
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

  getItemByCode(code: any) {
    if (code.keyCode == 13) {
      // console.log("code: ", code.target.value);

      this.itemsList.filter((a: any) => {
        if (a.fullCode === code.target.value) {
          this.groupDetailsForm.controls['itemId'].setValue(a.id);
        }
      });
    }
  }



  async getFiscalYears() {
    this.api.getFiscalYears().subscribe({
      next: async (res) => {
        this.fiscalYearsList = res;

        this.api.getLastFiscalYear().subscribe({
          next: async (res) => {
            // this.defaultFiscalYearSelectValue = await this.fiscalYearsList.find((yearList: { fiscalyear: number; }) => yearList.fiscalyear == new Date().getFullYear());
            this.defaultFiscalYearSelectValue = await res;
            console.log(
              'selectedYearggggggggggggggggggg: ',
              this.defaultFiscalYearSelectValue
            );
            if (this.editData) {
              console.log(
                'selectedYear id in get: ',
                this.editData.fiscalYearId
              );

              this.groupMasterForm.controls['fiscalYearId'].setValue(
                this.editData.fiscalYearId
              );
            } else {
              this.groupMasterForm.controls['fiscalYearId'].setValue(
                this.defaultFiscalYearSelectValue.id
              );
              this.getStrWithdrawAutoNo();
            }
          },
          error: (err) => {
            // console.log("fetch store data err: ", err);
            // alert("خطا اثناء جلب المخازن !");
          },
        });

        // this.defaultFiscalYearSelectValue = await this.fiscalYearsList.find((yearList: { fiscalyear: number; }) => yearList.fiscalyear == new Date().getFullYear());
        // console.log("selectedYearggggggggggggggggggg: ", this.defaultFiscalYearSelectValue);
        // if (this.editData) {
        //   this.groupMasterForm.controls['fiscalYearId'].setValue(this.editData.fiscalYearId);
        // }
        // else {
        //   this.groupMasterForm.controls['fiscalYearId'].setValue(this.defaultFiscalYearSelectValue.id);
        //   this.getStrOpenAutoNo();
        // }
        // this.fiscalYearValueChanges(this.groupMasterForm.getRawValue().fiscalYearId);
      },
      error: (err) => {
        // console.log("fetch fiscalYears data err: ", err);
        // alert("خطا اثناء جلب العناصر !");
      },
    });
  }

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

  displayListName(list: any): string {
    return list && list.name ? list.name : '';
  }

  listSelected(event: MatAutocompleteSelectedEvent): void {
    const list = event.option.value as List;
    this.selectedList = list;

    if (this.sourceSelected === 'الموظف') {
      this.groupMasterForm.patchValue({ employeeId: list.id });
      this.groupMasterForm.patchValue({ employeeName: list.name });
      this.set_store_Null(this.groupMasterForm.getRawValue().emolyeeId);
    } else {
      this.groupMasterForm.patchValue({ deststoreId: list.id });
      this.groupMasterForm.patchValue({ desstoreName: list.name });
      // alert("deststoreId::::" + this.groupMasterForm.getRawValue().deststoreId)
      this.set_Employee_Null(this.groupMasterForm.getRawValue().deststoreId);
    }
  }

  private _filterLists(value: string): List[] {
    const filterValue = value.toLowerCase();
    return this.lists.filter((list) =>
      list.name.toLowerCase().includes(filterValue)
    );
  }

  openAutoList() {
    this.listCtrl.setValue(''); // Clear the input field value

    // Open the autocomplete dropdown by triggering the value change event
    this.listCtrl.updateValueAndValidity();
  }

  getListCtrl(type: any) {
    this.sourceSelected = type;

    if (type === 'الموظف') {
      this.api.getEmployee().subscribe((lists) => {
        this.lists = lists;
        this.groupMasterForm.controls['deststoreId'].setValue(null);
        this.groupMasterForm.controls['type'].setValue('الموظف');
        this.actionName = 'choose';
      });
    } else {
      this.api.getAllstores().subscribe((lists) => {
        this.lists = lists;
        this.groupMasterForm.controls['employeeId'].setValue(null);
        this.groupMasterForm.controls['type'].setValue('المخزن');
        this.actionName = 'store';
      });
    }
  }

  getStrWithdrawAutoNo() {
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
          .getStrWithdrawAutoNo(
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
              console.log('fetch autoNo err1: ', err);
              // alert("خطا اثناء جلب العناصر !");
            },
          });
      } else if (this.editData && !this.storeSelectedId) {
        console.log('change fiscalYearId only in updateHeader');
        this.api
          .getStrWithdrawAutoNo(
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
              console.log('fetch autoNo err2: ', err);
              // alert("خطا اثناء جلب العناصر !");
            },
          });
      } else if (this.editData) {
        console.log('change both in edit data: ', this.isEdit);

        this.api
          .getStrWithdrawAutoNo(
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
              console.log('fetch autoNo err3: ', err);
              // alert("خطا اثناء جلب العناصر !");
            },
          });
      } else {
        console.log(
          'change both values in updateHeader, ',
          this.groupMasterForm.getRawValue().storeId
        );
        this.api
          .getStrWithdrawAutoNo(
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
              console.log('fetch autoNo err4: ', err);
              // alert("خطا اثناء جلب العناصر !");
            },
          });
      }
    }
  }

  addNewDetails() {
    this.router.navigate(['/withdraw'], {
      queryParams: { masterId: this.getMasterRowId.id, fiscalYear: this.groupMasterForm.getRawValue().fiscalYearId, store: this.groupMasterForm.getRawValue().storeId, date: this.groupMasterForm.getRawValue().date },

    });
    this.dialog
      .open(StrWithdrawDetailsDialogComponent, {
        width: '95%',
        height: '85%',
      })
      .afterClosed()
      .subscribe((val) => {
        if (val === 'Save' || val === 'Update') {
          this.getAllDetailsForms();
        }
      });
  }

  async updateMaster() {
    console.log('nnnvvvvvvvvvv: ', this.groupMasterForm.value);


    this.groupMasterForm.controls['desstoreName'].setValue(
      this.groupMasterForm.getRawValue().desstoreName
    );

    this.groupMasterForm.controls['deststoreId'].setValue(
      this.groupMasterForm.getRawValue().deststoreId
    );
    // alert("deststoreId in updateeee: "+ this.groupMasterForm.getRawValue().deststoreId);

    this.groupDetailsForm.controls['transactionUserId'].setValue(this.userIdFromStorage);

    console.log("update both: ", this.groupDetailsForm.valid, "ooo:", !this.getDetailedRowData);
    console.log("edit : ", this.groupDetailsForm.value)
    this.api.putStrWithdraw(this.groupMasterForm.value)
      .subscribe({
        next: (res) => {
          this.groupDetailsForm.reset();
          // this.itemCtrl.setValue('');

          // this.getAllDetailsForms();
          this.getDetailedRowData = '';
          this.groupDetailsForm.controls['qty'].setValue(1);
          // this.toastrEditSuccess();
          //   },
          //   error: (err) => {
          //     console.log("update err: ", err)
          //     // alert("خطأ أثناء تحديث سجل المجموعة !!")
          //   }
          // })
          // }

        },

      })
  }
}
