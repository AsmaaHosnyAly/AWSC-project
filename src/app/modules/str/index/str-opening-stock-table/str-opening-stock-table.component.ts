import { Component, Inject, LOCALE_ID, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from '../../services/api.service';
import { ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { formatDate } from '@angular/common';
import { StrOpeningStockDialogComponent } from '../str-opening-stock-dialog/str-opening-stock-dialog.component';
import { ToastrService } from 'ngx-toastr';
import { HotkeysService } from 'angular2-hotkeys';
import { Hotkey } from 'angular2-hotkeys';
import { PagesEnums } from 'src/app/core/enums/pages.enum';
import {
  FormControl,
  FormControlName,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Observable, map, startWith, tap,debounceTime } from 'rxjs';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { PrintDialogComponent } from '../print-dialog/print-dialog.component';
import { GlobalService } from 'src/app/pages/services/global.service';
import { MatTabGroup } from '@angular/material/tabs';
import jwt_decode from 'jwt-decode';

export class store {
  constructor(public id: number, public name: string) { }
}

export class item {
  constructor(public id: number, public name: string,public fullCode: string) { }
}

export class Item {
  constructor(public id: number, public name: string, public fullCode: string) { }
}

export class Product {
  constructor(public id: number, public name: string, public code: any) { }
}
interface StrOpeningStock {
  no: any;
  storeName: any;
  fiscalyear: any;
  date: any;
  Action: any;
}

@Component({
  selector: 'app-str-opening-stock-table',
  templateUrl: './str-opening-stock-table.component.html',
  styleUrls: ['./str-opening-stock-table.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StrOpeningStockTableComponent implements OnInit {
  ELEMENT_DATA: StrOpeningStock[] = [];
  totalRows = 0;
  pageSize = 5;
  currentPage: any;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  pageIndex: any;
  length: any;
  dataSource2: MatTableDataSource<StrOpeningStock> = new MatTableDataSource();
  serachFlag: boolean = false;
  editData: any;
  editDataDetails:any
  

  displayedColumns: string[] = [
    'no',
    'storeName',
    'fiscalyear',
    'date',
    'Action',
  ];
  isLoading = false;
  matchedIds: any;
  // storeList: any;
  storeName: any;
  itemName: any;
  fiscalYearsList: any;
  loading: boolean = false;
  // itemsList: any;
  groupMasterFormSearch!: FormGroup;
  groupMasterForm !: FormGroup;
  groupDetailsForm!: FormGroup;
  storeList: store[] = [];
  storeCtrl: FormControl;
  filteredstore: Observable<store[]>;
  selectedstore: store | undefined;
  storeSelectedId: any;
  fiscalYearSelectedId: any;
  defaultFiscalYearSelectValue: any;
  defaultStoreSelectValue: any;
  itemsList: item[] = [];
  itemCtrl: FormControl;
  filtereditem: Observable<item[]>;
  selecteditem: item | undefined;
  isEdit: boolean = false;
  pdfurl = '';
  autoNo: any;
  userRoles: any;
  currentData: any;
  userIdFromStorage: any;
  decodedToken2: any;
  sumOfTotals = 0;
  getMasterRowId: any;
  MasterGroupInfoEntered = false;
  productsList: Product[] = [];
  productCtrl: FormControl;
  selectedProduct: Product | undefined;
  fullCodeValue: any;
  itemByFullCodeValue: any;
  filteredItem: Observable<Item[]>;
  productIdValue: any;
  getMasterRowStoreId: any;
  getMasterRowFiscalYearId: any;
  getMasterRowDate: any;
  isReadOnly: boolean = true;
  @ViewChild("matgroup", { static: false })
  matgroup!: MatTabGroup;
  selectedItem: Item | undefined;
  dataSource: MatTableDataSource<StrOpeningStockTableComponent> = new MatTableDataSource();
  userRoleStoresAcc = PagesEnums.STORES_ACCOUNTS;
  filteredProduct: Observable<Product[]>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  getDetailedRowData: any;
  transactionUserId = localStorage.getItem('transactionUserId');
  displayedDetailsColumns: string[] = ['itemName', 'price', 'qty', 'total', 'action'];
  ngAfterViewInit() {
    this.dataSource2.paginator = this.paginator;
  }

  constructor(
    private api: ApiService,
    private dialog: MatDialog,
    private http: HttpClient,
    private hotkeysService: HotkeysService,
    private formBuilder: FormBuilder,
    @Inject(LOCALE_ID) private locale: string,
   
    private toastr: ToastrService,
    private global: GlobalService,
    private cdr: ChangeDetectorRef
  ) {
    
    this.productCtrl = new FormControl();
    this.currentData = new Date;
    global.getPermissionUserRoles('Store', 'str-home', 'إدارة المخازن وحسابات المخازن ', 'store')
    this.storeCtrl = new FormControl();
    this.filteredstore = this.storeCtrl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filterstores(value))
    );
    this.filteredProduct = this.productCtrl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filterProducts(value))
    );
    this.itemCtrl = new FormControl();
    // this.filtereditem = this.itemCtrl.valueChanges.pipe(
    //   startWith(''),
    //   map((value) => this._filteritems(value))
    // );

    this.filtereditem = this.itemCtrl.valueChanges.pipe(
      startWith(''),
      debounceTime(300), // Adjust the debounce time (in milliseconds) to your preference
      map((value) => this._filteritems(value))
    );

    this.filteredItem = this.itemCtrl.valueChanges.pipe(
      startWith(''),
      debounceTime(300), // Adjust the debounce time (in milliseconds) to your preference
      map((value) => this._filterItems(value))
    );

  }

  ngOnInit(): void {
    this.getAllMasterForms();
    this.getStores();
    this.getFiscalYears();
    this.getItems();

    this.groupDetailsForm = this.formBuilder.group({
      stR_Opening_StockId: [''], //MasterId
      qty: ['1'],
      price: [''],
      total: [''],
      transactionUserId: [''],
      itemId: [''],
      itemName: [''],
    });
    this.groupMasterForm= this.formBuilder.group({
      no: [''],
      storeId: [''],
      storeName: [''],
      transactionUserId: ['', Validators.required],
      date: [this.currentData, Validators.required],
      total: ['', Validators.required],
      fiscalYearId: ['', Validators.required],
    });
    this.userIdFromStorage = localStorage.getItem('transactionUserId');
    this.groupMasterForm.controls['transactionUserId'].setValue(this.userIdFromStorage);
    
    this.groupMasterFormSearch = this.formBuilder.group({
      no: [''],
      employee: [''],
      // costcenter:[],
      itemName: [''],
      fiscalYear: [''],
      date: [''],
      store: [''],
      storeId: [''],
      // itemId:[''],
      StartDate: [''],
      EndDate: [''],
      report: [''],
      reportType: [''],
    });
    this.hotkeysService.add(
      new Hotkey('ctrl+o', (event: KeyboardEvent): boolean => {
        // Call the deleteGrade() function in the current component
        this.openOpeningStockDialog();
        return false; // Prevent the default browser behavior
      })
    );
  }
  
  storeValueChanges(storeId: any) {
   
    console.log("store: ", storeId)
    this.storeSelectedId = storeId;
    this.groupMasterFormSearch.controls['storeId'].setValue(this.storeSelectedId);
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

    if (this.groupMasterFormSearch) {

      // if (this.editData && !this.fiscalYearSelectedId) {
      //   console.log("change storeId only in updateHeader");
      //   this.api.getStrOpenAutoNo(this.groupMasterFormSearch.getRawValue().storeId, this.editData.fiscalYearId)
      //     .subscribe({
      //       next: (res) => {
      //         this.autoNo = res;
      //         console.log("autoNo: ", this.autoNo);
      //         return res;
      //       },
      //       error: (err) => {
      //         console.log("fetch autoNo err: ", err);
      //         // alert("خطا اثناء جلب العناصر !");
      //       }
      //     })
      // }

      // else if (this.editData && !this.storeSelectedId) {
      //   console.log("change fiscalYearId only in updateHeader");
      //   this.api.getStrOpenAutoNo(this.editData.storeId, this.groupMasterFormSearch.getRawValue().fiscalYearId)
      //     .subscribe({
      //       next: (res) => {
      //         this.autoNo = res;
      //         console.log("autoNo: ", this.autoNo);
      //         return res;
      //       },
      //       error: (err) => {
      //         console.log("fetch autoNo err: ", err);
      //         // alert("خطا اثناء جلب العناصر !");
      //       }
      //     })
      // }
      // else if (this.editData) {
      //   console.log("change both in edit data: ", this.isEdit);

      //   this.api.getStrOpenAutoNo(this.groupMasterFormSearch.getRawValue().storeId, this.groupMasterFormSearch.getRawValue().fiscalYearId)
      //     .subscribe({
      //       next: (res) => {
      //         this.autoNo = res;
      //         // this.editData = null;
      //         console.log("isEdit : ", this.isEdit)
      //         // this.groupMasterFormSearch.controls['no'].setValue(666);
      //         console.log("autoNo: ", this.autoNo);
      //         return res;
      //       },
      //       error: (err) => {
      //         console.log("fetch autoNo err: ", err);
      //         // alert("خطا اثناء جلب العناصر !");
      //       }
      //     })
      // }
      // else {
      //   console.log("change both values in updateHeader", this.groupMasterFormSearch.getRawValue().storeId);
      //   this.api.getStrOpenAutoNo(this.groupMasterFormSearch.getRawValue().storeId, this.groupMasterFormSearch.getRawValue().fiscalYearId)
      //     .subscribe({
      //       next: (res) => {
      //         this.autoNo = res;
      //         // this.editData.no = res
      //         console.log("isEdit : ", this.isEdit)

      //         console.log("autoNo: ", this.autoNo);
      //         return res;
      //       },
      //       error: (err) => {
      //         console.log("fetch autoNo err: ", err);
      //         // alert("خطا اثناء جلب العناصر !");
      //       }
      //     })
      // }


      console.log('editData: ', this.editData, "storeSelected: ", this.storeSelectedId, "fiscaLYearId: ", this.fiscalYearSelectedId);

      if (this.editData && (this.editData.storeId == this.storeSelectedId) && (this.editData.fiscalYearId == this.fiscalYearSelectedId)) {
        console.log("firstCase editData does Not change: ");
        this.isEdit = true;

        console.log('isEdit : ', this.isEdit, "no master: ", this.groupMasterForm.getRawValue().no);
        this.groupMasterForm.controls['no'].setValue(this.editData.no);
        console.log('autoNo1: ', this.groupMasterForm.getRawValue().no);

      }
      else if (this.editData && (this.editData.storeId != this.storeSelectedId) && (this.editData.fiscalYearId == this.fiscalYearSelectedId)) {
        console.log("secondCase editData with storeId Only change: ");

        this.api
          .getStrOpenAutoNo(
            this.groupMasterForm.getRawValue().storeId,
            this.editData.fiscalYearId
          )
          .subscribe({
            next: (res) => {
              this.autoNo = res;

              console.log('isEdit : ', this.isEdit, "no master: ", this.groupMasterForm.getRawValue().no);
              this.groupMasterForm.controls['no'].setValue(this.autoNo);
              console.log('autoNo2: ', this.autoNo);
              return res;
            },
            error: (err) => {
              console.log('fetch autoNo err2: ', err);
              // alert("خطا اثناء جلب العناصر !");
            },
          });

      }
      else if (this.editData && (this.editData.storeId == this.storeSelectedId) && (this.editData.fiscalYearId != this.fiscalYearSelectedId)) {
        console.log("thirdCase editData with fiscalYear Only change: ");

        this.api
          .getStrOpenAutoNo(
            this.editData.storeId,
            this.groupMasterForm.getRawValue().fiscalYearId
          )
          .subscribe({
            next: (res) => {
              this.autoNo = res;

              console.log('isEdit : ', this.isEdit, "no master: ", this.groupMasterForm.getRawValue().no);
              this.groupMasterForm.controls['no'].setValue(this.autoNo);
              console.log('autoNo3: ', this.autoNo);
              return res;
            },
            error: (err) => {
              console.log('fetch autoNo err3: ', err);
              // alert("خطا اثناء جلب العناصر !");
            },
          });
      }
      else if (this.editData && (this.editData.storeId != this.storeSelectedId) && (this.editData.fiscalYearId != this.fiscalYearSelectedId)) {
        console.log("fourthCase editData with fiscalYear And store change: ");

        this.api
          .getStrOpenAutoNo(
            this.groupMasterForm.getRawValue().storeId,
            this.groupMasterForm.getRawValue().fiscalYearId
          )
          .subscribe({
            next: (res) => {
              this.autoNo = res;

              console.log('isEdit : ', this.isEdit, "no master: ", this.groupMasterForm.getRawValue().no);
              this.groupMasterForm.controls['no'].setValue(this.autoNo);
              console.log('autoNo4: ', this.autoNo);
              return res;
            },
            error: (err) => {
              console.log('fetch autoNo err4: ', err);
              // alert("خطا اثناء جلب العناصر !");
            },
          });
      }
      else {
        console.log("fifthCase No editData: ");

        this.api
          .getStrOpenAutoNo(
            this.groupMasterForm.getRawValue().storeId,
            this.groupMasterForm.getRawValue().fiscalYearId
          )
          .subscribe({
            next: (res) => {
              this.autoNo = res;
              // this.editData.no = res
              console.log('isEdit : ', this.isEdit, "no master: ", this.groupMasterForm.getRawValue().no);
              this.groupMasterForm.controls['no'].setValue(this.autoNo);
              console.log('autoNo5: ', this.autoNo);
              return res;
            },
            error: (err) => {
              console.log('fetch autoNo err5: ', err);
              // alert("خطا اثناء جلب العناصر !");
            },
          });
      }
      
    }

  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource2.filter = filterValue.trim().toLowerCase();

    if (this.dataSource2.paginator) {
      this.dataSource2.paginator.firstPage();
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
  
  getAllDetailsForms() {
    // this.getStrOpenAutoNo(this.groupMasterForm.getRawValue().storeId, this.groupMasterForm.getRawValue().fiscalYearId);
    console.log("master Id: ", this.getMasterRowId.id)

    if (this.getMasterRowId.id) {

      this.api.getStrOpenDetailsByMasterId(this.getMasterRowId.id)
        .subscribe({
          next: (res) => {
            // // this.itemsList = res;
            // this.matchedIds = res;

            if (res) {
              console.log("eeeeeeeeeeeeeeeeeeeeeeeeeeee all data: ", res);
              // this.dataSource = new MatTableDataSource(this.matchedIds);
              // this.dataSource.paginator = this.paginator;
              // this.dataSource.sort = this.sort;

              this.sumOfTotals = 0;
              for (let i = 0; i < res.length; i++) {
                let total = res.filter((detail: { total: any; }) => detail.total)
                  .reduce((sum: any, current: { total: any; }) => sum + parseFloat(current.total), 0);

                console.log("reduce sum function, Master TOTAL: ", total);
                // this.sumOfTotals + parseFloat(this.matchedIds[i].total);
                this.sumOfTotals = Number(total.toFixed(2));
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

      console.log("mastered row get all data: ", this.getMasterRowId);
      if (this.getMasterRowId) {
        console.log("currentPage: ", this.currentPage, "pageSize: ", this.pageSize);

        if (!this.currentPage && !this.pageSize) {
          this.currentPage = 0;
          this.pageSize = 5;

          this.isLoading = true;
          console.log("first time: ");


          fetch(this.api.getStrOpenDetailsPaginateByMasterId(this.getMasterRowId.id, this.currentPage, this.pageSize))
            .then(response => response.json())
            .then(data => {
              // this.totalRows = data.length;
              console.log("master data paginate first Time: ", data);
              this.dataSource.data = data.items;
              this.pageIndex = data.page;
              this.pageSize = data.pageSize;
              this.length = data.totalItems;
              // this.sumOfTotals = 0;
              // console.log("LENGTH of all data details: ", this.length);

              // for (let i = 0; i < data.items.length; i++) {
              //   this.sumOfTotals = this.sumOfTotals + parseFloat(data.items[i].total);
              //   this.sumOfTotals = Number(this.sumOfTotals.toFixed(2));
              //   this.groupMasterForm.controls['total'].setValue(this.sumOfTotals);
              //   this.updateMaster();
              // }

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
          console.log("second time total calculated: ", this.sumOfTotals);

          fetch(this.api.getStrOpenDetailsPaginateByMasterId(this.getMasterRowId.id, this.currentPage, this.pageSize))
            .then(response => response.json())
            .then(data => {
              // this.totalRows = data.length;
              console.log("master data paginate: ", data);
              this.dataSource.data = data.items;
              this.pageIndex = data.page;
              this.pageSize = data.pageSize;
              this.length = data.totalItems;
              // console.log("LENGTH of all data details22: ", this.length);

              // for (let i = 0; i < data.items.length; i++) {
              //   this.sumOfTotals = this.sumOfTotals + parseFloat(data.items[i].total);
              //   this.sumOfTotals = Number(this.sumOfTotals.toFixed(2));
              //   this.groupMasterForm.controls['total'].setValue(this.sumOfTotals);
              //   this.updateMaster();
              // }

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

    }


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
    // console.log("update both: ", this.groupDetailsForm.valid, "ooo:", !this.getDetailedRowData);
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
          // this.itemByFullCodeValue = '';
          // this.fullCodeValue = '';

          // this.getAllDetailsForms();
          // this.getDetailedRowData = '';
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


  async getStores() {
    const accessToken: any = localStorage.getItem('accessToken');
    // this.userRoles = localStorage.getItem('userRoles');
     let decodedToken:any = jwt_decode(accessToken);
    this.decodedToken2 = decodedToken.roles;
    this.userRoles = this.decodedToken2;

    console.log('userRoles: ', this.userRoles.includes(this.userRoleStoresAcc))

    if (this.userRoles.includes(this.userRoleStoresAcc)) {
      // console.log('user is manager -all stores available- , role: ', userRoles);
      this.loading = true
      this.api.getStore()
        .subscribe({
          next: async (res) => {
            this.loading = false
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
            this.loading = false
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

  getsearch(code: any) {
    if (code.keyCode == 13) {
      this.getAllMasterForms();
    }
  }
  getAllMasterForms() {
    if (!this.currentPage && this.serachFlag == false) {
      this.currentPage = 0;

      // this.isLoading = true;
      fetch(this.api.getStrOpeningStockPaginate(this.currentPage, this.pageSize))
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
          // this.isLoading = false;
        }, error => {
          console.log(error);
          // this.isLoading = false;
        });
    }
    else {
      if (this.serachFlag == false) {
        // this.isLoading = true;
        fetch(this.api.getStrOpeningStockPaginate(this.currentPage, this.pageSize))
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
            // this.isLoading = false;
          }, error => {
            console.log(error);
            // this.isLoading = false;
          });
      }
      else {
        console.log("search next paginate");
        this.getSearchStrOpen(this.groupMasterFormSearch.getRawValue().no, this.groupMasterFormSearch.getRawValue().StartDate, this.groupMasterFormSearch.getRawValue().EndDate, this.groupMasterFormSearch.getRawValue().fiscalYear)
      }

    }

  }

  pageChanged(event: PageEvent) {
    console.log("page event: ", event);
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;

    this.getAllMasterForms();
  }

  openOpeningStockDialog() {
   
    let tabGroup = this.matgroup;
    tabGroup.selectedIndex = 1;
    this.getStores();
    this.getFiscalYears();
  }
  editMasterForm(row: any) {
    let tabGroup = this.matgroup;
    tabGroup.selectedIndex = 1;
    this.getStores();
    this.getFiscalYears();
    this.editData = row;
  }

  editDetailsForm(row: any) {

    
    let tabGroup = this.matgroup;
    tabGroup.selectedIndex = 1;
    this.getStores();
    this.getFiscalYears();
    this.editDataDetails = row;


  }

  displaystoreName(store: any): string {
    return store && store.name ? store.name : '';
  }
  storeSelected(event: MatAutocompleteSelectedEvent): void {
    const store = event.option.value as store;
    console.log('store selected: ', store);
    this.selectedstore = store;
    this.groupMasterFormSearch.patchValue({ storeId: store.id });
    console.log('store in form: ', this.groupMasterFormSearch.getRawValue().storeId);
  }
  private _filterstores(value: string): store[] {
    const filterValue = value;
    return this.storeList.filter((store: { name: string }) =>
      store.name.toLowerCase().includes(filterValue)
    );
  }

  openAutostore() {
    this.storeCtrl.setValue(''); // Clear the input field value

    // Open the autocomplete dropdown by triggering the value change event
    this.storeCtrl.updateValueAndValidity();
  }

  displayitemName(item: any): string {
    return item && item.name ? item.name : '';
  }
  itemSelected(event: MatAutocompleteSelectedEvent): void {
    const item = event.option.value as item;
    console.log('item selected: ', item);
    this.selecteditem = item;
    this.groupDetailsForm.patchValue({ itemId: item.id });
    console.log('item in form: ', this.groupDetailsForm.getRawValue().itemId);
  }
  private _filteritems(value: string): item[] {
    const filterValue = value;
    return this.itemsList.filter((item: { name: string }) =>
      item.name.toLowerCase().includes(filterValue)
    );
  }

  openAutoitem() {
    this.itemCtrl.setValue(''); // Clear the input field value

    // Open the autocomplete dropdown by triggering the value change event
    this.itemCtrl.updateValueAndValidity();
  }

  deleteBothForms(id: number) {
    // // var result = confirm('تاكيد الحذف ؟ ');

    // // if (result) {

    // //   this.api.deleteStrOpen(id).subscribe({
    // //     next: (res) => {
    // //       // alert("تم حذف المجموعة بنجاح");

    // //       this.http
    // //         .get<any>(
    // //           'http://ims.aswan.gov.eg/api/STROpeningStockDetails/get/all'
    // //         )
    // //         .subscribe(
    // //           (res) => {
    // //             this.matchedIds = res.filter((a: any) => {
    // //               // console.log("matched Id & HeaderId : ", a.stR_Opening_StockId === id)
    // //               return a.stR_Opening_StockId === id;
    // //             });

    // //             for (let i = 0; i < this.matchedIds.length; i++) {
    // //               this.deleteFormDetails(this.matchedIds[i].id);
    // //             }
    // //           },
    // //           (err) => {
    // //             // alert('خطا اثناء تحديد المجموعة !!');
    // //           }
    // //         );

    // //       this.toastrDeleteSuccess();
    // //       this.getAllMasterForms();
    // //     },
    // //     error: () => {
    // //       // alert('خطأ أثناء حذف المجموعة !!');
    // //     },
    // //   });
    // // }

    // this.http
    //   .get<any>('http://ims.aswan.gov.eg/api/STROpeningStockDetails/get/all')
    //   .subscribe(
    //     (res) => {
    //       this.matchedIds = res.filter((a: any) => {
    //         return a.stR_Opening_StockId === id;
    //       });
    //       var result = confirm('هل ترغب بتاكيد حذف التفاصيل و الرئيسي؟');

    //       if (this.matchedIds.length) {
    //         for (let i = 0; i < this.matchedIds.length; i++) {
    //           if (result) {
    //             this.api.deleteStrOpenDetails(this.matchedIds[i].id).subscribe({
    //               next: (res) => {
    //                 this.api.deleteStrOpen(id).subscribe({
    //                   next: (res) => {
    //                     this.toastrDeleteSuccess();
    //                     this.getAllMasterForms();
    //                   },
    //                   error: () => {
    //                     // alert("خطأ أثناء حذف الرئيسي !!");
    //                   },
    //                 });
    //               },
    //               error: () => {
    //                 // alert("خطأ أثناء حذف التفاصيل !!");
    //               },
    //             });
    //           }
    //         }
    //       } else {
    //         if (result) {
    //           this.api.deleteStrOpen(id).subscribe({
    //             next: (res) => {
    //               this.toastrDeleteSuccess();
    //               this.getAllMasterForms();
    //             },
    //             error: () => {
    //               // alert("خطأ أثناء حذف الرئيسي !!");
    //             },
    //           });
    //         }
    //       }
    //     },
    //     (err) => {
    //       // alert("خطا اثناء تحديد المجموعة !!")
    //     }
    //   );

    var result = confirm('تاكيد الحذف ؟ ');
    console.log(' id in delete:', id);
    if (result) {
      this.api.deleteStrOpen(id).subscribe({
        next: (res) => {
          this.api.getStrOpenAllDetails().subscribe({
            next: (res) => {
              this.matchedIds = res.filter((a: any) => {
                // console.log("matched Id & HeaderId : ", a.HeaderId === id)
                return a.stR_Opening_StockId === id;
              });

              for (let i = 0; i < this.matchedIds.length; i++) {
                this.deleteFormDetails(this.matchedIds[i].id);
              }
            },
            error: (err) => {
              // alert('خطا اثناء تحديد المجموعة !!');
            },
          });

          this.toastrDeleteSuccess();
          this.getAllMasterForms();
        },
        error: () => {
          // alert('خطأ أثناء حذف المجموعة !!');
        },
      });
    }
  }

  deleteFormDetails(id: number) {
    this.api.deleteStrOpenDetails(id).subscribe({
      next: (res) => {
        // alert('تم حذف الصنف بنجاح');
        this.getAllMasterForms();
      },
      error: (err) => {
        console.log('delete details err: ', err);
        // alert('خطأ أثناء حذف الصنف !!');
      },
    });
  }

  async addDetailsInfo() {
   
    console.log("nnnvvvvvvvvvv post d: ", this.groupDetailsForm.value);
    console.log("nnnvvvvvvvvvvhhhhhhhhhhh: ", this.isEdit);
    if (!this.editDataDetails) {
      // if (this.getMasterRowId) {

        if (this.groupDetailsForm.getRawValue().itemId) {

          this.itemName = await this.getItemByID(this.groupDetailsForm.getRawValue().itemId);
          // this.groupDetailsForm.controls['itemName'].setValue(this.itemName);

          this.groupDetailsForm.controls['transactionUserId'].setValue(this.transactionUserId);
        }

        if(this.editData){
        this.groupDetailsForm.controls['stR_Opening_StockId'].setValue(this.editData.id);

        }
        else{
          this.groupDetailsForm.controls['stR_Opening_StockId'].setValue(this.getMasterRowId);

        }
        this.groupDetailsForm.controls['total'].setValue((parseFloat(this.groupDetailsForm.getRawValue().price) * parseFloat(this.groupDetailsForm.getRawValue().qty)));
        console.log("post d: ", this.groupDetailsForm.value, "ooo:", !this.getDetailedRowData);

        if (this.groupDetailsForm.valid && !this.getDetailedRowData) {

          this.api.postStrOpenDetails(this.groupDetailsForm.value)
            .subscribe({
              next: (res) => {
                this.toastrSuccess();
                this.groupDetailsForm.reset();
                this.updateDetailsForm();
                // this.getAllDetailsForms();
                this.itemCtrl.setValue('');
                this.itemByFullCodeValue = '';
                this.fullCodeValue = '';

                // this.updateDetailsForm()
                // this.getAllDetailsForms();
              },
              error: () => {
                // alert("حدث خطأ أثناء إضافة مجموعة")
              }
            })
        }
        // else {
        //   console.log("update both: ", this.groupDetailsForm.valid, "ooo:", !this.getDetailedRowData);

        //   this.updateBothForms();
        // }

      // }

    }
    else {
      console.log("update d: ", this.groupDetailsForm.valid, "ooo:", !this.getDetailedRowData);

      this.updateDetailsForm();
    }


  }

  // getStores() {
  //   this.loading = true;
  //   this.api.getStore().subscribe({
  //     next: (res) => {
  //       this.loading = false;
  //       this.storeList = res;
  //       // console.log("store res: ", this.storeList);
  //     },
  //     error: (err) => {
  //       this.loading = false;
  //       // console.log("fetch store data err: ", err);
  //       alert('خطا اثناء جلب المخازن !');
  //     },
  //   });
  // }
  printReport() {
    let buttn: any = document.querySelectorAll('#buttn');
    console.log(buttn);

    let header: any = document.getElementById('header');
    console.log(header);

    let paginator: any = document.getElementById('paginator');
    console.log(paginator);

    let actionheade: any = document.getElementById('action-header');
    actionheade.style.display = 'none';

    let action1: any = document.getElementById('action1');
    console.log(action1);
    let action2: any = document.querySelectorAll('action2');
    console.log(action2);

    let button1: any = document.querySelectorAll('#button1');
    console.log(button1);
    let button2: any = document.getElementById('button2');
    console.log(button2);
    let button: any = document.getElementsByClassName('mdc-icon-button');
    console.log(button);
    let reportFooter: any = document.getElementById('reportFooter');
    console.log(reportFooter);
    let date: any = document.getElementById('date');
    console.log(date);
    header.style.display = 'grid';
    // button1.style.display = 'none';
    // button2.style.display = 'none';
    for (let i = 0; i < buttn.length; i++) {
      buttn[i].hidden = true;
    }
    let printContent: any = document.getElementById('content')?.innerHTML;
    let originalContent: any = document.body.innerHTML;
    document.body.innerHTML = printContent;
    // console.log(document.body.children);
    document.body.style.cssText =
      'direction:rtl;-webkit-print-color-adjust:exact;';
    window.print();
    document.body.innerHTML = originalContent;
    location.reload();
  }

  // getFiscalYears() {
  //   this.api.getFiscalYears().subscribe({
  //     next: (res) => {
  //       this.fiscalYearsList = res;
  //     },
  //     error: (err) => {
  //       // console.log("fetch fiscalYears data err: ", err);
  //       // alert("خطا اثناء جلب العناصر !");
  //     },
  //   });
  // }

  async updateDetailsForm() {

    this.groupDetailsForm.controls['total'].setValue((parseFloat(this.groupDetailsForm.getRawValue().price) * parseFloat(this.groupDetailsForm.getRawValue().qty)));

    this.isEdit = false;
    // console.log("edit : ", this.groupDetailsForm.value, "row: ", this.editData.id)
    // this.api.putStrOpen(this.groupMasterForm.value)
    // .subscribe({
    //   next: (res) => {
    if (this.groupDetailsForm.value && this.editData) {
      this.api.putStrOpenDetails(this.groupDetailsForm.value, this.editData.id)
        .subscribe({
          next: (res) => {
            this.toastrEditSuccess();
            this.groupDetailsForm.reset();
            this.itemCtrl.setValue('');
            this.itemByFullCodeValue = '';
            this.fullCodeValue = '';

            this.groupDetailsForm.controls['qty'].setValue(1);
           

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

  async getFiscalYears() {
    this.loading = true
    this.api.getFiscalYears()
      .subscribe({
        next: async (res) => {
          this.loading = false
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
                this.loading = false
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

  getItems() {
    this.loading = true;
    this.api.getItems().subscribe({
      next: (res) => {
        this.loading = false;
        this.itemsList = res;
        this.cdr.detectChanges(); // Trigger change detection
      },      
      error: (err) => {
        this.loading = false;
        // console.log("fetch store data err: ", err);
        alert('خطا اثناء جلب العناصر !');
      },
    });
  }

  getSearchStrOpen(no: any, StartDate: any, EndDate: any, fiscalYear: any) {
    let store = this.groupMasterFormSearch.getRawValue().storeId;
    let item = this.groupDetailsForm.getRawValue().itemId;
    this.loading = true;
    this.api
      .getStrOpenSearach(no, store, fiscalYear, item, StartDate, EndDate)
      .subscribe({
        next: (res) => {
          this.loading = false;
          // this.dataSource2 = res;
          // this.dataSource2.paginator = this.paginator;
          // this.dataSource2.sort = this.sort;

          this.totalRows = res.length;
          if (this.serachFlag == false) {
            this.pageIndex = 0;
            this.pageSize = 5;
            this.length = this.totalRows;
            this.serachFlag = true;
          }
          console.log('master data paginate first Time: ', res);
          this.dataSource2 = new MatTableDataSource(res);
          this.dataSource2.paginator = this.paginator;
          this.dataSource2.sort = this.sort;

        },
      });
  }

  resetForm() {
    this.groupMasterFormSearch.reset();

    this.itemCtrl.reset();
    this.storeCtrl.reset();
    
    this.serachFlag = false;

    this.getAllMasterForms();
  }

  downloadPdf(
    no: any,
    StartDate: any,
    EndDate: any,
    fiscalYear: any,
    report: any,
    reportType: any
  ) {
    let store = this.groupMasterFormSearch.getRawValue().storeId;
    let item = this.groupMasterFormSearch.getRawValue().itemId;
    let costCenter = this.groupMasterFormSearch.getRawValue().costCenterId;
    let employee = this.groupMasterFormSearch.getRawValue().employeeId;

    this.api
      .openingStock(
        no,
        store,
        StartDate,
        EndDate,
        fiscalYear,
        item,
        employee,
        costCenter,
        report,
        reportType
      )
      .subscribe({
        next: (res) => {
          console.log('search:', res);
          const url: any = res.url;
          window.open(url);
          // let blob: Blob = res.body as Blob;
          // let url = window.URL.createObjectURL(blob);

          // this.dataSource = res;
          // this.dataSource.paginator = this.paginator;
          // this.dataSource.sort = this.sort;
        },
        error: (err) => {
          console.log('eroorr', err);
          window.open(err.url);
        },
      });
  }
  // previewPdf(no: any, date: any, fiscalYear: any) {
  //   let store = this.groupMasterFormSearch.getRawValue().storeId;
  //   let item = this.groupMasterFormSearch.getRawValue().itemId;

  //   this.api.openingStock(no, store, date, fiscalYear, item).subscribe({
  //     next: (res) => {
  //       let blob: Blob = res.body as Blob;
  //       console.log(blob);
  //       let url = window.URL.createObjectURL(blob);
  //       localStorage.setItem('url', JSON.stringify(url));
  //       this.pdfurl = url;
  //       this.dialog.open(PrintDialogComponent, {
  //         width: '50%',
  //       });

  //       // this.dataSource = res;
  //       // this.dataSource.paginator = this.paginator;
  //       // this.dataSource.sort = this.sort;
  //     },
  //     error: (err) => {
  //       console.log('eroorr', err);
  //       window.open(err.url);
  //     },
  //   });
  // }

  previewPrint(
    no: any,
    StartDate: any,
    EndDate: any,
    fiscalYear: any,
    report: any,
    reportType: any
  ) {
    let costCenter = this.groupMasterFormSearch.getRawValue().costCenterId;
    let employee = this.groupMasterFormSearch.getRawValue().employeeId;
    let item = this.groupMasterFormSearch.getRawValue().itemId;
    let store = this.groupMasterFormSearch.getRawValue().storeId;
    if (report != null && reportType != null) {
      this.loading = true;
      this.api
        .openingStock(
          no,
          store,
          StartDate,
          EndDate,
          fiscalYear,
          item,
          employee,
          costCenter,
          report,
          'pdf'
        )
        .subscribe({
          next: (res) => {
            this.loading = false;
            let blob: Blob = res.body as Blob;
            console.log(blob);
            let url = window.URL.createObjectURL(blob);
            localStorage.setItem('url', JSON.stringify(url));
            this.pdfurl = url;
            this.dialog.open(PrintDialogComponent, {
              width: '50%',
            });

            // this.dataSource = res;
            // this.dataSource.paginator = this.paginator;
            // this.dataSource.sort = this.sort;
          },
          error: (err) => {
            this.loading = false;
            console.log('eroorr', err);
            window.open(err.url);
          },
        });
    } else {
      alert('ادخل التقرير و نوع التقرير!');
    }
  }


  tabSelected(tab: any) {
    console.log("tab selected: ", tab);
    if (tab.index == 0) {
      console.log("done: ", tab);

      // this.editData = '';
      // this.MasterGroupInfoEntered = false;
      // this.groupMasterFormSearch.controls['no'].setValue('');
      // this.listCtrl.setValue('');
      // this.costcenterCtrl.setValue('');
      // this.storeCtrl.setValue('');
      // this.groupMasterFormSearch.controls['date'].setValue(this.currentDate);
      // this.lists = [];

      this.getAllMasterForms();

    }
  }

//  detailes section

getItemByProductCode(code: any) {
  if (code.keyCode == 13) {
    this.productsList.filter((a: any) => {
      console.log("enter product code case, ", "a.code: ", a.code, " code target: ", code.target.value);
      if (a.code == code.target.value) {
        console.log("enter product code case condition: ", a.code === code.target.value);

        this.groupDetailsForm.controls['itemId'].setValue(a.itemId);

        this.productIdValue = a.name;
        this.productCtrl.setValue(a.name);

        console.log("itemslist: ", this.itemsList.find((item: { id: any; }) => item.id == (this.groupDetailsForm.getRawValue().itemId))?.fullCode);
        this.fullCodeValue = this.itemsList.find((item: { id: any; }) => item.id == (this.groupDetailsForm.getRawValue().itemId))?.fullCode;

        // alert(this.fullCodeValue);
        this.itemCtrl.setValue(a.itemName);
        if (a.itemName) {
          this.itemByFullCodeValue = a.itemName;

        }
        else {
          this.itemByFullCodeValue = '-';
        }
        this.itemByFullCodeValue = a.itemName;
        this.itemOnChange(this.groupDetailsForm.getRawValue().itemId);

      }
      else {
        this.productIdValue = '';
      }
    })
  }
}

async itemOnChange(itemEvent: any) {
  console.log("itemEvent change value: ", itemEvent);

  console.log("get avg values: ", this.groupMasterForm.getRawValue().storeId, "year: ", this.groupMasterForm.getRawValue().fiscalYearId, "date: ", formatDate(this.groupMasterForm.getRawValue().date, 'yyyy-MM-dd', this.locale));


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
        if (this.groupDetailsForm.getRawValue().price == 0 || this.editData?.price == 0) {
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
ItemSelected(event: MatAutocompleteSelectedEvent): void {
  const item = event.option.value as Item;
  console.log("item selected: ", item);
  this.selectedItem = item;
  this.groupDetailsForm.patchValue({ itemId: item.id });
  console.log("item in form: ", this.groupDetailsForm.getRawValue().itemId);
  this.itemOnChange(this.groupDetailsForm.getRawValue().itemId);
  this.getCodeByItem(this.groupDetailsForm.getRawValue().itemId);
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
openAutoProduct() {
  this.productCtrl.setValue(''); // Clear the input field value

  // Open the autocomplete dropdown by triggering the value change event
  this.productCtrl.updateValueAndValidity();
}

ProductSelected(event: MatAutocompleteSelectedEvent): void {
  const product = event.option.value as Product;
  console.log("product selected: ", product);
  this.selectedProduct = product;
  this.productIdValue = product.id;

  console.log("product in form: ", this.productIdValue);
  this.getItemByProductId(this.productIdValue);
}

getItemByProductId(productEvent: any) {
  console.log("productEvent: ", productEvent);

  this.productsList.filter((a: any) => {
    if (a.id === productEvent) {
      this.groupDetailsForm.controls['itemId'].setValue(a.itemId);
      // this.groupDetailsForm.controls['fullCode'].setValue(a.code);
      this.fullCodeValue = this.itemsList.find((item: { id: any; }) => item.id == (this.groupDetailsForm.getRawValue().itemId))?.fullCode;

      console.log("item by code: ", a.itemName);
      this.itemCtrl.setValue(a.itemName);
      if (a.itemName) {
        this.itemByFullCodeValue = a.itemName;

      }
      else {
        this.itemByFullCodeValue = '-';
      }
      this.itemByFullCodeValue = a.itemName;
      this.itemOnChange(this.groupDetailsForm.getRawValue().itemId);
    }
  })
}
displayProductName(product: any): string {
  return product && product.name ? product.name : '';
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
        this.itemOnChange(this.groupDetailsForm.getRawValue().itemId);

      }
    })
  }


}
displayItemName(item: any): string {
  return item && item.name ? item.name : '';
}

private _filterItems(value: string): Item[] {
  const filterValue = value;
  return this.itemsList.filter(item =>
    item.name.toLowerCase().includes(filterValue)
  );
}


// async addDetailsInfo() {
//   // this.dialogRef.close('save');

//   // console.log("get params: ", this.route.snapshot.queryParamMap.get('date'));
//   // this.getMasterRowId = this.route.snapshot.queryParamMap.get('masterId');
//   // this.getMasterRowStoreId = this.route.snapshot.queryParamMap.get('store');
//   // this.getMasterRowId = this.route.snapshot.queryParamMap.get('fiscalYear');
//   // this.getMasterRowDate = this.route.snapshot.queryParamMap.get('date');

//   console.log("nnnvvvvvvvvvv post d: ", this.groupDetailsForm.value);
//   console.log("nnnvvvvvvvvvvhhhhhhhhhhh: ", this.isEdit);
//   // if (this.isEdit == false) {
//   //   this.groupMasterForm.controls['no'].setValue(this.autoNo);
//   // }

//   if (!this.editData) {
//     if (this.getMasterRowId) {

//       if (this.groupDetailsForm.getRawValue().itemId) {

//         this.itemName = await this.getItemByID(this.groupDetailsForm.getRawValue().itemId);
//         // this.groupDetailsForm.controls['itemName'].setValue(this.itemName);

//         this.groupDetailsForm.controls['transactionUserId'].setValue(this.transactionUserId);
//       }

//       this.groupDetailsForm.controls['stR_Opening_StockId'].setValue(this.getMasterRowId);
//       this.groupDetailsForm.controls['total'].setValue((parseFloat(this.groupDetailsForm.getRawValue().price) * parseFloat(this.groupDetailsForm.getRawValue().qty)));
//       console.log("post d: ", this.groupDetailsForm.value, "ooo:", !this.getDetailedRowData);

//       if (this.groupDetailsForm.valid && !this.getDetailedRowData) {

//         this.api.postStrOpenDetails(this.groupDetailsForm.value)
//           .subscribe({
//             next: (res) => {
//               this.toastrSuccess();
//               this.groupDetailsForm.reset();
//               this.updateDetailsForm();
//               // this.getAllDetailsForms();
//               this.itemCtrl.setValue('');
//               this.itemByFullCodeValue = '';
//               this.fullCodeValue = '';

//               // this.updateDetailsForm()
//               // this.getAllDetailsForms();
//             },
//             error: () => {
//               // alert("حدث خطأ أثناء إضافة مجموعة")
//             }
//           })
//       }
//       // else {
//       //   console.log("update both: ", this.groupDetailsForm.valid, "ooo:", !this.getDetailedRowData);

//       //   this.updateBothForms();
//       // }

//     }

//   }
//   else {
//     console.log("update d: ", this.groupDetailsForm.valid, "ooo:", !this.getDetailedRowData);

//     this.updateDetailsForm();
//   }


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

openAutoItem() {
  this.itemCtrl.setValue(''); // Clear the input field value

  // Open the autocomplete dropdown by triggering the value change event
  this.itemCtrl.updateValueAndValidity();
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
