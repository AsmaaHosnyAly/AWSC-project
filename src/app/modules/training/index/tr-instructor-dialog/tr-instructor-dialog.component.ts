import { Component, OnInit, Inject } from '@angular/core';
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
import { ToastrService } from 'ngx-toastr';
import { HotkeysService } from 'angular2-hotkeys';
import { Hotkey } from 'angular2-hotkeys';
export class Employee {
  constructor(public id: number, public name: string) { }
}
export class TrainingCenter {
  constructor(public id: number, public name: string) { }
}

export class City {
  constructor(public id: number, public name: string) { }
}

@Component({
  selector: 'app-tr-instructor-dialog',
  templateUrl: './tr-instructor-dialog.component.html',
  styleUrls: ['./tr-instructor-dialog.component.css'],
})
export class TrInstructorDialogComponent {
  transactionUserId = localStorage.getItem('transactionUserId');

  formcontrol = new FormControl('');
  TrInstructorForm!: FormGroup;
  TrExternalInstructorForm!: FormGroup;
  actionBtn: string = 'حفظ';
  getTrInstructorData: any;
  getTrExternalInstructorForm: any;
  instructorType = 'موظف';
  employeeCtrl: FormControl;
  filteredEmployee: Observable<Employee[]>;
  employees: Employee[] = [];
  selectedEmployee: Employee | undefined;

  trainingCenterCtrl: FormControl;
  filteredTrainingCenter: Observable<TrainingCenter[]>;
  trainingCenters: TrainingCenter[] = [];
  selectedTrainingCenter: TrainingCenter | undefined;

  cityCtrl: FormControl;
  filteredCities: Observable<City[]>;
  cities: City[] = [];
  selectedCity: City | undefined;

