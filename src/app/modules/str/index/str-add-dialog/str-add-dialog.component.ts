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
import { ApiService } from '../../services/api.service';
import { StrAddDetailsDialogComponent } from '../str-add-details-dialog/str-add-details-dialog.component';
import { Router } from '@angular/router';
import { HotkeysService } from 'angular2-hotkeys';
import { Hotkey } from 'angular2-hotkeys';
import { PagesEnums } from 'src/app/core/enums/pages.enum';
import jwt_decode from 'jwt-decode';

export class Seller {
  constructor(public id: number, public name: string) { }
}
export class Employee {
  constructor(public id: number, public name: string) { }
}
export interface Source {
  name: string
}
export class List {
  constructor(public id: number, public name: string) { }
}
export class Item {
  constructor(public id: number, public name: string) { }
}

export class AddType {
  constructor(public id: number, public name: string, source: any) { }
}

@Component({
  selector: 'app-str-add-dialog',
  templateUrl: './str-add-dialog.component.html',
  styleUrls: ['./str-add-dialog.component.css']
})
export class STRAddDialogComponent implements OnInit {
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
  // typeName: any;
  sellerName: any;
  // receiptName: any;
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

  listCtrl: FormControl;
  filteredList: Observable<List[]>;
  lists: List[] = [];
  selectedList: List | undefined;

  itemCtrl: FormControl;
  filteredItem: Observable<Item[]>;
  items: Item[] = [];
  selectedItem: Item | undefined;

  addTypeCtrl: FormControl;
  filteredAddType: Observable<AddType[]>;
  addTypeList: AddType[] = [];
  selectedAddType: AddType | undefined;

  getAddData: any;
  sourceSelected: any;
  isEdit: boolean = false;

  btnDisabled: boolean = false;

  displayedColumns: string[] = [
    'itemName',
    // 'avgPrice', 
    'price',
    'qty',
    'total',
    'action'
  ];
  decodedToken: any;
  decodedToken2: any;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  sourceStoreName: any;

  currentDate: any;

  userRoleStoresAcc = PagesEnums.STORES_ACCOUNTS;

  constructor(private formBuilder: FormBuilder,

    private api: ApiService,
    private hotkeysService: HotkeysService,
    @Inject(MAT_DIALOG_DATA) public editData: any,
    @Inject(MAT_DIALOG_DATA) public editDataDetails: any,
    private http: HttpClient,
    private toastr: ToastrService,
    private dialog: MatDialog,
    @Inject(LOCALE_ID) private locale: string,
    private dialogRef: MatDialogRef<STRAddDialogComponent>,
    private router: Router) {

    this.currentDate = new Date;

    this.listCtrl = new FormControl();
    this.filteredList = this.listCtrl.valueChanges.pipe(
      startWith(''),
      map(value => this._filterLists(value))
    );

    this.itemCtrl = new FormControl();
    this.filteredItem = this.itemCtrl.valueChanges.pipe(
      startWith(''),
      map(value => this._filterItems(value))
    );

    this.addTypeCtrl = new FormControl();
    this.filteredAddType = this.addTypeCtrl.valueChanges.pipe(
      startWith(''),
      map(value => this._filterAddType(value))
    );
  }

