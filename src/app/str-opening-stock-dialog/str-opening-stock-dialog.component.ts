import { Component, OnInit, Inject, ViewChild, LOCALE_ID } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ApiService } from '../services/api.service';
// import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { formatDate } from '@angular/common';

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
  itemsList: any;
  fiscalYearsList: any;
  storeName: any;
  itemName: any;
  userIdFromStorage: any;
  deleteConfirmBtn: any;
  dialogRefDelete: any;
  isReadOnly: boolean = true;
  autoNo: any;

  displayedColumns: string[] = ['itemName', 'price', 'qty', 'total', 'action'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private formBuilder: FormBuilder,
    private api: ApiService,
    @Inject(LOCALE_ID) private locale: string,
    @Inject(MAT_DIALOG_DATA) public editData: any,
    @Inject(MAT_DIALOG_DATA) public editDataDetails: any,
    private http: HttpClient,
    // private toastr: ToastrService,
    private dialog: MatDialog,
    private toastr: ToastrService) { }


  ngOnInit(): void {
    this.getStores();
    this.getItems();
    this.getFiscalYears();
    this.getStrOpenAutoNo();

    this.getMasterRowId = this.editData;

    this.groupMasterForm = this.formBuilder.group({
      no: ['', Validators.required],
      storeId: ['', Validators.required],
      storeName: ['', Validators.required],
      transactionUserId: ['', Validators.required],
      date: ['', Validators.required],
      total: ['', Validators.required],
      fiscalYearId: ['', Validators.required],
    });

    this.groupDetailsForm = this.formBuilder.group({
      stR_Opening_StockId: ['', Validators.required], //MasterId
      qty: ['', Validators.required],
      price: ['', Validators.required],
      total: ['', Validators.required],
      transactionUserId: ['', Validators.required],
      itemId: ['', Validators.required],
      itemName: ['', Validators.required],
    });



    if (this.editData) {
      // console.log("master edit form: ", this.editData);
      this.actionBtnMaster = "Update";
      // this.groupMasterForm.controls['no'].setValue(this.editData.no);
      this.groupMasterForm.controls['no'].setValue(this.editData.no);
      this.groupMasterForm.controls['storeId'].setValue(this.editData.storeId);
      // alert("facialId before: "+ this.editData.fiscalYearId)
      this.groupMasterForm.controls['fiscalYearId'].setValue(this.editData.fiscalYearId);
      // console.log("faciaaaaal year edit: ", this.groupMasterForm.getRawValue().fiscalYearId)
      // alert("facialId after: "+ this.groupMasterForm.getRawValue().fiscalYearId)
      this.groupMasterForm.controls['date'].setValue(this.editData.date);
      this.groupMasterForm.controls['total'].setValue(this.editData.total);

      this.groupMasterForm.addControl('id', new FormControl('', Validators.required));
      this.groupMasterForm.controls['id'].setValue(this.editData.id);
    }

    this.getAllDetailsForms();

    // localStorage.setItem('transactionUserId', JSON.stringify("mehrail"));
    this.userIdFromStorage = localStorage.getItem('transactionUserId');
    // console.log("userIdFromStorage in localStorage: ", this.userIdFromStorage)
    // console.log("userIdFromStorage after slice from string shape: ", this.userIdFromStorage?.slice(1, length - 1))
    // this.groupMasterForm.controls['transactionUserId'].setValue(this.userIdFromStorage?.slice(1, length - 1));
    this.groupMasterForm.controls['transactionUserId'].setValue(this.userIdFromStorage);

  }

  async nextToAddFormDetails() {
    this.groupMasterForm.removeControl('id')

    this.storeName = await this.getStoreByID(this.groupMasterForm.getRawValue().storeId);
    // alert("store name in add: " + this.storeName)
    this.groupMasterForm.controls['storeName'].setValue(this.storeName);
    this.groupMasterForm.controls['total'].setValue(this.sumOfTotals);
    this.groupMasterForm.controls['no'].setValue(this.autoNo);

    // this.groupMasterForm.controls['fiscalYearId'].setValue(1)
    // console.log("faciaaaaal year add: ", this.groupMasterForm.getRawValue().fiscalYearId)
    // console.log("dataName: ", this.groupMasterForm.value)

    if (this.groupMasterForm.getRawValue().storeName && this.groupMasterForm.getRawValue().date && this.groupMasterForm.getRawValue().storeId && this.groupMasterForm.getRawValue().no) {


      console.log("Master add form : ", this.groupMasterForm.value)
      this.api.postStrOpen(this.groupMasterForm.value)
        .subscribe({
          next: (res) => {
            // console.log("ID header after post req: ", res);
            this.getMasterRowId = {
              "id": res
            };
            // console.log("mastered res: ", this.getMasterRowId.id)
            this.MasterGroupInfoEntered = true;

            // alert("تم الحفظ بنجاح");
            this.toastrSuccess();
            this.getAllDetailsForms();
            // this.updateDetailsForm();
            this.addDetailsInfo();
          },
          error: (err) => {
            // console.log("header post err: ", err);
            // alert("حدث خطأ أثناء إضافة مجموعة")
          }
        })
    }
    // else {
    //   alert("تاكد من ادخال البيانات صحيحة")
    // }
  }

  getAllDetailsForms() {

    // console.log("mastered row get all data: ", this.getMasterRowId)
    if (this.getMasterRowId) {
      this.http.get<any>("http://ims.aswan.gov.eg/api/STROpeningStockDetails/get/all")
        .subscribe(res => {
          // console.log("res to get all details form: ", res, "masterRowId: ", this.getMasterRowId.id);

          this.matchedIds = res.filter((a: any) => {
            // console.log("matchedIds: ", a.stR_Opening_StockId == this.getMasterRowId.id, "res: ", this.matchedIds)
            return a.stR_Opening_StockId == this.getMasterRowId.id
          })

          if (this.matchedIds) {

            this.dataSource = new MatTableDataSource(this.matchedIds);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;

            this.sumOfTotals = 0;
            for (let i = 0; i < this.matchedIds.length; i++) {
              this.sumOfTotals = this.sumOfTotals + parseFloat(this.matchedIds[i].total);
              this.groupMasterForm.controls['total'].setValue(this.sumOfTotals);
              this.updateBothForms();
            }

          }
        }
          , err => {
            alert("حدث خطا ما !!")
          }
        )
    }


  }
  async addDetailsInfo() {
    // console.log("check id for insert: ", this.getDetailedRowData, "edit data form: ", this.editData, "main id: ", this.getMasterRowId.id);

    if (this.getMasterRowId.id) {
      if (this.getMasterRowId.id) {
        // console.log("form  headerId: ", this.getMasterRowId.id)

        if (this.groupDetailsForm.getRawValue().itemId) {
          // this.getAvgPrice(
          //   this.groupMasterForm.getRawValue().storeId,
          //   this.groupMasterForm.getRawValue().fiscalYearId,
          //   formatDate(this.groupMasterForm.getRawValue().date, 'yyyy-MM-dd', this.locale),
          //   this.groupDetailsForm.getRawValue().itemId)

          this.itemName = await this.getItemByID(this.groupDetailsForm.getRawValue().itemId);
          this.groupDetailsForm.controls['itemName'].setValue(this.itemName);
          // this.groupDetailsForm.controls['price'].setValue(this.priceCalled);
          // this.groupDetailsForm.controls['transactionUserId'].setValue(this.userIdFromStorage?.slice(1, length - 1));
          this.groupDetailsForm.controls['transactionUserId'].setValue(this.userIdFromStorage);
        }

        this.groupDetailsForm.controls['stR_Opening_StockId'].setValue(this.getMasterRowId.id);
        this.groupDetailsForm.controls['total'].setValue((parseFloat(this.groupDetailsForm.getRawValue().price) * parseFloat(this.groupDetailsForm.getRawValue().qty)));

        // console.log("form details after item: ", this.groupDetailsForm.value, "DetailedRowData: ", !this.getDetailedRowData)


        if (this.groupDetailsForm.valid && !this.getDetailedRowData) {

          this.api.postStrOpenDetails(this.groupDetailsForm.value)
            .subscribe({
              next: (res) => {
                // alert("تمت إضافة المجموعة بنجاح");
                this.toastrSuccess();
                this.groupDetailsForm.reset();
                this.updateDetailsForm()
                this.getAllDetailsForms();
                // this.dialogRef.close('save');
              },
              error: () => {
                // alert("حدث خطأ أثناء إضافة مجموعة")
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
    // alert("update Store name: " + this.storeName)
    this.groupMasterForm.controls['storeName'].setValue(this.storeName);
    // console.log("data storeName in edit: ", this.groupMasterForm.value)

    this.groupDetailsForm.controls['itemName'].setValue(this.itemName);

    // console.log("values master form: ", this.groupMasterForm.value)
    // console.log("values getMasterRowId: ", this.getMasterRowId)
    // console.log("values details form: ", this.groupDetailsForm.value)

    if (this.editData) {
      this.groupMasterForm.addControl('id', new FormControl('', Validators.required));
      this.groupMasterForm.controls['id'].setValue(this.editData.id);
      // console.log("data item Name in edit: ", this.groupMasterForm.value)
    }

    this.groupMasterForm.addControl('id', new FormControl('', Validators.required));
    this.groupMasterForm.controls['id'].setValue(this.getMasterRowId.id);
    // this.groupMasterForm.controls['stR_Opening_StockId'].setValue(this.getMasterRowId.id);
    // console.log("data item Name in edit without id: ", this.groupMasterForm.value)

    this.api.putStrOpen(this.groupMasterForm.value)
      .subscribe({
        next: (res) => {
          // alert("تم الحفظ بنجاح");
          // console.log("update res: ", res, "details form values: ", this.groupDetailsForm.value, "details id: ", this.getDetailedRowData);
          if (this.groupDetailsForm.value && this.getDetailedRowData) {
            this.api.putStrOpenDetails(this.groupDetailsForm.value, this.getDetailedRowData.id)
              .subscribe({
                next: (res) => {
                  // alert("تم الحفظ بنجاح");
                  this.toastrSuccess();
                  // console.log("update res: ", res);
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
        // error: () => {
        //   alert("خطأ أثناء تحديث سجل الصنف !!")
        // }
      })
  }

  updateBothForms() {
    // console.log("pass id: ", this.getMasterRowId.id, "pass No: ", this.groupMasterForm.getRawValue().no, "pass StoreId: ", this.groupMasterForm.getRawValue().storeId, "pass Date: ", this.groupMasterForm.getRawValue().date)
    if (this.groupMasterForm.getRawValue().no != '' && this.groupMasterForm.getRawValue().storeId != '' && this.groupMasterForm.getRawValue().fiscalYearId != '' && this.groupMasterForm.getRawValue().date != '') {

      // this.getAvgPrice(
      //   this.groupMasterForm.getRawValue().storeId,
      //   this.groupMasterForm.getRawValue().fiscalYearId,
      //   formatDate(this.groupMasterForm.getRawValue().date, 'yyyy-MM-dd', this.locale),
      //   this.groupDetailsForm.getRawValue().itemId)


      console.log("details form new: ", this.groupDetailsForm.value, "getDetailedRowData: ", this.getDetailedRowData)
      // alert("price: " + this.groupDetailsForm.getRawValue().price)
      // this.groupDetailsForm.controls['price'].setValue(5);
      // alert("price after: " + this.groupDetailsForm.getRawValue().price)

      console.log("change readOnly to enable");


      this.groupDetailsForm.controls['stR_Opening_StockId'].setValue(this.getMasterRowId.id);
      this.groupDetailsForm.controls['total'].setValue(parseFloat(this.groupDetailsForm.getRawValue().price) * parseFloat(this.groupDetailsForm.getRawValue().qty));

      this.updateDetailsForm();
    }
    // else {
    //   alert("تاكد من ادخال البيانات صحيحة")
    // }

  }

  editDetailsForm(row: any) {

    // console.log("test pass row: ", row)
    if (this.editDataDetails || row) {
      this.getDetailedRowData = row;

      this.actionBtnDetails = "Update";
      this.groupDetailsForm.controls['stR_Opening_StockId'].setValue(this.getDetailedRowData.stR_Opening_StockId);

      this.groupDetailsForm.controls['qty'].setValue(this.getDetailedRowData.qty);
      this.groupDetailsForm.controls['price'].setValue(this.getDetailedRowData.price);
      // alert("price in edit: " + this.groupDetailsForm.getRawValue().price)

      this.groupDetailsForm.controls['total'].setValue(parseFloat(this.groupDetailsForm.getRawValue().price) * parseFloat(this.groupDetailsForm.getRawValue().qty));

      // console.log("itemid focus: ", this.matchedIds);

      this.groupDetailsForm.controls['itemId'].setValue(this.getDetailedRowData.itemId);
      // this.getAvgPrice();

    }


  }

  deleteFormDetails(id: number) {
    var result = confirm("هل ترغب بتاكيد الحذف ؟");
    if (result) {
      this.api.deleteStrOpenDetails(id)
        .subscribe({
          next: (res) => {
            // alert("تم الحذف بنجاح");
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
    this.api.getStrOpen()
      .subscribe({
        next: (res) => {
          // console.log("response of get all getStrOpen from api: ", res);
          this.dataSource = new MatTableDataSource(res);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        },
        error: () => {
          // alert("خطأ أثناء جلب سجلات المجموعة !!");
        }
      })
  }

  getStores() {
    this.api.getStore()
      .subscribe({
        next: (res) => {
          this.storeList = res;
          // console.log("store res: ", this.storeList);
        },
        error: (err) => {
          // console.log("fetch store data err: ", err);
          // alert("خطا اثناء جلب المخازن !");
        }
      })
  }

  getStoreByID(id: any) {
    // console.log("row store id: ", id);
    return fetch(`http://ims.aswan.gov.eg/api/STRStore/get/${id}`)
      .then(response => response.json())
      .then(json => {
        // console.log("fetch name by id res: ", json.name);
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
    // console.log("row item id: ", id);
    return fetch(`http://ims.aswan.gov.eg/api/STRItem/get/${id}`)
      .then(response => response.json())
      .then(json => {
        // console.log("fetch item name by id res: ", json.name);
        return json.name;
      })
      .catch((err) => {
        // console.log("error in fetch item name by id: ", err);
        // alert("خطا اثناء جلب رقم العنصر !");
      });
  }

  getItemByCode(code: any) {
    if (code.keyCode == 13) {
      // console.log("code: ", code.target.value);

      this.itemsList.filter((a: any) => {
        if (a.fullCode === code.target.value) {
          this.groupDetailsForm.controls['itemId'].setValue(a.id);

          this.itemOnChange(this.groupDetailsForm.getRawValue().itemId)
        }
      })
    }


  }

  getFiscalYears() {
    this.api.getFiscalYears()
      .subscribe({
        next: (res) => {
          this.fiscalYearsList = res;
          console.log("fiscalYears res: ", this.fiscalYearsList);
        },
        error: (err) => {
          // console.log("fetch fiscalYears data err: ", err);
          // alert("خطا اثناء جلب العناصر !");
        }
      })
  }

  getFiscalYearsByID(id: any) {
    console.log("row fiscalYear id: ", id);
    return fetch(`http://ims.aswan.gov.eg/api/STRFiscalYear/get/${id}`)
      .then(response => response.json())
      .then(json => {
        console.log("fetch fiscalYears name by id res: ", json.fiscalyear);
        return json.fiscalyear;
      })
      .catch((err) => {
        console.log("error in fetch fiscalYears name by id: ", err);
        // alert("خطا اثناء جلب رقم العنصر !");
      });
  }

  itemOnChange(itemEvent: any) {
    // this.isReadOnly = true;
    console.log("itemId: ", itemEvent)

    if (this.groupDetailsForm.getRawValue().price == 0) {
      this.isReadOnly = false;
      console.log("change readOnly to enable");
    }
    else {
      this.isReadOnly = true;
      console.log("change readOnly to disable");
    }

    this.getAvgPrice(
      this.groupMasterForm.getRawValue().storeId,
      this.groupMasterForm.getRawValue().fiscalYearId,
      formatDate(this.groupMasterForm.getRawValue().date, 'yyyy-MM-dd', this.locale),
      itemEvent)


  }

  getAvgPrice(storeId: any, fiscalYear: any, date: any, itemId: any) {
    console.log("Avg get inputs: ", "storeId: ", this.groupMasterForm.getRawValue().storeId,
      " fiscalYear: ", this.groupMasterForm.getRawValue().fiscalYearId,
      " date: ", formatDate(this.groupMasterForm.getRawValue().date, 'yyyy-MM-dd', this.locale),
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
          alert("خطا اثناء جلب متوسط السعر !");
        }
      })
  }

  getStrOpenAutoNo() {
    this.api.getStrOpenAutoNo()
      .subscribe({
        next: (res) => {
          this.autoNo = res;
          console.log("AutoNum res: ", res);
          return res;

        },
        error: (err) => {
          // console.log("fetch fiscalYears data err: ", err);
          // alert("خطا اثناء جلب العناصر !");
        }
      })
  }

  toastrSuccess(): void {
    this.toastr.success("تم الحفظ بنجاح");
  }
  toastrDeleteSuccess(): void {
    this.toastr.success("تم الحذف بنجاح");
  }
}
