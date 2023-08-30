


import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService } from '../services/api.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-hr-employee-disciplinary-dialog',
  templateUrl: './hr-employee-disciplinary-dialog.component.html',
  styleUrls: ['./hr-employee-disciplinary-dialog.component.css']
})
export class HrEmployeeDisciplinaryDialogComponent  implements OnInit{
  groupForm !: FormGroup;
  actionBtn: string = "Save";
  disciplinaryList:any;
  disciplinaryName:any;
   employeeList: any;
  employeeName: any;
  fiscalYearsList: any;
  userIdFromStorage: any;

  constructor(private formBuilder: FormBuilder,
    private api: ApiService,
    @Inject(MAT_DIALOG_DATA) public editData: any,
    private dialogRef: MatDialogRef<HrEmployeeDisciplinaryDialogComponent>,
    private toastr: ToastrService) { }

  ngOnInit(): void {
    this.getEmployees();
this.getdisciplinary();

    this.groupForm = this.formBuilder.group({
      no: [, Validators.required],
      noDays: [, Validators.required],
      description: ['', Validators.required],
      employeeId: [, Validators.required],
      employeeName: [''],
      disciplinaryName:[],
      disciplinaryId: [, Validators.required],
      date: ['2023-08-28T08:58:27.049Z', Validators.required],

     transactionUserId: ['', Validators.required],
    });

    if (this.editData) {
      this.actionBtn = "Update";
      this.groupForm.controls['no'].setValue(this.editData.no);
      this.groupForm.controls['noDays'].setValue(this.editData.noDays);

      this.groupForm.controls['description'].setValue(this.editData.description);
      this.groupForm.controls['employeeId'].setValue(this.editData.employeeId);
      this.groupForm.controls['employeeName'].setValue(this.editData.employeeName);
      this.groupForm.controls['disciplinaryName'].setValue(this.editData.disciplinaryName);

      this.groupForm.controls['disciplinaryId'].setValue(this.editData.disciplinaryId);
      this.groupForm.controls['date'].setValue(this.editData.date);

      this.userIdFromStorage = localStorage.getItem('transactionUserId');

      this.groupForm.controls['transactionUserId'].setValue(this.userIdFromStorage);

      this.groupForm.addControl('id', new FormControl('', Validators.required));
      this.groupForm.controls['id'].setValue(this.editData.id);

    }
  }


  async addEmployeeDisciplinary() {
    if (!this.editData) {
      this.groupForm.removeControl('id')

        this.userIdFromStorage = localStorage.getItem('transactionUserId');
        this.groupForm.controls['transactionUserId'].setValue(this.userIdFromStorage);
        this.employeeName = await this.getemployeeByID(this.groupForm.getRawValue().employeeId);
        this.disciplinaryName = await this.getdisciplinaryByID(this.groupForm.getRawValue().disciplinaryId);

    
        this.groupForm.controls['disciplinaryName'].setValue(this.disciplinaryName);
    this.groupForm.controls['employeeName'].setValue(this.employeeName);

       console.log('form',this.groupForm.value)
        if (this.groupForm.getRawValue().employeeId && this.groupForm.getRawValue().disciplinaryId) {
          this.api.postHrEmployeeDisciplinary(this.groupForm.value)
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

  async updateDisciplinary() {
    console.log("update Disciplinary last values, id: ", this.groupForm.value)
    this.employeeName = await this.getemployeeByID(this.groupForm.getRawValue().employeeId);
    this.groupForm.controls['employeeName'].setValue(this.employeeName);
    this.disciplinaryName = await this.getdisciplinaryByID(this.groupForm.getRawValue().disciplinaryId);
    this.groupForm.controls['disciplinaryName'].setValue(this.disciplinaryName);
    this.api.putHrEmployeeDisciplinary(this.groupForm.value)
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
  getEmployees() {
    this.api.getEmployee()
      .subscribe({
        next: (res) => {
          this.employeeList = res;
          // console.log("store res: ", this.storeList);
        },
        error: (err) => {
          // console.log("fetch store data err: ", err);
          // alert("خطا اثناء جلب المخازن !");
        }
      })
  }
  getdisciplinary() {
    this.api.getHrDisciplinary()
      .subscribe({
        next: (res) => {
          this.disciplinaryList = res;
          // console.log("store res: ", this.storeList);
        },
        error: (err) => {
          // console.log("fetch store data err: ", err);
          // alert("خطا اثناء جلب المخازن !");
        }
      })
  }
  getemployeeByID(id: any) {
    console.log("row employee id: ", id);
    return fetch(`http://ims.aswan.gov.eg/api/HREmployee/get/${id}`)
      .then(response => response.json())
      .then(json => {
        // console.log("fetch name by id res: ", json.name);
        return json.name;
      })
      .catch((err) => {
        // console.log("error in fetch name by id: ", err);
        // alert("خطا اثناء جلب رقم المخزن !");
      });
  }
  getdisciplinaryByID(id: any) {
    console.log("DISPLINARY id: ", id);
    return fetch(`http://ims.aswan.gov.eg/api/HrEmployeeDisciplinary/get-EmployeeDisciplinary-by-id/${id}`)
      .then(response => response.json())
      .then(json => {
        // console.log("fetch name by id res: ", json.name);
        return json.name;
      })
      .catch((err) => {
        // console.log("error in fetch name by id: ", err);
        // alert("خطا اثناء جلب رقم المخزن !");
      });
  }
  toastrSuccess(): void {
    this.toastr.success("تم الحفظ بنجاح");
  }
}

