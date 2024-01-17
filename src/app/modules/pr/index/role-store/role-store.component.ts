import { Component, OnInit, ViewChild } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { RoleStoreDialogComponent } from '../role-store-dialog/role-store-dialog.component'; 
import { ApiService } from '../../services/api.service';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatSort, MatSortModule} from '@angular/material/sort';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { FormGroup, FormBuilder, Validator, Validators, FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { GlobalService } from 'src/app/pages/services/global.service'; 
import { ToastrService } from 'ngx-toastr';
import { map, startWith } from 'rxjs/operators';

import { HotkeysService } from 'angular2-hotkeys';
import { Hotkey } from 'angular2-hotkeys';

export class Commodity {
  constructor(public id: number, public name: string, public code: string) {}
}

export class Grade {
  constructor(public id: number, public name: string, public code: string,public commodityId: number) {}
}

export class Platoon {
  constructor(public id: number, public name: string, public code: string,public commodityId: number, public gradeId: number) {}
}

@Component({
  selector: 'app-role-store',
  templateUrl: './role-store.component.html',
  styleUrls: ['./role-store.component.css']
})
export class RoleStoreComponent implements OnInit{

  transactionUserId=localStorage.getItem('transactionUserId')
  
  title = 'angular13crud';
  displayedColumns: string[] = ['userName', 'storeName', 'action'];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  constructor(private dialog : MatDialog, private api : ApiService, private toastr: ToastrService,private global:GlobalService,private hotkeysService: HotkeysService){
    global.getPermissionUserRoles('Store', 'str-home', 'إدارة المخازن وحسابات المخازن ', 'store')
  
  }
  ngOnInit(): void {
    this.getAllGroups();
    this.hotkeysService.add(new Hotkey('ctrl+o', (event: KeyboardEvent): boolean => {
      // Call the deleteGrade() function in the current component
      this.openDialog();
      return false; // Prevent the default browser behavior
    }));    
  }
  openDialog() {
    this.dialog.open(RoleStoreDialogComponent, {
      width: '47%'
    }).afterClosed().subscribe(val=>{
      if(val === 'save'){
        this.getAllGroups();
      }
    })
  }


    getAllGroups(){
    this.api.getUserStore()
    .subscribe({
      next:(res)=>{
        console.log("res table: ", res);
        
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error:(err)=>{
        alert("error while fetching the records!!");
      }
      
    })
  }
  editPlatoon(row : any){
    console.log("data : " , row)
    this.dialog.open(RoleStoreDialogComponent,{
      width:'47%',
      data:row
    }).afterClosed().subscribe(val=>{
      if(val === 'update'){
        this.getAllGroups();
      }
    })
  }
  daletePlatoon(id:number){
    var result = confirm('هل ترغب بتاكيد الحذف ؟ ');
    if (result) {
      this.api.deleteUserStore(id)

  .subscribe({
        next: (res) => {
          if(res == 'Succeeded'){
            console.log("res of deletestore:",res)
            this.toastrDeleteSuccess();
          this.getAllGroups();
  
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



