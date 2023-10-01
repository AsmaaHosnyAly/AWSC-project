import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService } from '../../services/api.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-hr-hiring-type-dialog',
  templateUrl: './hr-hiring-type-dialog.component.html',
  styleUrls: ['./hr-hiring-type-dialog.component.css']
})
export class HrHiringTypeDialogComponent implements OnInit{
  groupForm !: FormGroup;
  actionBtn : string = "حفظ";
  employeesList: any;
  fiscalYearsList: any;
  userIdFromStorage: any;

  constructor(private formBuilder: FormBuilder,
    private api: ApiService,
    @Inject(MAT_DIALOG_DATA) public editData: any,
    private dialogRef: MatDialogRef<HrHiringTypeDialogComponent>,
    private toastr: ToastrService) { }

  ngOnInit(): void {
    
    this.groupForm = this.formBuilder.group({
      name: ['', Validators.required],
      transactionUserId: ['', Validators.required],
    });

    if (this.editData) {
      this.actionBtn = "تعديل";
      this.groupForm.controls['name'].setValue(this.editData.name);
      this.userIdFromStorage = localStorage.getItem('transactionUserId');

      this.groupForm.controls['transactionUserId'].setValue(this.userIdFromStorage);

      this.groupForm.addControl('id', new FormControl('', Validators.required));
      this.groupForm.controls['id'].setValue(this.editData.id);

    }
  }


   addHiringType() {
    if (!this.editData) {
      this.groupForm.removeControl('id')

        this.userIdFromStorage = localStorage.getItem('transactionUserId');
        this.groupForm.controls['transactionUserId'].setValue(this.userIdFromStorage);
       
        if (this.groupForm.valid) {
          this.api.postHrHiringType(this.groupForm.value)
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
      this.updateHiringType()
    }
  }

  updateHiringType() {
    console.log("update HiringType last values, id: ", this.groupForm.value)
    this.api.putHrHiringType(this.groupForm.value)
      .subscribe({
        next: (res) => {         
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
