import { Component, OnInit, ViewChild } from '@angular/core';
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogModule,
} from '@angular/material/dialog';
import { FIAccountDialogComponent } from '../fi-account-dialog/fi-account-dialog.component';
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
export class Hierarchy {
  constructor(public id: number, public name: string, public level: string) {}
}
@Component({
  selector: 'app-fi-account',
  templateUrl: './fi-account.component.html',
  styleUrls: ['./fi-account.component.css']
})
export class FIAccountComponent implements OnInit {
  hierarchyCtrl: FormControl;
  filteredHierarchies: Observable<Hierarchy[]>;
  hierarchies: Hierarchy[] = [];
  selectedHierarchy!: Hierarchy;
  formcontrol = new FormControl('');
  accountForm!: FormGroup;
  title = 'Angular13Crud';
  //define table fields which has to be same to api fields
  displayedColumns: string[] = ['code', 'name', 'fiAccountHierarchyName', 'fiAccountlevel', 'action'];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  commidityDt: any = {
    id: 0,
  };
  constructor(private dialog: MatDialog, private api: ApiService) {
    this.hierarchyCtrl = new FormControl();
    this.filteredHierarchies = this.hierarchyCtrl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filterHierarchies(value))
    );
  }
  ngOnInit(): void {
    // console.log(productForm)

    this.getAllHierarchies();
    this.api.getAllAccountHierarchy().subscribe((hierarchies) => {
      this.hierarchies = hierarchies;
    });
  }
  openDialog() {
    this.dialog
      .open(FIAccountDialogComponent, {
        width: '30%',
      })
      .afterClosed()
      .subscribe((val) => {
        if (val === 'save') {
          this.getAllHierarchies();
        }
      });
  }

  displayHierarchyName(hierarchy: any): string {
    return hierarchy && hierarchy.name ? hierarchy.name : '';
  }
  hierarchySelected(event: MatAutocompleteSelectedEvent): void {
    const hierarchy = event.option.value as Hierarchy;
    this.selectedHierarchy = hierarchy;
    this.accountForm.patchValue({ fiAccountHierarchyId: hierarchy.id });
      this.accountForm.patchValue({ fiAccountHierarchyName: hierarchy.name });
      this.accountForm.patchValue({ fiAccountHierarchyLevel: hierarchy.level });
  }
  private _filterHierarchies(value: string): Hierarchy[] {
    const filterValue = value.toLowerCase();
    return this.hierarchies.filter(hierarchy =>
      hierarchy.name.toLowerCase().includes(filterValue) || hierarchy.level.toLowerCase().includes(filterValue)
    );
  }

  openAutoHierarchy() {
    this.hierarchyCtrl.setValue(''); // Clear the input field value
  
    // Open the autocomplete dropdown by triggering the value change event
    this.hierarchyCtrl.updateValueAndValidity();
  }

  getAllHierarchies() {
    this.api.getAccount().subscribe({
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

  editAccount(row: any) {
    this.dialog
      .open(FIAccountDialogComponent, {
        width: '30%',
        data: row,
      })
      .afterClosed()
      .subscribe((val) => {
        if (val === 'update') {
          this.getAllHierarchies();
        }
      });
  }

  deleteAccount(id: number) {
    var result = confirm('هل ترغب بتاكيد مسح الحساب ؟ ');
    if (result) {
      this.api.deleteAccount(id).subscribe({
        next: (res) => {
          alert('تم الحذف بنجاح');
          this.getAllHierarchies();
        },
        error: () => {
          alert('خطأ فى حذف العنصر');
        },
      });
    }
  }
  async getSearchAccounts(name: any) {
    this.api.getAccount().subscribe({
      next: (res) => {
        //enter id
        if (this.selectedHierarchy && name == '') {
          console.log('filter ID id: ', this.selectedHierarchy, 'name: ', name);

          this.dataSource = res.filter(
            (res: any) => res.fiAccountHierarchyId == this.selectedHierarchy.id!
          );
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }
        //enter both
        else if (this.selectedHierarchy && name != '') {
          console.log('filter both id: ', this.selectedHierarchy, 'name: ', name);

          // this.dataSource = res.filter((res: any)=> res.name==name!)
          this.dataSource = res.filter(
            (res: any) =>
              res.fiAccountHierarchyId == this.selectedHierarchy.id! &&
              res.name.toLowerCase().includes(name.toLowerCase())
          );
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }
        //enter name
        else {
          console.log('filter name id: ', this.selectedHierarchy, 'name: ', name);
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
}

