



import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ApiService } from '../../services/api.service';
import { ToastrService } from 'ngx-toastr';
import {DomSanitizer, SafeHtml} from '@angular/platform-browser';
// import { GlobalService } from '../services/global.service';
import { HotkeysService } from 'angular2-hotkeys';
import { Hotkey } from 'angular2-hotkeys';
import { CcPlantComponentDialogComponent } from '../cc-plant-component-dialog/cc-plant-component-dialog.component';

@Component({
  selector: 'app-cc-plant-component',
  templateUrl: './cc-plant-component.component.html',
  styleUrls: ['./cc-plant-component.component.css']
})
export class CcPlantComponentComponent implements OnInit {
 
  displayedColumns: string[] = ['code','name', 'action'];

  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private dialog: MatDialog, private hotkeysService: HotkeysService,private api: ApiService, private toastr: ToastrService) {
   }

  ngOnInit(): void {
    this.getAllCcPlantComponent();
    // console.log("shortlink",this.shortLink)
    this.hotkeysService.add(new Hotkey('ctrl+o', (event: KeyboardEvent): boolean => {
      // Call the deleteGrade() PlantComponent in the current component
      this.openDialog();
      return false; // Prevent the default browser behavior
    }));
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }


  getAllCcPlantComponent() {
    this.api.getCcPlantComponent()
      .subscribe({
        next: (res) => {
          console.log("res of get all products: ", res);
          this.dataSource = new MatTableDataSource(res);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        },
        error: () => {
          alert("خطأ أثناء جلب سجلات المنتجات !!");
        }
      })
  }

  openDialog() {
    this.dialog.open(CcPlantComponentDialogComponent, {
      width: '30%'
    }).afterClosed().subscribe(val => {
      if (val === 'حفظ') {
        this.getAllCcPlantComponent();
      }
    })
  }


  editCcPlantComponent(row: any) {
    // console.log("edit row: ", row)
    this.dialog.open(CcPlantComponentDialogComponent, {
      width: '30%',
      data: row
    }).afterClosed().subscribe(val => {
      if (val === 'تعديل') {
        this.getAllCcPlantComponent();
      }
    })
  }
   


deleteCcPlantComponent(id: number) {
  var result = confirm('هل ترغب بتاكيد الحذف ؟ ');
  if (result) {
    this.api.deleteCcPlantComponent(id)
    .subscribe({
      next: (res) => {
        if(res == 'Succeeded'){
          console.log("res of deletestore:",res)
        // alert('تم الحذف بنجاح');
        this.toastrDeleteSuccess();
        this.getAllCcPlantComponent();

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
    this.toastr.success("تم الحذف بنجاح");
  }

}

