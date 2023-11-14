import { Component, OnInit, Inject, ViewChild, LOCALE_ID } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { formatDate } from '@angular/common';
import { Observable, map, startWith } from 'rxjs';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { ApiService } from '../../services/api.service';
import { ActivatedRoute, Router } from '@angular/router';

export class Item {
  constructor(public id: number, public name: string, public fullCode: string) { }
}

export class Product {
  constructor(public id: number, public name: string, public code: any) { }
}

@Component({
  selector: 'app-str-employee-opening-custody-detail-dailog',
  templateUrl: './str-employee-opening-custody-detail-dailog.component.html',
  styleUrls: ['./str-employee-opening-custody-detail-dailog.component.css']
})
export class StrEmployeeOpeningCustodyDetailDailogComponent {
  groupDetailsForm !: FormGroup;
  groupMasterForm !: FormGroup;
  actionBtnMaster: string = "Save";
  actionBtnDetails: string = "Save";
  MasterGroupInfoEntered = false;
  dataSource!: MatTableDataSource<any>;
  matchedIds: any;
  getDetailedRowData: any;
  sumOfTotals = 0;
  priceCalled = 0;
  getMasterRowId: any;
  getMasterRowStoreId: any;
  getMasterRowFiscalYearId: any;
  getMasterRowDate: any;
  storeList: any;
  // itemsList: any;
  fiscalYearsList: any;
  storeName: any;
  itemName: any;
  userIdFromStorage: any;
  deleteConfirmBtn: any;
  dialogRefDelete: any;
  isReadOnly: boolean = true;
  autoNo: any;
  storeSelectedId: any;
  fiscalYearSelectedId: any;
  defaultFiscalYearSelectValue: any;
  defaultStoreSelectValue: any;
  // userRoles: any;
  isEditDataReadOnly: boolean = true;

  isEdit: boolean = false;
  userRoles: any;
  currentData: any;
  fullCodeValue: any;
  itemByFullCodeValue: any;
  isReadOnlyPercentage: any = false;

  itemsList: Item[] = [];
  itemCtrl: FormControl;
  filteredItem: Observable<Item[]>;
  selectedItem: Item | undefined;
  formcontrol = new FormControl('');

  productsList: Product[] = [];
  productCtrl: FormControl;
  filteredProduct: Observable<Product[]>;
  selectedProduct: Product | undefined;

  productIdValue: any;

