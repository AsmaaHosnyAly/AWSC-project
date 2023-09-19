import { Component, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { STRPlatoonDialogComponent } from '../str-platoon-dialog/str-platoon-dialog.component';
import { ApiService } from '../../services/api.service';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import {
  FormGroup,
  FormBuilder,
  Validator,
  Validators,
  FormControl,
} from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { GlobalService } from '../../services/global.service';

export class Commodity {
  constructor(public id: number, public name: string, public code: string) {}
}

export class Grade {
  constructor(
    public id: number,
    public name: string,
    public code: string
  ) {}
}

@Component({
  selector: 'app-str-platoon',
  templateUrl: './str-platoon.component.html',
  styleUrls: ['./str-platoon.component.css'],
})
export class STRPlatoonComponent implements OnInit {
  [x: string]: any;
  transactionUserId = localStorage.getItem('transactionUserId');
  commodityCtrl: FormControl;
  filteredCommodities: Observable<Commodity[]>;
  commodities: Commodity[] = [];
  gradeCtrl: FormControl;
  filteredGrades: Observable<Grade[]>;
  grades: Grade[] = [];
  selectedCommodity!: Commodity;
  selectedGrade!: Grade;
  // selectedCommodity = this.commodities[0];
  // selectedGrade = this.grades[0];  
  formcontrol = new FormControl('');
  platoonForm!: FormGroup;
  platoon: any;
  title = 'angular13crud';
  displayedColumns: string[] = [
    'code',
    'name',
    'commodityName',
    'gradeName',
    'action',
  ];
  dataSource!: MatTableDataSource<any>;
  @ViewChild('autoCommodity') autoCommodity!: MatAutocompleteTrigger;
@ViewChild('autoGrade') autoGrade!: MatAutocompleteTrigger;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  
  // selectedGrade: any;
  constructor(private formBuilder : FormBuilder,private dialog: MatDialog, private api: ApiService,private global:GlobalService) {
    this.commodityCtrl = new FormControl();
    this.filteredCommodities = this.commodityCtrl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filterCommodities(value))
    );

    this.gradeCtrl = new FormControl();
    this.filteredGrades = this.gradeCtrl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filterGrades(value))
    );

    global.getPermissionUserRoles(7,'stores', 'الفصيلة', '')
  }
  ngOnInit(): void {
    this.getAllPlatoons();
    this.api.getAllCommodities().subscribe((commodities) => {
      this.commodities = commodities;
    });

    this.api.getAllGrades().subscribe((grades) => {
      this.grades = grades;
    });
  }
  openDialog() {
    this.dialog
      .open(STRPlatoonDialogComponent, {
        width: '30%',
      })
      .afterClosed()
      .subscribe((val) => {
        if (val === 'save') {
          this.getAllPlatoons();
        }
      });
  }

  displayCommodityName(commodity: any): string {
    return commodity && commodity.name ? commodity.name : '';
  }

  displayGradeName(grade: any): string {
    return grade && grade.name ? grade.name : '';
  }

  commoditySelected(event: MatAutocompleteSelectedEvent): void {
    const commodity = event.option.value as Commodity;
    this.selectedCommodity = commodity;
    this.platoonForm.patchValue({ commodityId: commodity.id });
    this.platoonForm.patchValue({ commodityName: commodity.name });
    console.log("commodityname:",commodity.name )
  }

  gradeSelected(event: MatAutocompleteSelectedEvent): void {
    const grade = event.option.value as Grade;
    this.selectedGrade = grade;
    this.platoonForm.patchValue({ gradeId: grade.id });
    this.platoonForm.patchValue({ gradeName: grade.name });
  }

  private _filterCommodities(value: string): Commodity[] {
    const filterValue = value.toLowerCase();
    return this.commodities.filter(
      (commodity) =>
        commodity.name.toLowerCase().includes(filterValue) ||
        commodity.code.toLowerCase().includes(filterValue)
    );
  }

  private _filterGrades(value: string): Grade[] {
    const filterValue = value.toLowerCase();
    return this.grades.filter(
      (grade) =>
        (grade.name.toLowerCase().includes(filterValue) ||
          grade.code.toLowerCase().includes(filterValue))
    );
  }

  openAutoCommodity() {
    this.commodityCtrl.setValue(''); // Clear the input field value
  
    // Open the autocomplete dropdown by triggering the value change event
    this.commodityCtrl.updateValueAndValidity();
  }
  openAutoGrade() {
    this.gradeCtrl.setValue(''); // Clear the input field value
  
    // Open the autocomplete dropdown by triggering the value change event
    this.gradeCtrl.updateValueAndValidity();
  }

  getAllPlatoons() {
    this.api.getPlatoon().subscribe({
      next: (res) => {
        console.log('res table: ', res);

        this.dataSource = new MatTableDataSource(res);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: (err) => {
        alert('error while fetching the records!!');
      },
    });
  }
  editPlatoon(row: any) {
    console.log('data : ', row);
    this.dialog
      .open(STRPlatoonDialogComponent, {
        width: '30%',
        data: row,
      })
      .afterClosed()
      .subscribe((val) => {
        if (val === 'update') {
          this.getAllPlatoons();
        }
      });
  }
  daletePlatoon(id: number) {
    var result = confirm('هل ترغب بتاكيد الحذف ؟ ');
    if (result) {
      this.api.deletePlatoon(id)
  .subscribe({
        next: (res) => {
          if(res == 'Succeeded'){
            console.log("res of deletestore:",res)
          alert('تم الحذف بنجاح');
          this.getAllPlatoons();

  
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
  


  clearFields() {  
    
    this.platoonForm.get('platoonName')?.reset();
    // this.platoonForm.get('commodityN')?.reset();
    
    this.platoonForm.get('gradeN')?.reset();
    this.getAllPlatoons();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
