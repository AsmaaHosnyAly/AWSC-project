import { Component, OnInit, Inject, ViewChild, LOCALE_ID } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { formatDate } from '@angular/common';
import { Observable, map, startWith } from 'rxjs';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { StrOpeningStockDetailsDialogComponent } from '../str-opening-stock-details-dialog/str-opening-stock-details-dialog.component'; 
import { Router } from '@angular/router';
import { HotkeysService } from 'angular2-hotkeys';
import { Hotkey } from 'angular2-hotkeys';
import { PagesEnums } from 'src/app/core/enums/pages.enum';

// export class Item {
//   constructor(public id: number, public name: string) { }
// }

@Component({
  selector: 'app-str-opening-stock-dialog',
  templateUrl: './str-opening-stock-dialog.component.html',
  styleUrls: ['./str-opening-stock-dialog.component.css']
})
export class StrOpeningStockDialogComponent implements OnInit {
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

  userRoleStoresAcc = PagesEnums.STORES_ACCOUNTS ;

  // itemsList: Item[] = [];
  // itemCtrl: FormControl;
  // filteredItem: Observable<Item[]>;
  // selectedItem: Item | undefined;
  // formcontrol = new FormControl('');

  displayedColumns: string[] = ['itemName', 'price', 'qty', 'total', 'action'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private formBuilder: FormBuilder,
    private api: ApiService,
    private hotkeysService: HotkeysService,
    @Inject(LOCALE_ID) private locale: string,
    @Inject(MAT_DIALOG_DATA) public editData: any,
    @Inject(MAT_DIALOG_DATA) public editDataDetails: any,
    private http: HttpClient,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<StrOpeningStockDialogComponent>,
    private toastr: ToastrService,
    private router: Router) {

    this.currentData = new Date;

    // this.itemCtrl = new FormControl();
    // this.filteredItem = this.itemCtrl.valueChanges.pipe(
    //   startWith(''),
    //   map(value => this._filterItems(value))
    // );

  }


  ngOnInit() {
    this.getStores();
    // this.getItems();
    this.getFiscalYears();
    // this.getStrOpenAutoNo();
    this.getMasterRowId = this.editData;
    // this.getStrOpenAutoNo();

    this.groupMasterForm = this.formBuilder.group({
      no: [''],
      storeId: [''],
      storeName: [''],
      transactionUserId: ['', Validators.required],
      date: [this.currentData, Validators.required],
      total: ['', Validators.required],
      fiscalYearId: ['', Validators.required],
    });

    this.groupDetailsForm = this.formBuilder.group({
      stR_Opening_StockId: ['', Validators.required], //MasterId
      qty: ['1', Validators.required],
      price: ['', Validators.required],
      total: ['', Validators.required],
      transactionUserId: ['', Validators.required],
      itemId: ['', Validators.required],
      itemName: ['', Validators.required],
    });
    this.hotkeysService.add(new Hotkey('ctrl+s', (event: KeyboardEvent): boolean => {
      // Call the deleteGrade() function in the current component
      this.nextToAddFormDetails();
      return false; // Prevent the default browser behavior
    }));
    // globalTransactionUserId
    this.userIdFromStorage = localStorage.getItem('transactionUserId');
    this.groupMasterForm.controls['transactionUserId'].setValue(this.userIdFromStorage);

    if (this.editData) {
      this.isEdit = true;
      // console.log("nnnnnnnnnnnnnnnnnnn: ", this.groupMasterForm.value);

      this.actionBtnMaster = "Update";
      this.groupMasterForm.controls['no'].setValue(this.editData.no);

      this.groupMasterForm.controls['storeId'].setValue(this.editData.storeId);
      this.groupMasterForm.controls['fiscalYearId'].setValue(this.editData.fiscalYearId);
      this.groupMasterForm.controls['date'].setValue(this.editData.date);
      this.groupMasterForm.controls['total'].setValue(this.editData.total);
      // this.toggleEdit();
      console.log("nnnnnnnnnnnnnnnnnnn: ", this.groupMasterForm.value);


      this.groupMasterForm.addControl('id', new FormControl('', Validators.required));
      this.groupMasterForm.controls['id'].setValue(this.editData.id);
      this.isEditDataReadOnly = true;
      // this.groupMasterForm.controls['no'].setValue(this.editData.no);

    }
    // else {
    //   this.groupMasterForm.controls['no'].enable();
    // }

    this.getAllDetailsForms();



  }