  displayedColumns: string[] = ['itemName', 'percentage', 'state', 'price', 'qty', 'total', 'action'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  stateDefaultValue: string;

  constructor(private formBuilder: FormBuilder,
    private api: ApiService,
    @Inject(LOCALE_ID) private locale: string,
    @Inject(MAT_DIALOG_DATA) public editData: any,
    @Inject(MAT_DIALOG_DATA) public editDataDetails: any,
    private http: HttpClient,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<StrEmployeeOpeningCustodyDetailDailogComponent>,
    private toastr: ToastrService,
    private route: ActivatedRoute) {

    // this.currentData = new Date;
    this.stateDefaultValue = 'جديد';
    ;

    this.itemCtrl = new FormControl();
    this.filteredItem = this.itemCtrl.valueChanges.pipe(
      startWith(''),
      map(value => this._filterItems(value))
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

    console.log("get params: ", this.route.snapshot.queryParamMap.get('date'));
    this.getMasterRowId = this.route.snapshot.queryParamMap.get('masterId');

    this.groupDetailsForm = this.formBuilder.group({
      custodyId: ['', Validators.required], //MasterId
      qty: ['1', Validators.required],
      price: ['', Validators.required],
      total: ['', Validators.required],
      state: [this.stateDefaultValue, Validators.required],
      percentage: ['', Validators.required],
      transactionUserId: ['', Validators.required],
      itemId: ['', Validators.required],
      itemName: ['', Validators.required],
      notes: [''],
      description: [''],
    });


    console.log("get params: ", this.route.snapshot.queryParamMap.get('date'));
    this.getMasterRowId = this.route.snapshot.queryParamMap.get('masterId');
    this.getMasterRowFiscalYearId = this.route.snapshot.queryParamMap.get('fiscalYear');
    this.getMasterRowDate = this.route.snapshot.queryParamMap.get('date');
    console.log("get params after: ", "masterId: ", this.getMasterRowId, "storeId: ", this.getMasterRowStoreId, "fisclaYear: ", this.getMasterRowFiscalYearId, "date: ", this.getMasterRowDate);

    console.log("nnnnnnnnnnnnnnnnnnn edit d before 1: ", this.editData);

    if (this.editData) {
      this.isEdit = true;
      console.log("nnnnnnnnnnnnnnnnnnn edit d before: ", this.editData);

      this.actionBtnDetails = "Update";
      this.groupDetailsForm.controls['custodyId'].setValue(this.editData.custodyId);
      this.groupDetailsForm.controls['transactionUserId'].setValue(this.editData.transactionUserId);

      this.groupDetailsForm.controls['qty'].setValue(this.editData.qty);
      this.groupDetailsForm.controls['price'].setValue(this.editData.price);
      this.groupDetailsForm.controls['state'].setValue(this.editData.state);
      this.groupDetailsForm.controls['percentage'].setValue(this.editData.percentage);

      this.groupDetailsForm.controls['total'].setValue(this.editData.total);

      this.groupDetailsForm.controls['itemId'].setValue(this.editData.itemId);

      this.groupDetailsForm.controls['notes'].setValue(this.editData.notes);
      this.groupDetailsForm.controls['description'].setValue(this.editData.description);


      console.log("nnnnnnnnnnnnnnnnnnn edit d after: ", this.editData);


      this.groupDetailsForm.addControl('id', new FormControl('', Validators.required));
      this.groupDetailsForm.controls['id'].setValue(this.editData.id);
      // this.isEditDataReadOnly = true;

      if (this.groupDetailsForm.getRawValue().price == 0 || this.editData?.price == 0) {
        this.isReadOnly = false;
        console.log("change readOnly to enable here");
      }
      else {
        this.isReadOnly = true;
        console.log("change readOnly to disable here");
      }

      // this.groupDetailsForm.controls['no'].setValue(this.editData.no);

    }

  }

  private _filterItems(value: string): Item[] {
    const filterValue = value;
    return this.itemsList.filter(item =>
      item.name ? item.name.toLowerCase().includes(filterValue) : '-'
    );
  }
  displayItemName(item: any): string {
    return item ? item.name && item.name != null ? item.name : '-' : '';
  }
  ItemSelected(event: MatAutocompleteSelectedEvent): void {
    const item = event.option.value as Item;
    console.log("item selected: ", item);
    this.selectedItem = item;
    this.groupDetailsForm.patchValue({ itemId: item.id });
    console.log("item in form: ", this.groupDetailsForm.getRawValue().itemId);
    // this.itemOnChange(this.groupDetailsForm.getRawValue().itemId);
    this.getCodeByItem(this.groupDetailsForm.getRawValue().itemId);
  }
  openAutoItem() {
    this.itemCtrl.setValue(''); // Clear the input field value

    // Open the autocomplete dropdown by triggering the value change event
    this.itemCtrl.updateValueAndValidity();
  }

  private _filterProducts(value: string): Product[] {
    const filterValue = value;
    console.log("filterValue222:", filterValue);

    return this.productsList.filter(
      (product) =>
        product.name || product.code ? product.name.toLowerCase().includes(filterValue) ||
        product.code.toString().toLowerCase().includes(filterValue): '-'
    );
  }
  displayProductName(product: any): string {
    return product ? product.name && product.name != null ? product.name : '-' : '';
  }
  ProductSelected(event: MatAutocompleteSelectedEvent): void {
    const product = event.option.value as Product;
    console.log("product selected: ", product);
    this.selectedProduct = product;
    this.productIdValue = product.id;

    console.log("product in form: ", this.productIdValue);
    this.getItemByProductId(this.productIdValue);
  }
  openAutoProduct() {
    this.productCtrl.setValue(''); // Clear the input field value

    // Open the autocomplete dropdown by triggering the value change event
    this.productCtrl.updateValueAndValidity();
  }


  async addDetailsInfo() {
    this.groupDetailsForm.controls['custodyId'].setValue(this.getMasterRowId);

    this.groupDetailsForm.controls['total'].setValue((parseFloat(this.groupDetailsForm.getRawValue().price) * parseFloat(this.groupDetailsForm.getRawValue().qty)));
    if (this.groupDetailsForm.getRawValue().itemId) {

      this.itemName = await this.getItemByID(this.groupDetailsForm.getRawValue().itemId);
      this.groupDetailsForm.controls['itemName'].setValue(this.itemName);

      this.groupDetailsForm.controls['transactionUserId'].setValue(localStorage.getItem('transactionUserId'));
    }

    console.log("nnnvvvvvvvvvv post d: ", this.groupDetailsForm.value);
    console.log("nnnvvvvvvvvvvhhhhhhhhhhh: ", this.isEdit);
    // if (this.isEdit == false) {
    //   this.groupMasterForm.controls['no'].setValue(this.autoNo);
    // }

    if (!this.editData) {
      console.log("enter fun: ");

      if (this.getMasterRowId) {
        console.log("enter fun with id: ", this.getMasterRowId);

        if (this.groupDetailsForm.getRawValue().itemId) {

          this.itemName = await this.getItemByID(this.groupDetailsForm.getRawValue().itemId);
          this.groupDetailsForm.controls['itemName'].setValue(this.itemName);

          this.groupDetailsForm.controls['transactionUserId'].setValue(localStorage.getItem('transactionUserId'));
        }

        this.groupDetailsForm.controls['custodyId'].setValue(this.getMasterRowId);
        this.groupDetailsForm.controls['total'].setValue((parseFloat(this.groupDetailsForm.getRawValue().price) * parseFloat(this.groupDetailsForm.getRawValue().qty)));
        console.log("post d: ", this.groupDetailsForm.value, "ooo:", !this.getDetailedRowData);

        if (this.groupDetailsForm.valid && !this.getDetailedRowData) {

          this.api.postStrEmployeeOpenDetails(this.groupDetailsForm.value)
            .subscribe({
              next: (res) => {
                this.toastrSuccess();
                this.groupDetailsForm.reset();
                this.groupDetailsForm.controls['qty'].setValue(1);
                this.groupDetailsForm.controls['state'].setValue('جديد');
                this.itemCtrl.setValue('');
                this.itemByFullCodeValue = '';
                this.fullCodeValue = '';

              },
              error: (err) => {
                // alert("حدث خطأ أثناء إضافة مجموعة")
                console.log("err posttttt: ", err)
              }
            })
        }

      }

    }
    else {
      console.log("update d: ", this.groupDetailsForm.valid, "ooo:", !this.getDetailedRowData);

      this.updateDetailsForm();
    }


  }

  getItems() {
    let itemArr: any[] = [];
    this.api.getItems()
      .subscribe({
        next: (res) => {
          res.forEach((element: any) => {
            if (element.type.includes('عهد')) {
              itemArr.push(element);
              // console.log("item list in loop check type: ", itemArr);

            }
          });
          this.itemsList = itemArr;

        },
        error: (err) => {
          // console.log("fetch items data err: ", err);
          // alert("خطا اثناء جلب العناصر !");
        }
      })
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

  getItemByCode(code: any) {
    if (code.keyCode == 13) {
      this.itemsList.filter((a: any) => {
        if (a.fullCode === code.target.value) {
          this.groupDetailsForm.controls['itemId'].setValue(a.id);
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


  getItemByProductId(productEvent: any) {
    console.log("productEvent: ", productEvent);

    this.productsList.filter((a: any) => {
      if (a.id === productEvent) {
        this.groupDetailsForm.controls['itemId'].setValue(a.itemId);

        this.fullCodeValue = this.itemsList.find((item: { id: any; }) => item.id == this.groupDetailsForm.getRawValue().itemId)?.fullCode;
        // alert("fullCode: " + this.fullCodeValue);

        console.log("item by code: ", a.itemName);
        this.itemCtrl.setValue(a.itemName);
        if (a.itemName) {
          this.itemByFullCodeValue = a.itemName;
        }
        else {
          this.itemByFullCodeValue = '-';
        }
        this.itemByFullCodeValue = a.itemName;
      }
    })
  }

  getItemByProductCode(code: any) {
    if (code.keyCode == 13) {
      this.productsList.filter((a: any) => {
        console.log("enter product code case, ", "a.code: ", a.code, " code target: ", code.target.value);
        if (a.code == code.target.value) {
          console.log("enter product code case condition: ", a.code === code.target.value);

          this.groupDetailsForm.controls['itemId'].setValue(a.itemId);
          this.productIdValue = a.name;
          this.productCtrl.setValue(a.name);

          this.fullCodeValue = this.itemsList.find((item: { id: any; }) => item.id == this.groupDetailsForm.getRawValue().itemId)?.fullCode;
          // alert("fullCode: " + this.fullCodeValue);

          this.itemCtrl.setValue(a.itemName);
          if (a.itemName) {
            this.itemByFullCodeValue = a.itemName;
          }
          else {
            this.itemByFullCodeValue = '-';
          }
          this.itemByFullCodeValue = a.itemName;

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
  set_Percentage(state: any) {

    console.log("state value changed: ", state.value);
    this.groupDetailsForm.controls['state'].setValue(state.value);

    if (this.groupDetailsForm.getRawValue().state == "مستعمل") {
      this.isReadOnlyPercentage = false;
    }
    else {
      this.isReadOnlyPercentage = true;
      this.groupDetailsForm.controls['percentage'].setValue(100);
    }

  }


  getAllDetailsForms() {
  
      this.dialogRef.close('Save');
      console.log("master Id: ", this.getMasterRowId.id)

      if (this.getMasterRowId.id) {

        this.api.getStrEmployeeOpenDetailsByMasterId(this.getMasterRowId.id)
          .subscribe({
            next: (res) => {
              // this.itemsList = res;
              this.matchedIds = res[1].strEmployeeOpeningCustodyDetailsGetVM;

              if (this.matchedIds) {
                console.log("eeeeeeeeeeeeeeeeeeeeeeeeeeee: ", res[1].strEmployeeOpeningCustodyDetailsGetVM);
                this.dataSource = new MatTableDataSource(this.matchedIds);
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;

                this.sumOfTotals = 0;
                for (let i = 0; i < this.matchedIds.length; i++) {
                  this.sumOfTotals = this.sumOfTotals + parseFloat(this.matchedIds[i].total);
                  this.sumOfTotals = Number(this.sumOfTotals.toFixed(2));
                  this.groupMasterForm.controls['total'].setValue(this.sumOfTotals);

                }
              }
            },
            error: (err) => {
              // console.log("fetch items data err: ", err);
              // alert("خطا اثناء جلب العناصر !");
            }
          })
      }
      // }
    // }


  }

  async updateDetailsForm() {

    this.groupDetailsForm.addControl('id', new FormControl('', Validators.required));
    this.groupDetailsForm.controls['id'].setValue(this.editData.id);
    this.groupDetailsForm.controls['total'].setValue((parseFloat(this.groupDetailsForm.getRawValue().price) * parseFloat(this.groupDetailsForm.getRawValue().qty)));

    this.isEdit = false;
    console.log("edit : ", this.groupDetailsForm.value, "row: ", this.editData.id)

    if (this.groupDetailsForm.valid) {

      this.api.putStrEmployeeOpenDetails(this.groupDetailsForm.value)
        .subscribe({
          next: (res) => {
            this.toastrSuccess();
            this.groupDetailsForm.reset();
            this.itemCtrl.setValue('');
            this.itemByFullCodeValue = '';
            this.fullCodeValue = '';


            this.groupDetailsForm.controls['qty'].setValue(1);
            this.groupDetailsForm.controls['state'].setValue('جديد');


            this.dialogRef.close('save');

          },
          error: (err) => {
            console.log("update err: ", err)
            // alert("خطأ أثناء تحديث سجل المجموعة !!")
          }
        })
    }

  }


  toastrSuccess(): void {
    this.toastr.success("تم الحفظ بنجاح");
  }
}

