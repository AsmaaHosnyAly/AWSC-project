

import { AfterViewInit, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from '../../services/api.service';
import { Params, Router } from '@angular/router';
import { Observable, map, startWith } from 'rxjs';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

export class Exchange {
  constructor(public id: number, public name: string) { }
}

export class item {
  constructor(public id: number, public name: string, public fullCode: string) { }
}
export class Employee {
  constructor(public id: number, public name: string, public code: string) { }
}

@Component({
  selector: 'app-py-exchange-details-dialog',
  templateUrl: './py-exchange-details-dialog.component.html',
  styleUrls: ['./py-exchange-details-dialog.component.css']
})
export class PyExchangeDetailsDialogComponent  implements OnInit {
  groupDetailsForm !: FormGroup;
  groupMasterForm !: FormGroup;
  actionBtnMaster: string = "Save";
  actionBtnDetails: string = "Save";
  MasterGroupInfoEntered = false;
  dataSource!: MatTableDataSource<any>;
  matchedIds: any;
  getDetailedRowData: any;
  sumOfTotals = 0;
  sumOfnameTotals = 0;
  sumOfvalueTotals = 0;
  resultOfBalance = 0;

  getMasterRowId: any;
  getDetailsRowId: any;
  journalsList: any;
  sourcesList: any;
 
  // employeesList: any;
  distEmployeesList: any;
  costCentersList: any;
  // itemsList: any;
  fiscalYearsList: any;
  storeName: any;
  itemName: any;
  userIdFromStorage: any;
  deleteConfirmBtn: any;
  dialogRefDelete: any;


  employeesList: Employee[] = [];
  employeeCtrl: FormControl<any>;
  filteredEmployee: Observable<Employee[]>;
  selectedEmployee: Employee | undefined;

  fullCodeValue: any;
  itemByFullCodeValue: any;

  itemsList: item[] = [];
  itemCtrl: FormControl;
  filtereditem: Observable<item[]>;
  selecteditem: item | undefined;

  exchangesList: Exchange[] = [];
  exchangeCtrl: FormControl;
  filteredexchange: Observable<Exchange[]>;
  selectedexchange: Exchange | undefined;

  // displayedColumns: string[] = ['name', 'value', 'accountName', 'fiAccountItemId', 'action'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private formBuilder: FormBuilder,
    private api: ApiService,
    @Inject(MAT_DIALOG_DATA) public editData: any,
    @Inject(MAT_DIALOG_DATA) public editDataDetails: any,
    private http: HttpClient,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<PyExchangeDetailsDialogComponent>,

    private toastr: ToastrService,
    private route: Router) {

    this.employeeCtrl = new FormControl();
    this.filteredEmployee = this.employeeCtrl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filterEmployees(value))
    );

    this.itemCtrl = new FormControl();
    this.filtereditem = this.itemCtrl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filteritems(value))
    );

    this.exchangeCtrl = new FormControl();
    this.filteredexchange = this.exchangeCtrl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filterexchanges(value))
    );

  }

  ngOnInit(): void {
    this.getEmployees();
    this.getItems();
    this.getExchange();
    // this.getFiAccountItems();

    this.groupDetailsForm = this.formBuilder.group({
      exchangeId: ['', Validators.required],
      name: ['', Validators.required],
      value: ['', Validators.required],
      employeeId: ['', Validators.required],
      itemId: ['', Validators.required],
      transactionUserId: ['', Validators.required],
      updateUserName:[1],
    });
    console.log("details edit form before: ", this.editData);

    if (this.editData) {
      console.log("details edit form: ", this.editData);
      // this.actionBtnMaster = "Update";

      this.groupDetailsForm.controls['transactionUserId'].setValue(localStorage.getItem('transactionUserId'));
      this.groupDetailsForm.controls['exchangeId'].setValue(this.editData.exchangeId);
      this.groupDetailsForm.controls['employeeId'].setValue(this.editData.employeeId);
      this.groupDetailsForm.controls['itemId'].setValue(this.editData.itemId);

      this.groupDetailsForm.controls['name'].setValue(this.editData.name);
      this.groupDetailsForm.controls['value'].setValue(this.editData.value)

      this.groupDetailsForm.addControl('id', new FormControl('', Validators.required));
      this.groupDetailsForm.controls['id'].setValue(this.editData.id);

      console.log("details edit form after: ", this.editData);
}

  }

  private _filterEmployees(value: string): Employee[] {
    const filterValue = value;
    console.log("filterValue222:", filterValue);

    return this.employeesList.filter(
      (employee) =>
        employee.name.toLowerCase().includes(filterValue)
    );
  }

  displayemployeeName(employee: any): string {
    return employee && employee.name ? employee.name : '';
  }
  employeeSelected(event: MatAutocompleteSelectedEvent): void {
    const employee = event.option.value as Employee;
    console.log("employee selected: ", employee);
    this.selectedEmployee = employee;
    this.groupDetailsForm.patchValue({ employeeId: employee.id });
  }
  openAutoemployee() {
    this.employeeCtrl.setValue(''); // Clear the input field value

    // Open the autocomplete dropdown by triggering the value change event
    this.employeeCtrl.updateValueAndValidity();
  }


  displayexchangeName(exchange: any): string {
    return exchange && exchange.name ? exchange.name : '';
  }
  exchangeSelected(event: MatAutocompleteSelectedEvent): void {
    const exchange = event.option.value as Exchange;
    console.log('exchange selected: ', exchange);
    this.selectedexchange = exchange;
    this.groupDetailsForm.patchValue({ exchangeId: exchange.id });
    console.log('exchangeId',this.groupDetailsForm.getRawValue().exchangeId)

  }
  private _filterexchanges(value: string): Exchange[] {
    const filterValue = value;
    return this.exchangesList.filter((exchange:any) =>
      exchange.name.toLowerCase().includes(filterValue)
    );
  }

  openAutoexchange() {
    this.exchangeCtrl.setValue(''); // Clear the input field value

    // Open the autocomplete dropdown by triggering the value change event
    this.exchangeCtrl.updateValueAndValidity();
  }





 
  displayitemName(item: any): string {
    return item && item.name ? item.name : '';
  }
  itemSelected(event: MatAutocompleteSelectedEvent): void {
    const item = event.option.value as item;
    console.log('item selected: ', item);
    this.selecteditem = item;
    this.groupDetailsForm.patchValue({ itemId: item.id });
    this.groupDetailsForm.patchValue({ fullCode: item.fullCode });
    console.log('item in form: ', this.groupDetailsForm.getRawValue().itemId);
    this.itemOnChange(this.groupDetailsForm.getRawValue().itemId);

    this.getCodeByItem(this.groupDetailsForm.getRawValue().itemId);

  
 

  }
  private _filteritems(value: string): item[] {
    const filterValue = value;
    return this.itemsList.filter((item:any) =>
      item.name.toLowerCase().includes(filterValue)
    );
  }

  openAutoitem() {
    this.itemCtrl.setValue(''); // Clear the input field value

    // Open the autocomplete dropdown by triggering the value change event
    this.itemCtrl.updateValueAndValidity();
  }
  getCodeByItem(item: any) {
    console.log("item by code: ", item, "code: ", this.itemsList);

    // if (item.keyCode == 13) {
    this.itemsList.filter((a: any) => {
      if (a.id === item) {
        // this.groupDetailsForm.controls['itemId'].setValue(a.id);
        console.log("item by code selected: ", a)
        // console.log("item by code selected: ", a.fullCode)
        if (a.fullCode) {
          this.fullCodeValue = a.fullCode;
        }
        else {
          this.fullCodeValue = '-';
        }

        // this.itemOnChange(this.groupDetailsForm.getRawValue().itemId)
      }
    })
    // }


  }
  itemOnChange(itemEvent: any) {
    // this.isReadOnly = true;
    console.log("itemId: ", itemEvent)

    // if (this.groupDetailsForm.getRawValue().avgPrice == 0) {
    //   this.isReadOnly = false;
    //   console.log("change readOnly to enable");
    // }
    // else {
    //   this.isReadOnly = true;
    //   console.log("change readOnly to disable");
    // }

    // if (this.groupDetailsForm.getRawValue().price == 0 || this.editData?.price == 0) {
    //   this.isReadOnly = false;
    //   console.log("change readOnly to enable here");
    // }
    // else {
    //   this.isReadOnly = true;
    //   console.log("change readOnly to disable here");
    // }


  }

  getExchange() {
    this.api.getPyExchange().subscribe({
      next: (res) => {
        this.exchangesList = res;
        // console.log("exchanges res: ", this.exchangesList);
      },
      error: (err) => {
        // console.log("fetch items data err: ", err);
        // alert("خطا اثناء جلب العناصر !");
      },
    });
  }


  getItems() {
    this.api.getItems().subscribe({
      next: (res) => {
        this.itemsList = res;
        // console.log("items res: ", this.itemsList);
      },
      error: (err) => {
        // console.log("fetch items data err: ", err);
        // alert("خطا اثناء جلب العناصر !");
      },
    });
  }
  getItemByID(id: any) {
    // console.log("row item id: ", id);
    return fetch(this.api.getItemById(id))
      .then((response) => response.json())
      .then((json) => {
        console.log('fetch item name by id res: ', json.name);
        return json.name;
      })
      .catch((err) => {
        // console.log("error in fetch item name by id: ", err);
        // alert("خطا اثناء جلب رقم العنصر !");
      });
  }

  getItemByCode(code: any) {
    if (code.keyCode == 13) {
      this.itemsList.filter((a: any) => {
        if (a.fullCode === code.target.value) {
          this.groupDetailsForm.controls['itemId'].setValue(a.id);
          this.groupDetailsForm.controls['fullCode'].setValue(a.fullCode);
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
    this.getMasterRowId = this.route.url.split('=').pop();
    this.groupDetailsForm.controls['exchangeId'].setValue(this.getMasterRowId);
    this.groupDetailsForm.controls['transactionUserId'].setValue(localStorage.getItem('transactionUserId'));
    console.log("check : ", this.route.url.split('=').pop());
    console.log("check id for insert: ", this.getDetailedRowData, "edit data form: ", this.editData, "haeder id: ", this.groupDetailsForm.getRawValue().exchangeId);

    if (!this.editData) {
      console.log("Enteeeeerrr post condition: ", this.groupDetailsForm.value)

      if (this.getMasterRowId) {
        console.log("form  headerId: ", this.getMasterRowId, "details form: ", this.groupDetailsForm.value)

        if (this.groupDetailsForm.getRawValue().name || this.groupDetailsForm.getRawValue().value) {
          if (this.editData) {
            console.log("found details: ", this.editData)
            this.sumOfnameTotals = this.editData.nameTotal;
            this.sumOfvalueTotals = this.editData.valueTotal;

            this.sumOfnameTotals = this.sumOfnameTotals + this.groupDetailsForm.getRawValue().name;
            this.sumOfvalueTotals = this.sumOfvalueTotals + this.groupDetailsForm.getRawValue().value;
           

            if (this.sumOfnameTotals > this.sumOfvalueTotals) {
              this.resultOfBalance = this.sumOfnameTotals - this.sumOfvalueTotals;
            }
            else {
              this.resultOfBalance = this.sumOfvalueTotals - this.sumOfnameTotals;
            }

          }
          else {
            console.log("found details withoutEdit: ", this.groupDetailsForm.value)
            this.sumOfnameTotals = this.sumOfnameTotals + this.groupDetailsForm.getRawValue().name;
            this.sumOfvalueTotals = this.sumOfvalueTotals + this.groupDetailsForm.getRawValue().value;
           
          }

        }

        // console.log("add details second time, get detailed row data: ", !this.getDetailedRowData)

        // console.log("add details second time, details form: ", this.groupDetailsForm.value)
        // console.log("add details second time, get detailed row data: ", !this.getDetailedRowData)

        if (this.groupDetailsForm.valid && !this.getDetailedRowData) {

          this.api.postPyExchangeDetails(this.groupDetailsForm.value)
            .subscribe({
              next: (res) => {
                this.getDetailsRowId = {
                  "id": res
                };
                // console.log("Details res: ", this.getDetailsRowId.id)
                
                // alert("تمت إضافة التفاصيل بنجاح");
                this.toastrSuccess();
                this.groupDetailsForm.reset();

                this.dialogRef.close('save');

              },
              error: () => {
                // alert("حدث خطأ أثناء إضافة مجموعة")
              }
            })
        }
        // else {
        //   this.updateBothForms();
        // }

      }

    }
    else {
      console.log("Enteeeeerrr edit condition: ", this.groupDetailsForm.value)

      this.api.putPyExchangeDetails(this.groupDetailsForm.value)
        .subscribe({
          next: (res) => {
            this.toastrSuccess();
            this.groupDetailsForm.reset();
            this.dialogRef.close('save');
          },
          error: (err) => {
            // console.log("update err: ", err)
            // alert("خطأ أثناء تحديث سجل المجموعة !!")
          }
        })
      this.groupDetailsForm.removeControl('id')
    }
  }
  getEmployees() {
    console.log("hey from employeeeeee")
    this.api.getEmployee().subscribe({
      next: (res) => {
        this.employeesList = res;
        console.log('employee list: ', this.employeesList);
        // this.employeeName =  this.getemployeeByID(this.groupMasterForm.getRawValue().employeeId);
        // console.log("employeeId",this.groupMasterForm.getRawValue().employeeId)
        // console.log('employeeName',this.employeeName.value)
        // this.employeeName=this.editData(this.employeesList)
      },
      error: (err) => {
        // console.log("fetch store data err: ", err);
        // alert("خطا اثناء جلب المخازن !");
      },
    });
  }




 
  closeDialog() {
    let result = window.confirm('هل تريد اغلاق الطلب');
    if (result) {

      this.dialogRef.close('Save');
    }
  }

  toastrSuccess(): void {
    this.toastr.success("تم الحفظ بنجاح");
  }
}

