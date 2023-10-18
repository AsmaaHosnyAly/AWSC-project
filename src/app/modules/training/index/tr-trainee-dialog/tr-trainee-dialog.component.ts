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
  constructor(public id: number, public name: string) { }
}
export class TrCoporteClient {
  constructor(public id: number, public name: string) { }
}


@Component({
  selector: 'app-tr-trainee-dialog',
  templateUrl: './tr-trainee-dialog.component.html',
  styleUrls: ['./tr-trainee-dialog.component.css']
})
export class TrTraineeDialogComponent implements OnInit {
  transactionUserId = localStorage.getItem('transactionUserId')

  formcontrol = new FormControl('');
  TrTraineeForm !: FormGroup;
  actionBtn: string = "حفظ";
  getTrInstructorData: any;

  employeeCtrl: FormControl;
  filteredEmployee: Observable<Employee[]>;
  employeesList: Employee[] = [];
  selectedEmployee: Employee | undefined;

  trCoporteClientCtrl: FormControl;
  filteredtrCoporteClient: Observable<TrCoporteClient[]>;
  trCoporteClientsList: TrCoporteClient[] = [];
  selectedTrCoporteClient: TrCoporteClient | undefined;
  isReadOnlyPercentage = true;


  constructor(private formBuilder: FormBuilder,
    private api: ApiService,
    private hotkeysService: HotkeysService,
    private readonly route: ActivatedRoute,
    private toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public editData: any,
    private dialogRef: MatDialogRef<TrTraineeDialogComponent>) {

    this.employeeCtrl = new FormControl();
    this.filteredEmployee = this.employeeCtrl.valueChanges.pipe(
      startWith(''),
      map(value => this._filterEmployee(value))
    );

    this.trCoporteClientCtrl = new FormControl();
    this.filteredtrCoporteClient = this.trCoporteClientCtrl.valueChanges.pipe(
      startWith(''),
      map(value => this._filterTrCoporteClient(value))
    );

  }
  ngOnInit(): void {
    this.TrTraineeForm = this.formBuilder.group({
      transactionUserId: ['', Validators.required],
      employeeId: ['', Validators.required],
      corporationCLinetId: ['', Validators.required]
    });

    this.api.getHrEmployees().subscribe((employee) => {
      this.employeesList = employee;
    });

    this.api.getTrCoporteClient().subscribe((trCoporteClient) => {
      this.trCoporteClientsList = trCoporteClient;
    });


    this.hotkeysService.add(new Hotkey('ctrl+s', (event: KeyboardEvent): boolean => {
      // Call the deleteGrade() function in the current component
      this.addTrTrainee();
      return false; // Prevent the default browser behavior
    }));
    if (this.editData) {
      console.log("edit data: ", this.editData)
      this.actionBtn = "تعديل";
      this.getTrInstructorData = this.editData;
      this.TrTraineeForm.controls['transactionUserId'].setValue(this.transactionUserId);
      this.TrTraineeForm.controls['employeeId'].setValue(this.editData.employeeId);
      this.TrTraineeForm.controls['corporationCLinetId'].setValue(this.editData.corporationCLinetId);

      this.TrTraineeForm.addControl('id', new FormControl('', Validators.required));
      this.TrTraineeForm.controls['id'].setValue(this.editData.id);
    }
  }

  addTrTrainee() {
    this.TrTraineeForm.controls['transactionUserId'].setValue(this.transactionUserId);
    console.log("TrTraineeForm value :", this.TrTraineeForm.value);


    if (!this.editData) {
      this.TrTraineeForm.removeControl('id')
      if (this.TrTraineeForm.valid) {
        this.api.postTrTrainee(this.TrTraineeForm.value)
          .subscribe({
            next: (res) => {
              this.toastrSuccess();
              this.TrTraineeForm.reset();
              this.dialogRef.close('save');
            },
            error: (err) => {
              // alert("خطأ عند اضافة البيانات")
              console.log(err)
            }
          })
      }
    }
    else {
      this.updateTrTrainee()
    }
  }
  updateTrTrainee() {
    this.api.putTrTrainee(this.TrTraineeForm.value)
      .subscribe({
        next: (res) => {
          this.toastrEditSuccess();
          this.TrTraineeForm.reset();
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
    this.TrTraineeForm.patchValue({ employeeId: employee.id });
  }

  private _filterEmployee(value: string): Employee[] {
    const filterValue = value;
    return this.employeesList.filter(employee =>
      employee.name.toLowerCase().includes(filterValue)
    );
  }

  openAutoemployee() {
    this.employeeCtrl.setValue(''); // Clear the input field value

    // Open the autocomplete dropdown by triggering the value change event
    this.employeeCtrl.updateValueAndValidity();
  }


  displayTrCoporteClientName(trCoporteClient: any): string {
    return trCoporteClient && trCoporteClient.name ? trCoporteClient.name : '';
  }

  TrCoporteClientSelected(event: MatAutocompleteSelectedEvent): void {
    const trCoporteClient = event.option.value as TrCoporteClient;
    this.selectedTrCoporteClient = trCoporteClient;
    this.TrTraineeForm.patchValue({ corporationCLinetId: trCoporteClient.id });
  }

  private _filterTrCoporteClient(value: string): TrCoporteClient[] {
    const filterValue = value;
    return this.trCoporteClientsList.filter(trCoporteClient =>
      trCoporteClient.name.toLowerCase().includes(filterValue)
    );
  }

  openAutoTrCoporteClient() {
    this.trCoporteClientCtrl.setValue(''); // Clear the input field value

    // Open the autocomplete dropdown by triggering the value change event
    this.trCoporteClientCtrl.updateValueAndValidity();
  }


  set_Percentage(state: any) {

    console.log("state value changed: ", state.value);
    // this.TrTraineeForm.controls['state'].setValue(state.value);

    if (state.value == "موظف") {
      this.employeeCtrl.enable();
      // this.isReadOnlyPercentage = false;
    }
    else {
      this.isReadOnlyPercentage = true;
      // this.TrTraineeForm.controls['percentage'].setValue(100);
      this.employeeCtrl.disable();
      this.TrTraineeForm.controls['employeeId'].enable();
      this.TrTraineeForm.controls['employeeId'].setValue(0);

    }

  }


  toastrSuccess(): void {
    this.toastr.success('تم الحفظ بنجاح');
  }

  toastrEditSuccess(): void {
    this.toastr.success('تم التعديل بنجاح');
  }
}
