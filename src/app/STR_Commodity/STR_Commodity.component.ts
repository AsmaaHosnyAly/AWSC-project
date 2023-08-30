

import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { StrCommodityDialogComponent } from '../STR_Commodity_dialog/str-commodity-dialog.component';
import { ApiService } from '../services/api.service';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatButtonModule} from '@angular/material/button';
import {NgIf} from '@angular/common';
import {MatSidenavModule} from '@angular/material/sidenav';
import { GlobalService } from '../services/global.service';
@Component({
  selector: 'app-str-commodity',
    templateUrl: './STR_Commodity.component.html',
    styleUrls: ['./STR_Commodity.component.css'],
})
export class StrCommodityComponent implements OnInit {
  badgevisible = false;
    badgevisibility() {
      this.badgevisible = true;}
      commodity: any = {
        id: 0,
        name: ''
    
      }
      commoditylist: any;

  title = 'Angular13Crud';
  //define table fields which has to be same to api fields
  displayedColumns: string[] = ['code', 'name','action'];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private dialog: MatDialog, private api: ApiService,public global:GlobalService ) {
    this.global.getPermissionUserRoles(5, 'stores', ' السلعة ', '')
  }
  ngOnInit(): void {
    this.getAllCommodity();
    this.api.getCommodity().subscribe((data: any) => {
      this.commoditylist = data;
      console.log(this.commoditylist);
   
    })
  }
  openDialog() {
    this.dialog.open(StrCommodityDialogComponent, {
      width: '30%'
    }).afterClosed().subscribe(val => {
      if (val === 'حفظ') {
        this.getAllCommodity();
      }
    });
  }

  getAllCommodity() {
    this.api.getCommodity()
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
  getSearchProducts(commodityId:any) {

    this.api.getCommodity()
      .subscribe({
        next: (res) => {
       
    
            this.dataSource = res.filter((res: any)=> res.name==commodityId!) 
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
          },
        
        error: (err) => {
          alert("Error")
        }
      })
     
    }


  editCommodity(row: any) {
    this.dialog.open(StrCommodityDialogComponent, {
      width: '30%',
      data: row
    }).afterClosed().subscribe(val => {
      if (val === 'تحديث') {
        this.getAllCommodity();
      }
    })
  }

deleteCommodity(id:number){
  if(confirm("هل انت متأكد من الحذف؟")) {
this.api.deleteCommodity(id)
.subscribe({
next:(res)=>{
alert("تم الحذف");
this.getAllCommodity();
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

