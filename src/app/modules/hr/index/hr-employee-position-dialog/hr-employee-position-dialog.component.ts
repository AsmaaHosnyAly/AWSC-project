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
  selector: 'app-hr-employee-position-dialog',
  templateUrl: './hr-employee-position-dialog.component.html',
  styleUrls: ['./hr-employee-position-dialog.component.css']
})
export class HrEmployeePositionDialogComponent implements OnInit {
  formcontrol = new FormControl('');
  HrEmployeePosition !: FormGroup;
  actionBtn: string = "حفظ";

  hrEmployeesList: any;
  hrPositionsList: any;
  hrWorkPlacesList: any;

  constructor(private formBuilder: FormBuilder,
    private api: ApiService,
    private hotkeysService: HotkeysService,
    private readonly route: ActivatedRoute,
    private toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public editData: any,
    private dialogRef: MatDialogRef<HrEmployeePositionDialogComponent>) {
  }
  ngOnInit(): void {
    this.getHrEmployees();
    this.getHrPositions();
    this.getHrWorkPlaces();

    this.HrEmployeePosition = this.formBuilder.group({
      transactionUserId: ['', Validators.required],
      date: ['', Validators.required],
      employeeId: ['', Validators.required],
      positionId: ['', Validators.required],
      workPlaceId: ['', Validators.required],
      // id: ['', Validators.required],
    });
    this.hotkeysService.add(new Hotkey('ctrl+s', (event: KeyboardEvent): boolean => {
      // Call the deleteGrade() function in the current component
      this.addHrEmployeePosition();
      return false; // Prevent the default browser behavior
    }));
    if (this.editData) {
      console.log("edit data: ", this.editData)
      this.actionBtn = "تعديل";
      this.HrEmployeePosition.controls['transactionUserId'].setValue(this.editData.transactionUserId);
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
    this.HrEmployeePosition.controls['transactionUserId'].setValue(localStorage.getItem('transactionUserId'));

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

  getHrEmployees() {
    this.api.getHrEmployees()
      .subscribe({
        next: (res) => {
          this.hrEmployeesList = res;
        },
        error: (err) => {
          // this.toastrWarning();
          // alert("خطأ عند استدعاء البيانات");
        }

      })
  }

  getHrPositions() {
    this.api.getHrPosition()
      .subscribe({
        next: (res) => {
          this.hrPositionsList = res;
        },
        error: (err) => {
          // this.toastrWarning();
          // alert("خطأ عند استدعاء البيانات");
        }

      })
  }

  getHrWorkPlaces() {
    this.api.getHrWorkPlace()
      .subscribe({
        next: (res) => {
          this.hrWorkPlacesList = res;
        },
        error: (err) => {
          // this.toastrWarning();
          // alert("خطأ عند استدعاء البيانات");
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
