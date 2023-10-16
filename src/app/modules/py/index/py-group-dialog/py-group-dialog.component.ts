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
import { GlobalService } from 'src/app/pages/services/global.service';
import { Router, Params } from '@angular/router';
import { Observable, map, startWith } from 'rxjs';
import { Hotkey, HotkeysService } from 'angular2-hotkeys';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { PyGroupDetailDialogComponent } from '../py-group-detail-dialog/py-group-detail-dialog.component';
import { PyGroupDetailEmployeeDialogComponent } from '../py-group-detail-employee-dialog/py-group-detail-employee-dialog.component';


export class PyItem {
  constructor(public id: number, public name: string) { }
}

@Component({
  selector: 'app-py-group-dialog',
  templateUrl: './py-group-dialog.component.html',
  styleUrls: ['./py-group-dialog.component.css']
})

export class PyGroupDialogComponent implements OnInit {
  transactionUserId = localStorage.getItem('transactionUserId')
  groupDetailsForm!: FormGroup;
  groupMasterForm!: FormGroup;
  actionBtnMaster: string = 'Save';
  actionBtnDetails: string = 'Save';
  MasterGroupInfoEntered = false;
  dataSource!: MatTableDataSource<any>;
  dataSourceEmployee!: MatTableDataSource<any>;
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

