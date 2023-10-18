import { FiscalYear } from '../str-employee-exchange-dialog/str-employee-exchange-dialog.component';
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
import { PrintDialogComponent } from '../print-dialog/print-dialog.component';
import { HotkeysService } from 'angular2-hotkeys';
import { Hotkey } from 'angular2-hotkeys';
import { DatePipe } from '@angular/common';
import { PagesEnums } from 'src/app/core/enums/pages.enum';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import {
  FormControl,
  FormControlName,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';

export class item {
  constructor(public id: number, public name: string) { }
}


export class store {
  constructor(public id: number, public name: string) { }
}

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {
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



  itemsList: item[] = [];
  itemCtrl: FormControl;
  filtereditem: Observable<item[]>;
  selecteditem: item | undefined;
  defaultStoreSelectValue: any;
  userRoles: any;


  storeName: any;
  storeList: any;
  storeCtrl: FormControl;
  filteredstore: Observable<store[]>;
  selectedstore: store | undefined;
  userRoleStoresAcc = PagesEnums.STORES_ACCOUNTS;
  storeSelectedId: any;

  formcontrol = new FormControl('');
  dataSource2!: MatTableDataSource<any>;
  pdfurl = '';
  reportNameList: any;
  selectedReportNameTitle: any;
  reportTypeList: any;
  selectedReportTypeTitle: any;
  dateNow: any;
  nextDate: any;
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


    this.itemCtrl = new FormControl();
    this.filtereditem = this.itemCtrl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filteritems(value))
    );

    this.storeCtrl = new FormControl();
    this.filteredstore = this.storeCtrl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filterstores(value))
    );
  }

  ngOnInit(): void {
    // this.selectedReportNameTitle = this.reportNameList[0].titleval;
    // console.log('select report name: ', this.selectedReportNameTitle);

    // this.selectedReportTypeTitle = this.reportTypeList[0].titleval;
    // console.log('select report type: ', this.selectedReportTypeTitle);


    this.dateNow = new Date;
    console.log('Date = ' + this.dateNow);

    this.nextDate = new Date;
    this.nextDate.setDate(this.nextDate.getDate() + 1);
    this.getItems();
    console.log('nrxtdate:', this.nextDate)
    // this.getAllMasterForms();
    this.getStores();

    this.groupMasterForm = this.formBuilder.group({

      item: [''],
      StartDate: [this.dateNow, Validators.required],
      EndDate: [this.nextDate, Validators.required],

      store: ['', Validators.required],
      storeId: ['', Validators.required],

      itemId: ['', Validators.required],
      itemName: ['', Validators.required],

      report: ['', Validators.required],
      reportType: ['', Validators.required],
      // item:['']
    });




  }







  getItems() {
    this.api.getItems().subscribe({
      next: (res) => {
        this.itemsList = res;
        console.log('items res: ', this.itemsList);
      },
      error: (err) => {
        console.log('fetch items data err: ', err);
        // alert("خطا اثناء جلب العناصر !");
      },
    });
  }
  // getStores() {
  //   this.api.getStore().subscribe({
  //     next: (res) => {
  //       this.storeList = res;
  //       // console.log("store res: ", this.storeList);
  //     },
  //     error: (err) => {
  //       // console.log("fetch store data err: ", err);
  //       // alert('خطا اثناء جلب المخازن !');
  //     },
  //   });
  // }
  getStores() {

    console.log("storereeeeeeeee")
    this.userRoles = localStorage.getItem('userRoles');
    console.log('userRoles: ', this.userRoles.includes(this.userRoleStoresAcc))

    if (this.userRoles.includes(this.userRoleStoresAcc)) {
      // console.log('user is manager -all stores available- , role: ', userRoles);

      this.api.getStore()
        .subscribe({
          next: (res) => {
            this.storeList = res;
            this.defaultStoreSelectValue = res[Object.keys(res)[0]];
            console.log("selected storebbbbbbbbbbbbbbbbbbbbbbbb: ", this.defaultStoreSelectValue);
            // if (this.groupMasterForm) {
            //   this.groupMasterForm.controls['storeId'].setValue(this.groupMasterForm.getRawValue().storeId);
            // }
            // else {
            console.log("selected new data : ", this.defaultStoreSelectValue.storeId);

            this.groupMasterForm.controls['storeId'].setValue(this.defaultStoreSelectValue.id);
            // }

          },
          error: (err) => {
            // console.log("fetch store data err: ", err);
            // alert("خطا اثناء جلب المخازن !");
          }
        })
    }
    else {
      this.api.getUserStores(localStorage.getItem('transactionUserId'))
        .subscribe({
          next: (res) => {
            this.storeList = res;
            console.log("storelist", this.storeList)
            this.defaultStoreSelectValue = res[Object.keys(res)[0]];
            console.log("selected storebbbbbbbbbbbbbbb user: ", this.defaultStoreSelectValue);
            // if (this.groupMasterForm) {
            //   console.log("selected edit data : ", this.groupMasterForm.value);
            //   console.log("storeId : ", this.groupMasterForm.getRawValue().storeId);

            //   this.groupMasterForm.controls['storeId'].setValue(this.groupMasterForm.getRawValue().storeId);
            // }
            // else {
            console.log("selected new data : ", this.defaultStoreSelectValue.storeId);
            this.groupMasterForm.controls['storeId'].setValue(this.defaultStoreSelectValue.storeId);
            // }

          },
          error: (err) => {
            // console.log("fetch store data err: ", err);
            // alert("خطا اثناء جلب المخازن !");
          }
        })
    }


  }


  storeValueChanges(storeId: any) {
    console.log("store: ", storeId)
    this.storeSelectedId = storeId;
    this.groupMasterForm.controls['storeId'].setValue(this.storeSelectedId);


  }






  /////itemmm
  displayitemName(item: any): string {
    return item && item.name ? item.name : '';
  }
  itemSelected(event: MatAutocompleteSelectedEvent): void {
    const item = event.option.value as item;
    console.log('item selected: ', item);
    this.selecteditem = item;
    this.groupMasterForm.patchValue({ itemId: item.id });
    console.log('item in form: ', this.groupMasterForm.getRawValue().itemId);
  }
  private _filteritems(value: string): item[] {
    const filterValue = value;
    return this.itemsList.filter((item: { name: string }) =>
      item.name.toLowerCase().includes(filterValue)
    );
  }

  openAutoitem() {
    this.itemCtrl.setValue(''); // Clear the input field value

    // Open the autocomplete dropdown by triggering the value change event
    this.itemCtrl.updateValueAndValidity();
  }

  ////storeeee
  displaystoreName(store: any): string {
    return store && store.name ? store.name : '';
  }
  storeSelected(event: MatAutocompleteSelectedEvent): void {
    const store = event.option.value as store;
    console.log('store selected: ', store);
    this.selectedstore = store;
    this.groupMasterForm.patchValue({ storeId: store.id });
    console.log('store in form: ', this.groupMasterForm.getRawValue().storeId);
  }
  private _filterstores(value: string): store[] {
    const filterValue = value;
    return this.storeList.filter((store: { name: string }) =>
      store.name.toLowerCase().includes(filterValue)
    );
  }

  openAutostore() {
    this.storeCtrl.setValue(''); // Clear the input field value

    // Open the autocomplete dropdown by triggering the value change event
    this.storeCtrl.updateValueAndValidity();
  }


  downloadPrint(

    StartDate: any,
    EndDate: any,

    report: any,
    reportType: any
  ) {

    let item = this.groupMasterForm.getRawValue().itemId;
    let store = this.groupMasterForm.getRawValue().storeId;

    this.api
      .getTranscriptreports(

        store,
        StartDate,
        EndDate,

        item,

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





  // printReport() {
  //   // this.loadAllData();
  //   let header: any = document.getElementById('header');
  //   let paginator: any = document.getElementById('paginator');
  //   let action1: any = document.getElementById('action1');
  //   let action2: any = document.querySelectorAll('action2');
  //   console.log(action2);
  //   let button1: any = document.querySelectorAll('#button1');
  //   console.log(button1);
  //   let button2: any = document.getElementById('button2');
  //   let button: any = document.getElementsByClassName('mdc-icon-button');
  //   console.log(button);
  //   let buttn: any = document.querySelectorAll('#buttn');
  //   for (let index = 0; index < buttn.length; index++) {
  //     buttn[index].hidden = true;
  //   }

  //   let actionHeader: any = document.getElementById('action-header');
  //   actionHeader.style.display = 'none';

  //   let reportFooter: any = document.getElementById('reportFooter');
  //   let date: any = document.getElementById('date');
  //   header.style.display = 'grid';
  //   // button1.style.display = 'none';
  //   // button2.style.display = 'none';

  //   let printContent: any = document.getElementById('content')?.innerHTML;
  //   let originalContent: any = document.body.innerHTML;
  //   document.body.innerHTML = printContent;
  //   // console.log(document.body.children);
  //   document.body.style.cssText =
  //     'direction:rtl;-webkit-print-color-adjust:exact;';
  //   window.print();
  //   document.body.innerHTML = originalContent;
  //   location.reload();
  // }
  refreshData() {
    this.groupMasterForm.reset();
  }

  previewPrint(

    StartDate: any,
    EndDate: any,

    report: any,
    reportType: any
  ) {

    let item = this.groupMasterForm.getRawValue().itemId;
    let store = this.groupMasterForm.getRawValue().storeId;
    console.log("reportt nMAE", report);
    if (report != null && reportType != null) {
      console.log("in iff conditionnnn")
      this.api
        .getTranscriptreports(
          store,
          StartDate,
          EndDate,
          item,
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