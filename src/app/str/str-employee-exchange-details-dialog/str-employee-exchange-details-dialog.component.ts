import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ApiService } from '../../services/api.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, map, startWith } from 'rxjs';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
// import { StrEmployeeExchangeDetailsDialogComponent } from '../str-employee-exchange-details-dialog/str-employee-exchange-details-dialog.component';
// import { Router } from '@angular/router';
import { ActivatedRoute, Router } from '@angular/router';


export class Item {
  constructor(public id: number, public name: string, public no: string, public fullCode: string) { }
}


@Component({
  selector: 'app-str-employee-exchange-details-dialog',
  templateUrl: './str-employee-exchange-details-dialog.component.html',
  styleUrls: ['./str-employee-exchange-details-dialog.component.css']
})
export class StrEmployeeExchangeDetailsDialogComponent implements OnInit {
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
  itemByFullCodeValue: any;
  fullCodeValue:any;

  formcontrol = new FormControl('');
  itemsList: Item[] = [];
  itemsCtrl: FormControl;
  filtereditems: Observable<Item[]>;
  selecteditems: Item | undefined;

  displayedColumns: string[] = ['itemName', 'state', 'price', 'qty', 'total', 'action'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private formBuilder: FormBuilder,
    private api: ApiService,
    @Inject(MAT_DIALOG_DATA) public editData: any,
    @Inject(MAT_DIALOG_DATA) public editDataDetails: any,
    private http: HttpClient,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<StrEmployeeExchangeDetailsDialogComponent>,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute) {

    this.stateDefaultValue = 'جديد';

    this.itemsCtrl = new FormControl();
    this.filtereditems = this.itemsCtrl.valueChanges.pipe(
      startWith(''),
      map(value => this._filterItems(value))
    );

  }


