import { Component, Inject, LOCALE_ID, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from '../../services/api.service';
import { MatDialog } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { StrEmployeeExchangeDialogComponent } from '../str-employee-exchange-dialog/str-employee-exchange-dialog.component';
import { formatDate } from '@angular/common';
import { Observable, map, startWith, tap } from 'rxjs';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { EmployeeExchangePrintDialogComponent } from '../employee-exchange-print-dialog/employee-exchange-print-dialog.component';
import { HotkeysService } from 'angular2-hotkeys';
import { Hotkey } from 'angular2-hotkeys';
import {
  FormControl,
  FormControlName,
  FormBuilder,
  FormGroup,
} from '@angular/forms';

export class Employee {
  constructor(public id: number, public name: string, public code: string) {}
}

export class costcenter {
  constructor(public id: number, public name: string) {}
}

export class distEmployee {
  constructor(public id: number, public name: string, public code: string) {}
}

export class item {
  constructor(public id: number, public name: string) {}
}

@Component({
  selector: 'app-str-employee-exchange-table',
  templateUrl: './str-employee-exchange-table.component.html',
  styleUrls: ['./str-employee-exchange-table.component.css'],
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

loading :boolean=false;

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

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private api: ApiService,
    private dialog: MatDialog,
    private hotkeysService: HotkeysService,
    private formBuilder: FormBuilder,
    private http: HttpClient,
    @Inject(LOCALE_ID) private locale: string,
    private toastr: ToastrService
  ) {
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

    this.distEmployeeCtrl = new FormControl();
    this.filtereddistEmployee = this.distEmployeeCtrl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filterdistEmployees(value))
    );
  }

  ngOnInit(): void {
    this.getAllMasterForms();
    this.getStores();
    this.getFiscalYears();
    this.getEmployees();
    this.getDistEmployees();
    this.getItems();

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

  openEmployeeExchangeDialog() {
    this.dialog
      .open(StrEmployeeExchangeDialogComponent, {
        width: '98%',
        height: '85%',
      })
      .afterClosed()
      .subscribe((val) => {
        if (val === 'save') {
          this.getAllMasterForms();
        }
      });
  }

  getAllMasterForms() {
    this.api.getStrEmployeeExchange().subscribe({
      next: (res) => {
        console.log("get all data: ", res);
        this.dataSource2 = new MatTableDataSource(res);
        this.dataSource2.paginator = this.paginator;
        this.dataSource2.sort = this.sort;
        this.groupMasterForm.reset();
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

  editMasterForm(row: any) {
    // this.dialog
    //   .open(StrEmployeeExchangeDialogComponent, {
    //     width: '60%',
    //     data: row,
    //   })
    //   .afterClosed()
    //   .subscribe((val) => {
    //     if (val === 'update' || val === 'save') {
    //       this.getAllMasterForms();
    //     }
    //   });
    this.dialog
      .open(StrEmployeeExchangeDialogComponent, {
        width: '95%',
        height: '80%',
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

  getFiscalYears() {
    this.api.getFiscalYears().subscribe({
      next: (res) => {
        this.fiscalYearsList = res;
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
      },
      error: (err) => {
        // console.log("fetch employees data err: ", err);
        // alert("خطا اثناء جلب الموظفين !");
      },
    });
  }

  getItems() {
    this.api.getItem().subscribe({
      next: (res) => {
        this.itemsList = res;
        console.log('itemss res: ', this.itemsList);
      },
      error: (err) => {
        // console.log("fetch store data err: ", err);
        // alert("خطا اثناء جلب المخازن !");
      },
    });
  }

  getDistEmployees() {
    this.api.getHrEmployees().subscribe({
      next: (res) => {
        this.distEmployeesList = res;
      },
      error: (err) => {
        // console.log("fetch employees data err: ", err);
        // alert("خطا اثناء جلب الموظفين !");
      },
    });
  }

  getCostCenters() {
    this.api.getFiCostCenter().subscribe({
      next: (res) => {
        this.costcentersList = res;
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
    return this.employeesList.filter(
      (employee) => employee.name.toLowerCase().includes(filterValue),
      console.log('employee in filteremployee:', this.employeesList)
    );
  }
  openAutoEmployee() {
    this.employeeCtrl.setValue(''); // Clear the input field value

    // Open the autocomplete dropdown by triggering the value change event
    this.employeeCtrl.updateValueAndValidity();
  }

  //////distemployee
  displaydistEmployeeName(distEmployee: any): string {
    return distEmployee && distEmployee.name ? distEmployee.name : '';
  }
  distEmployeeSelected(event: MatAutocompleteSelectedEvent): void {
    const distEmployee = event.option.value as distEmployee;
    console.log('distEmployee selected: ', distEmployee);
    this.selecteddistEmployee = distEmployee;
    this.groupMasterForm.patchValue({ distEmployeeId: distEmployee.id });
    console.log(
      'distEmployee in form: ',
      this.groupMasterForm.getRawValue().distEmployeeId
    );
    if(this.groupMasterForm.getRawValue().destEmployeeId==this.groupMasterForm.getRawValue().employeeId){
      this.toastrSelectSameEmpolyee()
    }
  }
    // this.getSearchStrWithdraw()
    // this.set_store_Null(this.groupMasterForm.getRawValue().distEmployeeId);
    // return     this.groupMasterForm.patchValue({ distEmployeeId: distEmployee.id });
 
  private _filterdistEmployees(value: string): distEmployee[] {
    const filterValue = value;
    return this.distEmployeesList.filter((distEmployee) =>
      distEmployee.name.toLowerCase().includes(filterValue)
    );
  }
  openAutodistEmployee() {
    this.distEmployeeCtrl.setValue(''); // Clear the input field value

    // Open the autocomplete dropdown by triggering the value change event
    this.distEmployeeCtrl.updateValueAndValidity();
  }

  getSearchStrOpen(no: any, StartDate: any, EndDate: any, fiscalyear: any) {
    console.log('fiscal year in ts:', fiscalyear);
    let costCenterId = this.groupMasterForm.getRawValue().costCenterId;
    let employeeId = this.groupMasterForm.getRawValue().employeeId;
    let distEmployee = this.groupMasterForm.getRawValue().distEmployeeId;
    let item = this.groupDetailsForm.getRawValue().itemId;
this.loading=true;
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
          this.loading=false;
          this.dataSource2 = res;
          this.dataSource2.paginator = this.paginator;
          this.dataSource2.sort = this.sort;
        },
        error: (err) => {
          this.loading=false;
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
      this.loading =true;
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
            this.loading=false;
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
            this.loading=false;
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
}
