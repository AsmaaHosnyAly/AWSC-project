





import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import {StrCostcenterDialogComponent } from '../str-costcenter-dialog/str-costcenter-dialog.component'; 
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ApiService } from '../../services/api.service';




@Component({
  selector: 'app-str-costcenter',
  templateUrl: './str-costcenter.component.html',
  styleUrls: ['./str-costcenter.component.css']
})
export class StrCostcenterComponent  implements OnInit {
  title = 'Angular13Crud';
  //define table fields which has to be same to api fields
  displayedColumns: string[] = ['code', 'name','action'];
  dataSource!: MatTableDataSource<any>;
  costcenterlist:any;
  costcenter: any = {
    id: 0,
    name: ''

  }

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private dialog: MatDialog, private api: ApiService) {

  }
  ngOnInit(): void {
    this.getAllCostCenter();
    this.api.getCostCenter().subscribe((data: any) => {
      this.costcenterlist = data;
      console.log(this.costcenterlist)
    })
  }
  openDialog() {
    this.dialog.open(StrCostcenterDialogComponent, {
      width: '30%'
    }).afterClosed().subscribe(val => {
      if (val === 'حفظ') {
        this.getAllCostCenter();
      }
    });
  }

  getAllCostCenter() {
    this.api.getCostCenter()
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
  getSearchProducts(costcenter:any) {

    this.api.getCostCenter()
      .subscribe({
        next: (res) => {
          // 1-
      
            this.dataSource = res.filter((res: any)=> res.name==costcenter!) 
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
          },
        error: (err) => {
          alert("Error")
        }
      })
    
    }

  editCostCenter(row: any) {
    this.dialog.open(StrCostcenterDialogComponent, {
      width: '30%',
      data: row
    }).afterClosed().subscribe(val => {
      if (val === 'تحديث') {
        this.getAllCostCenter();
      }
    })
  }

  deleteCostCenter(id:number){
    if (confirm("هل انت متأكد من الحذف؟"))
this.api.deleteCostCenter(id)
.subscribe({
next:(res)=>{

 if(res == 'Success'){
  console.log("res of deletestore:",res)
alert("تم الحذف");
this.getAllCostCenter();
}else{
  alert(" لا يمكن الحذف لارتباطها بجداول اخري!")

}}
})
}

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}

