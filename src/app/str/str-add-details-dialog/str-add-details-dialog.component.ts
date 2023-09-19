import { Component, OnInit, Inject, ViewChild, LOCALE_ID } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
// import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { formatDate } from '@angular/common';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { ApiService } from 'src/app/services/api.service';
import { ActivatedRoute, Router } from '@angular/router';


export class Item {
  constructor(public id: number, public name: string) { }
}


@Component({
  selector: 'app-str-add-details-dialog',
  templateUrl: './str-add-details-dialog.component.html',
  styleUrls: ['./str-add-details-dialog.component.css']
})
export class StrAddDetailsDialogComponent implements OnInit {
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
  storeList: any;
  itemsList: any;
  typeList: any;
  ReceiptList: any;
  sourceStoreList: any;
  employeeList: any;
  sellerList: any;
  fiscalYearsList: any;
  storeName: any;
  itemName: any;
  typeName: any;
  sellerName: any;
  receiptName: any;
  employeeName: any;
  userIdFromStorage: any;
  deleteConfirmBtn: any;
  dialogRefDelete: any;
  isReadOnly: any = false;
  isReadOnlyEmployee: any = false;
  isReadOnlyPercentage: any = false;
  autoNo: any;
  defaultFiscalYearSelectValue: any;
  storeSelectedId: any;
  fiscalYearSelectedId: any;
  defaultStoreSelectValue: any;
  userRoles: any;
  actionName: string = "choose";
  getMasterRowStoreId: any;
  getMasterRowFiscalYearId: any;
  getMasterRowDate: any;

  stateDefaultValue: any;


  itemCtrl: FormControl;
  filteredItem: Observable<Item[]>;
  items: Item[] = [];
  selectedItem: Item | undefined;