  ngOnInit(): void {

    const accessToken: any = localStorage.getItem('accessToken');
    // console.log('accessToken', accessToken);
    // Decode the access token
    this.decodedToken = jwt_decode(accessToken);
    this.decodedToken2 = this.decodedToken.roles;
    console.log('accessToken2', this.decodedToken2);

    this.getStrAddType();
    this.getStores();
    this.getItems();
    this.getTypes();
    this.getSellers();
    this.getReciepts();
    this.getEmployees();
    this.getStrAddAutoNo();

    this.getFiscalYears();


    this.getMasterRowId = this.editData;

    this.groupMasterForm = this.formBuilder.group({
      no: ['', Validators.required],
      storeId: ['', Validators.required],
      storeName: ['', Validators.required],
      transactionUserId: ['', Validators.required],
      date: [this.currentDate, Validators.required],
      total: ['', Validators.required],
      fiscalYearId: ['', Validators.required],

      sellerId: [''],
      // sellerName: [''],
      employeeId: [''],
      // employeeName: [''],
      sourceStoreId: [''],
      // sourceStoreName: [''],
      addTypeId: [''],
      entryNo: ['0'],

    });

    this.groupDetailsForm = this.formBuilder.group({
      addId: ['', Validators.required], //MasterId
      qty: ['1', Validators.required],
      price: ['', Validators.required],
      total: ['', Validators.required],
      transactionUserId: ['', Validators.required],
      itemId: ['', Validators.required],

      itemName: ['', Validators.required],
      avgPrice: [''],
      balanceQty: ['', Validators.required],
      percentage: [''],

      state: ['', Validators.required],


    });

    this.api.getAllItems().subscribe((items) => {
      this.items = items;
    });
    this.hotkeysService.add(new Hotkey('ctrl+s', (event: KeyboardEvent): boolean => {
      // Call the deleteGrade() function in the current component
      this.nextToAddFormDetails();
      return false; // Prevent the default browser behavior
    }));




    if (this.editData) {
      this.isEdit = true;
      this.getAddData = this.editData;

      if (this.editData.addTypeName == 'اذن صرف') {
        this.actionName = "str";
        console.log("action btnnnnnnnnnnnnn", this.actionName)
        // this.groupMasterForm.controls['addTypeId'].setValue('المخزن');
        this.groupMasterForm.controls['entryNo'].disable();


      }
      else if (this.editData.addTypeName == 'اذن ارتجاع') {
        this.actionName = "emp";
        // this.groupMasterForm.controls['addTypeId'].setValue('الموظف')
        this.groupMasterForm.controls['entryNo'].disable();


      } else {
        this.actionName = "choose";
        // this.groupMasterForm.controls['addTypeId'].setValue('المورد');
        this.groupMasterForm.controls['entryNo'].setValue(this.editData.entryNo);

      }
      console.log("this.groupMasterForm.getRawValue().addTypeId: ", this.groupMasterForm.getRawValue().addTypeId);

      this.getListCtrl(this.groupMasterForm.getRawValue().addTypeId);

      console.log("master edit form: ", this.editData);
      this.actionBtnMaster = "Update";
      this.groupMasterForm.controls['no'].setValue(this.editData.no);
      this.groupMasterForm.controls['storeId'].setValue(this.editData.storeId);

      this.groupMasterForm.controls['fiscalYearId'].setValue(this.editData.fiscalYearId);

      this.groupMasterForm.controls['date'].setValue(this.editData.date);
      this.groupMasterForm.controls['total'].setValue(this.editData.total);
      // this.groupMasterForm.controls['addTypeId'].setValue(this.editData.addTypeId);
      // this.groupMasterForm.controls['addReceiptId'].setValue(this.editData.addReceiptId);

      this.groupMasterForm.controls['sellerId'].setValue(this.editData.sellerId);
      this.groupMasterForm.controls['sourceStoreId'].setValue(this.editData.sourceStoreId);
      this.groupMasterForm.controls['employeeId'].setValue(this.editData.employeeId);
      this.groupMasterForm.addControl('id', new FormControl('', Validators.required));
      this.groupMasterForm.controls['id'].setValue(this.editData.id);
    }

    this.getAllDetailsForms();
    console.log("mastered row get all data: ", this.getMasterRowId)

    // localStorage.setItem('transactionUserId', JSON.stringify("mehrail"));
    this.userIdFromStorage = localStorage.getItem('transactionUserId');
    console.log("userIdFromStorage in localStorage: ", this.userIdFromStorage)
    // console.log("userIdFromStorage after slice from string shape: ", this.userIdFromStorage?.slice(1, length - 1))
    // this.groupMasterForm.controls['transactionUserId'].setValue(this.userIdFromStorage?.slice(1, length - 1));
    this.groupMasterForm.controls['transactionUserId'].setValue(this.userIdFromStorage);

  }

