import { StrCostcenterComponent } from './../str-costcenter/str-costcenter.component';
// import { CostCenter } from '../str/StrCostcenterComponent/';
// import { FiscalYear } from './../str-withdraw-dialog2/';
import { Component, OnInit, Inject, ViewChild, LOCALE_ID } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from '@angular/forms';
import { ApiService } from '../../services/api.service';
// import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatDialogRef } from '@angular/material/dialog';
import { formatDate } from '@angular/common';
import { Observable, map, startWith, tap } from 'rxjs';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { ActivatedRoute, Router } from '@angular/router';
import { PagesEnums } from 'src/app/core/enums/pages.enum';

export class item {
  constructor(public id: number, public name: string, public fullCode: string) { }
}

export class List {
  constructor(public id: number, public name: string) { }
}

export class Product {
  constructor(public id: number, public name: string, public code: any) { }
}

@Component({
  selector: 'app-str-withdraw-details-dialog',
  templateUrl: './str-withdraw-details-dialog.component.html',
  styleUrls: ['./str-withdraw-details-dialog.component.css'],
})
export class StrWithdrawDetailsDialogComponent {
  groupDetailsForm!: FormGroup;
  getMasterRowEmployeeId: any
  groupMasterForm!: FormGroup;
  actionBtnMaster: string = 'Save';
  actionBtnDetails: string = 'Save';
  actionName: string = 'choose';
  getMasterRowId: any;
  getMasterRowStoreId: any;
  getMasterRowFiscalYearId: any;
  getMasterRowDate: any;
  MasterGroupInfoEntered = false;
  dataSource!: MatTableDataSource<any>;
  matchedIds: any;
  getDetailedRowData: any;
  sumOfTotals = 0;
  storeList: any;
  // itemsList: any;
  withDrawNoList: any;
  statesList: any;
  notesList: any;
  // fiscalYearsList: any;
  storeName: any;
  itemName: any;
  stateName: any;
  // notesName:any;
  withDrawNoName: any;
  // isReadOnly: any = false;
  isReadOnlyEmployee: any = false;
  userIdFromStorage: any;
  deleteConfirmBtn: any;
  dialogRefDelete: any;
  // employeeList: any;
  employeeName: any;
  costcenterName: any;
  // costcenterList: any;
  // deststoreList:any;
  desstoreName: any;
  autoNo: any;

  fiscalYearValue: any;
  deststoreValue: any;
  storeSelectedId: any;
  fiscalYearSelectedId: any;
  displayedColumns: string[] = [
    'itemName',
    'price',
    'qty',
    'total',
    'percentage',
    'action',
  ];

  // isReadOnlyEmployee: any = false;
  isReadOnlyPercentage: any = true;
  deststoresList: any;


  employeesList: any;

  fullCodeValue: any;
  itemByFullCodeValue: any;

  fiscalYearsList: any;

  itemsList: item[] = [];
  itemCtrl: FormControl;
  filtereditem: Observable<item[]>;
  selecteditem: item | undefined;

  productsList: Product[] = [];
  productCtrl: FormControl;
  filteredProduct: Observable<Product[]>;
  selectedProduct: Product | undefined;

  productIdValue: any;

  isEditDataReadOnly: boolean = true;

  isEdit: boolean = false;
  stateDefaultValue: any;

  defaultStoreSelectValue: any;
  defaultFiscalYearSelectValue: any;

  selectedList: List | undefined;
  getAddData: any;
  sourceSelected: any;

  userRoles: any;
  // productsList: any;
  itemSearchWay: any;
  activeItemSearchWay: any;

  userRoleStoresAcc = PagesEnums.STORES_ACCOUNTS;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  confirm: any;

