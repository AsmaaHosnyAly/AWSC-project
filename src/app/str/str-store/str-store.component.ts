


import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import {StrStoreDialogComponent } from '../../str/str-store-dialog/str-store-dialog.component'; 
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ApiService } from '../../services/api.service';




@Component({
  selector: 'app-str-store',
  templateUrl: './str-store.component.html',
  styleUrls: ['./str-store.component.css']
})
export class StrStoreComponent  implements OnInit {
  title = 'Angular13Crud';
  //define table fields which has to be same to api fields
  displayedColumns: string[] = [ 'name','action'];
  dataSource!: MatTableDataSource<any>;
  store: any = {
    id: 0,
    name: ''

  }
  storelist: any;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private dialog: MatDialog, private api: ApiService) {

  }
  ngOnInit(): void {
    this.getAllStores();
    this.api.getStore().subscribe((data: any) => {
      this.storelist = data;
      console.log(this.storelist)
    })
  }
  
  openDialog() {
    this.dialog.open(StrStoreDialogComponent, {
      width: '30%'
    }).afterClosed().subscribe(val => {
      if (val === 'حفظ') {
        this.getAllStores();
      }
    });
  }

  getAllStores() {
    this.api.getStore()
      .subscribe({
        next: (res) => {
          this.dataSource = new MatTableDataSource(res);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        },
        error: (err) => {
          alert("Error")
        }
      })
  }
  getSearchProducts(storeId:any) {

    this.api.getStore()
      .subscribe({
        next: (res) => {
          // 1-
      
            this.dataSource = res.filter((res: any)=> res.name==storeId!) 
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
          },
        error: (err) => {
          alert("Error")
        }
      })
      // this.getAllStores()
    }
  editStore(row: any) {
    console.log("edit product:",row)
    this.dialog.open(StrStoreDialogComponent, {
      width: '30%',
      data: row
    }).afterClosed().subscribe(val => {
      if (val === 'تحديث') {
        this.getAllStores();
      }
    })
  }

deleteStore(id:number){
  if(confirm("هل انت متأكد من الحذف؟")) {
this.api.deleteStore(id)
.subscribe({
next:(res)=>{
alert("تم الحذف");
this.getAllStores();
},
error:()=>{
  alert("خطأ في الحذف")
}
})}
}

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}

