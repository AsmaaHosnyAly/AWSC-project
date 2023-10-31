import { Component, OnInit, ViewChild } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { StrVendorDialogComponent } from '../str-vendor-dialog/str-vendor-dialog.component';
import { ApiService } from '../../services/api.service';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatSort, MatSortModule} from '@angular/material/sort';
import { GlobalService } from 'src/app/pages/services/global.service';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { HotkeysService } from 'angular2-hotkeys';
import { Hotkey } from 'angular2-hotkeys';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-str-vendor',
  templateUrl: './str-vendor.component.html',
  styleUrls: ['./str-vendor.component.css']
})
export class StrVendorComponent {
  title = 'angular13crud';
  displayedColumns: string[] = [ 'name', 'action'];
  dataSource!: MatTableDataSource<any>;
loading : boolean= false ;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  constructor(private dialog : MatDialog,private toastr: ToastrService, private api : ApiService,private global:GlobalService,private hotkeysService: HotkeysService){
    global.getPermissionUserRoles('Store', 'stores', 'إدارة المخازن وحسابات المخازن ', 'store')

  }
  ngOnInit(): void {
    this.getAllVendors();
    this.hotkeysService.add(new Hotkey('ctrl+o', (event: KeyboardEvent): boolean => {
      // Call the deleteGrade() function in the current component
      this.openDialog();
      return false; // Prevent the default browser behavior
    }));
  }
  openDialog() {
    
    this.dialog.open(StrVendorDialogComponent, {
      width: '30%'
    }).afterClosed().subscribe(val=>{
     
      if(val === 'save'){
        this.getAllVendors();
      }
      
    })
  }
  getAllVendors(){
    this.loading=true;
    this.api.getVendor()
    .subscribe({
      next:(res)=>{
        this.loading=false;
        console.log("res get vendor: ", res)
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error:(err)=>{
        this.loading=false;
        console.log("err get vendor: ", err)
        alert("خطأ عند استدعاء البيانات");
      }
      
    })
  }
  editVendor(row : any){
    this.dialog.open(StrVendorDialogComponent,{
      width:'30%',
      data:row
    }).afterClosed().subscribe(val=>{
      if(val === 'update'){
        this.getAllVendors();
      }
    })
  }
  daleteVendor(id:number){
    var result = confirm('هل ترغب بتاكيد الحذف ؟ ');
    if (result) {
      this.api.daleteVendor(id)

  .subscribe({
        next: (res) => {
          if(res == 'Succeeded'){
            console.log("res of deletestore:",res)
            this.toastrDeleteSuccess();
          this.getAllVendors();


  
        }else{
          alert(" لا يمكن الحذف لارتباطها بجداول اخري!")
        }
        },
        error: () => {
          alert('خطأ فى حذف العنصر');
        },
      });
    }}
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



