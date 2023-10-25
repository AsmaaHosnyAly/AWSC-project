
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import {StrCostcenterDialogComponent } from '../str-costcenter-dialog/str-costcenter-dialog.component'; 
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { GlobalService } from 'src/app/pages/services/global.service'; 
import { ApiService } from '../../services/api.service';
import { HotkeysService } from 'angular2-hotkeys';
import { Hotkey } from 'angular2-hotkeys';



@Component({
  selector: 'app-str-costcenter',
  templateUrl: './str-costcenter.component.html',
  styleUrls: ['./str-costcenter.component.css']
})
export class StrCostcenterComponent  implements OnInit {
  title = 'Angular13Crud';
  //define table fields which has to be same to api fields
  displayedColumns: string[] = ['code', 'name','costCenterCategoryName','action'];
  dataSource!: MatTableDataSource<any>;
  costcenterlist:any;
  costcenter: any = {
    id: 0,
    name: ''

  }

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private dialog: MatDialog, private api: ApiService,private global:GlobalService
    ,private hotkeysService: HotkeysService){
      global.getPermissionUserRoles('Store', 'stores', 'إدارة المخازن وحسابات المخازن ', '')
  }
  ngOnInit(): void {
    this.getAllCostCenter();
    this.api.getCostCenter().subscribe((data: any) => {
      this.costcenterlist = data;
      console.log(this.costcenterlist)
    })
    this.hotkeysService.add(new Hotkey('ctrl+o', (event: KeyboardEvent): boolean => {
      // Call the deleteGrade() function in the current component
      this.openDialog();
      return false; // Prevent the default browser behavior
    }));
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
    var result = confirm('هل ترغب بتاكيد الحذف ؟ ');
    if (result) {
      this.api.deleteCostCenter(id).subscribe({
        next: (res) => {
          if(res == 'Succeeded'){
            console.log("res of deletestore:",res)
          alert('تم الحذف بنجاح');
          this.getAllCostCenter();

        }else{
          alert(" لا يمكن الحذف لارتباطها بجداول اخري!")
        }
        },
        error: () => {
          alert('خطأ فى حذف العنصر'); 
        },
      });
    }
}



  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}

