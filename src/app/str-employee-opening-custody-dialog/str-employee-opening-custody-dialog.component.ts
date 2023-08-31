import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ApiService } from '../services/api.service';
// import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-str-employee-opening-custody-dialog',
  templateUrl: './str-employee-opening-custody-dialog.component.html',
  styleUrls: ['./str-employee-opening-custody-dialog.component.css']
})
export class STREmployeeOpeningCustodyDialogComponent implements OnInit{
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
  employeesList: any;
  distEmployeesList: any;
  costCentersList: any;
  itemsList: any;
  fiscalYearsList: any;
  storeName: any;
  itemName: any;
  userIdFromStorage: any;
  deleteConfirmBtn: any;
  dialogRefDelete: any;
autoNo: any;
price:any;
  displayedColumns: string[] = ['itemName', 'percentage', 'state', 'price', 'qty', 'total', 'action'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private formBuilder: FormBuilder,
    private api: ApiService,
    @Inject(MAT_DIALOG_DATA) public editData: any,
    @Inject(MAT_DIALOG_DATA) public editDataDetails: any,
    private http: HttpClient,
    // private toastr: ToastrService,
    private dialog: MatDialog,
    private toastr: ToastrService) { }


  ngOnInit(): void {
    // this.getStores();
    this.getItems();
    this.getFiscalYears();
    this.getEmployees();
    this.getStrEmployeeOpenAutoNo();
    // this.getPrice(); 
    this.distEmployeesList = [
      {
        "id": 1,
        "name": "distFirstEm"
      },
      {
        "id": 2,
        "name": "distSecondEm"
      }
    ]

    this.getCostCenters();


    this.getMasterRowId = this.editData;

    this.groupMasterForm = this.formBuilder.group({
      no: ['', Validators.required],
      // storeId: ['', Validators.required],
      // storeName: ['', Validators.required],
      employeeId: ['', Validators.required],
    
      costCenterId: ['', Validators.required],
      transactionUserId: ['', Validators.required],
      date: ['', Validators.required],
      total: ['', Validators.required],
      fiscalYearId: ['', Validators.required],
    });

    this.groupDetailsForm = this.formBuilder.group({
      custodyId: ['', Validators.required], //MasterId
      qty: ['', Validators.required],
      price: ['', Validators.required],
      total: ['', Validators.required],
      state: ['', Validators.required],
      percentage: ['', Validators.required],
      transactionUserId: ['', Validators.required],
      itemId: ['', Validators.required],
      itemName: ['', Validators.required],
    });



    if (this.editData) {
      // console.log("master edit form: ", this.editData);
      this.actionBtnMaster = "Update";
      this.groupMasterForm.controls['no'].setValue(this.editData.no);
      // this.groupMasterForm.controls['storeId'].setValue(this.editData.storeId);

      this.groupMasterForm.controls['employeeId'].setValue(this.editData.employeeId);
      
      this.groupMasterForm.controls['costCenterId'].setValue(this.editData.costCenterId);

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

  // getStores() {
  //   this.api.getStore()
  //     .subscribe({
  //       next: (res) => {
  //         this.storeList = res;
  //         // console.log("store res: ", this.storeList);
  //       },
  //       error: (err) => {
  //         console.log("fetch store data err: ", err);
  //         alert("خطا اثناء جلب المخازن !");
  //       }
  //     })
  // }

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

  getEmployees() {
    this.api.getHrEmployees()
      .subscribe({
        next: (res) => {
          this.employeesList = res;
          console.log("employees res: ", this.employeesList);
        },
        error: (err) => {
          console.log("fetch employees data err: ", err);
          alert("خطا اثناء جلب الموظفين !");
        }
      })
  }

  getCostCenters() {
    this.api.getFiCostCenter()
      .subscribe({
        next: (res) => {
          this.costCentersList = res;
          console.log("costCenter res: ", this.costCentersList);
        },
        error: (err) => {
          console.log("fetch costCenter data err: ", err);
          alert("خطا اثناء جلب مراكز التكلفة !");
        }
      })
  }
  // getPrice(){
  //   this.api.getAvgPrice(storeid: any, FiscalYearid: any, Date: any, itemid: any)

  //     .subscribe({
  //       next: (res) => {
  //         this.price = res;
  //         console.log("employees res: ", this.employeesList);
  //       },
  //       error: (err) => {
  //         console.log("fetch employees data err: ", err);
  //         alert("خطا اثناء جلب الموظفين !");
  //       }
  //     })
 
  getFiscalYears() {
    this.api.getFiscalYears()
      .subscribe({
        next: (res) => {
          this.fiscalYearsList = res;
          console.log("fiscalYears res: ", this.fiscalYearsList);
        },
        error: (err) => {
          console.log("fetch fiscalYears data err: ", err);
          alert("خطا اثناء جلب العناصر !");
        }
      })
  }

  getAllDetailsForms() {

    console.log("mastered row get all data: ", this.getMasterRowId)
    if (this.getMasterRowId) {
      this.http.get<any>("http://ims.aswan.gov.eg/api/STREmployeeOpeningCustodyDetails/get/all")
        .subscribe(res => {
          console.log("res to get all details form: ", res, "masterRowId: ", this.getMasterRowId.id);

          this.matchedIds = res.filter((a: any) => {
            // console.log("matchedIds: ", a.employee_ExchangeId == this.getMasterRowId.id, "res: ", this.matchedIds)
            return a.custodyId == this.getMasterRowId.id
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

  async nextToAddFormDetails() {
    this.groupMasterForm.removeControl('id')
this.groupMasterForm.controls['total'].setValue(this.sumOfTotals)
    // this.storeName = await this.getStoreByID(this.groupMasterForm.getRawValue().storeId);

    // alert("store name in add: " + this.storeName)
    // this.groupMasterForm.controls['storeName'].setValue(this.storeName);
    // this.groupMasterForm.controls['fiscalYearId'].setValue(1)
    // console.log("faciaaaaal year add: ", this.groupMasterForm.getRawValue().fiscalYearId)
    console.log("dataName: ", this.groupMasterForm.value)
    if (this.groupMasterForm.getRawValue().no) {
      console.log("no changed: ", this.groupMasterForm.getRawValue().no)
    }
    else{
      this.groupMasterForm.controls['no'].setValue(this.autoNo);
      console.log("no took auto number: ", this.groupMasterForm.getRawValue().no)
    }
    if (this.groupMasterForm.valid) {
      // if (this.groupMasterForm.getRawValue().storeName && this.groupMasterForm.valid) {


      console.log("Master add form : ", this.groupMasterForm.value)
      this.api.postStrEmployeeOpen(this.groupMasterForm.value)
        .subscribe({
          next: (res) => {
            // console.log("ID header after post req: ", res);
            this.getMasterRowId = {
              "id": res
            };
            // this.getMasterRowId = res;
            console.log("mastered res: ", this.getMasterRowId.id)
            this.MasterGroupInfoEntered = true;

            alert("تم الحفظ بنجاح");
            this.toastrSuccess();
            this.getAllDetailsForms();
            // this.addDetailsInfo();
            // this.getAllDetailsForms();
            // this.updateDetailsForm();
            this.addDetailsInfo();
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


  // getStoreByID(id: any) {
  //   // console.log("row store id: ", id);
  //   return fetch(`https://ims.aswan.gov.eg/api/STR_Store/get-UniStoret-by-id/${id}`)
  //     .then(response => response.json())
  //     .then(json => {
  //       // console.log("fetch name by id res: ", json.name);
  //       return json.name;
  //     })
  //     .catch((err) => {
  //       // console.log("error in fetch name by id: ", err);
  //       // alert("خطا اثناء جلب رقم المخزن !");
  //     });
  // }

  async addDetailsInfo() {
    console.log("check id for insert: ", this.getDetailedRowData, "edit data form: ", this.editData, "main id: ", this.getMasterRowId.id);

    if (this.getMasterRowId.id) {
      if (this.getMasterRowId.id) {
        console.log("form  headerId: ", this.getMasterRowId, "details form: ", this.groupDetailsForm.value)

        // if (this.groupDetailsForm.getRawValue().itemId) {
        //   // this.itemName = await this.getItemByID(this.groupDetailsForm.getRawValue().itemId);
        //   this.groupDetailsForm.controls['itemName'].setValue(this.itemName);
        //   // this.groupDetailsForm.controls['transactionUserId'].setValue(this.userIdFromStorage?.slice(1, length - 1));
        //   this.groupDetailsForm.controls['transactionUserId'].setValue(this.userIdFromStorage);
        // }

        // this.groupDetailsForm.controls['employee_ExchangeId'].setValue(this.getMasterRowId.id);
        // this.groupDetailsForm.controls['total'].setValue((parseFloat(this.groupDetailsForm.getRawValue().price) * parseFloat(this.groupDetailsForm.getRawValue().qty)));

        // console.log("form details after item: ", this.groupDetailsForm.value, "DetailedRowData: ", !this.getDetailedRowData)
        if (this.groupDetailsForm.getRawValue().itemId) {
          this.itemName = await this.getItemByID(this.groupDetailsForm.getRawValue().itemId);
          this.groupDetailsForm.controls['itemName'].setValue(this.itemName);
          alert("item name: " + this.itemName + " transactionUserId: " + this.userIdFromStorage)
          // this.groupDetailsForm.controls['transactionUserId'].setValue(this.userIdFromStorage?.slice(1, length - 1));
          this.groupDetailsForm.controls['transactionUserId'].setValue(this.userIdFromStorage);
          this.groupDetailsForm.controls['custodyId'].setValue(this.getMasterRowId.id);
          this.groupDetailsForm.controls['total'].setValue((parseFloat(this.groupDetailsForm.getRawValue().price) * parseFloat(this.groupDetailsForm.getRawValue().qty)));

          console.log("add details second time, details form: ", this.groupDetailsForm.value)
          console.log("add details second time, get detailed row data: ", !this.getDetailedRowData)
        }

        alert("item name controller: " + this.groupDetailsForm.getRawValue().itemName + " transactionUserId controller: " + this.groupDetailsForm.getRawValue().transactionUserId)

        // this.groupDetailsForm.controls['percentage'].setValue(20);
        // this.groupDetailsForm.controls['state'].setValue("string2");

        console.log("add details second time, details form: ", this.groupDetailsForm.value)
        console.log("add details second time, get detailed row data: ", !this.getDetailedRowData)

        // if (this.groupDetailsForm.valid && !this.getDetailedRowData) {
        if (this.groupDetailsForm.valid && !this.getDetailedRowData) {

          this.api.postStrEmployeeOpenDetails(this.groupDetailsForm.value)
            .subscribe({
              next: (res) => {
                this.getDetailsRowId = {
                  "id": res
                };
                // this.getDetailsRowId = res;
                console.log("Details res: ", this.getDetailsRowId.id)

                alert("تمت إضافة التفاصيل بنجاح");
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

    // this.storeName = await this.getStoreByID(this.groupMasterForm.getRawValue().storeId);
    // // alert("update Store name: " + this.storeName)
    // this.groupMasterForm.controls['storeName'].setValue(this.storeName);
    // // console.log("data storeName in edit: ", this.groupMasterForm.value)

    // this.groupDetailsForm.controls['itemName'].setValue(this.itemName);

    // this.storeName = await this.getStoreByID(this.groupMasterForm.getRawValue().storeId);
    // alert("update Store name: " + this.storeName)
    // this.groupMasterForm.controls['storeName'].setValue(this.storeName);
    // console.log("data storeName in edit: ", this.groupMasterForm.value)

    // this.groupDetailsForm.controls['itemName'].setValue(this.itemName);

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
    // this.groupMasterForm.controls['employee_ExchangeId'].setValue(this.getMasterRowId.id);
    // console.log("data item Name in edit without id: ", this.groupMasterForm.value)

    this.api.putStrEmployeeOpen(this.groupMasterForm.value)
      .subscribe({
        next: (res) => {
          alert("تم التعديل بنجاح");
          console.log("update res: ", res, "details form values: ", this.groupDetailsForm.value, "details id: ", this.getDetailedRowData);
          // console.log("update res: ", res, "details form values: ", this.groupDetailsForm.value, "details id: ", this.getDetailedRowData);
          if (this.groupDetailsForm.value && this.getDetailedRowData) {

            this.groupDetailsForm.addControl('id', new FormControl('', Validators.required));
            this.groupDetailsForm.controls['id'].setValue(this.getDetailedRowData.id);

            this.api.putStrEmployeeOpenDetails(this.groupDetailsForm.value)
              .subscribe({
                next: (res) => {
                  alert("تم تحديث التفاصيل بنجاح");
                  this.toastrSuccess();
                  // console.log("update res: ", res);
                  this.groupDetailsForm.reset();
                  this.getAllDetailsForms();
                  this.getDetailedRowData = '';
                  // this.dialogRef.close('update');
                },
                error: (err) => {
                  // console.log("update err: ", err)
                  alert("خطأ أثناء تحديث سجل المجموعة !!")
                }
              })
            this.groupDetailsForm.removeControl('id')

          }

          // this.dialogRef.close('update');
        },
        error: () => {
          alert("خطأ أثناء تحديث سجل الصنف !!")
        }
      })
  }

  updateBothForms() {
    // console.log("pass id: ", this.getMasterRowId.id, "pass No: ", this.groupMasterForm.getRawValue().no, "pass StoreId: ", this.groupMasterForm.getRawValue().storeId, "pass Date: ", this.groupMasterForm.getRawValue().date)
    if (this.groupMasterForm.getRawValue().no != '' && this.groupMasterForm.getRawValue().storeId != '' && this.groupMasterForm.getRawValue().fiscalYearId != '' && this.groupMasterForm.getRawValue().date != '') {

      this.groupDetailsForm.controls['custodyId'].setValue(this.getMasterRowId.id);
      this.groupDetailsForm.controls['total'].setValue(parseFloat(this.groupDetailsForm.getRawValue().price) * parseFloat(this.groupDetailsForm.getRawValue().qty));

      this.updateDetailsForm();
    }
    // else {
    //   alert("تاكد من ادخال البيانات صحيحة")
    // }

  }

  editDetailsForm(row: any) {

    console.log("test edit pass row: ", row)
    if (this.editDataDetails || row) {
      this.getDetailedRowData = row;

      this.actionBtnDetails = "Update";
      this.groupDetailsForm.controls['custodyId'].setValue(this.getDetailedRowData.custodyId);

      this.groupDetailsForm.controls['qty'].setValue(this.getDetailedRowData.qty);
      this.groupDetailsForm.controls['price'].setValue(this.getDetailedRowData.price);
      this.groupDetailsForm.controls['total'].setValue(parseFloat(this.groupDetailsForm.getRawValue().price) * parseFloat(this.groupDetailsForm.getRawValue().qty));
      this.groupDetailsForm.controls['percentage'].setValue(this.getDetailedRowData.percentage);
      this.groupDetailsForm.controls['state'].setValue(this.getDetailedRowData.state);

      // console.log("itemid focus: ", this.matchedIds);

      this.groupDetailsForm.controls['itemId'].setValue(this.getDetailedRowData.itemId);
      console.log("test edit form details: ", this.groupDetailsForm.value)

    }


  }
  getStrEmployeeOpenAutoNo() {
    this.api.getStrEmployeeOpenAutoNo()
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
  deleteFormDetails(id: number) {
    // this.groupDetailsForm.addControl('id', new FormControl('', Validators.required));
    // this.groupDetailsForm.controls['id'].setValue(this.editData.id);
    console.log("details id: ", id)

    var result = confirm("هل ترغب بتاكيد الحذف ؟");
    if (result) {
      this.api.deleteStrEmployeeOpenDetails(id)
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

  getItemByID(id: any) {
    // console.log("row item id: ", id);
    return fetch(`http://ims.aswan.gov.eg/api/STRItem/get/${id}`)
      .then(response => response.json())
      .then(json => {
        console.log("fetch item name by id res: ", json.name);
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
  toastrDeleteSuccess(): void {
    this.toastr.success("تم الحذف بنجاح");
  }
}