  ngOnInit(): void {

    console.log("get params: ", this.route.snapshot.queryParamMap.get('masterId'));
    this.getMasterRowId = this.route.snapshot.queryParamMap.get('masterId');
    // this.getMasterRowStoreId = this.route.snapshot.queryParamMap.get('store');
    // this.getMasterRowFiscalYearId = this.route.snapshot.queryParamMap.get('fiscalYear');
    // this.getMasterRowDate = this.route.snapshot.queryParamMap.get('date');
    console.log("get params after: ", "masterId: ", this.getMasterRowId);

    this.getItems();

    // this.getMasterRowId = this.editData;

    this.groupDetailsForm = this.formBuilder.group({
      employee_ExchangeId: ['', Validators.required], //MasterId
      qty: ['1', Validators.required],
      price: ['', Validators.required],
      total: ['', Validators.required],
      state: [this.stateDefaultValue, Validators.required],
      // percentage: [''],
      transactionUserId: ['', Validators.required],
      itemId: ['', Validators.required],
      itemName: ['', Validators.required],
    });



    if (this.editData) {
      // alert("price editData: "+ this.editData.qty);

      console.log("editData d before: ", this.editData)

      this.actionBtnMaster = "Update";
      // this.groupDetailsForm.controls['no'].setValue(this.editData.no);

      this.groupDetailsForm.controls['employee_ExchangeId'].setValue(this.editData.employee_ExchangeId);
      this.groupDetailsForm.controls['itemId'].setValue(this.editData.itemId);
      // this.groupDetailsForm.controls['percentage'].setValue(this.editData.percentage);

      this.groupDetailsForm.controls['price'].setValue(this.editData.price);
      // alert("price editData: " + this.editData.qty);
      this.groupDetailsForm.controls['qty'].setValue(this.editData.qty);
      this.groupDetailsForm.controls['state'].setValue(this.editData.state);
      this.groupDetailsForm.controls['total'].setValue(this.editData.total);

      // this.groupDetailsForm.addControl('id', new FormControl('', Validators.required));
      // this.groupDetailsForm.controls['id'].setValue(this.editData.id);

      console.log("editData d after: ", this.editData)

    }

    // this.getAllDetailsForms();

    this.userIdFromStorage = localStorage.getItem('transactionUserId');

    this.groupDetailsForm.controls['transactionUserId'].setValue(this.userIdFromStorage);

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


  displayItemName(item: any): string {
    return item && item.name ? item.name : '';
  }
  ItemSelected(event: MatAutocompleteSelectedEvent): void {
    const item = event.option.value as Item;
    console.log("item selected: ", item);
    this.selecteditems = item;
    this.groupDetailsForm.patchValue({ itemId: item.id });
    console.log("item in form: ", this.groupDetailsForm.getRawValue().itemId);

    // this.itemOnChange(this.groupDetailsForm.getRawValue().itemId);
    this.getCodeByItem(this.groupDetailsForm.getRawValue().itemId);

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


  getItemByCode(code: any) {
    if (code.keyCode == 13) {
      this.itemsList.filter((a: any) => {
        if (a.fullCode === code.target.value) {
          this.groupDetailsForm.controls['itemId'].setValue(a.id);
          console.log("item by code: ", a.name);
          this.itemsCtrl.setValue(a.name);
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


  // async itemOnChange(itemEvent: any) {
  //   console.log("itemEvent change value: ", itemEvent);
  //   // console.log("get avg values: ", this.getMasterRowStoreId, "year: ", this.getMasterRowFiscalYearId, "date: ", formatDate(this.getMasterRowDate, 'yyyy-MM-dd', this.locale));
  //   await this.api.getAvgPrice(
  //     this.getMasterRowStoreId,
  //     this.getMasterRowFiscalYearId,
  //     formatDate(this.getMasterRowDate, 'yyyy-MM-dd', this.locale),
  //     itemEvent)

  //     .subscribe({
  //       next: async (res) => {
  //         await this.groupDetailsForm.controls['price'].setValue(res);
  //         console.log("price passed: ", res);

  //         console.log("price: ", this.groupDetailsForm.getRawValue().price);
  //         if (this.groupDetailsForm.getRawValue().price == 0 || this.editData?.price == 0) {
  //           this.isReadOnly = false;
  //           console.log("change readOnly to enable here");
  //         }
  //         else {
  //           this.isReadOnly = true;
  //           console.log("change readOnly to disable here");
  //         }
  //       },
  //       error: (err) => {
  //         console.log("fetch fiscalYears data err: ", err);
  //         // alert("خطا اثناء جلب متوسط السعر !");
  //       }
  //     })
  // }



  async addDetailsInfo() {
    console.log("enter fun: ");

    if (!this.editData) {
      console.log("podt fun: ", this.getMasterRowId);

      if (this.getMasterRowId) {

        if (this.groupDetailsForm.getRawValue().itemId) {
          this.itemName = await this.getItemByID(this.groupDetailsForm.getRawValue().itemId);
          this.groupDetailsForm.controls['itemName'].setValue(this.itemName);

          // this.groupDetailsForm.controls['transactionUserId'].setValue(this.userIdFromStorage);
          // this.groupDetailsForm.controls['employee_ExchangeId'].setValue(this.getMasterRowId.id);
          this.groupDetailsForm.controls['total'].setValue((parseFloat(this.groupDetailsForm.getRawValue().price) * parseFloat(this.groupDetailsForm.getRawValue().qty)));
        }
        this.groupDetailsForm.controls['employee_ExchangeId'].setValue(this.getMasterRowId);

        console.log("groupDetails: ", this.groupDetailsForm.value);
        if (this.groupDetailsForm.valid) {

          this.api.postStrEmployeeExchangeDetails(this.groupDetailsForm.value)
            .subscribe({
              next: (res) => {
                // alert("detailsId: "+res);
                this.getDetailsRowId = {
                  "id": res
                };

                this.toastrSuccess();
                this.groupDetailsForm.reset();
                this.groupDetailsForm.controls['qty'].setValue(1);
                this.groupDetailsForm.controls['state'].setValue('جديد');
                this.itemByFullCodeValue = '';
                this.fullCodeValue = '';

                this.dialogRef.close('save');

                // this.updateDetailsForm()
                // this.getAllDetailsForms();
              },
              error: () => {
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


  async updateDetailsForm() {
    // if (this.editData) {
    //   this.groupMasterForm.addControl('id', new FormControl('', Validators.required));
    //   this.groupMasterForm.controls['id'].setValue(this.editData.id);
    // }
    // alert("detailsId 33: "+this.getDetailsRowId);

    this.groupDetailsForm.addControl('id', new FormControl('', Validators.required));
    this.groupDetailsForm.controls['id'].setValue(this.editData.id);

    // this.fiscalYearName = await this.getFiscalYearById(this.groupMasterForm.getRawValue().fiscalYearId);
    // this.employeeName = await this.getEmployeeById(this.groupMasterForm.getRawValue().employeeId);
    // this.distEmployeeName = await this.getDistEmployeeById(this.groupMasterForm.getRawValue().destEmployeeId);

    // console.log("groupMaster update: ", this.groupMasterForm.value);

    // this.api.putStrEmployeeExchange(this.groupMasterForm.value)
    //   .subscribe({
    //     next: (res) => {
    //       if (this.groupDetailsForm.value && this.getDetailedRowData) {
    //         this.groupDetailsForm.addControl('id', new FormControl('', Validators.required));
    //         this.groupDetailsForm.controls['id'].setValue(this.getDetailedRowData.id);

    if (this.groupDetailsForm.getRawValue().itemId) {
      this.itemName = await this.getItemByID(this.groupDetailsForm.getRawValue().itemId);
      this.groupDetailsForm.controls['itemName'].setValue(this.itemName);

      // this.groupDetailsForm.controls['transactionUserId'].setValue(this.userIdFromStorage);
      // this.groupDetailsForm.controls['employee_ExchangeId'].setValue(this.getMasterRowId.id);
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
          this.itemByFullCodeValue = '';
          this.fullCodeValue = '';
          
          this.dialogRef.close('save');

          // this.getAllDetailsForms();
          // this.getDetailedRowData = '';
        },
        error: (err) => {
          // console.log("update err: ", err)
          // alert("خطأ أثناء تحديث سجل المجموعة !!")
        }
      })
    this.groupDetailsForm.removeControl('id')

    // }

    //   },
    //   error: () => {
    //     // alert("خطأ أثناء تحديث سجل الصنف !!")
    //   }
    // })

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



  toastrSuccess(): void {
    this.toastr.success("تم الحفظ بنجاح");
  }
  toastrEditSuccess(): void {
    this.toastr.success('تم التعديل بنجاح');
  }
}
