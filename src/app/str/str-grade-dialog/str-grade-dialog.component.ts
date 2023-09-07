import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validator,
  Validators,
  FormControl,
} from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatAccordion, MatExpansionModule } from '@angular/material/expansion';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatOptionSelectionChange } from '@angular/material/core';
// import { publishFacade } from '@angular/compiler';
// import { STRGradeComponent } from '../str-grade/str-grade.component';

export class Commodity {
  constructor(public id: number, public name: string, public code: string) {}
}

@Component({
  selector: 'app-str-grade-dialog',
  templateUrl: './str-grade-dialog.component.html',
  styleUrls: ['./str-grade-dialog.component.css'],
})
export class STRGradeDialogComponent {
  transactionUserId = localStorage.getItem('transactionUserId');
  commodityCtrl: FormControl;
  filteredCommodities: Observable<Commodity[]>;
  commodities: Commodity[] = [];
  getGradeData: any;
  selectedCommodity: Commodity | undefined;
  formcontrol = new FormControl('');
  gradeForm!: FormGroup;
  actionBtn: string = 'حفظ';
  selectedOption: any;
  Code: any;
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatAccordion)
  accordion!: MatAccordion;
  commoditylist: any;
  storeList: any;
  commodityName: any;
  constructor(
    private formBuilder: FormBuilder,
    private api: ApiService,
    private readonly route: ActivatedRoute,
    @Inject(MAT_DIALOG_DATA) public editData: any,
    private dialogRef: MatDialogRef<STRGradeDialogComponent>
  ) {
    this.commodityCtrl = new FormControl();
    this.filteredCommodities = this.commodityCtrl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filterCommodities(value))
    );
  }
  ngOnInit(): void {
    this.gradeForm = this.formBuilder.group({
      //define the components of the form
      transactionUserId: ['', Validators.required],
      code: [''],
      name: ['', Validators.required],
      commodityId: ['', Validators.required],
      id: ['', Validators.required],
      // matautocompleteFieldName : [''],
    });

    this.api.getAllCommodities().subscribe((commodities) => {
      this.commodities = commodities;
    });

    if (this.editData) {
      this.actionBtn = 'تعديل';
      this.getGradeData = this.editData;
      this.gradeForm.controls['transactionUserId'].setValue(
        this.editData.transactionUserId
      );
      this.gradeForm.controls['code'].setValue(this.editData.code);
      this.gradeForm.controls['name'].setValue(this.editData.name);

      this.gradeForm.controls['commodityId'].setValue(
        this.editData.commodityId
      );
      // console.log("commodityId: ", this.gradeForm.controls['commodityId'].value)
      this.gradeForm.addControl('id', new FormControl('', Validators.required));
      this.gradeForm.controls['id'].setValue(this.editData.id);
    }
  }

  displayCommodityName(commodity: any): string {
    return commodity && commodity.name ? commodity.name : '';
  }

  commoditySelected(event: MatAutocompleteSelectedEvent): void {
    const commodity = event.option.value as Commodity;
    this.selectedCommodity = commodity;
    this.gradeForm.patchValue({ commodityId: commodity.id });
    this.gradeForm.patchValue({ commodityName: commodity.name });
    this.getCodeByCommodityId();
  }

  private _filterCommodities(value: string): Commodity[] {
    const filterValue = value.toLowerCase();
    return this.commodities.filter(
      (commodity) =>
        commodity.name.toLowerCase().includes(filterValue) ||
        commodity.code.toLowerCase().includes(filterValue)
    );
  }

  openAutoCommodity() {
    this.commodityCtrl.setValue(''); // Clear the input field value

    // Open the autocomplete dropdown by triggering the value change event
    this.commodityCtrl.updateValueAndValidity();
  }

  getCodeByCommodityId() {
    this.api.getGroupCode(this.selectedCommodity?.id).subscribe({
      next: (res) => {
        this.Code = res;
        console.log('GradeCode: ', this.Code);
      },
      error: (err) => {
        console.log('get code. err: ', err);
      },
    });
  }

  addGrade() {
    this.gradeForm.controls['code'].setValue(this.Code);
    if (!this.editData) {
      this.gradeForm.removeControl('id');
      // this.gradeForm.controls['commodityId'].setValue(this.selectedOption.id);
      console.log('add: ', this.gradeForm.value);
      this.gradeForm.controls['transactionUserId'].setValue(
        this.transactionUserId
      );
      if (this.gradeForm.valid) {
        this.api.postGrade(this.gradeForm.value).subscribe({
          next: (res) => {
            alert('تمت الاضافة بنجاح');
            this.gradeForm.reset();
            this.dialogRef.close('save');
          },
          error: (err) => {
            alert('خطأ عند اضافة البيانات');
          },
        });
      }
    } else {
      this.updateGrade();
    }
  }


  updateGrade() {
    this.api.putGrade(this.gradeForm.value).subscribe({
      next: (res) => {
        alert('تم التحديث بنجاح');
        this.gradeForm.reset();
        this.dialogRef.close('update');
      },
      error: () => {
        alert('خطأ عند تحديث البيانات');
      },
    });
  }
}
