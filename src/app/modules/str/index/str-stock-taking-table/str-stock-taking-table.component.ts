


import { Component, Inject, LOCALE_ID, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from '../../services/api.service';
import { HttpClient } from '@angular/common/http';
import { formatDate } from '@angular/common';
import { StrOpeningStockDialogComponent } from '../str-opening-stock-dialog/str-opening-stock-dialog.component';
import { ToastrService } from 'ngx-toastr';
import { StrStockTakingDialogComponent } from '../str-stock-taking-dialog/str-stock-taking-dialog.component';

import { FormControl, FormControlName,FormBuilder,FormGroup } from '@angular/forms';
import { Observable, map, startWith, tap } from 'rxjs';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { HotkeysService } from 'angular2-hotkeys';
import { Hotkey } from 'angular2-hotkeys';



export class store {
  constructor(public id: number, public name: string) {}

}


export class Employee {
  constructor(public id: number, public name: string, public code: string) { }
}


// export class Employee {
//   constructor(public id: number, public name: string, public code: string) { }
// }

// export class costcenter {
//   constructor(public id: number, public name: string) { }
// }
export class item {
  constructor(public id: number, public name: string) {}
}




@Component({
  selector: 'app-str-stock-taking-table',
  templateUrl: './str-stock-taking-table.component.html',
  styleUrls: ['./str-stock-taking-table.component.css']
})
export class StrStockTakingTableComponent implements OnInit {
  displayedColumns: string[] = ['no','storeName', 'fiscalyear', 'date', 'Action'];
  matchedIds: any;
  // storeList: any;
  storeName: any;
  // costCentersList: any;


  storeList: store[] = [];
  storeCtrl: FormControl;
  filteredstore: Observable<store[]>;
  selectedstore: store | undefined;
  // employeesList: any;
  // itemList:any;
  fiscalYearsList: any;

  groupMasterForm !: FormGroup;
  groupDetailsForm !: FormGroup;


  
  // costCentersList: costcenter[] = [];
  // costcenterCtrl: FormControl<any>;
  // filteredcostcenter: Observable<costcenter[]>;
  // selectedcostcenter: costcenter | undefined;


  itemsList: item[] = [];
  itemCtrl: FormControl;
  filtereditem: Observable<item[]>;
  selecteditem: item | undefined;

  // employeesList: Employee[] = [];
  // employeeCtrl: FormControl<any>;
  // filteredEmployee: Observable<Employee[]>;
  // selectedEmployee: Employee | undefined;
  dataSource2!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private api: ApiService,
    private dialog: MatDialog,private formBuilder: FormBuilder,
    private http: HttpClient,
    private hotkeysService: HotkeysService,
  
    @Inject(LOCALE_ID) private locale: string,
    private toastr: ToastrService
  ) {

    this.storeCtrl = new FormControl();
    this.filteredstore = this.storeCtrl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filterstores(value))
    );

    // this.costcenterCtrl = new FormControl();
    // this.filteredcostcenter = this.costcenterCtrl.valueChanges.pipe(
    //   startWith(''),
    //   map(value => this._filtercostcenters(value))
    // );

    this.itemCtrl = new FormControl();
    this.filtereditem = this.itemCtrl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filteritems(value))
    );


    // this.employeeCtrl = new FormControl();
    // this.filteredEmployee = this.employeeCtrl.valueChanges.pipe(
    //   startWith(''),
    //   map(value => this._filteremployees(value))
    // );
  }

  ngOnInit(): void {
    this.getAllMasterForms();
    // this.getAllEmployees();
    this.getFiscalYears();
    // this.getEmployees();
    this.getItme();
    this.getStores()
    // this.getcostCenter();

    this.groupMasterForm = this.formBuilder.group({
      no:[''],
      // employee:[''],
      // costcenter:[],
      // costCenterId:[''],
      // employeeId:[''],

      itemName:[''],
      itemId:[''],
      fiscalYear:[''],
      date:[''],
      store:[''],
      storeId:['']
       });



       this.groupDetailsForm = this.formBuilder.group({
        stR_WithdrawId: [''], //MasterId
        systemQty:[''],
        balance:[''],
        qty: [''],
        percentage: [''],
        price: [''],
        total: [''],
        transactionUserId: [1],
        destStoreUserId: [1],
        itemId: [''],
        stateId: [''],
  
        // withDrawNoId: ['' ],
  
        itemName: [''],
        // avgPrice: [''],
  
        stateName: [''],
  
        // notesName: [''],
      });
      // this.hotkeysService.add(new Hotkey('ctrl+o', (event: KeyboardEvent): boolean => {
      //   // Call the deleteGrade() function in the current component
      //   this.openEmployeeingStockDialog();
      //   return false; // Prevent the default browser behavior
      // }));
    
  }

  
  getsearch(code:any){
    if (code.keyCode == 13) {
      this.getAllMasterForms();
     }
  }
  displaystoreName(store: any): string {
    return store && store.name ? store.name : '';
  }
  storeSelected(event: MatAutocompleteSelectedEvent): void {
    const store = event.option.value as store;
    console.log('store selected: ', store);
    this.selectedstore = store;
    console.log('selectedstore: ', this.selectedstore);

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

  getAllMasterForms() {
    this.api.getStrStockTaking().subscribe({
      next: (res) => {
        console.log('response of get all getGroup from api: ', res);
        this.dataSource2 = new MatTableDataSource(res);
        this.dataSource2.paginator = this.paginator;
        this.dataSource2.sort = this.sort;
        this.groupMasterForm.reset();
        this.groupDetailsForm.reset();

      },
      error: () => {
        alert('خطأ أثناء جلب سجلات المجموعة !!');
      },
    });
  }

  getStores() {
    this.api.getStore().subscribe({
      next: (res) => {
        this.storeList = res;
        // console.log("store res: ", this.storeList);
      },
      error: (err) => {
        // console.log("fetch store data err: ", err);
        // alert('خطا اثناء جلب المخازن !');
      },
    });
  }
  openStockTkingkDialog() {
    this.dialog.open(StrStockTakingDialogComponent, {
      width: '98%',
      height: '95%',
    }).afterClosed().subscribe(val => {
      if (val === 'Save') {
        // alert("refreshhhh")
        this.getAllMasterForms();
      }
    })
  }
  editMasterForm(row: any) {
    this.dialog
      .open(StrStockTakingDialogComponent, {
        width: '98%',
      height: '95%',
        data: row,
      })
      .afterClosed()
      .subscribe((val) => {
        if (val === 'Update' || 'Save') {
          // alert("REFRESH")
          this.getAllMasterForms();
        }
      });
  }



    deleteBothForms(id: number) {
      var result = confirm('تاكيد الحذف ؟ ');
  console.log(" id in delete:",id)
      if (result) {
        
        this.api. deleteStrStockTking(id).subscribe({
          next: (res) => {
  
            this.http
              .get<any>('http://ims.aswan.gov.eg/api/StrStockTaking/get/all')
              .subscribe(
                (res) => {
                  this.matchedIds = res.filter((a: any) => {
                    // console.log("matched Id & HeaderId : ", a.HeaderId === id)
                    return  a.custodyId === id
                  });
  
                  // for (let i = 0; i < this.matchedIds.length; i++) {
                  //   this.deleteFormDetails(this.matchedIds[i].id);
                  // }
                  // alert("تم حذف الاذن بنجاح");
  
                },
                (err) => {
                  // alert('خطا اثناء تحديد المجموعة !!');
                }
              );
  
            this.toastrDeleteSuccess();
            this.getAllMasterForms();
          },
          error: () => {
            // alert('خطأ أثناء حذف المجموعة !!');
          },
        });
      }
    }
  

 

  

  getAllEmployees() {
    this.api.getAllEmployees().subscribe({
      next: (res) => {
        this.storeList = res;
        // console.log("store res: ", this.storeList);
      },
      error: (err) => {
        // console.log("fetch store data err: ", err);
        // alert('خطا اثناء جلب المخازن !');
      },
    });
  }

  getFiscalYears() {
    this.api.getFiscalYears().subscribe({
      next: (res) => {
        this.fiscalYearsList = res;
        console.log('fiscalYears res in search: ', this.fiscalYearsList);
      },
      error: (err) => {
        // console.log("fetch fiscalYears data err: ", err);
        // alert("خطا اثناء جلب العناصر !");
      },
    });
  }
  
  getItme() {
    this.api.getItems()
      .subscribe({
        next: (res) => {
          this.itemsList = res;
          console.log("item res: ", this.itemsList);
        },
        error: (err) => {
          console.log("fetch employees data err: ", err);
          // alert("خطا اثناء جلب الموظفين !");
        }
      })
  }
 



  displayitemName(item: any): string {
    return item && item.name ? item.name : '';
  }
  itemSelected(event: MatAutocompleteSelectedEvent): void {
    const item = event.option.value as item;
    console.log('item selected: ', item);
    this.selecteditem = item;
    this.groupDetailsForm.patchValue({ itemId: item.id });
    console.log('item in form: ', this.groupDetailsForm.getRawValue().itemId);
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






getSearchStrStockTaking(no: any,date: any, fiscalYear: any) {
    console.log(
      'no. : ',
      no,
      'FISCALYEAR : ',
      fiscalYear,
      'date: ',
      date,
   
    );


   
    let itemId=this.groupDetailsForm.getRawValue().itemId
    let storeId=this.groupMasterForm.getRawValue().storeId





    this.api.getSearchStrStockTaking( no,storeId, fiscalYear,itemId   )
    .subscribe({
      next: (res) => {
        console.log("search employeeExchange 4res: ", res);

        this.dataSource2 = res
        this.dataSource2.paginator = this.paginator;
        this.dataSource2.sort = this.sort;
    // this.api.getStrOpenSearach(no, store, date, fiscalYear).subscribe({
    //   next: (res) => {
    //     console.log('search openingStock res: ', res);

    //     //enter no.
    //     if (no != '' && !store && !date && !fiscalYear) {
    //       // console.log("enter no. ")
    //       // console.log("no. : ", no, "store: ", store, "date: ", date)
    //       this.dataSource2 = res.filter((res: any) => res.no == no!);
    //       this.dataSource2.paginator = this.paginator;
    //       this.dataSource2.sort = this.sort;
    //     }

    //     //enter store
    //     else if (!no && store && !date && !fiscalYear) {
    //       // console.log("enter store. ")
    //       // console.log("enter no. & store & date ", "res : ", res, "input no. : ", no, "input store: ", store, "input date: ", date)
    //       this.dataSource2 = res.filter((res: any) => res.storeId == store);
    //       this.dataSource2.paginator = this.paginator;
    //       this.dataSource2.sort = this.sort;
    //     }

    //     //enter date
    //     else if (!no && !store && date && !fiscalYear) {
    //       // console.log("enter date. ")
    //       // console.log("enter no. & store & date ", "res : ", res, "input no. : ", no, "input store: ", store, "input date: ", date)
    //       this.dataSource2 = res.filter(
    //         (res: any) => formatDate(res.date, 'M/d/yyyy', this.locale) == date
    //       );
    //       this.dataSource2.paginator = this.paginator;
    //       this.dataSource2.sort = this.sort;
    //     }

    //     //enter fiscalYear
    //     else if (!no && !store && !date && fiscalYear) {
    //       // console.log("enter date. ")
    //       // console.log("enter no. & store & date ", "res : ", res, "input no. : ", no, "input store: ", store, "input date: ", date)
    //       this.dataSource2 = res.filter(
    //         (res: any) => res.fiscalyear == fiscalYear
    //       );
    //       this.dataSource2.paginator = this.paginator;
    //       this.dataSource2.sort = this.sort;
    //     }

    //     //enter no. & store
    //     else if (no && store && !date && !fiscalYear) {
    //       // console.log("enter no & store ")
    //       // console.log("enter no. & store & date ", "res : ", res, "input no. : ", no, "input store: ", store, "input date: ", date)
    //       this.dataSource2 = res.filter(
    //         (res: any) => res.no == no! && res.storeId == store
    //       );
    //       this.dataSource2.paginator = this.paginator;
    //       this.dataSource2.sort = this.sort;
    //     }

    //     //enter no. & date
    //     else if (no && !store && date && !fiscalYear) {
    //       // console.log("enter no & date ")
    //       // console.log("enter no. & store & date ", "res : ", res, "input no. : ", no, "input store: ", store, "input date: ", date)
    //       this.dataSource2 = res.filter(
    //         (res: any) =>
    //           res.no == no! &&
    //           formatDate(res.date, 'M/d/yyyy', this.locale) == date
    //       );
    //       this.dataSource2.paginator = this.paginator;
    //       this.dataSource2.sort = this.sort;
    //     }

    //     //enter store & date
    //     else if (!no && store && date && !fiscalYear) {
    //       // console.log("enter store & date ")
    //       // console.log("enter no. & store & date ", "res : ", res, "input no. : ", no, "input store: ", store, "input date: ", date)
    //       this.dataSource2 = res.filter(
    //         (res: any) =>
    //           res.storeId == store &&
    //           formatDate(res.date, 'M/d/yyyy', this.locale) == date
    //       );
    //       this.dataSource2.paginator = this.paginator;
    //       this.dataSource2.sort = this.sort;
    //     }

    //     //enter all data
    //     else if (no != '' && store != '' && date != '' && fiscalYear != '') {
    //       // console.log("enter all data. ")
    //       // console.log("enter no. & store & date ", "res : ", res, "input no. : ", no, "input store: ", store, "input date: ", date)
    //       this.dataSource2 = res.filter(
    //         (res: any) =>
    //           res.no == no! &&
    //           res.storeId == store &&
    //           formatDate(res.date, 'M/d/yyyy', this.locale) == date &&
    //           res.fiscalyear == fiscalYear
    //       );
    //       this.dataSource2.paginator = this.paginator;
    //       this.dataSource2.sort = this.sort;
    //     }

    //     //didn't enter any data
    //     else {
    //       // console.log("enter no data ")
    //       this.dataSource2 = res;
    //       this.dataSource2.paginator = this.paginator;
    //       this.dataSource2.sort = this.sort;
    //     }
    //   },
    //   error: (err) => {
    //     alert('Error');
    //   },
    // });
  },
  error: (err) => {
    // alert("Error")
  }
})
  }

  toastrDeleteSuccess(): void {
    this.toastr.success('تم الحذف بنجاح');
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource2.filter = filterValue.trim().toLowerCase();

    if (this.dataSource2.paginator) {
      this.dataSource2.paginator.firstPage();
    }
  }

  printReport() {
    // this.loadAllData();
    let header: any = document.getElementById('header');
    let paginator: any = document.getElementById('paginator');
    let action1: any = document.getElementById('action1');
    let action2: any = document.querySelectorAll('action2');
    console.log(action2);
    let button1: any = document.querySelectorAll('#button1');
    console.log(button1);
    let button2: any = document.getElementById('button2');
    let button: any = document.getElementsByClassName('mdc-icon-button');
    console.log(button);
    let reportFooter: any = document.getElementById('reportFooter');
    let date: any = document.getElementById('date');
    header.style.display = 'grid';
    paginator.style.display = 'none';
    action1.style.display = 'none';
    // button1.style.display = 'none';
    // button2.style.display = 'none';
    for (let index = 0; index < button.length; index++) {
      let element = button[index];

      element.hidden = true;
    }
    // reportFooter.style.display = 'block';
    // date.style.display = 'block';
    let printContent: any = document.getElementById('content')?.innerHTML;
    let originalContent: any = document.body.innerHTML;
    document.body.innerHTML = printContent;
    // console.log(document.body.children);
    document.body.style.cssText =
      'direction:rtl;-webkit-print-color-adjust:exact;';
    window.print();
    document.body.innerHTML = originalContent;
    location.reload();
  }
}
