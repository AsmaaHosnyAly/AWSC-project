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
import { LoadingService } from 'src/app/loading.service';
import {
  FormControl,
  FormControlName,
  FormBuilder,
  FormGroup,
} from '@angular/forms';
import { Observable, map, startWith, tap } from 'rxjs';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

export class Employee {
  constructor(public id: number, public name: string, public code: string) {}
}

export class costcenter {
  constructor(public id: number, public name: string) {}
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
  itemList: any;
  fiscalYearsList: any;
  loading$ = this.loader.loading$;
  groupMasterForm!: FormGroup;

  costCentersList: costcenter[] = [];
  costcenterCtrl: FormControl<any>;
  filteredcostcenter: Observable<costcenter[]>;
  selectedcostcenter: costcenter | undefined;

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
    private formBuilder: FormBuilder,
    private http: HttpClient,
    public loader: LoadingService,
    @Inject(LOCALE_ID) private locale: string,
    private toastr: ToastrService
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

      item: [''],
      fiscalyear: [''],
      date: [''],
      store: [''],
    });
  }

  getsearch(code: any) {
    if (code.keyCode == 13) {
      this.getAllMasterForms();
    }
  }

  getAllMasterForms() {
    this.api.getStrEmployeeOpen().subscribe({
      next: (res) => {
        console.log('response of get all getGroup from api: ', res);
        this.dataSource2 = new MatTableDataSource(res);
        this.dataSource2.paginator = this.paginator;
        this.dataSource2.sort = this.sort;
        this.groupMasterForm.reset();
      },
      error: () => {
        // alert('خطأ أثناء جلب سجلات المجموعة !!');
      },
    });
  }
  openEmployeeingStockDialog() {
    this.dialog
      .open(STREmployeeOpeningCustodyDialogComponent, {
        width: '98%',
        height: '95%',
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
        width: '98%',
        height: '95%',
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

  // deleteBothForms(id: number) {
  //   var result = confirm('تاكيد الحذف ؟ ');

  //   this.http.get<any>("http://ims.aswan.gov.eg/api/STREmployeeOpeningCustodyDetails/get/all")
  //     .subscribe(res => {
  //       this.matchedIds = res.filter((a: any) => {
  //         console.log("matched Id &  : ", a.custodyId === id)
  //         return a.custodyId === id
  //       });

  //       alert("تم حذف الاذن بنجاح");

  //       // var result = confirm("هل ترغب بتاكيد حذف التفاصيل و الرئيسي؟");

  //       // if (this.matchedIds.length) {
  //       //   for (let i = 0; i < this.matchedIds.length; i++) {

  //       //     console.log("matchedIds details in loop: ", this.matchedIds[i].id)

  //       //     if (result) {
  //       //       this.api. deleteStrEmployeeOpenDetails(this.matchedIds[i].id)
  //       //         .subscribe({
  //       //           next: (res) => {
  //       //             // alert("تم الحذف التفاصيل بنجاح");

  //       //             // var resultMaster = confirm("هل ترغب بتاكيد حذف الرئيسي؟");
  //       //             // if (resultMaster) {
  //       //             console.log("master id to be deleted: ", id)

  //       //             this.api.deleteStrEmployeeOpen(id)
  //       //               .subscribe({
  //       //                 next: (res) => {
  //       //                   // alert("تم حذف الرئيسي بنجاح");
  //       //                   this.toastrDeleteSuccess();
  //       //                   this.getAllMasterForms();
  //       //                 },
  //       //                 error: () => {
  //       //                   alert("خطأ أثناء حذف الرئيسي !!");
  //       //                 }
  //       //               })
  //       //             // }

  //       //           },
  //       //           error: () => {
  //       //             alert("خطأ أثناء حذف التفاصيل !!");
  //       //           }
  //       //         })
  //       //     }

  //       //   }
  //       // }
  //       // else {
  //       //   if (result) {
  //       //     console.log("master id to be deleted: ", id)

  //       //     this.api.deleteStrEmployeeOpen(id)
  //       //       .subscribe({
  //       //         next: (res) => {
  //       //           // alert("تم حذف الرئيسي بنجاح");
  //       //           this.toastrDeleteSuccess();
  //       //           this.getAllMasterForms();
  //       //         },
  //       //         error: () => {
  //       //           alert("خطأ أثناء حذف الرئيسي !!");
  //       //         }
  //       //       })
  //       //   }
  //       // }

  //     }, (err) => {
  //       alert('خطا اثناء تحديد المجموعة !!');
  //     }
  //     );
  //     this.toastrDeleteSuccess();
  //     this.getAllMasterForms();

  //   }
  // ref(){
  //   let selet: any = document.querySelectorAll('mat-select');
  //   selet.value ="";
  // }

  deleteBothForms(id: number) {
    var result = confirm('تاكيد الحذف ؟ ');
    console.log(' id in delete:', id);
    if (result) {
      this.api.deleteStrEmployeeOpen(id).subscribe({
        next: (res) => {
          this.http
            .get<any>(
              'http://ims.aswan.gov.eg/api/STREmployeeOpeningCustodyDetails/get/all'
            )
            .subscribe(
              (res) => {
                this.matchedIds = res.filter((a: any) => {
                  // console.log("matched Id & HeaderId : ", a.HeaderId === id)
                  return a.custodyId === id;
                });

                // for (let i = 0; i < this.matchedIds.length; i++) {
                //   this.deleteFormDetails(this.matchedIds[i].id);
                // }
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
    this.api.getItems().subscribe({
      next: (res) => {
        this.itemList = res;
        console.log('item res: ', this.itemList);
      },
      error: (err) => {
        console.log('fetch employees data err: ', err);
        // alert("خطا اثناء جلب الموظفين !");
      },
    });
  }
  getcostCenter() {
    this.api.getCostCenter().subscribe({
      next: (res) => {
        this.costCentersList = res;
        console.log('item res: ', this.itemList);
      },
      error: (err) => {
        console.log('fetch employees data err: ', err);
        // alert("خطا اثناء جلب الموظفين !");
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

  getSearchStrOpen(no: any, date: any, itemId: any) {
    console.log('no. : ', no, 'item : ', itemId, 'date: ', date);

    let costCenterId = this.groupMasterForm.getRawValue().costCenterId;
    let employeeId = this.groupMasterForm.getRawValue().employeeId;

    this.api
      .getStrEmployeeOpenSearach(no, costCenterId, employeeId, date, itemId)
      .subscribe({
        next: (res) => {
          console.log('search employeeExchange 4res: ', res);

          this.dataSource2 = res;
          this.dataSource2.paginator = this.paginator;
          this.dataSource2.sort = this.sort;
          // this.api.getStrOpenSearach(no, store, date, fiscalYear).subscribe({
          //   next: (res) => {
          //     console.log('search openingStock res: ', res);

          //     //enter no.
          //     if (no != '' && !store && !date && !fiscalYear) {
          //       // console.log("enter no. ")
          //       // console.log("no. : ", no, "store: ", store, "date: ", date)
          //       this.dataSource2 = res.filter((res: any) => res.no == no!);
          //       this.dataSource2.paginator = this.paginator;
          //       this.dataSource2.sort = this.sort;
          //     }

          //     //enter store
          //     else if (!no && store && !date && !fiscalYear) {
          //       // console.log("enter store. ")
          //       // console.log("enter no. & store & date ", "res : ", res, "input no. : ", no, "input store: ", store, "input date: ", date)
          //       this.dataSource2 = res.filter((res: any) => res.storeId == store);
          //       this.dataSource2.paginator = this.paginator;
          //       this.dataSource2.sort = this.sort;
          //     }

          //     //enter date
          //     else if (!no && !store && date && !fiscalYear) {
          //       // console.log("enter date. ")
          //       // console.log("enter no. & store & date ", "res : ", res, "input no. : ", no, "input store: ", store, "input date: ", date)
          //       this.dataSource2 = res.filter(
          //         (res: any) => formatDate(res.date, 'M/d/yyyy', this.locale) == date
          //       );
          //       this.dataSource2.paginator = this.paginator;
          //       this.dataSource2.sort = this.sort;
          //     }

          //     //enter fiscalYear
          //     else if (!no && !store && !date && fiscalYear) {
          //       // console.log("enter date. ")
          //       // console.log("enter no. & store & date ", "res : ", res, "input no. : ", no, "input store: ", store, "input date: ", date)
          //       this.dataSource2 = res.filter(
          //         (res: any) => res.fiscalyear == fiscalYear
          //       );
          //       this.dataSource2.paginator = this.paginator;
          //       this.dataSource2.sort = this.sort;
          //     }

          //     //enter no. & store
          //     else if (no && store && !date && !fiscalYear) {
          //       // console.log("enter no & store ")
          //       // console.log("enter no. & store & date ", "res : ", res, "input no. : ", no, "input store: ", store, "input date: ", date)
          //       this.dataSource2 = res.filter(
          //         (res: any) => res.no == no! && res.storeId == store
          //       );
          //       this.dataSource2.paginator = this.paginator;
          //       this.dataSource2.sort = this.sort;
          //     }

          //     //enter no. & date
          //     else if (no && !store && date && !fiscalYear) {
          //       // console.log("enter no & date ")
          //       // console.log("enter no. & store & date ", "res : ", res, "input no. : ", no, "input store: ", store, "input date: ", date)
          //       this.dataSource2 = res.filter(
          //         (res: any) =>
          //           res.no == no! &&
          //           formatDate(res.date, 'M/d/yyyy', this.locale) == date
          //       );
          //       this.dataSource2.paginator = this.paginator;
          //       this.dataSource2.sort = this.sort;
          //     }

          //     //enter store & date
          //     else if (!no && store && date && !fiscalYear) {
          //       // console.log("enter store & date ")
          //       // console.log("enter no. & store & date ", "res : ", res, "input no. : ", no, "input store: ", store, "input date: ", date)
          //       this.dataSource2 = res.filter(
          //         (res: any) =>
          //           res.storeId == store &&
          //           formatDate(res.date, 'M/d/yyyy', this.locale) == date
          //       );
          //       this.dataSource2.paginator = this.paginator;
          //       this.dataSource2.sort = this.sort;
          //     }

          //     //enter all data
          //     else if (no != '' && store != '' && date != '' && fiscalYear != '') {
          //       // console.log("enter all data. ")
          //       // console.log("enter no. & store & date ", "res : ", res, "input no. : ", no, "input store: ", store, "input date: ", date)
          //       this.dataSource2 = res.filter(
          //         (res: any) =>
          //           res.no == no! &&
          //           res.storeId == store &&
          //           formatDate(res.date, 'M/d/yyyy', this.locale) == date &&
          //           res.fiscalyear == fiscalYear
          //       );
          //       this.dataSource2.paginator = this.paginator;
          //       this.dataSource2.sort = this.sort;
          //     }

          //     //didn't enter any data
          //     else {
          //       // console.log("enter no data ")
          //       this.dataSource2 = res;
          //       this.dataSource2.paginator = this.paginator;
          //       this.dataSource2.sort = this.sort;
          //     }
          //   },
          //   error: (err) => {
          //     alert('Error');
          //   },
          // });
        },
        error: (err) => {
          // alert("Error")
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

  printReport(no: any, store: any, date: any, fiscalYear: any) {
    console.log(
      'no. : ',
      no,
      'store : ',
      store,
      'date: ',
      date,
      'fiscalYear: ',
      fiscalYear
    );
    // this.api.getStrOpenSearach(no, store, date, fiscalYear).subscribe({
    //   next: (res) => {
    //     console.log('search openingStock res: ', res);

    //     //enter no.
    //     if (no != '' && !store && !date && !fiscalYear) {
    //       // console.log("enter no. ")
    //       // console.log("no. : ", no, "store: ", store, "date: ", date)
    //       this.dataSource2 = res.filter((res: any) => res.no == no!);
    //       this.dataSource2.paginator = this.paginator;
    //       this.dataSource2.sort = this.sort;
    //     }

    //     //enter store
    //     else if (!no && store && !date && !fiscalYear) {
    //       // console.log("enter store. ")
    //       // console.log("enter no. & store & date ", "res : ", res, "input no. : ", no, "input store: ", store, "input date: ", date)
    //       this.dataSource2 = res.filter((res: any) => res.storeId == store);
    //       this.dataSource2.paginator = this.paginator;
    //       this.dataSource2.sort = this.sort;
    //     }

    //     //enter date
    //     else if (!no && !store && date && !fiscalYear) {
    //       // console.log("enter date. ")
    //       // console.log("enter no. & store & date ", "res : ", res, "input no. : ", no, "input store: ", store, "input date: ", date)
    //       this.dataSource2 = res.filter(
    //         (res: any) => formatDate(res.date, 'M/d/yyyy', this.locale) == date
    //       );
    //       this.dataSource2.paginator = this.paginator;
    //       this.dataSource2.sort = this.sort;
    //     }

    //     //enter fiscalYear
    //     else if (!no && !store && !date && fiscalYear) {
    //       // console.log("enter date. ")
    //       // console.log("enter no. & store & date ", "res : ", res, "input no. : ", no, "input store: ", store, "input date: ", date)
    //       this.dataSource2 = res.filter(
    //         (res: any) => res.fiscalyear == fiscalYear
    //       );
    //       this.dataSource2.paginator = this.paginator;
    //       this.dataSource2.sort = this.sort;
    //     }

    //     //enter no. & store
    //     else if (no && store && !date && !fiscalYear) {
    //       // console.log("enter no & store ")
    //       // console.log("enter no. & store & date ", "res : ", res, "input no. : ", no, "input store: ", store, "input date: ", date)
    //       this.dataSource2 = res.filter(
    //         (res: any) => res.no == no! && res.storeId == store
    //       );
    //       this.dataSource2.paginator = this.paginator;
    //       this.dataSource2.sort = this.sort;
    //     }

    //     //enter no. & date
    //     else if (no && !store && date && !fiscalYear) {
    //       // console.log("enter no & date ")
    //       // console.log("enter no. & store & date ", "res : ", res, "input no. : ", no, "input store: ", store, "input date: ", date)
    //       this.dataSource2 = res.filter(
    //         (res: any) =>
    //           res.no == no! &&
    //           formatDate(res.date, 'M/d/yyyy', this.locale) == date
    //       );
    //       this.dataSource2.paginator = this.paginator;
    //       this.dataSource2.sort = this.sort;
    //     }

    //     //enter store & date
    //     else if (!no && store && date && !fiscalYear) {
    //       // console.log("enter store & date ")
    //       // console.log("enter no. & store & date ", "res : ", res, "input no. : ", no, "input store: ", store, "input date: ", date)
    //       this.dataSource2 = res.filter(
    //         (res: any) =>
    //           res.storeId == store &&
    //           formatDate(res.date, 'M/d/yyyy', this.locale) == date
    //       );
    //       this.dataSource2.paginator = this.paginator;
    //       this.dataSource2.sort = this.sort;
    //     }

    //     //enter all data
    //     else if (no != '' && store != '' && date != '' && fiscalYear != '') {
    //       // console.log("enter all data. ")
    //       // console.log("enter no. & store & date ", "res : ", res, "input no. : ", no, "input store: ", store, "input date: ", date)
    //       this.dataSource2 = res.filter(
    //         (res: any) =>
    //           res.no == no! &&
    //           res.storeId == store &&
    //           formatDate(res.date, 'M/d/yyyy', this.locale) == date &&
    //           res.fiscalyear == fiscalYear
    //       );
    //       this.dataSource2.paginator = this.paginator;
    //       this.dataSource2.sort = this.sort;
    //     }

    //     //didn't enter any data
    //     else {
    //       // console.log("enter no data ")
    //       this.dataSource2 = res;
    //       this.dataSource2.paginator = this.paginator;
    //       this.dataSource2.sort = this.sort;
    //     }

    //  this.loadDataToLocalStorage(res);
    //   },
    //   error: (err) => {
    //     alert('Error');
    //   },
    // });
    // this.loadAllData();
    // let header: any = document.getElementById('header');
    // let paginator: any = document.getElementById('paginator');
    // let action1: any = document.getElementById('action1');
    // let action2: any = document.querySelectorAll('action2');
    // console.log(action2);
    // let button1: any = document.querySelectorAll('#button1');
    // console.log(button1);
    // let button2: any = document.getElementById('button2');
    // let button: any = document.getElementsByClassName('mdc-icon-button');
    // console.log(button);
    // let reportFooter: any = document.getElementById('reportFooter');
    // let date: any = document.getElementById('date');
    // header.style.display = 'grid';
    // paginator.style.display = 'none';
    // action1.style.display = 'none';
    // // button1.style.display = 'none';
    // // button2.style.display = 'none';
    // for (let index = 0; index < button.length; index++) {
    //   let element = button[index];

    //   element.hidden = true;
    // }
    // // reportFooter.style.display = 'block';
    // // date.style.display = 'block';
    // let printContent: any = document.getElementById('content')?.innerHTML;
    // let originalContent: any = document.body.innerHTML;
    // document.body.innerHTML = printContent;
    // // console.log(document.body.children);
    // document.body.style.cssText =
    //   'direction:rtl;-webkit-print-color-adjust:exact;';
    // window.print();
    // document.body.innerHTML = originalContent;
    // location.reload();
  }

  loadDataToLocalStorage(data: any): void {
    window.localStorage.setItem('reportData', JSON.stringify(data));
    // window.localStorage.setItem('reportName', JSON.stringify(this.reportName));
  }
}
