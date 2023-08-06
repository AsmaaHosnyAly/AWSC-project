





import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import {StrCostcenterDialogComponent } from '../str-costcenter-dialog/str-costcenter-dialog.component'; 
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ApiService } from '../services/api.service';




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

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private dialog: MatDialog, private api: ApiService) {

  }
  ngOnInit(): void {
    this.getAllCostCenter();
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
this.api.deleteCostCenter(id)
.subscribe({
next:(res)=>{
alert("تم الحذف");
this.getAllCostCenter();
},
error:()=>{
  alert("خطأ في الحذف")
}
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

