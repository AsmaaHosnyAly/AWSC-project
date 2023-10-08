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
  selector: 'app-hr-attendance-machine-work-place-dialog',
  templateUrl: './hr-attendance-machine-work-place-dialog.component.html',
  styleUrls: ['./hr-attendance-machine-work-place-dialog.component.css']
})
export class HrAttendanceMachineWorkPlaceDialogComponent implements OnInit {

  formcontrol = new FormControl('');
  HrAttendanceMachineWorkPlaceForm !: FormGroup;
  actionBtn: string = "حفظ";
  attendMachinesList: any;
  workPlacesList: any;

  // groupEditId: any;

  constructor(private formBuilder: FormBuilder,
    private api: ApiService,
    private hotkeysService: HotkeysService,
    private readonly route: ActivatedRoute,
    private toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public editData: any,
    private dialogRef: MatDialogRef<HrAttendanceMachineWorkPlaceDialogComponent>) {
  }

  ngOnInit(): void {
    this.getAttendMachines();
    this.getWorkPlaces();

    this.HrAttendanceMachineWorkPlaceForm = this.formBuilder.group({
      transactionUserId: ['', Validators.required],
      name: ['', Validators.required],
      date: ['', Validators.required],
      attendanceMachineId: ['', Validators.required],
      workPlaceId: ['', Validators.required],
    });

    this.hotkeysService.add(new Hotkey('ctrl+s', (event: KeyboardEvent): boolean => {
      // Call the deleteGrade() function in the current component
      this.addHrAttendanceMachineWorkPlace();
      return false; // Prevent the default browser behavior
    }));

    if (this.editData) {
      console.log("edit data: ", this.editData)
      this.actionBtn = "تعديل";
      this.HrAttendanceMachineWorkPlaceForm.controls['transactionUserId'].setValue(this.editData.transactionUserId);
      this.HrAttendanceMachineWorkPlaceForm.controls['name'].setValue(this.editData.name);
      this.HrAttendanceMachineWorkPlaceForm.controls['date'].setValue(this.editData.date);
      this.HrAttendanceMachineWorkPlaceForm.controls['attendanceMachineId'].setValue(this.editData.attendanceMachineId);
      this.HrAttendanceMachineWorkPlaceForm.controls['workPlaceId'].setValue(this.editData.workPlaceId);

      this.HrAttendanceMachineWorkPlaceForm.addControl('id', new FormControl('', Validators.required));
      this.HrAttendanceMachineWorkPlaceForm.controls['id'].setValue(this.editData.id);
    }

  }

  addHrAttendanceMachineWorkPlace() {
    this.HrAttendanceMachineWorkPlaceForm.controls['transactionUserId'].setValue(localStorage.getItem('transactionUserId'));
    console.log("add form: ", this.HrAttendanceMachineWorkPlaceForm.value);

    if (!this.editData) {
      this.HrAttendanceMachineWorkPlaceForm.removeControl('id')
      if (this.HrAttendanceMachineWorkPlaceForm.valid) {
        this.api.postHrAttendanceMachineWorkPlace(this.HrAttendanceMachineWorkPlaceForm.value)
          .subscribe({
            next: (res) => {
              // alert("تمت الاضافة بنجاح");
              this.toastrSuccess();
              this.HrAttendanceMachineWorkPlaceForm.reset();
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
    this.api.putHrAttendanceMachineWorkPlace(this.HrAttendanceMachineWorkPlaceForm.value)
      .subscribe({
        next: (res) => {
          // alert("تم التحديث بنجاح");
          this.toastrEditSuccess();
          this.HrAttendanceMachineWorkPlaceForm.reset();
          this.dialogRef.close('update');
        },
        error: () => {
          alert("خطأ عند تحديث البيانات");
        }
      })
  }

  getAttendMachines() {
    this.api.getHrAttendanceMachine()
      .subscribe({
        next: (res) => {
          this.attendMachinesList = res;
          // console.log("store res: ", this.storeList);
        },
        error: (err) => {
          // console.log("fetch store data err: ", err);
          // alert("خطا اثناء جلب المخازن !");
        }
      })
  }

  getWorkPlaces() {
    this.api.getHrWorkPlace()
      .subscribe({
        next: (res) => {
          this.workPlacesList = res;
          // console.log("store res: ", this.storeList);
        },
        error: (err) => {
          // console.log("fetch store data err: ", err);
          // alert("خطا اثناء جلب المخازن !");
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
