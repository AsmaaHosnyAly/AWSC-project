import { Component, OnInit, ViewChild } from '@angular/core';
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogModule,
} from '@angular/material/dialog';
import { FIEntrySourceTypeDialogComponent } from '../fi-entry-source-type-dialog/fi-entry-source-type-dialog.component';
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
import { ToastrService } from 'ngx-toastr';
import { HotkeysService } from 'angular2-hotkeys';
import { Hotkey } from 'angular2-hotkeys';


export class EntrySource {
  constructor(public id: number, public name: string) {}
}

@Component({
  selector: 'app-fi-entry-source-type',
  templateUrl: './fi-entry-source-type.component.html',
  styleUrls: ['./fi-entry-source-type.component.css']
})
export class FIEntrySourceTypeComponent implements OnInit {
  entrySourceCtrl: FormControl;
  filteredEntrySources: Observable<EntrySource[]>;
  entrySources: EntrySource[] = [];
  selectedEntrySource!: EntrySource;
  formcontrol = new FormControl('');
  entrySourceTypeForm!: FormGroup;
  title = 'Angular13Crud';
  //define table fields which has to be same to api fields
  displayedColumns: string[] = ['name', 'fiEntrySourceName', 'action'];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private dialog: MatDialog,private hotkeysService: HotkeysService, private api: ApiService,private toastr: ToastrService) {
    this.entrySourceCtrl = new FormControl();
    this.filteredEntrySources = this.entrySourceCtrl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filterEntrySources(value))
    );
  }
  ngOnInit(): void {
    // console.log(productForm)

    this.getAllEntrySourceTypes();
    this.api.getAllEntrySources().subscribe((entrySources) => {
      this.entrySources = entrySources;
    });
    this.hotkeysService.add(new Hotkey('ctrl+o', (event: KeyboardEvent): boolean => {
      // Call the deleteGrade() function in the current component
      this.openDialog();
      return false; // Prevent the default browser behavior
    }));
  }
  openDialog() {
    this.dialog
      .open(FIEntrySourceTypeDialogComponent, {
        width: '30%',
      })
      .afterClosed()
      .subscribe((val) => {
        if (val === 'حفظ') {
          this.getAllEntrySourceTypes();
        }
      });

  }

  displayEntrySourceName(entrySource: any): string {
    return entrySource && entrySource.name ? entrySource.name : '';
  }
  entrySourceSelected(event: MatAutocompleteSelectedEvent): void {
    const entrySource = event.option.value as EntrySource;
    this.selectedEntrySource = entrySource;
    this.entrySourceTypeForm.patchValue({ entrySourceId: entrySource.id });
      this.entrySourceTypeForm.patchValue({ fiEntrySourceName: entrySource.name });
  }
  private _filterEntrySources(value: string): EntrySource[] {
    const filterValue = value.toLowerCase();
    return this.entrySources.filter(entrySource =>
      entrySource.name.toLowerCase().includes(filterValue) 
    );
  }

  openAutoEntrySource() {
    this.entrySourceCtrl.setValue(''); // Clear the input field value
  
    // Open the autocomplete dropdown by triggering the value change event
    this.entrySourceCtrl.updateValueAndValidity();
  }

  getAllEntrySourceTypes() {
    this.api.getEntrySourceType().subscribe({
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

  editEntrySourceType(row: any) {
    this.dialog
      .open(FIEntrySourceTypeDialogComponent, {
        width: '30%',
        data: row,
      })
      .afterClosed()
      .subscribe((val) => {
        if (val === 'تعديل') {
          this.getAllEntrySourceTypes();
        }
      });
  }

  deleteEntrySourceType(id: number) {
    var result = confirm('هل ترغب بتاكيد مسح الحساب ؟ ');
    if (result) {
      this.api.deleteEntrySourceType(id).subscribe({
        next: (res) => {
          alert('تم الحذف بنجاح');
          this.getAllEntrySourceTypes();
        },
        error: () => {
          alert('خطأ فى حذف العنصر');
        },
      });
    }
  }
  async getSearchEntrySourceTypes(name: any) {
    this.api.getEntrySourceType().subscribe({
      next: (res) => {
        //enter id
        if (this.selectedEntrySource && name == '') {
          console.log('filter ID id: ', this.selectedEntrySource, 'name: ', name);

          this.dataSource = res.filter(
            (res: any) => res.entrySourceId == this.selectedEntrySource.id!
          );
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }
        //enter both
        else if (this.selectedEntrySource && name != '') {
          console.log('filter both id: ', this.selectedEntrySource, 'name: ', name);

          // this.dataSource = res.filter((res: any)=> res.name==name!)
          this.dataSource = res.filter(
            (res: any) =>
              res.entrySourceId == this.selectedEntrySource.id! &&
              res.name.toLowerCase().includes(name.toLowerCase())
          );
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }
        //enter name
        else {
          console.log('filter name id: ', this.selectedEntrySource, 'name: ', name);
          // this.dataSource = res.filter((res: any)=> res.commodity==commidityID! && res.name==name!)
          this.dataSource = res.filter((res: any) =>
            res.name.toLowerCase().includes(name.toLowerCase())
          );
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }
      },
      error: (err) => {
        alert('Error');
      },
    });
    // this.getAllProducts()
  }



  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  toastrSuccess(): void {
    this.toastr.success('تم الحفظ بنجاح');
  }
  toastrDeleteSuccess(): void {
    this.toastr.success('تم الحذف بنجاح');
  }
  toastrEditSuccess(): void {
    this.toastr.success('تم التعديل بنجاح');
  }
  
}

