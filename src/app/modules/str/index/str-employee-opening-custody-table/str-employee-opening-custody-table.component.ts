import { Component, Inject, LOCALE_ID, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from '../../services/api.service';
import { HttpClient } from '@angular/common/http';
import { formatDate } from '@angular/common';
import { StrOpeningStockDialogComponent } from '../str-opening-stock-dialog/str-opening-stock-dialog.component';
import { ToastrService } from 'ngx-toastr';
import { STREmployeeOpeningCustodyDialogComponent } from '../str-employee-opening-custody-dialog/str-employee-opening-custody-dialog.component';

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
import { PrintDialogComponent } from './../print-dialog/print-dialog.component';
import { GlobalService } from 'src/app/pages/services/global.service';





export class Employee {
  constructor(public id: number, public name: string, public code: string) { }
}

export class costcenter {
  constructor(public id: number, public name: string) { }
}
export class item {
  constructor(public id: number, public name: string) { }
}

@Component({
  selector: 'app-str-employee-opening-custody-table',
  templateUrl: './str-employee-opening-custody-table.component.html',
  styleUrls: ['./str-employee-opening-custody-table.component.css'],
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
  matchedIds: any;
  storeList: any;
  storeName: any;
  // costCentersList: any;

  // employeesList: any;
  // itemList:any;
  fiscalYearsList: any;

  groupMasterForm !: FormGroup;
  groupDetailsForm !: FormGroup;

  pdfurl = '';

  costCentersList: costcenter[] = [];
  costcenterCtrl: FormControl<any>;
  filteredcostcenter: Observable<costcenter[]>;
  selectedcostcenter: costcenter | undefined;
loading :boolean=false;

  itemsList: item[] = [];
  itemCtrl: FormControl;
  filtereditem: Observable<item[]>;
  selecteditem: item | undefined;

  employeesList: Employee[] = [];
  employeeCtrl: FormControl<any>;
  filteredEmployee: Observable<Employee[]>;
  selectedEmployee: Employee | undefined;
  dataSource2!: MatTableDataSource<any>;

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
    private global:GlobalService
  ) {
    global.getPermissionUserRoles('Store', 'str-home', 'إدارة المخازن وحسابات المخازن ', 'store')
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


    this.employeeCtrl = new FormControl();
    this.filteredEmployee = this.employeeCtrl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filteremployees(value))
    );
  }

  ngOnInit(): void {
    this.getAllMasterForms();
    this.getAllEmployees();
    this.getFiscalYears();
    this.getEmployees();
    this.getItme();
    this.getcostCenter();

    this.groupMasterForm = this.formBuilder.group({
      no: [''],
      employee: [''],
      costcenter: [],
      costCenterId: [''],
      employeeId: [''],
      StartDate: [''],
      EndDate: [''],
      itemName: [''],
      itemId: [''],
      fiscalYear: [''],
      date: [''],
     report:[''],
      reportType:['']
    });

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
      this.openEmployeeingStockDialog();
      return false; // Prevent the default browser behavior
    }));
  }

  getsearch(code: any) {
    if (code.keyCode == 13) {
      this.getAllMasterForms();
    }
  }

  getAllMasterForms() {
    this.loading=true
    this.api.getStrEmployeeOpen().subscribe({
      next: (res) => {
        this.loading=false
        console.log('response of get all getGroup from api: ', res);
        this.dataSource2 = new MatTableDataSource(res);
        this.dataSource2.paginator = this.paginator;
        this.dataSource2.sort = this.sort;

        this.groupMasterForm.reset();
        this.groupDetailsForm.reset();

        this.itemCtrl.reset();
        this.employeeCtrl.reset();
        this.costcenterCtrl.reset();

      },
      error: () => {
        this.loading=false;
        // alert('خطأ أثناء جلب سجلات المجموعة !!');
      },
    });
  }
  openEmployeeingStockDialog() {
    this.dialog
      .open(STREmployeeOpeningCustodyDialogComponent, {
        width: '60%',
        height: '79%',
      })
      .afterClosed()
      .subscribe((val) => {
        if (val === 'Save') {
          // alert("refreshhhh")
          this.getAllMasterForms();
        }
      });
  }
  editMasterForm(row: any) {
    this.dialog
      .open(STREmployeeOpeningCustodyDialogComponent, {
        width: '60%',
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
      this.api.deleteStrEmployeeOpen(id).subscribe({
        next: (res) => {
          this.api.getStrEmployeeOpenDetails()
          .subscribe({
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

            }
          })

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
        this.getAllMasterForms();
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
  getEmployees() {
    this.api.getHrEmployees().subscribe({
      next: (res) => {
        this.employeesList = res;
        console.log('employees res: ', this.employeesList);
      },
      error: (err) => {
        console.log('fetch employees data err: ', err);
        // alert("خطا اثناء جلب الموظفين !");
      },
    });
  }
  getItme() {
    this.api.getItems()
      .subscribe({
        next: (res) => {
          this.itemsList = res;
          console.log("item res: ", this.itemsList);
        },
        error: (err) => {
          console.log("fetch employees data err: ", err);
          // alert("خطا اثناء جلب الموظفين !");
        }
      })
  }
  getcostCenter() {
    this.api.getCostCenter()
      .subscribe({
        next: (res) => {
          this.costCentersList = res;
          // console.log("item res: ", this.itemList);
        },
        error: (err) => {
          console.log("fetch employees data err: ", err);
          // alert("خطا اثناء جلب الموظفين !");
        }
      })
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
    return this.costCentersList.filter((costcenter) =>
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

  // getSearchStrOpen(no: any, date: any, itemId: any) {
  //   console.log('no. : ', no, 'item : ', itemId, 'date: ', date);

  //   let costCenterId = this.groupMasterForm.getRawValue().costCenterId;
  //   let employeeId = this.groupMasterForm.getRawValue().employeeId;

  //   // this.api
  //   //   .getStrEmployeeOpenSearach(no, costCenterId, employeeId, date, itemId)
  //   //   .subscribe({
  //   //     next: (res) => {
  //   //       console.log('search employeeExchange 4res: ', res);

    getSearchStrOpen(no: any, StartDate: any,EndDate:any, fiscalyear: any) {
      // console.log(
      //   'no. : ',
      //   no,
      //   'FISCALYEAR : ',
      //   fiscalYear,
      //   'date: ',
      //   date,

      // );

   

      let costCenterId = this.groupMasterForm.getRawValue().costCenterId
      let employeeId = this.groupMasterForm.getRawValue().employeeId
      let itemId = this.groupDetailsForm.getRawValue().itemId

this.loading=true;

      this.api.getStrEmployeeOpenSearach(no,  costCenterId, employeeId, itemId,StartDate,EndDate,fiscalyear)
        .subscribe({
          next: (res) => {
            this.loading=false;
            console.log("search employeeExchange 4res: ", res);
  this.dataSource2 = res;
              this.dataSource2.paginator = this.paginator;
              this.dataSource2.sort = this.sort;
            },
            error: (err) => {
              this.loading=false;
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
    downloadPrint(no: any, StartDate: any,EndDate:any, fiscalYear: any,report:any,reportType:any) {
      let costCenter = this.groupMasterForm.getRawValue().costCenterId;
      let employee = this.groupMasterForm.getRawValue().employeeId;
      let item = this.groupDetailsForm.getRawValue().itemId;
      let store = this.groupMasterForm.getRawValue().storeId;
  
      this.api
      .getStrEmployeeCustodyReport(no,  StartDate,EndDate, fiscalYear, item, employee, costCenter,report,reportType)
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


    previewPrint(no: any, StartDate: any,EndDate:any, fiscalYear: any,report:any,reportType:any) {
      let costCenter = this.groupMasterForm.getRawValue().costCenterId;
      let employee = this.groupMasterForm.getRawValue().employeeId;
      let item = this.groupDetailsForm.getRawValue().itemId;
      let store = this.groupMasterForm.getRawValue().storeId;
  if(report!=null && reportType!=null){

  this.loading =true;
      this.api
        .getStrEmployeeCustodyReport(no,  StartDate,EndDate, fiscalYear, item, employee, costCenter,report,'pdf')
        .subscribe({
          next: (res) => {
            this.loading=false;
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
            this.loading=false;
            console.log('eroorr', err);
            window.open(err.url);
          },
        });}
        else{
          alert("ادخل التقرير و نوع التقرير!")   }
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
    //   paginator.style.display = 'none';
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
  }
