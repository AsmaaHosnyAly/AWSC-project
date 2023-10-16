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
export class Position {
  constructor(public id: number, public name: string) {}
}
export class WorkPlace {
  constructor(public id: number, public name: string) {}
}
@Component({
  selector: 'app-hr-employee-position-dialog',
  templateUrl: './hr-employee-position-dialog.component.html',
  styleUrls: ['./hr-employee-position-dialog.component.css']
})
export class HrEmployeePositionDialogComponent implements OnInit {
  transactionUserId=localStorage.getItem('transactionUserId')

  formcontrol = new FormControl('');
  HrEmployeePosition !: FormGroup;
  actionBtn: string = "حفظ";
  getEmployeeData: any;

  employeeCtrl: FormControl;
  filteredEmployee: Observable<Employee[]>;
  employees: Employee[] = [];
  selectedEmployee: Employee | undefined;

  positionCtrl: FormControl;
  filteredPosition: Observable<Position[]>;
  positions: Position[] = [];
  selectedPosition: Position | undefined;

  workPlaceCtrl: FormControl;
  filteredWorkPlace: Observable<WorkPlace[]>;
  workPlaces: WorkPlace[] = [];
  selectedWorkPlace: WorkPlace | undefined;

  constructor(private formBuilder: FormBuilder,
    private api: ApiService,
    private hotkeysService: HotkeysService,
    private readonly route: ActivatedRoute,
    private toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public editData: any,
    private dialogRef: MatDialogRef<HrEmployeePositionDialogComponent>) {
      this.employeeCtrl = new FormControl();
      this.filteredEmployee = this.employeeCtrl.valueChanges.pipe(
        startWith(''),
        map(value => this._filterEmployee(value))
      );

      this.positionCtrl = new FormControl();
      this.filteredPosition = this.positionCtrl.valueChanges.pipe(
        startWith(''),
        map(value => this._filterPosition(value))
      );
      this.workPlaceCtrl = new FormControl();
      this.filteredWorkPlace = this.workPlaceCtrl.valueChanges.pipe(
        startWith(''),
        map(value => this._filterWorkPlace(value))
      );
  }
  ngOnInit(): void {  
    this.HrEmployeePosition = this.formBuilder.group({
      transactionUserId: ['', Validators.required],
      date: ['', Validators.required],
      employeeId: ['', Validators.required],
      positionId: ['', Validators.required],
      workPlaceId: ['', Validators.required],
      // id: ['', Validators.required],
    });

    this.api.getEmployees().subscribe((employee)=>{
      this.employees = employee;
    });
    this.api.getHrPosition().subscribe((position)=>{
      this.positions = position;
    });
    this.api.getHrWorkPlace().subscribe((workPlace)=>{
      this.workPlaces = workPlace;
    });

    this.hotkeysService.add(new Hotkey('ctrl+s', (event: KeyboardEvent): boolean => {
      // Call the deleteGrade() function in the current component
      this.addHrEmployeePosition();
      return false; // Prevent the default browser behavior
    }));
    if (this.editData) {
      console.log("edit data: ", this.editData)
      this.actionBtn = "تعديل";
      this.getEmployeeData = this.editData;
      this.HrEmployeePosition.controls['transactionUserId'].setValue(this.transactionUserId);
      this.HrEmployeePosition.controls['date'].setValue(this.editData.date);
      this.HrEmployeePosition.controls['employeeId'].setValue(this.editData.employeeId);
      this.HrEmployeePosition.controls['positionId'].setValue(this.editData.positionId);
      this.HrEmployeePosition.controls['workPlaceId'].setValue(this.editData.workPlaceId);
      // this.unitsForm.controls['id'].setValue(this.editData.id);
      this.HrEmployeePosition.addControl('id', new FormControl('', Validators.required));
      this.HrEmployeePosition.controls['id'].setValue(this.editData.id);
    }
  }

  addHrEmployeePosition() {
    this.HrEmployeePosition.controls['transactionUserId'].setValue(this.transactionUserId);


    if (!this.editData) {
      this.HrEmployeePosition.removeControl('id')
      if (this.HrEmployeePosition.valid) {
        this.api.postHrEmployeePosition(this.HrEmployeePosition.value)
          .subscribe({
            next: (res) => {
              // alert("تمت الاضافة بنجاح");
              this.toastrSuccess();
              this.HrEmployeePosition.reset();
              this.dialogRef.close('save');
            },
            error: (err) => {
              alert("خطأ عند اضافة البيانات")
              console.log(err)
            }
          })
      }
    } else {
      this.updateHrEmployeePosition()
    }
  }
  updateHrEmployeePosition() {
    this.api.putHrEmployeePosition(this.HrEmployeePosition.value)
      .subscribe({
        next: (res) => {
          // alert("تم التحديث بنجاح");
          this.toastrEditSuccess();
          this.HrEmployeePosition.reset();
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
    this.HrEmployeePosition.patchValue({ employeeId: employee.id });
    this.HrEmployeePosition.patchValue({ employeeName: employee.name });
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

    
  displayPositionName(position: any): string {
    return position && position.name ? position.name : '';
  }

  positionSelected(event: MatAutocompleteSelectedEvent): void {
    const position = event.option.value as Position;
    this.selectedPosition = position;
    this.HrEmployeePosition.patchValue({ positionId: position.id });
    this.HrEmployeePosition.patchValue({ positionName: position.name });
  }

  private _filterPosition(value: string): Position[] {
    const filterValue = value.toLowerCase();
    return this.positions.filter(position =>
      position.name.toLowerCase().includes(filterValue) 
    );
  }

  openAutoPosition() {
    this.positionCtrl.setValue(''); // Clear the input field value
  
    // Open the autocomplete dropdown by triggering the value change event
    this.positionCtrl.updateValueAndValidity();
  }


  displayWorkPlaceName(workPlace: any): string {
    return workPlace && workPlace.name ? workPlace.name : '';
  }

  workPlaceSelected(event: MatAutocompleteSelectedEvent): void {
    const workPlace = event.option.value as WorkPlace;
    this.selectedWorkPlace = workPlace;
    this.HrEmployeePosition.patchValue({ workPlaceId: workPlace.id });
    this.HrEmployeePosition.patchValue({ workPlaceName: workPlace.name });
  }

  private _filterWorkPlace(value: string): WorkPlace[] {
    const filterValue = value.toLowerCase();
    return this.workPlaces.filter(workPlace =>
      workPlace.name.toLowerCase().includes(filterValue) 
    );
  }

  openAutoWorkPlace() {
    this.workPlaceCtrl.setValue(''); // Clear the input field value
  
    // Open the autocomplete dropdown by triggering the value change event
    this.workPlaceCtrl.updateValueAndValidity();
  }

  toastrSuccess(): void {
    this.toastr.success('تم الحفظ بنجاح');
  }

  toastrEditSuccess(): void {
    this.toastr.success('تم التعديل بنجاح');
  }
}
