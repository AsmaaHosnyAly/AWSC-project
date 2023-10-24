


import { Component, OnInit, ViewChild } from '@angular/core';
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogModule,
} from '@angular/material/dialog';
import { ApiService } from '../../services/api.service';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { map, startWith } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatAccordion, MatExpansionModule } from '@angular/material/expansion';
import { MatOptionSelectionChange } from '@angular/material/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { GlobalService } from 'src/app/pages/services/global.service'; 
import { HotkeysService } from 'angular2-hotkeys';
import { Hotkey } from 'angular2-hotkeys';
import { ToastrService } from 'ngx-toastr';
import { CcSourceDialogComponent } from '../cc-source-dialog/cc-source-dialog.component';

@Component({
  selector: 'app-cc-source',
  templateUrl: './cc-source.component.html',
  styleUrls: ['./cc-source.component.css']
})

export class CcSourceComponent implements OnInit {
  
  title = 'Angular13Crud';
  //define table fields which has to be same to api fields
  displayedColumns: string[] = ['code', 'name', 'functionName', 'action'];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  
  
  constructor(private dialog: MatDialog,private toastr: ToastrService, private api: ApiService,private global:GlobalService,private hotkeysService: HotkeysService) {
    
    global.getPermissionUserRoles(4, 'stores', ' النوعية', '')
  }
  ngOnInit(): void {
    this.getAllSources();
    // console.log(productForm)
    this.hotkeysService.add(new Hotkey('ctrl+o', (event: KeyboardEvent): boolean => {
      // Call the deleteSource() function in the current component
      this.openDialog();
      return false; // Prevent the default browser behavior
    }));
  
  }
  openDialog() {
    this.dialog
      .open(CcSourceDialogComponent, {
        width: '45%',
      })
      .afterClosed()
      .subscribe((val) => {
        if (val === 'save') {
          this.getAllSources();
        }
      });
  }


  getAllSources() {
    this.api.getCcSource().subscribe({
      next: (res) => {
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: (err) => {
        alert('Error');
      },
    });
  }

  editSource(row: any) {
    this.dialog
      .open(CcSourceDialogComponent, {
        width: '45%',
        data: row,
      })
      .afterClosed()
      .subscribe((val) => {
        if (val === 'update') {
          this.getAllSources();
        }
      });
  }

  deleteSource(id: number) {
    var result = confirm('هل ترغب بتاكيد الحذف ؟ ');
    if (result) {
      this.api.deleteCcSource(id).subscribe({
        next: (res) => {
          if(res == 'Succeeded'){
            console.log("res of deletestore:",res)
            this.toastrDeleteSuccess();
          this.getAllSources();
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