  addNewDetails() {
    this.router.navigate(['/STRAdd'], { queryParams: { masterId: this.getMasterRowId.id, fiscalYear: this.groupMasterForm.getRawValue().fiscalYearId, store: this.groupMasterForm.getRawValue().storeId, date: this.groupMasterForm.getRawValue().date, sourceStoreName: this.groupMasterForm.getRawValue().addTypeId } })
    this.dialog.open(StrAddDetailsDialogComponent, {
      width: '98%',
      height: '85%',
    }).afterClosed().subscribe(val => {
      if (val === 'Save' || val === 'Update') {
        this.getAllDetailsForms();
      }
    })
  }

  async nextToAddFormDetails() {
    this.groupMasterForm.removeControl('id')

    this.storeName = await this.getStoreByID(this.groupMasterForm.getRawValue().storeId);

    this.groupMasterForm.controls['storeName'].setValue(this.storeName);

    this.sourceStoreName = await this.getSourceStoreByID(this.groupMasterForm.getRawValue().sourceStoreId);

    // this.groupMasterForm.controls['sourceStoreName'].setValue(this.sourceStoreName);

    this.sellerName = await this.getSellerByID(this.groupMasterForm.getRawValue().sellerId);

    // this.groupMasterForm.controls['sellerName'].setValue(this.sellerName);

    this.employeeName = await this.getEmployeeByID(this.groupMasterForm.getRawValue().employeeId);

    // this.groupMasterForm.controls['employeeName'].setValue(this.employeeName);


    this.groupMasterForm.controls['total'].setValue(this.sumOfTotals);

    this.groupMasterForm.controls['fiscalYearId'].setValue(1)

    this.groupMasterForm.controls['no'].setValue(this.autoNo);


    if (this.groupMasterForm.getRawValue().storeName && this.groupMasterForm.getRawValue().date && this.groupMasterForm.getRawValue().storeId && this.groupMasterForm.getRawValue().no) {
      console.log("Master add form : ", this.groupMasterForm.value)

      this.api.postStrAdd(this.groupMasterForm.value)
        .subscribe({
          next: (res) => {
            // console.log("ID header after post req: ", res);
            this.getMasterRowId = {
              "id": res
            };
            this.MasterGroupInfoEntered = true;

            this.toastrSuccess();
            this.getAllDetailsForms();
          },
          error: (err) => {
            console.log("header post err: ", err);
            // alert("حدث خطأ أثناء إضافة مجموعة")
          }
        })
    }

  }

