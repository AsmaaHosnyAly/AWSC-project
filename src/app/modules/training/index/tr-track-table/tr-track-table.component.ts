
import { Component, Inject, LOCALE_ID, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from '../../services/api.service';
import { MatDialog } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { formatDate } from '@angular/common';
import { PrintDialogComponent } from '../../../str/index/print-dialog/print-dialog.component';
import { TrTrackDialogComponent } from './../tr-track-dialog/tr-track-dialog.component';

// import { PyExchangeDialogComponent } from '../fi-entry-dialog/fi-entry-dialog.component';
import {
  FormControl,
  FormControlName,
  FormBuilder,
  FormGroup,
} from '@angular/forms';
import { Observable, map, startWith } from 'rxjs';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

interface USER {
  no: string;
  balance: string;
  creditTotal: string;
  debitTotal: string;
  journalName: string;
  entrySourceTypeName: string;
  state: string;
  date: string;
  Action: string;
}
export class item {
  constructor(public id: number, public name: string) {}
}

export class Employee {
  constructor(public id: number, public name: string, public code: string) {}
}
export class Account {
  constructor(public id: number, public name: string) { }
}

@Component({
  selector: 'app-tr-track-table',
  templateUrl: './tr-track-table.component.html',
  styleUrls: ['./tr-track-table.component.css']
})



export class TrTrackTableComponent implements OnInit {
  ELEMENT_DATA: USER[] = [];
  isLoading = false;
  totalRows = 0;
  pageSize = 5;
  currentPage: any;
  pageSizeOptions: number[] = [5, 10, 25, 100];

  displayedColumns: string[] = [
   
    'name','price',
    'description','Action',
  ];
  pdfurl = '';
  groupMasterForm!: FormGroup;
  groupDetailsForm!: FormGroup;
  matchedIds: any;
  storeList: any;
  storeName: any;
  fiscalYearsList: any;
  sourcesList: any;

  // dataSource2!: MatTableDataSource<any>;
  dataSource2: MatTableDataSource<USER> = new MatTableDataSource();

  accountsList: Account[] = [];
  accountCtrl: FormControl;
  filteredAccount: Observable<Account[]>;
  selectedAccount: Account | undefined;


  employeesList: Employee[] = [];
  employeeCtrl: FormControl<any>;
  filteredEmployee: Observable<Employee[]>;
  selectedEmployee: Employee | undefined;

  itemsList: item[] = [];
  itemCtrl: FormControl;
  filtereditem: Observable<item[]>;
  selecteditem: item | undefined;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  pageIndex: any;
  length: any;

  ngAfterViewInit() {
    this.dataSource2.paginator = this.paginator;
  }

  constructor(
    private api: ApiService,
    private dialog: MatDialog,
    private http: HttpClient, private formBuilder: FormBuilder,
    @Inject(LOCALE_ID) private locale: string,
    private toastr: ToastrService
  ) {
    
    this.employeeCtrl = new FormControl();
    this.filteredEmployee = this.employeeCtrl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filteremployees(value))
    );

    this.itemCtrl = new FormControl();
    this.filtereditem = this.itemCtrl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filteritems(value))
    );

    this.accountCtrl = new FormControl();
    this.filteredAccount = this.accountCtrl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filterAccounts(value))
    );

  }

  ngOnInit(): void {
    this.getAllMasterForms();
    this.getTrTarck();
    this.getItems();
    this.getEmployees();



    this.groupMasterForm = this.formBuilder.group({
 
      
      name:[''],
      price:[''],

      // JournalId: [''],
      // FiEntrySourceTypeId: [''],
      // AccountId: [''],
      // FiscalYearId: [''],
      description: ['']
    });


    // this.groupDetailsForm = this.formBuilder.group({
    //   stR_WithdrawId: [''], //MasterId
    //   employeeId: [''],
    //   qty: [''],
    //   percentage: [''],
    //   price: [''],
    //   total: [''],
    //   transactionUserId: [1],
    //   destStoreUserId: [1],
    //   itemId: [''],
    //   stateId: [''], item: [''],

    //   // withDrawNoId: ['' ],

    //   itemName: [''],
    //   // avgPrice: [''],

    //   stateName: [''],

    //   // notesName: [''],
    // });

  }

  private _filterAccounts(value: string): Account[] {
    const filterValue = value;
    console.log("filterValue222:", filterValue);

    return this.accountsList.filter(
      (account) =>
        account.name.toLowerCase().includes(filterValue)
    );
  }

  displayAccountName(account: any): string {
    return account && account.name ? account.name : '';
  }
  AccountSelected(event: MatAutocompleteSelectedEvent): void {
    const account = event.option.value as Account;
    console.log("account selected: ", account);
    this.selectedAccount = account;
    this.groupMasterForm.patchValue({ AccountId: account.id });
  }
  openAutoAccount() {
    this.accountCtrl.setValue(''); // Clear the input field value

    // Open the autocomplete dropdown by triggering the value change event
    this.accountCtrl.updateValueAndValidity();
  }

  openPyExchangeDialog() {
    this.dialog
      .open(TrTrackDialogComponent, {
        width: '55%',
        height: '79%'
      })
      .afterClosed()
      .subscribe((val) => {
        if (val === 'save' || val === 'update') {
          this.getAllMasterForms();
        }
      });
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource2.filter = filterValue.trim().toLowerCase();

    if (this.dataSource2.paginator) {
      this.dataSource2.paginator.firstPage();
    }
  }
  getAllMasterForms() {
    // loadData() {
    if (!this.currentPage) {
      this.currentPage = 0;

      this.isLoading = true;
      // let URL = `http://ims.aswan.gov.eg/api/FIEntry/get/pagnation?page=${this.currentPage}&pageSize=${this.pageSize}`;


      fetch(this.api.getTrTarckPaginate(this.currentPage, this.pageSize))
        .then(response => response.json())
        .then(data => {
          this.totalRows = data.length;
          console.log("master data paginate first Time: ", data);
          this.dataSource2.data = data.items;
          this.pageIndex = data.page;
          this.pageSize = data.pageSize;
          this.length = data.totalItems;
          setTimeout(() => {
            this.paginator.pageIndex = this.currentPage;
            this.paginator.length = this.length;
          });
          this.isLoading = false;
        }, error => {
          console.log(error);
          this.isLoading = false;
        });
    }
    else {
      this.isLoading = true;
      // let URL = `http://ims.aswan.gov.eg/api/FIEntry/get/pagnation?page=${this.currentPage}&pageSize=${this.pageSize}`;


      fetch(this.api.getTrTarckPaginate(this.currentPage, this.pageSize))
        .then(response => response.json())
        .then(data => {
          this.totalRows = data.length;
          console.log("master data paginate: ", data);
          this.dataSource2.data = data.items;
          this.pageIndex = data.page;
          this.pageSize = data.pageSize;
          this.length = data.totalItems;
          setTimeout(() => {
            this.paginator.pageIndex = this.currentPage;
            this.paginator.length = this.length;
          });
          this.isLoading = false;
        }, error => {
          console.log(error);
          this.isLoading = false;
        });
    }

    // }

    // this.api.getFiEntry().subscribe({
    //   next: (res) => {
    //     console.log('fiEntry from api: ', res);
    //     this.dataSource2 = new MatTableDataSource(res);
    //     this.dataSource2.paginator = this.paginator;
    //     this.dataSource2.sort = this.sort;
    //     this.groupMasterForm.reset()
    //   },
    //   error: () => {
    //     // alert('خطأ أثناء جلب سجلات المدخلات !!');
    //   },
    // });
  }

  pageChanged(event: PageEvent) {
    console.log("page event: ", event);
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    // this.currentPage = event.previousPageIndex;
    this.getAllMasterForms();
  }


  getTrTarck() {
    this.api.getTrTarck().subscribe({
      next: (res) => {
        this.sourcesList = res;
        console.log('sources res: ', this.sourcesList);
      },
      error: (err) => {
        console.log('fetch sources data err: ', err);
        // alert('خطا اثناء جلب الدفاتر !');
      },
    });
  }


  editMasterForm(row: any) {
    this.dialog
      .open(TrTrackDialogComponent, {
        width: '55%',
        height: '79%',
        data: row,
      })
      .afterClosed()
      .subscribe((val) => {
        if (val === 'update' || val === 'save') {
          this.getAllMasterForms();
        }
      });
  }

  deleteBothForms(id: number) {
    this.api.getTrTrackDetails()
      .subscribe({
        next: (res) => {

          this.matchedIds = res.filter((a: any) => {
            // console.log("matched Id & HeaderId : ", a.HeaderId === id)
            return a.entryId === id;
          });

          var result = confirm('هل ترغب بتاكيد حذف التفاصيل و الرئيسي؟');

          if (this.matchedIds.length) {
            for (let i = 0; i < this.matchedIds.length; i++) {
              console.log(
                'matchedIds details in loop: ',
                this.matchedIds[i].id
              );

              if (result) {
                this.api.deleteTrTrackDetails(this.matchedIds[i].id).subscribe({
                  next: (res) => {
                    console.log('master id to be deleted: ', id);

                    this.api.deleteTrTarck(id).subscribe({
                      next: (res) => {
                        // alert('تم حذف الرئيسي بنجاح');
                        this.getAllMasterForms();
                      },
                      error: () => {
                        // alert('خطأ أثناء حذف الرئيسي !!');
                      },
                    });
                  },
                  error: () => {
                    // alert('خطأ أثناء حذف التفاصيل !!');
                  },
                });
              }
            }
          } else {
            if (result) {
              console.log('master id to be deleted: ', id);

              this.api.deleteTrTarck(id).subscribe({
                next: (res) => {
                  // alert('تم حذف الرئيسي بنجاح');
                  this.toastrDeleteSuccess();
                  this.getAllMasterForms();
                },
                error: () => {
                  // alert('خطأ أثناء حذف الرئيسي !!');
                },
              });
            }
          }

        },
        error: (err) => {
          // alert('خطا اثناء حذف القيد !!');

        }
      })


  }
  getEmployees() {
    this.api.getEmployee().subscribe({
      next: (res) => {
        this.employeesList = res;
        // console.log("store res: ", this.storeList);
      },
      error: (err) => {
        // console.log("fetch store data err: ", err);
        // alert("خطا اثناء جلب المخازن !");
      },
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
  // getSearchFiEntry(no: any,name:any,  startDate: any, endDate: any) {

  //   console.log(
  //     'no.: ', no,
  //     'startDate: ', startDate,
  //     'endDate: ', endDate,
  //   );

  //   this.api
  //     .getFiEntrySearach(no,name, startDate, endDate)
  //     .subscribe({
  //       next: (res) => {
  //         console.log('search fiEntry res: ', res);

  //         this.dataSource2 = res;
  //         this.dataSource2.paginator = this.paginator;
  //         this.dataSource2.sort = this.sort;
  //       },
  //       error: (err) => {
  //         // alert('Error');
  //       },
  //     });
  // }

  displayEmployeeName(employee: any): string {
    return employee && employee.name ? employee.name : '';
  }
  employeeSelected(event: MatAutocompleteSelectedEvent): void {
    const employee = event.option.value as Employee;
    console.log('employee selected: ', employee);
    this.selectedEmployee = employee;
    this.groupMasterForm.patchValue({ employeeId: employee.id });
    console.log(
      'employee in form: ',
      this.groupMasterForm.getRawValue().employeeId
    );

    // this.getSearchStrWithdraw()
    // this.set_store_Null(this.groupMasterForm.getRawValue().employeeId);
    // return     this.groupMasterForm.patchValue({ employeeId: employee.id });
  }
  private _filteremployees(value: string): Employee[] {
    const filterValue = value;
    return this.employeesList.filter((employee) =>
      employee.name.toLowerCase().includes(filterValue)
    );
  }
  openAutoEmployee() {
    this.employeeCtrl.setValue(''); // Clear the input field value

    // Open the autocomplete dropdown by triggering the value change event
    this.employeeCtrl.updateValueAndValidity();
  }

  /////itemmm
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

  //   previewPrint(no: any, StartDate: any,EndDate:any, fiscalYear: any,report:any,reportType:any) {
  //     let costCenter = this.groupMasterForm.getRawValue().costCenterId;
  //     let employee = this.groupMasterForm.getRawValue().employeeId;
  //     let item = this.groupMasterForm.getRawValue().itemId;
  //     let store = this.groupMasterForm.getRawValue().storeId;
  // if(report!= null && reportType!=null){
  //     this.api
  //       .getStr(no, store, StartDate,EndDate, fiscalYear, item, employee, costCenter,report,reportType)
  //       .subscribe({
  //         next: (res) => {
  //           let blob: Blob = res.body as Blob;
  //           console.log(blob);
  //           let url = window.URL.createObjectURL(blob);
  //           localStorage.setItem('url', JSON.stringify(url));
  //           this.pdfurl = url;
  //           this.dialog.open(PrintDialogComponent, {
  //             width: '50%',
  //           });

  //           // this.dataSource = res;
  //           // this.dataSource.paginator = this.paginator;
  //           // this.dataSource.sort = this.sort;
  //         },
  //         error: (err) => {
  //           console.log('eroorr', err);
  //           window.open(err.url);
  //         },

  //       });}
  //       else{
  // alert("ادخل التقرير و نوع التقرير!")      }
  //   }


  //   downloadPrint(no: any, StartDate: any,EndDate:any, fiscalYear: any,report:any,reportType:any) {
  //     let costCenter = this.groupMasterForm.getRawValue().costCenterId;
  //     let employee = this.groupMasterForm.getRawValue().employeeId;
  //     let item = this.groupDetailsForm.getRawValue().itemId;
  //     let store = this.groupMasterForm.getRawValue().storeId;

  //     this.api
  //     .getStr(no, store, StartDate,EndDate, fiscalYear, item, employee, costCenter,report,reportType)
  //     .subscribe({
  //         next: (res) => {
  //           console.log('search:', res);
  //           const url: any = res.url;
  //           window.open(url);
  //           // let blob: Blob = res.body as Blob;
  //           // let url = window.URL.createObjectURL(blob);

  //           // this.dataSource = res;
  //           // this.dataSource.paginator = this.paginator;
  //           // this.dataSource.sort = this.sort;
  //         },
  //         error: (err) => {
  //           console.log('eroorr', err);
  //           window.open(err.url);
  //         },
  //       });
  //   }
  toastrDeleteSuccess(): void {
    this.toastr.success('تم الحذف بنجاح');
  }
}

