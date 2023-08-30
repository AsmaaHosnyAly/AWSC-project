import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService } from '../services/api.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-hr-disciplinary-dialog',
  templateUrl: './hr-disciplinary-dialog.component.html',
  styleUrls: ['./hr-disciplinary-dialog.component.css']
})
export class HrDisciplinaryDialogComponent implements OnInit{
  groupForm !: FormGroup;
  actionBtn: string = "Save";
  employeesList: any;
  fiscalYearsList: any;
  userIdFromStorage: any;

  constructor(private formBuilder: FormBuilder,
    private api: ApiService,
    @Inject(MAT_DIALOG_DATA) public editData: any,
    private dialogRef: MatDialogRef<HrDisciplinaryDialogComponent>,
    private toastr: ToastrService) { }

  ngOnInit(): void {
    
    this.groupForm = this.formBuilder.group({
      name: ['', Validators.required],
 

      transactionUserId: ['', Validators.required],
    });

    if (this.editData) {
      this.actionBtn = "Update";
      this.groupForm.controls['name'].setValue(this.editData.name);
  

      this.userIdFromStorage = localStorage.getItem('transactionUserId');

      this.groupForm.controls['transactionUserId'].setValue(this.userIdFromStorage);

      this.groupForm.addControl('id', new FormControl('', Validators.required));
      this.groupForm.controls['id'].setValue(this.editData.id);

    }
  }


  addDisciplinary() {
    if (!this.editData) {
      this.groupForm.removeControl('id')

        this.userIdFromStorage = localStorage.getItem('transactionUserId');
        this.groupForm.controls['transactionUserId'].setValue(this.userIdFromStorage);
       
        if (this.groupForm.valid) {
          this.api.postHrDisciplinary(this.groupForm.value)
            .subscribe({
              next: (res) => {
                console.log("add HiringType res: ", res);

                this.toastrSuccess();
                this.groupForm.reset();
                this.dialogRef.close('save');
              },
              error: (err) => {
                alert("حدث خطأ أثناء إضافة نوع التعيين");
                console.log("post HiringType with api err: ", err)
              }
            })
        }

    }
    else {
      this.updateDisciplinary()
    }
  }

  updateDisciplinary() {
    console.log("update Disciplinary last values, id: ", this.groupForm.value)
    this.api.putHrDisciplinary(this.groupForm.value)
      .subscribe({
        next: (res) => {
          alert("تم تحديث انواع التعيين بنجاح");
          this.toastrSuccess();
          this.groupForm.reset();
          this.dialogRef.close('update');
        },
        error: () => {
          alert("خطأ أثناء تحديث سجل انواع التعيين !!")
        }
      })
  }

  toastrSuccess(): void {
    this.toastr.success("تم الحفظ بنجاح");
  }
}
