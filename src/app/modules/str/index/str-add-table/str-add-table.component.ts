import { PrintDialogComponent } from './../print-dialog/print-dialog.component';
import { Component, Inject, LOCALE_ID, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { formatDate } from '@angular/common';
import { STRAddDialogComponent } from '../str-add-dialog/str-add-dialog.component';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { GlobalService } from 'src/app/pages/services/global.service';
import { ToastrService } from 'ngx-toastr';
import { Observable, debounceTime, map, startWith, tap } from 'rxjs';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { HotkeysService } from 'angular2-hotkeys';
import { Hotkey } from 'angular2-hotkeys';
import { PagesEnums } from 'src/app/core/enums/pages.enum';
import jwt_decode from 'jwt-decode';

import {
  FormControl,
  FormControlName,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatTabGroup } from '@angular/material/tabs';


interface StrAddGetAllByUserId {
  no: any;
  storeName: any;
  sourceStoreName: any;
  sellerName: any;
  employeeName: any;
  fiscalyear: any;
  date: any;
  receiptName: any;
  typeName: any;
  Action: any;
}

export class item {
  constructor(public id: number, public name: string) { }
}

export class Employee {
  constructor(public id: number, public name: string, public code: string) { }
}

// export class costcenter {
//   constructor(public id: number, public name: string) { }
// }

export class store {
  constructor(public id: number, public name: string) { }
}

export class Seller {
  constructor(public id: number, public name: string) { }
}
// export class Employee {
//   constructor(public id: number, public name: string) { }
// }
export interface Source {
  name: string
}
export class List {
  constructor(public id: number, public name: string) { }
}
// export class Item {
//   constructor(public id: number, public name: string) { }
// }

export class AddType {
  constructor(public id: number, public name: string, public source: any) { }
}

export class ApprovalStatus {
  constructor(public id: number, public name: string) { }
}

export class Commodity {
  constructor(public id: number, public name: string) { }
}

@Component({
  selector: 'app-str-add-table',
  templateUrl: './str-add-table.component.html',
  styleUrls: ['./str-add-table.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
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
  // employeeList: any;
  sellerList: any;
  storeName: any;
  sourceStoreName: any;
  sellerName: any;
  receiptName: any;
  employeeName: any;
  TypeName: any;
  // dataSource2!: MatTableDataSource<any>;

  dataSourcePendingWithdraws!: MatTableDataSource<any>;
  pdfurl = '';

  groupMasterSearchForm!: FormGroup;
  groupMasterForm!: FormGroup;

  loading: boolean = false;
  // costcentersList: costcenter[] = [];
  // costcenterCtrl: FormControl<any>;
  // filteredcostcenter: Observable<costcenter[]>;
  // selectedcostcenter: costcenter | undefined;

  employeeList: Employee[] = [];
  employeeCtrl: FormControl<any>;
  filteredEmployee: Observable<Employee[]>;
  selectedEmployee: Employee | undefined;

  itemsList: item[] = [];
  itemCtrl: FormControl;
  filtereditem: Observable<item[]>;
  selecteditem: item | undefined;


  selectedReportName: string | undefined;
  // storeList: store[] = [];
  storeList: any;
  storeCtrl: FormControl;
  filteredstore: Observable<store[]>;
  selectedstore: store | undefined;


  listCtrl: FormControl;
  filteredList: Observable<List[]>;
  lists: List[] = [];
  selectedList: List | undefined;

  // itemCtrl: FormControl;
  // filteredItem: Observable<Item[]>;
  // items: Item[] = [];
  // selectedItem: Item | undefined;

  addTypeCtrl: FormControl;
  filteredAddType: Observable<AddType[]>;
  addTypeList: AddType[] = [];
  selectedAddType: AddType | undefined;

  approvalStatusCtrl: FormControl;
  filteredApprovalStatus: Observable<ApprovalStatus[]>;
  approvalStatusList: ApprovalStatus[] = [];
  selectedApprovalStatus: ApprovalStatus | undefined;

  commodityCtrl: FormControl;
  filteredCommodity: Observable<Commodity[]>;
  commoditiesList: Commodity[] = [];
  selectedCommodity: Commodity | undefined;

  decodedToken: any;
  decodedToken2: any;

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

  pageIndex: any;
  length: any;
  pageSize: any;
  currentPage: any;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  dataSource2: MatTableDataSource<STRAddTableComponent> = new MatTableDataSource();
  isLoading = false;
  totalRows = 0;
  serachFlag: boolean = false;

  userRoleStoresAcc = PagesEnums.STORES_ACCOUNTS;


  sourceSelected: any;
  addTypeSource: any;
  actionName: string = "choose";
  editData: any;
  fiscalYearSelectedId: any;
  isEdit: boolean = false;
  autoNo: any;
  storeSelectedId: any;
  MasterGroupInfoEntered = false;
  sumOfTotals = 0;
  getMasterRowId: any;
  userIdFromStorage = localStorage.getItem('transactionUserId');
  defaultStoreSelectValue: any;
  defaultFiscalYearSelectValue: any;
  actionBtnMaster: string = "Save";

  @ViewChild("matgroup", { static: false })
  matgroup!: MatTabGroup;

  constructor(
    private api: ApiService,
    private global: GlobalService,
    private hotkeysService: HotkeysService,
    private dialog: MatDialog, private toastr: ToastrService,
    private cdr: ChangeDetectorRef,
    private http: HttpClient,
    private router: Router,
    @Inject(LOCALE_ID) private locale: string,
    private formBuilder: FormBuilder
  ) {



    // this.costcenterCtrl = new FormControl();
    // this.filteredcostcenter = this.costcenterCtrl.valueChanges.pipe(
    //   startWith(''),
    //   map((value) => this._filtercostcenters(value))
    // );

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
    global.getPermissionUserRoles('Store', 'str-home', 'إدارة المخازن وحسابات المخازن ', 'store');

    this.listCtrl = new FormControl();
    this.filteredList = this.listCtrl.valueChanges.pipe(
      startWith(''),
      debounceTime(300), // Adjust the debounce time (in milliseconds) to your preference
      map(value => this._filterLists(value))
    );

    // this.itemCtrl = new FormControl();
    // this.filteredItem = this.itemCtrl.valueChanges.pipe(
    //   startWith(''),
    //   map(value => this._filterItems(value))
    // );

    this.addTypeCtrl = new FormControl();
    this.filteredAddType = this.addTypeCtrl.valueChanges.pipe(
      startWith(''),
      map(value => this._filterAddType(value))
    );

    this.approvalStatusCtrl = new FormControl();
    this.filteredApprovalStatus = this.approvalStatusCtrl.valueChanges.pipe(
      startWith(''),
      map(value => this._filterApprovalStatus(value))
    );

    this.commodityCtrl = new FormControl();
    this.filteredCommodity = this.commodityCtrl.valueChanges.pipe(
      startWith(''),
      map(value => this._filterCommodity(value))
    );

  }

  ngOnInit(): void {
    const accessToken: any = localStorage.getItem('accessToken');
    // console.log('accessToken', accessToken);
    // Decode the access token
    this.decodedToken = jwt_decode(accessToken);
    this.decodedToken2 = this.decodedToken.roles;
    console.log('accessToken2', this.decodedToken2);

    this.selectedReportName = "STRWithdrawReport";

    this.getAllMasterForms();
    this.getFiscalYears();
    // this.getCostCenters();

    this.getStores();
    this.getTypes();
    this.getSellers();
    this.getReciepts();
    this.getEmployees();
    this.getItems();

    this.groupMasterSearchForm = this.formBuilder.group({
      no: [''],
      EntryNo: [''],
      employee: [''],
      // costcenter: [''],
      // :[''],
      //  costcentersList:[''],
      // costCenterId: [''],
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
      report: ['STRWithdrawReport'],
      reportType: ['']
    });

    this.groupMasterForm = this.formBuilder.group({
      no: ['', Validators.required],
      storeId: ['', Validators.required],
      storeName: ['', Validators.required],
      transactionUserId: ['', Validators.required],
      date: ['', Validators.required],
      total: ['', Validators.required],
      fiscalYearId: ['', Validators.required],

      sellerId: [''],
      // sellerName: [''],
      employeeId: [''],
      // employeeName: [''],
      sourceStoreId: [''],
      // sourceStoreName: [''],

      addTypeId: [''],
      entryNo: ['0'],
      approvalStatusId: ['0'],
      commodityId: ['0']

    });

    this.groupDetailsForm = this.formBuilder.group({
      addId: ['', Validators.required], //MasterId
      qty: ['1', Validators.required],
      price: ['', Validators.required],
      total: ['', Validators.required],
      transactionUserId: ['', Validators.required],
      itemId: ['', Validators.required],

      itemName: ['', Validators.required],
      avgPrice: [''],
      balanceQty: ['', Validators.required],
      percentage: [''],

      state: ['', Validators.required],


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

  tabSelected(tab: any) {
    console.log("tab selected: ", tab);
    if (tab.index == 0) {
      //   console.log("done: ", tab);

      //   // this.editData = '';
      //   // this.MasterGroupInfoEntered = false;
      //   // this.groupMasterSearchForm.controls['no'].setValue('');
      //   // this.listCtrl.setValue('');
      //   // this.costcenterCtrl.setValue('');
      //   // this.storeCtrl.setValue('');
      //   // // this.groupMasterSearchForm.controls['date'].setValue(this.currentDate);
      //   // // this.lists = [];

      this.getAllMasterForms();

    }
  }

  getAllMasterForms() {
    if (!this.currentPage && this.serachFlag == false) {
      this.currentPage = 0;
      this.pageSize = 5;

      this.isLoading = true;
      console.log("first time: ");


      fetch(this.api.getStrAddPaginateByUserId(localStorage.getItem('transactionUserId'), this.currentPage, this.pageSize))
        .then(response => response.json())
        .then(data => {
          // this.totalRows = data.length;
          console.log("master data paginate first Time: ", data);
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
        }, error => {
          console.log(error);
          this.isLoading = false;
        });
    }
    else {
      if (this.serachFlag == false) {
        this.isLoading = true;
        console.log("second time: ");

        fetch(this.api.getStrAddPaginateByUserId(localStorage.getItem('transactionUserId'), this.currentPage, this.pageSize))
          .then(response => response.json())
          .then(data => {
            // this.totalRows = data.length;
            console.log("master data paginate: ", data);
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
          }, error => {
            console.log(error);
            this.isLoading = false;
          });
      }
      else {
        console.log("search next paginate");
        this.getSearchStrAdd(this.groupMasterSearchForm.getRawValue().no, this.groupMasterSearchForm.getRawValue().EntryNo, this.groupMasterSearchForm.getRawValue().StartDate, this.groupMasterSearchForm.getRawValue().EndDate, this.groupMasterSearchForm.getRawValue().fiscalYear)
      }

    }

  }

  pageChanged(event: PageEvent) {
    console.log("page event: ", event);
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    // this.currentPage = event.previousPageIndex;
    this.getAllMasterForms();
  }

  openAddDialog() {
    // this.dialog
    //   .open(STRAddDialogComponent, {
    //     width: '60%',
    //     height: '79%',
    //   })
    //   .afterClosed()
    //   .subscribe((val) => {
    //     if (val === 'save') {
    //       this.getAllMasterForms();
    //     }
    //   });

    // this.editData = '';

    let tabGroup = this.matgroup;
    tabGroup.selectedIndex = 1;

    this.autoNo = '';
    this.editData = '';
    this.MasterGroupInfoEntered = false;

    this.getStrApprovalStatus();
    this.getStrCommodity();
    this.getStrAddType();
    this.getStores();
    this.getItems();
    this.getTypes();
    this.getSellers();
    this.getReciepts();
    this.getEmployees();
    // this.getStrAddAutoNo();

    this.getFiscalYears();

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

    let tabGroup = this.matgroup;
    tabGroup.selectedIndex = 1;

    this.autoNo = '';
    this.editData = row;
    // this.editDataDetails = '';

    console.log('master edit form: ', this.editData);

    this.isEdit = true;

    // this.getListCtrl(this.groupMasterForm.getRawValue().addTypeId);

    console.log("master edit form: ", this.editData);
    this.actionBtnMaster = "Update";

    this.groupMasterForm.controls['transactionUserId'].setValue(this.userIdFromStorage);

    this.groupMasterForm.controls['no'].setValue(this.editData.no);
    this.groupMasterForm.controls['storeId'].setValue(this.editData.storeId);

    this.groupMasterForm.controls['fiscalYearId'].setValue(this.editData.fiscalYearId);

    this.groupMasterForm.controls['date'].setValue(this.editData.date);
    this.groupMasterForm.controls['total'].setValue(this.editData.total);
    this.groupMasterForm.controls['addTypeId'].setValue(this.editData.addTypeId);

    console.log("edit dataaaaaaaaaaaaaaa: ", this.editData);
    if (this.editData.addTypeName == 'اذن صرف') {
      this.actionName = "str";
      console.log("action btnnnnnnnnnnnnn", this.actionName)
      // this.groupMasterForm.controls['addTypeId'].setValue('المخزن');
      this.groupMasterForm.controls['entryNo'].disable();


    }
    else if (this.editData.addTypeName == 'فاتورة') {
      this.actionName = "choose";
      console.log("action btnnnnnnnnnnnnn 3", this.actionName);

      // this.groupMasterForm.controls['addTypeId'].setValue('المورد');
      this.groupMasterForm.controls['entryNo'].enable();
      this.groupMasterForm.controls['entryNo'].setValue(this.editData.entryNo);
    }
    else if (this.editData.addTypeName == 'اذن ارتجاع' || 'الموظف') {
      this.actionName = "emp";
      console.log("action btnnnnnnnnnnnnn 2", this.actionName);
      // this.groupMasterForm.controls['addTypeId'].setValue('الموظف')
      this.groupMasterForm.controls['entryNo'].disable();


    } else {
      this.actionName = "choose";
      console.log("action btnnnnnnnnnnnnn 3", this.actionName);

      // this.groupMasterForm.controls['addTypeId'].setValue('المورد');
      // this.groupMasterForm.controls['entryNo'].enable();
      // this.groupMasterForm.controls['entryNo'].setValue(this.editData.entryNo);
      this.groupMasterForm.controls['entryNo'].disable();


    }

    // this.groupMasterForm.controls['addReceiptId'].setValue(this.editData.addReceiptId);

    this.groupMasterForm.controls['sellerId'].setValue(this.editData.sellerId);
    this.groupMasterForm.controls['sourceStoreId'].setValue(this.editData.sourceStoreId);
    this.groupMasterForm.controls['employeeId'].setValue(this.editData.employeeId);

    this.groupMasterForm.controls['commodityId'].setValue(this.editData.commodityId);
    this.groupMasterForm.controls['approvalStatusId'].setValue(this.editData.approvalStatusId);

    this.groupMasterForm.addControl('id', new FormControl('', Validators.required));
    this.groupMasterForm.controls['id'].setValue(this.editData.id);

  }

  deleteBothForms(id: number) {
    var result = confirm('تاكيد الحذف ؟ ');

    if (result) {
      this.api.deleteStrAdd(id).subscribe({
        next: (res) => {

          this.api.getStrAddDetails()
            .subscribe({
              next: (res) => {

                this.matchedIds = res.filter((a: any) => {
                  // console.log("matched Id & HeaderId : ", a.HeaderId === id)
                  return a.addId === id;
                });

                for (let i = 0; i < this.matchedIds.length; i++) {
                  this.deleteFormDetails(this.matchedIds[i].id);
                }

              },
              error: (err) => {
                // alert('خطا اثناء تحديد المجموعة !!');

              }
            })

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
    this.api.getFiscalYears()
      .subscribe({
        next: async (res) => {
          this.fiscalYearsList = res;

          this.api.getLastFiscalYear()
            .subscribe({
              next: async (res) => {

                this.defaultFiscalYearSelectValue = await res;

                if (this.editData) {
                  this.groupMasterForm.controls['fiscalYearId'].setValue(this.editData.fiscalYearId);
                }
                else {
                  this.groupMasterForm.controls['fiscalYearId'].setValue(this.defaultFiscalYearSelectValue.id);
                  this.getStrOpenAutoNo();
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

  // getStores() {
  //   // this.userRoles = localStorage.getItem('userRoles');
  //   this.userRoles = this.decodedToken2;
  //   console.log('userRoles manager: ', this.userRoles.includes(this.userRoleStoresAcc))

  //   if (this.userRoles.includes(this.userRoleStoresAcc)) {
  //     this.api.getStore().subscribe({
  //       next: (res) => {
  //         this.storeList = res;
  //         console.log("stores res: ", this.storeList);
  //       },
  //       error: (err) => {
  //         // console.log("fetch store data err: ", err);
  //         // alert('خطا اثناء جلب المخازن !');
  //       },
  //     });
  //   }
  //   else {
  //     console.log('userRoles stores by userID: ', localStorage.getItem('transactionUserId'))
  //     this.api.getUserStores(localStorage.getItem('transactionUserId'))
  //       .subscribe({
  //         next: async (res) => {
  //           this.storeList = res;
  //           console.log("user stores res: ", this.storeList);
  //         },
  //         error: (err) => {
  //           console.log("fetch userStore data err: ", err);
  //           // alert(" خطا اثناء جلب مخازن المستخدم !");
  //         }
  //       })
  //   }

  // }

  async getStores() {
    this.userRoles = this.decodedToken2;
    console.log('userRoles: ', this.userRoles.includes(this.userRoleStoresAcc))

    if (this.userRoles.includes(this.userRoleStoresAcc)) {
      // console.log('user is manager -all stores available- , role: ', userRoles);

      this.api.getStore()
        .subscribe({
          next: async (res) => {
            this.storeList = res;
            this.defaultStoreSelectValue = await res[Object.keys(res)[0]];

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

            if (this.editData) {
              this.groupMasterForm.controls['storeId'].setValue(this.editData.storeId);
            }
            else {
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

  getItems() {
    this.api.getItem().subscribe({
      next: (res) => {
        this.itemsList = res;
        this.cdr.detectChanges(); // Trigger change detection
        console.log("itemss res: ", this.itemsList);
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
        this.cdr.detectChanges(); // Trigger change detection
        console.log("employeeeeeeeeee res: ", this.storeList);
      },
      error: (err) => {
        // console.log("fetch store data err: ", err);
        // alert("خطا اثناء جلب المخازن !");
      },
    });
  }


  displayEmployeeName(employee: any): string {
    return employee && employee.name ? employee.name : '';
  }
  employeeSelected(event: MatAutocompleteSelectedEvent): void {
    const employee = event.option.value as Employee;
    console.log('employee selected: ', employee);
    this.selectedEmployee = employee;
    this.groupMasterSearchForm.patchValue({ employeeId: employee.id });
    console.log(
      'employee in form: ',
      this.groupMasterSearchForm.getRawValue().employeeId
    );

    // this.getSearchStrWithdraw()
    // this.set_store_Null(this.groupMasterSearchForm.getRawValue().employeeId);
    // return     this.groupMasterSearchForm.patchValue({ employeeId: employee.id });
  }
  private _filteremployees(value: string): Employee[] {
    const filterValue = value;
    return this.employeeList.filter((employee) =>
      employee.name.toLowerCase().includes(filterValue)
    );
  }
  openAutoEmployee() {
    this.employeeCtrl.setValue(''); // Clear the input field value

    // Open the autocomplete dropdown by triggering the value change event
    this.employeeCtrl.updateValueAndValidity();
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

    // this.groupDetailsForm.patchValue({ itemId: item.id });
    this.groupDetailsForm.patchValue({ itemName: item.name });

    this.api.getAvgPrice(
      this.groupMasterForm.getRawValue().storeId,
      this.groupMasterForm.getRawValue().fiscalYearId,
      formatDate(this.groupMasterForm.getRawValue().date, 'yyyy-MM-dd', this.locale),
      this.groupDetailsForm.getRawValue().itemId
    )
      .subscribe({
        next: (res) => {
          // this.priceCalled = res;
          this.groupDetailsForm.controls['avgPrice'].setValue(res);
          this.groupDetailsForm.controls['price'].setValue(res)
          console.log("price avg called res: ", this.groupDetailsForm.getRawValue().avgPrice);
        },
        error: (err) => {
          // console.log("fetch fiscalYears data err: ", err);
          // alert("خطا اثناء جلب متوسط السعر !");
        }
      })


    this.api.getSumQuantity(
      this.groupMasterForm.getRawValue().storeId,
      this.groupDetailsForm.getRawValue().itemId,
    )
      .subscribe({
        next: (res) => {
          // this.priceCalled = res;
          this.groupDetailsForm.controls['balanceQty'].setValue(res);
          console.log("balanceQty called res: ", this.groupDetailsForm.getRawValue().balanceQty);
        },
        error: (err) => {
          // console.log("fetch fiscalYears data err: ", err);
          alert("خطا اثناء جلب الرصيد الحالى  !");
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


  displaystoreName(store: any): string {
    return store && store.name ? store.name : '';
  }
  storeSelected(event: MatAutocompleteSelectedEvent): void {
    const store = event.option.value as store;
    console.log('store selected: ', store);
    this.selectedstore = store;
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


  // displayItemName(item: any): string {
  //   return item && item.name ? item.name : '';
  // }
  // itemSelected(event: MatAutocompleteSelectedEvent): void {
  //   const item = event.option.value as Item;
  //   this.selectedItem = item;
  //   this.groupDetailsForm.patchValue({ itemId: item.id });
  //   this.groupDetailsForm.patchValue({ itemName: item.name });

  //   this.api.getAvgPrice(
  //     this.groupMasterForm.getRawValue().storeId,
  //     this.groupMasterForm.getRawValue().fiscalYearId,
  //     formatDate(this.groupMasterForm.getRawValue().date, 'yyyy-MM-dd', this.locale),
  //     this.groupDetailsForm.getRawValue().itemId
  //   )
  //     .subscribe({
  //       next: (res) => {
  //         // this.priceCalled = res;
  //         this.groupDetailsForm.controls['avgPrice'].setValue(res);
  //         this.groupDetailsForm.controls['price'].setValue(res)
  //         console.log("price avg called res: ", this.groupDetailsForm.getRawValue().avgPrice);
  //       },
  //       error: (err) => {
  //         // console.log("fetch fiscalYears data err: ", err);
  //         // alert("خطا اثناء جلب متوسط السعر !");
  //       }
  //     })


  //   this.api.getSumQuantity(
  //     this.groupMasterForm.getRawValue().storeId,
  //     this.groupDetailsForm.getRawValue().itemId,
  //   )
  //     .subscribe({
  //       next: (res) => {
  //         // this.priceCalled = res;
  //         this.groupDetailsForm.controls['balanceQty'].setValue(res);
  //         console.log("balanceQty called res: ", this.groupDetailsForm.getRawValue().balanceQty);
  //       },
  //       error: (err) => {
  //         // console.log("fetch fiscalYears data err: ", err);
  //         alert("خطا اثناء جلب الرصيد الحالى  !");
  //       }
  //     })


  // }
  // private _filterItems(value: string): Item[] {
  //   const filterValue = value;
  //   return this.items.filter(item =>
  //     item.name.toLowerCase().includes(filterValue)
  //   );
  // }
  // openAutoTem() {
  //   this.itemCtrl.setValue(''); // Clear the input field value

  //   // Open the autocomplete dropdown by triggering the value change event
  //   this.itemCtrl.updateValueAndValidity();
  // }


  displayListName(list: any): string {
    return list && list.name ? list.name : '';
  }
  listSelected(event: MatAutocompleteSelectedEvent): void {
    const list = event.option.value as List;
    this.selectedList = list;
    console.log("list: ", list, "sourceSelected: ", this.sourceSelected.source);

    if (this.sourceSelected.source == "المورد" || this.sourceSelected.source == "شهادة ادارية") {
      this.groupMasterForm.patchValue({ sellerId: list.id });
      // this.groupMasterForm.patchValue({ sellerName: list.name });
    }
    else if (this.sourceSelected.source == "الموظف") {
      this.groupMasterForm.patchValue({ employeeId: list.id });
      // this.groupMasterForm.patchValue({ employeeName: list.name });

    } else {
      this.groupMasterForm.patchValue({ sourceStoreId: list.id });
      // this.groupMasterForm.patchValue({ sourceStoreName: list.name });

    }


  }
  private _filterLists(value: string): List[] {
    console.log("filterValue: ", value);
    const filterValue = value;
    return this.lists.filter(list =>
      list.name.toLowerCase().includes(filterValue)
    );
  }
  openAutoList() {
    this.listCtrl.setValue(''); // Clear the input field value

    // Open the autocomplete dropdown by triggering the value change event
    this.listCtrl.updateValueAndValidity();
  }


  displayAddTypeName(addType: any): string {
    return addType && addType.name ? addType.name : '';
  }
  AddTypeSelected(event: MatAutocompleteSelectedEvent): void {
    const addType = event.option.value as AddType;
    this.groupMasterForm.patchValue({ addTypeId: addType.id });
    this.addTypeSource = addType.source;
    console.log("addType selected: ", addType);
    this.getListCtrl(addType);

  }
  private _filterAddType(value: string): AddType[] {
    const filterValue = value;
    return this.addTypeList.filter(addType =>
      addType.name.toLowerCase().includes(filterValue)
    );
  }
  openAutoAddType() {
    this.addTypeCtrl.setValue(''); // Clear the input field value

    // Open the autocomplete dropdown by triggering the value change event
    this.addTypeCtrl.updateValueAndValidity();
  }


  displayApprovalStatusName(approvalStatus: any): string {
    return approvalStatus && approvalStatus.name ? approvalStatus.name : '';
  }
  ApprovalStatusSelected(event: MatAutocompleteSelectedEvent): void {
    const approvalStatus = event.option.value as ApprovalStatus;
    this.groupMasterForm.patchValue({ approvalStatusId: approvalStatus.id });

  }
  private _filterApprovalStatus(value: string): ApprovalStatus[] {
    const filterValue = value;
    return this.approvalStatusList.filter(approvalStatus =>
      approvalStatus.name.toLowerCase().includes(filterValue)
    );
  }
  openAutoApprovalStatus() {
    this.approvalStatusCtrl.setValue(''); // Clear the input field value

    // Open the autocomplete dropdown by triggering the value change event
    this.approvalStatusCtrl.updateValueAndValidity();
  }


  displayCommodityName(commodity: any): string {
    return commodity && commodity.name ? commodity.name : '';
  }
  CommoditySelected(event: MatAutocompleteSelectedEvent): void {
    const commodity = event.option.value as Commodity;
    this.groupMasterForm.patchValue({ commodityId: commodity.id });

  }
  private _filterCommodity(value: string): Commodity[] {
    const filterValue = value;
    return this.commoditiesList.filter(commodity =>
      commodity.name.toLowerCase().includes(filterValue)
    );
  }
  openAutoCommodity() {
    this.commodityCtrl.setValue(''); // Clear the input field value

    // Open the autocomplete dropdown by triggering the value change event
    this.commodityCtrl.updateValueAndValidity();
  }


  getListCtrl(type: any) {
    console.log("addType obj: ", type);
    this.sourceSelected = type;

    if (type.source == "المورد" || type.source == "شهادة ادارية") {

      this.api.getAllSellers().subscribe((lists) => {
        this.lists = lists;
        this.groupMasterForm.controls['sourceStoreId'].setValue(null);
        // this.groupMasterForm.controls['sourceStoreName'].setValue(null);
        this.groupMasterForm.controls['employeeId'].setValue(null);
        this.actionName = "choose";

        this.groupMasterForm.controls['entryNo'].enable();

      });
    }
    else if (type.source == "الموظف") {

      // this.api.getEmployee().subscribe((lists) => {
      //   this.lists = lists;
      //   console.log("employees selected list: ", lists);
      //   this.groupMasterForm.controls['sourceStoreId'].setValue(null);
      //   // this.groupMasterForm.controls['sourceStoreName'].setValue(null);
      //   this.groupMasterForm.controls['sellerId'].setValue(null);
      //   this.actionName = "emp";
      //   this.groupMasterForm.controls['entryNo'].disable();


      // });
      this.getQuickEmployees();
    }

    else {

      this.api.getAllStore().subscribe((lists) => {
        this.lists = lists;
        this.groupMasterForm.controls['sellerId'].setValue(null);
        // this.groupMasterForm.controls['sellerName'].setValue(null);
        this.groupMasterForm.controls['employeeId'].setValue(null);
        this.actionName = "str";
        this.groupMasterForm.controls['entryNo'].disable();
      });
    }


  }

  getQuickEmployees() {
    this.loading = true;
    this.api.getEmployee().subscribe({
      next: (res) => {
        this.loading = false;

        this.lists = res;
        console.log("employees selected list: ", this.lists);
        this.groupMasterForm.controls['sourceStoreId'].setValue(null);
        // this.groupMasterForm.controls['sourceStoreName'].setValue(null);
        this.groupMasterForm.controls['sellerId'].setValue(null);
        this.actionName = "emp";
        this.groupMasterForm.controls['entryNo'].disable();

        this.cdr.detectChanges(); // Trigger change detection
      },
      error: (err) => {
        this.loading = false;
        // console.log("fetch store data err: ", err);
        // alert('خطا اثناء جلب العناصر !');
      },
    });
  }

  getStrAddType() {
    this.api.getType()
      .subscribe({
        next: (res) => {
          this.addTypeList = res;
        },
        error: (err) => {
          // console.log("fetch fiscalYears data err: ", err);
          // alert("خطا اثناء جلب العناصر !");
        }
      })
  }

  getStrApprovalStatus() {
    this.api.getStrApprovalStatus()
      .subscribe({
        next: (res) => {
          this.approvalStatusList = res;
        },
        error: (err) => {
          // console.log("fetch fiscalYears data err: ", err);
          // alert("خطا اثناء جلب العناصر !");
        }
      })
  }

  getStrCommodity() {
    this.api.getcommodity()
      .subscribe({
        next: (res) => {
          this.commoditiesList = res;
        },
        error: (err) => {
          // console.log("fetch fiscalYears data err: ", err);
          // alert("خطا اثناء جلب العناصر !");
        }
      })
  }

  getSearchStrAdd(no: any, EntryNo: any, StartDate: any, EndDate: any, fiscalyear: any) {
    console.log('fiscalyear in searchhhhh : ', fiscalyear, 'itemId', "EntryNo: ", EntryNo);
    // let costCenter = this.groupMasterSearchForm.getRawValue().costCenterId;
    let employee = this.groupMasterSearchForm.getRawValue().employeeId;
    let item = this.groupDetailsForm.getRawValue().itemId;
    let store = this.groupMasterSearchForm.getRawValue().storeId;

    this.loading = true;
    this.api.getStrAddSearach(no, EntryNo, fiscalyear, employee, item, store, StartDate, EndDate).subscribe({
      next: (res) => {
        this.loading = false;

        this.totalRows = res.length;
        if (this.serachFlag == false) {
          // this.dataSource.data = data.items;
          this.pageIndex = 0;
          this.pageSize = 5;
          this.length = this.totalRows;
          this.serachFlag = true;
        }

        console.log('master data paginate first Time: ', res);
        this.dataSource2 = new MatTableDataSource(res);
        this.dataSource2.paginator = this.paginator;
        this.dataSource2.sort = this.sort;

      },
      error: (err) => {
        this.loading = false;
        console.log('eroorr', err);
      },
    });
  }

  resetForm() {
    this.groupMasterSearchForm.reset();

    this.itemCtrl.reset();
    this.storeCtrl.reset();
    this.employeeCtrl.reset();

    this.serachFlag = false;

    this.getAllMasterForms();
  }

  // ----------------------------------------------------------------------------------------------

  async fiscalYearValueChanges(fiscalyaerId: any) {
    this.fiscalYearSelectedId = await fiscalyaerId;
    this.groupMasterForm.controls['fiscalYearId'].setValue(this.fiscalYearSelectedId);
    this.isEdit = false;

    this.getStrOpenAutoNo();
  }

  getStrOpenAutoNo() {
    if (this.groupMasterForm) {

      // if (this.editData && !this.fiscalYearSelectedId) {
      //   this.api.getStrAddAutoNo(this.groupMasterForm.getRawValue().storeId, this.editData.fiscalYearId)
      //     .subscribe({
      //       next: (res) => {
      //         this.autoNo = res;
      //         console.log("autoNo: ", this.autoNo);
      //         this.groupMasterForm.controls['no'].setValue(this.autoNo);
      //         return res;
      //       },
      //       error: (err) => {
      //         console.log("fetch autoNo err: ", err);
      //         // alert("خطا اثناء جلب العناصر !");
      //       }
      //     })
      // }

      // else if (this.editData && !this.storeSelectedId) {
      //   this.api.getStrAddAutoNo(this.editData.storeId, this.groupMasterForm.getRawValue().fiscalYearId)
      //     .subscribe({
      //       next: (res) => {
      //         this.autoNo = res;
      //         console.log("autoNo: ", this.autoNo);
      //         this.groupMasterForm.controls['no'].setValue(this.autoNo);

      //         return res;
      //       },
      //       error: (err) => {
      //         console.log("fetch autoNo err: ", err);
      //         // alert("خطا اثناء جلب العناصر !");
      //       }
      //     })
      // }
      // else if (this.editData) {
      //   this.api.getStrAddAutoNo(this.groupMasterForm.getRawValue().storeId, this.groupMasterForm.getRawValue().fiscalYearId)
      //     .subscribe({
      //       next: (res) => {
      //         this.autoNo = res;

      //         console.log("isEdit : ", this.isEdit)

      //         console.log("autoNo: ", this.autoNo);
      //         this.groupMasterForm.controls['no'].setValue(this.autoNo);

      //         return res;
      //       },
      //       error: (err) => {
      //         console.log("fetch autoNo err: ", err);
      //         // alert("خطا اثناء جلب العناصر !");
      //       }
      //     })
      // }
      // else {
      //   this.api.getStrAddAutoNo(this.groupMasterForm.getRawValue().storeId, this.groupMasterForm.getRawValue().fiscalYearId)
      //     .subscribe({
      //       next: (res) => {
      //         this.autoNo = res;
      //         console.log("autoNo: ", this.autoNo);
      //         this.groupMasterForm.controls['no'].setValue(this.autoNo);

      //         return res;
      //       },
      //       error: (err) => {
      //         console.log("fetch autoNo err: ", err);
      //         // alert("خطا اثناء جلب العناصر !");
      //       }
      //     })
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
          .getStrAddAutoNo(
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
          .getStrAddAutoNo(
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
          .getStrAddAutoNo(
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
          .getStrAddAutoNo(
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

  // getStrAddAutoNo() {
  //   this.api.getStrAddAutoNo()
  //     .subscribe({
  //       next: (res) => {
  //         this.autoNo = res;
  //         return res;
  //       },
  //       error: (err) => {
  //         // console.log("fetch fiscalYears data err: ", err);
  //         // alert("خطا اثناء جلب العناصر !");
  //       }
  //     })
  // }

  async nextToAddFormDetails() {
    this.groupMasterForm.removeControl('id')

    // this.storeName = await this.getStoreByID(this.groupMasterForm.getRawValue().storeId);

    // this.groupMasterForm.controls['storeName'].setValue(this.storeName);

    // this.sourceStoreName = await this.getSourceStoreByID(this.groupMasterForm.getRawValue().sourceStoreId);

    // // this.groupMasterForm.controls['sourceStoreName'].setValue(this.sourceStoreName);

    // this.sellerName = await this.getSellerByID(this.groupMasterForm.getRawValue().sellerId);

    // // this.groupMasterForm.controls['sellerName'].setValue(this.sellerName);

    // this.employeeName = await this.getEmployeeByID(this.groupMasterForm.getRawValue().employeeId);

    // // this.groupMasterForm.controls['employeeName'].setValue(this.employeeName);


    this.groupMasterForm.controls['total'].setValue(this.sumOfTotals);
    this.groupMasterForm.controls['transactionUserId'].setValue(this.userIdFromStorage);

    // this.groupMasterForm.controls['fiscalYearId'].setValue(1)

    if (this.groupMasterForm.getRawValue().no == this.autoNo) {
      this.groupMasterForm.controls['no'].setValue(this.autoNo);
    }

    console.log("Master add form : ", this.groupMasterForm.value)

    if (this.groupMasterForm.getRawValue().date && this.groupMasterForm.getRawValue().storeId && this.groupMasterForm.getRawValue().no) {

      this.api.postStrAdd(this.groupMasterForm.value)
        .subscribe({
          next: (res) => {
            // console.log("ID header after post req: ", res);
            this.getMasterRowId = {
              "id": res
            };
            this.MasterGroupInfoEntered = true;

            this.toastrSuccess();
            // this.getAllDetailsForms();
            this.getAllMasterForms();
          },
          error: (err) => {
            console.log("header post err: ", err);
            // alert("حدث خطأ أثناء إضافة مجموعة")
          }
        })
    }

  }

  async updateMaster() {
    this.groupDetailsForm.controls['transactionUserId'].setValue(this.userIdFromStorage);

    console.log("update both: ", this.groupDetailsForm.valid);
    this.api.putStrAdd(this.groupMasterForm.value)
      .subscribe({
        next: (res) => {

          this.groupDetailsForm.reset();

          // this.getDetailedRowData = '';
          this.groupDetailsForm.controls['qty'].setValue(1);


        },

      })

  }

  // ---------------------------------------------------------------------------------------

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


  storeValueChanges(storeId: any) {
    console.log("storeId selected to get pending withdraw: ", storeId);
    // this.groupMasterSearchForm.controls['storeId'].setValue(storeId);

    this.getAllWithDrawByDestStore(storeId);

  }
  downloadPrint(no: any, StartDate: any, EndDate: any, fiscalYear: any, report: any, reportType: any) {
    let costCenter = this.groupMasterSearchForm.getRawValue().costCenterId;
    let employee = this.groupMasterSearchForm.getRawValue().employeeId;
    let item = this.groupDetailsForm.getRawValue().itemId;
    let store = this.groupMasterSearchForm.getRawValue().storeId;

    this.api
      .strAdd(no, store, StartDate, EndDate, fiscalYear, item, employee, costCenter, report, reportType)
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
  previewPrint(no: any, StartDate: any, EndDate: any, fiscalYear: any, report: any, reportType: any) {

    let costCenter = this.groupMasterSearchForm.getRawValue().costCenterId;
    let employee = this.groupMasterSearchForm.getRawValue().employeeId;
    let item = this.groupDetailsForm.getRawValue().itemId;
    let store = this.groupMasterSearchForm.getRawValue().storeId;
    if (report != null && reportType != null) {
      this.loading = true;
      this.api
        .strAdd(no, store, StartDate, EndDate, fiscalYear, item, employee, costCenter, report, reportType)
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


          },
          error: (err) => {
            this.loading = false;
            console.log('eroorr', err);
            window.open(err.url);
          },
        });
    }
    else {
      alert("ادخل التقرير و نوع التقرير!")
    }
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