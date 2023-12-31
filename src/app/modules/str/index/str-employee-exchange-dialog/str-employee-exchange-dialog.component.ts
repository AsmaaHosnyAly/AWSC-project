import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ApiService } from '../../services/api.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { MatTableDataSource } from '@angular/material/table';
import { ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Observable, map, startWith, debounceTime } from 'rxjs';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { StrEmployeeExchangeDetailsDialogComponent } from '../str-employee-exchange-details-dialog/str-employee-exchange-details-dialog.component';
import { Router } from '@angular/router';
import { HotkeysService } from 'angular2-hotkeys';
import { Hotkey } from 'angular2-hotkeys';
export class FiscalYear {
  constructor(public id: number, public fiscalyear: string) { }
}

export class Employee {
  constructor(public id: number, public name: string, public code: string) { }
}

export class CostCenter {
  constructor(public id: number, public name: string, public code: string) { }
}

export class Item {
  constructor(public id: number, public name: string, public no: string, public fullCode: string) { }
}

@Component({
  selector: 'app-str-employee-exchange-dialog',
  templateUrl: './str-employee-exchange-dialog.component.html',
  styleUrls: ['./str-employee-exchange-dialog.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StrEmployeeExchangeDialogComponent implements OnInit {
  groupDetailsForm !: FormGroup;
  groupMasterForm !: FormGroup;
  actionBtnMaster: string = "Save";
  actionBtnDetails: string = "Save";
  MasterGroupInfoEntered = false;
  dataSource!: MatTableDataSource<any>;
  matchedIds: any;
  getDetailedRowData: any;
  sumOfTotals = 0;
  getMasterRowId: any;
  getDetailsRowId: any;
  storeList: any;
  // employeesList: any;
  // distEmployeesList: any;
  // costCentersList: any;
  // itemsList: any;
  // fiscalYearsList: any;
  storeName: any;
  itemName: any;
  userIdFromStorage: any;
  deleteConfirmBtn: any;
  dialogRefDelete: any;
  autoNo: any;
  fiscalYearName: any;
  employeeName: any;
  distEmployeeName: any;
  defaultFiscalYearSelectValue: any;
  currentDate: any;
  stateDefaultValue: any;
  loading:boolean=false;
  

  fiscalYearsList: FiscalYear[] = [];
  fiscalYearCtrl: FormControl;
  filteredFiscalYear: Observable<FiscalYear[]>;
  selectedFiscalYear: FiscalYear | undefined;
  formcontrol = new FormControl('');

  employeesList: Employee[] = [];
  emploeeCtrl: FormControl;
  filteredEmployee: Observable<Employee[]>;
  selectedEmployee: Employee | undefined;

  // distEmployeesList: Employee[] = [];
  distEmploeeCtrl: FormControl;
  filtereddistEmployee: Observable<Employee[]>;
  selecteddistEmployee: Employee | undefined;

  costCentersList: CostCenter[] = [];
  costCenterCtrl: FormControl;
  filteredcostCenter: Observable<CostCenter[]>;
  selectedcostCenter: CostCenter | undefined;


  itemsList: Item[] = [];
  itemsCtrl: FormControl;
  filtereditems: Observable<Item[]>;
  selecteditems: Item | undefined;

  displayedColumns: string[] = ['itemName', 'state', 'price', 'qty', 'total', 'action'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private formBuilder: FormBuilder,
    private api: ApiService,
    private hotkeysService: HotkeysService,
    @Inject(MAT_DIALOG_DATA) public editData: any,
    @Inject(MAT_DIALOG_DATA) public editDataDetails: any,
    private http: HttpClient,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<StrEmployeeExchangeDialogComponent>,
    private toastr: ToastrService,
    private cdr: ChangeDetectorRef,
    private router: Router) {

    this.currentDate = new Date;
    this.stateDefaultValue = 'جديد';

    this.fiscalYearCtrl = new FormControl();
    this.filteredFiscalYear = this.fiscalYearCtrl.valueChanges.pipe(
      startWith(''),
      map(value => this._filterFiscalYears(value))
    );

    this.emploeeCtrl = new FormControl();
    this.filteredEmployee = this.emploeeCtrl.valueChanges.pipe(
      startWith(''),
      map(value => this._filterEmployees(value))
    );

    this.distEmploeeCtrl = new FormControl();
    this.filtereddistEmployee = this.distEmploeeCtrl.valueChanges.pipe(
      startWith(''),
      map(value => this._filterDistEmployees(value))
    );

    this.costCenterCtrl = new FormControl();
    console.log("oninit: ", this.costCenterCtrl)
    this.filteredcostCenter = this.costCenterCtrl.valueChanges.pipe(
      startWith(''),
      map(value => this._filterCostCenter(value))
    );

    this.itemsCtrl = new FormControl();
    this.filtereditems = this.itemsCtrl.valueChanges.pipe(
      startWith(''),
      debounceTime(300), // Adjust the debounce time (in milliseconds) to your preference
      map((value) => this._filterItems(value))
    );

  }


  ngOnInit(): void {
    this.getStores();
    this.getItems();
    this.getFiscalYears();
    this.getEmployees();
    this.getCostCenters();
    this.getStrEmployeeExchangeAutoNo();

    this.getMasterRowId = this.editData;

    this.groupMasterForm = this.formBuilder.group({
      no: ['', Validators.required],
      employeeId: ['', Validators.required],
      destEmployeeId: ['', Validators.required],
      costCenterId: ['', Validators.required],
      transactionUserId: ['', Validators.required],
      date: [this.currentDate, Validators.required],
      fiscalYearId: ['', Validators.required],
      total: ['', Validators.required],
    });

    this.groupDetailsForm = this.formBuilder.group({
      employee_ExchangeId: ['', Validators.required], //MasterId
      qty: ['1', Validators.required],
      price: ['', Validators.required],
      total: ['', Validators.required],
      state: [this.stateDefaultValue, Validators.required],
      percentage: ['', Validators.required],
      transactionUserId: ['', Validators.required],
      itemId: ['', Validators.required],
      itemName: ['', Validators.required],
    });
    this.hotkeysService.add(new Hotkey('ctrl+s', (event: KeyboardEvent): boolean => {
      // Call the deleteGrade() function in the current component
      this.nextToAddFormDetails();
      return false; // Prevent the default browser behavior
    }));


    if (this.editData) {
      this.actionBtnMaster = "Update";
      this.groupMasterForm.controls['no'].setValue(this.editData.no);

      this.groupMasterForm.controls['employeeId'].setValue(this.editData.employeeId);
      this.groupMasterForm.controls['destEmployeeId'].setValue(this.editData.destEmployeeId);
      this.groupMasterForm.controls['costCenterId'].setValue(this.editData.costCenterId);

      this.groupMasterForm.controls['fiscalYearId'].setValue(this.editData.fiscalYearId);
      this.groupMasterForm.controls['date'].setValue(this.editData.date);
      this.groupMasterForm.controls['total'].setValue(this.editData.total);

      this.groupMasterForm.addControl('id', new FormControl('', Validators.required));
      this.groupMasterForm.controls['id'].setValue(this.editData.id);

      console.log("editData: ", this.editData)

    }

    this.getAllDetailsForms();

    this.userIdFromStorage = localStorage.getItem('transactionUserId');

    this.groupMasterForm.controls['transactionUserId'].setValue(this.userIdFromStorage);

  }


  addNewDetails() {
    this.router.navigate(['/employeeOpening'], { queryParams: { masterId: this.getMasterRowId.id } })
    this.dialog.open(StrEmployeeExchangeDetailsDialogComponent, {
      width: '60%',
        height: '85%'
    }).afterClosed().subscribe(val => {
      if (val === 'Save' || val === 'Update') {
        this.getAllDetailsForms();
      }
    })
  }


  getAllMasterForms() {
    this.dialogRef.close('save');
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
  getEmployees() {
    this.loading=true
    this.api.getHrEmployees()
      .subscribe({
        next: (res) => {
          this.loading=false
          this.employeesList = res;
        },
        error: (err) => {
          this.loading=false
          // console.log("fetch employees data err: ", err);
          // alert("خطا اثناء جلب الموظفين !");
        }
      })
  }

  // getEmployeeById(id: any) {
  //   this.api.getHrEmployeeById(id)
  //     .subscribe({
  //       next: (res) => {
  //         this.employeeName = res.name;
  //       },
  //       error: (err) => {
  //         // console.log("fetch fiscalYears data err: ", err);
  //         // alert("خطا اثناء جلب العناصر !");
  //       }
  //     })
  // }

  // getDistEmployeeById(id: any) {
  //   this.api.getHrEmployeeById(id)
  //     .subscribe({
  //       next: (res) => {
  //         this.distEmployeeName = res.name;
  //       },
  //       error: (err) => {
  //         // console.log("fetch fiscalYears data err: ", err);
  //         // alert("خطا اثناء جلب العناصر !");
  //       }
  //     })
  // }

  getCostCenters() {
    this.api.getAllCostCenter()
      .subscribe({
        next: (res) => {
          this.costCentersList = res;
          console.log(" costCenter data : ", this.costCentersList);
        },
        error: (err) => {
          // console.log("fetch costCenter data err: ", err);
          // alert("خطا اثناء جلب مراكز التكلفة !");
        }
      })
  }

  getFiscalYears() {
    this.api.getFiscalYears()
      .subscribe({
        next: (res) => {
          this.fiscalYearsList = res;

          this.api.getLastFiscalYear()
            .subscribe({
              next: async (res) => {
                // this.defaultFiscalYearSelectValue = await this.fiscalYearsList.find((yearList: { fiscalyear: number; }) => yearList.fiscalyear == new Date().getFullYear());
                this.defaultFiscalYearSelectValue = await res;
                console.log("selectedYearggggggggggggggggggg: ", this.defaultFiscalYearSelectValue);
                if (this.editData) {
                  this.groupMasterForm.controls['fiscalYearId'].setValue(this.editData.fiscalYearId);
                }
                else {
                  this.groupMasterForm.controls['fiscalYearId'].setValue(this.defaultFiscalYearSelectValue.id);
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

  getFiscalYearById(id: any) {
    this.api.getFiscalYearById(id)
      .subscribe({
        next: (res) => {
          this.fiscalYearName = res.fiscalyear;
        },
        error: (err) => {
          // console.log("fetch fiscalYears data err: ", err);
          // alert("خطا اثناء جلب العناصر !");
        }
      })
  }

  getAllDetailsForms() {
    if (this.getMasterRowId) {
    
      this.api.getStrEmployeeExchangeDetailsByMasterId(this.getMasterRowId.id)
      .subscribe({
        next: (res) => {
          // this.itemsList = res;
          console.log("enter getAllDetails: ", res)
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
              this.groupMasterForm.controls['total'].setValue(this.sumOfTotals);
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


  async updateMaster() {
    console.log("nnnvvvvvvvvvv: ", this.groupMasterForm.value);
 
    this.groupDetailsForm.controls['transactionUserId'].setValue(this.userIdFromStorage);
    // }


    console.log("update both: ", this.groupDetailsForm.valid, "ooo:", !this.getDetailedRowData);
    console.log("edit : ", this.groupDetailsForm.value)
    this.api.putStrEmployeeExchange(this.groupMasterForm.value)
      .subscribe({
        next: (res) => {
          // if (this.groupDetailsForm.value && this.getDetailedRowData) {
          // this.api.putStrOpenDetails(this.groupDetailsForm.value, this.getDetailedRowData.id)
          //   .subscribe({
          //     next: (res) => {


          // this.toastrSuccess();
          this.groupDetailsForm.reset();
          // this.itemCtrl.setValue('');

          // this.getAllDetailsForms();
          
          this.groupDetailsForm.controls['qty'].setValue(1);
          this.groupDetailsForm.reset();
    
          this.getDetailedRowData = '';
          this.groupDetailsForm.controls['qty'].setValue(1);
          //   },
          //   error: (err) => {
          //     console.log("update err: ", err)
          //     // alert("خطأ أثناء تحديث سجل المجموعة !!")
          //   }
          // })
          // }

        },

      })
    // this.updateBothForms();
    //     }

    //   }

    // }
    // else {
    //   console.log("update d: ", this.groupDetailsForm.valid, "ooo:", !this.getDetailedRowData);

    //   this.updateDetailsForm();
    // }
  }
  

  private _filterFiscalYears(value: string): FiscalYear[] {
    const filterValue = value;
    return this.fiscalYearsList.filter(fiscalyearObj =>
      fiscalyearObj.fiscalyear ? fiscalyearObj.fiscalyear.toLowerCase().includes(filterValue) : '-'
    );
  }
  displayFiscalYearName(fiscalyear: any): string {
    return fiscalyear ? fiscalyear.name && fiscalyear.name != null ? fiscalyear.name : '-' : '';
  }
  fiscalYearSelected(event: MatAutocompleteSelectedEvent): void {
    const fiscalyear = event.option.value as FiscalYear;
    console.log("fiscalyear selected: ", fiscalyear);
    this.selectedFiscalYear = fiscalyear;
    this.groupMasterForm.patchValue({ fiscalYearId: fiscalyear.id });
    console.log("fiscalyear in form: ", this.groupMasterForm.getRawValue().fiscalYearId);
  }
  openAutoFiscalYear() {
    this.fiscalYearCtrl.setValue(''); // Clear the input field value

    // Open the autocomplete dropdown by triggering the value change event
    this.fiscalYearCtrl.updateValueAndValidity();
  }


  displayEmployeeName(employee: any): string {
    return employee ? employee.name && employee.name != null ? employee.name : '-' : '';
  }
  employeeSelected(event: MatAutocompleteSelectedEvent): void {
    const employee = event.option.value as Employee;
    console.log("employee selected: ", employee);
    this.selectedEmployee = employee;
    this.groupMasterForm.patchValue({ employeeId: employee.id });
    console.log("employee in form: ", this.groupMasterForm.getRawValue().employeeId);
    if(this.groupMasterForm.getRawValue().destEmployeeId==this.groupMasterForm.getRawValue().employeeId){
      
      this.emploeeCtrl.reset();
      this.distEmploeeCtrl.reset();
     
      this.groupMasterForm.controls['employeeId'].setValue('');
      this.groupMasterForm.controls['destEmployeeId'].setValue('');
      this.toastrSelectSameEmpolyee()
    }
  }
  private _filterEmployees(value: string): Employee[] {
    const filterValue = value;
    return this.employeesList.filter(employee =>
       employee.name || employee.code ? employee.name.toLowerCase().includes(filterValue) ||
       employee.code.toString().toLowerCase().includes(filterValue): '-'
    );
  }
  openAutoEmployee() {
    this.emploeeCtrl.setValue(''); // Clear the input field value

    // Open the autocomplete dropdown by triggering the value change event
    this.emploeeCtrl.updateValueAndValidity();
  }


  displayDistEmployeeName(DistEmployee: any): string {
    return DistEmployee ? DistEmployee.name && DistEmployee.name != null ? DistEmployee.name : '-' : '';
  }
  distEmployeeSelected(event: MatAutocompleteSelectedEvent): void {
    const distEmployee = event.option.value as Employee;
    console.log("distemployee selected: ", distEmployee);
    this.selecteddistEmployee = distEmployee;
    this.groupMasterForm.patchValue({ destEmployeeId: distEmployee.id });
    console.log("distemployee in form: ", this.groupMasterForm.getRawValue().destEmployeeId);
    if(this.groupMasterForm.getRawValue().destEmployeeId==this.groupMasterForm.getRawValue().employeeId){
     
      this.emploeeCtrl.reset();
      this.distEmploeeCtrl.reset();
      this.groupMasterForm.controls['employeeId'].setValue('');
      this.groupMasterForm.controls['destEmployeeId'].setValue('');
      this.toastrSelectSameEmpolyee()
    }
  }
  private _filterDistEmployees(value: string): Employee[] {
    const filterValue = value;
    return this.employeesList.filter(distEmployee =>
      distEmployee.name || distEmployee.code ? distEmployee.name.toLowerCase().includes(filterValue) ||
      distEmployee.code.toString().toLowerCase().includes(filterValue): '-'
    );
  }
  openAutoDistEmployee() {
    console.log("filtereddistEmployee: ", this.filtereddistEmployee)
    this.distEmploeeCtrl.setValue(''); // Clear the input field value

    // Open the autocomplete dropdown by triggering the value change event
    this.distEmploeeCtrl.updateValueAndValidity();
    console.log("filtereddistEmployee: ", this.distEmploeeCtrl)

  }


  private _filterCostCenter(value: string): CostCenter[] {
    // this.getCostCenters()
    // console.log("value: ", this.costCentersList)
    const filterValue = value;
    return this.costCentersList.filter(costCenter =>
      costCenter.name ? costCenter.name.toLowerCase().includes(filterValue) : '-'
      // costCenter.name || costCenter.code ? costCenter.name.toLowerCase().includes(filterValue) ||
      // costCenter.code.toString().toLowerCase().includes(filterValue): '-'
    );
  }
  displayCostCenterName(CostCenter: any): string {
    return CostCenter ? CostCenter.name && CostCenter.name != null ? CostCenter.name : '-' : '';
  }
  CostCenterSelected(event: MatAutocompleteSelectedEvent): void {
    const fiscalyear = event.option.value as CostCenter;
    console.log("fiscalyear selected: ", fiscalyear);
    this.selectedcostCenter = fiscalyear;
    this.groupMasterForm.patchValue({ costCenterId: fiscalyear.id });
    console.log("fiscalyear in form: ", this.groupMasterForm.getRawValue().costCenterId);
  }
  openAutoCostCenter() {
    console.log("filteredcostCenter: ", this.filteredcostCenter)

    this.costCenterCtrl.setValue(''); // Clear the input field value

    // Open the autocomplete dropdown by triggering the value change event
    this.costCenterCtrl.updateValueAndValidity();
  }


  displayItemName(item: any): string {
    return item ? item.name && item.name != null ? item.name : '-' : '';
  }
  ItemSelected(event: MatAutocompleteSelectedEvent): void {
    const item = event.option.value as Item;
    console.log("item selected: ", item);
    this.selecteditems = item;
    this.groupDetailsForm.patchValue({ itemId: item.id });
    console.log("item in form: ", this.groupDetailsForm.getRawValue().itemId);
  }
  private _filterItems(value: string): Item[] {
    console.log("filter: ", value)
    const filterValue = value;
    return this.itemsList.filter(item =>
      item.name ? item.name.toLowerCase().includes(filterValue) : '-'
    );
  }
  openAutoItem() {
    this.itemsCtrl.setValue(''); // Clear the input field value

    // Open the autocomplete dropdown by triggering the value change event
    this.itemsCtrl.updateValueAndValidity();
  }

  async nextToAddFormDetails() {
    this.groupMasterForm.removeControl('id')
    this.groupMasterForm.controls['total'].setValue(this.sumOfTotals);

    this.groupMasterForm.controls['no'].setValue(this.autoNo);

    console.log("groupMaster: ", this.groupMasterForm.value);

    if (this.groupMasterForm.valid) {
      this.api.postStrEmployeeExchange(this.groupMasterForm.value)
        .subscribe({
          next: (res) => {
            this.getMasterRowId = {
              "id": res
            };
            this.MasterGroupInfoEntered = true;

            this.toastrSuccess();
            this.getAllDetailsForms();
            this.addDetailsInfo();
          },
          error: (err) => {
            // console.log("header post err: ", err);
            // alert("حدث خطأ أثناء إضافة مجموعة")
          }
        })
    }

  }

  async addDetailsInfo() {
    if (this.getMasterRowId.id) {
      if (this.getMasterRowId.id) {

        if (this.groupDetailsForm.getRawValue().itemId) {
          this.itemName = await this.getItemByID(this.groupDetailsForm.getRawValue().itemId);
          this.groupDetailsForm.controls['itemName'].setValue(this.itemName);

          this.groupDetailsForm.controls['transactionUserId'].setValue(this.userIdFromStorage);
          this.groupDetailsForm.controls['employee_ExchangeId'].setValue(this.getMasterRowId.id);
          this.groupDetailsForm.controls['total'].setValue((parseFloat(this.groupDetailsForm.getRawValue().price) * parseFloat(this.groupDetailsForm.getRawValue().qty)));
        }

        console.log("groupDetails: ", this.groupDetailsForm.value);
        if (this.groupDetailsForm.valid && !this.getDetailedRowData) {

          this.api.postStrEmployeeExchangeDetails(this.groupDetailsForm.value)
            .subscribe({
              next: (res) => {
                this.getDetailsRowId = {
                  "id": res
                };

                this.toastrSuccess();
                this.groupDetailsForm.reset();
                this.groupDetailsForm.controls['qty'].setValue(1);
                this.groupDetailsForm.controls['state'].setValue('جديد');

                this.updateDetailsForm()
                this.getAllDetailsForms();
              },
              error: () => {
                // alert("حدث خطأ أثناء إضافة مجموعة")
              }
            })
        } else {
          this.updateBothForms();
        }

      }

    }
    else {
      this.updateDetailsForm();
    }
  }

  async updateDetailsForm() {
    if (this.editData) {
      this.groupMasterForm.addControl('id', new FormControl('', Validators.required));
      this.groupMasterForm.controls['id'].setValue(this.editData.id);
    }

    this.groupMasterForm.addControl('id', new FormControl('', Validators.required));
    this.groupMasterForm.controls['id'].setValue(this.getMasterRowId.id);

    // this.fiscalYearName = await this.getFiscalYearById(this.groupMasterForm.getRawValue().fiscalYearId);
    // this.employeeName = await this.getEmployeeById(this.groupMasterForm.getRawValue().employeeId);
    // this.distEmployeeName = await this.getDistEmployeeById(this.groupMasterForm.getRawValue().destEmployeeId);

    console.log("groupMaster update: ", this.groupMasterForm.value);

    this.api.putStrEmployeeExchange(this.groupMasterForm.value)
      .subscribe({
        next: (res) => {
          if (this.groupDetailsForm.value && this.getDetailedRowData) {
            this.groupDetailsForm.addControl('id', new FormControl('', Validators.required));
            this.groupDetailsForm.controls['id'].setValue(this.getDetailedRowData.id);

            console.log("groupDetails update: ", this.groupDetailsForm.value);

            this.api.putStrEmployeeExchangeDetails(this.groupDetailsForm.value)
              .subscribe({
                next: (res) => {
                  this.toastrEditSuccess();
                  this.groupDetailsForm.reset();
                  this.groupDetailsForm.controls['qty'].setValue(1);
                  this.groupDetailsForm.controls['state'].setValue('جديد');


                  this.getAllDetailsForms();
                  this.getDetailedRowData = '';
                },
                error: (err) => {
                  // console.log("update err: ", err)
                  // alert("خطأ أثناء تحديث سجل المجموعة !!")
                }
              })
            this.groupDetailsForm.removeControl('id')

          }

        },
        error: () => {
          // alert("خطأ أثناء تحديث سجل الصنف !!")
        }
      })
  }

  updateBothForms() {
    if (this.groupMasterForm.getRawValue().no != '' && this.groupMasterForm.getRawValue().storeId != '' && this.groupMasterForm.getRawValue().fiscalYearId != '' && this.groupMasterForm.getRawValue().date != '') {

      this.groupDetailsForm.controls['employee_ExchangeId'].setValue(this.getMasterRowId.id);
      this.groupDetailsForm.controls['total'].setValue(parseFloat(this.groupDetailsForm.getRawValue().price) * parseFloat(this.groupDetailsForm.getRawValue().qty));

      this.updateDetailsForm();
    }


  }

  editDetailsForm(row: any) {

    this.router.navigate(['/employeeOpening'], { queryParams: { masterId: this.getMasterRowId.id} })
    this.dialog.open(StrEmployeeExchangeDetailsDialogComponent, {
      width: '98%',
      height: '85%',
      data: row
    }).afterClosed().subscribe(val => {
      if (val === 'save' || val === 'update') {
        this.getAllDetailsForms();
      }
    })



  }

  deleteFormDetails(id: number) {
    var result = confirm("هل ترغب بتاكيد الحذف ؟");
    if (result) {
      this.api.deleteStrEmployeeExchangeDetails(id)
        .subscribe({
          next: (res) => {
            this.toastrDeleteSuccess();
            this.getAllDetailsForms()
          },
          error: () => {
            // alert("خطأ أثناء حذف التفاصيل !!");
          }
        })
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


  toastrSelectSameEmpolyee(): void {
    this.toastr.error("عفوا غير مسموح باختيار نفس الموظف");
  }
  toastrSuccess(): void {
    this.toastr.success("تم الحفظ بنجاح");
  }
  toastrDeleteSuccess(): void {
    this.toastr.success("تم الحذف بنجاح");
  }
  toastrEditSuccess(): void {
    this.toastr.success('تم التعديل بنجاح');
  }
}
