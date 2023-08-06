import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from '../services/api.service';
import { StrGroupFormComponent } from '../str-groupBannel-form/str-group-form.component';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-str-group-table-header',
  templateUrl: './str-group-table-header.component.html',
  styleUrls: ['./str-group-table-header.component.css']
})
export class StrGroupTableHeaderComponent implements OnInit {
  displayedColumns: string[] = ['No', 'StoreId', 'Date', 'Action'];
  matchedIds: any;
  storeList: any;
  storeName: any;

  dataSource2!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private api: ApiService, private dialog: MatDialog, private http: HttpClient) {

  }

  ngOnInit(): void {
    this.getAllStrOpen();
    this.getStore();
  }

  getAllStrOpen() {
    this.api.getStrOpen()
      .subscribe({
        next: (res) => {
          console.log("response of get all getGroup from api: ", res);
          // this.getStoreByID();
          this.dataSource2 = new MatTableDataSource(res);
          this.dataSource2.paginator = this.paginator;
          this.dataSource2.sort = this.sort;
        },
        error: () => {
          alert("خطأ أثناء جلب سجلات المجموعة !!");
        }
      })


  }

  editGroup(row: any) {
    this.dialog.open(StrGroupFormComponent, {
      width: '70%',
      data: row
    }).afterClosed().subscribe(val => {
      if (val === 'update') {
        this.getAllStrOpen();
      }
    })
  }

  deleteGroup(id: number) {
    this.api.deleteStrOpen(id)
      .subscribe({
        next: (res) => {
          alert("تم حذف المجموعة بنجاح");

          this.http.get<any>("http://localhost:3000/StrOpenDetails/")
            .subscribe(res => {
              // console.log("res: ", res);

              this.matchedIds = res.filter((a: any) => {
                // console.log("matched Id & HeaderId : ", a.HeaderId === id)
                return a.HeaderId === id
              })
              // console.log("response of get all getGroup from api: ", this.matchedIds);
              for (let i = 0; i < this.matchedIds.length; i++) {

                this.deleteGroupDetails(this.matchedIds[i].id)
              }

            }, err => {
              alert("خطا اثناء تحديد المجموعة !!")
            })

          this.getAllStrOpen()
        },
        error: () => {
          alert("خطأ أثناء حذف المجموعة !!");
        }
      })
  }

  deleteGroupDetails(id: number) {
    this.api.deleteStrOpenDetails(id)
      .subscribe({
        next: (res) => {
          alert("تم حذف الصنف بنجاح");
          this.getAllStrOpen()
        },
        error: (err) => {
          // console.log("delete details err: ", err)
          alert("خطأ أثناء حذف الصنف !!");
        }
      })
  }

  getStore() {
    this.api.getStore()
      .subscribe({
        next: (res) => {
          this.storeList = res;
          console.log("store res: ", this.storeList);
          // this.getStoreByID(this.storeList)
        },
        error: (err) => {
          console.log("fetch store data err: ", err);
          alert("خطا اثناء جلب المخازن !");
        }
      })
  }

  getStoreByID(store: any) {
    console.log("row store id: ", store);

    // this.storeName = store.map((s: any) => (
    //   // console.log("get store id: ", s.id);

    //   this.api.getStoreByID(s.id)
    //   .subscribe({
    //     next: (res) => {
    //       this.storeList = res.name;
    //       console.log("store by id: ", this.storeList);
    //     },
    //     error: (err) => {
    //       console.log("fetch store by id err: ", err);
    //       alert("خطا اثناء جلب رقم المخزن !");
    //     }
    //   })
    // ));
   
  }
}
