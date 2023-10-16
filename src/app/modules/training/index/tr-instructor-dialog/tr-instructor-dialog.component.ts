import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validator, Validators, FormControl } from '@angular/forms';
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
  constructor(public id: number, public name: string) {}
}
export class TrainingCenter {
  constructor(public id: number, public name: string) {}
}


@Component({
  selector: 'app-tr-instructor-dialog',
  templateUrl: './tr-instructor-dialog.component.html',
  styleUrls: ['./tr-instructor-dialog.component.css']
})
export class TrInstructorDialogComponent {
  transactionUserId=localStorage.getItem('transactionUserId')

  formcontrol = new FormControl('');
  TrInstructorForm !: FormGroup;
  actionBtn: string = "حفظ";
  getTrInstructorData: any;

  employeeCtrl: FormControl;
  filteredEmployee: Observable<Employee[]>;
  employees: Employee[] = [];
  selectedEmployee: Employee | undefined;

  trainingCenterCtrl: FormControl;
  filteredTrainingCenter: Observable<TrainingCenter[]>;
  trainingCenters: TrainingCenter[] = [];
  selectedTrainingCenter: TrainingCenter | undefined;


  constructor(private formBuilder: FormBuilder,
    private api: ApiService,
    private hotkeysService: HotkeysService,
    private readonly route: ActivatedRoute,
    private toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public editData: any,
    private dialogRef: MatDialogRef<TrInstructorDialogComponent>) {
      this.employeeCtrl = new FormControl();
      this.filteredEmployee = this.employeeCtrl.valueChanges.pipe(
        startWith(''),
        map(value => this._filterEmployee(value))
      );

      this.trainingCenterCtrl = new FormControl();
      this.filteredTrainingCenter = this.trainingCenterCtrl.valueChanges.pipe(
        startWith(''),
        map(value => this._filterTrainingCenter(value))
      );
   
  }
  ngOnInit(): void {  
    this.TrInstructorForm = this.formBuilder.group({
      transactionUserId: ['', Validators.required],
      date: ['', Validators.required],
      employeeId: ['', Validators.required],
      trainingCenterId: ['', Validators.required],
     
      // id: ['', Validators.required],
    });

    this.api.getHrEmployees().subscribe((employee)=>{
      this.employees = employee;
    });
    this.api.getTrainingCenter().subscribe((trainingCenter)=>{
      this.trainingCenters = trainingCenter;
    });
  

    this.hotkeysService.add(new Hotkey('ctrl+s', (event: KeyboardEvent): boolean => {
      // Call the deleteGrade() function in the current component
      this.addTrInstructor();
      return false; // Prevent the default browser behavior
    }));
    if (this.editData) {
      console.log("edit data: ", this.editData)
      this.actionBtn = "تعديل";
      this.getTrInstructorData = this.editData;
      this.TrInstructorForm.controls['transactionUserId'].setValue(this.transactionUserId);
      this.TrInstructorForm.controls['employeeId'].setValue(this.editData.employeeId);
      this.TrInstructorForm.controls['trainingCenterId'].setValue(this.editData.trainingCenterId);
      // this.unitsForm.controls['id'].setValue(this.editData.id);
      this.TrInstructorForm.addControl('id', new FormControl('', Validators.required));
      this.TrInstructorForm.controls['id'].setValue(this.editData.id);
    }
  }

  addTrInstructor() {
    this.TrInstructorForm.controls['transactionUserId'].setValue(this.editData.transactionUserId);


    if (!this.editData) {
      this.TrInstructorForm.removeControl('id')
      if (this.TrInstructorForm.valid) {
        this.api.postTrInstructor(this.TrInstructorForm.value)
          .subscribe({
            next: (res) => {
              // alert("تمت الاضافة بنجاح");
              this.toastrSuccess();
              this.TrInstructorForm.reset();
              this.dialogRef.close('save');
            },
            error: (err) => {
              alert("خطأ عند اضافة البيانات")
              console.log(err)
            }
          })
      }
    } else {
      this.updateTrInstructor()
    }
  }
  updateTrInstructor() {
    this.api.putTrInstructor(this.TrInstructorForm.value)
      .subscribe({
        next: (res) => {
          // alert("تم التحديث بنجاح");
          this.toastrEditSuccess();
          this.TrInstructorForm.reset();
          this.dialogRef.close('update');
        },
        error: () => {
          alert("خطأ عند تحديث البيانات");
        }
      })
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
    const filterValue = value.toLowerCase();
    return this.employees.filter(employee =>
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
    this.TrInstructorForm.patchValue({ trainingCenterName: trainingCenter.name });
  }

  private _filterTrainingCenter(value: string): TrainingCenter[] {
    const filterValue = value.toLowerCase();
    return this.trainingCenters.filter(trainingCenter =>
      trainingCenter.name.toLowerCase().includes(filterValue) 
    );
  }

  openAutoTrainingCenter() {
    this.trainingCenterCtrl.setValue(''); // Clear the input field value
  
    // Open the autocomplete dropdown by triggering the value change event
    this.trainingCenterCtrl.updateValueAndValidity();
  }


  toastrSuccess(): void {
    this.toastr.success('تم الحفظ بنجاح');
  }

  toastrEditSuccess(): void {
    this.toastr.success('تم التعديل بنجاح');
  }
}