  getAddData: any;
  sourceSelected: any;
  isEdit: boolean = false;
  displayedColumns: string[] = ['itemName', 'state', 'price', 'qty', 'total', 'action'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  sourceStoreName: any;

  currentDate: any;
  itemByFullCodeValue: any;
  fullCodeValue: any;

  constructor(private formBuilder: FormBuilder,

    private api: ApiService,
    @Inject(MAT_DIALOG_DATA) public editData: any,
    @Inject(MAT_DIALOG_DATA) public editDataDetails: any,
    private http: HttpClient,
    private toastr: ToastrService,
    private dialog: MatDialog,
    @Inject(LOCALE_ID) private locale: string,
    private dialogRef: MatDialogRef<StrAddDetailsDialogComponent>,
    private router: Router,
    private route: ActivatedRoute) {

    this.currentDate = new Date;
    this.stateDefaultValue = true;


    this.itemCtrl = new FormControl();
    this.filteredItem = this.itemCtrl.valueChanges.pipe(
      startWith(''),
      map(value => this._filterItems(value))
    );
  }

  ngOnInit(): void {
    this.getItems();

    this.groupDetailsForm = this.formBuilder.group({
      addId: ['', Validators.required], //MasterId
      qty: ['1', Validators.required],
      price: ['', Validators.required],
      total: ['', Validators.required],
      transactionUserId: ['', Validators.required],
      itemId: ['', Validators.required],
      // productId: ['', Validators.required],
      itemName: ['', Validators.required],
      avgPrice: ['', Validators.required],
      balanceQty: ['', Validators.required],
      percentage: ['100', Validators.required],
      // storeId: ['', Validators.required],
      // date: ['', Validators.required],
      // fiscalYearId: ['', Validators.required],
      state: [this.stateDefaultValue, Validators.required],


    });

    this.api.getAllItems().subscribe((items) => {
      this.items = items;
    });


    console.log("get params: ", this.route.snapshot.queryParamMap.get('date'));
    this.getMasterRowId = this.route.snapshot.queryParamMap.get('masterId');
    this.getMasterRowStoreId = this.route.snapshot.queryParamMap.get('store');
    this.getMasterRowFiscalYearId = this.route.snapshot.queryParamMap.get('fiscalYear');
    this.getMasterRowDate = formatDate(this.route.snapshot.queryParamMap.get('date')!, 'yyyy-MM-dd', this.locale);

    console.log("get params after: ", "masterId: ", this.getMasterRowId, "storeId: ", this.getMasterRowStoreId, "fisclaYear: ", this.getMasterRowFiscalYearId, "date: ", this.getMasterRowDate);


    if (this.editData) {
      this.isEdit = true;
      this.getAddData = this.editData;

      // console.log("this.groupMasterForm.getRawValue().source: ", this.groupMasterForm.getRawValue().source);

      // this.getListCtrl(this.groupMasterForm.getRawValue().source);

      console.log("edit d form before: ", this.editData);
      this.actionBtnMaster = "Update";
      // console.log("edit d form before14: ", this.editData);

      // this.groupDetailsForm.controls['addData'].setValue(this.editData.addData);
      this.groupDetailsForm.controls['addId'].setValue(this.editData.addId);
      // console.log("edit d form before1: ", this.editData);

      // this.groupDetailsForm.controls['addNo'].setValue(this.editData.addNo);
      console.log("edit d form before2: ", this.editData);

      this.groupDetailsForm.controls['avgPrice'].setValue(this.editData.avgPrice);
      // console.log("edit d form before3: ", this.editData);

      this.groupDetailsForm.controls['balanceQty'].setValue(this.editData.balanceQty);
      // console.log("edit d form before4: ", this.editData);

      // this.groupDetailsForm.controls['fullCode'].setValue(this.editData.fullCode);
      // console.log("edit d form before5: ", this.editData);

      this.groupDetailsForm.controls['itemId'].setValue(this.editData.itemId);
      // console.log("edit d form before6: ", this.editData);


      this.groupDetailsForm.controls['percentage'].setValue(this.editData.percentage);
      // console.log("edit d form before7: ", this.editData);

      this.groupDetailsForm.controls['price'].setValue(this.editData.price);
      // console.log("edit d form before8: ", this.editData);

      this.groupDetailsForm.controls['qty'].setValue(this.editData.qty);
      // console.log("edit d form before9: ", this.editData);

      this.groupDetailsForm.controls['state'].setValue(this.editData.state);
      // console.log("edit d form before10: ", this.editData);

      this.groupDetailsForm.controls['total'].setValue(this.editData.total);
      // console.log("edit d form before11: ", this.editData);

      // this.groupDetailsForm.addControl('id', new FormControl('', Validators.required));
      // this.groupDetailsForm.controls['id'].setValue(this.editData.id);

      console.log("edit d form after: ", this.editData);

    }

    this.userIdFromStorage = localStorage.getItem('transactionUserId');
    console.log("userIdFromStorage in localStorage: ", this.userIdFromStorage)
    this.groupDetailsForm.controls['transactionUserId'].setValue(this.userIdFromStorage);
  }



  displayItemName(item: any): string {
    return item && item.name ? item.name : '';
  }

  itemSelected(event: MatAutocompleteSelectedEvent): void {
    const item = event.option.value as Item;
    this.selectedItem = item;
    this.groupDetailsForm.patchValue({ itemId: item.id });
    this.groupDetailsForm.patchValue({ itemName: item.name });

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
          this.groupDetailsForm.controls['avgPrice'].setValue(res);
          this.groupDetailsForm.controls['price'].setValue(res)
          console.log("price avg called res: ", this.groupDetailsForm.getRawValue().avgPrice);
        },
        error: (err) => {
          // console.log("fetch fiscalYears data err: ", err);
          // alert("خطا اثناء جلب متوسط السعر !");
        }
      })


    this.api.getSumQuantity(
      this.getMasterRowStoreId,
      this.groupDetailsForm.getRawValue().itemId,
    )
      .subscribe({
        next: (res) => {
          // this.priceCalled = res;
          this.groupDetailsForm.controls['balanceQty'].setValue(res);
          console.log("balanceQty called res: ", this.groupDetailsForm.getRawValue().balanceQty);
        },
        error: (err) => {
          // console.log("fetch fiscalYears data err: ", err);
          // alert("خطا اثناء جلب الرصيد الحالى  !");
        }
      })


  }

  private _filterItems(value: string): Item[] {
    const filterValue = value
    return this.items.filter(item =>
      item.name.toLowerCase().includes(filterValue)
    );
  }

  openAutoTem() {
    this.itemCtrl.setValue(''); // Clear the input field value

    // Open the autocomplete dropdown by triggering the value change event
    this.itemCtrl.updateValueAndValidity();
  }


  getItems() {
    this.api.getItems()
      .subscribe({
        next: (res) => {
          this.itemsList = res;
          // console.log("items res: ", this.itemsList);
        },
        error: (err) => {
          // console.log("fetch items data err: ", err);
          // alert("خطا اثناء جلب العناصر !");
        }
      })
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

            this.api.getAvgPrice(
              this.getMasterRowStoreId,
              this.getMasterRowFiscalYearId,
              formatDate(this.getMasterRowDate, 'yyyy-MM-dd', this.locale),
              this.groupDetailsForm.getRawValue().itemId
            )
              .subscribe({
                next: (res) => {
                  // this.priceCalled = res;
                  this.groupDetailsForm.controls['avgPrice'].setValue(res);
                  this.groupDetailsForm.controls['price'].setValue(res)
                  console.log("price avg called res: ", this.groupDetailsForm.getRawValue().avgPrice);
                },
                error: (err) => {
                  // console.log("fetch fiscalYears data err: ", err);
                  // alert("خطا اثناء جلب متوسط السعر !");
                }
              })


            this.api.getSumQuantity(
              this.getMasterRowStoreId,
              this.groupDetailsForm.getRawValue().itemId,
            )
              .subscribe({
                next: (res) => {
                  // this.priceCalled = res;
                  this.groupDetailsForm.controls['balanceQty'].setValue(res);
                  console.log("balanceQty called res: ", this.groupDetailsForm.getRawValue().balanceQty);
                },
                error: (err) => {
                  // console.log("fetch fiscalYears data err: ", err);
                  // alert("خطا اثناء جلب الرصيد الحالى  !");
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

    if (this.groupDetailsForm.getRawValue().state == false) {
      this.isReadOnlyPercentage = false;
    }
    else {
      this.isReadOnlyPercentage = true;
      this.groupDetailsForm.controls['percentage'].setValue(100);
    }

  }


  async addDetailsInfo() {
    // this.groupDetailsForm.removeControl('id')
    console.log("check id for insert: ", this.getDetailedRowData, "edit data form: ", this.editData, "main id: ", this.getMasterRowId);
    // if (this.isEdit == false) {
    //   this.groupMasterForm.controls['no'].setValue(this.autoNo);
    // }

    if (!this.editData) {
      if (this.getMasterRowId) {
        console.log("form  headerId: ", this.getMasterRowId)

        if (this.groupDetailsForm.getRawValue().itemId) {
          this.itemName = await this.getItemByID(this.groupDetailsForm.getRawValue().itemId);
          this.groupDetailsForm.controls['itemName'].setValue(this.itemName);
          // this.groupDetailsForm.controls['transactionUserId'].setValue(this.userIdFromStorage?.slice(1, length - 1));
          this.groupDetailsForm.controls['transactionUserId'].setValue(this.userIdFromStorage);
        }
        // this.groupMasterForm.controls['date'].setValue(this.editData.date);
        // this.groupMasterForm.controls['storeId'].setValue(this.editData.storeId);
        // this.groupMasterForm.controls['fiscalYearId'].setValue(this.editData.fiscalYearId);

        this.groupDetailsForm.controls['state'].setValue(this.groupDetailsForm.getRawValue().state);
        this.groupDetailsForm.controls['addId'].setValue(this.getMasterRowId);
        this.groupDetailsForm.controls['total'].setValue((parseFloat(this.groupDetailsForm.getRawValue().price) * parseFloat(this.groupDetailsForm.getRawValue().qty)));

        this.groupDetailsForm.addControl('date', new FormControl('', Validators.required));
        this.groupDetailsForm.controls['date'].setValue(this.getMasterRowDate);

        this.groupDetailsForm.addControl('storeId', new FormControl('', Validators.required));
        this.groupDetailsForm.controls['storeId'].setValue(this.getMasterRowStoreId);

        this.groupDetailsForm.addControl('fiscalYearId', new FormControl('', Validators.required));
        this.groupDetailsForm.controls['fiscalYearId'].setValue(this.getMasterRowFiscalYearId);



        console.log("form details after item: ", this.groupDetailsForm.value, "DetailedRowData: ", !this.getDetailedRowData)


        // this must be at sellerid only 
        this.api.getNewAvgPrice(
          this.getMasterRowStoreId,
          this.getMasterRowFiscalYearId,
          formatDate(this.getMasterRowDate, 'yyyy-MM-dd', this.locale),
          this.groupDetailsForm.getRawValue().itemId,
          this.groupDetailsForm.getRawValue().price,
          this.groupDetailsForm.getRawValue().qty
        )
          .subscribe({
            next: (res) => {
              // this.priceCalled = res;
              this.groupDetailsForm.controls['avgPrice'].setValue(res);
              console.log("price avg called res: ", this.groupDetailsForm.getRawValue().avgPrice);
            },
            error: (err) => {
              // console.log("fetch fiscalYears data err: ", err);
              // alert("خطا اثناء جلب متوسط السعر !");
            }
          })
        if (this.groupDetailsForm.valid && !this.getDetailedRowData) {

          this.api.postStrAddDetails(this.groupDetailsForm.value)
            .subscribe({
              next: (res) => {
                this.toastrSuccess();
                // alert("تمت إضافة المجموعة بنجاح");
                this.groupDetailsForm.reset();
                this.groupDetailsForm.controls['qty'].setValue(1);
                this.groupDetailsForm.controls['percentage'].setValue(100);
                this.groupDetailsForm.controls['state'].setValue(true);

                // this.updateDetailsForm();

                console.log("form details after remove controllers: ", this.groupDetailsForm.value)
                this.itemByFullCodeValue = '';
                this.fullCodeValue = '';

                this.dialogRef.close('save');
                // this.dialogRef.close('save');
              },
              error: (err) => {
                console.log("add details err: ", err)
                // alert("حدث خطأ أثناء إضافة تفاصيل")
              }
            })
        }
        // else {
        //   this.updateBothForms();
        // }

      }

    }
    else {
      this.updateDetailsForm();
    }


  }

  async updateDetailsForm() {
    // // alert("storeId: "+this.groupMasterForm.getRawValue().storeId)
    // this.storeName = await this.getStoreByID(this.groupMasterForm.getRawValue().storeId);
    // // alert("update Store name: " + this.storeName)
    // this.groupMasterForm.controls['storeName'].setValue(this.storeName);

    // this.sourceStoreName = await this.getSourceStoreByID(this.groupMasterForm.getRawValue().sourceStoreId);
    // // alert("update sourceStoreName name: " + this.sourceStoreName)
    // this.groupMasterForm.controls['sourceStoreName'].setValue(this.sourceStoreName);

    // this.employeeName = await this.getEmployeeByID(this.groupMasterForm.getRawValue().employeeId);
    // // alert("update employeeName name: " + this.employeeName)
    // this.groupMasterForm.controls['employeeName'].setValue(this.employeeName);

    // this.typeName = await this.getTypeByID(this.groupMasterForm.getRawValue().addTypeId);
    // // alert("update typeName name: " + this.typeName)
    // this.groupMasterForm.controls['typeName'].setValue(this.typeName);
    // // this.groupMasterForm.patchValue({typeName:this.typeName});

    // this.receiptName = await this.getReceiptByID(this.groupMasterForm.getRawValue().addReceiptId);
    // // alert("update receiptName name: " + this.receiptName)
    // this.groupMasterForm.controls['receiptName'].setValue(this.receiptName);

    // this.sellerName = await this.getSellerByID(this.groupMasterForm.getRawValue().sellerId);
    // // alert("update sellerName name: " + this.sellerName)
    // this.groupMasterForm.controls['sellerName'].setValue(this.sellerName);
    // // console.log("data storeName in edit: ", this.groupMasterForm.value)

    // this.groupDetailsForm.controls['itemName'].setValue(this.itemName);

    // console.log("values master form: ", this.groupMasterForm.value)
    console.log("values getMasterRowId: ", this.getMasterRowId)
    console.log("values details form: ", this.groupDetailsForm.value)

    // if (this.editData) {
    //   this.groupMasterForm.addControl('id', new FormControl('', Validators.required));
    //   this.groupMasterForm.controls['id'].setValue(this.editData.id);
    //   console.log("data item Name in edit: ", this.groupMasterForm.value)
    // }
    if (this.editData) {
      this.groupDetailsForm.addControl('id', new FormControl('', Validators.required));
      this.groupDetailsForm.controls['id'].setValue(this.editData.id);
      // this.groupDetailsForm.controls['state'].setValue(this.editData.id);
      this.groupDetailsForm.controls['avgPrice'].setValue(this.editData.avgPrice);
      console.log("details foorm: ", this.groupDetailsForm.value)

    }


    // this.groupMasterForm.addControl('id', new FormControl('', Validators.required));
    // this.groupMasterForm.controls['id'].setValue(this.getMasterRowId.id);
    // this.groupMasterForm.controls['addId'].setValue(this.getMasterRowId.id);
    // console.log("data item Name in edit without id: ", this.groupMasterForm.value)
    this.isEdit = false;

    // console.log("details before put foorm: ", this.groupDetailsForm.value)

    // this.api.putStrAdd(this.groupMasterForm.value)
    //   .subscribe({
    //     next: (res) => {
    //       // alert("تم الحفظ بنجاح");

    this.groupDetailsForm.controls['addId'].setValue(this.getMasterRowId);
    this.groupDetailsForm.controls['transactionUserId'].setValue(this.userIdFromStorage);
    this.groupDetailsForm.controls['total'].setValue((parseFloat(this.groupDetailsForm.getRawValue().price) * parseFloat(this.groupDetailsForm.getRawValue().qty)));

    console.log("details form values: ", this.groupDetailsForm.value, "details id: ", this.getDetailedRowData);
    if (this.groupDetailsForm.value && this.editData) {
      this.api.putStrAddDetails(this.groupDetailsForm.value)
        .subscribe({
          next: (res) => {
            // alert("تم الحفظ بنجاح");
            this.toastrEditSuccess();
            // console.log("update res: ", res);
            this.groupDetailsForm.reset();
            this.groupDetailsForm.controls['state'].setValue(true);
            this.itemByFullCodeValue = '';
            this.fullCodeValue = '';
            // this.getAllDetailsForms();
            // this.getDetailedRowData = '';
            this.dialogRef.close('save');
          },
          error: (err) => {
            // console.log("update err: ", err)
            // alert("خطأ أثناء تحديث سجل المجموعة !!")
          }
        })
    }

    //     // this.dialogRef.close('update');
    //   },
    //   // error: () => {
    //   //   alert("خطأ أثناء تحديث سجل الصنف !!")
    //   // }
    // })
  }

  getItemByID(id: any) {
    console.log("row item id: ", id);
    return fetch(`http://ims.aswan.gov.eg/api/STRItem/get/${id}`)
      .then(response => response.json())
      .then(json => {
        console.log("fetch item name by id res: ", json.name);
        return json.name;
      })
      .catch((err) => {
        console.log("error in fetch item name by id: ", err);
        // alert("خطا اثناء جلب رقم العنصر !");
      });
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
