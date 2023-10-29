import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ApiService } from '../../services/api.service';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { MatTableDataSource } from '@angular/material/table';
import { CcEntryDetailsDialogComponent } from '../cc-entry-details-dialog/cc-entry-details-dialog.component'; 
import { GlobalService } from 'src/app/pages/services/global.service';
import { Router, Params } from '@angular/router';

@Component({
  selector: 'app-cc-entry-dialog',
  templateUrl: './cc-entry-dialog.component.html',
  styleUrls: ['./cc-entry-dialog.component.css']
})
export class CcEntryDialogComponent implements OnInit {
  groupDetailsForm!: FormGroup;
  groupMasterForm!: FormGroup;
  actionBtnMaster: string = 'Save';
  actionBtnDetails: string = 'Save';
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
  test: any;
  testMain: any;

  currentDate: any;
  defaultFiscalYearSelectValue: any;

  displayedColumns: string[] = [
    'credit',
    'debit',
    'accountName',
    'fiAccountItemId',
    'action',
  ];
  sessionId = Math.random();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private formBuilder: FormBuilder,
    private api: ApiService,
    public global: GlobalService,
    @Inject(MAT_DIALOG_DATA) public editData: any,
    @Inject(MAT_DIALOG_DATA) public editDataDetails: any,
    private http: HttpClient,
    // private toastr: ToastrService,
    private dialog: MatDialog,
    private toastr: ToastrService,
    private dialogRef: MatDialogRef<CcEntryDetailsDialogComponent>,
    private router: Router
  ) {
    this.currentDate = new Date();
  }

  ngOnInit(): void {
    // console.log("getDetailedRowData : ", this.getDetailedRowData);
    this.getFiscalYears();
    this.getFiAccounts();
    this.getFiAccountItems();
    this.getFiEntrySource();
    this.global.test = this.test;

    this.getMasterRowId = this.editData;

    this.groupMasterForm = this.formBuilder.group({
      no: ['', Validators.required],
      fiscalYearId: ['', Validators.required],
      journalId: ['', Validators.required],
      fiEntrySourceTypeId: ['', Validators.required],
      creditTotal: ['', Validators.required],
      debitTotal: ['', Validators.required],
      balance: ['', Validators.required],
      state: ['', Validators.required], //will rename to state
      transactionUserId: ['', Validators.required],
      date: [this.currentDate, Validators.required],
      description: [''],
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
      console.log('master edit form: ', this.editData);
      this.actionBtnMaster = 'Update';
      this.groupMasterForm.controls['no'].setValue(this.editData.no);
      this.groupMasterForm.controls['date'].setValue(this.editData.date);

      this.groupMasterForm.controls['journalId'].setValue(
        this.editData.journalId
      );
      this.groupMasterForm.controls['fiEntrySourceTypeId'].setValue(
        this.editData.fiEntrySourceTypeId
      );

      this.groupMasterForm.controls['balance'].setValue(this.editData.balance);
      this.groupMasterForm.controls['creditTotal'].setValue(
        this.editData.creditTotal
      );
      this.groupMasterForm.controls['debitTotal'].setValue(
        this.editData.debitTotal
      );
      this.groupMasterForm.controls['state'].setValue(this.editData.state);
      this.groupMasterForm.controls['description'].setValue(
        this.editData.description
      );

      this.groupMasterForm.addControl(
        'id',
        new FormControl('', Validators.required)
      );
      this.groupMasterForm.controls['id'].setValue(this.editData.id);
    }

    this.getAllDetailsForms();

    this.userIdFromStorage = localStorage.getItem('transactionUserId');
    this.groupMasterForm.controls['transactionUserId'].setValue(
      this.userIdFromStorage
    );
  }

  getJournals(fiscalYear: any) {
    this.api.getJournals().subscribe({
      next: (res) => {
        this.journalsList = res;
        // console.log("fiscalYear Pass: ", fiscalYear);

        console.log('journals res: ', this.journalsList);

        this.journalsList = res.filter((journal: any) => {
          if (journal.fiscalYearId) {
            // console.log("journals fiscalYear not null: ", journal);

            return journal.fiscalYearId == fiscalYear;
          } else return false;
          // console.log("matched Id & HeaderId : ", a.HeaderId === id)
        });

        // console.log("journals res after filter: ", this.journalsList);

        // this.journalsList = res.find((journal: { fiscalYearId: any; }) => journal.fiscalYearId == fiscalYear);
        // console.log("journals res after filter: ", this.journalsList);
      },
      error: (err) => {
        console.log('fetch journals data err: ', err);
        // alert("خطا اثناء جلب الدفاتر !");
      },
    });
  }

  getFiAccounts() {
    this.api.getFiAccounts().subscribe({
      next: (res) => {
        this.accountsList = res;
        // console.log("accounts res: ", this.accountsList);
      },
      error: (err) => {
        console.log('fetch accounts data err: ', err);
        // alert("خطا اثناء جلب الدفاتر !");
      },
    });
  }

  getFiAccountItems() {
    this.api.getFiAccountItems().subscribe({
      next: (res) => {
        this.accountItemsList = res;
        // console.log("accountItems res: ", this.accountItemsList);
      },
      error: (err) => {
        console.log('fetch accountItems data err: ', err);
        // alert("خطا اثناء جلب الدفاتر !");
      },
    });
  }

  getFiEntrySource() {
    this.api.getFiEntrySource().subscribe({
      next: (res) => {
        this.sourcesList = res;
        // console.log("sourcesList res: ", this.sourcesList);
      },
      error: (err) => {
        console.log('fetch sourcesList data err: ', err);
        // alert("خطا اثناء جلب الانواع !");
      },
    });
  }

  async getFiscalYears() {
    this.api.getFiscalYears().subscribe({
      next: async (res) => {
        this.fiscalYearsList = res;

        this.api.getLastFiscalYear().subscribe({
          next: async (res) => {
            // this.defaultFiscalYearSelectValue = await this.fiscalYearsList.find((yearList: { fiscalyear: number; }) => yearList.fiscalyear == new Date().getFullYear());
            this.defaultFiscalYearSelectValue = await res;
            console.log(
              'selectedYearggggggggggggggggggg: ',
              this.defaultFiscalYearSelectValue
            );
            if (this.editData) {
              this.groupMasterForm.controls['fiscalYearId'].setValue(
                this.editData.fiscalYearId
              );
              this.fiscalYearValueChanges(
                this.groupMasterForm.getRawValue().fiscalYearId
              );
            } else {
              this.groupMasterForm.controls['fiscalYearId'].setValue(
                this.defaultFiscalYearSelectValue.id
              );
              this.fiscalYearValueChanges(
                this.groupMasterForm.getRawValue().fiscalYearId
              );
              // this.getStrOpenAutoNo();
            }
          },
          error: (err) => {
            // console.log("fetch store data err: ", err);
            // alert("خطا اثناء جلب المخازن !");
          },
        });
      },
      error: (err) => {
        // console.log("fetch fiscalYears data err: ", err);
        // alert("خطا اثناء جلب العناصر !");
      },
    });
  }

  async fiscalYearValueChanges(fiscalyaerId: any) {
    console.log('fiscalyaer: ', fiscalyaerId);
    // this.fiscalYearSelectedId = await fiscalyaerId;
    this.groupMasterForm.controls['fiscalYearId'].setValue(fiscalyaerId);
    // this.isEdit = false;

    // this.getStrOpenAutoNo();
    this.getJournals(this.groupMasterForm.getRawValue().fiscalYearId);
  }

  getAllDetailsForms() {
    // console.log("edddit get all data: ", this.editData)
    console.log("mastered row get all data: ", this.getMasterRowId)
    if (this.getMasterRowId) {
      this.api.getFiEntryDetailsByMasterId(this.getMasterRowId.id).subscribe({
        next: (res) => {
          // this.itemsList = res;
          this.matchedIds = res;
          console.log("eeeeeeeeeeeeeeeeeeeeeeeeeeee: ", res);

          if (this.matchedIds) {
            // console.log("eeeeeeeeeeeeeeeeeeeeeeeeeeee: ", res);
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

  async nextToAddFormDetails() {
    this.groupMasterForm.removeControl('id');

    this.groupMasterForm.controls['creditTotal'].setValue(0);
    this.groupMasterForm.controls['debitTotal'].setValue(0);
    this.groupMasterForm.controls['balance'].setValue(0);
    this.groupMasterForm.controls['state'].setValue('مغلق');

    console.log('fiEntry master form: ', this.groupMasterForm.value);

    if (this.groupMasterForm.valid) {
      console.log('Master add form : ', this.groupMasterForm.value);
      this.api.postFiEntry(this.groupMasterForm.value).subscribe({
        next: (res) => {
          console.log('ID fiEntry after post: ', res);
          this.getMasterRowId = {
            id: res,
          };
          console.log('mastered res: ', this.getMasterRowId.id);
          this.MasterGroupInfoEntered = true;

          // alert("تم الحفظ بنجاح");
          this.toastrSuccess();
          this.getAllDetailsForms();
          this.addDetailsInfo();
        },
        error: (err) => {
          console.log('header post err: ', err);
          // alert("حدث خطأ أثناء إضافة مجموعة")
        },
      });
    }
  }

  async addDetailsInfo() {
    console.log(
      'check id for insert: ',
      this.getDetailedRowData,
      'edit data form: ',
      this.editData,
      'main id: ',
      this.getMasterRowId.id
    );

    if (this.getMasterRowId.id) {
      if (this.getMasterRowId.id) {
        console.log(
          'form  headerId: ',
          this.getMasterRowId,
          'details form: ',
          this.groupDetailsForm.value
        );

        if (
          this.groupDetailsForm.getRawValue().credit ||
          this.groupDetailsForm.getRawValue().debit
        ) {
          if (this.editData) {
            console.log('found details: ', this.editData);
            this.sumOfCreditTotals = this.editData.creditTotal;
            this.sumOfDebitTotals = this.editData.debitTotal;

            this.sumOfCreditTotals =
              this.sumOfCreditTotals +
              this.groupDetailsForm.getRawValue().credit;
            this.sumOfDebitTotals =
              this.sumOfDebitTotals + this.groupDetailsForm.getRawValue().debit;
            this.groupMasterForm.controls['creditTotal'].setValue(
              this.sumOfCreditTotals
            );
            this.groupMasterForm.controls['debitTotal'].setValue(
              this.sumOfDebitTotals
            );

            if (this.sumOfCreditTotals > this.sumOfDebitTotals) {
              this.resultOfBalance =
                this.sumOfCreditTotals - this.sumOfDebitTotals;
              this.groupMasterForm.controls['balance'].setValue(
                this.resultOfBalance
              );
            } else {
              this.resultOfBalance =
                this.sumOfDebitTotals - this.sumOfCreditTotals;
              this.groupMasterForm.controls['balance'].setValue(
                this.resultOfBalance
              );
            }

            if (this.resultOfBalance == 0) {
              this.groupMasterForm.controls['state'].setValue('مغلق');
            } else {
              this.groupMasterForm.controls['state'].setValue('مفتوح');
            }
          } else {
            console.log(
              'found details withoutEdit: ',
              this.groupDetailsForm.value
            );
            this.sumOfCreditTotals =
              this.sumOfCreditTotals +
              this.groupDetailsForm.getRawValue().credit;
            this.sumOfDebitTotals =
              this.sumOfDebitTotals + this.groupDetailsForm.getRawValue().debit;
            this.groupMasterForm.controls['creditTotal'].setValue(
              this.sumOfCreditTotals
            );
            this.groupMasterForm.controls['debitTotal'].setValue(
              this.sumOfDebitTotals
            );

            if (this.sumOfCreditTotals > this.sumOfDebitTotals) {
              this.resultOfBalance =
                this.sumOfCreditTotals - this.sumOfDebitTotals;
              this.groupMasterForm.controls['balance'].setValue(
                this.resultOfBalance
              );
            } else {
              this.resultOfBalance =
                this.sumOfDebitTotals - this.sumOfCreditTotals;
              this.groupMasterForm.controls['balance'].setValue(
                this.resultOfBalance
              );
            }

            if (this.resultOfBalance == 0) {
              this.groupMasterForm.controls['state'].setValue('مغلق');
            } else {
              this.groupMasterForm.controls['state'].setValue('مفتوح');
            }
          }
        }

        this.groupDetailsForm.controls['transactionUserId'].setValue(
          this.userIdFromStorage
        );
        this.groupDetailsForm.controls['entryId'].setValue(
          this.getMasterRowId.id
        );

        console.log(
          'add details second time, get detailed row data: ',
          !this.getDetailedRowData
        );

        // alert("item name controller: " + this.groupDetailsForm.getRawValue().itemName + " transactionUserId controller: " + this.groupDetailsForm.getRawValue().transactionUserId)

        console.log(
          'add details second time, details form: ',
          this.groupDetailsForm.value
        );
        console.log(
          'add details second time, get detailed row data: ',
          !this.getDetailedRowData
        );

        if (this.groupDetailsForm.valid && !this.getDetailedRowData) {
          this.api.postFiEntryDetails(this.groupDetailsForm.value).subscribe({
            next: (res) => {
              this.getDetailsRowId = {
                id: res,
              };
              console.log('Details res: ', this.getDetailsRowId.id);
              // alert("postDetails res credit: " + this.sumOfCreditTotals + " credit res: " + res.credit)

              // alert("تمت إضافة التفاصيل بنجاح");
              this.toastrSuccess();
              this.groupDetailsForm.reset();
              this.getAllDetailsForms();
              this.updateDetailsForm();
            },
            error: () => {
              // alert("حدث خطأ أثناء إضافة مجموعة")
            },
          });
        } else {
          this.updateBothForms();
        }
      }
    } else {
      this.updateDetailsForm();
    }
  }

  async updateDetailsForm() {
    if (this.editData) {
      this.groupMasterForm.addControl(
        'id',
        new FormControl('', Validators.required)
      );
      this.groupMasterForm.controls['id'].setValue(this.editData.id);
    }

    this.groupMasterForm.addControl(
      'id',
      new FormControl('', Validators.required)
    );
    this.groupMasterForm.controls['id'].setValue(this.getMasterRowId.id);
    console.log(
      'enteeeeeeeeeer to update master form: ',
      this.groupMasterForm.getRawValue().creditTotal
    );
    console.log(
      'update master form: ',
      this.groupMasterForm.value,
      'update details form: ',
      this.groupDetailsForm.value
    );
    this.api.putFiEntry(this.groupMasterForm.value).subscribe({
      next: (res) => {
        // alert("تم التعديل بنجاح");
        console.log(
          'update res: ',
          res,
          'details form values: ',
          this.groupDetailsForm.value,
          'details id: ',
          this.getDetailedRowData
        );
        if (this.groupDetailsForm.value && this.getDetailedRowData) {
          this.groupDetailsForm.addControl(
            'id',
            new FormControl('', Validators.required)
          );
          this.groupDetailsForm.controls['id'].setValue(
            this.getDetailedRowData.id
          );

          if (!this.groupDetailsForm.getRawValue().credit) {
            console.log('enter credit only');
            this.groupDetailsForm.controls['credit'].setValue(
              this.getDetailedRowData.credit
            );
          } else if (!this.groupDetailsForm.getRawValue().debit) {
            console.log('enter debit only');
            this.groupDetailsForm.controls['debit'].setValue(
              this.getDetailedRowData.debit
            );
          }

          console.log(
            'details form submit to edit: ',
            this.groupDetailsForm.value
          );

          this.api.putFiEntryDetails(this.groupDetailsForm.value).subscribe({
            next: (res) => {
              // alert("تم تحديث التفاصيل بنجاح");
              this.toastrSuccess();
              // console.log("update res: ", res);
              this.groupDetailsForm.reset();
              this.getAllDetailsForms();
              this.getDetailedRowData = '';
            },
            error: (err) => {
              // console.log("update err: ", err)
              // alert("خطأ أثناء تحديث سجل المجموعة !!")
            },
          });
          this.groupDetailsForm.removeControl('id');
        }
      },
      error: () => {
        // alert("خطأ أثناء تحديث سجل الصنف !!")
      },
    });
  }

  updateBothForms() {
    // console.log("pass id: ", this.getMasterRowId.id, "pass No: ", this.groupMasterForm.getRawValue().no, "pass StoreId: ", this.groupMasterForm.getRawValue().storeId, "pass Date: ", this.groupMasterForm.getRawValue().date)
    if (
      this.groupMasterForm.getRawValue().no != '' &&
      this.groupMasterForm.getRawValue().storeId != '' &&
      this.groupMasterForm.getRawValue().fiscalYearId != '' &&
      this.groupMasterForm.getRawValue().date != ''
    ) {
      this.groupDetailsForm.controls['entryId'].setValue(
        this.getMasterRowId.id
      );
      this.updateDetailsForm();
    }
  }

  editDetailsForm(row: any) {
    this.dialog
      .open(CcEntryDetailsDialogComponent, {
        width: '95%',
        height: '78%',
        data: row,
      })
      .afterClosed()
      .subscribe((val) => {
        if (val === 'save' || val === 'update') {
          this.getAllDetailsForms();
        }
      });
  }

  deleteFormDetails(id: number) {
    console.log('details id: ', id);

    var result = confirm('هل ترغب بتاكيد الحذف ؟');
    if (result) {
      this.api.deleteCcEntryDetails(id).subscribe({
        next: (res) => {
          // alert("تم الحذف بنجاح");
          this.toastrDeleteSuccess();
          this.getAllDetailsForms();
        },
        error: () => {
          // alert("خطأ أثناء حذف التفاصيل !!");
        },
      });
    }
  }

  // getItemByID(id: any) {
  //   // console.log("row item id: ", id);
  //   return fetch(this.api.getItemById(id))
  //     .then((response) => response.json())
  //     .then((json) => {
  //       console.log('fetch item name by id res: ', json.name);
  //       return json.name;
  //     })
  //     .catch((err) => {
  //       // console.log("error in fetch item name by id: ", err);
  //       // alert("خطا اثناء جلب رقم العنصر !");
  //     });
  // }

  toastrSuccess(): void {
    this.toastr.success('تم الحفظ بنجاح');
  }
  toastrDeleteSuccess(): void {
    this.toastr.success('تم الحذف بنجاح');
  }
  getAllMasterForms() {
    // let result = window.confirm('هل تريد اغلاق الطلب');
    // if (result) {
      this.dialogRef.close('save');

      this.api.getFiEntry().subscribe({
        next: (res) => {
          // this.groupDetailsForm.controls['itemName'].setValue(this.itemName);
          this.dataSource = new MatTableDataSource(res);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        },
        error: () => {
          // alert("خطأ أثناء جلب سجلات المجموعة !!");
        },
      });
    // }
  }

  async updateMaster() {
    console.log('nnnvvvvvvvvvv: ', this.groupMasterForm.value);

    console.log(
      'update both: ',
      this.groupDetailsForm.valid,
      'ooo:',
      !this.getDetailedRowData
    );
    // console.log("edit : ", this.groupDetailsForm.value)
    this.api.putFiEntry(this.groupMasterForm.value).subscribe({
      next: (res) => {
        this.groupDetailsForm.reset();
        this.getDetailedRowData = '';
      },
    });
  }
  OpenDetailsDialog() {
    this.router.navigate(['/fi-entry', { masterId: this.getMasterRowId.id }]);
    this.dialog
      .open(CcEntryDetailsDialogComponent, {
        width: '95%',
        height: '78%',
      })
      .afterClosed()
      .subscribe((val) => {
        if (val === 'save' || val === 'update') {
          this.getAllDetailsForms();
        }
      });
  }
}
