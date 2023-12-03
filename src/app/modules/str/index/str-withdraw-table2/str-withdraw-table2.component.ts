import { Component, Inject, LOCALE_ID, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from '../../services/api.service';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { StrWithdrawDialogComponent } from '../str-withdraw-dialog2/str-withdraw-dialog2.component';
import { ToastrService } from 'ngx-toastr';
import { Observable, map, startWith, tap, debounceTime } from 'rxjs';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { PrintDialogComponent } from '../print-dialog/print-dialog.component';
import { HotkeysService } from 'angular2-hotkeys';
import { Hotkey } from 'angular2-hotkeys';
import jwt_decode from 'jwt-decode';

import {
  FormControl,
  FormControlName,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { PagesEnums } from 'src/app/core/enums/pages.enum';
import { MatTabGroup } from '@angular/material/tabs';
import { formatDate } from '@angular/common';

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

export class deststore {
  constructor(public id: number, public name: string) { }
}

export class List {
  constructor(public id: number, public name: string) { }
}


export interface Source {
  name: string;
}

export class itemPositive {
  constructor(public itemId: number, public name: string, public fullCode: string) { }
}

export class Product {
  constructor(public id: number, public name: string, public code: any) { }
}

interface strWithdraw {
  no: any;
  storeName: any;
  employeeName: any;
  desstoreName: any;
  costCenterName: any;
  fiscalyear: any;
  date: any;
  Action: any;
}

interface strWithdrawDetails {
  itemName: any;
  price: any;
  qty: any;
  total: any;
  action: any;
}

@Component({
  selector: 'app-str-withdraw-table2',
  templateUrl: './str-withdraw-table2.component.html',
  styleUrls: ['./str-withdraw-table2.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StrWithdrawTableComponent implements OnInit {
  selectedValue = 'STRWithdrawReport';
  selectedValueType = 'pdf';
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
  loading: boolean = false;
  matchedIds: any;
  // storeList: any;
  storeName: any;
  fiscalYearsList: any;
  fiscalYear: any;
  employeeSelectList: any;
  employeeName: any;
  // costcenterList: any;
  costCenterName: any;
  deststoreList: any;
  desstoreName: any;
  // itemsList:any;
  costCentersList: any;
  sharedStores: any;
  // form: FormGroup;

  groupMasterSearchForm!: FormGroup;
  groupMasterForm!: FormGroup;
  groupDetailsForm!: FormGroup;

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

  listCtrl: FormControl;
  filteredList: Observable<List[]>;
  lists: List[] = [];
  selectedList: List | undefined;
  getAddData: any;
  sourceSelected: any;

  formcontrol = new FormControl('');
  dataSource2: MatTableDataSource<strWithdraw> = new MatTableDataSource();
  pageIndex: any;
  length: any;
  pageSize = 5;
  ELEMENT_DATA: strWithdraw[] = [];
  currentPage: any;

  // dataSource2!: MatTableDataSource<any>;
  dataSource!: MatTableDataSource<any>;
  pdfurl = '';
  reportNameList: any;
  selectedReportNameTitle: any;
  reportTypeList: any;
  selectedReportTypeTitle: any;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  userRoles: any;
  selectedTitle: any;
  titleList: any;
  decodedToken: any;
  decodedToken2: any;
  userIdFromStorage = localStorage.getItem('transactionUserId');
  isReadOnlyEmployee: any = false;

  userRoleStoresAcc = PagesEnums.STORES_ACCOUNTS;

  defaultStoreSelectValue: any;
  defaultFiscalYearSelectValue: any;
  storeSelectedId: any;
  isEdit: boolean = false;
  fiscalYearSelectedId: any;
  autoNo: any;
  getMasterRowId: any;

  @ViewChild("matgroup", { static: false })
  matgroup!: MatTabGroup;

  editData: any;
  actionName: string = 'choose';
  actionBtnMaster: string = 'Save';
  isEditDataReadOnly: boolean = true;
  MasterGroupInfoEntered = false;
  getDetailedRowData: any;
  sumOfTotals = 0;


  displayedDetailsColumns: string[] = [
    'itemName',
    'price',
    'qty',
    'total',
    'action',
  ];
  dataSourceDetails: MatTableDataSource<strWithdrawDetails> = new MatTableDataSource();
  pageIndexDetails: any;
  lengthDetails: any;
  // pageSizeDetails: any;
  pageSizeDetails = 5;
  ELEMENT_DATA_DETAILS: strWithdrawDetails[] = [];
  currentPageDetails: any;

  itemName: any;
  fullCodeValue: any;
  itemByFullCodeValue: any;
  stateDefaultValue: any;

  itemsPositiveList: itemPositive[] = [];
  itemPositiveCtrl: FormControl;
  filtereditemPositive: Observable<itemPositive[]>;
  selecteditemPositive: itemPositive | undefined;

  productsList: Product[] = [];
  productCtrl: FormControl;
  filteredProduct: Observable<Product[]>;
  selectedProduct: Product | undefined;

  productIdValue: any;
  isReadOnlyPercentage: any = true;
  editDataDetails: any;
  // currentDate: any;

  constructor(
    private api: ApiService,
    private dialog: MatDialog,
    private hotkeysService: HotkeysService,
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    @Inject(LOCALE_ID) private locale: string
  ) {

    this.reportNameList = [
      {
        titleval: 'STRWithdrawReport',
      },
    ];

    this.reportTypeList = [
      {
        titleval: 'pdf',
        titleval1: 'txt',
        titleval2: 'ppt',
      },
    ];

    this.costcenterCtrl = new FormControl();
    this.filteredcostcenter = this.costcenterCtrl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filtercostcenters(value))
    );

    this.employeeCtrl = new FormControl();

    this.filteredEmployee = this.employeeCtrl.valueChanges.pipe(
      startWith(''),
      debounceTime(300), // Adjust the debounce time (in milliseconds) to your preference
      map((value) => this._filteremployees(value))
    );

    this.itemCtrl = new FormControl();

    this.filtereditem = this.itemCtrl.valueChanges.pipe(
      startWith(''),
      debounceTime(300), // Adjust the debounce time (in milliseconds) to your preference
      map((value) => this._filteritems(value))
    );

    this.storeCtrl = new FormControl();
    this.filteredstore = this.storeCtrl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filterstores(value))
    );

    this.titleList = [{
      'titleval': 'كشف العجز',
      'titleval1': 'سند خصم الاصناف فتقدة او تالفة',
      'titleval2': 'محضر بيع',
      'titleval3': 'طلب تشغيل',
      'titleval4': 'اهداءات ليست النشاط الرئيسي للجهة',
    }];

    this.listCtrl = new FormControl();
    this.filteredList = this.listCtrl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filterLists(value))
    );

    this.stateDefaultValue = "جديد";

    this.itemPositiveCtrl = new FormControl();
    this.filtereditemPositive = this.itemPositiveCtrl.valueChanges.pipe(
      startWith(''),
      debounceTime(300), // Adjust the debounce time (in milliseconds) to your preference
      map((value) => this._filteritemsPositive(value))
    );

    this.productCtrl = new FormControl();
    this.filteredProduct = this.productCtrl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filterProducts(value))
    );


  }

  ngOnInit(): void {
    this.selectedTitle = this.titleList[0].titleval;
    const accessToken: any = localStorage.getItem('accessToken');
    // console.log('accessToken', accessToken);
    // Decode the access token
    this.decodedToken = jwt_decode(accessToken);
    this.decodedToken2 = this.decodedToken.roles;
    // console.log('accessToken2', this.decodedToken2);

    this.selectedReportNameTitle = this.reportNameList[0].titleval;

    this.selectedReportTypeTitle = this.reportTypeList[0].titleval;

    this.getDestStores();
    this.getFiscalYears();
    this.getItems();

    this.getCostCenters();
    this.getAllMasterForms();
    this.getStores();
    this.getEmployees();

    // this.currentDate = new Date();
    // console.log('Date = ' + dateNow);

    // console.log('looo', this.sharedStores);

    this.groupMasterSearchForm = this.formBuilder.group({
      no: [''],
      employee: [''],
      costcenter: [''],
      // :[''],
      //  costcentersList:[''],
      costCenterId: [''],
      item: [''],
      fiscalYear: [''],
      StartDate: [''],
      EndDate: [''],

      store: [''],
      storeId: [''],
      employeeId: [''],
      employeeName: [''],
      itemId: [''],
      itemName: [''],

      report: [''],
      reportType: [''],
      // item:['']
    });

    this.groupMasterForm = this.formBuilder.group({
      total: ['0', Validators.required],
      no: ['', Validators.required],
      storeId: [''],
      storeName: ['', Validators.required],
      transactionUserId: [this.userIdFromStorage, Validators.required],
      destStoreUserId: [this.userIdFromStorage, Validators.required],
      type: ['', Validators.required],
      sourceInput: [''],

      date: ['', Validators.required],
      fiscalYearId: ['', Validators.required],
      employeeId: [''],
      employeeName: [''],
      costCenterId: [''],
      // costcenterName: [''],
      deststoreId: [''],
      desstoreName: [''],
      ListId: ['0'],
      productionDate: [''],
      expireDate: [''],
      destStoreConfirm: [false]
    });

    this.groupDetailsForm = this.formBuilder.group({
      stR_WithdrawId: ['', Validators.required], //MasterId
      qty: ['1', Validators.required],
      percentage: ['100'],
      price: ['', Validators.required],
      total: ['', Validators.required],
      transactionUserId: [localStorage.getItem('transactionUserId'), Validators.required],
      destStoreUserId: [localStorage.getItem('transactionUserId'), Validators.required],
      itemId: ['', Validators.required],
      state: [this.stateDefaultValue, Validators.required],
      fullCode: [''],
      itemName: [''],
      stateName: [''],
    });

    this.hotkeysService.add(
      new Hotkey('ctrl+o', (event: KeyboardEvent): boolean => {
        // Call the deleteGrade() function in the current component
        this.openWithdrawDialog();
        return false; // Prevent the default browser behavior
      })
    );

  }

  tabSelected(tab: any) {
    console.log("tab selected: ", tab);
    if (tab.index == 0) {
      console.log("done: ", tab);

      this.editData = '';
      this.MasterGroupInfoEntered = false;
      this.groupMasterForm.controls['no'].setValue('');
      this.listCtrl.setValue('');
      this.costcenterCtrl.setValue('');
      this.storeCtrl.setValue('');
      // this.groupMasterForm.controls['date'].setValue(this.currentDate);
      // this.lists = [];

      this.getAllMasterForms();

    }
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
      // this.getSearchStrWithdraw()
    }
  }
  openWithdrawDialog() {
    this.editData = '';
    // this.editDataDetails = '';

    // this.groupMasterForm.controls['no'].setValue('');
    // this.groupMasterForm.controls['journalId'].setValue('');
    // this.journalCtrl.reset();

    // this.groupMasterForm.controls['fiEntrySourceTypeId'].setValue('');
    // this.groupMasterForm.controls['date'].setValue(this.currentDate);
    // this.getFiscalYears();

    // this.groupMasterForm.controls['creditTotal'].setValue(0);
    // this.groupMasterForm.controls['debitTotal'].setValue(0);
    // this.groupMasterForm.controls['balance'].setValue(0);
    // this.groupMasterForm.controls['state'].setValue(this.defaultState);
    // this.groupMasterForm.controls['description'].setValue('');

    let tabGroup = this.matgroup;
    tabGroup.selectedIndex = 1;

    console.log("matGroup: ", tabGroup, "selectIndex: ", tabGroup.selectedIndex);
    this.autoNo = '';

    this.getStrWithdrawAutoNo();
    // // this.lists = [];
    // this.getListCtrl(this.groupMasterForm.getRawValue().type);

    this.getProducts();
    this.getItemsPositive();

    this.getAllDetailsForms();

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
    // this.getAllDetailsForms();


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

    // this.costCenterName = await this.getemployeeByID(
    //   this.groupMasterForm.getRawValue().employeeId
    // );
    this.groupMasterForm.controls['employeeName'].setValue(
      this.groupMasterForm.getRawValue().employeeName
    );

    // this.costCenterName = await this.getcostcenterByID(
    //   this.groupMasterForm.getRawValue().costCenterId
    // );
    // this.groupMasterForm.controls['costcenterName'].setValue(
    //   this.costCenterName
    // );

    this.groupMasterForm.controls['deststoreId'].setValue(
      this.groupMasterForm.getRawValue().deststoreId
    );
    // this.costCenterName = await this.getDestStoreById(
    //   this.groupMasterForm.getRawValue().deststoreId
    // );
    console.log(
      'in next to add deststore name:',
      this.groupMasterForm.getRawValue().desstoreName
    );
    this.groupMasterForm.controls['desstoreName'].setValue(
      this.groupMasterForm.getRawValue().desstoreName
    );

    console.log('dataName: ', this.groupMasterForm.value);

    if (this.groupMasterForm.getRawValue().no && this.groupMasterForm.getRawValue().no == this.autoNo) {

      console.log('no changed: ', this.groupMasterForm.getRawValue().no);
      this.groupMasterForm.controls['no'].setValue(this.autoNo);

    }
    else {
      this.groupMasterForm.controls['no'].setValue(this.groupMasterForm.getRawValue().no);
      console.log(
        'no took auto number: ',
        this.groupMasterForm.getRawValue().no
      );
    }

    console.log('Master add form : ', this.groupMasterForm.value);

    if (this.groupMasterForm.getRawValue().storeId) {

      console.log('Master add form in : ', this.groupMasterForm.value);
      this.api.postStrWithdraw(this.groupMasterForm.value).subscribe({
        next: (res) => {
          console.log('res code: ', res.status);

          this.getMasterRowId = {
            id: res,
          };
          console.log('mastered res: ', this.getMasterRowId.id);
          this.MasterGroupInfoEntered = true;

          this.toastrSuccess();
          this.getAllDetailsForms();
          this.getAllMasterForms();
          // this.updateDetailsForm();

        },
        error: (err) => {
          console.log('header post err: ', err);
          alert('حدث خطا عند الاضافة');
        },
      });
    }

  }

  async updateMaster() {
    console.log('nnnvvvvvvvvvv: ', this.groupMasterForm.value);


    this.groupMasterForm.controls['desstoreName'].setValue(
      this.groupMasterForm.getRawValue().desstoreName
    );

    this.groupMasterForm.controls['deststoreId'].setValue(
      this.groupMasterForm.getRawValue().deststoreId
    );

    this.groupDetailsForm.controls['transactionUserId'].setValue(this.userIdFromStorage);

    console.log("update both: ", this.groupDetailsForm.valid, "ooo:", !this.getDetailedRowData);
    console.log("edit : ", this.groupDetailsForm.value)
    this.api.putStrWithdraw(this.groupMasterForm.value)
      .subscribe({
        next: (res) => {
          this.groupDetailsForm.reset();
          this.getDetailedRowData = '';
          this.getAllMasterForms();
          this.groupDetailsForm.controls['qty'].setValue(1);
        },

      })
  }


  getAllMasterForms() {
    // this.api.getStrWithdraw().subscribe({
    //   next: (res) => {
    //     console.log('response of get all getGroup from api: ', res);
    //     this.dataSource2 = new MatTableDataSource(res);
    //     this.dataSource2.paginator = this.paginator;
    //     this.dataSource2.sort = this.sort;
    //     this.groupMasterSearchForm.reset();
    //     this.groupDetailsForm.reset();

    //     this.itemCtrl.reset();
    //     this.storeCtrl.reset();
    //     this.employeeCtrl.reset();


    //     console.log(
    //       'costcenterId in getall:',
    //       this.groupMasterSearchForm.getRawValue().selectedcostcenter?.id
    //     );

    //   },
    //   error: () => {
    //     // alert('خطأ أثناء جلب سجلات اذن الصرف !!');
    //   },
    // });

    if (!this.currentPage) {
      this.currentPage = 0;

      // this.isLoading = true;
      fetch(this.api.getStrWithdrawUserStorePaginateByMasterId(this.userIdFromStorage, this.currentPage, this.pageSize))
        .then(response => response.json())
        .then(data => {

          console.log("master data paginate first Time: ", data);
          this.dataSource2.data = data.items;
          this.pageIndex = data.page;
          this.pageSize = data.pageSize;
          this.length = data.totalItems;
          setTimeout(() => {
            this.paginator.pageIndex = this.currentPage;
            this.paginator.length = this.length;
          });

          // this.isLoading = false;
        }, error => {
          console.log(error);
          // this.isLoading = false;
        });
    }
    else {

      // this.isLoading = true;
      fetch(this.api.getStrWithdrawUserStorePaginateByMasterId(this.userIdFromStorage, this.currentPage, this.pageSize))
        .then(response => response.json())
        .then(data => {

          console.log("master data paginate: ", data);
          this.dataSource2.data = data.items;
          this.pageIndex = data.page;
          this.pageSize = data.pageSize;
          this.length = data.totalItems;
          setTimeout(() => {
            this.paginator.pageIndex = this.currentPage;
            this.paginator.length = this.length;
          });
          // this.isLoading = false;
        }, error => {
          console.log(error);
          // this.isLoading = false;
        });


    }

  }

  pageChanged(event: PageEvent) {
    console.log("page event: ", event);
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;

    this.getAllMasterForms();
  }

  editMasterForm(row: any) {
    let tabGroup = this.matgroup;
    tabGroup.selectedIndex = 1;

    this.editData = row;
    this.editDataDetails = '';

    console.log('master edit form: ', this.editData);

    // if (this.editData.type == 'المخزن') {
    this.actionName = 'sss';
    console.log('action btnnnnnnnnnnnnn', this.actionName);
    // let type = 'المخزن';
    // this.getDestStores();
    this.groupMasterForm.controls['type'].setValue(this.editData.type);
    this.getListCtrl(this.groupMasterForm.getRawValue().type);

    // this.groupMasterForm.controls['sourceInput'].setValue(
    //   this.groupMasterForm.getRawValue().desstoreName
    // );
    // }
    // else {
    //   this.actionName = 'choose';
    //   let type = 'الموظف';
    //   this.getListCtrl(type);
    //   this.getEmployees();

    // this.groupMasterForm.controls['type'].setValue('الموظف');
    // this.groupMasterForm.controls['sourceInput'].setValue(
    //     this.groupMasterForm.getRawValue().employeeName
    //   );
    //   console.log(
    //     'employee in edit:',
    //     this.groupMasterForm.getRawValue().employeeName
    //   );

    // }

    console.log('master edit form: ', this.editData);

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

    this.groupMasterForm.controls['fiscalYearId'].setValue(
      this.editData.fiscalYearId
    );

    this.groupMasterForm.controls['date'].setValue(this.editData.date);
    this.groupMasterForm.controls['destStoreConfirm'].setValue(this.editData.destStoreConfirm);
    this.groupMasterForm.controls['transactionUserId'].setValue(
      this.editData.transactionUserId
    );

    this.groupMasterForm.addControl(
      'id',
      new FormControl('', Validators.required)
    );
    this.groupMasterForm.controls['id'].setValue(this.editData.id);
    this.groupMasterForm.controls['employeeId'].setValue(
      this.editData.employeeId
    );


    this.groupMasterForm.controls['deststoreId'].setValue(
      this.editData.destStoreId
    );

    console.log('costcenter:', this.editData.costCenterId);

    this.groupMasterForm.controls['costCenterId'].setValue(
      this.editData.costCenterId
    );
    // this.groupMasterForm.controls['costcenterName'].setValue(
    //   this.editData.costcenterName
    // );
    this.isEditDataReadOnly = true;

    this.autoNo = '';
    this.getStrWithdrawAutoNo();

    this.getProducts();
    this.getItemsPositive();

    this.getAllDetailsForms();
  }

  getListCtrl(type: any) {
    this.sourceSelected = type;

    this.api.getEmployee().subscribe((lists) => {
      this.lists = lists;
      // this.employeesList = lists;
      // this.groupMasterForm.controls['deststoreId'].setValue(null);
      this.actionName = 'choose';
    });

    if (this.editData) {
      this.groupMasterForm.controls['employeeId'].setValue(this.editData.employeeId);
      this.groupMasterForm.controls['employeeName'].setValue(this.editData.employeeName);

    }

    if (type === 'الموظف') {
      // this.lists = [];
      // this.openAutoList();
      // console.log("list employee: ", this.lists);
      this.groupMasterForm.controls['deststoreId'].setValue(null);
      this.groupMasterForm.controls['type'].setValue('الموظف');
      this.groupMasterForm.controls['deststoreId'].setValue(null);
      this.groupMasterForm.controls['desstoreName'].setValue(null);
      this.storeCtrl.disable();
      this.costcenterCtrl.enable();

      if (this.editData) {
        this.groupMasterForm.controls['costCenterId'].setValue(this.editData.costCenterId);
      }

    } else {


      //   this.lists = [];
      //   // this.openAutoList();
      //   // console.log("list store: ", this.lists);

      //   this.api.getAllstores().subscribe((lists) => {
      //     this.lists = lists;
      //     this.groupMasterForm.controls['employeeId'].setValue(null);
      this.groupMasterForm.controls['type'].setValue('المخزن');
      this.groupMasterForm.controls['costCenterId'].setValue(null);
      this.costcenterCtrl.disable();

      this.storeCtrl.enable();
      this.actionName = 'store';

      if (this.editData) {
        this.groupMasterForm.controls['deststoreId'].setValue(this.editData.destStoreId);
        this.groupMasterForm.controls['desstoreName'].setValue(this.editData.desstoreName);
      }

      //   });
    }
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

  deleteBothForms(id: number) {
    var result = confirm('تاكيد الحذف ؟ ');
    console.log(' id in delete:', id);
    if (result) {
      this.api.deleteStrWithdraw(id).subscribe({
        next: (res) => {

          this.api.getStrWithdrawDetails().subscribe({
            next: (res) => {
              this.matchedIds = res.filter((a: any) => {
                // console.log("matched Id & HeaderId : ", a.HeaderId === id)
                return a.stR_WithdrawId == id;
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
    this.api.deleteStrWithdrawDetails(id).subscribe({
      next: (res) => {
        this.toastrDeleteSuccess();
        this.getAllMasterForms();
        this.getAllDetailsForms();
      },
      error: (err) => {
        // console.log("delete details err: ", err)
        // alert('خطأ أثناء حذف الصنف !!');
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

  getItemsPositive() {
    // this.loading = true;
    this.api.getItemsPositive(this.groupMasterForm.getRawValue().storeId, this.groupMasterForm.getRawValue().fiscalYearId).subscribe({
      next: (res) => {
        // this.loading = false;
        this.itemsPositiveList = res;
        // this.cdr.detectChanges(); // Trigger change detection
      },
      error: (err) => {
        // this.loading = false;
        // console.log("fetch store data err: ", err);
        alert('خطا اثناء جلب العناصر !');
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
          }
          else {
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

  getStrWithdrawAutoNo() {
    console.log("enter AutoNo function");

    // console.log(
    //   'storeId: ',
    //   this.storeSelectedId,
    //   ' fiscalYearId: ',
    //   this.fiscalYearSelectedId
    // );
    // console.log(
    //   'get default selected storeId & fisclYearId: ',
    //   this.defaultStoreSelectValue,
    //   ' , ',
    //   this.defaultFiscalYearSelectValue
    // );

    if (this.groupMasterForm) {
      // if (this.editData && !this.fiscalYearSelectedId) {
      //   console.log('change storeId only in updateHeader');
      //   this.api
      //     .getStrWithdrawAutoNo(
      //       this.groupMasterForm.getRawValue().storeId,
      //       this.editData.fiscalYearId
      //     )
      //     .subscribe({
      //       next: (res) => {
      //         this.autoNo = res;
      //         console.log('autoNo1: ', this.autoNo);
      //         return res;
      //       },
      //       error: (err) => {
      //         console.log('fetch autoNo err1: ', err);
      //         // alert("خطا اثناء جلب العناصر !");
      //       },
      //     });
      // } else if (this.editData && !this.storeSelectedId) {
      //   console.log('change fiscalYearId only in updateHeader');
      //   this.api
      //     .getStrWithdrawAutoNo(
      //       this.editData.storeId,
      //       this.groupMasterForm.getRawValue().fiscalYearId
      //     )
      //     .subscribe({
      //       next: (res) => {
      //         this.autoNo = res;
      //         console.log('autoNo2: ', this.autoNo);
      //         return res;
      //       },
      //       error: (err) => {
      //         console.log('fetch autoNo err2: ', err);
      //         // alert("خطا اثناء جلب العناصر !");
      //       },
      //     });
      // } else if (this.editData) {
      //   console.log('change both in edit data: ', this.isEdit);

      //   this.api
      //     .getStrWithdrawAutoNo(
      //       this.groupMasterForm.getRawValue().storeId,
      //       this.groupMasterForm.getRawValue().fiscalYearId
      //     )
      //     .subscribe({
      //       next: (res) => {
      //         this.autoNo = res;
      //         // this.editData = null;
      //         console.log('isEdit : ', this.isEdit);
      //         console.log('autoNo3: ', this.autoNo);
      //         return res;
      //       },
      //       error: (err) => {
      //         console.log('fetch autoNo err3: ', err);
      //         // alert("خطا اثناء جلب العناصر !");
      //       },
      //     });
      // } 

      console.log('editData: ', this.editData, "storeSelected: ", this.storeSelectedId, "fiscaLYearId: ", this.fiscalYearSelectedId);

      if (this.editData && (this.editData.storeId == this.storeSelectedId) && (this.editData.fiscalYearId == this.fiscalYearSelectedId)) {
        console.log("firstCase editData does Not change: ");
        this.isEdit = true;

        console.log('isEdit : ', this.isEdit, "no master: ", this.groupMasterForm.getRawValue().no);
        this.groupMasterForm.controls['no'].setValue(this.editData.no);
        console.log('autoNo1: ', this.groupMasterForm.getRawValue().no);

      }
      else if (this.editData && (this.editData.storeId != this.storeSelectedId) && (this.editData.fiscalYearId == this.fiscalYearSelectedId)) {
        console.log("secondCase editData with storeId Only change: ");

        this.api
          .getStrWithdrawAutoNo(
            this.groupMasterForm.getRawValue().storeId,
            this.editData.fiscalYearId
          )
          .subscribe({
            next: (res) => {
              this.autoNo = res;

              console.log('isEdit : ', this.isEdit, "no master: ", this.groupMasterForm.getRawValue().no);
              this.groupMasterForm.controls['no'].setValue(this.autoNo);
              console.log('autoNo2: ', this.autoNo);
              return res;
            },
            error: (err) => {
              console.log('fetch autoNo err2: ', err);
              // alert("خطا اثناء جلب العناصر !");
            },
          });

      }
      else if (this.editData && (this.editData.storeId == this.storeSelectedId) && (this.editData.fiscalYearId != this.fiscalYearSelectedId)) {
        console.log("thirdCase editData with fiscalYear Only change: ");

        this.api
          .getStrWithdrawAutoNo(
            this.editData.storeId,
            this.groupMasterForm.getRawValue().fiscalYearId
          )
          .subscribe({
            next: (res) => {
              this.autoNo = res;

              console.log('isEdit : ', this.isEdit, "no master: ", this.groupMasterForm.getRawValue().no);
              this.groupMasterForm.controls['no'].setValue(this.autoNo);
              console.log('autoNo3: ', this.autoNo);
              return res;
            },
            error: (err) => {
              console.log('fetch autoNo err3: ', err);
              // alert("خطا اثناء جلب العناصر !");
            },
          });
      }
      else if (this.editData && (this.editData.storeId != this.storeSelectedId) && (this.editData.fiscalYearId != this.fiscalYearSelectedId)) {
        console.log("fourthCase editData with fiscalYear And store change: ");

        this.api
          .getStrWithdrawAutoNo(
            this.groupMasterForm.getRawValue().storeId,
            this.groupMasterForm.getRawValue().fiscalYearId
          )
          .subscribe({
            next: (res) => {
              this.autoNo = res;

              console.log('isEdit : ', this.isEdit, "no master: ", this.groupMasterForm.getRawValue().no);
              this.groupMasterForm.controls['no'].setValue(this.autoNo);
              console.log('autoNo4: ', this.autoNo);
              return res;
            },
            error: (err) => {
              console.log('fetch autoNo err4: ', err);
              // alert("خطا اثناء جلب العناصر !");
            },
          });
      }
      else {
        console.log("fifthCase No editData: ");

        this.api
          .getStrWithdrawAutoNo(
            this.groupMasterForm.getRawValue().storeId,
            this.groupMasterForm.getRawValue().fiscalYearId
          )
          .subscribe({
            next: (res) => {
              this.autoNo = res;
              // this.editData.no = res
              console.log('isEdit : ', this.isEdit, "no master: ", this.groupMasterForm.getRawValue().no);
              this.groupMasterForm.controls['no'].setValue(this.autoNo);
              console.log('autoNo5: ', this.autoNo);
              return res;
            },
            error: (err) => {
              console.log('fetch autoNo err5: ', err);
              // alert("خطا اثناء جلب العناصر !");
            },
          });
      }
    }
  }

  getEmployees() {
    this.api.getEmployee().subscribe((lists) => {
      this.lists = lists;
     
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
  getcostcenterByID(id: any) {
    console.log('costcenter idddd: ', id);
    return fetch(this.api.getAllCostCenterById(id))
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


  getDestStores() {
    this.api.getStore().subscribe({
      next: (res) => {
        this.deststoreList = res;
        // console.log('deststore res: ', this.deststoreList);
      },
      error: (err) => {
        // console.log("fetch store data err: ", err);
        // alert('خطا اثناء جلب المخازن الخارجية !');
      },
    });
  }

  // getFiscalYears() {
  //   this.api.getFiscalYears().subscribe({
  //     next: (res) => {
  //       this.fiscalYearsList = res;
  //       console.log('fiscalYears list: ', this.fiscalYearsList);
  //     },
  //     error: (err) => {
  //       // console.log("fetch fiscalYears data err: ", err);
  //       // alert("خطا اثناء جلب العناصر !");
  //     },
  //   });
  // }

  async getFiscalYears() {
    this.api.getFiscalYears().subscribe({
      next: async (res) => {
        this.fiscalYearsList = res;

        this.api.getLastFiscalYear().subscribe({
          next: async (res) => {

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
            }
            else {
              this.groupMasterForm.controls['fiscalYearId'].setValue(
                this.defaultFiscalYearSelectValue.id
              );
              this.fiscalYearValueChanges(this.defaultFiscalYearSelectValue.id)
              // this.getStrWithdrawAutoNo();
            }
          },
          error: (err) => {
            // console.log("fetch store data err: ", err);
            // alert("خطا اثناء جلب المخازن !");
          },
        });

      },
      error: (err) => {
        // console.log("fetch fiscalYears data err: ", err);
        // alert("خطا اثناء جلب العناصر !");
      },
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

  displaycostcenterName(costcenter: any): string {
    return costcenter && costcenter.name ? costcenter.name : '';
  }
  costcenterSelected(event: MatAutocompleteSelectedEvent): void {
    const costcenter = event.option.value as costcenter;
    console.log('costcenter selected: ', costcenter);
    this.selectedcostcenter = costcenter;
    this.groupMasterSearchForm.patchValue({ costCenterId: costcenter.id });
    this.groupMasterForm.patchValue({ costCenterId: costcenter.id });
    console.log(
      'costcenter in form: ',
      this.groupMasterSearchForm.getRawValue().costCenterId
    );

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

  displaystoreName(store: any): string {
    return store && store.name ? store.name : '';
  }
  storeSelected(event: MatAutocompleteSelectedEvent): void {
    const store = event.option.value as store;
    console.log('store selected: ', store);
    this.selectedstore = store;
    this.groupMasterSearchForm.patchValue({ storeId: store.id });
    console.log('store in form: ', this.groupMasterSearchForm.getRawValue().storeId);

    if (this.sourceSelected === 'المخزن') {
      console.log("store list selected: ");
      this.groupMasterForm.patchValue({ deststoreId: store.id });
      this.groupMasterForm.patchValue({ desstoreName: store.name });
      // alert("deststoreId::::" + this.groupMasterForm.getRawValue().deststoreId)
      // this.set_Employee_Null(this.groupMasterForm.getRawValue().deststoreId);


    }
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


  displayListName(list: any): string {
    return list ? list.name && list.name != null ? list.name : '-' : '';
  }
  listSelected(event: MatAutocompleteSelectedEvent): void {
    console.log("list select: ", event.option.value, "sourceSelected: ", this.sourceSelected);
    const list = event.option.value as List;
    this.selectedList = list;

    this.groupMasterForm.patchValue({ employeeId: list.id });
    this.groupMasterForm.patchValue({ employeeName: list.name });
    // this.set_store_Null(this.groupMasterForm.getRawValue().emolyeeId);

    // if (this.sourceSelected === 'المخزن') {
    //   console.log("store list selected: ");
    //   this.groupMasterForm.patchValue({ deststoreId: list.id });
    //   this.groupMasterForm.patchValue({ desstoreName: list.name });
    //   // alert("deststoreId::::" + this.groupMasterForm.getRawValue().deststoreId)
    //   // this.set_Employee_Null(this.groupMasterForm.getRawValue().deststoreId);


    // }
    // else {
    //   this.groupMasterForm.patchValue({ employeeId: list.id });
    //   this.groupMasterForm.patchValue({ employeeName: list.name });
    //   this.set_store_Null(this.groupMasterForm.getRawValue().emolyeeId);
    // }
  }
  private _filterLists(value: string): List[] {
    const filterValue = value.toLowerCase();
    return this.lists.filter((list) =>
      list.name ? list.name.toLowerCase().includes(filterValue) : '-'
    );
  }
  openAutoList() {
    this.listCtrl.setValue(''); // Clear the input field value

    // Open the autocomplete dropdown by triggering the value change event
    this.listCtrl.updateValueAndValidity();
  }
  displayEmployeeName(employee: any): string {
    return employee ? employee.name && employee.name != null ? employee.name : '-' : '';
  }
  employeeSelected(event: MatAutocompleteSelectedEvent): void {
    const employee = event.option.value as Employee;
    console.log('employee selected: ', employee);
    this.selectedEmployee = employee;
    this.groupMasterForm.patchValue({ employeeId: employee.id });
      this.groupMasterForm.patchValue({ employeeName: employee.name });
    console.log(
      'employee in form: ',
      this.groupMasterSearchForm.getRawValue().employeeId
    );

  }
  private _filteremployees(value: string): Employee[] {
    const filterValue = value.toLowerCase();
    return this.employeesList.filter((employee) =>
      employee.name? employee.name.toLowerCase().includes(filterValue) : '-'
    );
  }
  openAutoEmployee() {
    this.employeeCtrl.setValue(''); // Clear the input field value

    // Open the autocomplete dropdown by triggering the value change event
    this.employeeCtrl.updateValueAndValidity();
  }

  set_store_Null(employeeId: any) {
    // alert("employeeId in null fun:"+employeeId)

    this.groupMasterForm.controls['deststoreId'].setValue(null);
    // console.log("deststoreId in null fun:",this.dest)
    this.isReadOnlyEmployee = true;
  }

  set_Employee_Null(deststoreId: any) {
    // alert("deststoreId in null fun:" + deststoreId)

    this.groupMasterForm.controls['employeeId'].setValue(null);
    this.isReadOnlyEmployee = true;
    this.isReadOnlyEmployee = true;
  }

  getSearchStrWithdraw(no: any, StartDate: any, EndDate: any, fiscalYear: any) {
    let costCenter = this.groupMasterSearchForm.getRawValue().costCenterId;
    let employee = this.groupMasterSearchForm.getRawValue().employeeId;
    let item = this.groupDetailsForm.getRawValue().itemId;
    let store = this.groupMasterSearchForm.getRawValue().storeId;

    console.log('itemId in ts:', this.groupDetailsForm.getRawValue().itemId);
    this.loading = true;
    this.api
      .getStrWithdrawSearch(
        no,
        store,
        StartDate,
        EndDate,
        fiscalYear,
        item,
        employee,
        costCenter
      )
      .subscribe({
        next: (res) => {
          this.loading = false;
          this.dataSource2 = res;
          this.dataSource2.paginator = this.paginator;
          this.dataSource2.sort = this.sort;
        },
        error: (err) => {
          this.loading = false;
          console.log('eroorr', err);
        },
      });
  }
  downloadPrint(
    no: any,
    StartDate: any,
    EndDate: any,
    fiscalYear: any,
    report: any,
    reportType: any
  ) {
    let costCenter = this.groupMasterSearchForm.getRawValue().costCenterId;
    let employee = this.groupMasterSearchForm.getRawValue().employeeId;
    let item = this.groupDetailsForm.getRawValue().itemId;
    let store = this.groupMasterSearchForm.getRawValue().storeId;

    this.api
      .getStr(
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

  previewPrint(
    no: any,
    StartDate: any,
    EndDate: any,
    fiscalYear: any,
    report: any,
    reportType: any
  ) {
    let costCenter = this.groupMasterSearchForm.getRawValue().costCenterId;
    let employee = this.groupMasterSearchForm.getRawValue().employeeId;
    let item = this.groupMasterSearchForm.getRawValue().itemId;
    let store = this.groupMasterSearchForm.getRawValue().storeId;
    if (report != null && reportType != null) {
      this.loading = true;
      this.api
        .getStr(
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


  // ---------------------------------------------------------------------------

  displayitemPositiveName(item: any): string {
    return item && item.name ? item.name : '';
  }
  itemPositiveSelected(event: MatAutocompleteSelectedEvent): void {
    const itemPositive = event.option.value as itemPositive;
    console.log('itemPositive selected: ', itemPositive);
    this.selecteditemPositive = itemPositive;
    this.groupDetailsForm.patchValue({ itemId: itemPositive.itemId });
    this.groupDetailsForm.patchValue({ fullCode: itemPositive.fullCode });
    this.fullCodeValue = itemPositive.fullCode;

    console.log('item in form: ', this.groupDetailsForm.getRawValue().itemId);
    this.itemOnChange(this.groupDetailsForm.getRawValue().itemId);

    this.getCodeByItem(this.groupDetailsForm.getRawValue().itemId);

    this.api.getAvgPrice(
      this.groupMasterForm.getRawValue().storeId,
      this.groupMasterForm.getRawValue().fiscalYearId,
      formatDate(this.groupMasterForm.getRawValue().date, 'yyyy-MM-dd', this.locale),
      this.groupDetailsForm.getRawValue().itemId
    )
      .subscribe({
        next: (res) => {

          this.groupDetailsForm.controls['price'].setValue(res);

          console.log("price avg called res: ", this.groupDetailsForm.getRawValue().price);
        },
        error: (err) => {
          // console.log("fetch fiscalYears data err: ", err);
          // alert("خطا اثناء جلب متوسط السعر !");
        }
      })

  }
  private _filteritemsPositive(value: string): itemPositive[] {
    const filterValue = value;
    return this.itemsPositiveList.filter((item) =>
      item.name.toLowerCase().includes(filterValue)
    );
  }
  openAutoitemPositive() {
    this.itemPositiveCtrl.setValue(''); // Clear the input field value

    // Open the autocomplete dropdown by triggering the value change event
    this.itemPositiveCtrl.updateValueAndValidity();
  }


  private _filterProducts(value: string): Product[] {
    const filterValue = value;
    console.log("filterValue222:", filterValue);

    return this.productsList.filter(
      (product) =>
        product.name.toLowerCase().includes(filterValue) ||
        product.code.toString().toLowerCase().includes(filterValue)
    );
  }
  displayProductName(product: any): string {
    return product && product.name ? product.name : '';
  }
  ProductSelected(event: MatAutocompleteSelectedEvent): void {
    const product = event.option.value as Product;
    console.log("product selected: ", product);
    this.selectedProduct = product;

    this.productIdValue = product.id;

    console.log("product in form: ", this.productIdValue);

    this.getItemByProductId(this.productIdValue);
  }
  openAutoProduct() {
    this.productCtrl.setValue(''); // Clear the input field value

    // Open the autocomplete dropdown by triggering the value change event
    this.productCtrl.updateValueAndValidity();
  }


  itemOnChange(itemEvent: any) {
    // this.isReadOnly = true;
    console.log("itemId: ", itemEvent)

    this.getAvgPrice(
      this.groupMasterForm.getRawValue().storeId,
      this.groupMasterForm.getRawValue().fiscalYearId,
      formatDate(this.groupMasterForm.getRawValue().date, 'yyyy-MM-dd', this.locale),
      itemEvent)

  }

  getCodeByItem(item: any) {
    console.log("item by code: ", item, "code: ", this.itemsList);

    // if (item.keyCode == 13) {
    this.itemsPositiveList.filter((a: any) => {
      if (a.itemId == item) {
        // this.groupDetailsForm.controls['itemId'].setValue(a.id);
        console.log("item by code selected: ", a)
        // console.log("item by code selected: ", a.fullCode)
        if (a.fullCode) {
          this.fullCodeValue = a.fullCode;
        }
        else {
          this.fullCodeValue = '-';
        }


      }
    })

  }

  getAvgPrice(storeId: any, fiscalYear: any, date: any, itemId: any) {
    console.log("Avg get inputs: ", "storeId: ", storeId,
      " fiscalYear: ", this.fiscalYear,
      " date: ", formatDate(date, 'yyyy-MM-dd', this.locale),
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

  getItemByProductId(productEvent: any) {
    console.log("productEvent: ", productEvent);
    let item;
    let itemName;

    this.productsList.filter((a: any) => {
      if (a.id == productEvent) {
        this.groupDetailsForm.controls['itemId'].setValue(a.itemId);
        // this.groupDetailsForm.controls['fullCode'].setValue(a.code);
        console.log("product: ", a);

        this.fullCodeValue = this.itemsPositiveList.find((item: { itemId: any; }) => item.itemId == a.itemId)?.fullCode;
        this.groupDetailsForm.controls['fullCode'].setValue(this.fullCodeValue);

        item = this.itemsPositiveList.find((item: { itemId: any; }) => item.itemId == a.itemId)?.itemId;
        this.groupDetailsForm.controls['itemId'].setValue(item);

        itemName = this.itemsPositiveList.find((item: { itemId: any; }) => item.itemId == a.itemId)?.name;
        this.groupDetailsForm.controls['itemId'].setValue(itemName);

        console.log("item by code: ", itemName, "id: ", item, "item full code: ", this.fullCodeValue);
        // this.itemPositiveCtrl.setValue(a.itemName);
        if (item) {
          this.itemByFullCodeValue = a.itemName;

          this.api.getAvgPrice(
            this.groupMasterForm.getRawValue().storeId,
            this.groupMasterForm.getRawValue().fiscalYearId,
            formatDate(this.groupMasterForm.getRawValue().date, 'yyyy-MM-dd', this.locale),
            this.groupDetailsForm.getRawValue().itemId
          )
            .subscribe({
              next: (res) => {
                this.groupDetailsForm.controls['price'].setValue(res)
                console.log("price avg called res: ", this.groupDetailsForm.getRawValue().price);
              },
              error: (err) => {
                // console.log("fetch fiscalYears data err: ", err);
                // alert("خطا اثناء جلب متوسط السعر !");
              }
            })

        }
        else {
          this.itemByFullCodeValue = '-';
        }
        // this.itemByFullCodeValue = a.itemName;
      }
    })
  }

  getItemByProductCode(code: any) {
    if (code.keyCode == 13) {
      let item;
      let itemName;

      this.productsList.filter((a: any) => {
        console.log("enter product code case, ", "a.code: ", a.code, " code target: ", code.target.value);
        if (a.code == code.target.value) {
          console.log("enter product code case condition: ", a.code == code.target.value);

          // this.groupDetailsForm.controls['itemId'].setValue(a.itemId);

          // this.productIdValue = a.name;
          // this.productCtrl.setValue(a.name);

          this.fullCodeValue = this.itemsPositiveList.find((item: { itemId: any; }) => item.itemId == a.itemId)?.fullCode;
          this.groupDetailsForm.controls['fullCode'].setValue(this.fullCodeValue);

          item = this.itemsPositiveList.find((item: { itemId: any; }) => item.itemId == a.itemId)?.itemId;
          this.groupDetailsForm.controls['itemId'].setValue(item);

          itemName = this.itemsPositiveList.find((item: { itemId: any; }) => item.itemId == a.itemId)?.name;
          this.groupDetailsForm.controls['itemName'].setValue(itemName);


          if (item) {
            this.itemByFullCodeValue = itemName;
            this.itemCtrl.setValue(itemName);

            this.api.getAvgPrice(
              this.groupMasterForm.getRawValue().storeId,
              this.groupMasterForm.getRawValue().fiscalYearId,
              formatDate(this.groupMasterForm.getRawValue().date, 'yyyy-MM-dd', this.locale),
              item
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

          }
          else {
            this.itemByFullCodeValue = '-';
          }
          // this.itemByFullCodeValue = a.name;
          // // this.itemOnChange(this.groupDetailsForm.getRawValue().itemId);

        }
        else {
          this.productIdValue = '';
        }
      })
    }
  }

  getItemByCode(code: any) {
    if (code.keyCode == 13) {
      this.itemsPositiveList.filter((a: any) => {
        console.log("full item code: ", a.fullCode, "code target: ", code.target.value)
        if (a.fullCode == code.target.value) {
          this.groupDetailsForm.controls['itemId'].setValue(a.itemId);
          this.groupDetailsForm.controls['fullCode'].setValue(a.fullCode);
          console.log("item by code: ", a.name);
          this.itemPositiveCtrl.setValue(a.name);
          if (a.name) {
            this.itemByFullCodeValue = a.name;

            this.api.getAvgPrice(
              this.groupMasterForm.getRawValue().storeId,
              this.groupMasterForm.getRawValue().fiscalYearId,
              formatDate(this.groupMasterForm.getRawValue().date, 'yyyy-MM-dd', this.locale),
              this.groupDetailsForm.getRawValue().itemId
            )
              .subscribe({
                next: (res) => {
                  this.groupDetailsForm.controls['price'].setValue(res)
                  console.log("price avg called res: ", this.groupDetailsForm.getRawValue().price);
                },
                error: (err) => {
                  // console.log("fetch fiscalYears data err: ", err);
                  // alert("خطا اثناء جلب متوسط السعر !");
                }
              })

          }
          else {
            this.itemByFullCodeValue = '-';
          }
          this.itemByFullCodeValue = a.name;

        }
        else {
          this.itemByFullCodeValue = '-';
        }
      })
    }


  }

  set_Percentage(state: any) {
    console.log('state value changed: ', state.value);
    if (state.value == "مستعمل") {
      this.isReadOnlyPercentage = false;
      this.groupDetailsForm.controls['state'].setValue(state.value);
      this.groupDetailsForm.controls['stateName'].setValue(state.value);
      this.groupDetailsForm.controls['percentage'].setValue(0);
    } else {
      this.isReadOnlyPercentage = true;
      this.groupDetailsForm.controls['state'].setValue(state.value);
      this.groupDetailsForm.controls['stateName'].setValue(state.value);
      this.groupDetailsForm.controls['percentage'].setValue(100);
    }
  }

  editDetailsForm(row: any) {
    console.log("editData details: ", row);
    this.editDataDetails = row;

    // this.goToPart();
    if (this.editDataDetails || row) {

      console.log('dETAILS ROW: ', this.editDataDetails);

      // this.actionBtnDetails = 'Update';
      this.groupDetailsForm.controls['stR_WithdrawId'].setValue(this.editDataDetails.stR_WithdrawId);
      this.groupDetailsForm.controls['qty'].setValue(this.editDataDetails.qty);
      this.groupDetailsForm.controls['price'].setValue(this.editDataDetails.price);
      this.groupDetailsForm.controls['percentage'].setValue(this.editDataDetails.percentage);

      this.groupDetailsForm.controls['total'].setValue(
        parseFloat(this.groupDetailsForm.getRawValue().price) *
        parseFloat(this.groupDetailsForm.getRawValue().qty)
      );

      this.groupDetailsForm.controls['transactionUserId'].setValue(this.editDataDetails.transactionUserId);
      this.groupDetailsForm.controls['destStoreUserId'].setValue(this.userIdFromStorage);
      this.groupDetailsForm.controls['itemId'].setValue(this.editDataDetails.itemId);
      this.groupDetailsForm.controls['itemName'].setValue(this.editDataDetails.itemName);
      this.groupDetailsForm.controls['state'].setValue(this.editDataDetails.state);
      this.groupDetailsForm.controls['fullCode'].setValue(this.editDataDetails.fullCode);
      this.groupDetailsForm.controls['stateName'].setValue(this.editDataDetails.stateName);

    }
  }

  getAllDetailsForms() {
    this.groupDetailsForm.controls['state'].setValue(this.stateDefaultValue);
    this.groupDetailsForm.controls['qty'].setValue(1);

    console.log("mastered row get all data: ", this.getMasterRowId)
    // if (this.getMasterRowId) {

    //   this.loading = true;
    //   this.api.getStrWithdrawDetailsByMasterId(this.getMasterRowId.id)
    //     .subscribe({
    //       next: (res) => {
    //         this.loading = false;
    //         // this.itemsList = res;
    //         this.matchedIds = res;

    //         if (this.matchedIds) {
    //           console.log("eeeeeeeeeeeeeeeeeeeeeeeeeeee: ", res);
    //           this.dataSource = new MatTableDataSource(this.matchedIds);
    //           this.dataSource.paginator = this.paginator;
    //           this.dataSource.sort = this.sort;

    //           this.sumOfTotals = 0;
    //           for (let i = 0; i < this.matchedIds.length; i++) {
    //             this.sumOfTotals = this.sumOfTotals + parseFloat(this.matchedIds[i].total);
    //             this.sumOfTotals = Number(this.sumOfTotals.toFixed(2));
    //             this.groupMasterForm.controls['total'].setValue(Number(this.sumOfTotals.toFixed(2)));
    //             // alert('totalll: '+ this.sumOfTotals)
    //             // this.updateBothForms();
    //             this.updateMaster();
    //           }
    //         }
    //       },
    //       error: (err) => {
    //         // console.log("fetch items data err: ", err);
    //         // alert("خطا اثناء جلب العناصر !");
    //       }
    //     })

    // }

    if (this.editData) {
      this.getMasterRowId = {
        "id": this.editData.id
      }
    }

    console.log("mastered row get all data: ", this.getMasterRowId)
    if (this.getMasterRowId) {
      this.api.getStrWithdrawDetailsByMasterId(this.getMasterRowId.id).subscribe({
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

      if (!this.currentPageDetails) {
        this.currentPageDetails = 0;

        // this.isLoading = true;
        fetch(this.api.getStrWithdrawDetailsPaginateByMasterId(this.currentPageDetails, this.pageSizeDetails, this.getMasterRowId.id))
          .then(response => response.json())
          .then(data => {

            console.log("details data paginate first Time: ", data);
            this.dataSourceDetails.data = data.items;
            this.pageIndexDetails = data.page;
            this.pageSizeDetails = data.pageSize;
            this.lengthDetails = data.totalItems;
            setTimeout(() => {
              this.paginator.pageIndex = this.currentPageDetails;
              this.paginator.length = this.lengthDetails;
            });

            // this.isLoading = false;
          }, error => {
            console.log(error);
            // this.isLoading = false;
          });
      }
      else {

        // this.isLoading = true;
        fetch(this.api.getStrWithdrawDetailsPaginateByMasterId(this.currentPageDetails, this.pageSizeDetails, this.getMasterRowId.id))
          .then(response => response.json())
          .then(data => {

            console.log("details data paginate: ", data);
            this.dataSourceDetails.data = data.items;
            this.pageIndexDetails = data.page;
            this.pageSizeDetails = data.pageSize;
            this.lengthDetails = data.totalItems;
            setTimeout(() => {
              this.paginator.pageIndex = this.currentPageDetails;
              this.paginator.length = this.lengthDetails;
            });
            // this.isLoading = false;
          }, error => {
            console.log(error);
            // this.isLoading = false;
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

  async addNewDetails() {
    if (!this.getMasterRowId) {
      this.getMasterRowId = {
        "id": this.editData.id
      }
    }
    console.log('masterrow', this.getMasterRowId);
    if (!this.editDataDetails) {
      if (this.getMasterRowId) {

        if (this.groupDetailsForm.getRawValue().itemId) {
          this.itemName = await this.getItemByID(
            this.groupDetailsForm.getRawValue().itemId
          );
          this.groupDetailsForm.controls['itemName'].setValue(this.itemName);
          this.groupDetailsForm.controls['transactionUserId'].setValue(localStorage.getItem('transactionUserId'));
          this.groupDetailsForm.controls['destStoreUserId'].setValue(localStorage.getItem('transactionUserId'));

        }
        this.groupDetailsForm.controls['stateName'].setValue(this.groupDetailsForm.getRawValue().state);

        this.groupDetailsForm.controls['stR_WithdrawId'].setValue(
          parseInt(this.getMasterRowId.id)
        );

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
                this.itemPositiveCtrl.setValue('');
                this.itemByFullCodeValue = '';
                this.fullCodeValue = '';
                this.productCtrl.setValue('');

                // alert("autoNo: " + this.autoNo + " no control: " + this.groupMasterForm.getRawValue().no)
                this.autoNo = this.groupMasterForm.getRawValue().no;
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
    }
    else {
      this.updateDetailsForm();
    }
  }

  async updateDetailsForm() {
    // console.log(
    //   'store id in update:',
    //   this.getMasterRowStoreId
    // );

    // console.log("values getMasterRowId: ", this.getMasterRowId)
    // console.log("values details form: ", this.groupDetailsForm.value)

    // if (this.editData) {
    this.groupDetailsForm.addControl(
      'id',
      new FormControl('', Validators.required)
    );
    if (this.editDataDetails) {
      this.groupDetailsForm.controls['id'].setValue(this.editDataDetails.id);
      console.log('data item Name in edit: ', this.groupDetailsForm.value);
      // }
      this.groupDetailsForm.controls['price'].setValue(this.editDataDetails.price);
    }

    this.groupDetailsForm.controls['total'].setValue(
      parseFloat(this.groupDetailsForm.getRawValue().price) *
      parseFloat(this.groupDetailsForm.getRawValue().qty)
    );

    // if (this.getDetailedRowData) {
    console.log('details foorm: ', this.groupDetailsForm.value);

    this.isEdit = false;

    // this.api.putStrWithdraw(this.groupMasterForm.value).subscribe({
    //   next: (res) => {
    if (this.groupDetailsForm.valid) {

      this.api
        .putStrWithdrawDetails(this.groupDetailsForm.value)
        .subscribe({
          next: (res) => {
            this.groupDetailsForm.reset();
            this.getAllDetailsForms();
            this.itemPositiveCtrl.setValue('');
            this.itemByFullCodeValue = '';
            this.fullCodeValue = '';
            this.getDetailedRowData = '';
            this.productCtrl.reset();
            this.editDataDetails = '';
            // alert('تم التعديل بنجاح');
            this.groupDetailsForm.controls['state'].setValue(this.stateDefaultValue);
            this.toastrEditSuccess();

            // alert("autoNo: " + this.autoNo + " no control: " + this.groupMasterForm.getRawValue().no)
            this.autoNo = this.groupMasterForm.getRawValue().no;
          },
          error: (err) => {
            console.log("update err: ", err)
            // alert("خطأ أثناء تحديث سجل المجموعة !!")
          },
        });
    }

  }

  getProducts() {
    this.api.getStrProduct().subscribe({
      next: (res) => {
        this.productsList = res;
        console.log("productsList res: ", this.productsList);
      },
      error: (err) => {
        // console.log("fetch products data err: ", err);
        // alert("خطا اثناء جلب المنتجات !");
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

  toastrDeleteSuccess(): void {
    this.toastr.success('تم الحذف بنجاح');
  }
  toastrSuccess(): void {
    this.toastr.success('تم الحفظ بنجاح');
  }
  toastrEditSuccess(): void {
    this.toastr.success('تم التعديل بنجاح');
  }
}
