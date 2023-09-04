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
import { MatDialogRef } from '@angular/material/dialog';


@Component({
  selector: 'app-withdraw-dialog2',
  templateUrl: './str-withdraw-dialog2.component.html',
  styleUrls: ['./str-withdraw-dialog2.component.css']
})
export class StrWithdrawDialogComponent implements OnInit {
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
  withDrawNoList:any;
  statesList:any;
  notesList:any;
  fiscalYearsList: any;
  storeName: any;
  itemName: any;
  stateName:any;
  // notesName:any;
  withDrawNoName:any;


  userIdFromStorage: any;
  deleteConfirmBtn: any;
  dialogRefDelete: any;
  employeeList: any;
  employeeName: any;
  costcenterName: any;
  costcenterList: any;
  deststoreList:any;
  desstoreName:any;

  displayedColumns: string[] = ['itemName', 'price', 'qty', 'total', 'action'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private formBuilder: FormBuilder,
    private api: ApiService,
    @Inject(MAT_DIALOG_DATA) public editData: any,
    @Inject(MAT_DIALOG_DATA) public editDataDetails: any,
    private http: HttpClient,
    private toastr: ToastrService,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<StrWithdrawDialogComponent>
  ) { }
  //  private toastr: ToastrService

  ngOnInit(): void {
    this.getStores();
    this.getItems();
    this.getFiscalYears();
    this.getEmployees();
    this.getCostCenters();
    this.getDestStores();



    this.getMasterRowId = this.editData;

    this.groupMasterForm = this.formBuilder.group({
      total: ['0',Validators.required],
      no: ['', Validators.required],
      // itemName:['',Validators.required],
      storeId: [''],
      storeName: [''],
      transactionUserId: [1, Validators.required],
      destStoreUserId: [1, Validators.required],

      date: ['2023-08-08T21:00:00', Validators.required],
      fiscalYearId: ['', Validators.required],
      costcenterId: [''],
      employeeId: [''],
      // sellerId: [''],
      // sellerName: [''],
      // sourceStoreId: [''],
      // sourceStoreName: [''],

      employeeName: [''],
      costcenterName: [''],
      deststoreId: [''],
      desstoreName: [''],
    });

    this.groupDetailsForm = this.formBuilder.group({
      stR_WithdrawId: ['', Validators.required], //MasterId
      qty: ['', Validators.required],
      price: ['', Validators.required],
      total: ['', Validators.required],
      transactionUserId: [1, Validators.required],
      destStoreUserId:[1,Validators.required],
      itemId: ['', Validators.required],
      stateId: [''],

     

      withDrawNoId: ['' ],

      itemName: ['', Validators.required],
      
      stateName: [''],
      // notesName: [''],


    });



    if (this.editData) {
      // console.log("master edit form: ", this.editData);
      this.actionBtnMaster = "Update";
      this.groupMasterForm.controls['no'].setValue(this.editData.no);
      // this.groupMasterForm.controls['withDrawNoName'].setValue(this.editData.withDrawNoName);
      // this.groupMasterForm.controls['stateName'].setValue(this.editData.stateName);
      // this.groupMasterForm.controls['notesName'].setValue(this.editData.notesName);

      this.groupMasterForm.controls['storeId'].setValue(this.editData.storeId);
      this.groupMasterForm.controls['storeName'].setValue(this.editData.storeName);

      // alert("facialId before: "+ this.editData.fiscalYearId)
      this.groupMasterForm.controls['fiscalYearId'].setValue(this.editData.fiscalYearId);
  
      this.groupMasterForm.controls['date'].setValue(this.editData.date);
      this.groupMasterForm.controls['transactionUserId'].setValue(this.editData.transactionUserId);
      this.groupMasterForm.controls['destStoreUserId'].setValue(this.editData.destStoreUserId);

      console.log("transactionuser", this.editData.transactionUserId)
      this.groupMasterForm.addControl('id', new FormControl('', Validators.required));
      this.groupMasterForm.controls['id'].setValue(this.getMasterRowId.id);
      this.groupMasterForm.controls['employeeId'].setValue(this.editData.employeeId);
      // this.groupMasterForm.controls['sellerId'].setValue(this.editData.sellerId);
      // this.groupMasterForm.controls['sellerName'].setValue(this.editData.sellerName);
      this.groupMasterForm.controls['sourceStoreId'].setValue(this.editData.sourceStoreId);
      
      this.groupMasterForm.controls['sourceStoreName'].setValue(this.editData.sourceStoreName);

      this.groupMasterForm.controls['employeeName'].setValue(this.editData.employeeName);

      this.groupMasterForm.controls['deststoreId'].setValue(this.editData.deststoreId);
      this.groupMasterForm.controls['desstoreName'].setValue(this.editData.desstoreName);


      this.groupMasterForm.controls['costcenterId'].setValue(this.editData.costcenterId);
      this.groupMasterForm.controls['costcenterName'].setValue(this.editData.costcenterName);

    }

    this.getAllDetailsForms();

    // localStorage.setItem('transactionUserId', JSON.stringify("mehrail"));
    // this.userIdFromStorage = localStorage.getItem('transactionUserId');
    // console.log("userIdFromStorage in localStorage: ", this.userIdFromStorage)
    // console.log("userIdFromStorage after slice from string shape: ", this.userIdFromStorage?.slice(1, length - 1))
    // this.groupMasterForm.controls['transactionUserId'].setValue(this.userIdFromStorage?.slice(1, length - 1));
    // this.groupMasterForm.controls['transactionUserId'].setValue(this.editData.transactionUserId);
    // console.log("transactionuser",this.editData.transactionUserId)

  }