  // private _filterItems(value: string): Item[] {
  //   const filterValue = value;
  //   return this.itemsList.filter(item =>
  //     item.name.toLowerCase().includes(filterValue)
  //   );
  // }
  // displayItemName(item: any): string {
  //   return item && item.name ? item.name : '';
  // }
  // ItemSelected(event: MatAutocompleteSelectedEvent): void {
  //   const item = event.option.value as Item;
  //   console.log("item selected: ", item);
  //   this.selectedItem = item;
  //   this.groupDetailsForm.patchValue({ itemId: item.id });
  //   console.log("item in form: ", this.groupDetailsForm.getRawValue().itemId);
  //   this.itemOnChange(this.groupDetailsForm.getRawValue().itemId);
  //   this.getCodeByItem(this.groupDetailsForm.getRawValue().itemId);
  // }
  // openAutoItem() {
  //   this.itemCtrl.setValue(''); // Clear the input field value

  //   // Open the autocomplete dropdown by triggering the value change event
  //   this.itemCtrl.updateValueAndValidity();
  // }


  // resetControls() {
  //   this.groupDetailsForm.reset();
  //   this.fullCodeValue = '';
  //   this.itemByFullCodeValue = '';
  //   this.itemCtrl.setValue('');
  //   this.groupDetailsForm.controls['qty'].setValue(1);

  // }
  async nextToAddFormDetails() {
    // console.log("ppppp: ", this.isEdit)
    this.groupMasterForm.removeControl('id')

    this.storeName = await this.getStoreByID(this.groupMasterForm.getRawValue().storeId);
    this.groupMasterForm.controls['storeName'].setValue(this.storeName);
    this.groupMasterForm.controls['total'].setValue(this.sumOfTotals);


    // if (this.groupMasterForm.getRawValue().no) {
    //   console.log("no changed: ", this.groupMasterForm.getRawValue().no)
    // }
    // else {
    //   this.groupMasterForm.controls['no'].setValue(this.autoNo);
    //   console.log("no took auto number: ", this.groupMasterForm.getRawValue().no)
    // }

    // this.getStrOpenAutoNo(this.groupMasterForm.getRawValue().storeId, this.groupMasterForm.getRawValue().fiscalYearId);

    this.groupMasterForm.controls['no'].setValue(this.autoNo);
    if (this.groupMasterForm.getRawValue().storeName && this.groupMasterForm.getRawValue().date && this.groupMasterForm.getRawValue().storeId && this.groupMasterForm.getRawValue().no) {


      console.log("Master add form : ", this.groupMasterForm.value)
      this.api.postStrOpen(this.groupMasterForm.value)
        .subscribe({
          next: (res) => {
            this.getMasterRowId = {
              "id": res
            };
            this.MasterGroupInfoEntered = true;

            this.toastrSuccess();
            this.getAllDetailsForms();
            // this.addDetailsInfo();
          },
          error: (err) => {
            // console.log("header post err: ", err);
            // alert("حدث خطأ أثناء إضافة مجموعة")
          }
        })
    }

  }

