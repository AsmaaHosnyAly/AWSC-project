import { Component, OnInit, ViewChild } from '@angular/core';
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogModule,
} from '@angular/material/dialog';
import { PyInstallmentDialogComponent } from '../py-installment-dialog/py-installment-dialog.component';
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
import { HotkeysService } from 'angular2-hotkeys';
import { Hotkey } from 'angular2-hotkeys';
import { ToastrService } from 'ngx-toastr';
import { PyGroupDialogComponent } from '../py-group-dialog/py-group-dialog.component';

@Component({
  selector: 'app-py-group',
  templateUrl: './py-group.component.html',
  styleUrls: ['./py-group.component.css']
})
export class PyGroupComponent implements OnInit {

  formcontrol = new FormControl('');
  InstallmentForm!: FormGroup;

  displayedColumns: string[] = ['name', 'action'];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private dialog: MatDialog, private toastr: ToastrService,
    private api: ApiService,
    private hotkeysService: HotkeysService) { }

  ngOnInit(): void {

    this.getAllItemGroups();

    this.hotkeysService.add(new Hotkey('ctrl+o', (event: KeyboardEvent): boolean => {
      // Call the deleteGrade() function in the current component
      this.openDialog();
      return false; // Prevent the default browser behavior
    }));
  }

  openDialog() {
    this.dialog
      .open(PyGroupDialogComponent, {
        width: '43%',
      })
      .afterClosed()
      .subscribe((val) => {
        if (val === 'save') {
          this.getAllItemGroups();
        }
      });
  }

  getAllItemGroups() {
    this.api.getPyItemGroup().subscribe({
      next: (res) => {
        console.log("master itemGroup res: ", res);

        this.dataSource = new MatTableDataSource(res);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: (err) => {
        // alert('Error');
      },
    });
  }

  editItemGroup(row: any) {
    this.dialog
      .open(PyGroupDialogComponent, {
        width: '43%',
        data: row,
      })
      .afterClosed()
      .subscribe((val) => {
        if (val === 'update') {
          this.getAllItemGroups();
        }
      });
  }

  deleteItemGroup(id: number) {
    var result = confirm('هل ترغب بتاكيد الحذف ؟ ');
    if (result) {
      this.api.deletePyItemGroup(id).subscribe({
        next: (res) => {
          if (res == 'Succeeded') {
            // console.log("res of deleteInstallment:", res);
            this.toastrDeleteSuccess();
            this.getAllItemGroups();
          }
          else {
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
