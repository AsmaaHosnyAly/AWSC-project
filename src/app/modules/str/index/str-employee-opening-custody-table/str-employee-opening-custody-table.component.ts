import { Component, Inject, LOCALE_ID, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from '../../services/api.service';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import {FormControl,FormBuilder,FormGroup,Validators,
} from '@angular/forms';
import { Observable, debounceTime, map, startWith, tap } from 'rxjs';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { HotkeysService } from 'angular2-hotkeys';
import { Hotkey } from 'angular2-hotkeys';
import { PrintDialogComponent } from './../print-dialog/print-dialog.component';
import { GlobalService } from 'src/app/pages/services/global.service';
import { ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import jwt_decode from 'jwt-decode';
import { MatTabGroup } from '@angular/material/tabs';

export class Employee {
  constructor(public id: number, public name: string, public code: string) { }
}

export class costcenter {
  constructor(public id: number, public name: string) { }
}
export class item {
  constructor(public id: number, public name: string) { }
}
export class List {
  constructor(public id: number, public name: string) { }
}

export class AddType {
  constructor(public id: number, public name: string, public source: any) { }
}

export class ApprovalStatus {
  constructor(public id: number, public name: string) { }
}
interface STREmployeeOpeningCustody {
  no: any;
  employeeName: any;
  costCenterName: any;
  fiscalyear: any;
  date: any;
  Action: any;
}
interface STREmployeeOpeningCustodyditals {
  itemName: any;
  percentage: any;
  state: any;
  price: any;
  qty: any;
  total: any;
  action: any;
}
@Component({
  selector: 'app-str-employee-opening-custody-table',
  templateUrl: './str-employee-opening-custody-table.component.html',
  styleUrls: ['./str-employee-opening-custody-table.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class STREmployeeOpeningCustodyTableComponent implements OnInit {
  displayedColumns: string[] = [
    'no',
    'employeeName',
    'costCenterName',
    'fiscalyear',
    'date',
    'Action',
  ];
  displayedPendingColumns: string[] = [
    'itemName',
    'percentage',
    'state',
    'price',
    'qty',
    'total',
    'action',
  ];

  matchedIds: any;
  storeList: any;
  storeName: any;
  
  fiscalYearsList: any;
  approvalStatusCtrl: FormControl;
  filteredApprovalStatus: Observable<ApprovalStatus[]>;
  approvalStatusList: ApprovalStatus[] = [];
  selectedApprovalStatus: ApprovalStatus | undefined;

  addTypeCtrl: FormControl;
  filteredAddType: Observable<AddType[]>;
  addTypeList: AddType[] = [];
  selectedAddType: AddType | undefined;

  actionBtnDetails: string = 'Save';
  groupsearchForm!: FormGroup;
  groupDetailsForm!: FormGroup;
  groupMasterForm!: FormGroup;
  serachFlag: boolean = false;
  pdfurl = '';
  isEdit: boolean = false;

  costCentersList: costcenter[] = [];
  costcenterCtrl: FormControl<any>;
  filteredcostcenter: Observable<costcenter[]>;
  selectedcostcenter: costcenter | undefined;

  loading: boolean = false;
  fiscalYearSelectedId: any;
  storeSelectedId: any;
  defaultStoreSelectValue: any;
  defaultFiscalYearSelectValue: any;
  editDataDetails: any;
  editData: any;
  pageIndex: any;
  sumOfTotals = 0;
  length: any;
  pageSize: any;
  currentPage: any;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  isLoading = false;
  autoNo: any;
  totalRows = 0;
  decodedToken: any;
  decodedToken2: any;
  MasterGroupInfoEntered = false;
  userIdFromStorage = localStorage.getItem('transactionUserId');
  getMasterRowId: any;
  actionBtnMaster: string = 'Save';
  actionName: string = 'choose';
  isReadOnlyPercentage: any = false;
  itemByFullCodeValue: any;
  isReadOnly: boolean = true;

  itemName: any;
  itemsList: item[] = [];
  itemCtrl: FormControl;
  filtereditem: Observable<item[]>;
  selecteditem: item | undefined;

  employeesList: Employee[] = [];
  employeeCtrl: FormControl;
  filteredEmployee: Observable<Employee[]>;
  selectedEmployee: Employee | undefined;

  dataSource2: MatTableDataSource<STREmployeeOpeningCustody> =
    new MatTableDataSource();
  dataSource: MatTableDataSource<STREmployeeOpeningCustodyditals> =
    new MatTableDataSource();
  ELEMENT_DATA_DETAILS: STREmployeeOpeningCustodyditals[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  @ViewChild('matgroup', { static: false })
  matgroup!: MatTabGroup;
  stateDefaultValue: string;

  isEditDataReadOnly: boolean = true;

  constructor(
    private api: ApiService,
    private dialog: MatDialog,
    private hotkeysService: HotkeysService,
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    @Inject(LOCALE_ID) private locale: string,
    private toastr: ToastrService,
    private global: GlobalService
  ) {
    global.getPermissionUserRoles(
      'Store',
      'str-home',
      'إدارة المخازن وحسابات المخازن ',
      'store'
    );
    this.costcenterCtrl = new FormControl();
    this.stateDefaultValue = 'جديد';
    this.filteredcostcenter = this.costcenterCtrl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filtercostcenters(value))
    );
    this.addTypeCtrl = new FormControl();
    this.filteredAddType = this.addTypeCtrl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filterAddType(value))
    );

    this.itemCtrl = new FormControl();
    this.filtereditem = this.itemCtrl.valueChanges.pipe(
      startWith(''),
      debounceTime(300), // Adjust the debounce time (in milliseconds) to your preference
      map((value) => this._filteritems(value))
    );

    this.employeeCtrl = new FormControl();
    this.filteredEmployee = this.employeeCtrl.valueChanges.pipe(
      startWith(''),
      debounceTime(300), // Adjust the debounce time (in milliseconds) to your preference
      map((value) => this._filteremployees(value))
    );

    this.approvalStatusCtrl = new FormControl();
    this.filteredApprovalStatus = this.approvalStatusCtrl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filterApprovalStatus(value))
    );
  }
  ngOnInit(): void {
    const accessToken: any = localStorage.getItem('accessToken');
    // console.log('accessToken', accessToken);
    // Decode the access token
    this.decodedToken = jwt_decode(accessToken);
    this.decodedToken2 = this.decodedToken.roles;
    console.log('accessToken2', this.decodedToken2);

    this.getAllMasterForms();
    // this.getAllEmployees();
    this.getFiscalYears();
    this.getEmployees();
    this.getItme();
    this.getcostCenter();
    let dateNow: Date = new Date();
    this.groupMasterForm = this.formBuilder.group({
      no: ['', Validators.required],
      // storeId: ['', Validators.required],
      // storeName: ['', Validators.required],
      employeName: ['', Validators.required],
      employeeId: ['', Validators.required],
      costCenterName: ['', Validators.required],
      costCenterId: ['', Validators.required],
      transactionUserId: [this.userIdFromStorage, Validators.required],
      date: [dateNow, Validators.required],
      total: ['', Validators.required],
      fiscalYearId: ['', Validators.required],
    });

    this.groupsearchForm = this.formBuilder.group({
      no: [''],
      // employee: [''],
      costcenter: [],
      costCenterId: [''],
      employeeId: [''],
      employeeName: [''],
      StartDate: [''],
      EndDate: [''],
      itemName: [''],
      itemId: [''],
      fiscalYear: [''],
      date: [''],
      report: [''],
      reportType: [''],
    });

    this.groupDetailsForm = this.formBuilder.group({
      custodyId: ['', Validators.required], //MasterId
      qty: ['1', Validators.required],
      price: ['', Validators.required],
      total: ['', Validators.required],
      state: [this.stateDefaultValue, Validators.required],
      percentage: ['100'],
      transactionUserId: ['', Validators.required],
      itemId: ['', Validators.required],
      itemName: ['', Validators.required],
      notes: [''],
      description: [''],
    });
    this.hotkeysService.add(
      new Hotkey('ctrl+o', (event: KeyboardEvent): boolean => {
        // Call the deleteGrade() function in the current component
        this.openEmployeeingStockDialog();
        return false; // Prevent the default browser behavior
      })
    );
  }

  getsearch(code: any) {
    if (code.keyCode == 13) {
      this.getAllMasterForms();
    }
  }
  tabSelected(tab: any) {
    console.log('tab selected: ', tab);
    if (tab.index == 0) {
      this.getAllMasterFormss();
    }
  }
  async fiscalYearValueChanges(fiscalyaerId: any) {
    console.log('fiscalyaer: ', fiscalyaerId);
    this.fiscalYearSelectedId = await fiscalyaerId;
    this.groupMasterForm.controls['fiscalYearId'].setValue(
      this.fiscalYearSelectedId
    );
    this.isEdit = false;

    this.getStrEmployeeOpenAutoNo();
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

  getAllMasterForms() {
    this.loading = true;
    this.api.getStrEmployeeOpen().subscribe({
      next: (res) => {
        this.loading = false;
        console.log('response of get all getGroup from api: ', res);
        this.dataSource2 = new MatTableDataSource(res);
        this.dataSource2.paginator = this.paginator;
        this.dataSource2.sort = this.sort;

        this.groupsearchForm.reset();
        this.groupDetailsForm.reset();

        this.itemCtrl.reset();
        this.employeeCtrl.reset();
        this.costcenterCtrl.reset();
      },
      error: () => {
        this.loading = false;
        // alert('خطأ أثناء جلب سجلات المجموعة !!');
      },
    });
  }
  openEmployeeingStockDialog() {
    let tabGroup = this.matgroup;
    tabGroup.selectedIndex = 1;
    console.log(
      'matGroup: ',
      tabGroup,
      'selectIndex: ',
      tabGroup.selectedIndex
    );
    this.autoNo = '';
    this.editData = '';
    this.MasterGroupInfoEntered = false;
    this.getcostCenter();
    this.getStrEmployeeOpenAutoNo();
    this.getFiscalYears();
  }

  async nextToAddFormDetails() {
    this.groupMasterForm.removeControl('id');

    this.groupMasterForm.controls['total'].setValue(this.sumOfTotals);
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

      console.log('Master add form : ', this.groupMasterForm.value);
      this.api.postStrEmployeeOpen(this.groupMasterForm.value).subscribe({
        next: (res) => {
          this.getMasterRowId = {
            id: res,
          };
          console.log('Master add form 2: ', this.groupMasterForm.value);
          console.log('mastered res: ', this.getMasterRowId.id);
          this.MasterGroupInfoEntered = true;
          this.toastrSuccess();
          this.getAllDetailsForms();
          this.updateDetailsForm();
        },
        error: (err) => {
          console.log('header post err: ', err);
          // alert("حدث خطأ أثناء إضافة مجموعة")
        },
      });
    }
  }

  getStrApprovalStatus() {
    this.api.getStrApprovalStatus().subscribe({
      next: (res) => {
        this.approvalStatusList = res;
      },
      error: (err) => {
        // console.log("fetch fiscalYears data err: ", err);
        // alert("خطا اثناء جلب العناصر !");
      },
    });
  }
  getAllMasterFormss() {
    if (!this.currentPage && this.serachFlag == false) {
      this.currentPage = 0;
      this.pageSize = 5;

      this.isLoading = true;
      console.log('first time: ');

      fetch(
        this.api.getStrEmployeeOpenPaginateByUserId(
          localStorage.getItem('transactionUserId'),
          this.currentPage,
          this.pageSize
        )
      )
        .then((response) => response.json())
        .then(
          (data) => {
            // this.totalRows = data.length;
            console.log('master data paginate first Time: ', data);
            this.totalRows = data.length;

            this.dataSource2.data = data.items;
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
      if (this.serachFlag == false) {
        this.isLoading = true;
        console.log('second time: ');

        fetch(
          this.api.getStrEmployeeOpenPaginateByUserId(
            localStorage.getItem('transactionUserId'),
            this.currentPage,
            this.pageSize
          )
        )
          .then((response) => response.json())
          .then(
            (data) => {
              // this.totalRows = data.length;
              console.log('master data paginate: ', data);
              this.totalRows = data.length;

              this.dataSource2.data = data.items;
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
        console.log('search next paginate');
        this.getSearchStrOpen(
          this.groupsearchForm.getRawValue().no,
          this.groupsearchForm.getRawValue().StartDate,
          this.groupsearchForm.getRawValue().EndDate,
          this.groupsearchForm.getRawValue().fiscalYear
        );
      }
    }
  }
  pageChanged(event: PageEvent) {
    console.log('page event: ', event);
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    // this.currentPage = event.previousPageIndex;
    this.getAllMasterFormss();
  }

  private _filterApprovalStatus(value: string): ApprovalStatus[] {
    const filterValue = value;
    return this.approvalStatusList.filter((approvalStatus) =>
      approvalStatus.name.toLowerCase().includes(filterValue)
    );
  }

  deleteBothForms(id: number) {
    var result = confirm('تاكيد الحذف ؟ ');
    console.log(' id in delete:', id);
    if (result) {
      this.api.deleteStrEmployeeOpen(id).subscribe({
        next: (res) => {
          this.api.getStrEmployeeOpenDetails().subscribe({
            next: (res) => {
              this.matchedIds = res.filter((a: any) => {
                // console.log("matched Id & HeaderId : ", a.HeaderId === id)
                return a.custodyId === id;
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
    this.api.deleteStrEmployeeOpenDetails(id).subscribe({
      next: (res) => {
        // alert('تم حذف الصنف بنجاح');
        this.getAllDetailsForms();
      },
      error: (err) => {
        console.log('delete details err: ', err);
        // alert('خطأ أثناء حذف الصنف !!');
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
              // this.getStrWithdrawAutoNo();
              this.getStrEmployeeOpenAutoNo();
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

  // getEmployees() {
  //   this.api.getEmployee().subscribe((lists) => {
  //     this.employeesList = lists;
  //     this.cdr.detectChanges();
  //   });
  // }

  getEmployees() {
    this.loading = true;
    this.api.getEmployee().subscribe({
      next: (res) => {
        this.loading = false;
        this.employeesList = res;
        this.cdr.detectChanges(); // Trigger change detection
      },
      error: (err) => {
        this.loading = false;
        // console.log("fetch store data err: ", err);
        alert('خطا اثناء جلب العناصر !');
      },
    });
  }

  getItme() {
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

  getcostCenter() {
    this.api.getCostCenter().subscribe({
      next: (res) => {
        this.costCentersList = res;
        // console.log("item res: ", this.itemList);
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
    // this.groupMasterForm.patchValue({ itemId: item.id });
    this.groupsearchForm.patchValue({ itemId: item.id });

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

  displaycostcenterName(costcenter: any): string {
    return costcenter && costcenter.name ? costcenter.name : '';
  }
  costcenterSelected(event: MatAutocompleteSelectedEvent): void {
    const costcenter = event.option.value as costcenter;
    console.log('costcenter selected: ', costcenter);
    this.selectedcostcenter = costcenter;
    this.groupsearchForm.patchValue({ costCenterId: costcenter.id });
    console.log(
      'costcenter in form: ',
      this.groupsearchForm.getRawValue().costCenterId
    );

    this.groupMasterForm.patchValue({ costCenterId: costcenter.id });
    this.groupMasterForm.patchValue({ costCenterName: costcenter.name });

    // this.getSearchStrWithdraw()
    // this.set_store_Null(this.groupMasterForm.getRawValue().costCenterId);
    // return     this.groupMasterForm.patchValue({ costCenterId: costcenter.id });
  }
  private _filtercostcenters(value: string): costcenter[] {
    const filterValue = value;
    return this.costCentersList.filter((costcenter) =>
      costcenter.name.toLowerCase().includes(filterValue)
    );
  }
  openAutocostcenter() {
    this.costcenterCtrl.setValue(''); // Clear the input field value

    // Open the autocomplete dropdown by triggering the value change event
    this.costcenterCtrl.updateValueAndValidity();
  }

  private _filterAddType(value: string): AddType[] {
    const filterValue = value;
    return this.addTypeList.filter((addType) =>
      addType.name.toLowerCase().includes(filterValue)
    );
  }
  /////employeee

  displayEmployeeName(employee: any): string {
    return employee ? employee.name && employee.name != null ? employee.name : '-' : '';
  }
  employeeSelected(event: MatAutocompleteSelectedEvent): void {
    const employee = event.option.value as Employee;
    console.log('employee selected: ', employee);
    this.selectedEmployee = employee;
    this.groupsearchForm.patchValue({ employeeId: employee.id });
    this.groupMasterForm.patchValue({ employeeId: employee.id });
    console.log(
      'employee in form: ',
      this.groupsearchForm.getRawValue().employeeId
    );

  }
  private _filteremployees(value: string): Employee[] {
    const filterValue = value.toLowerCase();
    return this.employeesList.filter((employee: { name: string }) =>
      employee.name? employee.name.toLowerCase().includes(filterValue) : '-'
    );
  }
  openAutoEmployee() {
    this.employeeCtrl.setValue(''); // Clear the input field value

    // Open the autocomplete dropdown by triggering the value change event
    this.employeeCtrl.updateValueAndValidity();
  }


  getSearchStrOpen(no: any, StartDate: any, EndDate: any, fiscalyear: any) {

    let costCenterId = this.groupsearchForm.getRawValue().costCenterId;
    let employeeId = this.groupsearchForm.getRawValue().employeeId;
    let itemId = this.groupDetailsForm.getRawValue().itemId;
    this.api.getStrEmployeeOpenSearach(
        no,
        costCenterId,
        employeeId,
        itemId,
        StartDate,
        EndDate,
        fiscalyear
      )
      .subscribe({
        next: (res) => {
          // this.loading = false;
          console.log('search employeeExchange 4res: ', res);
          this.dataSource2 = res;
          this.dataSource2.paginator = this.paginator;
          this.dataSource2.sort = this.sort;
        },
        error: (err) => {
          // this.loading = false;
          console.log('eroorr', err);
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
  downloadPrint(
    no: any,
    StartDate: any,
    EndDate: any,
    fiscalYear: any,
    report: any,
    reportType: any
  ) {
    let costCenter = this.groupsearchForm.getRawValue().costCenterId;
    let employee = this.groupsearchForm.getRawValue().employeeId;
    let item = this.groupDetailsForm.getRawValue().itemId;
    let store = this.groupsearchForm.getRawValue().storeId;

    this.api.getStrEmployeeCustodyReport(
        no,
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
  resetForm() {
    this.groupsearchForm.reset();

    this.itemCtrl.reset();

    this.employeeCtrl.reset();

    this.serachFlag = false;

    this.getAllMasterForms();
  }

  previewPrint(no: any, StartDate: any, EndDate: any, fiscalYear: any, report: any, reportType: any) 
  {
    let costCenter = this.groupsearchForm.getRawValue().costCenterId;
    let employee = this.groupsearchForm.getRawValue().employeeId;
    let item = this.groupDetailsForm.getRawValue().itemId;
    let store = this.groupsearchForm.getRawValue().storeId;
    if (report != null && reportType != null) {
      // this.loading = true;
      this.api
        .getStrEmployeeCustodyReport( no, StartDate, EndDate, fiscalYear, item, employee, costCenter, report, 'pdf')
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
 
  // -------------------------------------------------------------------//
  async updateMaster() {
    // this.groupDetailsForm.controls['transactionUserId'].setValue(this.userIdFromStorage);

    console.log('update both: ', this.groupMasterForm.value);
    this.api.putStrEmployeeOpen(this.groupMasterForm.value).subscribe({
      next: (res) => {
        console.log(res);
        console.log('edit', this.groupMasterForm.value);
        this.groupDetailsForm.reset();

        // this.getDetailedRowData = '';
        // this.groupDetailsForm.controls['qty'].setValue(1);
        this.getAllMasterForms();
      },
    });
  }
  set_Percentage(state: any) {
    console.log('state value changed: ', state.value);
    this.groupDetailsForm.controls['state'].setValue(state.value);
    console.log('state value changed: ', this.groupDetailsForm.getRawValue().state);
    if (this.groupDetailsForm.getRawValue().state == "مستعمل") {
      this.isReadOnlyPercentage = false;
      this.groupDetailsForm.controls['state'].setValue(this.groupDetailsForm.getRawValue().state);
    } else {
      this.isReadOnlyPercentage = true;
      this.groupDetailsForm.controls['state'].setValue(this.groupDetailsForm.getRawValue().state);
      this.groupDetailsForm.controls['percentage'].setValue(100);
    }
  }
  getAllDetailsForms() {
    if (this.editData) {
      this.getMasterRowId = {
        "id": this.editData.id
      }
    }


    console.log('mastered row get all data: ', this.getMasterRowId);

    if (this.getMasterRowId) {

      console.log('enter condition');
      this.api.getStrEmployeeOpenDetailsByMasterId(this.getMasterRowId.id)
        .subscribe({
          next: (res) => {
            console.log("res comming: ", res)
            // this.itemsList = res;
            this.matchedIds = res;

            if (this.matchedIds) {
              this.dataSource = new MatTableDataSource(this.matchedIds);
              this.dataSource.paginator = this.paginator;
              this.dataSource.sort = this.sort;

              this.sumOfTotals = 0;
              for (let i = 0; i < this.matchedIds.length; i++) {
                this.sumOfTotals =
                  this.sumOfTotals + parseFloat(this.matchedIds[i].total);
                this.groupMasterForm.controls['total'].setValue(
                  this.sumOfTotals
                );
                this.updateMaster();
              }
            }
          },
          error: (err) => {
            // console.log("fetch items data err: ", err);
            // alert("خطا اثناء جلب العناصر !");
          },
        });
    }
  }

  editMasterForm(row: any) {
    console.log(row);

    let tabGroup = this.matgroup;
    tabGroup.selectedIndex = 1;

    this.autoNo = '';
    this.editData = row;
    this.editDataDetails = '';
    this.groupDetailsForm.reset();

    this.itemCtrl.setValue('');
    this.groupDetailsForm.controls['state'].setValue(this.stateDefaultValue);
    this.groupDetailsForm.controls['qty'].setValue(1);

    console.log('master edit form: ', this.editData);

    this.isEdit = true;
    console.log('master edit form: ', this.editData);
    this.actionBtnMaster = 'Update';
    this.groupMasterForm.controls['no'].setValue(this.editData.no);
    this.groupDetailsForm.controls['itemId'].setValue(this.editDataDetails.itemId);
    this.employeeCtrl.setValue(this.editDataDetails.employeeName);
    this.groupMasterForm.controls['employeeId'].setValue(this.editData.employeeId);
    this.groupMasterForm.controls['employeeName'].setValue(this.editData.employeeName);

    this.groupMasterForm.controls['costCenterName'].setValue(this.editData.costCenterName);
    this.groupMasterForm.controls['costCenterId'].setValue(this.editData.costCenterId);

    // alert("facialId before: "+ this.editData.fiscalYearId)
    this.groupMasterForm.controls['fiscalYearId'].setValue(this.editData.fiscalYearId);
    this.groupMasterForm.controls['date'].setValue(this.editData.date);
    this.groupMasterForm.controls['total'].setValue(this.editData.total);

    this.groupMasterForm.addControl('id',new FormControl('', Validators.required));
    this.groupMasterForm.controls['id'].setValue(this.editData.id);
    this.isEditDataReadOnly = true;
    this.getAllDetailsForms();
  }


  async addNewDetails() {
    if (!this.getMasterRowId) {
      this.getMasterRowId = {
        id: this.editData.id,
      };
    }
    console.log('masterrow', this.getMasterRowId);
    if (!this.editDataDetails) {
      if (this.getMasterRowId) {
        if (this.groupDetailsForm.getRawValue().itemId) {
          this.itemName = await this.getItemByID(
            this.groupDetailsForm.getRawValue().itemId
          );
          console.log(this.itemName);
          this.groupDetailsForm.controls['itemName'].setValue(this.itemName);
          this.groupDetailsForm.controls['transactionUserId'].setValue(
            localStorage.getItem('transactionUserId')
          );
          // this.groupDetailsForm.controls['destStoreUserId'].setValue(localStorage.getItem('transactionUserId'));
        }
        this.groupDetailsForm.controls['state'].setValue(
          this.groupDetailsForm.getRawValue().state
        );

        // this.groupDetailsForm.controls['stR_WithdrawId'].setValue(
        //   parseInt(this.getMasterRowId.id)
        // );

        this.groupDetailsForm.controls['total'].setValue(
          parseFloat(this.groupDetailsForm.getRawValue().price) *
          parseFloat(this.groupDetailsForm.getRawValue().qty)
        );

        this.groupDetailsForm.controls['custodyId'].setValue(
          this.getMasterRowId.id
        );

        // this.groupDetailsForm.removeControl('id');

        console.log('form details after item: ', this.groupDetailsForm.value);

        if (this.groupDetailsForm.valid) {
          console.log('form details after item: ', this.groupDetailsForm.value);

          this.api
            .postStrEmployeeOpenDetails(this.groupDetailsForm.value)
            .subscribe({
              next: (res) => {
                this.toastrSuccess();
                this.groupDetailsForm.reset();
                // this.updateDetailsForm();
                this.getAllDetailsForms();
                this.employeeCtrl.setValue('');
                this.itemByFullCodeValue = '';

                this.costcenterCtrl.setValue('');

                // alert("autoNo: " + this.autoNo + " no control: " + this.groupMasterForm.getRawValue().no)
                this.autoNo = this.groupMasterForm.getRawValue().no;

                console.log(this.getMasterRowId);

                this.api
                  .getStrEmployeeOpenDetailsByMasterId(this.getMasterRowId.id)
                  .subscribe({
                    next: (res) => {
                      // this.itemsList = res;
                      // this.matchedIds = res[1].strEmployeeOpeningCustodyDetailsGetVM;

                      console.log(res);

                      this.dataSource = new MatTableDataSource(res);
                      this.dataSource.paginator = this.paginator;
                      this.dataSource.sort = this.sort;
                    },
                    error: (err) => {
                      // console.log("fetch items data err: ", err);
                      // alert("خطا اثناء جلب العناصر !");
                    },
                  });
              },
              error: (err) => {
                // alert("حدث خطأ أثناء إضافة مجموعة")
                console.log('post err: ', err);
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

  editDetailsForm(row: any) {
    this.editDataDetails = row;
    console.log("editData DETAILS: ", this.editDataDetails);
    this.groupDetailsForm.controls['custodyId'].setValue(this.editDataDetails.custodyId);
    this.groupDetailsForm.controls['itemId'].setValue(this.editDataDetails.itemId);
    this.itemCtrl.setValue(this.editDataDetails.itemName);
    this.groupDetailsForm.controls['itemName'].setValue(this.editDataDetails.itemName);
    this.groupDetailsForm.controls['description'].setValue(this.editDataDetails.description);
    this.groupDetailsForm.controls['notes'].setValue(this.editDataDetails.notes);
    this.groupDetailsForm.controls['percentage'].setValue(this.editDataDetails.percentage);
    this.groupDetailsForm.controls['price'].setValue(this.editDataDetails.price);
    this.groupDetailsForm.controls['qty'].setValue(this.editDataDetails.qty);
    this.groupDetailsForm.controls['state'].setValue(this.editDataDetails.state);
    this.groupDetailsForm.controls['total'].setValue(this.editDataDetails.total);
    this.groupDetailsForm.controls['transactionUserId'].setValue(this.editDataDetails.transactionUserId);
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
  async updateDetailsForm() { 
    this.groupDetailsForm.addControl(
      'id',
      new FormControl('', Validators.required)
    );
    if (this.editDataDetails) {
      this.groupDetailsForm.controls['id'].setValue(this.editDataDetails.id);
      console.log('data item Name in edit: ', this.groupDetailsForm.value);
      
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
      this.api.putStrEmployeeOpenDetail(this.groupDetailsForm.value).subscribe({
        next: (res) => {
          this.groupDetailsForm.reset();
          this.getAllDetailsForms();
          this.itemCtrl.setValue('');
          this.itemByFullCodeValue = '';

          // this.getDetailedRowData = '';

          this.editDataDetails = '';
          // alert('تم التعديل بنجاح');
          this.groupDetailsForm.controls['state'].setValue(
            this.stateDefaultValue
          );
          this.autoNo = this.groupMasterForm.getRawValue().no;
        },
        error: (err) => {
          console.log('update err: ', err);
          // alert("خطأ أثناء تحديث سجل المجموعة !!")
        },
      });
      this.groupDetailsForm.removeControl('id');

    }
  }
  toastrSuccess(): void {
    this.toastr.success('تم الحفظ بنجاح');
  }
}
