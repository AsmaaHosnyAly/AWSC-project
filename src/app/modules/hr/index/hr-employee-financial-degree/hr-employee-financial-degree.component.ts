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
import { HrCityStateDialogComponent } from '../hr-city-state-dialog/hr-city-state-dialog.component';
import { ToastrService } from 'ngx-toastr';
import { HrEmployeeFinancialDegreeDialogComponent } from '../hr-employee-financial-degree-dialog/hr-employee-financial-degree-dialog.component';
export class City {
  constructor(public id: number, public name: string) {}
}

@Component({
  selector: 'app-hr-employee-financial-degree',
  templateUrl: './hr-employee-financial-degree.component.html',
  styleUrls: ['./hr-employee-financial-degree.component.css']
})
export class HrEmployeeFinancialDegreeComponent {
  cityCtrl: FormControl;
  filteredCities: Observable<City[]>;
  cities: City[] = [];
  selectedCity!: City;
  formcontrol = new FormControl('');
  cityStateForm!: FormGroup;
  title = 'Angular13Crud';
  //define table fields which has to be same to api fields
  displayedColumns: string[] = [ 'financialDegreeName', 'financialDegreeDate', 'action'];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  
  constructor(private dialog: MatDialog, private api: ApiService,private toastr: ToastrService) {
    this.cityCtrl = new FormControl();
    this.filteredCities = this.cityCtrl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filterCities(value))
    );
  }
  ngOnInit(): void {
    // console.log(productForm)

    this.getHrEmployeeFinancialDegree();
    this.api.getHrCity().subscribe((cities) => {
      this.cities = cities;
    });
  }
  openDialog() {
    this.dialog
      .open(HrEmployeeFinancialDegreeDialogComponent, {
        width: '30%',
      })
      .afterClosed()
      .subscribe((val) => {
        if (val === 'save') {
          this.getHrEmployeeFinancialDegree();
        }
      });
  }

  displaycityName(city: any): string {
    return city && city.name ? city.name : '';
  }

  citySelected(event: MatAutocompleteSelectedEvent): void {
    const city = event.option.value as City;
    this.selectedCity = city;
    this.cityStateForm.patchValue({ cityId: city.id });
    this.cityStateForm.patchValue({ cityName: city.name });
  }

  private _filterCities(value: string): City[] {
    const filterValue = value.toLowerCase();
    return this.cities.filter(city =>
      city.name.toLowerCase().includes(filterValue) 
    );
  }

  getHrEmployeeFinancialDegree() {
    this.api.getEmployeeFinancialDegree().subscribe({
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

  editHrEmployeeFinancialDegree(row: any) {
    this.dialog
      .open(HrEmployeeFinancialDegreeDialogComponent, {
        width: '30%',
        data: row,
      })
      .afterClosed()
      .subscribe((val) => {
        if (val === 'update') {
          this.getHrEmployeeFinancialDegree();
        }
      });
  }

  deleteEmployeeFinancialDegree(id: number) {
    var result = confirm('هل ترغب بتاكيد الحذف ؟ ');
    if (result) {
      this.api.deleteHrEmployeeFinancialDegree(id)
      .subscribe({
        next: (res) => {
          if(res == 'Succeeded'){
            console.log("res of deletestore:",res)
            this.toastrDeleteSuccess();
          this.getHrEmployeeFinancialDegree();
  
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
 
 

  openAutoCity() {
    this.cityCtrl.setValue(''); // Clear the input field value
  
    // Open the autocomplete dropdown by triggering the value change event
    this.cityCtrl.updateValueAndValidity();
  }
  async getSearchHrCityState(name: any) {
    this.api.getHrCityState().subscribe({
      next: (res) => {
        //enter id
        if (this.selectedCity && name == '') {
          console.log('filter ID id: ', this.selectedCity, 'name: ', name);

          this.dataSource = res.filter(
            (res: any) => res.cityId == this.selectedCity.id!
          );
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }
        //enter both
        else if (this.selectedCity && name != '') {
          console.log('filter both id: ', this.selectedCity, 'name: ', name);

          // this.dataSource = res.filter((res: any)=> res.name==name!)
          this.dataSource = res.filter(
            (res: any) =>
              res.commodityId == this.selectedCity.id! &&
              res.name.toLowerCase().includes(name.toLowerCase())
          );
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }
        //enter name
        else {
          console.log('filter name id: ', this.selectedCity, 'name: ', name);
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
