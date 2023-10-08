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
import { ToastrService } from 'ngx-toastr';
import { HotkeysService } from 'angular2-hotkeys';
import { Hotkey } from 'angular2-hotkeys';
export class Commodity {
  constructor(public id: number, public name: string, public code: any) {}
}

export class Grade {
  constructor(
    public id: number,
    public name: string,
    public code: any,
    public commodityId: number
  ) {}
}

@Component({
  selector: 'app-str-platoon-dialog',
  templateUrl: './str-platoon-dialog.component.html',
  styleUrls: ['./str-platoon-dialog.component.css'],
})
export class STRPlatoonDialogComponent implements OnInit {
  transactionUserId = localStorage.getItem('transactionUserId');
  commodityCtrl: FormControl;
  filteredCommodities: Observable<Commodity[]>;
  commodities: Commodity[] = [];
  gradeCtrl: FormControl;
  filteredGrades: Observable<Grade[]>;
  grades: Grade[] = [];
  selectedCommodity: Commodity | undefined;
  selectedGrade: Grade | undefined;
  formcontrol = new FormControl('');
  platoonForm!: FormGroup;
  selectedOption: any;
  getPlatoonData: any;
  actionBtn: string = 'حفظ';
  Code: any;
  dataSource!: MatTableDataSource<any>;
  existingNames: string[] = [];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatAccordion)
  accordion!: MatAccordion;
  gradeName: any;
  constructor(
    private formBuilder: FormBuilder,
    private api: ApiService,
    private hotkeysService: HotkeysService,
    private readonly route: ActivatedRoute,
    @Inject(MAT_DIALOG_DATA) public editData: any,
    private dialogRef: MatDialogRef<STRPlatoonDialogComponent>,
    private toastr: ToastrService
  ) {
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
  }

  ngOnInit(): void {
    this.getExistingNames(); // Fetch existing names
    this.platoonForm = this.formBuilder.group({
      transactionUserId: ['', Validators.required],
      code: [''],
      name: ['', Validators.required],
      commodityId: [''],
      commodityName: [''],
      gradeId: [''],
      gradeName: [''],
      id: [''],
    });

    this.api.getAllCommodities().subscribe((commodities) => {
      this.commodities = commodities;
    });

    this.api.getAllGrades().subscribe((grades) => {
      this.grades = grades;
    });
    this.hotkeysService.add(new Hotkey('ctrl+s', (event: KeyboardEvent): boolean => {
      // Call the deleteGrade() function in the current component
      this.addPlatoon();
      return false; // Prevent the default browser behavior
    }));
    if (this.editData) {
      console.log('edit:', this.editData);

      this.actionBtn = 'تعديل';
      this.getPlatoonData = this.editData;
      this.platoonForm.controls['transactionUserId'].setValue(
        this.editData.transactionUserId
      );
      this.platoonForm.controls['code'].setValue(this.editData.code);

      this.platoonForm.controls['name'].setValue(this.editData.name);
      this.platoonForm.controls['commodityId'].setValue(
        this.editData.commodityId
      );
      this.platoonForm.controls['commodityName'].setValue(
        this.editData.commodityName
      );
      this.platoonForm.controls['gradeId'].setValue(this.editData.gradeId);
      this.platoonForm.controls['gradeName'].setValue(this.editData.gradeName);
      this.platoonForm.addControl(
        'id',
        new FormControl('', Validators.required)
      );
      this.platoonForm.controls['id'].setValue(this.editData.id);
    }
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
    this.gradeCtrl.setValue('');
  }

  gradeSelected(event: MatAutocompleteSelectedEvent): void {
    const grade = event.option.value as Grade;
    this.selectedGrade = grade;
    this.platoonForm.patchValue({ gradeId: grade.id });
    this.platoonForm.patchValue({ gradeName: grade.name });
    this.getCodeByGradeId();
  }

  private _filterCommodities(value: string): Commodity[] {
    const filterValue = value.toLowerCase();
    return this.commodities.filter(
      (commodity) =>
        commodity.name.toLowerCase().includes(filterValue) ||
        commodity.code.toString().toLowerCase().includes(filterValue)
    );
  }

  private _filterGrades(value: string): Grade[] {
    const filterValue = value.toLowerCase();
    return this.grades.filter(
      (grade) =>
        (grade.name.toLowerCase().includes(filterValue) ||
          grade.code.toString().toLowerCase().includes(filterValue)) &&
        grade.commodityId === this.selectedCommodity?.id
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

  getCodeByGradeId() {
    console.log('gradeid:', this.selectedGrade?.id);
    this.api.getPlatoonCode(this.selectedGrade?.id).subscribe({
      next: (res) => {
        if (this.editData) {
          if (this.editData.gradeId == this.selectedGrade?.id) {
            console.log(' edit data with matched choices:');

            this.platoonForm.controls['code'].setValue(this.editData.code);
          } else {
            console.log(' edit data without matched choices:');

            this.platoonForm.controls['code'].setValue(res);
          }
        } else {
          console.log('without editData:');
          this.platoonForm.controls['code'].setValue(res);
        }
      },
      error: (err) => {
        console.log('get code. err: ', err);
        // this.Code = err.error.text;
      },
    });
  }

  getExistingNames() {
    this.api.getPlatoon().subscribe({
      next: (res) => {
        this.existingNames = res.map((item: any) => item.name);
      },
      error: (err) => {
        console.log('Error fetching existing names:', err);
      }
    });
  }

  addPlatoon() {

  
    // this.platoonForm.controls['code'].setValue(this.Code);
    if (!this.editData) {
      const enteredName = this.platoonForm.get('name')?.value;

      if (this.existingNames.includes(enteredName)) {
        alert('هذا الاسم موجود من قبل، قم بتغييره');
        return;
      }
      this.platoonForm.removeControl('id');
      // this.platoonForm.controls['commodityId'].setValue(this.selectedOption.id);
      // this.platoonForm.controls['gradeId'].setValue(this.selectedOption.id);
      console.log('add: ', this.platoonForm.value);
      this.platoonForm.controls['transactionUserId'].setValue(
        this.transactionUserId
      );
      if (this.platoonForm.valid) {
        this.api.postPlatoon(this.platoonForm.value).subscribe({
          next: (res) => {
            this.toastrSuccess();
            this.platoonForm.reset();
            this.dialogRef.close('save');
          },
          error: (err) => {
            this.toastrErrorSave();
          },
        });
      }
    } else {
      this.updatePlatoon();
    }
  }

  updatePlatoon() {
    this.api.putPlatoon(this.platoonForm.value).subscribe({
      next: (res) => {
        alert('تم التحديث بنجاح');
        this.platoonForm.reset();
        this.dialogRef.close('update');
      },
      error: () => {
        this.toastrErrorEdit();
      },
    });
  }

  toastrSuccess(): void {
    this.toastr.success('تم الحفظ بنجاح');
  }

  toastrEdit(): void {
    this.toastr.success('تم التحديث بنجاح');
  }

  toastrErrorSave(): void {
    this.toastr.error('!خطأ عند حفظ البيانات');
  }

  toastrErrorEdit(): void {
    this.toastr.error('!خطأ عند تحديث البيانات');
  }
}
