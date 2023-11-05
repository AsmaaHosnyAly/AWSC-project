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
import { ToastrService } from 'ngx-toastr';
import { map, startWith } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatAccordion, MatExpansionModule } from '@angular/material/expansion';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatOptionSelectionChange } from '@angular/material/core';
import { HotkeysService } from 'angular2-hotkeys';
import { Hotkey } from 'angular2-hotkeys';
export class course {
  constructor(public id: number, public name: string) {}
}
export class TrainingCenter {
  constructor(public id: number, public name: string) {}
}

@Component({
  selector: 'app-tr-budget-dialog',
  templateUrl: './tr-budget-dialog.component.html',
  styleUrls: ['./tr-budget-dialog.component.css'],
})
export class TrBudgetDialogComponent {
  transactionUserId = localStorage.getItem('transactionUserId');
  courseCtrl: FormControl;
  filteredCourseStates: Observable<course[]>;
  course: course[] = [];
  selectedCourse: course | undefined;
  trainingCenterCtrl: FormControl;
  filteredTrainingCenteres: Observable<TrainingCenter[]>;
  trainingCenteres: TrainingCenter[] = [];
  selectedTrainingCenter: TrainingCenter | undefined;
  formcontrol = new FormControl('');
  modelForm!: FormGroup;
  actionBtn: string = 'حفظ';
  selectedOption: any;
  getModelData: any;
  Id: string | undefined | null;
  vendorDt: any = {
    id: 0,
  };
  commname: any;
  dataSource!: MatTableDataSource<any>;
  existingNames: string[] = [];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatAccordion)
  accordion!: MatAccordion;
  cityStatelist: any;
  cityStateName: any;
  trainingCenterList: any;
  trainingCenterName: any;
  constructor(
    private formBuilder: FormBuilder,
    private api: ApiService,
    private hotkeysService: HotkeysService,
    private readonly route: ActivatedRoute,
    @Inject(MAT_DIALOG_DATA) public editData: any,
    private dialogRef: MatDialogRef<TrBudgetDialogComponent>,
    private toastr: ToastrService
  ) {
    this.courseCtrl = new FormControl();
    this.filteredCourseStates = this.courseCtrl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filterCourse(value))
    );
    this.trainingCenterCtrl = new FormControl();
    this.filteredTrainingCenteres = this.trainingCenterCtrl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filterTrainingCenteres(value))
    );
  }
  ngOnInit(): void {
    this.getExistingNames(); // Fetch existing names
    this.modelForm = this.formBuilder.group({
      //define the components of the form

      noTrainee: ['', Validators.required],
      noHour: ['', Validators.required],
      instructorHourFee: ['', Validators.required],
      instructorTotalFee: ['', Validators.required],
      superVisingFee: ['', Validators.required],
      otherFee: ['', Validators.required],
      salaryTotal: ['', Validators.required],
      suppliesCost: ['', Validators.required],
      transportCost: [''],
      serviceTotal: ['', Validators.required],
      courseTotal: ['', Validators.required],
      courseId: ['', Validators.required],
      courseName: [''],
      id: ['', Validators.required],
      transactionUserId: ['', Validators.required],
      // matautocompleteFieldName : [''],
    });

    this.api.getAllCourse().subscribe((course) => {
      this.course = course;
    });
    this.api.getAllTrainingCenter().subscribe((trainingCenteres) => {
      this.trainingCenteres = trainingCenteres;
    });
    this.hotkeysService.add(
      new Hotkey('ctrl+s', (event: KeyboardEvent): boolean => {
        // Call the deleteGrade() function in the current component
        this.addTrBudget();
        return false; // Prevent the default browser behavior
      })
    );

    if (this.editData) {
      this.actionBtn = 'تعديل';
      console.log('');
      this.getModelData = this.editData;
      this.modelForm.controls['transactionUserId'].setValue(
        this.editData.transactionUserId
      );

      this.modelForm.controls['noTrainee'].setValue(this.editData.noTrainee);
      this.modelForm.controls['noHour'].setValue(this.editData.noHour);
      this.modelForm.controls['instructorHourFee'].setValue(
        this.editData.instructorHourFee
      );
      this.modelForm.controls['instructorTotalFee'].setValue(
        this.editData.instructorTotalFee
      );
      this.modelForm.controls['superVisingFee'].setValue(
        this.editData.superVisingFee
      );
      this.modelForm.controls['otherFee'].setValue(this.editData.otherFee);
      this.modelForm.controls['salaryTotal'].setValue(
        this.editData.salaryTotal
      );
      this.modelForm.controls['suppliesCost'].setValue(
        this.editData.suppliesCost
      );
      this.modelForm.controls['transportCost'].setValue(
        this.editData.transportCost
      );
      this.modelForm.controls['serviceTotal'].setValue(
        this.editData.serviceTotal
      );
      this.modelForm.controls['courseTotal'].setValue(
        this.editData.courseTotal
      );
      this.modelForm.controls['courseId'].setValue(this.editData.courseId);
      this.modelForm.controls['courseName'].setValue(this.editData.courseName);
      // console.log("commodityId: ", this.modelForm.controls['commodityId'].value)
      this.modelForm.addControl('id', new FormControl('', Validators.required));
      this.modelForm.controls['id'].setValue(this.editData.id);
    }
  }

  displayCourseName(course: any): string {
    return course && course.name ? course.name : '';
  }

  courseSelected(event: MatAutocompleteSelectedEvent): void {
    const course = event.option.value as course;
    this.selectedCourse = course;
    this.modelForm.patchValue({ courseId: course.id });
    this.modelForm.patchValue({ courseName: course.name });
  }

  private _filterCourse(value: string): course[] {
    const filterValue = value.toLowerCase();
    return this.course.filter((course) =>
      course.name.toLowerCase().includes(filterValue)
    );
  }

  openAutoCourse() {
    this.courseCtrl.setValue(''); // Clear the input field value

    // Open the autocomplete dropdown by triggering the value change event
    this.courseCtrl.updateValueAndValidity();
  }

  displayTrainingCenterName(trainingCenter: any): string {
    return trainingCenter && trainingCenter.name ? trainingCenter.name : '';
  }
  trainingCenterSelected(event: MatAutocompleteSelectedEvent): void {
    const trainingCenter = event.option.value as TrainingCenter;
    this.selectedTrainingCenter = trainingCenter;
    this.modelForm.patchValue({ trainingCenterId: trainingCenter.id });
    this.modelForm.patchValue({ trainingCenterName: trainingCenter.name });
  }

  private _filterTrainingCenteres(value: string): TrainingCenter[] {
    const filterValue = value.toLowerCase();
    return this.trainingCenteres.filter((trainingCenter) =>
      trainingCenter.name.toLowerCase().includes(filterValue)
    );
  }

  openAutoTrainingCenter() {
    this.trainingCenterCtrl.setValue(''); // Clear the input field value

    // Open the autocomplete dropdown by triggering the value change event
    this.trainingCenterCtrl.updateValueAndValidity();
  }
  getExistingNames() {
    this.api.getClassRoom().subscribe({
      next: (res) => {
        this.existingNames = res.map((item: any) => item.name);
      },
      error: (err) => {
        console.log('Error fetching existing names:', err);
      },
    });
  }

  addTrBudget() {
    if (!this.editData) {
      const enteredName = this.modelForm.get('name')?.value;

      if (this.existingNames.includes(enteredName)) {
        alert('هذا الاسم موجود من قبل، قم بتغييره');
        return;
      }
      this.modelForm.removeControl('id');
      // this.modelForm.controls['commodityId'].setValue(this.selectedOption.id);
      this.modelForm.controls['transactionUserId'].setValue(
        this.transactionUserId
      );
      console.log('add: ', this.modelForm.value);
      if (this.modelForm.valid) {
        this.api.postTrBudget(this.modelForm.value).subscribe({
          next: (res) => {
            this.toastrSuccess();
            this.modelForm.reset();
            this.dialogRef.close('save');
          },
          error: (err) => {
            this.toastrErrorSave();
          },
        });
      }
    } else {
      this.updateTrBudget();
    }
  }

  displayVendor(option: any): string {
    return option && option.name ? option.name : '';
  }
  updateTrBudget() {
    this.api.putTrBudget(this.modelForm.value).subscribe({
      next: (res) => {
        this.toastrEdit();
        this.modelForm.reset();
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
