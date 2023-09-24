import { Component, OnInit, Inject, ViewChild, LOCALE_ID } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatAccordion, MatExpansionModule } from '@angular/material/expansion';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatOptionSelectionChange } from '@angular/material/core';
// import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { STREmployeeOpeningCustodyComponent } from '../str-employee-opening-custody/str-employee-opening-custody.component';
import { GlobalService } from '../../services/global.service';
import { StrEmployeeOpeningCustodyDetailDailogComponent } from '../str-employee-opening-custody-detail-dailog/str-employee-opening-custody-detail-dailog.component';
import { Router } from '@angular/router';
import { formatDate } from '@angular/common';
import { HotkeysService } from 'angular2-hotkeys';
import { Hotkey } from 'angular2-hotkeys';
export class Employee {
  constructor(public id: number, public name: string) { }
}
export class CostCenter {
  constructor(public id: number, public name: string) { }
}
export class Item {
  constructor(public id: number, public name: string) { }
}

@Component({
  selector: 'app-str-employee-opening-custody-dialog',
  templateUrl: './str-employee-opening-custody-dialog.component.html',
  styleUrls: ['./str-employee-opening-custody-dialog.component.css']
})
export class STREmployeeOpeningCustodyDialogComponent implements OnInit {
  groupDetailsForm !: FormGroup;
  groupMasterForm !: FormGroup;
  actionBtnMaster: string = 'Save';
  actionBtnDetails: string = 'Save';
  MasterGroupInfoEntered = false;
  dataSource!: MatTableDataSource<any>;
  matchedIds: any;
  getDetailedRowData: any;
  sumOfTotals = 0;
  getMasterRowId: any;
  getDetailsRowId: any;
  storeList: any;
  employeesList: any;
  distEmployeesList: any;
  costCentersList: any;
  itemsList: any;
  fiscalYearsList: any;
  storeName: any;
  itemName: any;
  userIdFromStorage: any;
  deleteConfirmBtn: any;
  dialogRefDelete: any;
  autoNo: any;
  price: any;
  fiscalYearSelectedId: any;
  defaultFiscalYearSelectValue: any;
  isReadOnly: boolean = true;
  storeSelectedId: any;

  selectedOption: any;
  getGradeData: any;
  formcontrol = new FormControl('');

  employeeCtrl: FormControl;
  filteredEmployees: Observable<Employee[]>;
  employees: Employee[] = [];
  selectedEmployee: Employee | undefined;

  costCenterCtrl: FormControl;
  filteredCostCenters: Observable<CostCenter[]>;
  costCenters: CostCenter[] = [];
  selectedCostCenter: CostCenter | undefined;

  itemCtrl: FormControl;
  filteredItems: Observable<Employee[]>;
  items: Item[] = [];
  selectedItem: Item | undefined;
  isEditDataReadOnly: boolean = true;

  isEdit: boolean = false;
  fullCodeValue: any;
  itemByFullCodeValue: any;
  getCustodyData: any;
  userRoles: any;

  defaultStoreSelectValue: any;
  displayedColumns: string[] = ['itemName', 'percentage', 'state', 'price', 'qty', 'total', 'action'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatAccordion)
  accordion!: MatAccordion;

