import { Component, OnInit, ViewChild } from '@angular/core';
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogModule,
} from '@angular/material/dialog';
import { STRGradeDialogComponent } from '../../str/str-grade-dialog/str-grade-dialog.component';
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
import { HrCityStateDialogComponent } from '../hr-city-state-dialog/hr-city-state-dialog.component';
import { HrWorkPlacedialogComponent } from '../hr-work-placedialog/hr-work-placedialog.component';
export class CityState {
  constructor(public id: number, public name: string) {}
}

@Component({
  selector: 'app-hr-work-place',
  templateUrl: './hr-work-place.component.html',
  styleUrls: ['./hr-work-place.component.css']
})
export class HrWorkPlaceComponent {
  cityStateCtrl: FormControl;
  filteredCityState: Observable<CityState[]>;
  CityStates: CityState[] = [];
  selectedCitystate!: CityState;
  formcontrol = new FormControl('');
  WorkPlaceCtrlForm!: FormGroup;
  title = 'Angular13Crud';
  //define table fields which has to be same to api fields
  displayedColumns: string[] = [ 'name', 'cityStateName', 'action'];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  
  constructor(private dialog: MatDialog, private api: ApiService) {
    this.cityStateCtrl = new FormControl();
    this.filteredCityState = this.cityStateCtrl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filterCitystate(value))
    );
  }
  ngOnInit(): void {
    // console.log(productForm)

    this.getHrWorkPlace();
    this.api.getAllCityState().subscribe((citystate) => {
      this.CityStates = citystate;
    });
  }
  openDialog() {
    this.dialog
      .open(HrWorkPlacedialogComponent, {
        width: '30%',
      })
      .afterClosed()
      .subscribe((val) => {
        if (val === 'save') {
          this.getHrWorkPlace();
        }
      });
  }

  displaycityStateName(citystate: any): string {
    return citystate && citystate.name ? citystate.name : '';
  }

  cityStateSelected(event: MatAutocompleteSelectedEvent): void {
    const citystate = event.option.value as CityState;
    this.selectedCitystate = citystate;
    this.WorkPlaceCtrlForm.patchValue({ cityStateId: citystate.id });
    this.WorkPlaceCtrlForm.patchValue({ cityStateName: citystate.name });
  }

  private _filterCitystate(value: string): CityState[] {
    const filterValue = value.toLowerCase();
    return this.CityStates.filter(citystate =>
      citystate.name.toLowerCase().includes(filterValue) 
    );
  }

  getHrWorkPlace() {
    this.api.getHrWorkPlace().subscribe({
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

  editHrWorkPlace(row: any) {
    this.dialog
      .open(HrWorkPlacedialogComponent, {
        width: '30%',
        data: row,
      })
      .afterClosed()
      .subscribe((val) => {
        if (val === 'update') {
          this.getHrWorkPlace();
        }
      });
  }

  deleteHrWorkPlace(id: number) {
    var result = confirm('هل ترغب بتاكيد مسح النوعية ؟ ');
    if (result) {
      this.api.deleteHrWorkPlace(id).subscribe({
        next: (res) => {
          alert('تم الحذف بنجاح');
          this.getHrWorkPlace();
        },
        error: () => {
          alert('خطأ فى حذف العنصر');
        },
      });
    }
  }
  openAutoCityState() {
    this.cityStateCtrl.setValue(''); // Clear the input field value
  
    // Open the autocomplete dropdown by triggering the value change event
    this.cityStateCtrl.updateValueAndValidity();
  }
  async getSearchHrWorkPlace(name: any) {
    this.api.getHrWorkPlace().subscribe({
      next: (res) => {
        //enter id
        if (this.selectedCitystate && name == '') {
          console.log('filter ID id: ', this.selectedCitystate, 'name: ', name);

          this.dataSource = res.filter(
            (res: any) => res.cityStateId == this.selectedCitystate.id!
          );
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }
        //enter both
        else if (this.selectedCitystate && name != '') {
          console.log('filter both id: ', this.selectedCitystate, 'name: ', name);

          // this.dataSource = res.filter((res: any)=> res.name==name!)
          this.dataSource = res.filter(
            (res: any) =>
              res.cityStateId == this.selectedCitystate.id! &&
              res.name.toLowerCase().includes(name.toLowerCase())
          );
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }
        //enter name
        else {
          console.log('filter name id: ', this.selectedCitystate, 'name: ', name);
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
