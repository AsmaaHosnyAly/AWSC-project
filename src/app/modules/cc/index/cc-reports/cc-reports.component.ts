



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

export class account {
  constructor(public code: number,public id: number, public name: string) { }
}


export class store {
  constructor(public id: number, public name: string) { }
}

@Component({
  selector: 'app-cc-reports',
  templateUrl: './cc-reports.component.html',
  styleUrls: ['./cc-reports.component.css']
})
export class CcReportsComponent implements OnInit {
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


  accountCode:any;
  accountList:account[] = [];
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
    @Inject(LOCALE_ID) private locale: string
  ) {


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

    // this.getfiAccounts();

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
     this.accountCode=account.code;
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

  // getfiAccounts(){
  //   this.api.getAccount().subscribe({
  //     next: (res) => {
  //       this.accountList = res;
  //       console.log('items res: ', this.accountList);
  //     },
  //     error: (err) => {
  //       console.log('fetch items data err: ', err);
  //       // alert("خطا اثناء جلب العناصر !");
  //     },
  //   });
  // }
  downloadPrint(

    StartDate: any,
    EndDate: any,

    report: any,
    reportType: any
  ) {

    let account = this.groupMasterForm.getRawValue().accountId;

    this.api
      .getAccountreports(

    
        StartDate,
        EndDate,

        account,

        report,
        'pdf'
      )
      .subscribe({
        next: (res) => {
          console.log('search:', res);
          const url: any = res.url;
          window.open(url);
          // let blob: Blob = res.body as Blob;
          // let url = window.URL.createObjectURL(blob);

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





 
  refreshData() {
    this.groupMasterForm.reset();
  }

  previewPrint(

    StartDate: any,
    EndDate: any,

    report: any,
    reportType: any
  ) {

    let account = this.accountCode;
    console.log("reportt nMAE", report);
    if (report != null && reportType != null) {
      console.log("in iff conditionnnn")
      this.api
        .getAccountreports(
         
          StartDate,
          EndDate,
          account,
          report, 'pdf'
        )
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

    else {
      alert('ادخل التقرير و نوع التقرير!');
    }
  }

  toastrDeleteSuccess(): void {
    this.toastr.success('تم الحذف بنجاح');
  }
}
