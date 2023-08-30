import { Component, OnInit, ViewChild } from '@angular/core';
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogModule,
} from '@angular/material/dialog';
import { FIEntrySourceDialogComponent } from '../fi-entry-source-dialog/fi-entry-source-dialog.component';
import { ApiService } from '../services/api.service';
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
import { HrQualitativeGroupDialogComponent } from '../hr-qualitative-group-dialog/hr-qualitative-group-dialog.component';

@Component({
  selector: 'app-hr-qualitative-group',
  templateUrl: './hr-qualitative-group.component.html',
  styleUrls: ['./hr-qualitative-group.component.css']
})
export class HrQualitativeGroupComponent {
  formcontrol = new FormControl('');
  EntrySourceForm!: FormGroup;
  title = 'Angular13Crud';
  //define table fields which has to be same to api fields
  displayedColumns: string[] = ['name', 'action'];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  constructor(private dialog: MatDialog, private api: ApiService) { }
  ngOnInit(): void {
    // console.log(productForm)
    this.getAllHrQualitativeGroup();
  }
  openDialog() {
    this.dialog
      .open(HrQualitativeGroupDialogComponent, {
        width: '30%',
      })
      .afterClosed()
      .subscribe((val) => {
        if (val === 'save') {
          this.getAllHrQualitativeGroup();
        }
      });
  }

  

  getAllHrQualitativeGroup() {
    this.api.getHrQualitativeGroup().subscribe({
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

  editHrQualitativeGroup(row: any) {
    this.dialog
      .open(HrQualitativeGroupDialogComponent, {
        width: '30%',
        data: row,
      })
      .afterClosed()
      .subscribe((val) => {
        if (val === 'update') {
          this.getAllHrQualitativeGroup();
        }
      });
  }

  deleteHrQualitativeGroup(id: number) {
    var result = confirm('هل ترغب بتاكيد الحذف ؟ ');
    if (result) {
      this.api.deleteHrQualitativeGroup(id).subscribe({
        next: (res) => {
          alert('تم الحذف بنجاح');
          this.getAllHrQualitativeGroup();
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
