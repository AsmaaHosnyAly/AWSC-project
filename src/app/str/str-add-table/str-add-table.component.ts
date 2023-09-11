import { Component, Inject, LOCALE_ID, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from '../../services/api.service';
import { HttpClient } from '@angular/common/http';
import { formatDate } from '@angular/common';
import { STRAddDialogComponent } from '../str-add-dialog/str-add-dialog.component';
import { GlobalService } from '../../services/global.service';
import { Router } from '@angular/router';
import { FormControl, FormControlName,FormBuilder,FormGroup } from '@angular/forms';

@Component({
  selector: 'app-str-add-table',
  templateUrl: './str-add-table.component.html',
  styleUrls: ['./str-add-table.component.css'],
})
export class STRAddTableComponent implements OnInit {
  displayedColumns: string[] = [
    'no',
    'storeName',
    'sourceStoreName',
    'sellerName',
    'employeeName',
    'fiscalyear',
    'date', 
    'receiptName',   
    'typeName',      
    'Action',
  ];
  matchedIds: any;
  storeList: any;
  typeList: any;
  ReceiptList: any;
  sourceStoreList: any;
  employeeList: any;
  sellerList: any;
  storeName: any;
  sourceStoreName: any;
  sellerName: any;
  receiptName: any;
  employeeName: any;
  TypeName: any;
  groupMasterForm !: FormGroup;
  dataSource2!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  dataSource!: MatTableDataSource<any>;

  constructor(
    private api: ApiService,
    private global: GlobalService,
    private dialog: MatDialog,private formBuilder: FormBuilder,
    private http: HttpClient,
    private router: Router,
    @Inject(LOCALE_ID) private locale: string
  ) {
    this.global.getPermissionUserRoles(2, 'stores', ' إذن إضافة ', '');
  }

  ngOnInit(): void {
    this.getAllMasterForms();
    this.getStores();
    this.getTypes();
    this.getSellers();
    this.getReciepts();
    this.getEmployees();
    this.groupMasterForm = this.formBuilder.group({
      no:[''],
      employee:[''],
      costcenter:[],
      item:[''],
      fiscalyear:[''],
      date:[''],
      store:['']
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
    this.api.getStrAdd().subscribe({
      next: (res) => {
        console.log('response of get all getGroup from api: ', res);
        this.dataSource2 = new MatTableDataSource(res);
        this.dataSource2.paginator = this.paginator;
        this.dataSource2.sort = this.sort;
        this.loadDataToLocalStorage(res);
        this.groupMasterForm.reset()
      },
      error: () => {
        alert('خطأ أثناء جلب سجلات المجموعة !!');
      },
    });
  }

  

  openAddDialog() {
    this.dialog
      .open(STRAddDialogComponent, {
        width: '60%',
      })
      .afterClosed()
      .subscribe((val) => {
        if (val === 'Save') {
          // alert("refresh")

          this.getAllMasterForms();
        }
      });
  }

  getAllGroups() {
    this.api.getGroup().subscribe({
      next: (res) => {
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: () => {
        // alert("خطأ أثناء جلب سجلات المجموعة !!");
      },
    });
  }

  editMasterForm(row: any) {
    this.dialog
      .open(STRAddDialogComponent, {
        width: '60%',
        data: row,
      })
      .afterClosed()
      .subscribe((val) => {
        if (val === 'Update' || 'Save') {
          // alert("refresh")
          this.getAllMasterForms();
        }
      });
  }

  deleteBothForms(id: number) {
    var result = confirm('تاكيد الحذف ؟ ');

    if (result) {
      this.api.deleteStrAdd(id).subscribe({
        next: (res) => {
          // alert("تم حذف المجموعة بنجاح");

          this.http
            .get<any>('http://ims.aswan.gov.eg/api/STRAddDetails/get/all')
            .subscribe(
              (res) => {
                this.matchedIds = res.filter((a: any) => {
                  // console.log("matched Id & HeaderId : ", a.HeaderId === id)
                  return a.HeaderId === id;
                });

                for (let i = 0; i < this.matchedIds.length; i++) {
                  this.deleteFormDetails(this.matchedIds[i].id);
                }
              },
              (err) => {
                alert('خطا اثناء تحديد المجموعة !!');
              }
            );

          this.getAllMasterForms();
        },
        error: () => {
          alert('خطأ أثناء حذف المجموعة !!');
        },
      });
    }
  }

  deleteFormDetails(id: number) {
    this.api.deleteStrAdd(id).subscribe({
      next: (res) => {
        alert('تم حذف الصنف بنجاح');
        this.getAllMasterForms();
      },
      error: (err) => {
        // console.log("delete details err: ", err)
        alert('خطأ أثناء حذف الصنف !!');
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
        alert('خطا اثناء جلب المخازن !');
      },
    });
  }
  getTypes() {
    this.api.getType().subscribe({
      next: (res) => {
        this.typeList = res;
        // console.log("store res: ", this.storeList);
      },
      error: (err) => {
        // console.log("fetch store data err: ", err);
        // alert("خطا اثناء جلب المخازن !");
      },
    });
  }
  getSellers() {
    this.api.getSeller().subscribe({
      next: (res) => {
        this.sellerList = res;
        // console.log("store res: ", this.storeList);
      },
      error: (err) => {
        // console.log("fetch store data err: ", err);
        // alert("خطا اثناء جلب المخازن !");
      },
    });
  }
  getReciepts() {
    this.api.getReciept().subscribe({
      next: (res) => {
        this.ReceiptList = res;
        // console.log("store res: ", this.storeList);
      },
      error: (err) => {
        // console.log("fetch store data err: ", err);
        // alert("خطا اثناء جلب المخازن !");
      },
    });
  }
  getEmployees() {
    this.api.getEmployee().subscribe({
      next: (res) => {
        this.employeeList = res;
        // console.log("store res: ", this.storeList);
      },
      error: (err) => {
        // console.log("fetch store data err: ", err);
        // alert("خطا اثناء جلب المخازن !");
      },
    });
  }

  getSearchStrAdd(no: any, store: any, date: any) {
    console.log('no. : ', no, 'store : ', store, 'date: ', date);
    this.api.getStrAddSearach(no, store, date).subscribe({
      next: (res) => {
        console.log('search addStock res: ', res);

        this.dataSource2 = res
        this.dataSource2.paginator = this.paginator;
        this.dataSource2.sort = this.sort;
      },
      error: (err) => {
console.log("eroorr",err)      }
    })
}

  loadDataToLocalStorage(data: any): void {
    localStorage.removeItem('store-data');
    localStorage.setItem('store-data', JSON.stringify(data));
  }

  print() {
    this.router.navigate(['/add-item-report']);
  }
}
