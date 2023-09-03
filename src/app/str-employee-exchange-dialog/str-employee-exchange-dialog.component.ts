import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ApiService } from '../services/api.service';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, map, startWith } from 'rxjs';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

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
  styleUrls: ['./str-employee-exchange-dialog.component.css']
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

  displayedColumns: string[] = ['itemName', 'percentage', 'state', 'price', 'qty', 'total', 'action'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private formBuilder: FormBuilder,
    private api: ApiService,
    @Inject(MAT_DIALOG_DATA) public editData: any,
    @Inject(MAT_DIALOG_DATA) public editDataDetails: any,
    private http: HttpClient,
    private dialog: MatDialog,
    private toastr: ToastrService) {

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
      map(value => this._filterItems(value))
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
      date: ['', Validators.required],
      fiscalYearId: ['', Validators.required],
      total: ['', Validators.required],
    });

    this.groupDetailsForm = this.formBuilder.group({
      employee_ExchangeId: ['', Validators.required], //MasterId
      qty: ['', Validators.required],
      price: ['', Validators.required],
      total: ['', Validators.required],
      state: ['', Validators.required],
      percentage: ['', Validators.required],
      transactionUserId: ['', Validators.required],
      itemId: ['', Validators.required],
      itemName: ['', Validators.required],
    });



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
    this.api.getItems()
      .subscribe({
        next: (res) => {
          this.itemsList = res;
        },
        error: (err) => {
          // console.log("fetch items data err: ", err);
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
    this.api.getFiCostCenter()
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
      this.http.get<any>("http://ims.aswan.gov.eg/api/STREmployeeExchangeDetails/get/all")
        .subscribe(res => {

          this.matchedIds = res.filter((a: any) => {
            return a.employee_ExchangeId == this.getMasterRowId.id
          })

          if (this.matchedIds) {

            this.dataSource = new MatTableDataSource(this.matchedIds);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;

            this.sumOfTotals = 0;
            for (let i = 0; i < this.matchedIds.length; i++) {
              this.sumOfTotals = this.sumOfTotals + parseFloat(this.matchedIds[i].total);
              this.groupMasterForm.controls['total'].setValue(this.sumOfTotals);
              this.updateBothForms();
            }

          }
        }
          , err => {
            // alert("حدث خطا ما !!")
          }
        )
    }


  }


  private _filterFiscalYears(value: string): FiscalYear[] {
    const filterValue = value;
    return this.fiscalYearsList.filter(fiscalyearObj =>
      fiscalyearObj.fiscalyear.toLowerCase().includes(filterValue)
    );
  }
  displayFiscalYearName(fiscalyear: any): string {
    return fiscalyear && fiscalyear.fiscalyear ? fiscalyear.fiscalyear : '';
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
    return employee && employee.name ? employee.name : '';
  }
  employeeSelected(event: MatAutocompleteSelectedEvent): void {
    const employee = event.option.value as Employee;
    console.log("employee selected: ", employee);
    this.selectedEmployee = employee;
    this.groupMasterForm.patchValue({ employeeId: employee.id });
    console.log("employee in form: ", this.groupMasterForm.getRawValue().employeeId);
  }
  private _filterEmployees(value: string): Employee[] {
    const filterValue = value;
    return this.employeesList.filter(employee =>
      employee.name.toLowerCase().includes(filterValue) || employee.code.toLowerCase().includes(filterValue)
    );
  }
  openAutoEmployee() {
    this.emploeeCtrl.setValue(''); // Clear the input field value

    // Open the autocomplete dropdown by triggering the value change event
    this.emploeeCtrl.updateValueAndValidity();
  }


  displayDistEmployeeName(DistEmployee: any): string {
    return DistEmployee && DistEmployee.name ? DistEmployee.name : '';
  }
  distEmployeeSelected(event: MatAutocompleteSelectedEvent): void {
    const distEmployee = event.option.value as Employee;
    console.log("distemployee selected: ", distEmployee);
    this.selecteddistEmployee = distEmployee;
    this.groupMasterForm.patchValue({ destEmployeeId: distEmployee.id });
    console.log("distemployee in form: ", this.groupMasterForm.getRawValue().destEmployeeId);
  }
  private _filterDistEmployees(value: string): Employee[] {
    const filterValue = value;
    return this.employeesList.filter(distEmployee =>
      distEmployee.name.toLowerCase().includes(filterValue) || distEmployee.code.toLowerCase().includes(filterValue)
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
    return this.costCentersList.filter(fiscalyearObj =>
      fiscalyearObj.name.toLowerCase().includes(filterValue)
    );
  }
  displayCostCenterName(fiscalyear: any): string {
    return fiscalyear && fiscalyear.name ? fiscalyear.name : '';
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
    return item && item.name ? item.name : '';
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
      item.name.toLowerCase().includes(filterValue) 
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

    // if (this.groupMasterForm.getRawValue().no) {
    //   console.log("no changed: ", this.groupMasterForm.getRawValue().no)
    // }
    // else {
    //   this.groupMasterForm.controls['no'].setValue(this.autoNo);
    //   console.log("no took auto number: ", this.groupMasterForm.getRawValue().no)
    // }

    // this.fiscalYearName = await this.getFiscalYearById(this.groupMasterForm.getRawValue().fiscalYearId);
    // this.employeeName = await this.getEmployeeById(this.groupMasterForm.getRawValue().employeeId);
    // this.distEmployeeName = await this.getDistEmployeeById(this.groupMasterForm.getRawValue().destEmployeeId);

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
                  this.toastrSuccess();
                  this.groupDetailsForm.reset();
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

    if (this.editDataDetails || row) {
      this.getDetailedRowData = row;

      this.actionBtnDetails = "Update";
      this.groupDetailsForm.controls['employee_ExchangeId'].setValue(this.getDetailedRowData.employee_ExchangeId);

      this.groupDetailsForm.controls['qty'].setValue(this.getDetailedRowData.qty);
      this.groupDetailsForm.controls['price'].setValue(this.getDetailedRowData.price);
      this.groupDetailsForm.controls['total'].setValue(parseFloat(this.groupDetailsForm.getRawValue().price) * parseFloat(this.groupDetailsForm.getRawValue().qty));
      this.groupDetailsForm.controls['percentage'].setValue(this.getDetailedRowData.percentage);
      this.groupDetailsForm.controls['state'].setValue(this.getDetailedRowData.state);

      this.groupDetailsForm.controls['itemId'].setValue(this.getDetailedRowData.itemId);

    }


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
    return fetch(`http://ims.aswan.gov.eg/api/STRItem/get/${id}`)
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

  toastrSuccess(): void {
    this.toastr.success("تم الحفظ بنجاح");
  }
  toastrDeleteSuccess(): void {
    this.toastr.success("تم الحذف بنجاح");
  }
}