  constructor(
    private formBuilder: FormBuilder,
    private api: ApiService,
    private hotkeysService: HotkeysService,
    private readonly route: ActivatedRoute,
    private toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public editData: any,
    private dialogRef: MatDialogRef<TrInstructorDialogComponent>
  ) {
    this.employeeCtrl = new FormControl();
    this.filteredEmployee = this.employeeCtrl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filterEmployee(value))
    );

    this.trainingCenterCtrl = new FormControl();
    this.filteredTrainingCenter = this.trainingCenterCtrl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filterTrainingCenter(value))
    );

    this.cityCtrl = new FormControl();
    this.filteredCities = this.cityCtrl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filterCities(value))
    );
  }
  ngOnInit(): void {
    this.TrInstructorForm = this.formBuilder.group({
      transactionUserId: ['', Validators.required],
      employeeId: [''],
      trainingCenterId: [''],
      state: ['', Validators.required]

      // id: ['', Validators.required],
    });

    this.TrExternalInstructorForm = this.formBuilder.group({
      transactionUserId: ['', Validators.required],
      name: ['', Validators.required],
      code: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', Validators.required],
      position: ['', Validators.required],
      address: ['', Validators.required],
      gender: ['', Validators.required],
      instructorId: ['', Validators.required],
      cityId: ['', Validators.required],
      // id: ['', Validators.required],
    });

    this.api.getHrEmployees().subscribe((employee) => {
      this.employees = employee;
    });
    this.api.getTrainingCenter().subscribe((trainingCenter) => {
      this.trainingCenters = trainingCenter;
    });

    this.api.getAllCities().subscribe((cities) => {
      this.cities = cities;
    });

    this.hotkeysService.add(
      new Hotkey('ctrl+s', (event: KeyboardEvent): boolean => {
        // Call the deleteGrade() function in the current component
        this.addTrInstructor();
        return false; // Prevent the default browser behavior
      })
    );
    if (this.editData) {
      console.log('edit data: ', this.editData);
      this.actionBtn = 'تعديل';
      this.getTrInstructorData = this.editData;
      this.TrInstructorForm.controls['transactionUserId'].setValue(
        this.transactionUserId
      );
      this.TrInstructorForm.controls['employeeId'].setValue(
        this.editData.employeeId
      );
      this.TrInstructorForm.controls['trainingCenterId'].setValue(
        this.editData.trainingCenterId
      );
      // this.unitsForm.controls['id'].setValue(this.editData.id);
      this.TrInstructorForm.addControl(
        'id',
        new FormControl('', Validators.required)
      );
      this.TrInstructorForm.controls['id'].setValue(this.editData.id);
    }
  }

  displayEmployeeName(employee: any): string {
    return employee && employee.name ? employee.name : '';
  }

  employeeSelected(event: MatAutocompleteSelectedEvent): void {
    const employee = event.option.value as Employee;
    this.selectedEmployee = employee;
    this.TrInstructorForm.patchValue({ employeeId: employee.id });
    this.TrInstructorForm.patchValue({ employeeName: employee.name });
  }

  private _filterEmployee(value: string): Employee[] {
    const filterValue = value;
    return this.employees.filter((employee) =>
      employee.name.toLowerCase().includes(filterValue)
    );
  }

  openAutoemployee() {
    this.employeeCtrl.setValue(''); // Clear the input field value

    // Open the autocomplete dropdown by triggering the value change event
    this.employeeCtrl.updateValueAndValidity();
  }

  displayTrainingCenterName(trainingCenter: any): string {
    return trainingCenter && trainingCenter.name ? trainingCenter.name : '';
  }

  trainingCenterSelected(event: MatAutocompleteSelectedEvent): void {
    const trainingCenter = event.option.value as TrainingCenter;
    this.selectedTrainingCenter = trainingCenter;
    this.TrInstructorForm.patchValue({ trainingCenterId: trainingCenter.id });
    this.TrInstructorForm.patchValue({
      trainingCenterName: trainingCenter.name,
    });
  }

  private _filterTrainingCenter(value: string): TrainingCenter[] {
    const filterValue = value;
    return this.trainingCenters.filter((trainingCenter) =>
      trainingCenter.name.toLowerCase().includes(filterValue)
    );
  }

  openAutoTrainingCenter() {
    this.trainingCenterCtrl.setValue(''); // Clear the input field value

    // Open the autocomplete dropdown by triggering the value change event
    this.trainingCenterCtrl.updateValueAndValidity();
  }

  displayCityName(city: any): string {
    return city && city.name ? city.name : '';
  }

  citySelected(event: MatAutocompleteSelectedEvent): void {
    const city = event.option.value as City;
    this.selectedCity = city;
    this.TrExternalInstructorForm.patchValue({ cityId: city.id });
    this.TrExternalInstructorForm.patchValue({ cityName: city.name });
  }

  private _filterCities(value: string): City[] {
    const filterValue = value;
    return this.cities.filter((city) =>
      city.name.toLowerCase().includes(filterValue)
    );
  }

  openAutoCity() {
    this.cityCtrl.setValue('');
    this.cityCtrl.updateValueAndValidity();
  }

  setInstructor(state: any) {
    this.instructorType = state.value;
    console.log('state value changed: ', state.value);
    // this.TrInstructorForm.controls['state'].setValue(state.value);

    if (state.value == 'موظف') {
      this.openAutoemployee();
      this.employeeCtrl.enable();
      // this.TrInstructorForm.controls['employeeId'].enable();
      console.log('test employee arr: ', this.employeeCtrl);
      // alert("disable"+ this.instructorType);
    }
    if (state.value == 'خارجي') {
      // this.TrInstructorForm.controls['percentage'].setValue(100);
      // this.TrInstructorForm.controls['employeeId'].disable();
      this.employeeCtrl.disable();
      this.TrInstructorForm.controls['employeeId'].enable();
      this.TrInstructorForm.controls['employeeId'].setValue(null);
      // alert("enable"+ this.instructorType);
    }
  }

  async addTrInstructor() {
    this.TrInstructorForm.controls['transactionUserId'].setValue(
      this.transactionUserId
    );
    this.TrExternalInstructorForm.controls['transactionUserId'].setValue(
      this.transactionUserId
    );

    // console.log('this.TrInstructorForm.value :', this.TrInstructorForm.value);


    if (!this.editData) {

      this.TrInstructorForm.removeControl('id');
      if (this.TrInstructorForm.valid && this.TrInstructorForm.getRawValue().state != 'خارجي') {
        await this.api.postTrInstructor(this.TrInstructorForm.value).subscribe({
          next: (res) => {
            this.TrExternalInstructorForm.controls['instructorId'].setValue(res);
            console.log("InstructorId: ", this.TrExternalInstructorForm.getRawValue().instructorId);

            this.toastrSuccess();
            this.TrInstructorForm.reset();
            this.dialogRef.close('save');
          },
          error: (err) => {
            alert('خطأ عند اضافة البيانات');
            console.log(err);
          },
        });
      }
      else if (this.TrInstructorForm.valid && this.TrInstructorForm.getRawValue().state == 'خارجي') {
        if (this.TrInstructorForm.valid) {
          await this.api.postTrInstructor(this.TrInstructorForm.value).subscribe({
            next: (res) => {
              this.TrExternalInstructorForm.controls['instructorId'].setValue(res);
              console.log("InstructorId: ", this.TrExternalInstructorForm.getRawValue().instructorId);

              if (this.TrExternalInstructorForm.valid) {
                this.addTrExternalInstructor();                
                this.toastrSuccess();
                this.TrInstructorForm.reset();
                this.dialogRef.close('save');
              }
              else {
                this.toastrWarning();

              }

            },
            error: (err) => {
              alert('1خطأ عند اضافة البيانات');
              console.log(err);
            },
          });
        }
        else {
          this.toastrWarning();

        }
      }
      else {
        this.toastrWarning();

      }
    } else {
      this.updateTrInstructor();
    }
  }

  addTrExternalInstructor() {
    // alert(" resId external fun: " + this.TrExternalInstructorForm.getRawValue().instructorId);

    this.TrExternalInstructorForm.controls['transactionUserId'].setValue(
      this.transactionUserId
    );
    console.log("datttaaa", this.TrExternalInstructorForm.value);

    if (this.TrExternalInstructorForm.valid) {
      this.api.postExternalInstructor(this.TrExternalInstructorForm.value).subscribe({
        next: (res) => {
          this.toastrSuccess();
          this.TrExternalInstructorForm.reset();
          this.dialogRef.close('save');
        },
        error: (err) => {
          alert('2خطأ عند اضافة البيانات');
          console.log(err);
        },
      });
    }
  }
  updateTrInstructor() {
    this.api.putTrInstructor(this.TrInstructorForm.value).subscribe({
      next: (res) => {
        // alert("تم التحديث بنجاح");
        this.toastrEditSuccess();
        this.TrInstructorForm.reset();
        this.dialogRef.close('update');
      },
      error: () => {
        alert('3خطأ عند تحديث البيانات');
      },
    });
  }

  toastrSuccess(): void {
    this.toastr.success('تم الحفظ بنجاح');
  }
  toastrWarning(): void {
    this.toastr.warning('برجاء اكمال البيانات !');
  }

  toastrEditSuccess(): void {
    this.toastr.success('تم التعديل بنجاح');
  }
}