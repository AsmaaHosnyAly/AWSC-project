import { Component, OnInit, Inject, ViewChild, LOCALE_ID } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ApiService } from '../services/api.service';
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
  storeSelectedId: any;
  fiscalYearSelectedId: any;

  displayedColumns: string[] = ['itemName', 'price', 'qty', 'total', 'action'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private formBuilder: FormBuilder,
    private api: ApiService,
    @Inject(LOCALE_ID) private locale: string,
    @Inject(MAT_DIALOG_DATA) public editData: any,
    @Inject(MAT_DIALOG_DATA) public editDataDetails: any,
    private http: HttpClient,
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
      this.actionBtnMaster = "Update";
      this.groupMasterForm.controls['no'].setValue(this.editData.no);
      this.groupMasterForm.controls['storeId'].setValue(this.editData.storeId);
      this.groupMasterForm.controls['fiscalYearId'].setValue(this.editData.fiscalYearId);
      this.groupMasterForm.controls['date'].setValue(this.editData.date);
      this.groupMasterForm.controls['total'].setValue(this.editData.total);

      this.groupMasterForm.addControl('id', new FormControl('', Validators.required));
      this.groupMasterForm.controls['id'].setValue(this.editData.id);
    }

    this.getAllDetailsForms();

    this.userIdFromStorage = localStorage.getItem('transactionUserId');
    this.groupMasterForm.controls['transactionUserId'].setValue(this.userIdFromStorage);

  }

  async nextToAddFormDetails() {
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


      // console.log("Master add form : ", this.groupMasterForm.value)
      this.api.postStrOpen(this.groupMasterForm.value)
        .subscribe({
          next: (res) => {
            this.getMasterRowId = {
              "id": res
            };
            this.MasterGroupInfoEntered = true;

            this.toastrSuccess();
            this.getAllDetailsForms();
            this.addDetailsInfo();
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

    if (this.getMasterRowId) {
      this.http.get<any>("http://ims.aswan.gov.eg/api/STROpeningStockDetails/get/all")
        .subscribe(res => {

          this.matchedIds = res.filter((a: any) => {
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

    if (this.getMasterRowId.id) {
      if (this.getMasterRowId.id) {

        if (this.groupDetailsForm.getRawValue().itemId) {

          this.itemName = await this.getItemByID(this.groupDetailsForm.getRawValue().itemId);
          this.groupDetailsForm.controls['itemName'].setValue(this.itemName);
          this.groupDetailsForm.controls['transactionUserId'].setValue(this.userIdFromStorage);
        }

        this.groupDetailsForm.controls['stR_Opening_StockId'].setValue(this.getMasterRowId.id);
        this.groupDetailsForm.controls['total'].setValue((parseFloat(this.groupDetailsForm.getRawValue().price) * parseFloat(this.groupDetailsForm.getRawValue().qty)));

        if (this.groupDetailsForm.valid && !this.getDetailedRowData) {

          this.api.postStrOpenDetails(this.groupDetailsForm.value)
            .subscribe({
              next: (res) => {
                this.toastrSuccess();
                this.groupDetailsForm.reset();
                this.updateDetailsForm()
                this.getAllDetailsForms();
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
    this.groupMasterForm.controls['storeName'].setValue(this.storeName);

    this.groupDetailsForm.controls['itemName'].setValue(this.itemName);

    if (this.editData) {
      this.groupMasterForm.addControl('id', new FormControl('', Validators.required));
      this.groupMasterForm.controls['id'].setValue(this.editData.id);
    }

    this.groupMasterForm.addControl('id', new FormControl('', Validators.required));
    this.groupMasterForm.controls['id'].setValue(this.getMasterRowId.id);

    this.api.putStrOpen(this.groupMasterForm.value)
      .subscribe({
        next: (res) => {
          if (this.groupDetailsForm.value && this.getDetailedRowData) {
            this.api.putStrOpenDetails(this.groupDetailsForm.value, this.getDetailedRowData.id)
              .subscribe({
                next: (res) => {
                  this.toastrSuccess();
                  this.groupDetailsForm.reset();
                  this.getAllDetailsForms();
                  this.getDetailedRowData = '';
                },
                error: (err) => {
                  console.log("update err: ", err)
                  // alert("خطأ أثناء تحديث سجل المجموعة !!")
                }
              })
          }

        },

      })
  }

  updateBothForms() {
    if (this.groupMasterForm.getRawValue().no != '' && this.groupMasterForm.getRawValue().storeId != '' && this.groupMasterForm.getRawValue().fiscalYearId != '' && this.groupMasterForm.getRawValue().date != '') {
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

    if (this.editDataDetails || row) {
      this.getDetailedRowData = row;

      this.actionBtnDetails = "Update";
      this.groupDetailsForm.controls['stR_Opening_StockId'].setValue(this.getDetailedRowData.stR_Opening_StockId);

      this.groupDetailsForm.controls['qty'].setValue(this.getDetailedRowData.qty);
      this.groupDetailsForm.controls['price'].setValue(this.getDetailedRowData.price);

      this.groupDetailsForm.controls['total'].setValue(parseFloat(this.groupDetailsForm.getRawValue().price) * parseFloat(this.groupDetailsForm.getRawValue().qty));

      this.groupDetailsForm.controls['itemId'].setValue(this.getDetailedRowData.itemId);

    }


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

  getStores() {
    this.api.getStore()
      .subscribe({
        next: (res) => {
          this.storeList = res;
        },
        error: (err) => {
          // console.log("fetch store data err: ", err);
          // alert("خطا اثناء جلب المخازن !");
        }
      })
  }

  getStoreByID(id: any) {
    return fetch(`http://ims.aswan.gov.eg/api/STRStore/get/${id}`)
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
          // console.log("fiscalYears res: ", this.fiscalYearsList);
        },
        error: (err) => {
          // console.log("fetch fiscalYears data err: ", err);
          // alert("خطا اثناء جلب العناصر !");
        }
      })
  }

  getFiscalYearsByID(id: any) {
    // console.log("row fiscalYear id: ", id);
    return fetch(`http://ims.aswan.gov.eg/api/STRFiscalYear/get/${id}`)
      .then(response => response.json())
      .then(json => {
        // console.log("fetch fiscalYears name by id res: ", json.fiscalyear);
        return json.fiscalyear;
      })
      .catch((err) => {
        console.log("error in fetch fiscalYears name by id: ", err);
        // alert("خطا اثناء جلب رقم العنصر !");
      });
  }

  itemOnChange(itemEvent: any) {
    // this.isReadOnly = true;

    if (this.groupDetailsForm.getRawValue().price == 0) {
      this.isReadOnly = false;
      // console.log("change readOnly to enable");
    }
    else {
      this.isReadOnly = true;
      // console.log("change readOnly to disable");
    }

    // console.log("itemmm: ", itemEvent)

    this.api.getAvgPrice(
      this.groupMasterForm.getRawValue().storeId,
      this.groupMasterForm.getRawValue().fiscalYearId,
      formatDate(this.groupMasterForm.getRawValue().date, 'yyyy-MM-dd', this.locale),
      itemEvent)

      .subscribe({
        next: (res) => {
          this.groupDetailsForm.controls['price'].setValue(res);
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

    if (this.editData.fiscalYearId) {
      this.getStrOpenAutoNo();
    }
  }
  async fiscalYearValueChanges(fiscalyaerId: any) {
    console.log("fiscalyaer: ", fiscalyaerId)
    this.fiscalYearSelectedId = await fiscalyaerId;
    this.groupMasterForm.controls['fiscalYearId'].setValue(this.fiscalYearSelectedId);
    this.getStrOpenAutoNo();
  }

  getStrOpenAutoNo() {
    console.log("storeId: ", this.storeSelectedId, " fiscalYearId: ", this.fiscalYearSelectedId)
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
      else {
        console.log("change both values in updateHeader");
        this.api.getStrOpenAutoNo(this.groupMasterForm.getRawValue().storeId, this.groupMasterForm.getRawValue().fiscalYearId)
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

    }

  }

  toastrSuccess(): void {
    this.toastr.success("تم الحفظ بنجاح");
  }
  toastrDeleteSuccess(): void {
    this.toastr.success("تم الحذف بنجاح");
  }
}
