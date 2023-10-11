

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
  constructor(public id: number, public name: string) { }
}

@Component({
  selector: 'app-str-stock-taking-details-dialog',
  templateUrl: './str-stock-taking-details-dialog.component.html',
  styleUrls: ['./str-stock-taking-details-dialog.component.css']
})
export class StrStockTakingDetailsDialogComponent {
  groupDetailsForm !: FormGroup;
  groupMasterForm !: FormGroup;
  actionBtnMaster: string = "Save";
  actionBtnDetails: string = "Save";
  MasterGroupInfoEntered = false;
  dataSource!: MatTableDataSource<any>;
  dataSource2!: MatTableDataSource<any>;

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

  itemsList: Item[] = [];
  itemCtrl: FormControl;
  filteredItem: Observable<Item[]>;
  selectedItem: Item | undefined;
  formcontrol = new FormControl('');

  displayedColumns: string[] = ['itemName', 'percentage', 'price', 'qty', 'systemQty', 'balance', 'total', 'action'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private formBuilder: FormBuilder,
    private api: ApiService,
    @Inject(LOCALE_ID) private locale: string,
    @Inject(MAT_DIALOG_DATA) public editData: any,
    @Inject(MAT_DIALOG_DATA) public editDataDetails: any,
    private http: HttpClient,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<StrStockTakingDetailsDialogComponent>,
    private toastr: ToastrService,
    private route: ActivatedRoute) {

    // this.currentData = new Date;

    this.itemCtrl = new FormControl();
    this.filteredItem = this.itemCtrl.valueChanges.pipe(
      startWith(''),
      map(value => this._filterItems(value))
    );

  }

  ngOnInit(): void {
    this.getItems();

    console.log("get params: ", this.route.snapshot.queryParamMap.get('date'));
    this.getMasterRowId = this.route.snapshot.queryParamMap.get('masterId');


    this.groupMasterForm = this.formBuilder.group({
      no: ['', Validators.required],
      storeId: ['', Validators.required],
      storeName: ['', Validators.required],

      transactionUserId: [1, Validators.required],
      total: ['', Validators.required],
      fiscalYearId: ['', Validators.required],
      systemQty: ['', Validators.required],
      balance: ['', Validators.required],
    });


    this.groupDetailsForm = this.formBuilder.group({
      strStockTakingId: ['', Validators.required], //MasterId
      systemQty: ['', Validators.required],
      balance: ['', Validators.required],
      qty: ['1', Validators.required],
      price: ['', Validators.required],
      total: ['', Validators.required],
      // state: ['', Validators.required],
      percentage: ['', Validators.required],
      transactionUserId: ['', Validators.required],
      itemId: ['', Validators.required],
      itemName: ['', Validators.required],
    });


    console.log("get params: ", this.route.snapshot.queryParamMap.get('date'));
    this.getMasterRowStoreId = this.route.snapshot.queryParamMap.get('StoreId');

    this.getMasterRowId = this.route.snapshot.queryParamMap.get('masterId');
    this.getMasterRowFiscalYearId = this.route.snapshot.queryParamMap.get('fiscalYear');
    this.getMasterRowDate = this.route.snapshot.queryParamMap.get('date');
    console.log("get params after: ", "masterId: ", this.getMasterRowId, "storeId: ", this.getMasterRowStoreId, "fisclaYear: ", this.getMasterRowFiscalYearId, "date: ", this.getMasterRowDate);

    console.log("nnnnnnnnnnnnnnnnnnn edit d before 1: ", this.editData);

    if (this.editData) {
      this.isEdit = true;
      console.log("nnnnnnnnnnnnnnnnnnn edit d before: ", this.editData);

      this.actionBtnMaster = "Update";
      this.groupDetailsForm.controls['strStockTakingId'].setValue(this.editData.strStockTakingId);
      this.groupDetailsForm.controls['transactionUserId'].setValue(this.editData.transactionUserId);

      this.groupDetailsForm.controls['qty'].setValue(this.editData.qty);
      this.groupDetailsForm.controls['price'].setValue(this.editData.price);
      this.groupDetailsForm.controls['systemQty'].setValue(this.editData.systemQty);
      this.groupDetailsForm.controls['balance'].setValue(this.editData.balance);
      // this.groupDetailsForm.controls['state'].setValue(this.editData.state);
      this.groupDetailsForm.controls['percentage'].setValue(this.editData.percentage);
      // this.groupDetailsForm.controls['date'].setValue(this.editData.date);
      // this.groupDetailsForm.controls['total'].setValue(this.editData.total);
      // this.toggleEdit();
      this.groupDetailsForm.controls['total'].setValue(this.editData.total);

      this.groupDetailsForm.controls['itemId'].setValue(this.editData.itemId);
      // this.itemOnChange(this.groupDetailsForm.getRawValue().itemId);
      // this.getItemByCode(this.groupDetailsForm.getRawValue().itemId);
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
      item.name.toLowerCase().includes(filterValue)
    );
  }
  displayItemName(item: any): string {
    return item && item.name ? item.name : '';
  }
  ItemSelected(event: MatAutocompleteSelectedEvent): void {
    const item = event.option.value as Item;
    console.log("item selected: ", item);
    this.selectedItem = item;
    this.groupDetailsForm.patchValue({ itemId: item.id });
    console.log("item in form: ", this.groupDetailsForm.getRawValue().itemId);
    // this.itemOnChange(this.groupDetailsForm.getRawValue().itemId);
    this.getCodeByItem(this.groupDetailsForm.getRawValue().itemId);

    this.api.getSumQuantity(
      this.getMasterRowStoreId,
      this.groupDetailsForm.getRawValue().itemId,
    )

      .subscribe({
        next: (res) => {
          // this.priceCalled = res;
          console.log("systemqty res:", res)
          this.groupDetailsForm.controls['systemQty'].setValue(res);
          console.log("balanceQty called res: ", this.groupDetailsForm.getRawValue().systemQty);
        },
        error: (err) => {
          console.log("fetch fiscalYears data err: ", err);
          alert("خطا اثناء جلب الكمية الحالية  !");
        }
      })


  }
  openAutoItem() {
    this.itemCtrl.setValue(''); // Clear the input field value

    // Open the autocomplete dropdown by triggering the value change event
    this.itemCtrl.updateValueAndValidity();
  }


