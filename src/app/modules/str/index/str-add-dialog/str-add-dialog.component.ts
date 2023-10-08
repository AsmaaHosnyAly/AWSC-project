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

  getAddData: any;
  sourceSelected: any;
  isEdit: boolean = false;

  btnDisabled: boolean = false;

  displayedColumns: string[] = ['itemName', 'avgPrice', 'price', 'qty', 'total', 'action'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  sourceStoreName: any;

  currentDate: any;

  userRoleStoresAcc = PagesEnums.STORES_ACCOUNTS ;

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
  }

  ngOnInit(): void {
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
      // addReceiptId: ['', Validators.required],
      // receiptName: ['', Validators.required],
      // addTypeId: ['', Validators.required],
      // typeName: ['', Validators.required],
      sellerId: [''],
      sellerName: [''],
      employeeId: [''],
      employeeName: [''],
      sourceStoreId: [''],
      sourceStoreName: [''],
      type: [''],
      entryNo: ['0'],

    });

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
      percentage: [''],
      // storeId: ['', Validators.required],
      // date: ['', Validators.required],
      // fiscalYearId: ['', Validators.required],
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

      if (this.editData.employeeId == null && this.editData.sellerId == null) {
        this.actionName = "str";
        console.log("action btnnnnnnnnnnnnn", this.actionName)
        this.groupMasterForm.controls['type'].setValue('المخزن');

      }
      else if (this.editData.sourceStoreId == null && this.editData.sellerId == null) {
        this.actionName = "emp";
        this.groupMasterForm.controls['type'].setValue('الموظف')


      } else {
        this.actionName = "choose";
        this.groupMasterForm.controls['type'].setValue('المورد');
        this.groupMasterForm.controls['entryNo'].setValue(this.editData.entryNo);

      }
      console.log("this.groupMasterForm.getRawValue().type: ", this.groupMasterForm.getRawValue().type);

      this.getListCtrl(this.groupMasterForm.getRawValue().type);

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

    // localStorage.setItem('transactionUserId', JSON.stringify("mehrail"));
    this.userIdFromStorage = localStorage.getItem('transactionUserId');
    console.log("userIdFromStorage in localStorage: ", this.userIdFromStorage)
    // console.log("userIdFromStorage after slice from string shape: ", this.userIdFromStorage?.slice(1, length - 1))
    // this.groupMasterForm.controls['transactionUserId'].setValue(this.userIdFromStorage?.slice(1, length - 1));
    this.groupMasterForm.controls['transactionUserId'].setValue(this.userIdFromStorage);

  }

  addNewDetails() {
    this.router.navigate(['/STRAdd'], { queryParams: { masterId: this.getMasterRowId.id, fiscalYear: this.groupMasterForm.getRawValue().fiscalYearId, store: this.groupMasterForm.getRawValue().storeId, date: this.groupMasterForm.getRawValue().date, sourceStoreName: this.groupMasterForm.getRawValue().type } })
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
    // alert("store name in add: " + this.storeName)
    this.groupMasterForm.controls['storeName'].setValue(this.storeName);

    this.sourceStoreName = await this.getSourceStoreByID(this.groupMasterForm.getRawValue().sourceStoreId);
    // alert("store name in add: " + this.storeName)
    this.groupMasterForm.controls['sourceStoreName'].setValue(this.sourceStoreName);

    this.sellerName = await this.getSellerByID(this.groupMasterForm.getRawValue().sellerId);
    // alert("store name in add: " + this.storeName)
    this.groupMasterForm.controls['sellerName'].setValue(this.sellerName);

    this.employeeName = await this.getEmployeeByID(this.groupMasterForm.getRawValue().employeeId);
    // alert("store name in add: " + this.storeName)
    this.groupMasterForm.controls['employeeName'].setValue(this.employeeName);


    this.groupMasterForm.controls['total'].setValue(this.sumOfTotals);

    this.groupMasterForm.controls['fiscalYearId'].setValue(1)
    console.log("faciaaaaal year add: ", this.groupMasterForm.getRawValue().fiscalYearId)
    // this.currentDate = new Date();
    console.log("dataName: ", this.groupMasterForm.value)

    this.groupMasterForm.controls['no'].setValue(this.autoNo);

    // if (this.groupMasterForm.getRawValue().storeName && this.groupMasterForm.getRawValue().date && this.groupMasterForm.getRawValue().storeId && this.groupMasterForm.getRawValue().no) {

    if (this.groupMasterForm.getRawValue().storeName && this.groupMasterForm.getRawValue().date && this.groupMasterForm.getRawValue().storeId && this.groupMasterForm.getRawValue().no) {
      console.log("Master add form : ", this.groupMasterForm.value)
      this.api.postStrAdd(this.groupMasterForm.value)
        .subscribe({
          next: (res) => {
            console.log("ID header after post req: ", res);
            this.getMasterRowId = {
              "id": res
            };
            console.log("mastered res: ", this.getMasterRowId.id)
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

    // console.log("mastered row get all data: ", this.getMasterRowId)
    if (this.getMasterRowId) {

      if (this.editData) {
        // console.log("check if details belongs to strAdd or strWithdraw: ", this.editData.hasOwnProperty('strWithDrawDetailsGetVM'));

        if (this.editData.hasOwnProperty('strWithDrawDetailsGetVM')) {
          this.btnDisabled = true;
          this.api.getStrWithdrawDetailsByMasterId(this.getMasterRowId.id)
            .subscribe({
              next: (res) => {
                // this.itemsList = res;
                console.log("enter getAllDetails: ", res);
                // if(res[0].includes('strWithDrawDetailsGetVM'))
                this.matchedIds = res[0].strWithDrawDetailsGetVM;

                if (this.matchedIds) {
                  console.log("eeeeeeeeeeeeeeeeeeeeeeeeeeee: ", res[0].strWithDrawDetailsGetVM);
                  this.dataSource = new MatTableDataSource(this.matchedIds);
                  this.dataSource.paginator = this.paginator;
                  this.dataSource.sort = this.sort;

                  this.sumOfTotals = 0;
                  for (let i = 0; i < this.matchedIds.length; i++) {
                    this.sumOfTotals = this.sumOfTotals + parseFloat(this.matchedIds[i].total);
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
                // this.itemsList = res;
                console.log("enter getAllDetails: ", res);
                // if(res[0].includes('strWithDrawDetailsGetVM'))
                this.matchedIds = res[0].strAddDetailsGetVM;

                if (this.matchedIds) {
                  console.log("eeeeeeeeeeeeeeeeeeeeeeeeeeee: ", res[0].strAddDetailsGetVM);
                  this.dataSource = new MatTableDataSource(this.matchedIds);
                  this.dataSource.paginator = this.paginator;
                  this.dataSource.sort = this.sort;

                  this.sumOfTotals = 0;
                  for (let i = 0; i < this.matchedIds.length; i++) {
                    this.sumOfTotals = this.sumOfTotals + parseFloat(this.matchedIds[i].total);
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
              // this.itemsList = res;
              console.log("enter getAllDetails: ", res);
              // if(res[0].includes('strWithDrawDetailsGetVM'))
              this.matchedIds = res[0].strAddDetailsGetVM;

              if (this.matchedIds) {
                console.log("eeeeeeeeeeeeeeeeeeeeeeeeeeee: ", res[0].strAddDetailsGetVM);
                this.dataSource = new MatTableDataSource(this.matchedIds);
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;

                this.sumOfTotals = 0;
                for (let i = 0; i < this.matchedIds.length; i++) {
                  this.sumOfTotals = this.sumOfTotals + parseFloat(this.matchedIds[i].total);
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
    console.log("nnnvvvvvvvvvv: ", this.groupMasterForm.value);

    this.groupDetailsForm.controls['transactionUserId'].setValue(this.userIdFromStorage);

    console.log("update both: ", this.groupDetailsForm.valid, "ooo:", !this.getDetailedRowData);
    console.log("edit : ", this.groupDetailsForm.value)
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
    console.log("check id for insert: ", this.getDetailedRowData, "edit data form: ", this.editData, "main id: ", this.getMasterRowId.id);
    if (this.isEdit == false) {
      this.groupMasterForm.controls['no'].setValue(this.autoNo);
    }

    if (this.getMasterRowId.id) {
      if (this.getMasterRowId.id) {
        console.log("form  headerId: ", this.getMasterRowId.id)

        if (this.groupDetailsForm.getRawValue().itemId) {
          this.itemName = await this.getItemByID(this.groupDetailsForm.getRawValue().itemId);
          this.groupDetailsForm.controls['itemName'].setValue(this.itemName);
          // this.groupDetailsForm.controls['transactionUserId'].setValue(this.userIdFromStorage?.slice(1, length - 1));
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



        console.log("form details after item: ", this.groupDetailsForm.value, "DetailedRowData: ", !this.getDetailedRowData)
        console.log("master form valuessss: ", this.groupMasterForm.value)


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
                alert("تمت إضافة المجموعة بنجاح");
                this.groupDetailsForm.reset();
                this.groupDetailsForm.controls['qty'].setValue(1);
                this.updateDetailsForm()
                this.getAllDetailsForms();

                console.log("form details after remove controllers: ", this.groupDetailsForm.value)

                // this.dialogRef.close('save');
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
    // alert("storeId: "+this.groupMasterForm.getRawValue().storeId)
    this.storeName = await this.getStoreByID(this.groupMasterForm.getRawValue().storeId);
    // alert("update Store name: " + this.storeName)
    this.groupMasterForm.controls['storeName'].setValue(this.storeName);

    this.sourceStoreName = await this.getSourceStoreByID(this.groupMasterForm.getRawValue().sourceStoreId);
    // alert("update sourceStoreName name: " + this.sourceStoreName)
    this.groupMasterForm.controls['sourceStoreName'].setValue(this.sourceStoreName);

    this.employeeName = await this.getEmployeeByID(this.groupMasterForm.getRawValue().employeeId);
    // alert("update employeeName name: " + this.employeeName)
    this.groupMasterForm.controls['employeeName'].setValue(this.employeeName);

    this.sellerName = await this.getSellerByID(this.groupMasterForm.getRawValue().sellerId);
    // alert("update sellerName name: " + this.sellerName)
    this.groupMasterForm.controls['sellerName'].setValue(this.sellerName);
    // console.log("data storeName in edit: ", this.groupMasterForm.value)

    this.groupDetailsForm.controls['itemName'].setValue(this.itemName);

    console.log("values master form: ", this.groupMasterForm.value)
    console.log("values getMasterRowId: ", this.getMasterRowId)
    console.log("values details form: ", this.groupDetailsForm.value)

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
      console.log("details foorm: ", this.groupDetailsForm.value)

    }


    this.groupMasterForm.addControl('id', new FormControl('', Validators.required));
    this.groupMasterForm.controls['id'].setValue(this.getMasterRowId.id);
    // this.groupMasterForm.controls['addId'].setValue(this.getMasterRowId.id);
    console.log("data item Name in edit without id: ", this.groupMasterForm.value)
    this.isEdit = false;

    console.log("details before put foorm: ", this.groupDetailsForm.value)

    this.api.putStrAdd(this.groupMasterForm.value)
      .subscribe({
        next: (res) => {
          // alert("تم الحفظ بنجاح");
          console.log("update res: ", res, "details form values: ", this.groupDetailsForm.value, "details id: ", this.getDetailedRowData);
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
    // if (this.groupMasterForm.getRawValue().no != '' && this.groupMasterForm.getRawValue().storeId != '' && this.groupMasterForm.getRawValue().fiscalYearId != '' && this.groupMasterForm.getRawValue().date != ''
    //   && this.groupMasterForm.getRawValue().addTypeId != '' && this.groupMasterForm.getRawValue().sellerId != '' && this.groupMasterForm.getRawValue().employeeId != '' && this.groupMasterForm.getRawValue().addTypeId != '' && this.groupMasterForm.getRawValue().addReceiptId != '') {
    if (!this.autoNo) {
      this.autoNo = this.editData.no;
    }
    // }

    this.groupDetailsForm.controls['addId'].setValue(this.getMasterRowId.id);
    this.groupDetailsForm.controls['total'].setValue(parseFloat(this.groupDetailsForm.getRawValue().price) * parseFloat(this.groupDetailsForm.getRawValue().qty));

    console.log("master edit form2: ", this.groupMasterForm.value);
    this.updateDetailsForm();

  }

  editDetailsForm(row: any) {


    this.router.navigate(['/STRAdd'], { queryParams: { masterId: this.getMasterRowId.id, fiscalYear: this.groupMasterForm.getRawValue().fiscalYearId, store: this.groupMasterForm.getRawValue().storeId, date: this.groupMasterForm.getRawValue().date, sourceStoreName: this.groupMasterForm.getRawValue().type, } })
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
  getTypes() {
    this.api.getType()
      .subscribe({
        next: (res) => {
          this.typeList = res;
          // console.log("store res: ", this.storeList);
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
          // console.log("store res: ", this.storeList);
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
          // console.log("store res: ", this.storeList);
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
          // console.log("store res: ", this.storeList);
        },
        error: (err) => {
          // console.log("fetch store data err: ", err);
          // alert("خطا اثناء جلب المخازن !");
        }
      })
  }

  getStoreByID(id: any) {
    console.log("row stoooo id: ", id);
    return fetch(this.api.getStoreById(id))
      .then(response => response.json())
      .then(json => {
        console.log("fetch name by id res: ", json.name);
        return json.name;
      })
      .catch((err) => {
        // console.log("error in fetch name by id: ", err);
        // alert("خطا اثناء جلب رقم المخزن !");
      });
  }
  getEmployeeByID(id: any) {
    console.log("row store id: ", id);
    return fetch(this.api.getHrEmployeeById(id))
      .then(response => response.json())
      .then(json => {
        console.log("fetch name by id res: ", json.name);
        return json.name;
      })
      .catch((err) => {
        // console.log("error in fetch name by id: ", err);
        // alert("خطا اثناء جلب رقم المخزن !");
      });
  }

  getTypeByID(id: any) {
    console.log("row type id: ", id);
    return fetch(this.api.getTypeById(id))
      .then(response => response.json())
      .then(json => {
        console.log("fetch name by id res: ", json.type);
        return json.type;
      })
      .catch((err) => {
        // console.log("error in fetch name by id: ", err);
        // alert("خطا اثناء جلب رقم المخزن !");
      });
  }
  getReceiptByID(id: any) {
    console.log("row rece id: ", id);
    return fetch(this.api.getRecieptById(id))
      .then(response => response.json())
      .then(json => {
        console.log("fetch rece name by id res: ", json.addReceipts);
        return json.addReceipts;
      })
      .catch((err) => {
        // console.log("error in fetch name by id: ", err);
        // alert("خطا اثناء جلب رقم المخزن !");
      });
  }
  getSellerByID(id: any) {
    console.log("row seller id: ", id);
    return fetch(this.api.getSellerById(id))
      .then(response => response.json())
      .then(json => {
        console.log("fetch name by id res: ", json.name);
        return json.name;
      })
      .catch((err) => {
        // console.log("error in fetch name by id: ", err);
        // alert("خطا اثناء جلب رقم المخزن !");
      });
  }
  getSourceStoreByID(id: any) {
    console.log("row sourcestore id: ", id);
    return fetch(this.api.getStoreById(id))
      .then(response => response.json())
      .then(json => {
        console.log("fetch name by id res: ", json.name);
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
          // console.log("items res: ", this.itemsList);
        },
        error: (err) => {
          // console.log("fetch items data err: ", err);
          // alert("خطا اثناء جلب العناصر !");
        }
      })
  }

  getItemByID(id: any) {
    console.log("row item id: ", id);
    return fetch(this.api.getItemById(id))
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

  getItemByCode(code: any) {
    if (code.keyCode == 13) {
      console.log("code: ", code.target.value);

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
        },
        error: (err) => {
          // console.log("fetch fiscalYears data err: ", err);
          // alert("خطا اثناء جلب العناصر !");
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
        console.log("change fiscalYearId only in updateHeader");
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
        console.log("change both in edit data: ", this.isEdit);

        this.api.getStrOpenAutoNo(this.groupMasterForm.getRawValue().storeId, this.groupMasterForm.getRawValue().fiscalYearId)
          .subscribe({
            next: (res) => {
              this.autoNo = res;
              // this.editData = null;
              console.log("isEdit : ", this.isEdit)
              // this.groupMasterForm.controls['no'].setValue(666);
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
        console.log("change both values in updateHeader", this.groupMasterForm.getRawValue().storeId);
        this.api.getStrOpenAutoNo(this.groupMasterForm.getRawValue().storeId, this.groupMasterForm.getRawValue().fiscalYearId)
          .subscribe({
            next: (res) => {
              this.autoNo = res;
              // this.editData.no = res
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
    const filterValue = value.toLowerCase();
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
    if (this.sourceSelected === "المورد") {
      this.groupMasterForm.patchValue({ sellerId: list.id });
      this.groupMasterForm.patchValue({ sellerName: list.name });


    }
    else if (this.sourceSelected === "الموظف") {
      this.groupMasterForm.patchValue({ employeeId: list.id });
      this.groupMasterForm.patchValue({ employeeName: list.name });

    } else {
      this.groupMasterForm.patchValue({ sourceStoreId: list.id });
      this.groupMasterForm.patchValue({ sourceStoreName: list.name });

    }


  }

  private _filterLists(value: string): List[] {
    const filterValue = value.toLowerCase();
    return this.lists.filter(list =>
      list.name.toLowerCase().includes(filterValue)
    );
  }



  openAutoList() {
    this.listCtrl.setValue(''); // Clear the input field value

    // Open the autocomplete dropdown by triggering the value change event
    this.listCtrl.updateValueAndValidity();
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
    this.sourceSelected = type;

    if (type === "المورد") {

      this.api.getAllSellers().subscribe((lists) => {
        this.lists = lists;
        console.log("rrr: ", lists)
        this.groupMasterForm.controls['sourceStoreId'].setValue(null);
        this.groupMasterForm.controls['employeeId'].setValue(null);
        // this.isReadOnlyEmployee = false;
        this.actionName = "choose";

        this.groupMasterForm.controls['entryNo'].enable();

      });
    }
    else if (type === "الموظف") {

      this.api.getAllEmployee().subscribe((lists) => {
        this.lists = lists;
        this.groupMasterForm.controls['sourceStoreId'].setValue(null);
        this.groupMasterForm.controls['sellerId'].setValue(null);
        // this.isReadOnlyEmployee = true;
        this.actionName = "emp";
        this.groupMasterForm.controls['entryNo'].disable();


      });
    }

    else {

      this.api.getAllStore().subscribe((lists) => {
        this.lists = lists;
        this.groupMasterForm.controls['sellerId'].setValue(null);
        this.groupMasterForm.controls['employeeId'].setValue(null);
        // this.isReadOnlyEmployee = true;
        this.actionName = "str";
        this.groupMasterForm.controls['entryNo'].disable();




      });
    }


  }



}