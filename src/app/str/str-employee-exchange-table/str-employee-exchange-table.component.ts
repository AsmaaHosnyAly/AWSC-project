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

import { FormControl, FormControlName,FormBuilder,FormGroup } from '@angular/forms';

export class Employee {
  constructor(public id: number, public name: string, public code: string) { }
}

export class costcenter {
  constructor(public id: number, public name: string) { }
}

export class distEmployee {
  constructor(public id: number, public name: string, public code: string) { }
}



@Component({
  selector: 'app-str-employee-exchange-table',
  templateUrl: './str-employee-exchange-table.component.html',
  styleUrls: ['./str-employee-exchange-table.component.css']
})
export class StrEmployeeExchangeTableComponent implements OnInit {
  displayedColumns: string[] = ['no', 'fiscalyear', 'employeeName', 'destEmployeeName', 'costCenterName', 'date', 'Action'];
  matchedIds: any;
  storeList: any;
  storeName: any;
  fiscalYearsList: any;
  // employeesList: any;
  // costCentersList: any;
  groupMasterForm !: FormGroup;



  costcentersList: costcenter[] = [];
  costcenterCtrl: FormControl<any>;
  filteredcostcenter: Observable<costcenter[]>;
  selectedcostcenter: costcenter | undefined;



  employeesList: Employee[] = [];
  employeeCtrl: FormControl<any>;
  filteredEmployee: Observable<Employee[]>;
  selectedEmployee: Employee | undefined;


  distEmployeesList: distEmployee[] = [];
  distEmployeeCtrl: FormControl<any>;
  filtereddistEmployee: Observable<distEmployee[]>;
  selecteddistEmployee: distEmployee | undefined;