  async addDetailsInfo() {
    this.groupDetailsForm.controls['strStockTakingId'].setValue(this.getMasterRowId);
    console.log("strStockTakingId:", this.getMasterRowId)

    this.groupDetailsForm.controls['balance'].setValue((parseFloat(this.groupDetailsForm.getRawValue().systemQty) - parseFloat(this.groupDetailsForm.getRawValue().qty)));

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

        this.groupDetailsForm.controls['strStockTakingId'].setValue(this.getMasterRowId);
        this.groupDetailsForm.controls['balance'].setValue((parseFloat(this.groupDetailsForm.getRawValue().systemQty) - parseFloat(this.groupDetailsForm.getRawValue().qty)));

        this.groupDetailsForm.controls['total'].setValue((parseFloat(this.groupDetailsForm.getRawValue().price) * parseFloat(this.groupDetailsForm.getRawValue().qty)));
        console.log("post d: ", this.groupDetailsForm.valid, "getDetailedRowData:", !this.getDetailedRowData);

        if (this.groupDetailsForm.valid ) {

          this.api.postStrStockTakingDetails(this.groupDetailsForm.value)
            .subscribe({
              next: (res) => {
                this.toastrSuccess();
                this.groupDetailsForm.reset();
                this.groupDetailsForm.controls['qty'].setValue(1);
                this.groupDetailsForm.controls['systemQty'].setValue(1);
                this.dialogRef.close('Update');
                // this.getAllDetailsForms();

                this.itemCtrl.setValue('');
                this.itemByFullCodeValue = '';
                this.fullCodeValue = '';
                // this.dialogRef.close('save');

                // this.updateDetailsForm()
                // this.getAllDetailsForms();
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
    this.api.getItems()
      .subscribe({
        next: (res) => {
          this.itemsList = res;
          console.log("itemlist", this.itemsList)
        },
        error: (err) => {
          // console.log("fetch items data err: ", err);
          // alert("خطا اثناء جلب العناصر !");
        }
      })
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
    // let result = window.confirm('هل تريد اغلاق الطلب');
    // if (result) {

      this.dialogRef.close('Save');
      console.log("master Id: ", this.getMasterRowId.id)

      if (this.getMasterRowId.id) {

        this.api.getStrStockTakingDetailsByMasterId(this.getMasterRowId.id)
          .subscribe({
            
            next: (res) => {
              // this.itemsList = res;
              this.matchedIds = res[0].strStockTakingDetailsGetVM;

              if (this.matchedIds) {
                console.log("eeeeeeeeeeeeeeeeeeeeeeeeeeee: ", res[0].strStockTakingDetailsGetVM);
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

            }
          })
      }
      // }
    


  }

  async updateDetailsForm() {
    // this.storeName = await this.getStoreByID(this.groupMasterForm.getRawValue().storeId);
    // this.groupMasterForm.controls['storeName'].setValue(this.storeName);

    // this.groupDetailsForm.controls['itemName'].setValue(this.itemName);

    // if (this.editData) {
    //   this.groupMasterForm.addControl('id', new FormControl('', Validators.required));
    //   this.groupMasterForm.controls['id'].setValue(this.editData.id);
    // }

    this.groupDetailsForm.addControl('id', new FormControl('', Validators.required));
    this.groupDetailsForm.controls['id'].setValue(this.editData.id);
    this.groupDetailsForm.controls['balance'].setValue((parseFloat(this.groupDetailsForm.getRawValue().systemQty) - parseFloat(this.groupDetailsForm.getRawValue().qty)));

    this.groupDetailsForm.controls['total'].setValue((parseFloat(this.groupDetailsForm.getRawValue().price) * parseFloat(this.groupDetailsForm.getRawValue().qty)));

    this.isEdit = false;
    console.log("edit : ", this.groupDetailsForm.value, "row: ", this.editData.id)
    // this.api.putStrOpen(this.groupMasterForm.value)
    // .subscribe({
    //   next: (res) => {
    if (this.groupDetailsForm.valid) {

      this.api.putStrStockTakingDetails(this.groupDetailsForm.value)
        .subscribe({
          next: (res) => {

            this.toastrSuccess();
            this.groupDetailsForm.reset();
            this.itemCtrl.setValue('');
            this.itemByFullCodeValue = '';
            this.fullCodeValue = '';

            // this.getAllDetailsForms();
            // this.getDetailedRowData = '';
            this.groupDetailsForm.controls['qty'].setValue(1);
            this.groupDetailsForm.controls['systemQty'].setValue(1);

            this.dialogRef.close('Save');

          },
          error: (err) => {
            console.log("update err: ", err)
            // alert("خطأ أثناء تحديث سجل المجموعة !!")
          }
        })
    }

    //   },

    // })
  }


  toastrSuccess(): void {
    this.toastr.success("تم الحفظ بنجاح");
  }
}