  displayedColumns: string[] = ['pyItemName', 'action'];
  displayedEmployeesColumns: string[] = ['employeeName', 'action'];

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
    private dialogRef: MatDialogRef<PyGroupDialogComponent>,
    private router: Router
  ) {
    this.currentDate = new Date();
  }

  ngOnInit(): void {

    // this.getFiscalYears();
    // this.getFiAccounts();
    // this.getFiAccountItems();
    // this.getFiEntrySource();
    // this.global.test = this.test;

    this.getMasterRowId = this.editData;

    this.groupMasterForm = this.formBuilder.group({
      name: ['', Validators.required],
      transactionUserId: ['', Validators.required]
    });

    // this.groupDetailsForm = this.formBuilder.group({
    //   entryId: ['', Validators.required],
    //   credit: ['', Validators.required],
    //   debit: ['', Validators.required],
    //   accountId: ['', Validators.required],
    //   fiAccountItemId: ['', Validators.required],
    //   transactionUserId: ['', Validators.required],
    // });

    if (this.editData) {
      console.log('master edit form: ', this.editData);
      this.actionBtnMaster = 'Update';
      this.groupMasterForm.controls['name'].setValue(this.editData.name);
      this.groupMasterForm.controls['transactionUserId'].setValue(this.editData.transactionUserId);

      this.groupMasterForm.addControl('id', new FormControl('', Validators.required));
      this.groupMasterForm.controls['id'].setValue(this.editData.id);
    }

    this.getAllDetailsForms();
    this.getAllDetailsEmployeeForms();
  }

  getAllDetailsForms() {

    console.log("mastered row get all data: ", this.getMasterRowId)
    if (this.getMasterRowId) {
      this.api.getPyItemGroupDetailsByHeaderId(this.getMasterRowId.id).subscribe({
        next: (res) => {

          this.matchedIds = res;
          console.log("eeeeeeeeeeeeeeeeeeeeeeeeeeee: ", res);

          if (this.matchedIds) {

            this.dataSource = new MatTableDataSource(this.matchedIds);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;

            // this.sumOfTotals = 0;
            // for (let i = 0; i < this.matchedIds.length; i++) {
            //   this.updateMaster();
            // }
          }
        },
        error: (err) => {
          // console.log("fetch items data err: ", err);
          // alert("خطا اثناء جلب العناصر !");
        }
      })
    }
  }

  getAllDetailsEmployeeForms() {

    console.log("mastered row get all data: ", this.getMasterRowId)
    if (this.getMasterRowId) {
      this.api.getPyItemGroupEmployeeByHeaderId(this.getMasterRowId.id).subscribe({
        next: (res) => {

          this.matchedIds = res;
          console.log("eeeeeeeeeeeeeeeeeeeeeeeeeeee: ", res);

          if (this.matchedIds) {

            this.dataSourceEmployee = new MatTableDataSource(this.matchedIds);
            this.dataSourceEmployee.paginator = this.paginator;
            this.dataSourceEmployee.sort = this.sort;

            // this.sumOfTotals = 0;
            // for (let i = 0; i < this.matchedIds.length; i++) {
            //   this.updateMaster();
            // }
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
    this.groupMasterForm.controls['transactionUserId'].setValue(this.transactionUserId);

    console.log('fiEntry master form: ', this.groupMasterForm.value);

    if (this.groupMasterForm.valid) {
      console.log('Master add form : ', this.groupMasterForm.value);
      this.api.postPyItemGroup(this.groupMasterForm.value).subscribe({
        next: (res) => {
          console.log('ID itemGroup after post: ', res);
          this.getMasterRowId = {
            id: res,
          };
          console.log('mastered res: ', this.getMasterRowId.id);
          this.MasterGroupInfoEntered = true;

          // alert("تم الحفظ بنجاح");
          this.toastrSuccess();
          this.getAllDetailsForms();
          this.getAllDetailsEmployeeForms();
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
    console.log('check id for insert: ', this.getDetailedRowData, 'edit data form: ', this.editData, 'main id: ', this.getMasterRowId.id);

    if (this.getMasterRowId.id) {
      if (this.getMasterRowId.id) {
        console.log('form  headerId: ', this.getMasterRowId);

        // // this.groupDetailsForm.controls['transactionUserId'].setValue(this.transactionUserId);
        // // this.groupDetailsForm.controls['entryId'].setValue(this.getMasterRowId.id);

        // console.log(
        //   'add details second time, get detailed row data: ',
        //   !this.getDetailedRowData
        // );

        // // alert("item name controller: " + this.groupDetailsForm.getRawValue().itemName + " transactionUserId controller: " + this.groupDetailsForm.getRawValue().transactionUserId)

        // console.log(
        //   'add details second time, details form: ',
        //   this.groupDetailsForm.value
        // );
        // console.log(
        //   'add details second time, get detailed row data: ',
        //   !this.getDetailedRowData
        // );

        // if (this.groupDetailsForm.valid && !this.getDetailedRowData) {
        //   this.api.postPyItemGroupDetails(this.groupDetailsForm.value).subscribe({
        //     next: (res) => {
        //       this.getDetailsRowId = {
        //         id: res,
        //       };
        //       console.log('Details res: ', this.getDetailsRowId.id);
        //       // alert("postDetails res credit: " + this.sumOfCreditTotals + " credit res: " + res.credit)

        //       // alert("تمت إضافة التفاصيل بنجاح");
        //       this.toastrSuccess();
        //       this.groupDetailsForm.reset();
        //       this.getAllDetailsForms();
        //       this.updateDetailsForm();
        //     },
        //     error: () => {
        //       // alert("حدث خطأ أثناء إضافة مجموعة")
        //     },
        //   });
        // } else {
        //   this.updateBothForms();
        // }

      }
    }
    else {
      // this.updateDetailsForm();
      this.updateMaster();
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
    this.api.putPyItemGroup(this.groupMasterForm.value).subscribe({
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

          this.api.putPyItemGroupDetails(this.groupDetailsForm.value).subscribe({
            next: (res) => {
              // alert("تم تحديث التفاصيل بنجاح");
              this.toastrSuccess();
              // console.log("update res: ", res);
              this.groupDetailsForm.reset();
              this.getAllDetailsForms();
              this.getAllDetailsEmployeeForms();
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
      .open(PyGroupDetailDialogComponent, {
        width: '40%',
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
      this.api.deletePyItemGroupDetails(id).subscribe({
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

  editDetailsEmployeeForm(row: any) {
    this.dialog
      .open(PyGroupDetailEmployeeDialogComponent, {
        width: '40%',
        height: '78%',
        data: row,
      })
      .afterClosed()
      .subscribe((val) => {
        if (val === 'save' || val === 'update') {
          this.getAllDetailsEmployeeForms();
        }
      });
  }

  deleteFormDetailsEmployee(id: number) {
    console.log('details id: ', id);

    var result = confirm('هل ترغب بتاكيد الحذف ؟');
    if (result) {
      this.api.deletePyItemGroupEmployee(id).subscribe({
        next: (res) => {
          // alert("تم الحذف بنجاح");
          this.toastrDeleteSuccess();
          this.getAllDetailsEmployeeForms();
        },
        error: () => {
          // alert("خطأ أثناء حذف التفاصيل !!");
        },
      });
    }
  }

  /////////////////////////////////////////////////////////////////////////////////////
  getAllMasterForms() {
    // let result = window.confirm('هل تريد اغلاق الطلب');
    // if (result) {
    this.dialogRef.close('save');

    this.api.getPyItemGroup().subscribe({
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

    console.log('ooo:', !this.getDetailedRowData);

    this.api.putPyItemGroup(this.groupMasterForm.value).subscribe({
      next: (res) => {
        // this.groupDetailsForm.reset();
        this.toastrUpdateSuccess();
        this.getDetailedRowData = '';
      },
    });
  }

  OpenDetailsDialog() {
    this.router.navigate(['/PyItemGroup', { masterId: this.getMasterRowId.id }]);
    this.dialog
      .open(PyGroupDetailDialogComponent, {
        width: '40%',
        height: '78%',
      })
      .afterClosed()
      .subscribe((val) => {
        if (val === 'save' || val === 'update') {
          this.getAllDetailsForms();
        }
      });
  }

  OpenDetailsEmployeeDialog() {
    this.router.navigate(['/PyItemGroup', { masterId: this.getMasterRowId.id }]);
    this.dialog
      .open(PyGroupDetailEmployeeDialogComponent, {
        width: '40%',
        height: '78%',
      })
      .afterClosed()
      .subscribe((val) => {
        if (val === 'save' || val === 'update') {
          this.getAllDetailsEmployeeForms();
        }
      });
  }

  toastrSuccess(): void {
    this.toastr.success('تم الحفظ بنجاح');
  }
  toastrUpdateSuccess(): void {
    this.toastr.success('تم التعديل بنجاح');
  }
  toastrDeleteSuccess(): void {
    this.toastr.success('تم الحذف بنجاح');
  }
}
