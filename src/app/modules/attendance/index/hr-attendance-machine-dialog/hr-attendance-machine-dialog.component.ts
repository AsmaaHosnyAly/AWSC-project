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

@Component({
  selector: 'app-hr-attendance-machine-dialog',
  templateUrl: './hr-attendance-machine-dialog.component.html',
  styleUrls: ['./hr-attendance-machine-dialog.component.css']
})
export class HrAttendanceMachineDialogComponent implements OnInit {
  formcontrol = new FormControl('');
  transactionUserId=localStorage.getItem('transactionUserId')
  HrAttendanceMachineForm !: FormGroup;
  actionBtn: string = "حفظ";

  // groupEditId: any;

  constructor(private formBuilder: FormBuilder,
    private api: ApiService,
    private hotkeysService: HotkeysService,
    private readonly route: ActivatedRoute,
    private toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public editData: any,
    private dialogRef: MatDialogRef<HrAttendanceMachineDialogComponent>) {
  }

  ngOnInit(): void {

    this.HrAttendanceMachineForm = this.formBuilder.group({
      transactionUserId: ['', Validators.required],
      name: ['', Validators.required],
      serial: ['', Validators.required],
    });

    this.hotkeysService.add(new Hotkey('ctrl+s', (event: KeyboardEvent): boolean => {
      // Call the deleteGrade() function in the current component
      this.addHrAttendanceMachine();
      return false; // Prevent the default browser behavior
    }));

    if (this.editData) {
      console.log("edit data: ", this.editData)
      this.actionBtn = "تعديل";
      this.HrAttendanceMachineForm.controls['transactionUserId'].setValue(this.editData.transactionUserId);
      this.HrAttendanceMachineForm.controls['name'].setValue(this.editData.name);
      this.HrAttendanceMachineForm.controls['serial'].setValue(this.editData.serial);

      this.HrAttendanceMachineForm.addControl('id', new FormControl('', Validators.required));
      this.HrAttendanceMachineForm.controls['id'].setValue(this.editData.id);
    }

  }

  addHrAttendanceMachine() {
    this.HrAttendanceMachineForm.controls['transactionUserId'].setValue(localStorage.getItem('transactionUserId'));
    console.log("add form: ", this.HrAttendanceMachineForm.value);

    if (!this.editData) {
      this.HrAttendanceMachineForm.removeControl('id')
      if (this.HrAttendanceMachineForm.valid) {
        this.api.postHrAttendanceMachine(this.HrAttendanceMachineForm.value)
          .subscribe({
            next: (res) => {
              // alert("تمت الاضافة بنجاح");
              this.toastrSuccess();
              this.HrAttendanceMachineForm.reset();
              this.dialogRef.close('save');
            },
            error: (err) => {
              alert("خطأ عند اضافة البيانات")
              console.log(err)
            }
          })
      }
    } else {
      this.updateHrAttendanceMachine()
    }
  }

  updateHrAttendanceMachine() {
    this.api.putHrAttendanceMachine(this.HrAttendanceMachineForm.value)
      .subscribe({
        next: (res) => {
          // alert("تم التحديث بنجاح");
          this.toastrEditSuccess();
          this.HrAttendanceMachineForm.reset();
          this.dialogRef.close('update');
        },
        error: () => {
          alert("خطأ عند تحديث البيانات");
        }
      })
  }

  toastrSuccess(): void {
    this.toastr.success('تم الحفظ بنجاح');
  }

  toastrEditSuccess(): void {
    this.toastr.success('تم التعديل بنجاح');
  }
}