  getAllDetailsForms() {
    // this.getStrOpenAutoNo(this.groupMasterForm.getRawValue().storeId, this.groupMasterForm.getRawValue().fiscalYearId);
    console.log("master Id: ", this.getMasterRowId.id)

    if (this.getMasterRowId.id) {
      // this.http.get<any>("http://ims.aswan.gov.eg/api/STROpeningStockDetails/get/all")
      //   .subscribe(res => {

      //     this.matchedIds = res.filter((a: any) => {
      //       return a.stR_Opening_StockId == this.getMasterRowId.id
      //     })

      //     if (this.matchedIds) {

      //       this.dataSource = new MatTableDataSource(this.matchedIds);
      //       this.dataSource.paginator = this.paginator;
      //       this.dataSource.sort = this.sort;

      //       this.sumOfTotals = 0;
      //       for (let i = 0; i < this.matchedIds.length; i++) {
      //         this.sumOfTotals = this.sumOfTotals + parseFloat(this.matchedIds[i].total);
      //         this.groupMasterForm.controls['total'].setValue(this.sumOfTotals);
      //         // alert('totalll: '+ this.sumOfTotals)
      //         // this.updateBothForms();
      //         this.updateMaster();
      //       }

      //     }
      //   }
      //     , err => {
      //       alert("حدث خطا ما !!")
      //     }
      //   )


      // getStrOpenDetailsByMasterId(id: any) {
      this.api.getStrOpenDetailsByMasterId(this.getMasterRowId.id)
        .subscribe({
          next: (res) => {
            // this.itemsList = res;
            this.matchedIds = res;

            if (this.matchedIds) {
              console.log("eeeeeeeeeeeeeeeeeeeeeeeeeeee: ", res);
              this.dataSource = new MatTableDataSource(this.matchedIds);
              this.dataSource.paginator = this.paginator;
              this.dataSource.sort = this.sort;

              this.sumOfTotals = 0;
              for (let i = 0; i < this.matchedIds.length; i++) {
                this.sumOfTotals = this.sumOfTotals + parseFloat(this.matchedIds[i].total);
                this.sumOfTotals = Number(this.sumOfTotals.toFixed(2));
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
      // }
    }


  }


  addNewDetails() {
    this.router.navigate(['/str-openingStock'], { queryParams: { masterId: this.getMasterRowId.id, fiscalYear: this.groupMasterForm.getRawValue().fiscalYearId, store: this.groupMasterForm.getRawValue().storeId, date: this.groupMasterForm.getRawValue().date } })
    this.dialog.open(StrOpeningStockDetailsDialogComponent, {
      width: '98%',
      height: '85%',
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

    // if (this.getMasterRowId.id) {
    //   if (this.getMasterRowId.id) {

    //     if (this.groupDetailsForm.getRawValue().itemId) {

    // this.itemName = await this.getItemByID(this.groupDetailsForm.getRawValue().itemId);
    // this.groupDetailsForm.controls['itemName'].setValue(this.itemName);
    this.groupDetailsForm.controls['transactionUserId'].setValue(this.userIdFromStorage);
    // }

    // this.groupDetailsForm.controls['stR_Opening_StockId'].setValue(this.getMasterRowId.id);
    // this.groupDetailsForm.controls['total'].setValue((parseFloat(this.groupDetailsForm.getRawValue().price) * parseFloat(this.groupDetailsForm.getRawValue().qty)));
    // console.log("post d: ", this.groupDetailsForm.valid, "ooo:", !this.getDetailedRowData);

    // if (this.groupDetailsForm.valid && !this.getDetailedRowData) {

    //   this.api.postStrOpenDetails(this.groupDetailsForm.value)
    //     .subscribe({
    //       next: (res) => {
    //         this.toastrSuccess();
    //         this.groupDetailsForm.reset();
    //         this.groupDetailsForm.controls['qty'].setValue(1);
    //         this.itemCtrl.setValue('');
    //         this.itemByFullCodeValue = '';
    //         this.fullCodeValue = '';

    //         this.updateDetailsForm()
    //         this.getAllDetailsForms();
    //       },
    //       error: () => {
    //         // alert("حدث خطأ أثناء إضافة مجموعة")
    //       }
    //     })
    // } 
    // else {
    console.log("update both: ", this.groupDetailsForm.valid, "ooo:", !this.getDetailedRowData);
    console.log("edit : ", this.groupDetailsForm.value)
    this.api.putStrOpen(this.groupMasterForm.value)
      .subscribe({
        next: (res) => {
          // if (this.groupDetailsForm.value && this.getDetailedRowData) {
          // this.api.putStrOpenDetails(this.groupDetailsForm.value, this.getDetailedRowData.id)
          //   .subscribe({
          //     next: (res) => {


          // this.toastrSuccess();
          this.groupDetailsForm.reset();
          // this.itemCtrl.setValue('');
          this.itemByFullCodeValue = '';
          this.fullCodeValue = '';

          // this.getAllDetailsForms();
          this.getDetailedRowData = '';
          this.groupDetailsForm.controls['qty'].setValue(1);

          //   },
          //   error: (err) => {
          //     console.log("update err: ", err)
          //     // alert("خطأ أثناء تحديث سجل المجموعة !!")
          //   }
          // })
          // }

        },

      })
    // this.updateBothForms();
    //     }

    //   }

    // }
    // else {
    //   console.log("update d: ", this.groupDetailsForm.valid, "ooo:", !this.getDetailedRowData);

    //   this.updateDetailsForm();
    // }
  }

  async updateDetailsForm() {
    this.storeName = await this.getStoreByID(this.groupMasterForm.getRawValue().storeId);
    this.groupMasterForm.controls['storeName'].setValue(this.storeName);

    this.groupDetailsForm.controls['itemName'].setValue(this.itemName);

    if (this.editData) {
      this.groupMasterForm.addControl('id', new FormControl('', Validators.required));
      this.groupMasterForm.controls['id'].setValue(this.editData.id);
    }

    this.groupMasterForm.addControl('id', new FormControl('', Validators.required));
    this.groupMasterForm.controls['id'].setValue(this.getMasterRowId.id);

    this.isEdit = false;
    this.toastrEditSuccess();
    // 
    // console.log("edit : ", this.groupDetailsForm.value, "row: ", this.getDetailedRowData.id)
    // this.api.putStrOpen(this.groupMasterForm.value)
    //   .subscribe({
    //     next: (res) => {
    //       if (this.groupDetailsForm.value && this.getDetailedRowData) {
    //         // this.api.putStrOpenDetails(this.groupDetailsForm.value, this.getDetailedRowData.id)
    //         //   .subscribe({
    //         //     next: (res) => {
    //               this.toastrSuccess();
    //               this.groupDetailsForm.reset();
    //               this.itemCtrl.setValue('');
    //               this.itemByFullCodeValue = '';
    //               this.fullCodeValue = '';

    //               this.getAllDetailsForms();
    //               this.getDetailedRowData = '';
    //               this.groupDetailsForm.controls['qty'].setValue(1);

    //           //   },
    //           //   error: (err) => {
    //           //     console.log("update err: ", err)
    //           //     // alert("خطأ أثناء تحديث سجل المجموعة !!")
    //           //   }
    //           // })
    //       }

    //     },

    //   })
  }

  updateBothForms() {
    var inputValue = (<HTMLInputElement>document.getElementById('autoNoInput')).value;
    console.log("iiiiiiiiinput: ", inputValue)

    // if(this.isEdit == true && (this.autoNo != this.editData.no)){
    //   this.groupMasterForm.controls['no'].setValue(inputValue);
    // }
    // else if(this.isEdit == false && (this.autoNo == this.editData.no)){
    //   this.groupMasterForm.controls['no'].setValue(this.editData.no);
    // }

    console.log("ISEDIT: ", this.isEdit)
    if (this.isEdit == false) {
      this.groupMasterForm.controls['no'].setValue(this.autoNo)
    }
    console.log("check update d, ", this.groupMasterForm.value);

    if (this.groupMasterForm.getRawValue().no != '' && this.groupMasterForm.getRawValue().storeId != '' && this.groupMasterForm.getRawValue().fiscalYearId != '' && this.groupMasterForm.getRawValue().date != '') {
      console.log("change readOnly to enable, ", this.groupMasterForm.value);

      if (!this.autoNo) {
        this.autoNo = this.editData.no;

      }
      this.groupDetailsForm.controls['stR_Opening_StockId'].setValue(this.getMasterRowId.id);
      // this.groupDetailsForm.controls['total'].setValue(parseFloat(this.groupDetailsForm.getRawValue().price) * parseFloat(this.groupDetailsForm.getRawValue().qty));
      console.log("ISEDIT33: ", this.isEdit)

      // this.updateDetailsForm();
    }
    console.log("ISEDIT55: ", this.isEdit)

    // else {
    //   alert("تاكد من ادخال البيانات صحيحة")
    // }

  }

  editDetailsForm(row: any) {

    // if (this.editDataDetails || row) {
    //   this.getDetailedRowData = row;
    //   console.log("itemId: ", this.getDetailedRowData);

    //   this.actionBtnDetails = "Update";
    //   this.groupDetailsForm.controls['stR_Opening_StockId'].setValue(this.getDetailedRowData.stR_Opening_StockId);

    //   this.groupDetailsForm.controls['qty'].setValue(this.getDetailedRowData.qty);
    //   this.groupDetailsForm.controls['price'].setValue(this.getDetailedRowData.price);

    //   this.groupDetailsForm.controls['total'].setValue(parseFloat(this.groupDetailsForm.getRawValue().price) * parseFloat(this.groupDetailsForm.getRawValue().qty));

    //   this.groupDetailsForm.controls['itemId'].setValue(this.getDetailedRowData.itemId);
    //   this.getCodeByItem(this.getDetailedRowData.itemId)
    //   // this.itemOnChange(this.groupDetailsForm.getRawValue().itemId);
    // }

    this.router.navigate(['/str-openingStock'], { queryParams: { masterId: this.getMasterRowId.id, fiscalYear: this.groupMasterForm.getRawValue().fiscalYearId, store: this.groupMasterForm.getRawValue().storeId, date: this.groupMasterForm.getRawValue().date } })
    this.dialog.open(StrOpeningStockDetailsDialogComponent, {
      width: '98%',
      height: '85%',
      data: row
    }).afterClosed().subscribe(val => {
      if (val === 'Save' || val === 'Update') {
        this.getAllDetailsForms();
      }
    })


  }

  deleteFormDetails(id: number) {
    var result = confirm("هل ترغب بتاكيد الحذف ؟");
    if (result) {
      this.api.deleteStrOpenDetails(id)
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

  getAllMasterForms() {
    this.dialogRef.close('save');

    this.api.getStrOpen()
      .subscribe({
        next: (res) => {
          this.dataSource = new MatTableDataSource(res);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        },
        error: () => {
          // alert("خطأ أثناء جلب سجلات المجموعة !!");
        }
      })
  }

  async getStores() {
    this.userRoles = localStorage.getItem('userRoles');
    console.log('userRoles: ', this.userRoles.includes(this.userRoleStoresAcc))

    if (this.userRoles.includes(this.userRoleStoresAcc)) {
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

  getStoreByID(id: any) {
    return fetch(this.api.getStoreById(id))
      .then(response => response.json())
      .then(json => {
        return json.name;
      })
      .catch((err) => {
        // console.log("error in fetch name by id: ", err);
        // alert("خطا اثناء جلب رقم المخزن !");
      });
  }

  // getItems() {
  //   this.api.getItems()
  //     .subscribe({
  //       next: (res) => {
  //         this.itemsList = res;
  //       },
  //       error: (err) => {
  //         // console.log("fetch items data err: ", err);
  //         // alert("خطا اثناء جلب العناصر !");
  //       }
  //     })
  // }

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

  // getItemByCode(code: any) {
  //   if (code.keyCode == 13) {
  //     this.itemsList.filter((a: any) => {
  //       if (a.fullCode === code.target.value) {
  //         this.groupDetailsForm.controls['itemId'].setValue(a.id);
  //         console.log("item by code: ", a.name);
  //         this.itemCtrl.setValue(a.name);
  //         if (a.name) {
  //           this.itemByFullCodeValue = a.name;
  //         }
  //         else {
  //           this.itemByFullCodeValue = '-';
  //         }
  //         this.itemByFullCodeValue = a.name;
  //         this.itemOnChange(this.groupDetailsForm.getRawValue().itemId);

  //       }
  //     })
  //   }


  // }

  // getCodeByItem(item: any) {
  //   console.log("item by code: ", item, "code: ", this.itemsList);

  //   // if (item.keyCode == 13) {
  //   this.itemsList.filter((a: any) => {
  //     if (a.id === item) {
  //       // this.groupDetailsForm.controls['itemId'].setValue(a.id);
  //       console.log("item by code selected: ", a)
  //       // console.log("item by code selected: ", a.fullCode)
  //       if (a.fullCode) {
  //         this.fullCodeValue = a.fullCode;
  //       }
  //       else {
  //         this.fullCodeValue = '-';
  //       }

  //       // this.itemOnChange(this.groupDetailsForm.getRawValue().itemId)
  //     }
  //   })
  //   // }


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
                  this.groupMasterForm.controls['fiscalYearId'].setValue(this.editData.fiscalYearId);
                }
                else {
                  this.groupMasterForm.controls['fiscalYearId'].setValue(this.defaultFiscalYearSelectValue.id);
                  this.getStrOpenAutoNo();
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

  // getFiscalYearsByID(id: any) {
  //   // console.log("row fiscalYear id: ", id);
  //   return fetch(`http://ims.aswan.gov.eg/api/STRFiscalYear/get/${id}`)
  //     .then(response => response.json())
  //     .then(json => {
  //       // console.log("fetch fiscalYears name by id res: ", json.fiscalyear);
  //       return json.fiscalyear;
  //     })
  //     .catch((err) => {
  //       console.log("error in fetch fiscalYears name by id: ", err);
  //       // alert("خطا اثناء جلب رقم العنصر !");
  //     });
  // }

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