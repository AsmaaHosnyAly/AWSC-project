

import { Component, OnInit, ViewChild} from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { StrCommodityDialogComponent } from '../STR_Commodity_dialog/str-commodity-dialog.component';
import { ApiService } from '../../services/api.service';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatButtonModule} from '@angular/material/button';
import {NgIf} from '@angular/common';
import {MatSidenavModule} from '@angular/material/sidenav';
import { GlobalService } from 'src/app/pages/services/global.service';
import { HotkeysService } from 'angular2-hotkeys';
import { Hotkey } from 'angular2-hotkeys';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-str-commodity',
    templateUrl: './STR_Commodity.component.html',
    styleUrls: ['./STR_Commodity.component.css'],
})
export class StrCommodityComponent implements OnInit {

title = 'Angular13Crud';
//define table fields which has to be same to api fields
displayedColumns: string[] = ['code', 'name','accountName','action'];
dataSource!: MatTableDataSource<any>;

@ViewChild(MatPaginator) paginator!: MatPaginator;
@ViewChild(MatSort) sort!: MatSort;

constructor(private dialog: MatDialog,private toastr: ToastrService, private api: ApiService,private global:GlobalService,private hotkeysService: HotkeysService) {
  global.getPermissionUserRoles('Store', 'stores', 'إدارة المخازن وحسابات المخازن ', 'store')
}

ngOnInit(): void {
  this.getAllcommodity();
  this.hotkeysService.add(new Hotkey('ctrl+o', (event: KeyboardEvent): boolean => {
    // Call the deleteGrade() function in the current component
    this.openDialog();
    return false; // Prevent the default browser behavior
  }));
  
}


openDialog() {
  this.dialog.open(StrCommodityDialogComponent, {
    width: '30%'
  }).afterClosed().subscribe(val => {
    if (val === 'حفظ') {
      // alert("refresh")
      this.getAllcommodity();
    }
  });
}

getAllcommodity() {
  this.api.getcommodity()
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


editcommodity(row: any) {
  this.dialog.open(StrCommodityDialogComponent, {
    width: '30%',
    data: row
  }).afterClosed().subscribe(val => {
    if (val === 'تحديث') {
      this.getAllcommodity();
    }
  })
}

deletecommodity(id:number){
  var result = confirm('هل ترغب بتاكيد الحذف ؟ ');
  if (result) {
    this.api.deleteCommodity(id).subscribe({
      next: (res) => {
        if(res == 'Succeeded'){
          console.log("res of deletestore:",res)
          this.toastrDeleteSuccess();
        this.getAllcommodity();
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

toastrDeleteSuccess(): void {
  this.toastr.success('تم الحذف بنجاح');
}


applyFilter(event: Event) {
  const filterValue = (event.target as HTMLInputElement).value;
  this.dataSource.filter = filterValue.trim().toLowerCase();

  if (this.dataSource.paginator) {
    this.dataSource.paginator.firstPage();
  }
}

}