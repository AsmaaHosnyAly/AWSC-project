import { Component, OnInit, ViewChild } from '@angular/core';
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogModule,
} from '@angular/material/dialog';
import { STRGradeDialogComponent } from '../str-grade-dialog/str-grade-dialog.component';
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
import { GlobalService } from '../services/global.service';
export class Commodity {
  constructor(public id: number, public name: string, public code: string,public global:GlobalService) {}
}
@Component({
  selector: 'app-str-grade',
  templateUrl: './str-grade.component.html',
  styleUrls: ['./str-grade.component.css'],
})
export class STRGradeComponent implements OnInit {
  commodityCtrl: FormControl;
  filteredCommodities: Observable<Commodity[]>;
  commodities: Commodity[] = [];
  selectedCommodity!: Commodity;
  formcontrol = new FormControl('');
  gradeForm!: FormGroup;
  title = 'Angular13Crud';
  //define table fields which has to be same to api fields
  displayedColumns: string[] = ['code', 'name', 'commodityName', 'action'];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  
  constructor(private dialog: MatDialog, private api: ApiService,private global:GlobalService) {
    this.commodityCtrl = new FormControl();
    this.filteredCommodities = this.commodityCtrl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filterCommodities(value))
    );

    global.getPermissionUserRoles(4, 'stores', ' النوعية', '')
  }
  ngOnInit(): void {
    // console.log(productForm)
    
    this.getAllGrades();
    this.api.getAllCommodity().subscribe((commodities) => {
      this.commodities = commodities;
    });
  }
  openDialog() {
    this.dialog
      .open(STRGradeDialogComponent, {
        width: '30%',
      })
      .afterClosed()
      .subscribe((val) => {
        if (val === 'save') {
          this.getAllGrades();
        }
      });
  }

  displayCommodityName(commodity: any): string {
    return commodity && commodity.name ? commodity.name : '';
  }
  commoditySelected(event: MatAutocompleteSelectedEvent): void {
    const commodity = event.option.value as Commodity;
    this.selectedCommodity = commodity;
    this.gradeForm.patchValue({ commodityId: commodity.id });
    this.gradeForm.patchValue({ commodityName: commodity.name });
  }
  private _filterCommodities(value: string): Commodity[] {
    const filterValue = value.toLowerCase();
    return this.commodities.filter(commodity =>
      commodity.name.toLowerCase().includes(filterValue) || commodity.code.toLowerCase().includes(filterValue)
    );
  }

  getAllGrades() {
    this.api.getGrade().subscribe({
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

  editGrade(row: any) {
    this.dialog
      .open(STRGradeDialogComponent, {
        width: '30%',
        data: row,
      })
      .afterClosed()
      .subscribe((val) => {
        if (val === 'update') {
          this.getAllGrades();
        }
      });
  }

  deleteGrade(id: number) {
    var result = confirm('هل ترغب بتاكيد مسح النوعية ؟ ');
    if (result) {
      this.api.deleteGrade(id).subscribe({
        next: (res) => {
          alert('تم الحذف بنجاح');
          this.getAllGrades();
        },
        error: () => {
          alert('خطأ فى حذف العنصر');
        },
      });
    }
  }
  openAutoCommodity() {
    this.commodityCtrl.setValue(''); // Clear the input field value
  
    // Open the autocomplete dropdown by triggering the value change event
    this.commodityCtrl.updateValueAndValidity();
  }
  async getSearchGrades(name: any) {
    this.api.getGrade().subscribe({
      next: (res) => {
        //enter id
        if (this.selectedCommodity && name == '') {
          console.log('filter ID id: ', this.selectedCommodity, 'name: ', name);

          this.dataSource = res.filter(
            (res: any) => res.commodityId == this.selectedCommodity.id!
          );
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }
        //enter both
        else if (this.selectedCommodity && name != '') {
          console.log('filter both id: ', this.selectedCommodity, 'name: ', name);

          // this.dataSource = res.filter((res: any)=> res.name==name!)
          this.dataSource = res.filter(
            (res: any) =>
              res.commodityId == this.selectedCommodity.id! &&
              res.name.toLowerCase().includes(name.toLowerCase())
          );
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }
        //enter name
        else {
          console.log('filter name id: ', this.selectedCommodity, 'name: ', name);
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