  constructor(
    private formBuilder: FormBuilder,
    private api: ApiService,
    @Inject(MAT_DIALOG_DATA) public editData: any,
    @Inject(MAT_DIALOG_DATA) public editDataDetails: any,
    @Inject(LOCALE_ID) private locale: string,
    private http: HttpClient,
    private toastr: ToastrService,
    private dialog: MatDialog,
    private router: Router,
    private dialogRef: MatDialogRef<StrWithdrawDetailsDialogComponent>,
    private route: ActivatedRoute
  ) {

    this.stateDefaultValue = "جديد";
    this.itemSearchWay = 'searchByItemCode';

    this.itemCtrl = new FormControl();
    this.filtereditem = this.itemCtrl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filteritems(value))
    );

    this.productCtrl = new FormControl();
    this.filteredProduct = this.productCtrl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filterProducts(value))
    );

  }

  ngOnInit(): void {
    this.getItems();
    this.getProducts();

    this.getDestStores();

    let dateNow: Date = new Date();
    console.log('Date = ' + dateNow);

    this.getMasterRowId = this.editData;


    this.groupDetailsForm = this.formBuilder.group({
      stR_WithdrawId: ['', Validators.required], //MasterId
      qty: ['1', Validators.required],
      percentage: ['100', Validators.required],
      price: ['', Validators.required],
      total: ['', Validators.required],
      transactionUserId: [1, Validators.required],
      destStoreUserId: [1, Validators.required],
      itemId: ['', Validators.required],
      state: [this.stateDefaultValue, Validators.required],
      fullCode: [''],
      // withDrawNoId: ['' ],

      itemName: [''],
      // avgPrice: [''],

      stateName: [''],

      // notesName: [''],
    });

    console.log("get params: ", this.route.snapshot.queryParamMap.get('date'));
    this.getMasterRowId = this.route.snapshot.queryParamMap.get('masterId');
    this.getMasterRowStoreId = this.route.snapshot.queryParamMap.get('store');
    this.getMasterRowFiscalYearId = this.route.snapshot.queryParamMap.get('fiscalYear');
    this.getMasterRowDate = formatDate(this.route.snapshot.queryParamMap.get('date')!, 'yyyy-MM-dd', this.locale);

    console.log("get params after: ", "masterId: ", this.getMasterRowId, "storeId: ", this.getMasterRowStoreId, "fisclaYear: ", this.getMasterRowFiscalYearId, "date: ", this.getMasterRowDate, "employeeId: ", this.getMasterRowEmployeeId);

    if (this.editData) {
      this.actionBtnDetails = 'Update';

      console.log("edit Data: ", this.editData);

      this.groupDetailsForm.controls['fullCode'].setValue(this.editData.fullCode);
      this.groupDetailsForm.controls['itemId'].setValue(this.editData.itemId);
      this.groupDetailsForm.controls['percentage'].setValue(this.editData.percentage);
      this.groupDetailsForm.controls['price'].setValue(this.editData.price);
      this.groupDetailsForm.controls['qty'].setValue(this.editData.qty);
      this.groupDetailsForm.controls['stR_WithdrawId'].setValue(this.editData.stR_WithdrawId);
      this.groupDetailsForm.controls['state'].setValue(this.editData.state);
      this.groupDetailsForm.controls['total'].setValue(this.editData.total);
      this.groupDetailsForm.controls['transactionUserId'].setValue(localStorage.getItem('transactionUserId'));


      // if (this.groupDetailsForm.getRawValue().price == 0 || this.editData?.price == 0) {
      //   this.isReadOnly = false;
      //   console.log("change readOnly to enable here");
      // }
      // else {
      //   this.isReadOnly = true;
      //   console.log("change readOnly to disable here");
      // }

      console.log('state value changed: ', this.groupDetailsForm.getRawValue().state);
      if (this.groupDetailsForm.getRawValue().state == "مستعمل") {
        this.isReadOnlyPercentage = false;
        this.groupDetailsForm.controls['state'].setValue(this.groupDetailsForm.getRawValue().state);
      } else {
        this.isReadOnlyPercentage = true;
        this.groupDetailsForm.controls['state'].setValue(this.groupDetailsForm.getRawValue().state);
        this.groupDetailsForm.controls['percentage'].setValue(100);
      }


    }
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

    this.api.getAvgPrice(
      this.getMasterRowStoreId,
      this.getMasterRowFiscalYearId,
      formatDate(this.getMasterRowDate, 'yyyy-MM-dd', this.locale),
      this.groupDetailsForm.getRawValue().itemId
    )
      .subscribe({
        next: (res) => {
          // this.priceCalled = res;
          // this.groupDetailsForm.controls['avgPrice'].setValue(res);
          this.groupDetailsForm.controls['price'].setValue(res);
          // if (this.groupDetailsForm.getRawValue().price == 0 || this.editData?.price == 0) {
          //   this.isReadOnly = false;
          //   console.log("change readOnly to enable here");
          // }
          // else {
          //   this.isReadOnly = true;
          //   console.log("change readOnly to disable here");
          // }
          console.log("price avg called res: ", this.groupDetailsForm.getRawValue().price);
        },
        error: (err) => {
          // console.log("fetch fiscalYears data err: ", err);
          // alert("خطا اثناء جلب متوسط السعر !");
        }
      })

  }
  private _filteritems(value: string): item[] {
    const filterValue = value;
    return this.itemsList.filter((item) =>
      item.name.toLowerCase().includes(filterValue)
    );
  }

  openAutoitem() {
    this.itemCtrl.setValue(''); // Clear the input field value

    // Open the autocomplete dropdown by triggering the value change event
    this.itemCtrl.updateValueAndValidity();
  }


  private _filterProducts(value: string): Product[] {
    const filterValue = value;
    console.log("filterValue222:", filterValue);

    return this.productsList.filter(
      (product) =>
        product.name.toLowerCase().includes(filterValue) ||
        product.code.toString().toLowerCase().includes(filterValue)
    );
  }
  displayProductName(product: any): string {
    return product && product.name ? product.name : '';
  }
  ProductSelected(event: MatAutocompleteSelectedEvent): void {
    const product = event.option.value as Product;
    console.log("product selected: ", product);
    this.selectedProduct = product;
    // this.groupDetailsForm.patchValue({ productId: product.id });
    this.productIdValue = product.id;

    console.log("product in form: ", this.productIdValue);
    // this.itemOnChange(this.groupDetailsForm.getRawValue().itemId);
    this.getItemByProductId(this.productIdValue);
  }
  openAutoProduct() {
    this.productCtrl.setValue(''); // Clear the input field value

    // Open the autocomplete dropdown by triggering the value change event
    this.productCtrl.updateValueAndValidity();
  }


  set_store_Null(employeeId: any) {
    // alert("employeeId in null fun:"+employeeId)

    this.groupMasterForm.controls['deststoreId'].setValue(null);
    // console.log("deststoreId in null fun:",this.dest)

    // this.groupMasterForm.controls['employeeId'].setValue('');
    this.isReadOnlyEmployee = true;
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

    this.getAvgPrice(
      this.getMasterRowStoreId,
      this.getMasterRowFiscalYearId,
      formatDate(this.getMasterRowDate, 'yyyy-MM-dd', this.locale),
      itemEvent)

  }

  set_Percentage(state: any) {
    console.log('state value changed: ', state.value);
    if (state.value == "مستعمل") {
      this.isReadOnlyPercentage = false;
      this.groupDetailsForm.controls['state'].setValue(state.value);
    } else {
      this.isReadOnlyPercentage = true;
      this.groupDetailsForm.controls['state'].setValue(state.value);
      this.groupDetailsForm.controls['percentage'].setValue(100);
    }
  }

  storeValueChanges(storeId: any) {
    console.log('store: ', storeId);
    this.storeSelectedId = storeId;
    this.groupMasterForm.controls['storeId'].setValue(this.storeSelectedId);
    this.isEdit = false;
    console.log('kkkkkkkkkkk:', this.isEdit);

    // this.getStrWithdrawAutoNo();
  }


  getAvgPrice(storeId: any, fiscalYear: any, date: any, itemId: any) {
    console.log("Avg get inputs: ", "storeId: ", this.getMasterRowStoreId,
      " fiscalYear: ", this.getMasterRowFiscalYearId,
      " date: ", formatDate(this.getMasterRowDate, 'yyyy-MM-dd', this.locale),
      " itemId: ", this.groupDetailsForm.getRawValue().itemId)

    this.api.getAvgPrice(storeId, fiscalYear, date, itemId)

      .subscribe({
        next: (res) => {
          // this.priceCalled = res;
          this.groupDetailsForm.controls['price'].setValue(res);
          console.log("price avg called res: ", this.groupDetailsForm.getRawValue().price);
        },
        error: (err) => {
          // console.log("fetch fiscalYears data err: ", err);
          // alert("خطا اثناء جلب متوسط السعر !");
        }
      })
  }

  closeDialog() {
    // let result = window.confirm('هل تريد اغلاق الطلب');
    // if (result) {

    this.dialogRef.close('Save');
    // }
  }



  getAllDetailsForms() {
    // let result = window.confirm('هل تريد اغلاق الطلب');
    // if (result) {

      this.dialogRef.close('Save');
      console.log("master Id: ", this.getMasterRowId.id)

      if (this.getMasterRowId.id) {

        this.api.getStrWithdrawDetailsByMasterId(this.getMasterRowId.id)
          .subscribe({
            
            next: (res) => {
              // this.itemsList = res;
              this.matchedIds = res[0].strWithdrawDetailsGetVM;

              if (this.matchedIds) {
                console.log("eeeeeeeeeeeeeeeeeeeeeeeeeeee: ", res[0].strWithdrawDetailsGetVM);
                this.dataSource = new MatTableDataSource(this.matchedIds);
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;

                this.sumOfTotals = 0;
                for (let i = 0; i < this.matchedIds.length; i++) {
                  this.sumOfTotals = this.sumOfTotals + parseFloat(this.matchedIds[i].total);
                  this.groupMasterForm.controls['total'].setValue(this.sumOfTotals);

                }
              }
            },
            error: (err) => {

            }
          })
      }
      // }
    


  }

  closeDetailsDialog() {
    this.dialogRef.close('save');
  }

  async addDetailsInfo() {
    // console.log("check id for insert: ", this.getDetailedRowData, "edit data form: ", this.editData, "main id: ", this.getMasterRowId.id);
    console.log('masterrow', this.getMasterRowId);
    if (!this.editData) {
      if (this.getMasterRowId) {
        // console.log("form  headerId: ", this.getMasterRowId.id)

        if (this.groupDetailsForm.getRawValue().itemId) {
          this.itemName = await this.getItemByID(
            this.groupDetailsForm.getRawValue().itemId
          );
          this.groupDetailsForm.controls['itemName'].setValue(this.itemName);
          this.groupDetailsForm.controls['transactionUserId'].setValue(1);
          // alert("itemId")
        }

        this.groupDetailsForm.controls['stR_WithdrawId'].setValue(
          parseInt(this.getMasterRowId)
        );
        // alert()
        this.groupDetailsForm.controls['total'].setValue(
          parseFloat(this.groupDetailsForm.getRawValue().price) *
          parseFloat(this.groupDetailsForm.getRawValue().qty)
        );

        this.groupDetailsForm.removeControl('id')

        console.log("form details after item: ", this.groupDetailsForm.value)

        if (this.groupDetailsForm.valid) {
          console.log(
            'form details after item: ',
            this.groupDetailsForm.value
          );

          this.api
            .postStrWithdrawDetails(this.groupDetailsForm.value)
            .subscribe({
              next: (res) => {
                this.toastrSuccess();
                this.groupDetailsForm.reset();
                this.updateDetailsForm();
                // this.getAllDetailsForms();
                this.itemCtrl.setValue('');
                this.itemByFullCodeValue = '';
                this.fullCodeValue = '';
              },
              error: (err) => {
                // alert("حدث خطأ أثناء إضافة مجموعة")
                console.log("post err: ", err)

              },
            });
        }
        //  else {
        //   this.updateBothForms();
        // }
      }
    } else {
      this.updateDetailsForm();
    }
  }
  // async updateDetailsForm() {


  //   // console.log("values master form: ", this.groupMasterForm.value)
  //   console.log("values getMasterRowId: ", this.getMasterRowId)
  //   console.log("values details form: ", this.groupDetailsForm.value)

  //   // if (this.editData) {
  //   //   this.groupMasterForm.addControl('id', new FormControl('', Validators.required));
  //   //   this.groupMasterForm.controls['id'].setValue(this.editData.id);
  //   //   console.log("data item Name in edit: ", this.groupMasterForm.value)
  //   // }
  //   if (this.editData) {
  //     this.groupDetailsForm.addControl('id', new FormControl('', Validators.required));
  //     this.groupDetailsForm.controls['id'].setValue(this.editData.id);
  //     // this.groupDetailsForm.controls['state'].setValue(this.editData.id);
  //     this.groupDetailsForm.controls['avgPrice'].setValue(this.editData.avgPrice);
  //     console.log("details foorm: ", this.groupDetailsForm.value)

  //   }


  //   // this.groupMasterForm.addControl('id', new FormControl('', Validators.required));
  //   // this.groupMasterForm.controls['id'].setValue(this.getMasterRowId.id);
  //   // this.groupMasterForm.controls['addId'].setValue(this.getMasterRowId.id);
  //   // console.log("data item Name in edit without id: ", this.groupMasterForm.value)
  //   this.isEdit = false;

  //   // console.log("details before put foorm: ", this.groupDetailsForm.value)

  //   // this.api.putStrAdd(this.groupMasterForm.value)
  //   //   .subscribe({
  //   //     next: (res) => {
  //   //       // alert("تم الحفظ بنجاح");

  //   this.groupDetailsForm.controls['addId'].setValue(this.getMasterRowId);
  //   this.groupDetailsForm.controls['transactionUserId'].setValue(this.userIdFromStorage);
  //   this.groupDetailsForm.controls['total'].setValue((parseFloat(this.groupDetailsForm.getRawValue().price) * parseFloat(this.groupDetailsForm.getRawValue().qty)));

  //   console.log("details form values: ", this.groupDetailsForm.value, "details id: ", this.getDetailedRowData);
  //   if (this.groupDetailsForm.value && this.editData) {
  //     this.api.putStrWithdrawDetails(this.groupDetailsForm.value)
  //       .subscribe({
  //         next: (res) => {
  //           // alert("تم الحفظ بنجاح");
  //           this.toastrEditSuccess();
  //           // console.log("update res: ", res);
  //           this.groupDetailsForm.reset();
  //           this.groupDetailsForm.controls['state'].setValue("جديد");
  //           this.itemByFullCodeValue = '';
  //           this.fullCodeValue = '';
  //           // this.getAllDetailsForms();
  //           // this.getDetailedRowData = '';
  //           this.dialogRef.close('Update');
  //         },
  //         error: (err) => {
  //           // console.log("update err: ", err)
  //           // alert("خطأ أثناء تحديث سجل المجموعة !!")
  //         }
  //       })
  //   }

  // }
  async updateDetailsForm() {
    console.log(
      'store id in update:',
      this.getMasterRowStoreId
    );

    console.log("values getMasterRowId: ", this.getMasterRowId)
    // console.log("values details form: ", this.groupDetailsForm.value)

    // if (this.editData) {
    this.groupDetailsForm.addControl(
      'id',
      new FormControl('', Validators.required)
    );
    if (this.editData) {
      this.groupDetailsForm.controls['id'].setValue(this.editData.id);
      console.log('data item Name in edit: ', this.groupDetailsForm.value);
      // }
      this.groupDetailsForm.controls['price'].setValue(this.editData.price);
    }

    // if (this.getDetailedRowData) {
    console.log('details foorm: ', this.groupDetailsForm.value);

    this.isEdit = false;

    // this.api.putStrWithdraw(this.groupMasterForm.value).subscribe({
    //   next: (res) => {
    if (this.groupDetailsForm.valid) {
      this.api
        .putStrWithdrawDetails(this.groupDetailsForm.value)
        .subscribe({
          next: (res) => {
            this.groupDetailsForm.reset();
            this.getAllDetailsForms();
            this.itemCtrl.setValue('');
            this.itemByFullCodeValue = '';
            this.fullCodeValue = '';
            this.getDetailedRowData = '';
            // alert('تم التعديل بنجاح');
            this.toastrEditSuccess();

            this.dialogRef.close('Update');
          },
          error: (err) => {
            console.log("update err: ", err)
            // alert("خطأ أثناء تحديث سجل المجموعة !!")
          },
        });
    }

  }

  updateBothForms() {
    if (this.isEdit == false) {
      this.groupMasterForm.controls['no'].setValue(this.autoNo);
    }
    console.log("pass id: ", this.getMasterRowId.id, "pass No: ", this.groupMasterForm.getRawValue().no, "pass StoreId: ", this.groupMasterForm.getRawValue().storeId, "pass Date: ", this.groupMasterForm.getRawValue().date)
    if (
      this.groupMasterForm.getRawValue().no != '' &&
      this.groupMasterForm.getRawValue().employeeId != '' &&
      this.groupMasterForm.getRawValue().deststoreId != '' &&
      this.groupMasterForm.getRawValue().costCenterId != '' &&
      this.groupMasterForm.getRawValue().storeId != '' &&
      this.groupMasterForm.getRawValue().fiscalYearId != '' &&
      this.groupMasterForm.getRawValue().date != ''
    ) {
      this.groupDetailsForm.controls['stR_WithdrawId'].setValue(
        this.getMasterRowId.id
      );
      this.groupDetailsForm.controls['total'].setValue(
        parseFloat(this.groupDetailsForm.getRawValue().price) *
        parseFloat(this.groupDetailsForm.getRawValue().qty)
      );

      this.updateDetailsForm();
    }
    // else {
    //   alert("تاكد من ادخال البيانات صحيحة")
    // }
  }

  editDetailsForm(row: any) {
    this.goToPart();
    if (this.editDataDetails || row) {
      this.getDetailedRowData = row;
      console.log('dETAILS ROW: ', this.getDetailedRowData);

      this.actionBtnDetails = 'Update';
      this.groupDetailsForm.controls['stR_WithdrawId'].setValue(
        this.getDetailedRowData.stR_WithdrawId
      );

      this.groupDetailsForm.controls['qty'].setValue(
        this.getDetailedRowData.qty
      );
      this.groupDetailsForm.controls['price'].setValue(
        this.getDetailedRowData.price
      );
      this.groupDetailsForm.controls['percentage'].setValue(
        this.getDetailedRowData.percentage
      );

      // this.groupDetailsForm.controls['avgPrice'].setValue(this.getDetailedRowData.avgPrice);

      this.groupDetailsForm.controls['total'].setValue(
        parseFloat(this.groupDetailsForm.getRawValue().price) *
        parseFloat(this.groupDetailsForm.getRawValue().qty)
      );

      // console.log("itemid focus: ", this.matchedIds);

      this.groupDetailsForm.controls['itemId'].setValue(
        this.getDetailedRowData.itemId
      );
      this.groupDetailsForm.controls['itemName'].setValue(
        this.getDetailedRowData.itemName
      );

      this.groupDetailsForm.controls['stateName'].setValue(
        this.getDetailedRowData.stateName
      );
      // this.groupDetailsForm.controls['notesName'].setValue(this.getDetailedRowData.notes);
      // this.groupDetailsForm.controls['withDrawNoName'].setValue(this.getDetailedRowData.withDrawNoName);
    }
  }

  deleteFormDetails(id: number) {
    var result = confirm('هل ترغب بتاكيد الحذف ؟');
    if (result) {
      this.api.deleteStrWithdrawDetails(id).subscribe({
        next: (res) => {
          // alert('تم الحذف بنجاح');
          this.toastrDeleteSuccess();
          this.getAllDetailsForms();
          // this.getAllMasterForms();
        },
        error: () => {
          // alert("خطأ أثناء حذف التفاصيل !!");
        },
      });
    }
  }

  getAllMasterForms() {
    // let result = window.confirm('هل تريد اغلاق الطلب');
    // if (result) {
      //   if(this.actionBtnMaster=='save'){
      //     this.dialogRef.close('save');
      // }
      // else{
      //   this.dialogRef.close('update');

      // }
      // this.closeDialog();
      this.dialogRef.close('Save');
      this.api.getStrWithdraw().subscribe({
        next: (res) => {
          // this.groupDetailsForm.controls['itemName'].setValue(this.itemName);
          this.dataSource = new MatTableDataSource(res);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        },
        error: () => {
          // alert("خطأ أثناء جلب سجلات المجموعة !!");
        },
      });
    // }
  }

  async getStores() {
    this.userRoles = localStorage.getItem('userRoles');
    console.log('userRoles: ', this.userRoles.includes(this.userRoleStoresAcc));

    if (this.userRoles.includes(this.userRoleStoresAcc)) {
      // console.log('user is manager -all stores available- , role: ', userRoles);

      this.api.getStore().subscribe({
        next: async (res) => {
          this.storeList = res;
          this.defaultStoreSelectValue = await res[Object.keys(res)[0]];
          console.log(
            'selected storebbbbbbbbbbbbbbbbbbbbbbbb: ',
            this.defaultStoreSelectValue
          );
          if (this.editData) {
            this.groupMasterForm.controls['storeId'].setValue(
              this.editData.storeId
            );
          } else {
            this.groupMasterForm.controls['storeId'].setValue(
              this.defaultStoreSelectValue.id
            );
            console.log(
              'selected storebb form: ',
              this.groupMasterForm.getRawValue().storeId
            );
            this.storeValueChanges(this.groupMasterForm.getRawValue().storeId);
          }
        },
        error: (err) => {
          // console.log("fetch store data err: ", err);
          // alert("خطا اثناء جلب المخازن !");
        },
      });
    } else {
      this.api
        .getUserStores(localStorage.getItem('transactionUserId'))
        .subscribe({
          next: async (res) => {
            this.storeList = res;
            this.defaultStoreSelectValue = await res[Object.keys(res)[0]];
            console.log(
              'selected storebbbbbbbbbbbbbbb user: ',
              this.defaultStoreSelectValue
            );
            if (this.editData) {
              console.log('selected edit data : ', this.editData);
              this.groupMasterForm.controls['storeId'].setValue(
                this.editData.storeId
              );
            } else {
              console.log(
                'selected new data : ',
                this.defaultStoreSelectValue.storeId
              );
              this.groupMasterForm.controls['storeId'].setValue(
                this.defaultStoreSelectValue.storeId
              );
            }
          },
          error: (err) => {
            // console.log("fetch store data err: ", err);
            // alert("خطا اثناء جلب المخازن !");
          },
        });
    }
  }

  resetControls() {
    this.groupDetailsForm.reset();
    this.fullCodeValue = '';
    this.itemByFullCodeValue = '';
    this.itemCtrl.setValue('');
    this.groupDetailsForm.controls['qty'].setValue(1);
    this.groupDetailsForm.controls['percentage'].setValue(100);
  }
  getDestStores() {
    this.api.getStore().subscribe({
      next: (res) => {
        this.deststoresList = res;
        console.log(
          'deststore list in get deststorelist: ',
          this.deststoresList
        );
      },
      error: (err) => {
        // console.log("fetch store data err: ", err);
        // alert("خطا اثناء جلب المخازن !");
      },
    });
  }

  getDestStoreById(id: any) {
    console.log('row deststore id: ', id);
    return fetch(this.api.getStoreById(id))
      .then((response) => response.json())
      .then((json) => {
        console.log('fetch deststore by id res: ', json.name);
        return json.name;
      })
      .catch((err) => {
        // console.log("error in fetch name by id: ", err);
        // alert("خطا اثناء جلب رقم المخزن !");
      });
  }

  goToPart(): void {
    this.router.navigate(['/formedit']);
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

            this.api.getAvgPrice(
              this.getMasterRowStoreId,
              this.getMasterRowFiscalYearId,
              formatDate(this.getMasterRowDate, 'yyyy-MM-dd', this.locale),
              this.groupDetailsForm.getRawValue().itemId
            )
              .subscribe({
                next: (res) => {
                  // this.priceCalled = res;
                  // this.groupDetailsForm.controls['avgPrice'].setValue(res);
                  this.groupDetailsForm.controls['price'].setValue(res)
                  console.log("price avg called res: ", this.groupDetailsForm.getRawValue().price);
                },
                error: (err) => {
                  // console.log("fetch fiscalYears data err: ", err);
                  // alert("خطا اثناء جلب متوسط السعر !");
                }
              })

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

  getItemByProductCode(code: any) {
    if (code.keyCode == 13) {
      this.productsList.filter((a: any) => {
        console.log("enter product code case, ", "a.code: ", a.code, " code target: ", code.target.value);
        if (a.code == code.target.value) {
          console.log("enter product code case condition: ", a.code === code.target.value);

          this.groupDetailsForm.controls['itemId'].setValue(a.itemId);
          // this.groupDetailsForm.controls['productId'].setValue(a.id);
          this.productIdValue = a.name;
          this.productCtrl.setValue(a.name);

          // console.log("itemsList: ", this.itemsList.find((item: { id: any; }) => item.id == this.groupDetailsForm.getRawValue().itemId)?.fullCode);
          this.fullCodeValue = this.itemsList.find((item: { id: any; }) => item.id == this.groupDetailsForm.getRawValue().itemId)?.fullCode;
          // alert("fullCode: " + this.fullCodeValue);
          this.groupDetailsForm.controls['fullCode'].setValue(this.fullCodeValue);

          this.itemCtrl.setValue(a.itemName);
          if (a.itemName) {
            this.itemByFullCodeValue = a.name;

            this.api.getAvgPrice(
              this.getMasterRowStoreId,
              this.getMasterRowFiscalYearId,
              formatDate(this.getMasterRowDate, 'yyyy-MM-dd', this.locale),
              this.groupDetailsForm.getRawValue().itemId
            )
              .subscribe({
                next: (res) => {
                  // this.priceCalled = res;
                  // this.groupDetailsForm.controls['avgPrice'].setValue(res);
                  this.groupDetailsForm.controls['price'].setValue(res)
                  console.log("price avg called res: ", this.groupDetailsForm.getRawValue().price);
                },
                error: (err) => {
                  // console.log("fetch fiscalYears data err: ", err);
                  // alert("خطا اثناء جلب متوسط السعر !");
                }
              })

          }
          else {
            this.itemByFullCodeValue = '-';
          }
          this.itemByFullCodeValue = a.name;
          // this.itemOnChange(this.groupDetailsForm.getRawValue().itemId);

        }
        else {
          this.productIdValue = '';
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

  toastrSuccess(): void {
    this.toastr.success('تم الحفظ بنجاح');
  }
  toastrDeleteSuccess(): void {
    this.toastr.success('تم الحذف بنجاح');
  }
  toastrEditSuccess(): void {
    this.toastr.success('تم التعديل بنجاح');
  }

  getProducts() {
    this.api.getStrProduct().subscribe({
      next: (res) => {
        this.productsList = res;
        console.log("productsList res: ", this.productsList);
      },
      error: (err) => {
        // console.log("fetch products data err: ", err);
        // alert("خطا اثناء جلب المنتجات !");
      },
    });
  }

  getItemSearchWay(searchWayEvent: any) {
    console.log("searchWayEvent: ", searchWayEvent.source.value);
    this.itemSearchWay = searchWayEvent.source.value;

    if (this.itemSearchWay == 'searchByItemCode') {
      this.activeItemSearchWay = false;
    }
    else {
      this.activeItemSearchWay = true;
    }

  }

  getItemByProductId(productEvent: any) {
    console.log("productEvent: ", productEvent);

    this.productsList.filter((a: any) => {
      if (a.id === productEvent) {
        this.groupDetailsForm.controls['itemId'].setValue(a.itemId);
        // this.groupDetailsForm.controls['fullCode'].setValue(a.code);
        this.fullCodeValue = this.itemsList.find((item: { id: any; }) => item.id == this.groupDetailsForm.getRawValue().itemId)?.fullCode;
        this.groupDetailsForm.controls['fullCode'].setValue(this.fullCodeValue);

        console.log("item by code: ", a.itemName);
        this.itemCtrl.setValue(a.itemName);
        if (a.itemName) {
          this.itemByFullCodeValue = a.itemName;

          this.api.getAvgPrice(
            this.getMasterRowStoreId,
            this.getMasterRowFiscalYearId,
            formatDate(this.getMasterRowDate, 'yyyy-MM-dd', this.locale),
            this.groupDetailsForm.getRawValue().itemId
          )
            .subscribe({
              next: (res) => {
                this.groupDetailsForm.controls['price'].setValue(res)
                console.log("price avg called res: ", this.groupDetailsForm.getRawValue().price);
              },
              error: (err) => {
                // console.log("fetch fiscalYears data err: ", err);
                // alert("خطا اثناء جلب متوسط السعر !");
              }
            })

        }
        else {
          this.itemByFullCodeValue = '-';
        }
        this.itemByFullCodeValue = a.itemName;
      }
    })
  }


}
