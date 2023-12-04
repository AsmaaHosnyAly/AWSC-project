// import { distEmployee } from './str-employee-exchange-table.component';
// import { FiscalYear } from './../str-withdraw-dialog2/str-withdraw-dialog2.component';
import { Component, Inject, LOCALE_ID, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from '../../services/api.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { StrEmployeeExchangeDialogComponent } from '../str-employee-exchange-dialog/str-employee-exchange-dialog.component';
import { formatDate } from '@angular/common';
import { Observable, map, startWith, tap, debounceTime } from 'rxjs';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { EmployeeExchangePrintDialogComponent } from '../employee-exchange-print-dialog/employee-exchange-print-dialog.component';
import { HotkeysService } from 'angular2-hotkeys';
import { Hotkey } from 'angular2-hotkeys';
import { MatTabGroup } from '@angular/material/tabs';

import {
  FormControl,
  FormControlName,
  FormBuilder,
  FormGroup,
} from '@angular/forms';

export class Employee {
  constructor(public id: number, public name: string, public code: string) { }
}

export class costcenter {
  constructor(public id: number, public name: string) { }
}

export class distEmployee {
  constructor(public id: number, public name: string, public code: string) { }
}

export class item {
  constructor(public id: number, public name: string, public no: string, public fullCode: string) { }
}

export class Product {
  constructor(public id: number, public name: string, public code: any) { }
}

export class itemPositive {
  constructor(public itemId: number, public name: string, public fullCode: string) { }
}

interface strEmployeeExchange {
  no: any;
  storeName: any;
  employeeName: any;
  distEmployee: any;
  costCenterName: any;
  fiscalyear: any;
  date: any;
  Action: any;
}

interface strEmployeeExchangeDetails {
  itemName: any;
  price: any;
  qty: any;
  total: any;
  action: any;
}

@Component({
  selector: 'app-str-employee-exchange-table',
  templateUrl: './str-employee-exchange-table.component.html',
  styleUrls: ['./str-employee-exchange-table.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StrEmployeeExchangeTableComponent implements OnInit {
  displayedColumns: string[] = [
    'no',
    'fiscalyear',
    'employeeName',
    'destEmployeeName',
    'costCenterName',
    'date',
    'Action',
  ];

  displayedColumnsDetails: string[] = [
    'itemName', 'state', 'price', 'qty', 'total', 'action'
  ];
  matchedIds: any;
  storeList: any;
  storeName: any;
  fiscalYearsList: any;
  // employeesList: any;
  // costCentersList: any;
  groupMasterForm!: FormGroup;
  groupDetailsForm!: FormGroup;
  costcentersList: costcenter[] = [];
  costcenterCtrl: FormControl<any>;
  filteredcostcenter: Observable<costcenter[]>;
  selectedcostcenter: costcenter | undefined;

  loading: boolean = false;

  employeesList: Employee[] = [];
  employeeCtrl: FormControl<any>;
  filteredEmployee: Observable<Employee[]>;
  selectedEmployee: Employee | undefined;

  distEmployeesList: distEmployee[] = [];
  distEmployeeCtrl: FormControl<any>;
  filtereddistEmployee: Observable<distEmployee[]>;
  selecteddistEmployee: distEmployee | undefined;

  itemsList: item[] = [];
  itemCtrl: FormControl;
  filtereditem: Observable<item[]>;
  selecteditem: item | undefined;

  dataSource2!: MatTableDataSource<any>;
  pdfurl = '';




  ///////////////////////////
  editData: any;
  ediDetailsData: any;
  MasterGroupInfoEntered = false;
  groupMasterFormDialog!: FormGroup;
  @ViewChild("matgroup", { static: false })
  matgroup!: MatTabGroup;
  autoNo: any;
  productIdValue: any;
  isReadOnlyPercentage: any = true;
  editDataDetails: any;
  // l
  actionName: string = 'choose';
  actionBtnMaster: string = 'Save';
  employeeName: any;
  distEmployee: any;
  isEditDataReadOnly: boolean = true;
  getDetailedRowData: any;
  sumOfTotals = 0;
  userIdFromStorage = localStorage.getItem('transactionUserId');
  getMasterRowId: any;
  itemName: any;
  getDetailsRowId: any;
  dialogRefDelete: any;
  pageSizeDetails = 5;
  ELEMENT_DATA_DETAILS: strEmployeeExchangeDetails[] = [];
  currentPageDetails: any;
  dataSourceDetails: MatTableDataSource<strEmployeeExchangeDetails> = new MatTableDataSource();
  pageIndexDetails: any;
  lengthDetails: any;
  // l

  pageIndex: any;
  length: any;
  pageSize = 5;
  ELEMENT_DATA: strEmployeeExchange[] = [];
  currentPage: any;

  productsList: Product[] = [];
  productCtrl: FormControl;
  filteredProduct: Observable<Product[]>;
  selectedProduct: Product | undefined;

  itemByFullCodeValue: any;
  fullCodeValue: any;
  stateDefaultValue: any;
  actionBtnDetails: string = "Save";
  isEdit: boolean = false;
  fiscalYearSelectedId: any;
  defaultStoreSelectValue: any;
  defaultFiscalYearSelectValue: any;



  itemsPositiveList: itemPositive[] = [];
  itemPositiveCtrl: FormControl;
  filtereditemPositive: Observable<itemPositive[]>;
  selecteditemPositive: itemPositive | undefined;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private api: ApiService,
    private dialog: MatDialog,
    private hotkeysService: HotkeysService,
    private formBuilder: FormBuilder,
    private http: HttpClient,
    @Inject(LOCALE_ID) private locale: string,
    private toastr: ToastrService,
    private cdr: ChangeDetectorRef
  ) {
    this.costcenterCtrl = new FormControl();
    this.filteredcostcenter = this.costcenterCtrl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filtercostcenters(value))
    );

    this.itemCtrl = new FormControl();

    this.filtereditem = this.itemCtrl.valueChanges.pipe(
      startWith(''),
      debounceTime(300), // Adjust the debounce time (in milliseconds) to your preference
      map((value) => this._filteritems(value))
    );


    this.productCtrl = new FormControl();
    this.filteredProduct = this.productCtrl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filterProducts(value))
    );

    this.employeeCtrl = new FormControl();
    this.filteredEmployee = this.employeeCtrl.valueChanges.pipe(
      startWith(''),
      debounceTime(300), // Adjust the debounce time (in milliseconds) to your preference
      map((value) => this._filteremployees(value))
    );

    this.distEmployeeCtrl = new FormControl();
    this.filtereddistEmployee = this.distEmployeeCtrl.valueChanges.pipe(
      startWith(''),
      debounceTime(300), // Adjust the debounce time (in milliseconds) to your preference
      map((value) => this._filterdistEmployees(value))
    );


    this.itemPositiveCtrl = new FormControl();
    this.filtereditemPositive = this.itemPositiveCtrl.valueChanges.pipe(
      startWith(''),
      debounceTime(300), // Adjust the debounce time (in milliseconds) to your preference
      map((value) => this._filteritemsPositive(value))
    );
  }

  ngOnInit(): void {
    this.getAllMasterForms();
    this.getStores();
    this.getFiscalYears();
    this.getEmployees();
    this.getDistEmployees();
    this.getItems();
    this.getStrEmployeeExchangeAutoNo();

    this.getCostCenters();

    this.groupMasterForm = this.formBuilder.group({
      no: [''],
      employee: [''],
      employeeId: [''],
      costcenter: [],
      costCenterId: [],
      itemName: [''],

      storeId: [''],
      itemId: [''],
      distEmployeeId: [''],
      item: [''],
      fiscalyear: [''],
      date: [''],
      store: [''],
      distEmployee: [''],
      fiscalYear: [''],
      report: [''],
      reportType: [''],
      StartDate: [''],
      EndDate: [''],
    });

    this.groupMasterFormDialog = this.formBuilder.group({
      no: [''],
      employee: [''],
      employeeId: [''],
      costcenter: [],
      costCenterId: [],

      distEmployeeId: [''],
      
      date: [''],
      distEmployee: [''],
      fiscalYear: [''],
      fiscalYearId: [''],


    });


    this.groupDetailsForm = this.formBuilder.group({
      // stR_WithdrawId: [''], //MasterId
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

    this.hotkeysService.add(
      new Hotkey('ctrl+o', (event: KeyboardEvent): boolean => {
        // Call the deleteGrade() function in the current component
        this.openEmployeeExchangeDialog();
        return false; // Prevent the default browser behavior
      })
    );
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource2.filter = filterValue.trim().toLowerCase();

    if (this.dataSource2.paginator) {
      this.dataSource2.paginator.firstPage();
    }
  }

  // openEmployeeExchangeDialog() {
  //   this.dialog
  //     .open(StrEmployeeExchangeDialogComponent, {
  //       width: '60%',
  //       height: '85%',
  //     })
  //     .afterClosed()
  //     .subscribe((val) => {
  //       if (val === 'save') {
  //         this.getAllMasterForms();
  //       }
  //     });
  // }
  openEmployeeExchangeDialog() {
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
this.getStrEmployeeExchangeAutoNo();
    // this.getStrWithdrawAutoNo();
    // // this.lists = [];
    // this.getListCtrl(this.groupMasterForm.getRawValue().type);

    // this.getProducts();
    // this.getItemsPositive();

    // this.getAllDetailsForms();

  }

  getAllMasterForms() {
    this.api.getStrEmployeeExchange().subscribe({
      next: (res) => {
        console.log("get all data: ", res);
        this.dataSource2 = new MatTableDataSource(res);
        this.dataSource2.paginator = this.paginator;
        this.dataSource2.sort = this.sort;
        this.groupMasterForm.reset();
        this.itemCtrl.reset();
        this.employeeCtrl.reset();
        this.distEmployeeCtrl.reset();
        this.costcenterCtrl.reset();
      },
      error: () => {
        // alert("خطأ أثناء جلب سجلات المجموعة !!");
      },
    });
  }

  getStores() {
    this.api.getStore().subscribe({
      next: (res) => {
        this.storeList = res;
      },
      error: (err) => {
        // console.log("fetch store data err: ", err);
        // alert("خطا اثناء جلب المخازن !");
      },
    });
  }

  // editMasterForm(row: any) {
  //   // this.dialog
  //   //   .open(StrEmployeeExchangeDialogComponent, {
  //   //     width: '60%',
  //   //     data: row,
  //   //   })
  //   //   .afterClosed()
  //   //   .subscribe((val) => {
  //   //     if (val === 'update' || val === 'save') {
  //   //       this.getAllMasterForms();
  //   //     }
  //   //   });
  //   this.dialog
  //     .open(StrEmployeeExchangeDialogComponent, {
  //       width: '60%',
  //       height: '80%',
  //       data: row,
  //     })
  //     .afterClosed()
  //     .subscribe((val) => {
  //       if (val === 'update' || val === 'save') {
  //         this.getAllMasterForms();
  //       }
  //     });
  // }

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
    this.groupMasterFormDialog.controls['type'].setValue(this.editData.type);
    // this.getListCtrl(this.groupMasterFormDialog.getRawValue().type);



    console.log('master edit form: ', this.editData);

    this.actionBtnMaster = 'Update';
    console.log('employeeId in edittttt', this.editData.employeeId);
    this.groupMasterFormDialog.controls['productionDate'].setValue(this.editData.productionDate)
    this.groupMasterFormDialog.controls['expireDate'].setValue(this.editData.expireDate)
    this.employeeName = this.getemployeeByID(this.editData.employeeId);
    // console.log('desstore id in edit data', this.editData.destStoreId);
    this.distEmployee = this.getdistEmployeeById(this.editData.distEmployee);

    console.log('employeename in edit', this.employeeName);

    this.groupMasterFormDialog.controls['employeeName'].setValue(
      this.editData.employeeName
    );

    this.groupMasterFormDialog.controls['distEmployee'].setValue(
      this.editData.distEmployee
    );


    this.groupMasterFormDialog.controls['fiscalYearId'].setValue(
      this.editData.fiscalYearId
    );

    this.groupMasterFormDialog.controls['date'].setValue(this.editData.date);
    this.groupMasterFormDialog.controls['transactionUserId'].setValue(
      this.editData.transactionUserId
    );

    this.groupMasterFormDialog.addControl(
      'id',
      new FormControl('')
    );
    this.groupMasterFormDialog.controls['id'].setValue(this.editData.id);
    this.groupMasterFormDialog.controls['employeeId'].setValue(
      this.editData.employeeId
    );


    this.groupMasterFormDialog.controls['distEmployeeId'].setValue(
      this.editData.distEmployeeId
    );

    console.log('costcenter:', this.editData.costCenterId);

    this.groupMasterFormDialog.controls['costCenterId'].setValue(
      this.editData.costCenterId
    );

    this.isEditDataReadOnly = true;

    this.autoNo = '';
    this.getStrEmployeeExchangeAutoNo()
    // this.getStrWithdrawAutoNo();

    // this.getProducts();
    // this.getItemsPositive();

    // this.getAllDetailsForms();
  }
  getItemsPositive() {
    // this.loading = true;
    this.api.getItemsPositive(this.groupMasterFormDialog.getRawValue().storeId, this.groupMasterFormDialog.getRawValue().fiscalYearId).subscribe({
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
  async fiscalYearValueChanges(fiscalyaerId: any) {
    console.log('fiscalyaer: ', fiscalyaerId);
    this.fiscalYearSelectedId = await fiscalyaerId;
    this.groupMasterFormDialog.controls['fiscalYearId'].setValue(
      this.fiscalYearSelectedId
    );
    this.isEdit = false;

    this.getStrEmployeeExchangeAutoNo();
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

  getdistEmployeeById(id: any) {
    console.log('row deststore id: ', id);
    return fetch(this.api.getHrEmployeeById(id))
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
    // this.http
    //   .get<any>(
    //     'http://ims.aswan.gov.eg/api/STREmployeeExchangeDetails/get/all'
    //   )
    //   .subscribe(
    //     (res) => {
    //       this.matchedIds = res.filter((a: any) => {
    //         return a.employee_ExchangeId === id;
    //       });
    //       var result = confirm('هل ترغب بتاكيد حذف التفاصيل و الرئيسي؟');

    //       if (this.matchedIds.length) {
    //         for (let i = 0; i < this.matchedIds.length; i++) {
    //           if (result) {
    //             this.api
    //               .deleteStrEmployeeExchangeDetails(this.matchedIds[i].id)
    //               .subscribe({
    //                 next: (res) => {
    //                   this.api.deleteStrEmployeeExchange(id).subscribe({
    //                     next: (res) => {
    //                       this.getAllMasterForms();
    //                     },
    //                     error: () => {
    //                       // alert("خطأ أثناء حذف الرئيسي !!");
    //                     },
    //                   });
    //                 },
    //                 error: () => {
    //                   // alert("خطأ أثناء حذف التفاصيل !!");
    //                 },
    //               });
    //           }
    //         } this.toastrDeleteSuccess();

    //       } else {
    //         if (result) {
    //           this.api.deleteStrEmployeeExchange(id).subscribe({
    //             next: (res) => {
    //               this.getAllMasterForms();
    //             },
    //             error: () => {
    //               // alert("خطأ أثناء حذف الرئيسي !!");
    //             },
    //           });
    //         }
    //       }
    //     },
    //     (err) => {
    //       // alert("خطا اثناء تحديد المجموعة !!")
    //     }
    //   );

    var result = confirm('تاكيد الحذف ؟ ');
    console.log(' id in delete:', id);
    if (result) {
      this.api.deleteStrEmployeeExchange(id).subscribe({
        next: (res) => {
          this.api.getStrEmployeeExchangeDetails().subscribe({
            next: (res) => {
              this.matchedIds = res.filter((a: any) => {
                // console.log("matched Id & HeaderId : ", a.HeaderId === id)
                return a.employee_ExchangeId === id;
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
    this.api.deleteStrEmployeeExchangeDetails(id).subscribe({
      next: (res) => {
        // alert('تم حذف الصنف بنجاح');
        this.getAllMasterForms();
      },
      error: (err) => {
        console.log('delete details err: ', err);
        // alert('خطأ أثناء حذف الصنف !!');
      },
    });
  }

  // getFiscalYears() {
  //   this.api.getFiscalYears().subscribe({
  //     next: (res) => {
  //       this.fiscalYearsList = res;
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

              this.groupMasterFormDialog.controls['fiscalYearId'].setValue(
                this.editData.fiscalYearId
              );
            }
            else {
              this.groupMasterFormDialog.controls['fiscalYearId'].setValue(
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

  getEmployees() {
    this.api.getEmployee().subscribe((lists) => {
      this.employeesList= lists;
     
    });
  }

  // getItems() {
  //   this.loading = true;
  //   this.api.getItems().subscribe({
  //     next: (res) => {
  //       this.loading = false;
  //       this.itemsList = res;
  //       this.cdr.detectChanges(); // Trigger change detection
  //     },      
  //     error: (err) => {
  //       this.loading = false;
  //       // console.log("fetch store data err: ", err);
  //       alert('خطا اثناء جلب العناصر !');
  //     },
  //   });
  // }

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

  getDistEmployees() {
    this.api.getEmployee().subscribe((lists) => {
      this.distEmployeesList= lists;
     
    });
  }

  getCostCenters() {
    this.api.getCostCenter().subscribe({
      next: (res) => {
        this.costcentersList = res;
        console.log("fetch costCenter data res: ", res);

      },
      error: (err) => {
        // console.log("fetch costCenter data err: ", err);
        // alert("خطا اثناء جلب مراكز التكلفة !");
      },
    });
  }
  getsearch(code: any) {
    if (code.keyCode == 13) {
      this.getAllMasterForms();
    }
  }

  displaycostcenterName(costcenter: any): string {
    return costcenter ? costcenter.name && costcenter.name != null ? costcenter.name : '-' : '';
  }
  costcenterSelected(event: MatAutocompleteSelectedEvent): void {
    const costcenter = event.option.value as costcenter;
    console.log('costcenter selected: ', costcenter);
    this.selectedcostcenter = costcenter;
    this.groupMasterForm.patchValue({ costCenterId: costcenter.id });
    this.groupMasterFormDialog.patchValue({ costCenterId: costcenter.id });

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
      // costcenter.name.toLowerCase().includes(filterValue)
      costcenter.name ? costcenter.name.toLowerCase().includes(filterValue) : '-'
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



  /////////product
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



  getItemByProductId(productEvent: any) {
    console.log("productEvent: ", productEvent);

    this.productsList.filter((a: any) => {
      if (a.id === productEvent) {
        this.groupDetailsForm.controls['itemId'].setValue(a.itemId);
        // this.groupDetailsForm.controls['fullCode'].setValue(a.code);
        // console.log("itemsList: ", this.itemsList.find((item: { id: any; }) => item.id == this.groupDetailsForm.getRawValue().itemId));
        this.fullCodeValue = this.itemsList.find((item: { id: any; }) => item.id == this.groupDetailsForm.getRawValue().itemId)?.fullCode;
        // alert("fullCode: " + this.fullCodeValue);

        console.log("item by code: ", a.itemName);
        this.itemCtrl.setValue(a.itemName);
        if (a.itemName) {
          this.itemByFullCodeValue = a.itemName;
        }
        else {
          this.itemByFullCodeValue = '-';
        }
        this.itemByFullCodeValue = a.itemName;
      }
    })
  }

  /////employeee


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
      this.groupMasterForm.getRawValue().employeeId
    );
    if (this.groupMasterFormDialog.getRawValue().distEmployeeId == this.groupMasterFormDialog.getRawValue().employeeId) {
      this.toastrSelectSameEmpolyee()
    }
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
 
  //////distemployee
  displaydistEmployeeName(distEmployee: any): string {
    return distEmployee ? distEmployee.name && distEmployee.name != null ? distEmployee.name : '-' : '';
  }
  distEmployeeSelected(event: MatAutocompleteSelectedEvent): void {
    const distEmployee = event.option.value as distEmployee;
    console.log('distEmployee selected: ', distEmployee);
    this.selecteddistEmployee = distEmployee;
    this.groupMasterForm.patchValue({ distEmployeeId: distEmployee.id });
    this.groupMasterForm.patchValue({ employeeName: distEmployee.name });

    console.log(
      'distEmployee in form: ',
      this.groupMasterForm.getRawValue().distEmployeeId
    );
    if (this.groupMasterFormDialog.getRawValue().distEmployeeId == this.groupMasterFormDialog.getRawValue().employeeId) {
      this.toastrSelectSameEmpolyee()
    }
  }

  private _filterdistEmployees(value: string): distEmployee[] {
    const filterValue = value;
    return this.distEmployeesList.filter((distEmployee) =>
      distEmployee.name? distEmployee.name.toLowerCase().includes(filterValue) : '-'

    );
  }
 
  openAutodistEmployee() {
    this.distEmployeeCtrl.setValue(''); // Clear the input field value

    // Open the autocomplete dropdown by triggering the value change event
    this.distEmployeeCtrl.updateValueAndValidity();
  }

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
      this.groupMasterFormDialog.getRawValue().storeId,
      this.groupMasterFormDialog.getRawValue().fiscalYearId,
      formatDate(this.groupMasterFormDialog.getRawValue().date, 'yyyy-MM-dd', this.locale),
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


  getSearchStrOpen(no: any, StartDate: any, EndDate: any, fiscalyear: any) {
    console.log('fiscal year in ts:', fiscalyear);
    let costCenterId = this.groupMasterForm.getRawValue().costCenterId;
    let employeeId = this.groupMasterForm.getRawValue().employeeId;
    let distEmployee = this.groupMasterForm.getRawValue().distEmployeeId;
    let item = this.groupDetailsForm.getRawValue().itemId;
    this.loading = true;
    this.api
      .getStrEmployeeExchangeSearach(
        no,
        costCenterId,
        employeeId,
        item,

        distEmployee,
        StartDate,
        EndDate,
        fiscalyear
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
          // alert("Error")
        },
      });
  }

  downloadPdf(
    no: any,
    StartDate: any,
    EndDate: any,
    Fiscalyear: any,
    report: any,
    reportType: any
  ) {
    let costCenterId = this.groupMasterForm.getRawValue().costCenterId;
    let employeeId = this.groupMasterForm.getRawValue().employeeId;
    let distEmployee = this.groupMasterForm.getRawValue().distEmployeeId;
    let item = this.groupDetailsForm.getRawValue().itemId;

    this.api
      .getStrEmployeeExchangeItem(
        no,
        distEmployee,
        StartDate,
        EndDate,
        Fiscalyear,
        item,
        employeeId,
        costCenterId,
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

  previewPdf(
    no: any,
    StartDate: any,
    EndDate: any,
    Fiscalyear: any,
    report: any,
    reportType: any
  ) {
    let costCenterId = this.groupMasterForm.getRawValue().costCenterId;
    let employeeId = this.groupMasterForm.getRawValue().employeeId;
    let distEmployee = this.groupMasterForm.getRawValue().distEmployeeId;
    let item = this.groupDetailsForm.getRawValue().itemId;
    if (report != null && reportType != null) {
      this.loading = true;
      this.api
        .getStrEmployeeExchangeItem(
          no,
          distEmployee,
          StartDate,
          EndDate,
          Fiscalyear,
          item,
          employeeId,
          costCenterId,
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
            this.dialog.open(EmployeeExchangePrintDialogComponent, {
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
  //   let reportFooter: any = document.getElementById('reportFooter');
  //   let date: any = document.getElementById('date');
  //   header.style.display = 'grid';
  //   //paginator.style.display = 'none';
  //   action1.style.display = 'none';
  //   // button1.style.display = 'none';
  //   // button2.style.display = 'none';
  //   for (let index = 0; index < button.length; index++) {
  //     let element = button[index];

  //     element.hidden = true;
  //   }
  //   // reportFooter.style.display = 'block';
  //   // date.style.display = 'block';
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




  printReport() {
    // this.loadAllData();
    let header: any = document.getElementById('header');
    let paginator: any = document.getElementById('paginator');
    let action1: any = document.getElementById('action1');
    let action2: any = document.querySelectorAll('action2');
    console.log(action2);
    let button1: any = document.querySelectorAll('#button1');
    console.log(button1);
    let button2: any = document.getElementById('button2');
    let button: any = document.getElementsByClassName('mdc-icon-button');
    console.log(button);
    let buttn: any = document.querySelectorAll('#buttn');
    for (let index = 0; index < buttn.length; index++) {
      buttn[index].hidden = true;
    }

    let actionHeader: any = document.getElementById('action-header');
    actionHeader.style.display = 'none';

    let reportFooter: any = document.getElementById('reportFooter');
    let date: any = document.getElementById('date');
    header.style.display = 'grid';
    // button1.style.display = 'none';
    // button2.style.display = 'none';

    let printContent: any = document.getElementById('content')?.innerHTML;
    let originalContent: any = document.body.innerHTML;
    document.body.innerHTML = printContent;
    // console.log(document.body.children);
    document.body.style.cssText =
      'direction:rtl;-webkit-print-color-adjust:exact;';
    window.print();
    document.body.innerHTML = originalContent;
    location.reload();
  }
  toastrSelectSameEmpolyee(): void {
    this.toastr.error("عفوا غير مسموح باختيار نفس الموظف");
  }
  toastrDeleteSuccess(): void {
    this.toastr.success('تم الحذف بنجاح');
  }
  toastrEditSuccess(): void {
    this.toastr.success('تم التعديل بنجاح');
  }
  toastrSuccess(): void {
    this.toastr.success('تم الحفظ بنجاح');
  }


  tabSelected(tab: any) {
    console.log("tab selected: ", tab);
    if (tab.index == 0) {
      console.log("done: ", tab);

      this.editData = '';
      this.MasterGroupInfoEntered = false;
      this.groupMasterForm.controls['no'].setValue('');
      this.groupMasterFormDialog.controls['no'].setValue('');

      this.costcenterCtrl.setValue('');
      // this.groupMasterForm.controls['date'].setValue(this.currentDate);
      // this.lists = [];

      this.getAllMasterForms();

    }
  }

  async updateMaster() {
    console.log('nnnvvvvvvvvvv: ', this.groupMasterForm.value);


    this.groupMasterFormDialog.controls['distEmployee'].setValue(
      this.groupMasterFormDialog.getRawValue().distEmployee
    );

    this.groupMasterFormDialog.controls['deststoreId'].setValue(
      this.groupMasterFormDialog.getRawValue().deststoreId
    );

    this.groupDetailsForm.controls['transactionUserId'].setValue(this.userIdFromStorage);

    console.log("update both: ", this.groupDetailsForm.valid, "ooo:", !this.getDetailedRowData);
    console.log("edit : ", this.groupDetailsForm.value)
    this.api.putStrWithdraw(this.groupMasterFormDialog.value)
      .subscribe({
        next: (res) => {
          this.groupDetailsForm.reset();
          this.getDetailedRowData = '';
          this.getAllMasterForms();
          this.groupDetailsForm.controls['qty'].setValue(1);
        },

      })
  }

  async nextToAddFormDetails() {
    this.groupMasterFormDialog.removeControl('id');
    console.log(
      'in next to add storeId',
      this.groupMasterFormDialog.getRawValue().storeId
    );

    // this.getAllDetailsForms();


  

    console.log(
      'emoloyeeIddddd',
      this.groupMasterFormDialog.getRawValue().employeeId
    );
    this.groupMasterFormDialog.controls['employeeId'].setValue(
      this.groupMasterFormDialog.getRawValue().employeeId
    );

    // this.costCenterName = await this.getemployeeByID(
    //   this.groupMasterFormDialog.getRawValue().employeeId
    // );
    this.groupMasterFormDialog.controls['employeeName'].setValue(
      this.groupMasterFormDialog.getRawValue().employeeName
    );

    // this.costCenterName = await this.getcostcenterByID(
    //   this.groupMasterFormDialog.getRawValue().costCenterId
    // );
    // this.groupMasterFormDialog.controls['costcenterName'].setValue(
    //   this.costCenterName
    // );

    this.groupMasterFormDialog.controls['distEmployeeId'].setValue(
      this.groupMasterFormDialog.getRawValue().distEmployeeId
    );
    // this.costCenterName = await this.getDestStoreById(
    //   this.groupMasterFormDialog.getRawValue().deststoreId
    // );
    console.log(
      'in next to add deststore name:',
      this.groupMasterFormDialog.getRawValue().desstoreName
    );
    this.groupMasterFormDialog.controls['distEmployee'].setValue(
      this.groupMasterFormDialog.getRawValue().distEmployee
    );

    console.log('dataName: ', this.groupMasterFormDialog.value);

    if (this.groupMasterFormDialog.getRawValue().no && this.groupMasterFormDialog.getRawValue().no == this.autoNo) {

      console.log('no changed: ', this.groupMasterFormDialog.getRawValue().no);
      this.groupMasterFormDialog.controls['no'].setValue(this.autoNo);

    }
    else {
      this.groupMasterFormDialog.controls['no'].setValue(this.groupMasterFormDialog.getRawValue().no);
      console.log(
        'no took auto number: ',
        this.groupMasterFormDialog.getRawValue().no
      );
    }

    console.log('Master add form : ', this.groupMasterFormDialog.value);

    if (this.groupMasterFormDialog.getRawValue().storeId) {

      console.log('Master add form in : ', this.groupMasterFormDialog.value);
      this.api.postStrWithdraw(this.groupMasterFormDialog.value).subscribe({
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



  getItemByProductCode(code: any) {
    if (code.keyCode == 13) {
      this.productsList.filter((a: any) => {
        console.log("enter product code case, ", "a.code: ", a.code, " code target: ", code.target.value);
        if (a.code == code.target.value) {
          console.log("enter product code case condition: ", a.code === code.target.value);

          this.groupDetailsForm.controls['itemId'].setValue(a.itemId);
          this.productIdValue = a.name;
          this.productCtrl.setValue(a.name);

          this.fullCodeValue = this.itemsList.find((item: { id: any; }) => item.id == this.groupDetailsForm.getRawValue().itemId)?.fullCode;
          // alert("fullCode: " + this.fullCodeValue);

          this.itemCtrl.setValue(a.itemName);
          if (a.itemName) {
            this.itemByFullCodeValue = a.itemName;
          }
          else {
            this.itemByFullCodeValue = '-';
          }
          this.itemByFullCodeValue = a.itemName;

        }
        else {
          this.productIdValue = '';
        }
      })
    }
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



  async addDetailsInfo() {
    console.log("enter fun: ");

    if (!this.editData) {
      console.log("podt fun: ", this.getMasterRowId);

      if (this.getMasterRowId) {

        if (this.groupDetailsForm.getRawValue().itemId) {
          this.itemName = await this.getItemByID(this.groupDetailsForm.getRawValue().itemId);
          this.groupDetailsForm.controls['itemName'].setValue(this.itemName);
          this.groupDetailsForm.controls['total'].setValue((parseFloat(this.groupDetailsForm.getRawValue().price) * parseFloat(this.groupDetailsForm.getRawValue().qty)));
        }
        this.groupDetailsForm.controls['employee_ExchangeId'].setValue(this.getMasterRowId);

        console.log("groupDetails: ", this.groupDetailsForm.value);
        if (this.groupDetailsForm.valid) {
          this.loading = true
          this.api.postStrEmployeeExchangeDetails(this.groupDetailsForm.value)
            .subscribe({
              next: (res) => {
                this.loading = false;
                // alert("detailsId: "+res);
                this.getDetailsRowId = {
                  "id": res
                };

                this.toastrSuccess();
                this.groupDetailsForm.reset();
                this.groupDetailsForm.controls['qty'].setValue(1);
                this.groupDetailsForm.controls['state'].setValue('جديد');
                this.itemCtrl.setValue('');
                this.itemByFullCodeValue = '';
                this.fullCodeValue = '';
              },
              error: () => {
                this.loading = false;
                // alert("حدث خطأ أثناء إضافة مجموعة")
              }
            })
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

  getItemByID(id: any) {
    return fetch(this.api.getItemById(id))
      .then(response => response.json())
      .then(json => {
        return json.name;
      })
      .catch((err) => {
        // console.log("error in fetch item name by id: ", err);
        // alert("خطا اثناء جلب رقم العنصر !");
      });
  }



  async updateDetailsForm() {


    this.groupDetailsForm.addControl('id', new FormControl(''));
    this.groupDetailsForm.controls['id'].setValue(this.editData.id);

    if (this.groupDetailsForm.getRawValue().itemId) {
      this.itemName = await this.getItemByID(this.groupDetailsForm.getRawValue().itemId);
      this.groupDetailsForm.controls['itemName'].setValue(this.itemName);

      this.groupDetailsForm.controls['total'].setValue((parseFloat(this.groupDetailsForm.getRawValue().price) * parseFloat(this.groupDetailsForm.getRawValue().qty)));
    }

    console.log("groupDetails update: ", this.groupDetailsForm.value);

    this.api.putStrEmployeeExchangeDetails(this.groupDetailsForm.value)
      .subscribe({
        next: (res) => {
          this.toastrEditSuccess();
          this.groupDetailsForm.reset();
          this.groupDetailsForm.controls['qty'].setValue(1);
          this.groupDetailsForm.controls['state'].setValue('جديد');
          this.itemCtrl.setValue('');
          this.itemByFullCodeValue = '';
          this.fullCodeValue = '';


        },
        error: (err) => {
          // console.log("update err: ", err)
          // alert("خطأ أثناء تحديث سجل المجموعة !!")
        }
      })
    this.groupDetailsForm.removeControl('id')

  }


  // getAllDetailsForms() {


  //   console.log("master Id: ", this.getMasterRowId.id)

  //   if (this.getMasterRowId.id) {
  //     this.loading = true;
  //     this.api.getStrEmployeeExchangeDetailsByMasterId(this.getMasterRowId.id)
  //       .subscribe({
  //         next: (res) => {
  //           this.loading = false;
  //           // this.itemsList = res;
  //           this.matchedIds = res[0].strEmployeeExchangeDetailsGetVM;

  //           if (this.matchedIds) {
  //             console.log("eeeeeeeeeeeeeeeeeeeeeeeeeeee: ", res[0].strEmployeeExchangeDetailsGetVM);
  //             this.dataSource = new MatTableDataSource(this.matchedIds);
  //             this.dataSource.paginator = this.paginator;
  //             this.dataSource.sort = this.sort;

  //             this.sumOfTotals = 0;
  //             for (let i = 0; i < this.matchedIds.length; i++) {
  //               this.sumOfTotals = this.sumOfTotals + parseFloat(this.matchedIds[i].total);
  //               this.sumOfTotals = Number(this.sumOfTotals.toFixed(2));
  //               this.groupMasterForm.controls['total'].setValue(this.sumOfTotals);

  //             }
  //           }
  //         },
  //         error: (err) => {
  //           this.loading = false;
  //           // console.log("fetch items data err: ", err);
  //           // alert("خطا اثناء جلب العناصر !");
  //         }
  //       })

  //     // }
  //   }


  // }
  getAllDetailsForms() {
    this.groupDetailsForm.controls['state'].setValue(this.stateDefaultValue);
    this.groupDetailsForm.controls['qty'].setValue(1);

    console.log("mastered row get all data: ", this.getMasterRowId)


    if (this.editData) {
      this.getMasterRowId = {
        "id": this.editData.id
      }
    }

    console.log("mastered row get all data: ", this.getMasterRowId)
    if (this.getMasterRowId) {
      this.api.getStrEmployeeExchangeDetailsByMasterId(this.getMasterRowId.id).subscribe({
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

      // if (!this.currentPageDetails) {
      //   this.currentPageDetails = 0;

      //   // this.isLoading = true;
      //   fetch(this.api.getStrWithdrawDetailsPaginateByMasterId(this.currentPageDetails, this.pageSizeDetails, this.getMasterRowId.id))
      //     .then(response => response.json())
      //     .then(data => {

      //       console.log("details data paginate first Time: ", data);
      //       this.dataSourceDetails.data = data.items;
      //       this.pageIndexDetails = data.page;
      //       this.pageSizeDetails = data.pageSize;
      //       this.lengthDetails = data.totalItems;
      //       setTimeout(() => {
      //         this.paginator.pageIndex = this.currentPageDetails;
      //         this.paginator.length = this.lengthDetails;
      //       });

      //       // this.isLoading = false;
      //     }, error => {
      //       console.log(error);
      //       // this.isLoading = false;
      //     });
      // }
      // else {

      //   // this.isLoading = true;
      //   fetch(this.api.getStrWithdrawDetailsPaginateByMasterId(this.currentPageDetails, this.pageSizeDetails, this.getMasterRowId.id))
      //     .then(response => response.json())
      //     .then(data => {

      //       console.log("details data paginate: ", data);
      //       this.dataSourceDetails.data = data.items;
      //       this.pageIndexDetails = data.page;
      //       this.pageSizeDetails = data.pageSize;
      //       this.lengthDetails = data.totalItems;
      //       setTimeout(() => {
      //         this.paginator.pageIndex = this.currentPageDetails;
      //         this.paginator.length = this.lengthDetails;
      //       });
      //       // this.isLoading = false;
      //     }, error => {
      //       console.log(error);
      //       // this.isLoading = false;
      //     });


      // }


    }

  }

  pageChangedDetails(event: PageEvent) {
    console.log("page event: ", event);
    this.pageSizeDetails = event.pageSize;
    this.currentPageDetails = event.pageIndex;
    // this.currentPage = event.previousPageIndex;
    this.getAllDetailsForms();
  }


  itemOnChange(itemEvent: any) {
    // this.isReadOnly = true;
    console.log("itemId: ", itemEvent)

    this.getAvgPrice(
      this.groupMasterFormDialog.getRawValue().storeId,
      this.groupMasterFormDialog.getRawValue().fiscalYearId,
      formatDate(this.groupMasterFormDialog.getRawValue().date, 'yyyy-MM-dd', this.locale),
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


  // editDetailsForm(row: any) {

  //   // if (this.editDataDetails || row) {
  //   //   this.getDetailedRowData = row;

  //   //   this.actionBtnDetails = "Update";
  //   //   this.groupDetailsForm.controls['employee_ExchangeId'].setValue(this.getDetailedRowData.employee_ExchangeId);

  //   //   this.groupDetailsForm.controls['qty'].setValue(this.getDetailedRowData.qty);
  //   //   this.groupDetailsForm.controls['price'].setValue(this.getDetailedRowData.price);
  //   //   this.groupDetailsForm.controls['total'].setValue(parseFloat(this.groupDetailsForm.getRawValue().price) * parseFloat(this.groupDetailsForm.getRawValue().qty));
  //   //   this.groupDetailsForm.controls['percentage'].setValue(this.getDetailedRowData.percentage);
  //   //   this.groupDetailsForm.controls['state'].setValue(this.getDetailedRowData.state);

  //   //   this.groupDetailsForm.controls['itemId'].setValue(this.getDetailedRowData.itemId);

  //   // }

  //   this.router.navigate(['/employeeOpening'], { queryParams: { masterId: this.getMasterRowId.id} })
  //   this.dialog.open(StrEmployeeExchangeDetailsDialogComponent, {
  //     width: '98%',
  //     height: '85%',
  //     data: row
  //   }).afterClosed().subscribe(val => {
  //     if (val === 'save' || val === 'update') {
  //       this.getAllDetailsForms();
  //     }
  //   })



  // }

  editDetailsForm(row: any) {
    console.log("editData details: ", row);
    this.editDataDetails = row;

    // this.goToPart();
    if (this.editDataDetails || row) {

      console.log('dETAILS ROW: ', this.editDataDetails);

      this.actionBtnDetails = 'Update';
      this.groupDetailsForm.controls['qty'].setValue(this.getDetailedRowData.qty);
      this.groupDetailsForm.controls['price'].setValue(this.getDetailedRowData.price);
      this.groupDetailsForm.controls['total'].setValue(parseFloat(this.groupDetailsForm.getRawValue().price) * parseFloat(this.groupDetailsForm.getRawValue().qty));
      this.groupDetailsForm.controls['percentage'].setValue(this.getDetailedRowData.percentage);
      this.groupDetailsForm.controls['state'].setValue(this.getDetailedRowData.state);


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

  pageChanged(event: PageEvent) {
    console.log("page event: ", event);
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;

    this.getAllMasterForms();
  }


  getStrEmployeeExchangeAutoNo() {
    this.api.getStrEmployeeExchangeAutoNo()
      .subscribe({
        next: (res) => {
          this.autoNo = res;
          return res;
        },
        error: (err) => {
          // console.log("fetch fiscalYears data err: ", err);
          // alert("خطا اثناء جلب العناصر !");
        }
      })
  }



  // getStrEmployeeExchangeAutoNo() {
  //   console.log("enter AutoNo function");

   

  //   if (this.groupMasterFormDialog) {
     

  //     console.log('editData: ', this.editData, "fiscaLYearId: ", this.fiscalYearSelectedId);

  //     if (this.editData && (this.editData.fiscalYearId == this.fiscalYearSelectedId)) {
  //       console.log("firstCase editData does Not change: ");
  //       this.isEdit = true;

  //       console.log('isEdit : ', this.isEdit, "no master: ", this.groupMasterFormDialog.getRawValue().no);
  //       this.groupMasterFormDialog.controls['no'].setValue(this.editData.no);
  //       console.log('autoNo1: ', this.groupMasterFormDialog.getRawValue().no);

  //     }
  //     else if (this.editData && (this.editData.fiscalYearId == this.fiscalYearSelectedId)) {
  //       console.log("secondCase editData with storeId Only change: ");

  //       this.api
  //         .getStrEmployeeExchangeAutoNo(
           
  //           this.editData.fiscalYearId
  //         )
  //         .subscribe({
  //           next: (res) => {
  //             this.autoNo = res;

  //             console.log('isEdit : ', this.isEdit, "no master: ", this.groupMasterFormDialog.getRawValue().no);
  //             this.groupMasterFormDialog.controls['no'].setValue(this.autoNo);
  //             console.log('autoNo2: ', this.autoNo);
  //             return res;
  //           },
  //           error: (err) => {
  //             console.log('fetch autoNo err2: ', err);
  //             // alert("خطا اثناء جلب العناصر !");
  //           },
  //         });

  //     }
  //     else if (this.editData && (this.editData.fiscalYearId != this.fiscalYearSelectedId)) {
  //       console.log("thirdCase editData with fiscalYear Only change: ");

  //       this.api
  //         .getStrEmployeeExchangeAutoNo(
            
  //           this.groupMasterFormDialog.getRawValue().fiscalYearId
  //         )
  //         .subscribe({
  //           next: (res) => {
  //             this.autoNo = res;

  //             console.log('isEdit : ', this.isEdit, "no master: ", this.groupMasterFormDialog.getRawValue().no);
  //             this.groupMasterFormDialog.controls['no'].setValue(this.autoNo);
  //             console.log('autoNo3: ', this.autoNo);
  //             return res;
  //           },
  //           error: (err) => {
  //             console.log('fetch autoNo err3: ', err);
  //             // alert("خطا اثناء جلب العناصر !");
  //           },
  //         });
  //     }
  //     else if (this.editData && (this.editData.fiscalYearId != this.fiscalYearSelectedId)) {
  //       console.log("fourthCase editData with fiscalYear And store change: ");

  //       this.api
  //         .getStrEmployeeExchangeAutoNo(
  //           this.groupMasterFormDialog.getRawValue().fiscalYearId
  //         )
  //         .subscribe({
  //           next: (res) => {
  //             this.autoNo = res;

  //             console.log('isEdit : ', this.isEdit, "no master: ", this.groupMasterFormDialog.getRawValue().no);
  //             this.groupMasterFormDialog.controls['no'].setValue(this.autoNo);
  //             console.log('autoNo4: ', this.autoNo);
  //             return res;
  //           },
  //           error: (err) => {
  //             console.log('fetch autoNo err4: ', err);
  //             // alert("خطا اثناء جلب العناصر !");
  //           },
  //         });
  //     }
  //     else {
  //       console.log("fifthCase No editData: ");

  //       this.api
  //         .getStrEmployeeExchangeAutoNo(
  //           this.groupMasterFormDialog.getRawValue().fiscalYearId
  //         )
  //         .subscribe({
  //           next: (res) => {
  //             this.autoNo = res;
  //             // this.editData.no = res
  //             console.log('isEdit : ', this.isEdit, "no master: ", this.groupMasterFormDialog.getRawValue().no);
  //             this.groupMasterFormDialog.controls['no'].setValue(this.autoNo);
  //             console.log('autoNo5: ', this.autoNo);
  //             return res;
  //           },
  //           error: (err) => {
  //             console.log('fetch autoNo err5: ', err);
  //             // alert("خطا اثناء جلب العناصر !");
  //           },
  //         });
  //     }
  //   }
  // }
}