  dataSource2!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private api: ApiService,
    private dialog: MatDialog,private formBuilder: FormBuilder,
    private http: HttpClient,
    @Inject(LOCALE_ID) private locale: string,
    private toastr: ToastrService) {


      this.costcenterCtrl = new FormControl();
      this.filteredcostcenter = this.costcenterCtrl.valueChanges.pipe(
        startWith(''),
        map(value => this._filtercostcenters(value))
      );
  
  
  
      this.employeeCtrl = new FormControl();
      this.filteredEmployee = this.employeeCtrl.valueChanges.pipe(
        startWith(''),
        map(value => this._filteremployees(value))
      );


      this.distEmployeeCtrl = new FormControl();
      this.filtereddistEmployee = this.distEmployeeCtrl.valueChanges.pipe(
        startWith(''),
        map(value => this._filterdistEmployees(value))
      );


  }

  ngOnInit(): void {
    this.getAllMasterForms();
    this.getStores();
    this.getFiscalYears();
    this.getEmployees();
    this.getCostCenters();

    this.groupMasterForm = this.formBuilder.group({
      no:[''],
      employee:[''],
      costcenter:[],
      costCenterId:[],

      storeId:[''],
      itemId:[''],
      distEmployeeId:[''],
      item:[''],
      fiscalyear:[''],
      date:[''],
      store:[''],
      distEmployee:['']
       });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource2.filter = filterValue.trim().toLowerCase();

    if (this.dataSource2.paginator) {
      this.dataSource2.paginator.firstPage();
    }
  }

  openEmployeeExchangeDialog() {
    this.dialog.open(StrEmployeeExchangeDialogComponent, {
      width: '60%'
    }).afterClosed().subscribe(val => {
      if (val === 'save') {
        this.getAllMasterForms();
      }
    })
  }

  getAllMasterForms() {
    this.api.getStrEmployeeExchange()
      .subscribe({
        next: (res) => {
          this.dataSource2 = new MatTableDataSource(res);
          this.dataSource2.paginator = this.paginator;
          this.dataSource2.sort = this.sort;
          this.groupMasterForm.reset();

        },
        error: () => {
          // alert("خطأ أثناء جلب سجلات المجموعة !!");
        }
      })


  }

  getStores() {
    this.api.getStore()
      .subscribe({
        next: (res) => {
          this.storeList = res;
        },
        error: (err) => {
          // console.log("fetch store data err: ", err);
          // alert("خطا اثناء جلب المخازن !");
        }
      })
  }

  editMasterForm(row: any) {
    this.dialog.open(StrEmployeeExchangeDialogComponent, {
      width: '60%',
      data: row
    }).afterClosed().subscribe(val => {
      if (val === 'update' || val === 'save') {
        this.getAllMasterForms();
      }
    })
  }

  deleteBothForms(id: number) {

    this.http.get<any>("http://ims.aswan.gov.eg/api/STREmployeeExchangeDetails/get/all")
      .subscribe(res => {
        this.matchedIds = res.filter((a: any) => {
          return a.employee_ExchangeId === id
        })
        var result = confirm("هل ترغب بتاكيد حذف التفاصيل و الرئيسي؟");

        if (this.matchedIds.length) {
          for (let i = 0; i < this.matchedIds.length; i++) {
            if (result) {
              this.api.deleteStrEmployeeExchangeDetails(this.matchedIds[i].id)
                .subscribe({
                  next: (res) => {

                    this.api.deleteStrEmployeeExchange(id)
                      .subscribe({
                        next: (res) => {
                          this.toastrDeleteSuccess();
                          this.getAllMasterForms();
                        },
                        error: () => {
                          // alert("خطأ أثناء حذف الرئيسي !!");
                        }
                      })

                  },
                  error: () => {
                    // alert("خطأ أثناء حذف التفاصيل !!");
                  }
                })
            }

          }
        }
        else {
          if (result) {
            this.api.deleteStrEmployeeExchange(id)
              .subscribe({
                next: (res) => {
                  this.toastrDeleteSuccess();
                  this.getAllMasterForms();
                },
                error: () => {
                  // alert("خطأ أثناء حذف الرئيسي !!");
                }
              })
          }
        }

      }, err => {
        // alert("خطا اثناء تحديد المجموعة !!")
      })

  }

  getFiscalYears() {
    this.api.getFiscalYears()
      .subscribe({
        next: (res) => {
          this.fiscalYearsList = res;
        },
        error: (err) => {
          // console.log("fetch fiscalYears data err: ", err);
          // alert("خطا اثناء جلب العناصر !");
        }
      })
  }

  getEmployees() {
    this.api.getHrEmployees()
      .subscribe({
        next: (res) => {
          this.employeesList = res;
        },
        error: (err) => {
          // console.log("fetch employees data err: ", err);
          // alert("خطا اثناء جلب الموظفين !");
        }
      })
  }

  getCostCenters() {
    this.api.getFiCostCenter()
      .subscribe({
        next: (res) => {
          this.costcentersList = res;
        },
        error: (err) => {
          // console.log("fetch costCenter data err: ", err);
          // alert("خطا اثناء جلب مراكز التكلفة !");
        }
      })
  }
  getsearch(code:any){
    if (code.keyCode == 13) {
      this.getAllMasterForms();
     }
  }

  displaycostcenterName(costcenter: any): string {
    return costcenter && costcenter.name ? costcenter.name : '';
  }
  costcenterSelected(event: MatAutocompleteSelectedEvent): void {
    const costcenter = event.option.value as costcenter;
    console.log("costcenter selected: ", costcenter);
    this.selectedcostcenter = costcenter;
    this.groupMasterForm.patchValue({ costCenterId: costcenter.id });
    console.log("costcenter in form: ", this.groupMasterForm.getRawValue().costCenterId);

    // this.getSearchStrWithdraw()
    // this.set_store_Null(this.groupMasterForm.getRawValue().costCenterId);
    // return     this.groupMasterForm.patchValue({ costCenterId: costcenter.id });

  }
  private _filtercostcenters(value: string): costcenter[] {
    const filterValue = value;
    return this.costcentersList.filter(costcenter =>
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
    console.log("employee selected: ", employee);
    this.selectedEmployee = employee;
    this.groupMasterForm.patchValue({ employeeId: employee.id });
    console.log("employee in form: ", this.groupMasterForm.getRawValue().employeeId);

    // this.getSearchStrWithdraw()
    // this.set_store_Null(this.groupMasterForm.getRawValue().employeeId);
    // return     this.groupMasterForm.patchValue({ employeeId: employee.id });

  }
  private _filteremployees(value: string): Employee[] {
    const filterValue = value;
    return this.employeesList.filter(employee =>
      employee.name.toLowerCase().includes(filterValue) 
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
    console.log("distEmployee selected: ", distEmployee);
    this.selecteddistEmployee = distEmployee;
    this.groupMasterForm.patchValue({ distEmployeeId: distEmployee.id });
    console.log("distEmployee in form: ", this.groupMasterForm.getRawValue().distEmployeeId);

    // this.getSearchStrWithdraw()
    // this.set_store_Null(this.groupMasterForm.getRawValue().distEmployeeId);
    // return     this.groupMasterForm.patchValue({ distEmployeeId: distEmployee.id });

  }
  private _filterdistEmployees(value: string): distEmployee[] {
    const filterValue = value;
    return this.distEmployeesList.filter(distEmployee =>
      distEmployee.name.toLowerCase().includes(filterValue) 
    );
  }
  openAutodistEmployee() {
    this.distEmployeeCtrl.setValue(''); // Clear the input field value

    // Open the autocomplete dropdown by triggering the value change event
    this.distEmployeeCtrl.updateValueAndValidity();

  }


  getSearchStrOpen(no: any,  date: any) {

    let costCenterId=this.groupMasterForm.getRawValue().costCenterId
    let employeeId=this.groupMasterForm.getRawValue().employeeId
    let distEmployee=this.groupMasterForm.getRawValue().distEmployeeId


    this.api.getStrEmployeeExchangeSearach(no, costCenterId, employeeId, date, distEmployee)
      .subscribe({
        next: (res) => {
          this.dataSource2 = res
          this.dataSource2.paginator = this.paginator;
          this.dataSource2.sort = this.sort;
        },
        error: (err) => {
          // alert("Error")
        }
      })
  }

  toastrDeleteSuccess(): void {
    this.toastr.success("تم الحذف بنجاح");
  }












  
}