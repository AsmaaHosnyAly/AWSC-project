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

export class Product {
  constructor(public id: number, public name: string, public code: any) { }
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
  fullCodeValue: any;

  formcontrol = new FormControl('');
  itemsList: Item[] = [];
  itemsCtrl: FormControl;
  filtereditems: Observable<Item[]>;
  selecteditems: Item | undefined;

  productsList: Product[] = [];
  productCtrl: FormControl;
  filteredProduct: Observable<Product[]>;
  selectedProduct: Product | undefined;

  productIdValue: any;

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

    this.productCtrl = new FormControl();
    this.filteredProduct = this.productCtrl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filterProducts(value))
    );

  }


  ngOnInit(): void {

    // console.log("get params: ", this.route.snapshot.queryParamMap.get('masterId'));
    this.getMasterRowId = this.route.snapshot.queryParamMap.get('masterId');
    // console.log("get params after: ", "masterId: ", this.getMasterRowId);

    this.getItems();
    this.getProducts();
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

      this.actionBtnDetails = 'Update';
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
    let itemArr: any[] = [];
    this.api.getItems()
      .subscribe({
        next: (res) => {
          res.forEach((element: any) => {
            if (element.type.includes('عهد')) {
              itemArr.push(element);
              console.log("item list in loop check type: ", itemArr);

            }
          });
          this.itemsList = itemArr;
          console.log("item list after check type: ", this.itemsList);
          // this.itemsList = res 

        },
        error: (err) => {
          // console.log("fetch items data err: ", err);
          // alert("خطا اثناء جلب العناصر !");
        }
      })
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
    this.productIdValue = product.id;

    console.log("product in form: ", this.productIdValue);
    this.getItemByProductId(this.productIdValue);
  }
  openAutoProduct() {
    this.productCtrl.setValue(''); // Clear the input field value

    // Open the autocomplete dropdown by triggering the value change event
    this.productCtrl.updateValueAndValidity();
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

          this.itemsCtrl.setValue(a.itemName);
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

  getItemByProductId(productEvent: any) {
    console.log("productEvent: ", productEvent);

    this.productsList.filter((a: any) => {
      if (a.id === productEvent) {
        this.groupDetailsForm.controls['itemId'].setValue(a.itemId);
        // this.groupDetailsForm.controls['fullCode'].setValue(a.code);
        // console.log("itemsList: ", this.itemsList.find((item: { id: any; }) => item.id == this.groupDetailsForm.getRawValue().itemId));
        this.fullCodeValue = this.itemsList.find((item: { id: any; }) => item.id == this.groupDetailsForm.getRawValue().itemId)?.fullCode;
        // alert("fullCode: " + this.fullCodeValue);

        console.log("item by code: ", a.itemName);
        this.itemsCtrl.setValue(a.itemName);
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


  closeDialog() {
    // let result = window.confirm('هل تريد اغلاق الطلب');
    // if (result) {

      this.dialogRef.close('Save');
    // }
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

  getAllDetailsForms() {


    this.dialogRef.close('Save');
    console.log("master Id: ", this.getMasterRowId.id)

    if (this.getMasterRowId.id) {

      this.api.getStrEmployeeExchangeDetailsByMasterId(this.getMasterRowId.id)
        .subscribe({
          next: (res) => {
            // this.itemsList = res;
            this.matchedIds = res[0].strEmployeeExchangeDetailsGetVM;

            if (this.matchedIds) {
              console.log("eeeeeeeeeeeeeeeeeeeeeeeeeeee: ", res[0].strEmployeeExchangeDetailsGetVM);
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

      // }
    }


  }

  async addDetailsInfo() {
    console.log("enter fun: ");

    if (!this.editData) {
      console.log("podt fun: ", this.getMasterRowId);

      if (this.getMasterRowId) {

        if (this.groupDetailsForm.getRawValue().itemId) {
          this.itemName = await this.getItemByID(this.groupDetailsForm.getRawValue().itemId);
          this.groupDetailsForm.controls['itemName'].setValue(this.itemName);

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
                this.itemsCtrl.setValue('');
                this.itemByFullCodeValue = '';
                this.fullCodeValue = '';
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


    this.groupDetailsForm.addControl('id', new FormControl('', Validators.required));
    this.groupDetailsForm.controls['id'].setValue(this.editData.id);

    if (this.groupDetailsForm.getRawValue().itemId) {
      this.itemName = await this.getItemByID(this.groupDetailsForm.getRawValue().itemId);
      this.groupDetailsForm.controls['itemName'].setValue(this.itemName);

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
          this.itemsCtrl.setValue('');
          this.itemByFullCodeValue = '';
          this.fullCodeValue = '';

          this.dialogRef.close('save');
        },
        error: (err) => {
          // console.log("update err: ", err)
          // alert("خطأ أثناء تحديث سجل المجموعة !!")
        }
      })
    this.groupDetailsForm.removeControl('id')

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



  toastrSuccess(): void {
    this.toastr.success("تم الحفظ بنجاح");
  }
  toastrEditSuccess(): void {
    this.toastr.success('تم التعديل بنجاح');
  }
}
