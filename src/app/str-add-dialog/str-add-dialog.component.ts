import { Component, OnInit, Inject, ViewChild, LOCALE_ID } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ApiService } from '../services/api.service';
// import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { HttpClient } from '@angular/common/http';
// import { ToastrService } from 'ngx-toastr';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { formatDate } from '@angular/common';

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
  typeName: any;
  sellerName: any;
  receiptName: any;
  employeeName: any;
  userIdFromStorage: any;
  deleteConfirmBtn: any;
  dialogRefDelete: any;
  isReadOnly: any = false;
  isReadOnlyEmployee: any = false;
  autoNo: any;

  displayedColumns: string[] = ['itemName', 'state', 'price', 'qty', 'total', 'action'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  sourceStoreName: any;

  constructor(private formBuilder: FormBuilder,
    private api: ApiService,
    @Inject(MAT_DIALOG_DATA) public editData: any,
    @Inject(MAT_DIALOG_DATA) public editDataDetails: any,
    private http: HttpClient,
    // private toastr: ToastrService,
    private dialog: MatDialog,
    @Inject(LOCALE_ID) private locale: string) { }
  ngOnInit(): void {
    this.getStores();
    this.getItems();
    this.getTypes();
    this.getSellers();
    this.getReciepts();
    this.getEmployees();
    this.getStrAddAutoNo();


    this.getFiscalYears();
    // console.log("next btn: ", this.editDataDetails, "edit data: ", this.editData);

    this.getMasterRowId = this.editData;

    this.groupMasterForm = this.formBuilder.group({
      no: ['', Validators.required],
      storeId: ['', Validators.required],
      storeName: ['', Validators.required],
      transactionUserId: ['', Validators.required],
      date: ['', Validators.required],
      total: ['', Validators.required],
      fiscalYearId: ['', Validators.required],
      addReceiptId: ['', Validators.required],
      receiptName: ['', Validators.required],
      addTypeId: ['', Validators.required],
      typeName: ['', Validators.required],
      sellerId: [''],
      sellerName: [''],
      employeeId: [''],
      employeeName: [''],
      sourceStoreId: [''],
      sourceStoreName: [''],

    });

    this.groupDetailsForm = this.formBuilder.group({
      addId: ['', Validators.required], //MasterId
      qty: ['', Validators.required],
      price: ['', Validators.required],
      total: ['', Validators.required],
      transactionUserId: ['', Validators.required],
      itemId: ['', Validators.required],
      // productId: ['', Validators.required],
      itemName: ['', Validators.required],
      avgPrice: ['', Validators.required],
      balanceQty: ['', Validators.required],
      percentage: ['', Validators.required],
      // storeId: ['', Validators.required],
      // date: ['', Validators.required],
      // fiscalYearId: ['', Validators.required],
      state: ['', Validators.required],


    });



    if (this.editData) {
      console.log("master edit form: ", this.editData);
      this.actionBtnMaster = "Update";
      this.groupMasterForm.controls['no'].setValue(this.editData.no);
      this.groupMasterForm.controls['storeId'].setValue(this.editData.storeId);
      // alert("facialId before: "+ this.editData.fiscalYearId)
      this.groupMasterForm.controls['fiscalYearId'].setValue(this.editData.fiscalYearId);
      // console.log("faciaaaaal year edit: ", this.groupMasterForm.getRawValue().fiscalYearId)
      // alert("facialId after: "+ this.groupMasterForm.getRawValue().fiscalYearId)
      this.groupMasterForm.controls['date'].setValue(this.editData.date);
      this.groupMasterForm.controls['total'].setValue(this.editData.total);
      this.groupMasterForm.controls['addTypeId'].setValue(this.editData.addTypeId);
      this.groupMasterForm.controls['addReceiptId'].setValue(this.editData.addReceiptId);
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

    this.receiptName = await this.getReceiptByID(this.groupMasterForm.getRawValue().addReceiptId);
    // alert("store name in add: " + this.storeName)
    this.groupMasterForm.controls['receiptName'].setValue(this.receiptName);

    this.typeName = await this.getTypeByID(this.groupMasterForm.getRawValue().addTypeId);
    // alert("store name in add: " + this.storeName)
    this.groupMasterForm.controls['typeName'].setValue(this.typeName);
    this.groupMasterForm.controls['total'].setValue(this.sumOfTotals);

    this.groupMasterForm.controls['fiscalYearId'].setValue(1)
    console.log("faciaaaaal year add: ", this.groupMasterForm.getRawValue().fiscalYearId)
    console.log("dataName: ", this.groupMasterForm.value)

    if (this.groupMasterForm.getRawValue().no) {
      console.log("no changed: ", this.groupMasterForm.getRawValue().no)
    }
    else{
      this.groupMasterForm.controls['no'].setValue(this.autoNo);
      console.log("no took auto number: ", this.groupMasterForm.getRawValue().no)
    }

    if (this.groupMasterForm.getRawValue().storeName && this.groupMasterForm.getRawValue().date && this.groupMasterForm.getRawValue().storeId && this.groupMasterForm.getRawValue().no && this.groupMasterForm.getRawValue().addTypeId
      && this.groupMasterForm.getRawValue().receiptName && this.groupMasterForm.getRawValue().typeName && this.groupMasterForm.getRawValue().receiptName) {


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

            alert("تم الحفظ بنجاح");
            this.getAllDetailsForms();
            // this.updateDetailsForm();
            // this.addDetailsInfo();
          },
          error: (err) => {
            console.log("header post err: ", err);
            alert("حدث خطأ أثناء إضافة مجموعة")
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

      // if(this.groupMasterForm.getRawValue().employeeId || this.groupMasterForm.getRawValue().sourceStoreId){
      //   this.isReadOnlyEmployee = false;
      // }
      // else{
      //   this.isReadOnlyEmployee = true;
      // }

      this.http.get<any>("http://ims.aswan.gov.eg/api/STRAddDetails/get/all")
        .subscribe(res => {
          console.log("res to get all details form: ", res, "masterRowId: ", this.getMasterRowId.id);

          this.matchedIds = res.filter((a: any) => {
            console.log("matchedIds: ", a.addId == this.getMasterRowId.id, "res: ", this.matchedIds)
            return a.addId == this.getMasterRowId.id
          })

          if (this.matchedIds) {

            this.dataSource = new MatTableDataSource(this.matchedIds);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;

            this.sumOfTotals = 0;
            for (let i = 0; i < this.matchedIds.length; i++) {
              this.sumOfTotals = this.sumOfTotals + parseFloat(this.matchedIds[i].total);
              
            }
            this.groupMasterForm.controls['total'].setValue(this.sumOfTotals);
              this.updateBothForms();

          }
        }
          , err => {
            alert("حدث خطا ما !!")
          }
        )
    }


  }
  async addDetailsInfo() {
    this.groupDetailsForm.removeControl('id')
    console.log("check id for insert: ", this.getDetailedRowData, "edit data form: ", this.editData, "main id: ", this.getMasterRowId.id);

    if (this.getMasterRowId.id) {
      if (this.getMasterRowId.id) {
        console.log("form  headerId: ", this.getMasterRowId.id)

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
        this.groupDetailsForm.controls['addId'].setValue(this.getMasterRowId.id);
        this.groupDetailsForm.controls['total'].setValue((parseFloat(this.groupDetailsForm.getRawValue().price) * parseFloat(this.groupDetailsForm.getRawValue().qty)));

        console.log("master form valuessss: ", this.groupMasterForm.value)
        this.groupDetailsForm.addControl('date', new FormControl('', Validators.required));
        this.groupDetailsForm.controls['date'].setValue(this.groupMasterForm.getRawValue().date);

        this.groupDetailsForm.addControl('storeId', new FormControl('', Validators.required));
        this.groupDetailsForm.controls['storeId'].setValue(this.groupMasterForm.getRawValue().storeId);

        this.groupDetailsForm.addControl('fiscalYearId', new FormControl('', Validators.required));
        this.groupDetailsForm.controls['fiscalYearId'].setValue(this.groupMasterForm.getRawValue().fiscalYearId);

        console.log("form details after item: ", this.groupDetailsForm.value, "DetailedRowData: ", !this.getDetailedRowData)

        if (this.groupDetailsForm.valid && !this.getDetailedRowData) {

          this.api.postStrAddDetails(this.groupDetailsForm.value)
            .subscribe({
              next: (res) => {
                alert("تمت إضافة المجموعة بنجاح");
                this.groupDetailsForm.reset();
                this.updateDetailsForm()
                this.getAllDetailsForms();
                // this.groupDetailsForm.removeControl('date');
                // this.groupDetailsForm.removeControl('storeid');
                // this.groupDetailsForm.removeControl('fiscalYearId');

                console.log("form details after remove controllers: ", this.groupDetailsForm.value)

                // this.dialogRef.close('save');
              },
              error: (err) => {
                console.log("add details err: ", err)
                alert("حدث خطأ أثناء إضافة تفاصيل")
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
    alert("storeId: "+this.groupMasterForm.getRawValue().storeId)
    this.storeName = await this.getStoreByID(this.groupMasterForm.getRawValue().storeId);
    // alert("update Store name: " + this.storeName)
    this.groupMasterForm.controls['storeName'].setValue(this.storeName);

    this.sourceStoreName = await this.getSourceStoreByID(this.groupMasterForm.getRawValue().sourceStoreId);
    // alert("update sourceStoreName name: " + this.sourceStoreName)
    this.groupMasterForm.controls['sourceStoreName'].setValue(this.sourceStoreName);

    this.employeeName = await this.getEmployeeByID(this.groupMasterForm.getRawValue().employeeId);
    // alert("update employeeName name: " + this.employeeName)
    this.groupMasterForm.controls['employeeName'].setValue(this.employeeName);

    this.typeName = await this.getTypeByID(this.groupMasterForm.getRawValue().addTypeId);
    // alert("update typeName name: " + this.typeName)
    this.groupMasterForm.controls['typeName'].setValue(this.typeName);
    // this.groupMasterForm.patchValue({typeName:this.typeName});

    this.receiptName = await this.getReceiptByID(this.groupMasterForm.getRawValue().addReceiptId);
    // alert("update receiptName name: " + this.receiptName)
    this.groupMasterForm.controls['receiptName'].setValue(this.receiptName);

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
      console.log("details foorm: ", this.groupDetailsForm.value)
      this.groupDetailsForm.addControl('id', new FormControl('', Validators.required));
      this.groupDetailsForm.controls['id'].setValue(this.getDetailedRowData.id);
      // this.groupDetailsForm.controls['state'].setValue(this.editData.id);
      this.groupDetailsForm.controls['avgPrice'].setValue(this.getDetailedRowData.avgPrice);

    }


    this.groupMasterForm.addControl('id', new FormControl('', Validators.required));
    this.groupMasterForm.controls['id'].setValue(this.getMasterRowId.id);
    // this.groupMasterForm.controls['addId'].setValue(this.getMasterRowId.id);
    console.log("data item Name in edit without id: ", this.groupMasterForm.value)

    this.api.putStrAdd(this.groupMasterForm.value)
      .subscribe({
        next: (res) => {
          // alert("تم الحفظ بنجاح");
          console.log("update res: ", res, "details form values: ", this.groupDetailsForm.value, "details id: ", this.getDetailedRowData);
          if (this.groupDetailsForm.value && this.getDetailedRowData) {
            this.api.putStrAddDetails(this.groupDetailsForm.value)
              .subscribe({
                next: (res) => {
                  // alert("تم الحفظ بنجاح");
                  // this.toastrSuccess();
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
    console.log("pass id: ", this.getMasterRowId.id, "pass No: ", this.groupMasterForm.getRawValue().no, "pass StoreId: ", this.groupMasterForm.getRawValue().storeId, "pass Date: ", this.groupMasterForm.getRawValue().date)
    if (this.groupMasterForm.getRawValue().no != '' && this.groupMasterForm.getRawValue().storeId != '' && this.groupMasterForm.getRawValue().fiscalYearId != '' && this.groupMasterForm.getRawValue().date != ''
      && this.groupMasterForm.getRawValue().addTypeId != '' && this.groupMasterForm.getRawValue().sellerId != '' && this.groupMasterForm.getRawValue().employeeId != '' && this.groupMasterForm.getRawValue().addTypeId != '' && this.groupMasterForm.getRawValue().addReceiptId != '') {

      this.groupDetailsForm.controls['addId'].setValue(this.getMasterRowId.id);
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
      console.log("getDetailedRowData before :", this.getDetailedRowData)
      this.actionBtnDetails = "Update";
      this.groupDetailsForm.controls['addId'].setValue(this.getDetailedRowData.addId);
      this.groupDetailsForm.controls['state'].setValue(this.getDetailedRowData.state);
      // this.groupDetailsForm.controls['storeId'].setValue(this.groupMasterForm.getRawValue().storeId);
      // this.groupDetailsForm.controls['fiscalYearId'].setValue(this.groupMasterForm.getRawValue().fiscalYearId);
      // this.groupDetailsForm.controls['date'].setValue(this.groupMasterForm.getRawValue().date);

      this.groupDetailsForm.controls['qty'].setValue(this.getDetailedRowData.qty);
      this.groupDetailsForm.controls['price'].setValue(this.getDetailedRowData.price);
      this.groupDetailsForm.controls['avgPrice'].setValue(this.getDetailedRowData.avgPrice);
      this.groupDetailsForm.controls['balanceQty'].setValue(this.getDetailedRowData.balanceQty);
      this.groupDetailsForm.controls['percentage'].setValue(this.getDetailedRowData.percentage);
      this.groupDetailsForm.controls['total'].setValue(parseFloat(this.groupDetailsForm.getRawValue().price) * parseFloat(this.groupDetailsForm.getRawValue().qty));
      // console.log("groupDetailsForm after: ", this.groupDetailsForm);
      console.log("itemid focus: ", this.matchedIds);

      this.groupDetailsForm.controls['itemId'].setValue(this.getDetailedRowData.itemId);
      // this.groupDetailsForm.controls['productId'].setValue(this.getDetailedRowData.productId);

    }


  }

  deleteFormDetails(id: number) {
    var result = confirm("هل ترغب بتاكيد الحذف ؟");
    if (result) {
      this.api.deleteStrAddDetails(id)
        .subscribe({
          next: (res) => {
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
    return fetch(`http://ims.aswan.gov.eg/api/STRStore/get/${id}`)
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
    return fetch(`http://ims.aswan.gov.eg/api/HREmployee/get/${id}`)
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
    return fetch(`http://ims.aswan.gov.eg/api/STRAddType/get/${id}`)
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
    return fetch(`http://ims.aswan.gov.eg/api/STRAddReceipt/get/${id}`)
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
    return fetch(`http://ims.aswan.gov.eg/api/PRSeller/get/${id}`)
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
    return fetch(`http://ims.aswan.gov.eg/api/STRStore/get/${id}`)
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


  set_Seller_Employee_Null(sourceStoreId: any) {
    this.groupMasterForm.controls['sellerId'].setValue(null);
    //this.groupMasterForm.controls['sourceStoreId'].setValue(this.editData.sourceStoreId); 
    this.groupMasterForm.controls['employeeId'].setValue(null);
    console.log("source: ", sourceStoreId)
    this.isReadOnlyEmployee = true
    
  }

  set_store_Employee_Null(sellerId: any) {
    // this.groupMasterForm.controls['sellerId'].setValue(''); 
    this.groupMasterForm.controls['sourceStoreId'].setValue(null);
    this.groupMasterForm.controls['employeeId'].setValue(null);
    this.isReadOnlyEmployee = false
  }
  set_store_Seller_Null(employeeId: any) {
    this.groupMasterForm.controls['sellerId'].setValue(null);
    this.groupMasterForm.controls['sourceStoreId'].setValue(null);
    // this.groupMasterForm.controls['employeeId'].setValue('');  
    this.isReadOnlyEmployee = true
  }

  itemOnChange(itemEvent: any) {
    // this.isReadOnly = true;
    console.log("itemId: ", itemEvent)

    if (this.groupDetailsForm.getRawValue().avgPrice == 0) {
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
          this.groupDetailsForm.controls['avgPrice'].setValue(res);
          console.log("price avg called res: ", this.groupDetailsForm.getRawValue().avgPrice);
        },
        error: (err) => {
          // console.log("fetch fiscalYears data err: ", err);
          alert("خطا اثناء جلب متوسط السعر !");
        }
      })
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
}
