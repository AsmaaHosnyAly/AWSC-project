import { Component, OnInit, ViewChild } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { STRUnitsDialogComponent } from '../str-units-dialog/str-units-dialog.component';
import { ApiService } from '../../services/api.service';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatSort, MatSortModule} from '@angular/material/sort';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { GlobalService } from 'src/app/pages/services/global.service';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import { HotkeysService } from 'angular2-hotkeys';
import { Hotkey } from 'angular2-hotkeys';
@Component({
  selector: 'app-str-units',
  templateUrl: './str-units.component.html',
  styleUrls: ['./str-units.component.css']
})
export class STRUnitsComponent {
  title = 'angular13crud';
  displayedColumns: string[] = [ 'name', 'action'];
  dataSource!: MatTableDataSource<any>;
 
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  constructor(private dialog : MatDialog,private toastr: ToastrService, private api : ApiService,private global:GlobalService , private http:HttpClient,private hotkeysService: HotkeysService){
    global.getPermissionUserRoles('Store', 'str-home', 'إدارة المخازن وحسابات المخازن ', 'store')
    
 
  }
  ngOnInit(): void {
    this.getAllUnits();
    this.hotkeysService.add(new Hotkey('ctrl+o', (event: KeyboardEvent): boolean => {
      // Call the deleteGrade() function in the current component
      this.openDialog();
      return false; // Prevent the default browser behavior
    }));
  }
  
  openDialog() {
    
    this.dialog.open(STRUnitsDialogComponent, {
      width: '30%'
      
    }).afterClosed().subscribe(val=>{
      if(val === 'save'){
        this.getAllUnits();
      }
    })
  }
  getAllUnits(){
    this.api.getunit()
    .subscribe({
      next:(res)=>{
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error:(err)=>{
        alert("خطأ عند استدعاء البيانات");
      }
      
    })
  }
  editunit(row : any){
    this.dialog.open(STRUnitsDialogComponent,{
      width:'30%',
      data:row
    }).afterClosed().subscribe(val=>{
      if(val === 'update'){
        this.getAllUnits();
      }
    })
  }
  daleteunit(id:number){
    var result = confirm('هل ترغب بتاكيد الحذف ؟ ');
    if (result) {
      this.api.deleteunit(id)

  .subscribe({
        next: (res) => {
          if(res == 'Succeeded'){
            console.log("res of deletestore:",res)
            this.toastrDeleteSuccess();
          this.getAllUnits();
  
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