import { Component, OnInit, ViewChild } from '@angular/core';
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogModule,
} from '@angular/material/dialog';
import { STRGradeDialogComponent } from '../str-grade-dialog/str-grade-dialog.component';
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
import { GlobalService } from '../../services/global.service';
import { StrModelDailogComponent } from '../str-model-dailog/str-model-dailog.component';
export class vendor {
  constructor(public id: number, public name: string,public global:GlobalService) {}
}
@Component({
  selector: 'app-str-model',
  templateUrl: './str-model.component.html',
  styleUrls: ['./str-model.component.css']
})
export class StrModelComponent {
  vendorCtrl: FormControl;
  filteredVendores: Observable<vendor[]>;
  vendores: vendor[] = [];
  selectedVendor!: vendor;
  formcontrol = new FormControl('');
  gradeForm!: FormGroup;
  title = 'Angular13Crud';
  //define table fields which has to be same to api fields
  displayedColumns: string[] = [ 'name', 'vendorName', 'action'];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  
  constructor(private dialog: MatDialog, private api: ApiService,private global:GlobalService) {
    this.vendorCtrl = new FormControl();
    this.filteredVendores = this.vendorCtrl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filterVendores(value))
    );

    global.getPermissionUserRoles(4, 'stores', ' النوعية', '')
  }
  ngOnInit(): void {
    // console.log(productForm)
    
    this.getAllModels();
    this.api.getAllVendor().subscribe((vendores) => {
      this.vendores = vendores;
    });
  }
  openDialog() {
    this.dialog
      .open(StrModelDailogComponent, {
        width: '30%',
      })
      .afterClosed()
      .subscribe((val) => {
        if (val === 'save') {
          this.getAllModels();
        }
      });
  }

  displayVendorName(vendor: any): string {
    return vendor && vendor.name ? vendor.name : '';
  }
  vendorSelected(event: MatAutocompleteSelectedEvent): void {
    const vendor = event.option.value as vendor;
    this.selectedVendor = vendor;
    this.gradeForm.patchValue({ vendorId: vendor.id });
    this.gradeForm.patchValue({ vendorName: vendor.name });
  }
  private _filterVendores(value: string): vendor[] {
    const filterValue = value.toLowerCase();
    return this.vendores.filter(vendor =>
      vendor.name.toLowerCase().includes(filterValue) 
    );
  }

  getAllModels() {
    this.api.getModel().subscribe({
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

  editModel(row: any) {
    this.dialog
      .open(StrModelDailogComponent, {
        width: '30%',
        data: row,
      })
      .afterClosed()
      .subscribe((val) => {
        if (val === 'update') {
          this.getAllModels();
        }
      });
  }

  deleteModel(id: number) {
    var result = confirm('هل ترغب بتاكيد مسح النوعية ؟ ');
    if (result) {
      this.api.deleteModel(id).subscribe({
        next: (res) => {
          alert('تم الحذف بنجاح');
          this.getAllModels();
        },
        error: () => {
          alert('خطأ فى حذف العنصر');
        },
      });
    }
  }
  openAutoVendor() {
    this.vendorCtrl.setValue(''); // Clear the input field value
  
    // Open the autocomplete dropdown by triggering the value change event
    this.vendorCtrl.updateValueAndValidity();
  }
  
  async getSearchModels(name: any) {
    this.api.getModel().subscribe({
      next: (res) => {
        //enter id
        if (this.selectedVendor && name == '') {
          console.log('filter ID id: ', this.selectedVendor, 'name: ', name);

          this.dataSource = res.filter(
            (res: any) => res.vendorId == this.selectedVendor.id!
          );
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }
        //enter both
        else if (this.selectedVendor && name != '') {
          console.log('filter both id: ', this.selectedVendor, 'name: ', name);

          // this.dataSource = res.filter((res: any)=> res.name==name!)
          this.dataSource = res.filter(
            (res: any) =>
              res.vendorId == this.selectedVendor.id! &&
              res.name.toLowerCase().includes(name.toLowerCase())
          );
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }
        //enter name
        else {
          console.log('filter name id: ', this.selectedVendor, 'name: ', name);
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
