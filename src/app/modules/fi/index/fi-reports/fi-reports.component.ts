
import { Component, Inject, LOCALE_ID, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from '../../services/api.service';
import { HttpClient } from '@angular/common/http';
import { formatDate } from '@angular/common';
// import { StrWithdrawDialogComponent } from '../str-withdraw-dialog2/str-withdraw-dialog2.component';
import { ToastrService } from 'ngx-toastr';
import { Observable, map, startWith, tap } from 'rxjs';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { PrintDialogComponent } from 'src/app/modules/str/index/print-dialog/print-dialog.component';
import { HotkeysService } from 'angular2-hotkeys';
import { Hotkey } from 'angular2-hotkeys';
import { DatePipe } from '@angular/common';
import { PagesEnums } from 'src/app/core/enums/pages.enum';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import jwt_decode from 'jwt-decode';

import {
  FormControl,
  FormControlName,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { GlobalService } from 'src/app/pages/services/global.service';

export class account {
  constructor(public code: number, public id: number, public name: string, global: GlobalService) {

  }
}


export class store {
  constructor(public id: number, public name: string) { }
}

@Component({
  selector: 'app-fi-reports',
  templateUrl: './fi-reports.component.html',
  styleUrls: ['./fi-reports.component.css']
})
export class FiReportsComponent implements OnInit {
  loading: boolean = false;

  // selectedValue = 'STRWithdrawReport';
  selectedValueType = 'pdf';
  // displayedColumns: string[] = [
  //   'no',
  //   'storeName',
  //   'employeeName',
  //   'desstoreName',
  //   'costCenterName',
  //   'fiscalyear',
  //   'date',
  //   'Action',
  // ];
  matchedIds: any;

  groupMasterForm!: FormGroup;




  defaultStoreSelectValue: any;
  userRoles: any;


  storeName: any;


  accountCode: any;
  accountList: account[] = [];
  accountCtrl: FormControl;
  filteredaccount: Observable<account[]>;
  selectedaccount: account | undefined;
  // userRoleaccountsAcc = PagesEnums.accountS_ACCOUNTS;
  // storeSelectedId: any;

  formcontrol = new FormControl('');
  dataSource2!: MatTableDataSource<any>;
  pdfurl = '';
  reportNameList: any;
  selectedReportNameTitle: any;
  reportTypeList: any;
  selectedReportTypeTitle: any;
  dateNow: any;
  nextDate: any;
  decodedToken: any;
  decodedToken2: any;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private api: ApiService,
    private dialog: MatDialog,
    private hotkeysService: HotkeysService,
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    @Inject(LOCALE_ID) private locale: string,
    global: GlobalService
  ) {
    global.getPermissionUserRoles('Accounts', 'fi-home', 'إدارة الحسابات ', 'iso')

    // this.reportNameList = [
    //   {
    //     titleval: 'STRItemsTransactionReport',
    //     titleval2: 'STRItemsTakingReport',

    //   },
    // ];

    // this.reportTypeList = [
    //   {
    //     titleval: 'pdf',
    //     titleval1: 'txt',
    //     titleval2: 'ppt',
    //   },
    // ];




    this.accountCtrl = new FormControl();
    this.filteredaccount = this.accountCtrl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filteraccounts(value))
    );
  }

  ngOnInit(): void {

    this.getfiAccounts();

    const accessToken: any = localStorage.getItem('accessToken');
    // console.log('accessToken', accessToken);
    // Decode the access token
    this.decodedToken = jwt_decode(accessToken);
    this.decodedToken2 = this.decodedToken.roles;
    console.log('accessToken2', this.decodedToken2);
    // this.selectedReportNameTitle = this.reportNameList[0].titleval;
    // console.log('select report name: ', this.selectedReportNameTitle);

    // this.selectedReportTypeTitle = this.reportTypeList[0].titleval;
    // console.log('select report type: ', this.selectedReportTypeTitle);


    this.dateNow = new Date;
    console.log('Date = ' + this.dateNow);

    this.nextDate = new Date;
    this.nextDate.setDate(this.nextDate.getDate() + 1);
    console.log('nrxtdate:', this.nextDate)
    // this.getAllMasterForms();
    // this.getaccounts();

    this.groupMasterForm = this.formBuilder.group({


      StartDate: [this.dateNow, Validators.required],
      EndDate: [this.nextDate, Validators.required],

      accountName: ['', Validators.required],
      accountId: ['', Validators.required],


      itemId: ['', Validators.required],
      itemName: ['', Validators.required],

      report: ['', Validators.required],
      reportType: ['', Validators.required],
      // item:['']
    });




  }

  ////storeeee
  displayaccountName(account: any): string {
    return account && account.name ? account.name : '';
  }
  accountSelected(event: MatAutocompleteSelectedEvent): void {
    const account = event.option.value as account;
    console.log('account selected: ', account);
    this.selectedaccount = account;
    this.groupMasterForm.patchValue({ accountId: account.id });
    console.log('account in form: ', this.groupMasterForm.getRawValue().accountId);
    this.accountCode = account.code;
  }
  private _filteraccounts(value: string): account[] {
    const filterValue = value;
    return this.accountList.filter((account: { name: string }) =>
      account.name.toLowerCase().includes(filterValue)
    );
  }

  openAutoaccount() {
    this.accountCtrl.setValue(''); // Clear the input field value

    // Open the autocomplete dropdown by triggering the value change event
    this.accountCtrl.updateValueAndValidity();
  }

  getfiAccounts() {
    this.loading = true;

    this.api.getAccount().subscribe({
      next: (res) => {
        this.loading = false;

        this.accountList = res;
        console.log('items res: ', this.accountList);
      },
      error: (err) => {
        this.loading = false;
        console.log('fetch items data err: ', err);
        // alert("خطا اثناء جلب العناصر !");
      },
    });
  }
  downloadPrint(
    StartDate: any,
    EndDate: any,
    report: any,
    reportType: any
  ) {

    let account = this.groupMasterForm.getRawValue().accountId;

    // let account = this.accountCode;
    console.log("reportt name", report);
    if (report && reportType) {

      StartDate = formatDate(StartDate, 'MM-dd-yyyy', this.locale);
      // alert("startDate: " + StartDate);

      let LastYearStartDate = new Date(StartDate);
      LastYearStartDate.setFullYear(LastYearStartDate.getFullYear() - 1);
      let prevStartDate = formatDate(LastYearStartDate, 'MM-dd-yyyy', this.locale);
      // alert("prevStartDate: " + prevStartDate);


      EndDate = formatDate(EndDate, 'MM-dd-yyyy', this.locale);
      // alert("EndDate: " + EndDate);

      let LastYearEndDate = new Date(EndDate);
      LastYearEndDate.setFullYear(LastYearEndDate.getFullYear() - 1);
      let prevEndDate = formatDate(LastYearEndDate, 'MM-dd-yyyy', this.locale);
      // alert("prevEndDate: " + prevEndDate);

      if (report == 'AccountMasterReport' || report == 'AccountMasterDetailsReport') {
        if (!account) {
          this.toastrWarningInputValid();
        }
        else {
          this.api
            .getAccountreports(StartDate, EndDate, prevStartDate, prevEndDate, account, report, reportType)
            .subscribe({
              next: (res) => {
                // let blob: Blob = res.body as Blob;
                // console.log(blob);
                // let url = window.URL.createObjectURL(blob);
                // localStorage.setItem('url', JSON.stringify(url));
                // this.pdfurl = url;
                // this.dialog.open(PrintDialogComponent, {
                //   width: '50%',
                // });

                console.log('download:', res);
                const url: any = res.url;
                window.open(url);
              },
              error: (err) => {
                console.log('eroorr', err);
                window.open(err.url);
              },
            });

        }
      }
      else {
        this.api
          .getAccountreports(StartDate, EndDate, prevStartDate, prevEndDate, account, report, reportType)
          .subscribe({
            next: (res) => {
              // let blob: Blob = res.body as Blob;
              // console.log(blob);
              // let url = window.URL.createObjectURL(blob);
              // localStorage.setItem('url', JSON.stringify(url));
              // this.pdfurl = url;
              // this.dialog.open(PrintDialogComponent, {
              //   width: '50%',
              // });
              console.log('download:', res);
              const url: any = res.url;
              window.open(url);
            },
            error: (err) => {
              console.log('eroorr', err);
              window.open(err.url);
            },
          });

      }

    }
    else {
      alert('ادخل التقرير و نوع التقرير!');
    }


  }


  refreshData() {
    this.accountCtrl.reset();
    this.groupMasterForm.reset();
  }

  previewPrint(
    StartDate: any,
    EndDate: any,
    report: any,
    reportType: any
  ) {

    let account = this.accountCode;
    console.log("reportt name", report);
    if (report && reportType) {

      StartDate = formatDate(StartDate, 'MM-dd-yyyy', this.locale);
      // alert("startDate: " + StartDate);

      let LastYearStartDate = new Date(StartDate);
      LastYearStartDate.setFullYear(LastYearStartDate.getFullYear() - 1);
      let prevStartDate = formatDate(LastYearStartDate, 'MM-dd-yyyy', this.locale);
      // alert("prevStartDate: " + prevStartDate);


      EndDate = formatDate(EndDate, 'MM-dd-yyyy', this.locale);
      // alert("EndDate: " + EndDate);

      let LastYearEndDate = new Date(EndDate);
      LastYearEndDate.setFullYear(LastYearEndDate.getFullYear() - 1);
      let prevEndDate = formatDate(LastYearEndDate, 'MM-dd-yyyy', this.locale);
      // alert("prevEndDate: " + prevEndDate);

      if (report == 'AccountMasterReport' || report == 'AccountMasterDetailsReport') {
        if (!account) {
          this.toastrWarningInputValid();
        }
        else {
          this.api
            .getAccountreports(StartDate, EndDate, prevStartDate, prevEndDate, account, report, reportType)
            .subscribe({
              next: (res) => {
                let blob: Blob = res.body as Blob;
                console.log(blob);
                let url = window.URL.createObjectURL(blob);
                localStorage.setItem('url', JSON.stringify(url));
                this.pdfurl = url;
                this.dialog.open(PrintDialogComponent, {
                  width: '50%',
                });

                // this.dataSource = res;
                // this.dataSource.paginator = this.paginator;
                // this.dataSource.sort = this.sort;
              },
              error: (err) => {
                console.log('eroorr', err);
                window.open(err.url);
              },
            });
        }
      }
      else {
        this.api
          .getAccountreports(StartDate, EndDate, prevStartDate, prevEndDate, account, report, reportType)
          .subscribe({
            next: (res) => {
              let blob: Blob = res.body as Blob;
              console.log(blob);
              let url = window.URL.createObjectURL(blob);
              localStorage.setItem('url', JSON.stringify(url));
              this.pdfurl = url;
              this.dialog.open(PrintDialogComponent, {
                width: '50%',
              });

              // this.dataSource = res;
              // this.dataSource.paginator = this.paginator;
              // this.dataSource.sort = this.sort;
            },
            error: (err) => {
              console.log('eroorr', err);
              window.open(err.url);
            },
          });
      }
    }
    else {
      alert('ادخل التقرير و نوع التقرير!');
    }
  }

  toastrDeleteSuccess(): void {
    this.toastr.success('تم الحذف بنجاح');
  }

  toastrWarningInputValid(): void {
    this.toastr.warning('اختر حساب من فضلك ! ');
  }
}