  employeeName: any;
  // toastr: any;
  constructor(private formBuilder: FormBuilder,
    private api: ApiService,
    private hotkeysService: HotkeysService,global:GlobalService,
    @Inject(MAT_DIALOG_DATA) public editDataDetails: any,private toastr: ToastrService,
    private http: HttpClient,private dialog: MatDialog, private router: Router, private dialogRef: MatDialogRef<STREmployeeOpeningCustodyDialogComponent>,
    // private toastr: ToastrService){}

    @Inject(LOCALE_ID) private locale: string,
    @Inject(MAT_DIALOG_DATA) public editData: any) {

    this.employeeCtrl = new FormControl();
    this.filteredEmployees = this.employeeCtrl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filterEmployees(value))
    );

    this.costCenterCtrl = new FormControl();
    this.filteredCostCenters = this.costCenterCtrl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filterCostCenters(value))
    );
    this.itemCtrl = new FormControl();
    this.filteredItems = this.itemCtrl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filterItems(value))
    );
  }





  ngOnInit(): void {
    // this.getStores();
    this.getItems();
    this.getFiscalYears();
    this.getEmployees();
    this.getStrEmployeeOpenAutoNo();
    // this.getCostCenters();
    // this.getPrice(); 
    let dateNow: Date = new Date()
    console.log('Date = ' + dateNow)
    // this.distEmployeesList = [
    //   {
    //     "id": 1,
    //     "name": "distFirstEm"
    //   },
    //   {
    //     "id": 2,
    //     "name": "distSecondEm"
    //   }
    // ]




    this.getMasterRowId = this.editData;

    this.groupMasterForm = this.formBuilder.group({
      no: ['', Validators.required],
      // storeId: ['', Validators.required],
      // storeName: ['', Validators.required],
      employeName: ['', Validators.required],
      employeeId: ['', Validators.required],
      costCenterName: ['', Validators.required],
      costCenterId: ['', Validators.required],
      transactionUserId: ['', Validators.required],
      date: [dateNow, Validators.required],
      total: ['', Validators.required],
      fiscalYearId: ['', Validators.required],
    });

    this.groupDetailsForm = this.formBuilder.group({
      custodyId: ['', Validators.required], //MasterId
      qty: ['', Validators.required],
      price: ['', Validators.required],
      total: ['', Validators.required],
      state: ['', Validators.required],
      percentage: ['', Validators.required],
      transactionUserId: ['', Validators.required],
      itemId: ['', Validators.required],
      itemName: ['', Validators.required],
    });

    this.api.getAllEmployees().subscribe((employees) => {
      this.employees = employees;

    });

    this.api.getFiCostCenter().subscribe((costCenters) => {


      this.costCenters = costCenters;

    });
    this.api.getItems().subscribe((items) => {


      this.items = items;

    });
    this.hotkeysService.add(new Hotkey('ctrl+s', (event: KeyboardEvent): boolean => {
      // Call the deleteGrade() function in the current component
      this.nextToAddFormDetails();
      return false; // Prevent the default browser behavior
    }));
    this.userIdFromStorage = localStorage.getItem('transactionUserId');
    this.groupMasterForm.controls['transactionUserId'].setValue(this.userIdFromStorage);
    if (this.editData) {
      this.isEdit = true;
      // console.log("master edit form: ", this.editData);
      this.actionBtnMaster = "Update";
      this.groupMasterForm.controls['no'].setValue(this.editData.no);
      // this.groupMasterForm.controls['storeId'].setValue(this.editData.storeId);
      // this.groupMasterForm.controls['name'].setValue(this.editData.name);
      this.groupMasterForm.controls['employeeId'].setValue(this.editData.employeeId);
      this.groupMasterForm.controls['costCenterName'].setValue(this.editData.costCenterName);
      this.groupMasterForm.controls['costCenterId'].setValue(this.editData.costCenterId);

      // alert("facialId before: "+ this.editData.fiscalYearId)
      this.groupMasterForm.controls['fiscalYearId'].setValue(this.editData.fiscalYearId);
      // console.log("faciaaaaal year edit: ", this.groupMasterForm.getRawValue().fiscalYearId)
      // alert("facialId after: "+ this.groupMasterForm.getRawValue().fiscalYearId)
      this.groupMasterForm.controls['date'].setValue(this.editData.date);
      this.groupMasterForm.controls['total'].setValue(this.editData.total);

      this.groupMasterForm.addControl('id', new FormControl('', Validators.required));
      this.groupMasterForm.controls['id'].setValue(this.editData.id);
      this.isEditDataReadOnly = true;
    }

    this.getAllDetailsForms();

    // localStorage.setItem('transactionUserId', JSON.stringify("mehrail"));
    // this.userIdFromStorage = localStorage.getItem('transactionUserId');
    // console.log("userIdFromStorage in localStorage: ", this.userIdFromStorage)
    // console.log("userIdFromStorage after slice from string shape: ", this.userIdFromStorage?.slice(1, length - 1))
    // this.groupMasterForm.controls['transactionUserId'].setValue(this.userIdFromStorage?.slice(1, length - 1));
    // this.groupMasterForm.controls['transactionUserId'].setValue(this.userIdFromStorage);
    // this.groupMasterForm.controls['itemName'].setValue(this.editData.itemName);
    // this.groupMasterForm.controls['itemId'].setValue(this.editData.itemId);
  }



  // getStores() {
  //   this.api.getStore()
  //     .subscribe({
  //       next: (res) => {
  //         this.storeList = res;
  //         // console.log("store res: ", this.storeList);
  //       },
  //       error: (err) => {
  //         console.log("fetch store data err: ", err);
  //         alert("خطا اثناء جلب المخازن !");
  //       }
  //     })
  // }
  getAllMasterForms() {

    this.dialogRef.close('Save');
    this.api.getStrEmployeeOpen()
      .subscribe({
        next: (res) => {
          // this.groupDetailsForm.controls['itemName'].setValue(this.itemName);
          this.dataSource = new MatTableDataSource(res);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        },
        error: () => {
          // alert("خطأ أثناء جلب سجلات المجموعة !!");
        }
      })

  }

  getItems() {
    this.api.getItems()
      .subscribe({
        next: (res) => {
          this.itemsList = res;
          // console.log("items res: ", this.itemsList);
        },
        error: () => {
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
          console.log("employees res: ", this.employeesList);
        },
        error: (err) => {
          console.log("fetch employees data err: ", err);
          alert("خطا اثناء جلب الموظفين !");
        }
      })
  }

  getCostCenters() {
    this.api.getFiCostCenter()
      .subscribe({
        next: (res) => {
          this.costCentersList = res;
          console.log("costCenter res: ", this.costCentersList);
        },
        error: (err) => {
          console.log("fetch costCenter data err: ", err);
          // alert("خطا اثناء جلب مراكز التكلفة !");

        }
      })
  }

  // getPrice(){
  //   this.api.getAvgPrice(storeid: any, FiscalYearid: any, Date: any, itemid: any)

  //     .subscribe({
  //       next: (res) => {
  //         this.price = res;
  //         console.log("employees res: ", this.employeesList);
  //       },
  //       error: (err) => {
  //         console.log("fetch employees data err: ", err);
  //         alert("خطا اثناء جلب الموظفين !");
  //       }
  //     })

  // getFiscalYears() {
  //   this.api.getFiscalYears()
  //     .subscribe({
  //       next: (res) => {
  //         this.fiscalYearsList = res;
  //         console.log("fiscalYears res: ", this.fiscalYearsList);
  //       },
  //       error: (err) => {
  //         console.log("fetch fiscalYears data err: ", err);
  //         alert("خطا اثناء جلب العناصر !");
  //       }
  //     })
  // }
  async getFiscalYears() {

    this.api.getFiscalYears()
      .subscribe({
        next: async (res) => {
          this.fiscalYearsList = res;

          this.api.getLastFiscalYear()
            .subscribe({
              next: async (res) => {
                // this.defaultFiscalYearSelectValue = await this.fiscalYearsList.find((yearList: { fiscalyear: number; }) => yearList.fiscalyear == new Date().getFullYear());
                this.defaultFiscalYearSelectValue = await res;
                console.log("selectedYearggggggggggggggggggg: ", this.defaultFiscalYearSelectValue);
                if (this.editData) {
                  console.log("selectedYear id in get: ", this.editData.fiscalYearId);

                  this.groupMasterForm.controls['fiscalYearId'].setValue(this.editData.fiscalYearId);
                }
                else {
                  this.groupMasterForm.controls['fiscalYearId'].setValue(this.defaultFiscalYearSelectValue.id);
                  // this.getStrWithdrawAutoNo();
                  this.getStrEmployeeOpenAutoNo();
                }
              },
              error: (err) => {
                // console.log("fetch store data err: ", err);
                // alert("خطا اثناء جلب المخازن !");
              }
            })

          // this.defaultFiscalYearSelectValue = await this.fiscalYearsList.find((yearList: { fiscalyear: number; }) => yearList.fiscalyear == new Date().getFullYear());
          // console.log("selectedYearggggggggggggggggggg: ", this.defaultFiscalYearSelectValue);
          // if (this.editData) {
          //   this.groupMasterForm.controls['fiscalYearId'].setValue(this.editData.fiscalYearId);
          // }
          // else {
          //   this.groupMasterForm.controls['fiscalYearId'].setValue(this.defaultFiscalYearSelectValue.id);
          //   this.getStrOpenAutoNo();
          // }
          // this.fiscalYearValueChanges(this.groupMasterForm.getRawValue().fiscalYearId);
        },
        error: (err) => {
          // console.log("fetch fiscalYears data err: ", err);
          // alert("خطا اثناء جلب العناصر !");
        }
      })
  }
  getFiscalYearsByID(id: any) {
    // console.log("row fiscalYear id: ", id);
    return fetch(`http://ims.aswan.gov.eg/api/STRFiscalYear/get/${id}`)
      .then(response => response.json())
      .then(json => {
        // console.log("fetch fiscalYears name by id res: ", json.fiscalyear);
        return json.fiscalyear;
      })
      .catch((err) => {
        console.log("error in fetch fiscalYears name by id: ", err);
        // alert("خطا اثناء جلب رقم العنصر !");
      });
  }
  getAllDetailsForms() {

    console.log("mastered row get all data: ", this.getMasterRowId)
    if (this.getMasterRowId) {
      // this.http.get<any>("http://ims.aswan.gov.eg/api/STREmployeeOpeningCustodyDetails/get/all")
      //   .subscribe(res => {
      //     console.log("res to get all details form: ", res, "masterRowId: ", this.getMasterRowId.id);

      //     this.matchedIds = res.filter((a: any) => {
      //       // console.log("matchedIds: ", a.employee_ExchangeId == this.getMasterRowId.id, "res: ", this.matchedIds)
      //       return a.custodyId == this.getMasterRowId.id



      //       if (this.matchedIds) {

      //         this.dataSource = new MatTableDataSource(this.matchedIds);
      //         this.dataSource.paginator = this.paginator;
      //         this.dataSource.sort = this.sort;

      //         this.sumOfTotals = 0;
      //         for (let i = 0; i < this.matchedIds.length; i++) {
      //           this.sumOfTotals = this.sumOfTotals + parseFloat(this.matchedIds[i].total);
      //           this.groupMasterForm.controls['total'].setValue(this.sumOfTotals);
      //           this.updateBothForms();
      //         }

      //       }
      //     }
      //       , () => {
      //         alert("حدث خطا ما !!")
      //       }
      //     )
      // }

      this.api.getStrEmployeeOpenDetailsByMasterId(this.getMasterRowId.id)
        .subscribe({
          next: (res) => {
            // this.itemsList = res;
            this.matchedIds = res[0].strEmployeeOpeningCustodyDetailsGetVM;

            if (this.matchedIds) {
              console.log("eeeeeeeeeeeeeeeeeeeeeeeeeeee: ", res[0].strEmployeeOpeningCustodyDetailsGetVM);
              this.dataSource = new MatTableDataSource(this.matchedIds);
              this.dataSource.paginator = this.paginator;
              this.dataSource.sort = this.sort;

              this.sumOfTotals = 0;
              for (let i = 0; i < this.matchedIds.length; i++) {
                this.sumOfTotals = this.sumOfTotals + parseFloat(this.matchedIds[i].total);
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
  addNewDetails() {
    this.router.navigate(['/EmployeeOpeningCustody'], { queryParams: { masterId: this.getMasterRowId.id, fiscalYear: this.groupMasterForm.getRawValue().fiscalYearId, itemName: this.groupMasterForm.getRawValue().itemId, date: this.groupMasterForm.getRawValue().date } })
    this.dialog.open(StrEmployeeOpeningCustodyDetailDailogComponent, {
      width: '98%',
      height: '95%'
    }).afterClosed().subscribe(val => {
      if (val === 'Save' || val === 'Update') {
        this.getAllDetailsForms();
      }
    })
  }
  async updateMaster() {
    console.log("nnnvvvvvvvvvv: ", this.groupMasterForm.value);
    console.log("nnnvvvvvvvvvvhhhhhhhhhhh: ", this.isEdit);
    if (this.isEdit == false) {
      this.groupMasterForm.controls['no'].setValue(this.autoNo);
    }
    this.groupDetailsForm.controls['transactionUserId'].setValue(this.userIdFromStorage);
    console.log("update both: ", this.groupDetailsForm.valid, "ooo:", !this.getDetailedRowData);
    console.log("edit : ", this.groupDetailsForm.value)
    this.api.putStEmp(this.groupMasterForm.value)
      .subscribe({
        next: (res) => {
          this.groupDetailsForm.reset();
          this.itemByFullCodeValue = '';
          this.fullCodeValue = '';
          this.getDetailedRowData = '';
          this.groupDetailsForm.controls['qty'].setValue(1);
        },

      })
  }


  async nextToAddFormDetails() {
    this.groupMasterForm.removeControl('id')

    this.groupMasterForm.controls['total'].setValue(this.sumOfTotals)
    // this.storeName = await this.getStoreByID(this.groupMasterForm.getRawValue().storeId);

    // alert("store name in add: " + this.storeName)
    // this.groupMasterForm.controls['storeName'].setValue(this.storeName);
    // this.groupMasterForm.controls['fiscalYearId'].setValue(1)
    // console.log("faciaaaaal year add: ", this.groupMasterForm.getRawValue().fiscalYearId)
    console.log("dataName: ", this.groupMasterForm.value)
    if (this.groupMasterForm.getRawValue().no) {
      console.log("no changed: ", this.groupMasterForm.getRawValue().no)
    }
    else {
      this.groupMasterForm.controls['no'].setValue(this.autoNo);
      console.log("no took auto number: ", this.groupMasterForm.getRawValue().no)
    }
    if (this.groupMasterForm) {
      // if (this.groupMasterForm.getRawValue().storeName && this.groupMasterForm.valid) {


      console.log("Master add form : ", this.groupMasterForm.value)
      this.api.postStrEmployeeOpen(this.groupMasterForm.value)
        .subscribe({
          next: (res) => {
            // console.log("ID header after post req: ", res);
            this.getMasterRowId = {
              "id": res
            };
            // this.getMasterRowId = res;
            console.log("mastered res: ", this.getMasterRowId.id)
            this.MasterGroupInfoEntered = true;

            // alert("تم الحفظ بنجاح");
            this.toastrSuccess();
            this.getAllDetailsForms();
            // this.addDetailsInfo();
            // this.getAllDetailsForms();
            // this.updateDetailsForm();
            this.updateDetailsForm()

            // this.addDetailsInfo();
          },
          error: (err) => {
            console.log("header post err: ", err);
            // alert("حدث خطأ أثناء إضافة مجموعة")
          }
        })
    }
    // else {
    //   alert("تاكد من ادخال البيانات صحيحة")
    // }
  }


  // getStoreByID(id: any) {
  //   // console.log("row store id: ", id);
  //   return fetch(`https://ims.aswan.gov.eg/api/STR_Store/get-UniStoret-by-id/${id}`)
  //     .then(response => response.json())
  //     .then(json => {
  //       // console.log("fetch name by id res: ", json.name);
  //       return json.name;
  //     })
  //     .catch((err) => {
  //       // console.log("error in fetch name by id: ", err);
  //       // alert("خطا اثناء جلب رقم المخزن !");
  //     });
  // }

  displayEmployeeName(employee: any): string {
    return employee && employee.name ? employee.name : '';
  }
  employeeSelected(event: MatAutocompleteSelectedEvent): void {
    const employee = event.option.value as Employee;
    this.selectedEmployee = employee;
    this.groupMasterForm.patchValue({ employeeId: employee.id });
    this.groupMasterForm.patchValue({ employeeName: employee.name });
  }
  private _filterEmployees(value: string): Employee[] {
    const filterValue = value;
    return this.employees.filter(employee =>
      employee.name.toLowerCase().includes(filterValue)
    );
  }

  openAutoEmployee() {
    this.employeeCtrl.setValue(''); // Clear the input field value

    // Open the autocomplete dropdown by triggering the value change event
    this.employeeCtrl.updateValueAndValidity();
  }

  displayCostCenterName(costCenter: any): string {
    return costCenter && costCenter.name ? costCenter.name : '';

  }
  costCenterSelected(event: MatAutocompleteSelectedEvent): void {
    const costCenter = event.option.value as CostCenter;
    this.selectedCostCenter = costCenter;
    this.groupMasterForm.patchValue({ costCenterId: costCenter.id });
    this.groupMasterForm.patchValue({ costCenterName: costCenter.name });

  }
  private _filterCostCenters(value: string): CostCenter[] {
    const filterValue = value;
    return this.costCenters.filter(costCenter =>
      costCenter.name.toLowerCase().includes(filterValue)

    );

  }

  openAutoCostCenter() {
    this.costCenterCtrl.setValue(''); // Clear the input field value

    // Open the autocomplete dropdown by triggering the value change event
    this.costCenterCtrl.updateValueAndValidity();
  }
  displayItemName(item: any): string {
    return item && item.name ? item.name : '';
  }
  itemSelected(event: MatAutocompleteSelectedEvent): void {
    const item = event.option.value as Item;
    this.selectedItem = item;
    this.groupDetailsForm.patchValue({ itemId: item.id });
    this.groupDetailsForm.patchValue({ itemName: item.name });
  }
  private _filterItems(value: string): Item[] {
    const filterValue = value;
    return this.items.filter(item =>
      item.name.toLowerCase().includes(filterValue)
    );
  }

  openAutoItem() {
    this.itemCtrl.setValue(''); // Clear the input field value

    // Open the autocomplete dropdown by triggering the value change event
    this.itemCtrl.updateValueAndValidity();
  }
  async addDetailsInfo() {
    console.log("check id for insert: ", this.getDetailedRowData, "edit data form: ", this.editData, "main id: ", this.getMasterRowId.id);

    if (this.getMasterRowId.id) {
      if (this.getMasterRowId.id) {
        console.log("form  headerId: ", this.getMasterRowId, "details form: ", this.groupDetailsForm.value)

        // if (this.groupDetailsForm.getRawValue().itemId) {
        //   // this.itemName = await this.getItemByID(this.groupDetailsForm.getRawValue().itemId);
        //   this.groupDetailsForm.controls['itemName'].setValue(this.itemName);
        //   // this.groupDetailsForm.controls['transactionUserId'].setValue(this.userIdFromStorage?.slice(1, length - 1));
        //   this.groupDetailsForm.controls['transactionUserId'].setValue(this.userIdFromStorage);
        // }

        // this.groupDetailsForm.controls['employee_ExchangeId'].setValue(this.getMasterRowId.id);
        // this.groupDetailsForm.controls['total'].setValue((parseFloat(this.groupDetailsForm.getRawValue().price) * parseFloat(this.groupDetailsForm.getRawValue().qty)));

        // console.log("form details after item: ", this.groupDetailsForm.value, "DetailedRowData: ", !this.getDetailedRowData)
        if (this.groupDetailsForm.getRawValue().itemId) {
          this.itemName = await this.getItemByID(this.groupDetailsForm.getRawValue().itemId);
          this.groupDetailsForm.controls['itemName'].setValue(this.itemName);
          // alert("item name: " + this.itemName + " transactionUserId: " + this.userIdFromStorage)
          // this.groupDetailsForm.controls['transactionUserId'].setValue(this.userIdFromStorage?.slice(1, length - 1));
          this.groupDetailsForm.controls['transactionUserId'].setValue(this.userIdFromStorage);
          this.groupDetailsForm.controls['custodyId'].setValue(this.getMasterRowId.id);
          this.groupDetailsForm.controls['total'].setValue((parseFloat(this.groupDetailsForm.getRawValue().price) * parseFloat(this.groupDetailsForm.getRawValue().qty)));

          console.log("add details second time, details form: ", this.groupDetailsForm.value)
          console.log("add details second time, get detailed row data: ", !this.getDetailedRowData)
        }

        // alert("item name controller: " + this.groupDetailsForm.getRawValue().itemName + " transactionUserId controller: " + this.groupDetailsForm.getRawValue().transactionUserId)

        // this.groupDetailsForm.controls['percentage'].setValue(20);
        // this.groupDetailsForm.controls['state'].setValue("string2");

        console.log("add details second time, details form: ", this.groupDetailsForm.value)
        console.log("add details second time, get detailed row data: ", !this.getDetailedRowData)

        // if (this.groupDetailsForm.valid && !this.getDetailedRowData) {
        if (this.groupDetailsForm.valid && !this.getDetailedRowData) {

          this.api.postStrEmployeeOpenDetails(this.groupDetailsForm.value)
            .subscribe({
              next: (res) => {
                this.getDetailsRowId = {
                  "id": res
                };
                // this.getDetailsRowId = res;
                console.log("Details res: ", this.getDetailsRowId.id)

                // alert("تمت إضافة التفاصيل بنجاح");
                this.toastrSuccess();
                this.groupDetailsForm.reset();
                this.updateDetailsForm()
                this.getAllDetailsForms();
                // this.dialogRef.close('save');
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

    // this.storeName = await this.getStoreByID(this.groupMasterForm.getRawValue().storeId);
    // // alert("update Store name: " + this.storeName)
    // this.groupMasterForm.controls['storeName'].setValue(this.storeName);
    // // console.log("data storeName in edit: ", this.groupMasterForm.value)

    // this.groupDetailsForm.controls['itemName'].setValue(this.itemName);

    // this.storeName = await this.getStoreByID(this.groupMasterForm.getRawValue().storeId);
    // alert("update Store name: " + this.storeName)
    // this.groupMasterForm.controls['storeName'].setValue(this.storeName);
    // console.log("data storeName in edit: ", this.groupMasterForm.value)

    // this.groupDetailsForm.controls['itemName'].setValue(this.itemName);

    // console.log("values master form: ", this.groupMasterForm.value)
    // console.log("values getMasterRowId: ", this.getMasterRowId)
    // console.log("values details form: ", this.groupDetailsForm.value)

    if (this.editData) {
      this.groupMasterForm.addControl('id', new FormControl('', Validators.required));
      this.groupMasterForm.controls['id'].setValue(this.editData.id);
      // console.log("data item Name in edit: ", this.groupMasterForm.value)
    }

    this.groupMasterForm.addControl('id', new FormControl('', Validators.required));
    this.groupMasterForm.controls['id'].setValue(this.getMasterRowId.id);
    // this.groupMasterForm.controls['employee_ExchangeId'].setValue(this.getMasterRowId.id);
    // console.log("data item Name in edit without id: ", this.groupMasterForm.value)

    this.api.putStrEmployeeOpen(this.groupMasterForm.value)
      .subscribe({
        next: (res) => {
          // alert("تم التعديل بنجاح");
          console.log("update res: ", res, "details form values: ", this.groupDetailsForm.value, "details id: ", this.getDetailedRowData);
          // console.log("update res: ", res, "details form values: ", this.groupDetailsForm.value, "details id: ", this.getDetailedRowData);
          if (this.groupDetailsForm.value && this.getDetailedRowData) {

            this.groupDetailsForm.addControl('id', new FormControl('', Validators.required));
            this.groupDetailsForm.controls['id'].setValue(this.getDetailedRowData.id);

            this.api.putStrEmployeeOpenDetails(this.groupDetailsForm.value)
              .subscribe({
                next: () => {
                  // alert("تم تحديث التفاصيل بنجاح");
                  this.toastrEditSuccess();
                  // console.log("update res: ", res);
                  this.groupDetailsForm.reset();
                  this.getAllDetailsForms();
                  this.getDetailedRowData = '';
                  // this.dialogRef.close('update');
                },
                error: () => {
                  // console.log("update err: ", err)
                  // alert("خطأ أثناء تحديث سجل المجموعة !!")
                }
              })
            this.groupDetailsForm.removeControl('id')

          }

          // this.dialogRef.close('update');
        },
        error: () => {
          // alert("خطأ أثناء تحديث سجل الصنف !!")
        }
      })
  }

  updateBothForms() {
    // console.log("pass id: ", this.getMasterRowId.id, "pass No: ", this.groupMasterForm.getRawValue().no, "pass StoreId: ", this.groupMasterForm.getRawValue().storeId, "pass Date: ", this.groupMasterForm.getRawValue().date)
    if (this.isEdit == false) {
      this.groupMasterForm.controls['no'].setValue(this.autoNo)
    }
    console.log("check update d, ", this.groupMasterForm.value);

    if (this.groupMasterForm.getRawValue().no != '' && this.groupMasterForm.getRawValue().costCenterId != '' && this.groupMasterForm.getRawValue().employeeId != '' && this.groupMasterForm.getRawValue().fiscalYearId != '' && this.groupMasterForm.getRawValue().date != '') {
      console.log("change readOnly to enable, ", this.groupMasterForm.value);

      if (!this.autoNo) {
        this.autoNo = this.editData.no;

      }


      this.groupDetailsForm.controls['custodyId'].setValue(this.getMasterRowId.id);
      // this.groupDetailsForm.controls['total'].setValue(parseFloat(this.groupDetailsForm.getRawValue().price) * parseFloat(this.groupDetailsForm.getRawValue().qty));

      this.updateDetailsForm();
    }
    // else {
    //   alert("تاكد من ادخال البيانات صحيحة")
    // }

  }

  editDetailsForm(row: any) {

    // console.log("test edit pass row: ", row)
    // if (this.editDataDetails || row) {
    //   this.getDetailedRowData = row;

    //   this.actionBtnDetails = "Update";
    //   this.groupDetailsForm.controls['custodyId'].setValue(this.getDetailedRowData.custodyId);

    //   this.groupDetailsForm.controls['qty'].setValue(this.getDetailedRowData.qty);
    //   this.groupDetailsForm.controls['price'].setValue(this.getDetailedRowData.price);
    //   this.groupDetailsForm.controls['total'].setValue(parseFloat(this.groupDetailsForm.getRawValue().price) * parseFloat(this.groupDetailsForm.getRawValue().qty));
    //   this.groupDetailsForm.controls['percentage'].setValue(this.getDetailedRowData.percentage);
    //   this.groupDetailsForm.controls['state'].setValue(this.getDetailedRowData.state);

    //   // console.log("itemid focus: ", this.matchedIds);

    //   this.groupDetailsForm.controls['itemId'].setValue(this.getDetailedRowData.itemId);
    //   console.log("test edit form details: ", this.groupDetailsForm.value)
    this.router.navigate(['/EmployeeOpeningCustody'], { queryParams: { masterId: this.getMasterRowId.id, fiscalYear: this.groupMasterForm.getRawValue().fiscalYearId, date: this.groupMasterForm.getRawValue().date } })
    this.dialog.open(StrEmployeeOpeningCustodyDetailDailogComponent, {
      width: '98%',
      height: '95%',
      data: row,
    }).afterClosed().subscribe(val => {
      if (val === 'save' || val === 'update') {
        this.getAllDetailsForms();
      }
    })
  }








  getStrEmployeeOpenAutoNo() {
    this.api.getStrEmployeeOpenAutoNo()
      .subscribe({
        next: (res) => {
          this.autoNo = res;
          return res;
        },
        error: () => {
          // console.log("fetch fiscalYears data err: ", err);
          // alert("خطا اثناء جلب العناصر !");
        }
      })
  }
  deleteFormDetails(id: number) {
    // this.groupDetailsForm.addControl('id', new FormControl('', Validators.required));
    // this.groupDetailsForm.controls['id'].setValue(this.editData.id);
    console.log("details idhhhh: ", id)

    var result = confirm("هل ترغب بتاكيد الحذف ؟");
    console.log('res',result)
    if (result) {
      this.api.deleteStrEmployeeOpenDetails(id)
        .subscribe(
     res => {
            console.log('res',res)
            alert("تم الحذف بنجاح");
            this.toastrDeleteSuccess();
            this.getAllDetailsForms();
            //  this.dialogRef
            console.log('tttttttttttttt: ', res);

          },
          // error: (err) => {
          //   alert("خطأ أثناء حذف التفاصيل !!");
          //   console.log("delete err: ", err);
          // }
        )
    }

  }
  async getStores() {
    this.userRoles = localStorage.getItem('userRoles');
    console.log('userRoles: ', this.userRoles.includes('15'))

    if (this.userRoles.includes('15')) {
      // console.log('user is manager -all stores available- , role: ', userRoles);

      this.api.getStore()
        .subscribe({
          next: async (res) => {
            this.storeList = res;
            this.defaultStoreSelectValue = await res[Object.keys(res)[0]];
            console.log("selected storebbbbbbbbbbbbbbbbbbbbbbbb: ", this.defaultStoreSelectValue);
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
            console.log("selected storebbbbbbbbbbbbbbb user: ", this.defaultStoreSelectValue);
            if (this.editData) {
              console.log("selected edit data : ", this.editData);
              this.groupMasterForm.controls['storeId'].setValue(this.editData.storeId);
            }
            else {
              console.log("selected new data : ", this.defaultStoreSelectValue.storeId);
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
  async itemOnChange(itemEvent: any) {
    console.log("itemEvent change value: ", itemEvent);
    await this.api.getAvgPrice(
      this.groupMasterForm.getRawValue().storeId,
      this.groupMasterForm.getRawValue().fiscalYearId,
      formatDate(this.groupMasterForm.getRawValue().date, 'yyyy-MM-dd', this.locale),
      itemEvent)

      .subscribe({
        next: async (res) => {
          await this.groupDetailsForm.controls['price'].setValue(res);
          console.log("price passed: ", res);

          console.log("price: ", this.groupDetailsForm.getRawValue().price);
          if (this.groupDetailsForm.getRawValue().price == 0 || this.getDetailedRowData?.price == 0) {
            this.isReadOnly = false;
            console.log("change readOnly to enable here");
          }
          else {
            this.isReadOnly = true;
            console.log("change readOnly to disable here");
          }
        },
        error: (err) => {
          console.log("fetch fiscalYears data err: ", err);
          // alert("خطا اثناء جلب متوسط السعر !");
        }
      })
  }

  storeValueChanges(storeId: any) {
    console.log("store: ", storeId)
    this.storeSelectedId = storeId;
    this.groupMasterForm.controls['storeId'].setValue(this.storeSelectedId);
    this.isEdit = false;
    console.log("kkkkkkkkkkk:", this.isEdit)

    this.getStrOpenAutoNo();

  }
  async fiscalYearValueChanges(fiscalyaerId: any) {
    console.log("fiscalyaer: ", fiscalyaerId)
    this.fiscalYearSelectedId = await fiscalyaerId;
    this.groupMasterForm.controls['fiscalYearId'].setValue(this.fiscalYearSelectedId);
    this.isEdit = false;

    this.getStrOpenAutoNo();
  }

  getStrOpenAutoNo() {
    console.log("storeId: ", this.storeSelectedId, " fiscalYearId: ", this.fiscalYearSelectedId)
    console.log("get default selected storeId & fisclYearId: ", this.defaultStoreSelectValue, " , ", this.defaultFiscalYearSelectValue);

    if (this.groupMasterForm) {

      if (this.editData && !this.fiscalYearSelectedId) {
        console.log("change storeId only in updateHeader");
        this.api.getStrOpenAutoNo(this.groupMasterForm.getRawValue().storeId, this.editData.fiscalYearId)
          .subscribe({
            next: (res) => {
              this.autoNo = res;
              console.log("autoNo: ", this.autoNo);
              return res;
            },
            error: (err) => {
              console.log("fetch autoNo err: ", err);
              // alert("خطا اثناء جلب العناصر !");
            }
          })
      }

      else if (this.editData && !this.storeSelectedId) {
        console.log("change fiscalYearId only in updateHeader");
        this.api.getStrOpenAutoNo(this.editData.storeId, this.groupMasterForm.getRawValue().fiscalYearId)
          .subscribe({
            next: (res) => {
              this.autoNo = res;
              console.log("autoNo: ", this.autoNo);
              return res;
            },
            error: (err) => {
              console.log("fetch autoNo err: ", err);
              // alert("خطا اثناء جلب العناصر !");
            }
          })
      }
      else if (this.editData) {
        console.log("change both in edit data: ", this.isEdit);

        this.api.getStrOpenAutoNo(this.groupMasterForm.getRawValue().storeId, this.groupMasterForm.getRawValue().fiscalYearId)
          .subscribe({
            next: (res) => {
              this.autoNo = res;
              // this.editData = null;
              console.log("isEdit : ", this.isEdit)
              // this.groupMasterForm.controls['no'].setValue(666);
              console.log("autoNo: ", this.autoNo);
              return res;
            },
            error: (err) => {
              console.log("fetch autoNo err: ", err);
              // alert("خطا اثناء جلب العناصر !");
            }
          })
      }
      else {
        console.log("change both values in updateHeader", this.groupMasterForm.getRawValue().storeId);
        this.api.getStrOpenAutoNo(this.groupMasterForm.getRawValue().storeId, this.groupMasterForm.getRawValue().fiscalYearId)
          .subscribe({
            next: (res) => {
              this.autoNo = res;
              // this.editData.no = res
              console.log("isEdit : ", this.isEdit)

              console.log("autoNo: ", this.autoNo);
              return res;
            },
            error: (err) => {
              console.log("fetch autoNo err: ", err);
              // alert("خطا اثناء جلب العناصر !");
            }
          })
      }

    }

  }

  toastrSuccess(): void {
    this.toastr.success("تم الحفظ بنجاح");
  }
  toastrDeleteSuccess(): void {
    this.toastr.success("تم الحذف بنجاح");
  }
  toastrEditSuccess(): void {
    this.toastr.success("تم التعديل بنجاح");
  }
}
