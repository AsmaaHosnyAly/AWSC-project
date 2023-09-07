import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ApiService } from '../../services/api.service';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-fi-entry-dialog',
  templateUrl: './fi-entry-dialog.component.html',
  styleUrls: ['./fi-entry-dialog.component.css']
})
export class FiEntryDialogComponent implements OnInit {
  groupDetailsForm !: FormGroup;
  groupMasterForm !: FormGroup;
  actionBtnMaster: string = "Save";
  actionBtnDetails: string = "Save";
  MasterGroupInfoEntered = false;
  dataSource!: MatTableDataSource<any>;
  matchedIds: any;
  getDetailedRowData: any;
  sumOfTotals = 0;
  sumOfCreditTotals = 0;
  sumOfDebitTotals = 0;
  resultOfBalance = 0;

  getMasterRowId: any;
  getDetailsRowId: any;
  journalsList: any;
  sourcesList: any;
  accountsList: any;
  accountItemsList: any;
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

  displayedColumns: string[] = ['credit', 'debit', 'accountName', 'fiAccountItemId', 'action'];

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
    console.log("getDetailedRowData : ", this.getDetailedRowData)
    this.getJournals();
    this.getFiAccounts();
    this.getFiAccountItems();
    this.getFiEntrySource();

    this.getMasterRowId = this.editData;

    this.groupMasterForm = this.formBuilder.group({
      no: ['', Validators.required],
      journalId: ['', Validators.required],
      fiEntrySourceTypeId: ['', Validators.required],
      creditTotal: ['', Validators.required],
      debitTotal: ['', Validators.required],
      balance: ['', Validators.required],
      state: ['', Validators.required], //will rename to state
      transactionUserId: ['', Validators.required],
      date: ['', Validators.required],
    });

    this.groupDetailsForm = this.formBuilder.group({
      entryId: ['', Validators.required],
      credit: ['', Validators.required],
      debit: ['', Validators.required],
      accountId: ['', Validators.required],
      fiAccountItemId: ['', Validators.required],
      transactionUserId: ['', Validators.required],
    });



    if (this.editData) {
      // console.log("master edit form: ", this.editData);
      this.actionBtnMaster = "Update";
      this.groupMasterForm.controls['no'].setValue(this.editData.no);
      this.groupMasterForm.controls['date'].setValue(this.editData.date);

      this.groupMasterForm.controls['journalId'].setValue(this.editData.journalId);
      this.groupMasterForm.controls['fiEntrySourceTypeId'].setValue(this.editData.fiEntrySourceTypeId)

      this.groupMasterForm.addControl('id', new FormControl('', Validators.required));
      this.groupMasterForm.controls['id'].setValue(this.editData.id);
    }

    this.getAllDetailsForms();

