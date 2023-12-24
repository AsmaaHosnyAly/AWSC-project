import { ChangeDetectorRef, Component, Inject, LOCALE_ID, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from '../../services/api.service';
import { MatDialog } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { formatDate } from '@angular/common';
import { PrintDialogComponent } from '../../../str/index/print-dialog/print-dialog.component';
import {
  FormControl,
  FormControlName,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Observable, debounceTime, isEmpty, map, startWith } from 'rxjs';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { PyGroupDialogComponent } from '../py-group-dialog/py-group-dialog.component';
import { GlobalService } from 'src/app/pages/services/global.service';
import { MatTabGroup } from '@angular/material/tabs';


export class PyItem {
  constructor(public id: number, public name: string) { }
}
export class Employee {
  constructor(public id: number, public name: string) { }
}

interface PyItemGroup {
  name: string;
  Action: string;
}

interface PyItemGroupDetails {
  pyItemName: string;
  action: string;
}

interface PyItemGroupEmployee {
  employeeName: string;
  action: string;
}

@Component({
  selector: 'app-py-group',
  templateUrl: './py-group.component.html',
  styleUrls: ['./py-group.component.css']
})
export class PyGroupComponent implements OnInit {

  ELEMENT_DATA: PyItemGroup[] = [];
  isLoading = false;
  totalRows = 0;
  pageSize = 5;
  currentPage: any;
  pageSizeOptions: number[] = [5, 10, 25, 100];

  displayedColumns: string[] = ['name', 'Action'];

  pdfurl = '';
  groupMasterForm!: FormGroup;
  groupDetailsForm!: FormGroup;
  groupEmployeeForm!: FormGroup;
  matchedIds: any;
  storeList: any;
  storeName: any;
  fiscalYearsList: any;
  // employeesList: any;
  costCentersList: any;
  journalsList: any;
  // accountsList: any;
  sourcesList: any;

  masterRowIdDelete: any;

  // dataSource2!: MatTableDataSource<any>;
  dataSource2: MatTableDataSource<PyItemGroup> = new MatTableDataSource();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  pageIndex: any;
  length: any;

  @ViewChild("matgroup", { static: false })
  matgroup!: MatTabGroup;

  editData: any;
  MasterGroupInfoEntered = false;
  transactionUserId = localStorage.getItem('transactionUserId');
  getMasterRowId: any;

  // dataSource!: MatTableDataSource<any>;
  // dataSourceEmployee!: MatTableDataSource<any>;
  displayedDetailsColumns: string[] = ['pyItemName', 'action'];
  displayedEmployeesColumns: string[] = ['employeeName', 'action'];


  dataSource: MatTableDataSource<PyItemGroupDetails> = new MatTableDataSource();
  pageIndexDetails: any;
  lengthDetails: any;
  // pageSizeDetails: any;
  pageSizeDetails = 5;
  ELEMENT_DATA_DETAILS: PyItemGroupDetails[] = [];
  currentPageDetails: any;

  dataSourceEmployee: MatTableDataSource<PyItemGroupEmployee> = new MatTableDataSource();
  pageIndexEmployee: any;
  lengthEmployee: any;
  pageSizeEmployee = 5;
  ELEMENT_DATA_EMPLOYEE: PyItemGroupEmployee[] = [];
  currentPageEmployee: any;

  PyItemsList: PyItem[] = [];
  pyItemCtrl: FormControl;
  filteredPyItem: Observable<PyItem[]>;
  selectedPyItem: PyItem | undefined;

  editDataDetails: any;
  editDataEmployee: any;

  employeesList: Employee[] = [];
  employeeCtrl: FormControl;
  filteredEmployee: Observable<Employee[]>;
  selectedEmployee: Employee | undefined;

  ngAfterViewInit() {
    this.dataSource2.paginator = this.paginator;
  }

  constructor(
    private api: ApiService,
    private dialog: MatDialog,
    private http: HttpClient, private formBuilder: FormBuilder,
    @Inject(LOCALE_ID) private locale: string,
    private toastr: ToastrService,
    global: GlobalService,
    private cdr: ChangeDetectorRef,

  ) {
    global.getPermissionUserRoles('PY', 'pyHome', 'الاستحقاقات', 'money');

    this.pyItemCtrl = new FormControl();
    this.filteredPyItem = this.pyItemCtrl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filterPyItems(value))
    );

    this.employeeCtrl = new FormControl();
    this.filteredEmployee = this.employeeCtrl.valueChanges.pipe(
      startWith(''),
      debounceTime(300), // Adjust the debounce time (in milliseconds) to your preference
      map((value) => this._filterEmployee(value))
    );

  }

  ngOnInit(): void {
    this.getPyItems();
    this.getEmployees();

    this.groupMasterForm = this.formBuilder.group({
      name: ['', Validators.required],
      transactionUserId: ['', Validators.required]
    });

    this.groupDetailsForm = this.formBuilder.group({
      itemGroupId: ['', Validators.required],
      pyItemId: ['', Validators.required],
      transactionUserId: ['', Validators.required],
    });

    this.groupEmployeeForm = this.formBuilder.group({
      itemGroupId: ['', Validators.required],
      employeeId: ['', Validators.required],
      transactionUserId: ['', Validators.required],
    });

    this.getAllMasterForms();
  }

  openDialog() {
    this.editData = '';
    this.groupMasterForm.controls['name'].setValue('');

    let tabGroup = this.matgroup;
    tabGroup.selectedIndex = 1;

    console.log("matGroup: ", tabGroup, "selectIndex: ", tabGroup.selectedIndex);

  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource2.filter = filterValue.trim().toLowerCase();

    if (this.dataSource2.paginator) {
      this.dataSource2.paginator.firstPage();
    }
  }
  getAllMasterForms() {
    // loadData() {
    if (!this.currentPage) {
      this.currentPage = 0;

      this.isLoading = true;

      fetch(this.api.getPyItemGroupPaginate(this.currentPage, this.pageSize))
        .then(response => response.json())
        .then(data => {
          this.totalRows = data.length;
          console.log("master data paginate first Time: ", data);
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
      this.isLoading = true;

      fetch(this.api.getPyItemGroupPaginate(this.currentPage, this.pageSize))
        .then(response => response.json())
        .then(data => {
          this.totalRows = data.length;
          console.log("master data paginate: ", data);
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


  }

  pageChanged(event: PageEvent) {
    console.log("page event: ", event);
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;

    this.getAllMasterForms();
  }

  editMasterForm(row: any) {
    let tabGroup = this.matgroup;
    tabGroup.selectedIndex = 1;

    this.editData = row;

    console.log('master edit form: ', this.editData);
    // this.actionBtnMaster = 'Update';
    this.groupMasterForm.controls['name'].setValue(this.editData.name);


    this.groupMasterForm.addControl(
      'id',
      new FormControl('', Validators.required)
    );
    this.groupMasterForm.controls['id'].setValue(this.editData.id);

    this.groupMasterForm.controls['transactionUserId'].setValue(
      localStorage.getItem('transactionUserId')
    );

    this.getAllDetailsForms();
    this.getAllDetailsEmployeeForms();
  }

  deleteAllForms(id: number) {
    this.masterRowIdDelete = id;
    var result = confirm('تاكيد الحذف ؟ ');

    this.matchedIds = null;

    if (result) {
      // this.api.deletePyItemGroup(id).subscribe({
      //   next: (res) => {
      this.api.getPyItemGroupDetailsByHeaderId(id)
        .subscribe({
          next: (res) => {

            this.matchedIds = res;

            for (let i = 0; i < this.matchedIds.length; i++) {
              this.deleteFormDetails(this.matchedIds[i].id);
              // this.deleteFormDetailsEmployee(this.matchedIds[i].id);

            }
            // this.deleteMaster();
            if(!this.matchedIds){
              this.matchedIds = null;

            }

          },
          error: (err) => {
            this.toastrDeleteError();

          }
        })

      this.api.getPyItemGroupEmployeeByHeaderId(id)
        .subscribe({
          next: (res) => {

            this.matchedIds = res;

            for (let i = 0; i < this.matchedIds.length; i++) {
              // this.deleteFormDetails(this.matchedIds[i].id);
              this.deleteFormDetailsEmployee(this.matchedIds[i].id);

              if(!this.matchedIds){
                this.matchedIds = null;
  
              }

            }
            // this.deleteMaster();

          },
          error: (err) => {
            this.toastrDeleteError();

          }
        })

      console.log("matchedIds before delete master: ", this.matchedIds);
      if (!this.matchedIds) {
        console.log("enter delete master fun, id: ", id);

        this.api.deletePyItemGroup(id).subscribe({
          next: (res) => {
            console.log("delete res: ", res);
            this.toastrDeleteSuccess();
            this.getAllMasterForms();
          },
          error: (err) => {
            console.log("delete err: ", err);
            this.toastrDeleteError();
          },
        });

      }

      // },
      // error: () => {
      //   // alert('خطأ أثناء حذف المجموعة !!');
      // },
      // });
    }
  }


  deleteMaster() {
    this.api.deletePyItemGroup(this.masterRowIdDelete).subscribe({
      next: (res) => {
        this.toastrDeleteSuccess();
        this.getAllMasterForms();
      },
      error: (err) => {
        this.toastrDeleteError();
      },
    });
  }

  deleteFormDetails(id: number) {
    this.api.deletePyItemGroupDetails(id).subscribe({
      next: (res) => {
        this.toastrDeleteSuccess();
        // this.deleteMaster();
        // this.getAllMasterForms();
        this.getAllDetailsForms();
      },
      error: (err) => {
        this.toastrDeleteError();
      },
    });
  }

  deleteFormDetailsEmployee(id: number) {
    this.api.deletePyItemGroupEmployee(id).subscribe({
      next: (res) => {
        this.toastrDeleteSuccess();
        // this.deleteMaster();
        // this.getAllMasterForms();
        this.getAllDetailsEmployeeForms();

      },
      error: (err) => {
        this.toastrDeleteError();
      },
    });
  }

  tabSelected(tab: any) {

    console.log("tab selected: ", tab);
    if (tab.index == 0) {
      this.editData = '';
      this.MasterGroupInfoEntered = false;
      // this.journalNo = '';
      // this.groupMasterForm.controls['no'].setValue('');
      // this.journalCtrl.setValue('');
      // this.groupMasterForm.controls['date'].setValue(this.currentDate);
      // this.groupMasterForm.controls['creditTotal'].setValue(0);
      // this.groupMasterForm.controls['debitTotal'].setValue(0);
      // this.groupMasterForm.controls['balance'].setValue(0);
      // this.groupMasterForm.controls['description'].setValue('');
      // this.groupMasterForm.controls['state'].setValue(this.defaultState);
      // this.groupMasterForm.controls['fiEntrySourceTypeId'].setValue('');

      this.getAllMasterForms();
    }
    // let tabGroup = this.matgroup;
    // tabGroup.selectedIndex = 1;

  }

  //////////////////////////////////////////////////////////////////////////////////////////////

  async nextToAddFormDetails() {
    this.groupMasterForm.removeControl('id');
    this.groupMasterForm.controls['transactionUserId'].setValue(this.transactionUserId);

    console.log('fiEntry master form: ', this.groupMasterForm.value);

    if (this.groupMasterForm.valid) {
      console.log('Master add form : ', this.groupMasterForm.value);
      this.api.postPyItemGroup(this.groupMasterForm.value).subscribe({
        next: (res) => {
          console.log('ID itemGroup after post: ', res);
          this.getMasterRowId = {
            id: res,
          };
          console.log('mastered res: ', this.getMasterRowId.id);
          this.MasterGroupInfoEntered = true;

          this.toastrSuccess();
          this.getAllDetailsForms();
          this.getAllDetailsEmployeeForms();
          this.addDetailsInfo();
        },
        error: (err) => {
          console.log('header post err: ', err);
          // alert("حدث خطأ أثناء إضافة مجموعة")
        },
      });
    }
  }

  async updateMaster() {
    console.log('nnnvvvvvvvvvv: ', this.groupMasterForm.value);

    this.api.putPyItemGroup(this.groupMasterForm.value).subscribe({
      next: (res) => {
        this.toastrUpdateSuccess();
      },
    });
  }


  /////////////////////////////////////////////////////////////////////////////////////////////
  editDetailsForm(row: any) {
    this.editDataDetails = row;
    console.log("editDataDetails: ", this.editDataDetails);

    this.groupDetailsForm.controls['transactionUserId'].setValue(this.editDataDetails.transactionUserId);
    this.groupDetailsForm.controls['itemGroupId'].setValue(this.editDataDetails.itemGroupId);
    this.groupDetailsForm.controls['pyItemId'].setValue(this.editDataDetails.pyItemId);

    this.groupDetailsForm.addControl('id', new FormControl('', Validators.required));
    this.groupDetailsForm.controls['id'].setValue(this.editDataDetails.id);

  }

  editDetailsEmployeeForm(row: any) {
    this.editDataEmployee = row;
    console.log("editDataEmployee: ", this.editDataEmployee);

    this.groupEmployeeForm.controls['transactionUserId'].setValue(this.editDataEmployee.transactionUserId);
    this.groupEmployeeForm.controls['itemGroupId'].setValue(this.editDataEmployee.itemGroupId);
    this.groupEmployeeForm.controls['employeeId'].setValue(this.editDataEmployee.employeeId);

    this.groupEmployeeForm.addControl('id', new FormControl('', Validators.required));
    this.groupEmployeeForm.controls['id'].setValue(this.editDataEmployee.id);
  }

  getAllDetailsForms() {
    if (this.editData) {
      this.getMasterRowId = {
        "id": this.editData.id
      }
    }

    console.log("mastered row get all data details: ", this.getMasterRowId)
    if (this.getMasterRowId) {

      if (!this.currentPageDetails) {
        this.currentPageDetails = 0;

        this.isLoading = true;
        fetch(this.api.getPyItemGroupDetailsPaginateByHeaderId(this.currentPageDetails, this.pageSizeDetails, this.getMasterRowId.id))
          .then(response => response.json())
          .then(data => {

            console.log("details data paginate first Time: ", data);
            this.dataSource.data = data.items;
            this.pageIndexDetails = data.page;
            this.pageSizeDetails = data.pageSize;
            this.lengthDetails = data.totalItems;
            setTimeout(() => {
              this.paginator.pageIndex = this.currentPageDetails;
              this.paginator.length = this.lengthDetails;
            });

            this.isLoading = false;
          }, error => {
            console.log(error);
            this.isLoading = false;
          });
      }
      else {

        this.isLoading = true;
        fetch(this.api.getPyItemGroupDetailsPaginateByHeaderId(this.currentPageDetails, this.pageSizeDetails, this.getMasterRowId.id))
          .then(response => response.json())
          .then(data => {

            console.log("details data paginate: ", data);
            this.dataSource.data = data.items;
            this.pageIndexDetails = data.page;
            this.pageSizeDetails = data.pageSize;
            this.lengthDetails = data.totalItems;
            setTimeout(() => {
              this.paginator.pageIndex = this.currentPageDetails;
              this.paginator.length = this.lengthDetails;
            });
            this.isLoading = false;
          }, error => {
            console.log(error);
            this.isLoading = false;
          });


      }


    }
  }

  pageChangedDetails(event: PageEvent) {
    console.log("page event: ", event);
    this.pageSizeDetails = event.pageSize;
    this.currentPageDetails = event.pageIndex;

    this.getAllDetailsForms();
  }


  getAllDetailsEmployeeForms() {
    if (this.editData) {
      this.getMasterRowId = {
        "id": this.editData.id
      }
    }

    console.log("mastered row get all data employee: ", this.getMasterRowId)
    if (this.getMasterRowId) {

      if (!this.currentPageEmployee) {
        this.currentPageEmployee = 0;

        this.isLoading = true;
        fetch(this.api.getPyItemGroupEmployeePaginateByHeaderId(this.currentPageEmployee, this.pageSizeEmployee, this.getMasterRowId.id))
          .then(response => response.json())
          .then(data => {

            console.log("employee data paginate first Time: ", data);
            this.dataSourceEmployee.data = data.items;
            this.pageIndexEmployee = data.page;
            this.pageSizeEmployee = data.pageSize;
            this.lengthEmployee = data.totalItems;
            setTimeout(() => {
              this.paginator.pageIndex = this.currentPageEmployee;
              this.paginator.length = this.lengthEmployee;
            });

            this.isLoading = false;
          }, error => {
            console.log(error);
            this.isLoading = false;
          });
      }
      else {

        this.isLoading = true;
        fetch(this.api.getPyItemGroupEmployeePaginateByHeaderId(this.currentPageEmployee, this.pageSizeEmployee, this.getMasterRowId.id))
          .then(response => response.json())
          .then(data => {

            console.log("employee data paginate: ", data);
            this.dataSourceEmployee.data = data.items;
            this.pageIndexEmployee = data.page;
            this.pageSizeEmployee = data.pageSize;
            this.lengthEmployee = data.totalItems;
            setTimeout(() => {
              this.paginator.pageIndex = this.currentPageEmployee;
              this.paginator.length = this.lengthEmployee;
            });
            this.isLoading = false;
          }, error => {
            console.log(error);
            this.isLoading = false;
          });


      }


    }
  }

  pageChangedEmployee(event: PageEvent) {
    console.log("page event: ", event);
    this.pageSizeEmployee = event.pageSize;
    this.currentPageEmployee = event.pageIndex;

    this.getAllDetailsEmployeeForms();
  }

  ///////////////////////////////////////////////////////////////////////////////////////////
  private _filterPyItems(value: string): PyItem[] {
    const filterValue = value;
    console.log("filterValue222:", filterValue);

    return this.PyItemsList.filter(
      (pyItem) =>
        pyItem.name.toLowerCase().includes(filterValue)
    );
  }

  displayPyItemName(pyItem: any): string {
    return pyItem && pyItem.name ? pyItem.name : '';
  }
  PyItemSelected(event: MatAutocompleteSelectedEvent): void {
    const pyItem = event.option.value as PyItem;
    console.log("pyItem selected: ", pyItem);
    this.selectedPyItem = pyItem;
    this.groupDetailsForm.patchValue({ pyItemId: pyItem.id });
  }
  openAutoPyItem() {
    this.pyItemCtrl.setValue(''); // Clear the input field value

    // Open the autocomplete dropdown by triggering the value change event
    this.pyItemCtrl.updateValueAndValidity();
  }


  async addDetailsInfo() {
    if (!this.getMasterRowId) {
      this.getMasterRowId = {
        "id": this.editData.id
      }
    }

    this.groupDetailsForm.controls['itemGroupId'].setValue(this.getMasterRowId.id);
    this.groupDetailsForm.controls['transactionUserId'].setValue(this.transactionUserId);

    if (!this.editDataDetails) {
      console.log("Enteeeeerrr post condition: ", this.groupDetailsForm.value)

      if (this.getMasterRowId) {
        console.log("form  headerId: ", this.getMasterRowId, "details form: ", this.groupDetailsForm.value)

        if (this.groupDetailsForm.valid) {

          this.api.postPyItemGroupDetails(this.groupDetailsForm.value)
            .subscribe({
              next: (res) => {
                // this.getDetailsRowId = {
                //   "id": res
                // };
                // console.log("Details res: ", this.getDetailsRowId.id)

                this.toastrSuccess();
                this.groupDetailsForm.reset();
                this.pyItemCtrl.reset();
                this.getAllDetailsForms();

              },
              error: () => {
                // alert("حدث خطأ أثناء إضافة مجموعة")
              }
            })
        }

      }

    }
    else {
      console.log("Enteeeeerrr edit condition: ", this.groupDetailsForm.value)

      this.api.putPyItemGroupDetails(this.groupDetailsForm.value)
        .subscribe({
          next: (res) => {
            this.toastrSuccess();
            this.groupDetailsForm.reset();
            this.pyItemCtrl.reset();
            this.editDataDetails = '';
            this.getAllDetailsForms();
          },
          error: (err) => {
            // console.log("update err: ", err)
            // alert("خطأ أثناء تحديث سجل المجموعة !!")
          }
        })
      this.groupDetailsForm.removeControl('id')
    }
  }

  /////////////////////////////////////////////////////////////////////////////////////////////

  private _filterEmployee(value: string): Employee[] {
    const filterValue = value;
    console.log("filterValue222:", filterValue);

    return this.employeesList.filter((employee) =>
      employee.name ? employee.name.includes(filterValue) : '-'
    );
  }

  displayEmployeeName(employee: any): string {
    return employee && employee.name ? employee.name : '';
  }
  EmployeeSelected(event: MatAutocompleteSelectedEvent): void {
    const employee = event.option.value as Employee;
    console.log("employee selected: ", employee);
    this.selectedEmployee = employee;
    this.groupEmployeeForm.patchValue({ employeeId: employee.id });
  }
  openAutoEmployee() {
    this.employeeCtrl.setValue(''); // Clear the input field value

    // Open the autocomplete dropdown by triggering the value change event
    this.employeeCtrl.updateValueAndValidity();
  }


  async addEmployeeInfo() {
    if (!this.getMasterRowId) {
      this.getMasterRowId = {
        "id": this.editData.id
      }
    }

    this.groupEmployeeForm.controls['itemGroupId'].setValue(this.getMasterRowId.id);
    this.groupEmployeeForm.controls['transactionUserId'].setValue(this.transactionUserId);

    if (!this.editDataEmployee) {
      console.log("Enteeeeerrr post condition: ", this.groupEmployeeForm.value)

      if (this.getMasterRowId) {
        console.log("form  headerId: ", this.getMasterRowId, "details form: ", this.groupEmployeeForm.value)

        if (this.groupEmployeeForm.valid) {

          this.api.postPyItemGroupEmployee(this.groupEmployeeForm.value)
            .subscribe({
              next: (res) => {
                // this.getDetailsRowId = {
                //   "id": res
                // };
                // console.log("Details res: ", this.getDetailsRowId.id)

                this.toastrSuccess();
                this.groupEmployeeForm.reset();
                this.employeeCtrl.reset();
                this.getAllDetailsEmployeeForms();

              },
              error: () => {
                // alert("حدث خطأ أثناء إضافة مجموعة")
              }
            })
        }

      }

    }
    else {
      console.log("Enteeeeerrr edit condition: ", this.groupEmployeeForm.value)

      this.api.putPyItemGroupEmployee(this.groupEmployeeForm.value)
        .subscribe({
          next: (res) => {
            this.toastrSuccess();
            this.groupEmployeeForm.reset();
            this.employeeCtrl.reset();
            this.editDataEmployee = '';
            this.getAllDetailsEmployeeForms();
          },
          error: (err) => {
            // console.log("update err: ", err)
            // alert("خطأ أثناء تحديث سجل المجموعة !!")
          }
        })
      this.groupEmployeeForm.removeControl('id')
    }
  }


  getPyItems() {
    this.api.getPyItem()
      .subscribe({
        next: (res) => {
          this.PyItemsList = res;
          console.log("pyItems res: ", this.PyItemsList);
        },
        error: (err) => {
          console.log("fetch pyItems data err: ", err);
          // alert("خطا اثناء جلب الدفاتر !");
        }
      })
  }

  getEmployees() {
    this.api.getEmployee()
      .subscribe({
        next: (res) => {
          this.employeesList = res;
          console.log("employees res: ", this.employeesList);
          this.cdr.detectChanges(); // Trigger change detection

        },
        error: (err) => {
          console.log("fetch employees data err: ", err);
          // alert("خطا اثناء جلب الدفاتر !");
        }
      })
  }

  toastrSuccess(): void {
    this.toastr.success('تم الحفظ بنجاح');
  }
  toastrUpdateSuccess(): void {
    this.toastr.success('تم التعديل بنجاح');
  }
  toastrDeleteSuccess(): void {
    this.toastr.success('تم الحذف بنجاح');
  }
  toastrDeleteError(): void {
    this.toastr.error('خطا اثناء حذف البيانات !!');
  }
}