  getAllDetailsForms() {

    if (this.getMasterRowId) {

      if (this.editData) {

        if (this.editData.hasOwnProperty('strWithDrawDetailsGetVM')) {
          this.btnDisabled = true;
          this.api.getStrAddDetailsByAddId(this.getMasterRowId.id)
            .subscribe({
              next: (res) => {

                console.log("enter getAllDetails: ", res);

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
        }
        else {
          this.api.getStrAddDetailsByAddId(this.getMasterRowId.id)
            .subscribe({
              next: (res) => {

                console.log("enter getAllDetails: ", res);

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
        }

      }
      else {
        this.api.getStrAddDetailsByAddId(this.getMasterRowId.id)
          .subscribe({
            next: (res) => {

              console.log("enter getAllDetails: ", res);

              this.matchedIds = res[0].strAddDetailsGetVM;

              if (this.matchedIds) {
                console.log("eeeeeeeeeeeeeeeeeeeeeeeeeeee: ", res[0].strAddDetailsGetVM);
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
      }


    }


  }

  async updateMaster() {
    this.groupDetailsForm.controls['transactionUserId'].setValue(this.userIdFromStorage);

    console.log("update both: ", this.groupDetailsForm.valid, "ooo:", !this.getDetailedRowData);
    this.api.putStrAdd(this.groupMasterForm.value)
      .subscribe({
        next: (res) => {

          this.groupDetailsForm.reset();

          this.getDetailedRowData = '';
          this.groupDetailsForm.controls['qty'].setValue(1);


        },

      })

  }


  async addDetailsInfo() {
    this.groupDetailsForm.removeControl('id')

    if (this.isEdit == false) {
      this.groupMasterForm.controls['no'].setValue(this.autoNo);
    }

    if (this.getMasterRowId.id) {
      if (this.getMasterRowId.id) {

        if (this.groupDetailsForm.getRawValue().itemId) {
          this.itemName = await this.getItemByID(this.groupDetailsForm.getRawValue().itemId);
          this.groupDetailsForm.controls['itemName'].setValue(this.itemName);

          this.groupDetailsForm.controls['transactionUserId'].setValue(this.userIdFromStorage);
        }

        this.groupDetailsForm.controls['avgPrice'].setValue(this.groupDetailsForm.getRawValue().avgPrice);
        this.groupDetailsForm.controls['addId'].setValue(this.getMasterRowId.id);
        this.groupDetailsForm.controls['total'].setValue((parseFloat(this.groupDetailsForm.getRawValue().price) * parseFloat(this.groupDetailsForm.getRawValue().qty)));

        this.groupDetailsForm.addControl('date', new FormControl('', Validators.required));
        this.groupDetailsForm.controls['date'].setValue(this.groupMasterForm.getRawValue().date);

        this.groupDetailsForm.addControl('storeId', new FormControl('', Validators.required));
        this.groupDetailsForm.controls['storeId'].setValue(this.groupMasterForm.getRawValue().storeId);

        this.groupDetailsForm.addControl('fiscalYearId', new FormControl('', Validators.required));
        this.groupDetailsForm.controls['fiscalYearId'].setValue(this.groupMasterForm.getRawValue().fiscalYearId);


        // this must be at sellerid only 
        this.api.getNewAvgPrice(
          this.groupMasterForm.getRawValue().storeId,
          this.groupMasterForm.getRawValue().fiscalYearId,
          formatDate(this.groupMasterForm.getRawValue().date, 'yyyy-MM-dd', this.locale),
          this.groupDetailsForm.getRawValue().itemId,
          this.groupDetailsForm.getRawValue().price,
          this.groupDetailsForm.getRawValue().qty
        )
          .subscribe({
            next: (res) => {
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
                alert("تمت إضافة المجموعة بنجاح");
                this.groupDetailsForm.reset();
                this.groupDetailsForm.controls['qty'].setValue(1);
                this.updateDetailsForm()
                this.getAllDetailsForms();
              },
              error: (err) => {
                console.log("add details err: ", err)
                // alert("حدث خطأ أثناء إضافة تفاصيل")
              }
            })
        } else {
          this.updateBothForms();
        }

      }

    }
    else {
      this.updateDetailsForm();
    }


  }

  async updateDetailsForm() {

    this.storeName = await this.getStoreByID(this.groupMasterForm.getRawValue().storeId);

    this.groupMasterForm.controls['storeName'].setValue(this.storeName);

    this.sourceStoreName = await this.getSourceStoreByID(this.groupMasterForm.getRawValue().sourceStoreId);

    // this.groupMasterForm.controls['sourceStoreName'].setValue(this.sourceStoreName);

    this.employeeName = await this.getEmployeeByID(this.groupMasterForm.getRawValue().employeeId);

    // this.groupMasterForm.controls['employeeName'].setValue(this.employeeName);

    this.sellerName = await this.getSellerByID(this.groupMasterForm.getRawValue().sellerId);

    // this.groupMasterForm.controls['sellerName'].setValue(this.sellerName);


    this.groupDetailsForm.controls['itemName'].setValue(this.itemName);

    if (this.editData) {
      this.groupMasterForm.addControl('id', new FormControl('', Validators.required));
      this.groupMasterForm.controls['id'].setValue(this.editData.id);
      console.log("data item Name in edit: ", this.groupMasterForm.value)
    }
    if (this.getDetailedRowData) {
      this.groupDetailsForm.addControl('id', new FormControl('', Validators.required));
      this.groupDetailsForm.controls['id'].setValue(this.getDetailedRowData.id);
      // this.groupDetailsForm.controls['state'].setValue(this.editData.id);
      this.groupDetailsForm.controls['avgPrice'].setValue(this.getDetailedRowData.avgPrice);

    }


    this.groupMasterForm.addControl('id', new FormControl('', Validators.required));
    this.groupMasterForm.controls['id'].setValue(this.getMasterRowId.id);

    this.isEdit = false;

    console.log("details before put foorm: ", this.groupDetailsForm.value)

    this.api.putStrAdd(this.groupMasterForm.value)
      .subscribe({
        next: (res) => {

          if (this.groupDetailsForm.value && this.getDetailedRowData) {
            this.api.putStrAddDetails(this.groupDetailsForm.value)
              .subscribe({
                next: (res) => {
                  this.groupDetailsForm.reset();
                  this.getAllDetailsForms();
                  this.getDetailedRowData = '';
                  // this.dialogRef.close('update');
                },
                error: (err) => {
                  // console.log("update err: ", err)
                  // alert("خطأ أثناء تحديث سجل المجموعة !!")
                }
              })
          }

          // this.dialogRef.close('update');
        },

      })
  }

  updateBothForms() {
    console.log("enter: ")

    var inputValue = (<HTMLInputElement>document.getElementById('autoNoInput')).value;

    console.log("ISEDIT: ", this.isEdit)
    if (this.isEdit == false) {
      this.groupMasterForm.controls['no'].setValue(this.autoNo)
    }

    console.log("pass id: ", this.getMasterRowId.id, "pass No: ", this.groupMasterForm.getRawValue().no, "pass StoreId: ", this.groupMasterForm.getRawValue().storeId, "pass Date: ", this.groupMasterForm.getRawValue().date)

    if (!this.autoNo) {
      this.autoNo = this.editData.no;
    }


    this.groupDetailsForm.controls['addId'].setValue(this.getMasterRowId.id);
    this.groupDetailsForm.controls['total'].setValue(parseFloat(this.groupDetailsForm.getRawValue().price) * parseFloat(this.groupDetailsForm.getRawValue().qty));

    console.log("master edit form2: ", this.groupMasterForm.value);
    this.updateDetailsForm();

  }

  editDetailsForm(row: any) {


    this.router.navigate(['/STRAdd'], { queryParams: { masterId: this.getMasterRowId.id, fiscalYear: this.groupMasterForm.getRawValue().fiscalYearId, store: this.groupMasterForm.getRawValue().storeId, date: this.groupMasterForm.getRawValue().date, sourceStoreName: this.groupMasterForm.getRawValue().addTypeId, } })
    this.dialog.open(StrAddDetailsDialogComponent, {
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
      this.api.deleteStrAddDetails(id)
        .subscribe({
          next: (res) => {
            this.toastrDeleteSuccess();
            // alert("تم الحذف بنجاح");
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
          console.log("response of get all getStrOpen from api: ", res);
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
    this.userRoles = this.decodedToken2;
    console.log('userRoles: ', this.userRoles.includes(this.userRoleStoresAcc))

    if (this.userRoles.includes(this.userRoleStoresAcc)) {
      // console.log('user is manager -all stores available- , role: ', userRoles);

      this.api.getStore()
        .subscribe({
          next: async (res) => {
            this.storeList = res;
            this.defaultStoreSelectValue = await res[Object.keys(res)[0]];

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

            if (this.editData) {
              this.groupMasterForm.controls['storeId'].setValue(this.editData.storeId);
            }
            else {
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
  getTypes() {
    this.api.getType()
      .subscribe({
        next: (res) => {
          this.typeList = res;
        },
        error: (err) => {
          // console.log("fetch store data err: ", err);
          // alert("خطا اثناء جلب المخازن !");
        }
      })
  }
  getSellers() {
    this.api.getSeller()
      .subscribe({
        next: (res) => {
          this.sellerList = res;
        },
        error: (err) => {
          // console.log("fetch store data err: ", err);
          // alert("خطا اثناء جلب المخازن !");
        }
      })
  }
  getReciepts() {
    this.api.getReciept()
      .subscribe({
        next: (res) => {
          this.ReceiptList = res;
        },
        error: (err) => {
          // console.log("fetch store data err: ", err);
          // alert("خطا اثناء جلب المخازن !");
        }
      })
  }
  getEmployees() {
    this.api.getEmployee()
      .subscribe({
        next: (res) => {
          this.employeeList = res;
        },
        error: (err) => {
          // console.log("fetch store data err: ", err);
          // alert("خطا اثناء جلب المخازن !");
        }
      })
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
  getEmployeeByID(id: any) {

    return fetch(this.api.getHrEmployeeById(id))
      .then(response => response.json())
      .then(json => {
        return json.name;
      })
      .catch((err) => {
        // console.log("error in fetch name by id: ", err);
        // alert("خطا اثناء جلب رقم المخزن !");
      });
  }

  getTypeByID(id: any) {

    return fetch(this.api.getTypeById(id))
      .then(response => response.json())
      .then(json => {
        return json.type;
      })
      .catch((err) => {
        // console.log("error in fetch name by id: ", err);
        // alert("خطا اثناء جلب رقم المخزن !");
      });
  }
  getReceiptByID(id: any) {

    return fetch(this.api.getRecieptById(id))
      .then(response => response.json())
      .then(json => {
        return json.addReceipts;
      })
      .catch((err) => {
        // console.log("error in fetch name by id: ", err);
        // alert("خطا اثناء جلب رقم المخزن !");
      });
  }
  getSellerByID(id: any) {

    return fetch(this.api.getSellerById(id))
      .then(response => response.json())
      .then(json => {
        return json.name;
      })
      .catch((err) => {
        // console.log("error in fetch name by id: ", err);
        // alert("خطا اثناء جلب رقم المخزن !");
      });
  }
  getSourceStoreByID(id: any) {

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

  getItemByID(id: any) {

    return fetch(this.api.getItemById(id))
      .then(response => response.json())
      .then(json => {
        return json.name;
      })
      .catch((err) => {
        console.log("error in fetch item name by id: ", err);
        // alert("خطا اثناء جلب رقم العنصر !");
      });
  }

  getItemByCode(code: any) {
    if (code.keyCode == 13) {

      this.itemsList.filter((a: any) => {
        if (a.fullCode === code.target.value) {
          this.groupDetailsForm.controls['itemId'].setValue(a.id);
        }
      })
    }


  }

  async getFiscalYears() {
    this.api.getFiscalYears()
      .subscribe({
        next: async (res) => {
          this.fiscalYearsList = res;

          this.api.getLastFiscalYear()
            .subscribe({
              next: async (res) => {

                this.defaultFiscalYearSelectValue = await res;

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
        },
        error: (err) => {
          // console.log("fetch fiscalYears data err: ", err);
          // alert("خطا اثناء جلب العناصر !");
        }
      })
  }

  storeValueChanges(storeId: any) {
    this.storeSelectedId = storeId;
    this.groupMasterForm.controls['storeId'].setValue(this.storeSelectedId);
    this.isEdit = false;

    this.getStrOpenAutoNo();

  }
  async fiscalYearValueChanges(fiscalyaerId: any) {
    this.fiscalYearSelectedId = await fiscalyaerId;
    this.groupMasterForm.controls['fiscalYearId'].setValue(this.fiscalYearSelectedId);
    this.isEdit = false;

    this.getStrOpenAutoNo();
  }

  getStrOpenAutoNo() {
    if (this.groupMasterForm) {

      if (this.editData && !this.fiscalYearSelectedId) {
        this.api.getStrOpenAutoNo(this.groupMasterForm.getRawValue().storeId, this.editData.fiscalYearId)
          .subscribe({
            next: (res) => {
              this.autoNo = res;
              console.log("autoNo: ", this.autoNo);
              this.groupMasterForm.controls['no'].setValue(this.autoNo);
              return res;
            },
            error: (err) => {
              console.log("fetch autoNo err: ", err);
              // alert("خطا اثناء جلب العناصر !");
            }
          })
      }

      else if (this.editData && !this.storeSelectedId) {
        this.api.getStrOpenAutoNo(this.editData.storeId, this.groupMasterForm.getRawValue().fiscalYearId)
          .subscribe({
            next: (res) => {
              this.autoNo = res;
              console.log("autoNo: ", this.autoNo);
              this.groupMasterForm.controls['no'].setValue(this.autoNo);

              return res;
            },
            error: (err) => {
              console.log("fetch autoNo err: ", err);
              // alert("خطا اثناء جلب العناصر !");
            }
          })
      }
      else if (this.editData) {
        this.api.getStrOpenAutoNo(this.groupMasterForm.getRawValue().storeId, this.groupMasterForm.getRawValue().fiscalYearId)
          .subscribe({
            next: (res) => {
              this.autoNo = res;

              console.log("isEdit : ", this.isEdit)

              console.log("autoNo: ", this.autoNo);
              this.groupMasterForm.controls['no'].setValue(this.autoNo);

              return res;
            },
            error: (err) => {
              console.log("fetch autoNo err: ", err);
              // alert("خطا اثناء جلب العناصر !");
            }
          })
      }
      else {
        this.api.getStrOpenAutoNo(this.groupMasterForm.getRawValue().storeId, this.groupMasterForm.getRawValue().fiscalYearId)
          .subscribe({
            next: (res) => {
              this.autoNo = res;
              console.log("autoNo: ", this.autoNo);
              this.groupMasterForm.controls['no'].setValue(this.autoNo);

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


  set_Percentage(state: any) {
    console.log("state value changed: ", state.value)
    if (state.value == false) {
      this.isReadOnlyPercentage = false;
    } else {
      this.isReadOnlyPercentage = true;
      this.groupDetailsForm.controls['percentage'].setValue(100);

    }

  }


  getStrAddAutoNo() {
    this.api.getStrAddAutoNo()
      .subscribe({
        next: (res) => {
          this.autoNo = res;
          return res;
        },
        error: (err) => {
          // console.log("fetch fiscalYears data err: ", err);
          // alert("خطا اثناء جلب العناصر !");
        }
      })
  }


  displayItemName(item: any): string {
    return item && item.name ? item.name : '';
  }
  itemSelected(event: MatAutocompleteSelectedEvent): void {
    const item = event.option.value as Item;
    this.selectedItem = item;
    this.groupDetailsForm.patchValue({ itemId: item.id });
    this.groupDetailsForm.patchValue({ itemName: item.name });

    this.api.getAvgPrice(
      this.groupMasterForm.getRawValue().storeId,
      this.groupMasterForm.getRawValue().fiscalYearId,
      formatDate(this.groupMasterForm.getRawValue().date, 'yyyy-MM-dd', this.locale),
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
      this.groupMasterForm.getRawValue().storeId,
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
          alert("خطا اثناء جلب الرصيد الحالى  !");
        }
      })


  }
  private _filterItems(value: string): Item[] {
    const filterValue = value;
    return this.items.filter(item =>
      item.name.toLowerCase().includes(filterValue)
    );
  }
  openAutoTem() {
    this.itemCtrl.setValue(''); // Clear the input field value

    // Open the autocomplete dropdown by triggering the value change event
    this.itemCtrl.updateValueAndValidity();
  }


  displayListName(list: any): string {
    return list && list.name ? list.name : '';
  }
  listSelected(event: MatAutocompleteSelectedEvent): void {
    const list = event.option.value as List;
    this.selectedList = list;
    if (this.sourceSelected.source == "المورد") {
      this.groupMasterForm.patchValue({ sellerId: list.id });
      // this.groupMasterForm.patchValue({ sellerName: list.name });
    }
    else if (this.sourceSelected.source == "الموظف") {
      this.groupMasterForm.patchValue({ employeeId: list.id });
      // this.groupMasterForm.patchValue({ employeeName: list.name });

    } else {
      this.groupMasterForm.patchValue({ sourceStoreId: list.id });
      // this.groupMasterForm.patchValue({ sourceStoreName: list.name });

    }


  }
  private _filterLists(value: string): List[] {
    const filterValue = value;
    return this.lists.filter(list =>
      list.name.toLowerCase().includes(filterValue)
    );
  }
  openAutoList() {
    this.listCtrl.setValue(''); // Clear the input field value

    // Open the autocomplete dropdown by triggering the value change event
    this.listCtrl.updateValueAndValidity();
  }


  displayAddTypeName(addType: any): string {
    return addType && addType.name ? addType.name : '';
  }

  AddTypeSelected(event: MatAutocompleteSelectedEvent): void {
    const addType = event.option.value as AddType;
    this.groupMasterForm.patchValue({ addTypeId: addType.id });
    console.log("addType selected: ", addType);
    this.getListCtrl(addType);

  }

  private _filterAddType(value: string): AddType[] {
    const filterValue = value;
    return this.addTypeList.filter(addType =>
      addType.name.toLowerCase().includes(filterValue)
    );
  }
  openAutoAddType() {
    this.addTypeCtrl.setValue(''); // Clear the input field value

    // Open the autocomplete dropdown by triggering the value change event
    this.addTypeCtrl.updateValueAndValidity();
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

  getListCtrl(type: any) {
    console.log("addType obj: ", type);
    this.sourceSelected = type;

    if (type.source == "المورد") {

      this.api.getAllSellers().subscribe((lists) => {
        this.lists = lists;
        this.groupMasterForm.controls['sourceStoreId'].setValue(null);
        // this.groupMasterForm.controls['sourceStoreName'].setValue(null);
        this.groupMasterForm.controls['employeeId'].setValue(null);
        this.actionName = "choose";

        this.groupMasterForm.controls['entryNo'].enable();

      });
    }
    else if (type.source == "الموظف") {

      this.api.getAllEmployee().subscribe((lists) => {
        this.lists = lists;
        this.groupMasterForm.controls['sourceStoreId'].setValue(null);
        // this.groupMasterForm.controls['sourceStoreName'].setValue(null);
        this.groupMasterForm.controls['sellerId'].setValue(null);
        this.actionName = "emp";
        this.groupMasterForm.controls['entryNo'].disable();


      });
    }

    else {

      this.api.getAllStore().subscribe((lists) => {
        this.lists = lists;
        this.groupMasterForm.controls['sellerId'].setValue(null);
        // this.groupMasterForm.controls['sellerName'].setValue(null);
        this.groupMasterForm.controls['employeeId'].setValue(null);
        this.actionName = "str";
        this.groupMasterForm.controls['entryNo'].disable();
      });
    }


  }


  getStrAddType() {
    this.api.getType()
      .subscribe({
        next: (res) => {
          this.addTypeList = res;
        },
        error: (err) => {
          // console.log("fetch fiscalYears data err: ", err);
          // alert("خطا اثناء جلب العناصر !");
        }
      })
  }

}