    this.userIdFromStorage = localStorage.getItem('transactionUserId');
    this.groupMasterForm.controls['transactionUserId'].setValue(this.userIdFromStorage);

  }

  getJournals() {
    this.api.getJournals()
      .subscribe({
        next: (res) => {
          this.journalsList = res;
          console.log("journals res: ", this.journalsList);
        },
        error: (err) => {
          console.log("fetch journals data err: ", err);
          alert("خطا اثناء جلب الدفاتر !");
        }
      })
  }

  getFiAccounts() {
    this.api.getFiAccounts()
      .subscribe({
        next: (res) => {
          this.accountsList = res;
          console.log("accounts res: ", this.accountsList);
        },
        error: (err) => {
          console.log("fetch accounts data err: ", err);
          alert("خطا اثناء جلب الدفاتر !");
        }
      })
  }

  getFiAccountItems() {
    this.api.getFiAccountItems()
      .subscribe({
        next: (res) => {
          this.accountItemsList = res;
          console.log("accountItems res: ", this.accountItemsList);
        },
        error: (err) => {
          console.log("fetch accountItems data err: ", err);
          alert("خطا اثناء جلب الدفاتر !");
        }
      })
  }

  getFiEntrySource() {
    this.api.getFiEntrySource()
      .subscribe({
        next: (res) => {
          this.sourcesList = res;
          console.log("sourcesList res: ", this.sourcesList);
        },
        error: (err) => {
          console.log("fetch sourcesList data err: ", err);
          alert("خطا اثناء جلب الانواع !");
        }
      })
  }

  getAllDetailsForms() {

    console.log("edddit get all data: ", this.editData)
    console.log("mastered row get all data: ", this.getMasterRowId)
    if (this.getMasterRowId) {
      this.http.get<any>("http://ims.aswan.gov.eg/api/FIEntryDetails/get/all")
        .subscribe(res => {
          console.log("res to get all details form: ", res, "masterRowId: ", this.getMasterRowId.id);

          this.matchedIds = res.filter((a: any) => {
            // console.log("matchedIds: ", a.entryId == this.getMasterRowId.id, "res: ", this.matchedIds)
            return a.entryId == this.getMasterRowId.id
          })

          if (this.matchedIds) {

            this.dataSource = new MatTableDataSource(this.matchedIds);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;

            this.sumOfCreditTotals = 0;
            this.sumOfDebitTotals = 0;
            this.resultOfBalance = 0;
            for (let i = 0; i < this.matchedIds.length; i++) {
              this.sumOfCreditTotals = this.sumOfCreditTotals + parseFloat(this.matchedIds[i].credit);
              this.groupMasterForm.controls['creditTotal'].setValue(this.sumOfCreditTotals);
              this.sumOfDebitTotals = this.sumOfDebitTotals + parseFloat(this.matchedIds[i].debit);
              this.groupMasterForm.controls['debitTotal'].setValue(this.sumOfDebitTotals);

              if (this.sumOfCreditTotals > this.sumOfDebitTotals) {
                this.resultOfBalance = this.sumOfCreditTotals - this.sumOfDebitTotals;
                this.groupMasterForm.controls['balance'].setValue(this.resultOfBalance);
              }
              else {
                this.resultOfBalance = this.sumOfDebitTotals - this.sumOfCreditTotals;
                this.groupMasterForm.controls['balance'].setValue(this.resultOfBalance);
              }

              if (this.resultOfBalance == 0) {
                this.groupMasterForm.controls['state'].setValue('مغلق');
              }
              else {
                this.groupMasterForm.controls['state'].setValue('مفتوح');
              }
              this.updateBothForms()

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

    this.groupMasterForm.controls['creditTotal'].setValue(0);
    this.groupMasterForm.controls['debitTotal'].setValue(0);
    this.groupMasterForm.controls['balance'].setValue(0);
    this.groupMasterForm.controls['state'].setValue('مغلق');

    console.log("fiEntry master form: ", this.groupMasterForm.value)

    if (this.groupMasterForm.valid) {
     
      console.log("Master add form : ", this.groupMasterForm.value)
      this.api.postFiEntry(this.groupMasterForm.value)
        .subscribe({
          next: (res) => {
            console.log("ID fiEntry after post: ", res);
            this.getMasterRowId = {
              "id": res
            };
            console.log("mastered res: ", this.getMasterRowId.id)
            this.MasterGroupInfoEntered = true;

            alert("تم الحفظ بنجاح");
            this.toastrSuccess();
            this.getAllDetailsForms();
            this.addDetailsInfo();
          },
          error: (err) => {
            console.log("header post err: ", err);
            alert("حدث خطأ أثناء إضافة مجموعة")
          }
        })
    }
  
  }

  async addDetailsInfo() {
    console.log("check id for insert: ", this.getDetailedRowData, "edit data form: ", this.editData, "main id: ", this.getMasterRowId.id);

    if (this.getMasterRowId.id) {
      if (this.getMasterRowId.id) {
        console.log("form  headerId: ", this.getMasterRowId, "details form: ", this.groupDetailsForm.value)

        if (this.groupDetailsForm.getRawValue().credit || this.groupDetailsForm.getRawValue().debit) {
          if (this.editData) {
            console.log("found details: ", this.editData)
            this.sumOfCreditTotals = this.editData.creditTotal;
            this.sumOfDebitTotals = this.editData.debitTotal;

            this.sumOfCreditTotals = this.sumOfCreditTotals + this.groupDetailsForm.getRawValue().credit;
            this.sumOfDebitTotals = this.sumOfDebitTotals + this.groupDetailsForm.getRawValue().debit;
            this.groupMasterForm.controls['creditTotal'].setValue(this.sumOfCreditTotals);
            this.groupMasterForm.controls['debitTotal'].setValue(this.sumOfDebitTotals);

            if (this.sumOfCreditTotals > this.sumOfDebitTotals) {
              this.resultOfBalance = this.sumOfCreditTotals - this.sumOfDebitTotals;
              this.groupMasterForm.controls['balance'].setValue(this.resultOfBalance);
            }
            else {
              this.resultOfBalance = this.sumOfDebitTotals - this.sumOfCreditTotals;
              this.groupMasterForm.controls['balance'].setValue(this.resultOfBalance);
            }

            if (this.resultOfBalance == 0) {
              this.groupMasterForm.controls['state'].setValue('مغلق');
            }
            else {
              this.groupMasterForm.controls['state'].setValue('مفتوح');
            }
          }
          else {
            console.log("found details withoutEdit: ", this.groupDetailsForm.value)
            this.sumOfCreditTotals = this.sumOfCreditTotals + this.groupDetailsForm.getRawValue().credit;
            this.sumOfDebitTotals = this.sumOfDebitTotals + this.groupDetailsForm.getRawValue().debit;
            this.groupMasterForm.controls['creditTotal'].setValue(this.sumOfCreditTotals)
            this.groupMasterForm.controls['debitTotal'].setValue(this.sumOfDebitTotals)

            if (this.sumOfCreditTotals > this.sumOfDebitTotals) {
              this.resultOfBalance = this.sumOfCreditTotals - this.sumOfDebitTotals;
              this.groupMasterForm.controls['balance'].setValue(this.resultOfBalance);
            }
            else {
              this.resultOfBalance = this.sumOfDebitTotals - this.sumOfCreditTotals;
              this.groupMasterForm.controls['balance'].setValue(this.resultOfBalance);
            }

            if(this.resultOfBalance == 0){
              this.groupMasterForm.controls['state'].setValue('مغلق');
            }
            else{
              this.groupMasterForm.controls['state'].setValue('مفتوح');
            }
          }

        }

        this.groupDetailsForm.controls['transactionUserId'].setValue(this.userIdFromStorage);
        this.groupDetailsForm.controls['entryId'].setValue(this.getMasterRowId.id);

        console.log("add details second time, get detailed row data: ", !this.getDetailedRowData)

        alert("item name controller: " + this.groupDetailsForm.getRawValue().itemName + " transactionUserId controller: " + this.groupDetailsForm.getRawValue().transactionUserId)

        console.log("add details second time, details form: ", this.groupDetailsForm.value)
        console.log("add details second time, get detailed row data: ", !this.getDetailedRowData)

        if (this.groupDetailsForm.valid && !this.getDetailedRowData) {

          this.api.postFiEntryDetails(this.groupDetailsForm.value)
            .subscribe({
              next: (res) => {
                this.getDetailsRowId = {
                  "id": res
                };
                console.log("Details res: ", this.getDetailsRowId.id)
                alert("postDetails res credit: " + this.sumOfCreditTotals + " credit res: " + res.credit)

                alert("تمت إضافة التفاصيل بنجاح");
                this.toastrSuccess();
                this.groupDetailsForm.reset();
                this.getAllDetailsForms();
                this.updateDetailsForm()
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
    if (this.editData) {
      this.groupMasterForm.addControl('id', new FormControl('', Validators.required));
      this.groupMasterForm.controls['id'].setValue(this.editData.id);
    }

    this.groupMasterForm.addControl('id', new FormControl('', Validators.required));
    this.groupMasterForm.controls['id'].setValue(this.getMasterRowId.id);
    console.log("enteeeeeeeeeer to update master form: ", this.groupMasterForm.getRawValue().creditTotal)
    console.log("update master form: ", this.groupMasterForm.value, "update details form: ", this.groupDetailsForm.value)
    this.api.putFiEntry(this.groupMasterForm.value)
      .subscribe({
        next: (res) => {
          alert("تم التعديل بنجاح");
          console.log("update res: ", res, "details form values: ", this.groupDetailsForm.value, "details id: ", this.getDetailedRowData);
          if (this.groupDetailsForm.value && this.getDetailedRowData) {

            this.groupDetailsForm.addControl('id', new FormControl('', Validators.required));
            this.groupDetailsForm.controls['id'].setValue(this.getDetailedRowData.id);

            if (!this.groupDetailsForm.getRawValue().credit) {
              console.log("enter credit only")
              this.groupDetailsForm.controls['credit'].setValue(this.getDetailedRowData.credit)
            }
            else if (!this.groupDetailsForm.getRawValue().debit) {
              console.log("enter debit only")
              this.groupDetailsForm.controls['debit'].setValue(this.getDetailedRowData.debit)
            }


            console.log("details form submit to edit: ", this.groupDetailsForm.value);


            this.api.putFiEntryDetails(this.groupDetailsForm.value)
              .subscribe({
                next: (res) => {
                  alert("تم تحديث التفاصيل بنجاح");
                  this.toastrSuccess();
                  // console.log("update res: ", res);
                  this.groupDetailsForm.reset();
                  this.getAllDetailsForms();
                  this.getDetailedRowData = '';
                },
                error: (err) => {
                  // console.log("update err: ", err)
                  alert("خطأ أثناء تحديث سجل المجموعة !!")
                }
              })
            this.groupDetailsForm.removeControl('id')

          }

        },
        error: () => {
          alert("خطأ أثناء تحديث سجل الصنف !!")
        }
      })
  }

  updateBothForms() {
    // console.log("pass id: ", this.getMasterRowId.id, "pass No: ", this.groupMasterForm.getRawValue().no, "pass StoreId: ", this.groupMasterForm.getRawValue().storeId, "pass Date: ", this.groupMasterForm.getRawValue().date)
    if (this.groupMasterForm.getRawValue().no != '' && this.groupMasterForm.getRawValue().storeId != '' && this.groupMasterForm.getRawValue().fiscalYearId != '' && this.groupMasterForm.getRawValue().date != '') {
      this.groupDetailsForm.controls['entryId'].setValue(this.getMasterRowId.id);
      this.updateDetailsForm();
    }
   
  }

  editDetailsForm(row: any) {

    console.log("test edit pass row: ", row)
    if (this.editDataDetails || row) {
      this.getDetailedRowData = row;

      this.actionBtnDetails = "Update";
      this.groupDetailsForm.controls['entryId'].setValue(this.getDetailedRowData.entryId);
      console.log("test edit form details: ", this.groupDetailsForm.value)

    }


  }

  deleteFormDetails(id: number) {
    console.log("details id: ", id)

    var result = confirm("هل ترغب بتاكيد الحذف ؟");
    if (result) {
      this.api.deleteFiEntryDetails(id)
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
    return fetch(`https://ims.aswan.gov.eg/api/STR_Item/get-Item-by-id/${id}`)
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