  async nextToAddFormDetails() {
    this.groupMasterForm.removeControl('id')

    this.storeName = await this.getStoreByID(this.groupMasterForm.getRawValue().storeId);
    this.employeeName = await this.getemployeeByID(this.groupMasterForm.getRawValue().employeeId);
    alert(this.groupMasterForm.getRawValue().employeeId)

    // this.sellerName = await this.getsellerByID(this.groupMasterForm.getRawValue().sellerId );

    this.desstoreName = await this.getDestStoreById(this.groupMasterForm.getRawValue().deststoreId);


    this.costcenterName = await this.getcostcenterByID(this.groupMasterForm.getRawValue().costcenterId);
    // alert("store name in add: " + this.storeName)
    this.groupMasterForm.controls['storeName'].setValue(this.storeName);
    this.groupMasterForm.controls['employeeName'].setValue(this.employeeName);
        this.groupMasterForm.controls['costcenterName'].setValue(this.costcenterName);
        this.groupMasterForm.controls['desstoreName'].setValue(this.desstoreName);

    // this.groupMasterForm.controls['fiscalYearId'].setValue(1)
    // console.log("faciaaaaal year add: ", this.groupMasterForm.getRawValue().fiscalYearId)
    // console.log("dataName: ", this.groupMasterForm.value)

    if ( this.groupMasterForm.getRawValue().storeId  && this.groupMasterForm.getRawValue().employeeId && 
    this.groupMasterForm.getRawValue().costcenterId && this.groupMasterForm.getRawValue().date && 
    this.groupMasterForm.getRawValue().deststoreId && this.groupMasterForm.getRawValue().no   ) {
      // this.groupMasterForm.removeControl('id');

      // console.log("Master add form : ", this.groupMasterForm.value)
      this.api.postStrWithdraw(this.groupMasterForm.value)
        .subscribe({
          next: (res) => {
            console.log("res code: ", res.status)
            // console.log("ID header after post req: ", res);
            this.getMasterRowId = {
              "id": res
            };
            console.log("mastered res: ", this.getMasterRowId.id)
            this.MasterGroupInfoEntered = true;

            alert("تم الحفظ بنجاح");
            this.toastrSuccess();
            this.getAllDetailsForms();
            this.updateDetailsForm();
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
  // set_Seller_Employee_Null(sourceStoreId:any) {
  //   this.groupMasterForm.controls['sellerId'].setValue(null); 
  //   this.groupMasterForm.controls['employeeId'].setValue(null);  
  // }
  
  set_Employee_Null(deststoreId:any) {
    console.log("deststoreId:",deststoreId)

    this.groupMasterForm.controls['destStoreId'].setValue(null); 
  }
  set_store_Null(employeeId:any) {
    console.log("employeeId:",employeeId)

    this.groupMasterForm.controls['employeeId'].setValue(null); 
    // this.groupMasterForm.controls['employeeId'].setValue('');  
  }
  getAllDetailsForms() {

    // console.log("mastered row get all data: ", this.getMasterRowId)
    if (this.getMasterRowId) {
      this.http.get<any>("http://ims.aswan.gov.eg/api/STRWithdrawDetails/get/all")
        .subscribe(res => {
          // console.log("res to get all details form: ", res, "masterRowId: ", this.getMasterRowId.id);

          this.matchedIds = res.filter((a: any) => {
            // console.log("matchedIds: ", a.stR_WithdrawId == this.getMasterRowId.id, "res: ", this.matchedIds)
            return a.stR_WithdrawId == this.getMasterRowId.id
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
          this.itemName = await this.getItemByID(this.groupDetailsForm.getRawValue().itemId);
          this.groupDetailsForm.controls['itemName'].setValue(this.itemName);
          this.groupDetailsForm.controls['transactionUserId'].setValue(1);
          alert("itemId")
        }
        // if (this.groupDetailsForm.getRawValue().stateId) {
        //   this.stateName = await this.getItemByID(this.groupDetailsForm.getRawValue().stateId);
        //   this.groupDetailsForm.controls['stateName'].setValue(this.stateName);
        //   this.groupDetailsForm.controls['transactionUserId'].setValue(1);
        //   alert("state")
        // }
        // if (this.groupDetailsForm.getRawValue().withDrawNoId) {
        //   this.withDrawNoName = await this.getItemByID(this.groupDetailsForm.getRawValue().withDrawNoId);
        //   this.groupDetailsForm.controls['withDrawNoName'].setValue(this.withDrawNoName);
        //   this.groupDetailsForm.controls['transactionUserId'].setValue(1);
        //   alert("withDrawNoId")
        // }
        // if (this.groupDetailsForm.getRawValue().notesId) {
        //   this.notesName = await this.getItemByID(this.groupDetailsForm.getRawValue().notesId);
        //   this.groupDetailsForm.controls['notesName'].setValue(this.notesName);
        //   this.groupDetailsForm.controls['transactionUserId'].setValue(1);
        //   alert("itemId")
        // }
        // this.groupDetailsForm.controls['itemName'].setValue(this.groupDetailsForm.itemName);

        this.groupDetailsForm.controls['stR_WithdrawId'].setValue(this.getMasterRowId.id);
        this.groupDetailsForm.controls['total'].setValue((parseFloat(this.groupDetailsForm.getRawValue().price) * parseFloat(this.groupDetailsForm.getRawValue().qty)));

        // console.log("form details after item: ", this.groupDetailsForm.value, "DetailedRowData: ", !this.getDetailedRowData)


        if (this.groupDetailsForm.valid && !this.getDetailedRowData) {

          this.api.postStrWithdrawDetails(this.groupDetailsForm.value)
            .subscribe({
              next: (res) => {
                alert("تمت إضافة المجموعة بنجاح");
                this.toastrSuccess();
                this.groupDetailsForm.reset();
                this.updateDetailsForm()
                this.getAllDetailsForms();
                // this.getAllMasterForms();
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
    this.employeeName = await this.getemployeeByID(this.groupMasterForm.getRawValue().employeeId);

        this.costcenterName = await this.getcostcenterByID(this.groupMasterForm.getRawValue().costcenterId);
        this.desstoreName = await this.getDestStoreById(this.groupMasterForm.getRawValue().deststoreId);

    // console.log("data storeName in edit: ", this.groupMasterForm.value)

    this.groupDetailsForm.controls['itemName'].setValue(this.itemName);
    this.groupMasterForm.controls['employeeName'].setValue(this.employeeName);

    this.groupMasterForm.controls['costcenterName'].setValue(this.costcenterName);
    this.groupMasterForm.controls['desstoreName'].setValue(this.desstoreName);


    // console.log("values master form: ", this.groupMasterForm.value)
    // console.log("values getMasterRowId: ", this.getMasterRowId)
    // console.log("values details form: ", this.groupDetailsForm.value)

    if (this.editData) {
      this.groupMasterForm.addControl('id', new FormControl('', Validators.required));
      this.groupMasterForm.controls['id'].setValue(this.getMasterRowId.id);
      // console.log("data item Name in edit: ", this.groupMasterForm.value)
    }

    this.groupMasterForm.addControl('id', new FormControl('', Validators.required));
    this.groupMasterForm.controls['id'].setValue(this.getMasterRowId.id);

console.log("put before",this.groupMasterForm.value)
    this.api.putStrWithdraw(this.groupMasterForm.value)
      .subscribe({
        next: (res) => {
       
          if (this.groupDetailsForm.value && this.getDetailedRowData) {
            this.api.putStrWithdrawDetails(this.groupDetailsForm.value)
              .subscribe({
                next: (res) => {
                  alert("put")
                  alert("تم الحفظ بنجاح");
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
    if (this.groupMasterForm.getRawValue().no != ''  && this.groupMasterForm.getRawValue().employeeId && 
    this.groupMasterForm.getRawValue().deststoreId && this.groupMasterForm.getRawValue().costcenterId 
    && this.groupMasterForm.getRawValue().storeId != '' && this.groupMasterForm.getRawValue().fiscalYearId != '' && this.groupMasterForm.getRawValue().date != '') {

      this.groupDetailsForm.controls['stR_WithdrawId'].setValue(this.getMasterRowId.id);
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
      this.groupDetailsForm.controls['stR_WithdrawId'].setValue(this.getDetailedRowData.stR_WithdrawId);

      this.groupDetailsForm.controls['qty'].setValue(this.getDetailedRowData.qty);
      this.groupDetailsForm.controls['price'].setValue(this.getDetailedRowData.price);
      this.groupDetailsForm.controls['total'].setValue(parseFloat(this.groupDetailsForm.getRawValue().price) * parseFloat(this.groupDetailsForm.getRawValue().qty));

      // console.log("itemid focus: ", this.matchedIds);

      this.groupDetailsForm.controls['itemId'].setValue(this.getDetailedRowData.itemId);
      this.groupDetailsForm.controls['stateName'].setValue(this.getDetailedRowData.stateName);
      // this.groupDetailsForm.controls['notesName'].setValue(this.getDetailedRowData.notes);
      // this.groupDetailsForm.controls['withDrawNoName'].setValue(this.getDetailedRowData.withDrawNoName);


    }


  }

  deleteFormDetails(id: number) {
    var result = confirm("هل ترغب بتاكيد الحذف ؟");
    if (result) {
      this.api.deleteStrWithdraw(id)
        .subscribe({
          next: (res) => {
            // alert("تم الحذف بنجاح");
            this.toastrDeleteSuccess();
            this.getAllDetailsForms();
            
          },
          error: () => {
            // alert("خطأ أثناء حذف التفاصيل !!");
          }
        })
    }

  }

  getAllMasterForms() {
    let result = window.confirm("هل تريد الغاء الطلب");
    if (result){

      this.api.getStrWithdraw()
      .subscribe({
        next: (res) => {
          // this.groupDetailsForm.controls['itemName'].setValue(this.itemName);
          this.dataSource = new MatTableDataSource(res);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        },
        error: () => {
          // alert("خطأ أثناء جلب سجلات المجموعة !!");
        }
      })
    }
   
   
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
      // getsellers() {
      //   this.api.getseller()
      //     .subscribe({
      //       next: (res) => {
      //         this.sellerList = res;
      //         // console.log("store res: ", this.storeList);
      //       },
      //       error: (err) => {
      //         // console.log("fetch store data err: ", err);
      //         // alert("خطا اثناء جلب المخازن !");
      //       }
      //     })
      // }
   
      getCostCenters() {
        this.api.getCostCenter()
          .subscribe({
            next: (res) => {
              this.costcenterList = res;
              // console.log("store res: ", this.storeList);
            },
            error: (err) => {
              // console.log("fetch store data err: ", err);
              // alert("خطا اثناء جلب المخازن !");
            }
          })
      }
      getDestStores() {
        this.api.getStore()
          .subscribe({
            next: (res) => {
              this.deststoreList = res;
              // console.log("store res: ", this.storeList);
            },
            error: (err) => {
              // console.log("fetch store data err: ", err);
              // alert("خطا اثناء جلب المخازن !");
            }
          })
      }

  getDestStoreById(id: any) {
    console.log("row store id: ", id);
    return fetch(`http://ims.aswan.gov.eg/api/STRStore/get/${id}`)
      .then(response => response.json())
      .then(json => {
        // console.log("fetch name by id res: ", json.name);
        return json.name;
      }).catch((err) => {
        // console.log("error in fetch name by id: ", err);
        // alert("خطا اثناء جلب رقم المخزن !");
      });
  }
  getemployeeByID(id: any) {
        console.log("row employee id: ", id);
        return fetch(`http://ims.aswan.gov.eg/api/HREmployee/get/${id}`)
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


      // getsellerByID(id : null) {
      //   console.log("seller ", id);
      //   // this.groupMasterForm.controls['sellerId'].setValue(null); 

      //   return fetch(`http://ims.aswan.gov.eg/api/PRSeller/get/${id}`)
      //     .then(response => response.json())
      //     .then(json => {
      //       console.log("fetch name by id res seller: ", json.name);
      //       return json.name;
      //     })
      //     .catch((err) => {
      //       console.log("error in fetch name by id: ", err);
      //       alert("خطا اثناء جلب رقم المخزن !");
      //     });
      // }
 
      getcostcenterByID(id: any) {
        console.log("costcenter id: ", id);
        return fetch(`http://ims.aswan.gov.eg/api/FICostCenter/get/${id}`)
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
      getStoreByID(id: any) {
        console.log(" store: ", id);
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
        console.log("fetch item name by id res: ", json.name);
        return json.name;
      })
      .catch((err) => {
        // console.log("error in fetch item name by id: ", err);
        // alert("خطا اثناء جلب رقم العنصر !");
      });
    }
  // getItemByID(id: any) {
  //   // console.log("row item id: ", id);
  //   return fetch(`http://ims.aswan.gov.eg/api/STRItem/get/${id}`)
  //     .then(response => response.json())
  //     .then(json => {
  //       // console.log("fetch item name by id res: ", json.name);
  //       return json.name;
  //     })
  //     .catch((err) => {
  //       // console.log("error in fetch item name by id: ", err);
  //       // alert("خطا اثناء جلب رقم العنصر !");
  //     });
  // }

  getItemByCode(code: any) {
    if (code.keyCode == 13) {
      // console.log("code: ", code.target.value);

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
    return fetch(`https://ims.aswan.gov.eg/api/STRFiscalYear/get/${id}`)
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

  toastrSuccess(): void {
    this.toastr.success("تم الحفظ بنجاح");
  }
  toastrDeleteSuccess(): void {
    this.toastr.success("تم الحذف بنجاح");
  }
}
